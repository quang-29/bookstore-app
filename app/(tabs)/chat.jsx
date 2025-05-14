import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  View,
  Platform,
  StyleSheet,
  Animated,
  Text,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { IP_CONFIG } from '../../config/ipconfig';
import Markdown from 'react-native-markdown-display';

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const animateDot = (dot, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, {
          toValue: -5,
          duration: 300,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, []);

  return (
    <View style={styles.typingContainer}>
      <Text style={{ color: '#888', marginRight: 5 }}>Đang trả lời</Text>
      <Animated.Text style={[styles.dot, { transform: [{ translateY: dot1 }] }]}>.</Animated.Text>
      <Animated.Text style={[styles.dot, { transform: [{ translateY: dot2 }] }]}>.</Animated.Text>
      <Animated.Text style={[styles.dot, { transform: [{ translateY: dot3 }] }]}>.</Animated.Text>
    </View>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const loadingMessageId = 'loading-message-id';

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Xin chào! Tôi có thể giúp gì được cho bạn?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'BookBot',
        },
      },
    ]);
  }, []);

  const onSend = useCallback(async (newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    const userMessage = newMessages[0].text;

    const loadingMsg = {
      _id: loadingMessageId,
      text: '',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'BookBot',
      },
    };

    setMessages(previousMessages => GiftedChat.append(previousMessages, [loadingMsg]));

    try {
      const response = await axios.post(`http://${IP_CONFIG}:8080/api/chat`, {
        message: userMessage,
      });

      setMessages(previousMessages =>
        previousMessages.filter(msg => msg._id !== loadingMessageId)
      );

      const botReply = {
        _id: Math.random().toString(),
        text: response.data.reply || 'Xin lỗi, tôi chưa hiểu rõ câu hỏi.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'BookBot',
        },
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, [botReply]));
    } catch (error) {
      setMessages(previousMessages =>
        previousMessages.filter(msg => msg._id !== loadingMessageId)
      );

      const errorReply = {
        _id: Math.random().toString(),
        text: 'Lỗi khi gọi trợ lý AI.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'BookBot',
        },
      };

      setMessages(previousMessages => GiftedChat.append(previousMessages, [errorReply]));
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: 1 }}
          placeholder="Nhập câu hỏi của bạn..."
          alwaysShowSend
          showUserAvatar
          renderUsernameOnMessage

          renderCustomView={(props) => {
            if (props.currentMessage._id === loadingMessageId) {
              return <TypingIndicator />;
            }
            return null;
          }}

          renderMessageText={(props) => {
            const { currentMessage } = props;
            return (
              <View style={{ padding: 2 }}>
                <Markdown
                  style={{
                    body: {
                      color: currentMessage.user._id === 2 ? '#333' : '#000',
                      backgroundColor: 'transparent',
                      fontSize: 14,
                      lineHeight: 20,
                    },
                    strong: { fontWeight: 'bold' },
                    code_block: {
                      backgroundColor: '#eee',
                      fontFamily: 'monospace',
                      padding: 8,
                      borderRadius: 6,
                    },
                    bullet_list: { paddingLeft: 12 },
                  }}
                >
                  {currentMessage.text}
                </Markdown>
              </View>
            );
          }}

          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{
                left: {
                  backgroundColor: '#f0f0f5',
                  borderRadius: 12,
                  padding: 5,
                  marginBottom: 2,
                },
                right: {
                  backgroundColor: '#B0D9F6',
                  borderRadius: 12,
                  padding: 5,
                  marginBottom: 2,
                },
              }}
              textStyle={{
                left: {
                  color: '#333',
                  fontSize: 14,
                },
                right: {
                  color: '#000',
                  fontSize: 14,
                },
              }}
            />
          )}

          renderInputToolbar={(props) => (
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: '#fff',
                borderTopColor: '#e0e0e0',
                borderTopWidth: 1,
                padding: 8,
              }}
              primaryStyle={{ alignItems: 'center' }}
            />
          )}

          renderSend={(props) => {
            const isDisabled = props.text.trim().length === 0;
            return (
              <Send
                {...props}
                disabled={isDisabled}
                containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
              >
                <View
                  style={[
                    styles.sendButton,
                    isDisabled && styles.sendButtonDisabled,
                  ]}
                >
                  <Ionicons
                    name="send"
                    size={20}
                    color={isDisabled ? '#ccc' : '#007AFF'}
                  />
                </View>
              </Send>
            );
          }}

          timeTextStyle={{
            left: {
              color: '#666',
              fontSize: 11,
            },
            right: {
              color: '#444',
              fontSize: 11,
            },
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 8,
    marginTop: 5,
  },
  dot: {
    fontSize: 30,
    lineHeight: 35,
    color: '#555',
    marginHorizontal: 1,
  },
  sendButton: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#f0f0f0',
    shadowOpacity: 0,
  },
});

export default Chat;

