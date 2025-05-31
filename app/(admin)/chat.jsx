import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { IP_CONFIG } from '../../config/ipconfig';
import { router } from 'expo-router';
import instance from '@/axios-instance';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const AdminListMessageScreen = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastMessages, setLastMessages] = useState({});
  const stompClient = useRef(null);

  // Lấy danh sách phòng và tin nhắn cuối cùng
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await instance.get('/api/rooms/getAllRooms');
        const roomList = response.data;
        setRooms(roomList);

        const lastMsgs = {};
        for (const room of roomList) {
          try {
            const res = await instance.get(`/api/messages/getRecentMessage/${room.roomId}`);
            lastMsgs[room.roomId] = res.data;
          } catch (err) {
            lastMsgs[room.roomId] = null;
          }
        }
        setLastMessages(lastMsgs);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
    connectWebSocket(); // Gọi WebSocket khi load màn
  }, []);

  // Kết nối WebSocket
  const connectWebSocket = () => {
    const socket = new SockJS(`http://${IP_CONFIG}:8080/ws`);
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: () => {},
      onConnect: () => {
        stompClient.current.subscribe('/topic/public', (message) => {
          const msg = JSON.parse(message.body);
          const { roomId, sender, senderUrl } = msg;

          setRooms((prevRooms) => {
            const exists = prevRooms.find((room) => room.roomId === roomId);
            if (!exists) {
              return [
                ...prevRooms,
                {
                  roomId,
                  userName: sender,
                  userAvatar: senderUrl || 'https://default-avatar.png',
                },
              ];
            }
            return prevRooms;
          });

          setLastMessages((prev) => ({
            ...prev,
            [roomId]: msg,
          }));
        });
      },
      reconnectDelay: 5000,
    });

    stompClient.current.activate();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/chat/MessageScreen',
          params: { roomId: item.roomId },
        })
      }
    >
      <View style={styles.row}>
        <Image
          source={{ uri: item.userAvatar }}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessages[item.roomId]?.content || 'Không có tin nhắn'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat với người dùng</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : rooms.length === 0 ? (
        <Text style={styles.noRoomText}>Chưa có phòng chat nào.</Text>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.roomId}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default AdminListMessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  time: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
  noRoomText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#666',
    fontSize: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  info: {
    marginLeft: 12,
  },
  lastMessage: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    maxWidth: 220,
  },
});
