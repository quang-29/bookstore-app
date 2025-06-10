import React, { useRef, useState, useEffect } from 'react';
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
import { useAuth } from '@/context/AuthContext';
import { IP_CONFIG } from '../../config/ipconfig';
import instance from '@/axios-instance';

const UserChatScreen = () => {
  const { user } = useAuth();
  const stompClient = useRef(null);
  const connected = useRef(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const roomId = user?.userId ? `room_${user.userId}` : null;

  // 🧠 Tạo phòng chat ngay khi roomId có
  useEffect(() => {
    const createRoomIfNotExists = async () => {
      try {
        await instance.post('/api/rooms', {
          roomId,
          userId: user.userId,
          userAvatar: user.avatarUrl,
          userName: user.username,
        });
        console.log('✅ Phòng chat đã được tạo.');
      } catch (error) {
        const isAlreadyExist =
          error.response?.status === 400 &&
          error.response?.data === 'Room is already existed';

        if (isAlreadyExist) {
          console.log('ℹ️ Phòng đã tồn tại.');
        } else {
          console.error('❌ Lỗi tạo phòng:', error.response?.data || error.message);
        }
      }
    };

    if (roomId) {
      createRoomIfNotExists();
    }
  }, [roomId]);

  // 🧠 Lấy lịch sử tin nhắn
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const respose = await instance.get(`/api/messages/${roomId}`);
        const historyMessages = respose.data.map((msg) => ({
          id: msg.id.toString(),
          text: msg.content,
          sender: msg.sender,
          senderUrl: msg.senderUrl,
          createdAt: new Date(msg.sentAt),
        }));
        setMessages(historyMessages.reverse());
      } catch (error) {
        console.error('❌ Lỗi tải lịch sử tin nhắn:', error);
      }
    };

    if (roomId) {
      fetchHistory();
    }
  }, [roomId]);

  // 🧠 Kết nối WebSocket
  useEffect(() => {
    const socket = new SockJS(`http://${IP_CONFIG}:8080/ws`);
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ WebSocket đã kết nối');
        connected.current = true;

        stompClient.current.subscribe(`/topic/room/${roomId}`, (msg) => {
          const body = JSON.parse(msg.body);
          const newMsg = {
            id: body.id || Date.now().toString(),
            text: body.content,
            sender: body.sender,
            senderUrl: body.senderUrl,
            createdAt: new Date(body.sentAt),
          };
          setMessages((prev) => [newMsg, ...prev]);
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP lỗi:', frame);
      },
      onWebSocketError: (event) => {
        console.error('❌ WebSocket lỗi:', event);
      },
    });

    stompClient.current.activate();

    return () => {
      if (stompClient.current && stompClient.current.active) {
        stompClient.current.deactivate();
        console.log('🔌 WebSocket đã ngắt kết nối');
      }
    };
  }, [roomId]);

  const handleSend = () => {
    if (!text.trim() || !user || !roomId) return;

    if (!stompClient.current || !stompClient.current.connected) {
      console.warn('⚠️ WebSocket chưa sẵn sàng.');
      return;
    }

    sendMessage();
  };

  const sendMessage = () => {
  const message = {
    sender: user.username,
    content: text,
    senderUrl: user.avatarUrl || 'https://res.cloudinary.com/daxt0vwoc/image/upload/v1740297885/User-avatar.svg_nihuye.png',
  };

  stompClient.current.publish({
    destination: `/app/sendMessage/${roomId}`,
    body: JSON.stringify(message),
  });

  setText('');
};


  const renderItem = ({ item }) => {
    const isUser = item.sender === user.username;

    return (
      <View
        style={[
          styles.messageRow,
          { justifyContent: isUser ? 'flex-end' : 'flex-start' },
        ]}
      >
        {!isUser && item.senderUrl && (
          <Image source={{ uri: item.senderUrl }} style={styles.avatar} />
        )}
        <View
          style={[
            styles.messageContent,
            { backgroundColor: isUser ? '#007aff' : '#f1f0f0' },
          ]}
        >
          <Text style={[styles.senderName, { color: isUser ? '#fff' : '#555' }]}>
            {item.sender}
          </Text>
          <Text style={[styles.messageText, { color: isUser ? '#fff' : '#000' }]}>
            {item.text}
          </Text>
          <Text style={[styles.timestamp, { color: isUser ? '#ddd' : '#888' }]}>
            {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {isUser && item.senderUrl && (
          <Image source={{ uri: item.senderUrl }} style={styles.avatar} />
        )}
      </View>
    );
  };

  if (!user || !roomId) {
    return (
      <View style={styles.container}>
        <Text>Đang tải thông tin người dùng...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Admin</Text>
      </View>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    padding: 16,
    backgroundColor: '#007aff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginHorizontal: 10,
    marginVertical: 6,
  },
  messageContent: {
    maxWidth: '80%',
    borderRadius: 12,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 8,
    paddingBottom: 8,
  },
  senderName: {
    fontSize: 12,
    marginBottom: 4,
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

export default UserChatScreen;
