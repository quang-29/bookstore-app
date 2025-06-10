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
  const [refreshing, setRefreshing] = useState(false);

  const stompClient = useRef(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRoomsAndMessages();
    setRefreshing(false);
  };

  const fetchRoomsAndMessages = async () => {
    try {
      const response = await instance.get('/api/rooms/getAllRooms');
      let roomList = response.data.filter(room => room.userName.toLowerCase() !== 'admin');
      const lastMsgs = {};

      await Promise.all(
        roomList.map(async (room) => {
          try {
            const res = await instance.get(`/api/messages/getRecentMessage/${room.roomId}`);
            lastMsgs[room.roomId] = res.data;
          } catch {
            lastMsgs[room.roomId] = null;
          }
        })
      );
      roomList.sort((a, b) => {
        const aTime = lastMsgs[a.roomId]?.sentAt ? new Date(lastMsgs[a.roomId].sentAt).getTime() : 0;
        const bTime = lastMsgs[b.roomId]?.sentAt ? new Date(lastMsgs[b.roomId].sentAt).getTime() : 0;
        return bTime - aTime;
      });

      setRooms(roomList);
      setLastMessages(lastMsgs);

    } catch (error) {
      console.error('Lỗi khi lấy danh sách phòng:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS(`http://${IP_CONFIG}:8080/ws`);
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: () => {},
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.current.subscribe('/topic/public', async (message) => {
          const msg = JSON.parse(message.body);
          const { roomId } = msg;

          const roomExists = rooms.find(r => r.roomId === roomId);

          if (roomExists) {
            try {
              const res = await instance.get(`/api/messages/getRecentMessage/${roomId}`);
              setLastMessages((prev) => {
                const updatedMessages = {
                  ...prev,
                  [roomId]: res.data,
                };
                const sortedRooms = [...rooms].sort((a, b) => {
                  const aTime = updatedMessages[a.roomId]?.sentAt ? new Date(updatedMessages[a.roomId].sentAt).getTime() : 0;
                  const bTime = updatedMessages[b.roomId]?.sentAt ? new Date(updatedMessages[b.roomId].sentAt).getTime() : 0;
                  return bTime - aTime;
                });

                setRooms(sortedRooms);
                return updatedMessages;
              });
            } catch (err) {
              console.error(`Lỗi cập nhật phòng ${roomId}:`, err);
            }
          }
 else {
            try {
              const res = await instance.get('/api/rooms/getAllRooms');
              const updatedRooms = res.data.filter(room => room.userName.toLowerCase() !== 'admin');

              const lastMsgs = {};
              await Promise.all(
                updatedRooms.map(async (room) => {
                  try {
                    const msgRes = await instance.get(`/api/messages/getRecentMessage/${room.roomId}`);
                    lastMsgs[room.roomId] = msgRes.data;
                  } catch {
                    lastMsgs[room.roomId] = null;
                  }
                })
              );

              setRooms(updatedRooms);
              setLastMessages(lastMsgs);
            } catch (error) {
              console.error('❌ Lỗi cập nhật danh sách phòng mới:', error);
            }
          }
        });
      },
    });

    stompClient.current.activate();
  };

  useEffect(() => {
    fetchRoomsAndMessages();
    connectWebSocket();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

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
          source={{
            uri: item.userAvatar || 'https://res.cloudinary.com/daxt0vwoc/image/upload/v1740297885/User-avatar.svg_nihuye.png',
          }}
          style={styles.avatar}
          resizeMode="cover"
        />

        <View style={styles.info}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessages[item.roomId]?.content || ''}
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
          refreshing={refreshing}
          onRefresh={onRefresh}
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
