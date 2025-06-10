import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { COLORS } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { IP_CONFIG } from '@/config/ipconfig';
import { useAuth } from '@/context/AuthContext';
import instance from '@/axios-instance';

const AdminChatScreen = () => {
  const { roomId } = useLocalSearchParams();
  const stompClient = useRef(null);
  const router = useRouter();
  const { user } = useAuth();
  const ADMIN_AVATAR = user.avatarUrl;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const respose = await instance.get(`/api/messages/${roomId}`);
        const history = respose.data.map((msg) => ({
          id: msg.id.toString(),
          text: msg.content,
          sender: msg.sender,
          senderUrl: msg.senderUrl,
          createdAt: new Date(msg.sentAt),
        }));
        setMessages(history.reverse());
      } catch (error) {
        console.error('Lỗi tải lịch sử:', error);
      }
    };

    if (roomId) fetchHistory();
  }, [roomId]);

  const targetUser = messages.find((msg) => msg.sender !== 'admin');
  useEffect(() => {
    const socket = new SockJS(`http://${IP_CONFIG}:8080/ws`);
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Admin connected to WebSocket');
        stompClient.current.subscribe(`/topic/room/${roomId}`, (msg) => {
          const body = JSON.parse(msg.body);
          const newMsg = {
            id: body.id || Date.now().toString(),
            text: body.content,
            sender: body.sender,
            senderUrl: body.senderUrl || null,
            createdAt: new Date(body.sentAt),
          };
          setMessages((prev) => [newMsg, ...prev]);
        });
      },
    });

    stompClient.current.activate();
    return () => stompClient.current?.deactivate();
  }, [roomId]);

  // ✉️ Gửi tin nhắn
  const handleSend = () => {
    if (text.trim() === '') return;

    const message = {
      sender: 'admin',
      content: text,
      senderUrl: ADMIN_AVATAR,
    };

    stompClient.current.publish({
      destination: `/app/sendMessage/${roomId}`,
      body: JSON.stringify(message),
    });

    setText('');
  };

  const renderItem = ({ item }) => {
    const isAdmin = item.sender === 'admin';
    return (
      <View style={[styles.messageRow, { justifyContent: isAdmin ? 'flex-end' : 'flex-start' }]}>
        {!isAdmin && item.senderUrl && (
          <Image source={{ uri: item.senderUrl }} style={styles.avatar} />
        )}

        <View
          style={[
            styles.messageContent,
            { backgroundColor: isAdmin ? '#007aff' : '#f1f0f0' },
          ]}
        >
          <Text style={[styles.senderName, { color: isAdmin ? '#fff' : '#555' }]}>
            {item.sender}
          </Text>
          <Text style={[styles.messageText, { color: isAdmin ? '#fff' : '#000' }]}>
            {item.text}
          </Text>
          <Text style={[styles.timestamp, { color: isAdmin ? '#ddd' : '#888' }]}>
            {item.createdAt.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {isAdmin && item.senderUrl && (
          <Image source={{ uri: item.senderUrl }} style={styles.avatar} />
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          headerTitleAlign: 'center',
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {targetUser?.senderUrl && (
                <Image
                  source={{ uri: targetUser.senderUrl }}
                  style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
                />
              )}
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {targetUser?.sender || 'Người dùng'}
              </Text>
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
              <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
            </TouchableOpacity>
          ),
        }}
      />


      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AdminChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginHorizontal: 10,
    marginVertical: 6,
  },
  messageContent: {
    maxWidth: '70%',
    borderRadius: 12,
    padding: 10,
  },
  senderName: {
    fontSize: 12,
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    marginBottom: 40,
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  sendButton: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 8,
    justifyContent: 'center',
  },
});
