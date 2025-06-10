import {React,useCallback} from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import FormatMoney from '@/components/FormatMoney';
import { COLORS, SIZES } from '@/constants/theme';
import instance from '@/axios-instance';
import { useRouter, useFocusEffect } from 'expo-router';
import { useOrder } from '@/context/OrderContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import { Stack } from 'expo-router';


const ManageOrder = () => {
    const { orders, fetchOrder } = useOrder(); 
    const { order } = useLocalSearchParams();
    const orderData = JSON.parse(order);
    console.log('orderData', orderData);
    const router = useRouter();

    const shippingFee = 20000;
    const totalAmount = orderData.payment.amount + shippingFee;

    useEffect(() => {
        fetchOrder();
        }, []);


    const formatToVietnamTime = (rawDate) => {
        const date = new Date(rawDate);
        return date.toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleConfirmOrder = (orderId) => {
        Alert.alert(
            'Xác nhận đơn hàng',
            'Bạn có chắc chắn muốn xác nhận đơn hàng này không?',
            [
                {
                    text: 'Huỷ',
                    style: 'cancel',
                },
                {
                    text: 'Xác nhận',
                    onPress: async () => {
                        try {
                            const response = await instance.post(`/api/order/confirmOrder/${orderId}`);
                            console.log(response.data);
                            Alert.alert('Thành công', 'Đơn hàng đã được xác nhận thành công.');
                            router.back();
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Lỗi', 'Không thể xác nhận đơn hàng. Vui lòng thử lại sau.');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleTransitOrder = (orderId) => {

        Alert.alert(
            'Xác nhận vận chuyển đơn hàng',
            'Bạn có chắc chắn muốn xác nhận vận chuyển đơn hàng này không?',
            [
                {
                    text: 'Huỷ',
                    style: 'cancel',
                },
                {
                    text: 'Xác nhận',
                    onPress: async () => {
                        try {
                            const response = await instance.post(`/api/order/transitOrder/${orderId}`);
                            console.log(response.data);
                            Alert.alert('Thành công', 'Đơn hàng đã bắt đầu vận chuyển.');
                            router.back();
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Lỗi', 'Không thể xác nhận đơn hàng. Vui lòng thử lại sau.');
                        }
                    },
                },
            ],
            { cancelable: false }
        );

    };
    const handleDeliveryOrder = (orderId) => {
        Alert.alert(
            'Xác nhận giao hàng thành công',
            'Bạn có chắc chắn đã giao đơn hàng này không?',
            [
                {
                    text: 'Huỷ',
                    style: 'cancel',
                },
                {
                    text: 'Xác nhận',
                    onPress: async () => {
                        try {
                            const response = await instance.post(`/api/order/deliveryOrder/${orderId}`);
                            console.log(response.data);
                            Alert.alert('Thành công', 'Đơn hàng đã được giao!');
                            router.back();
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Lỗi', 'Không thể xác nhận đơn hàng. Vui lòng thử lại sau.');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen
            options={{
            title: 'Chi tiết đơn hàng',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
                <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
              </Pressable>
            ),
        }}
        />
            <ScrollView style={styles.container}>
                {/* Ngày giao hàng */}
                <View style={styles.orderInfo}>
                    <Text style={styles.sectionTitle}>Ngày đảm bảo nhận hàng</Text>
                    <Text style={styles.infoText}>Đơn hàng sẽ được giao trễ nhất vào <Text style={styles.bold}>{orderData.estimatedDeliveryDate ? formatToVietnamTime(orderData.estimatedDeliveryDate) : null}</Text></Text>
                </View>

                {/* Vận chuyển */}
                <View style={styles.orderInfo}>
                    <Text style={styles.sectionTitle}>Thông tin vận chuyển</Text>
                    <Text style={styles.infoText}>Giao hàng nhanh - Express Delivery</Text>
                    <Text style={styles.status}>
                        {(() => {
                            const status = orderData.payment.status;
                            if (status === 'PENDING') {
                                return 'Đơn hàng đang được xử lý';
                            } else if (status === 'COMPLETED' || status === 'COD') {
                                return 'Đơn hàng đang được xác nhận';
                            } else if (status === 'CONFIRMED') {
                                return 'Đơn hàng đã được xác nhận';
                            } else if (status === 'IN_TRANSIT') {
                                return 'Đơn hàng đang được giao';
                            } else if (status === 'DELIVERED') {
                                return 'Đơn hàng đã được giao';
                            } else if (status === 'CANCELLED') {
                                return 'Đơn hàng đã bị huỷ';
                            } else {
                                return 'Trạng thái không xác định';
                            }
                        })()}
                    </Text>


                </View>

                {/* Địa chỉ nhận hàng */}
                <View style={styles.orderInfo}>
                    <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
                    <Text style={styles.bold}>{orderData.userAddress.receiverName + ' (' + orderData.userAddress.phoneNumber + ')'}</Text>
                    <Text style={styles.infoText}>
                        {orderData.userAddress.detail + ', ' +
                            orderData.userAddress.ward.name + ', ' +
                            orderData.userAddress.district.name + ', ' +
                            orderData.userAddress.province.name}
                    </Text>
                </View>


                {/* Danh sách sản phẩm */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Sản phẩm trong đơn hàng</Text>
                    {orderData.orderItem.map((item, index) => (
                        <View key={index} style={styles.listItem}>
                            <Image source={{ uri: item.book.imagePath }} style={styles.itemImage} />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemTitle}>{item.book.title}</Text>
                                <Text style={styles.itemQuantity}>Số lượng: {item.quantity}</Text>
                                <Text style={styles.itemPrice}>Giá: {FormatMoney(item.productPrice)}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Tổng kết thanh toán */}
                <View style={styles.orderInfo}>
                    <Text style={styles.sectionTitle}>Thanh toán</Text>
                    <View style={styles.paymentRow}>
                        <Text style={styles.totalLabel}>Tạm tính:</Text>
                        <Text style={styles.totalValue}>{FormatMoney(orderData.payment.amount - orderData.payment.feeShip)}</Text>
                    </View>
                    <View style={styles.paymentRow}>
                        <Text style={styles.totalLabel}>Phí vận chuyển:</Text>
                        <Text style={styles.totalValue}>{FormatMoney(orderData.payment.feeShip)}</Text>
                    </View>
                    <View style={[styles.paymentRow, { marginTop: 8 }]}>
                        <Text style={styles.totalLabel}>Thành tiền:</Text>
                        <Text style={styles.totalValue}>{FormatMoney(orderData.payment.amount)}</Text>
                    </View>
                </View>

                {/* Thông tin đơn hàng */}
                <View style={styles.orderInfo}>
                    <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
                    <Text style={styles.infoText}>Mã đơn hàng: <Text style={styles.bold}>{orderData.orderId}</Text></Text>
                    <Text style={styles.infoText}>
                        Phương thức thanh toán: <Text style={styles.bold}>
                            {orderData.payment.status === 'COD' ? 'Thanh toán khi nhận hàng' : 'Thanh toán bằng VNPay'}
                        </Text>
                    </Text>
                    <Text style={styles.infoText} >Thời gian đặt hàng: <Text style={styles.bold} >{formatToVietnamTime(orderData.createAt)}</Text></Text>
                </View>

                {/* Thêm padding bottom để tránh bị che bởi các nút fixed */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Hành động - Fixed ở cuối màn hình */}
            <View style={styles.footer}>
                {(() => {
                    const status = orderData.payment.status;

                    if (status === 'PENDING' || status === 'COD' || status === 'COMPLETED') {
                        return (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.contactButton]}
                                onPress={() => handleConfirmOrder(orderData.orderId)}
                            >
                                <Text style={styles.actionText}>Xác nhận đơn hàng</Text>
                            </TouchableOpacity>
                        );
                    }

                    if (status === 'CONFIRMED') {
                        return (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.contactButton]}
                                onPress={() => handleTransitOrder(orderData.orderId)}
                            >
                                <Text style={styles.actionText}>Xác nhận bắt đầu vận chuyển đơn hàng</Text>
                            </TouchableOpacity>
                        );
                    }

                    if (status === 'IN_TRANSIT') {
                        return (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.contactButton]}
                                onPress={() => handleDeliveryOrder(orderData.orderId)}
                            >
                                <Text style={styles.actionText}>Xác nhận đã giao hàng</Text>
                            </TouchableOpacity>
                        );
                    }

                    if (status === 'DELIVERED') {
                        return (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.contactButton]}
                                disabled={true} // ✅ làm nút mờ và không bấm được
                                >
                                <Text style={styles.actionText}>Đơn hàng đã được giao</Text>
                            </TouchableOpacity>
                        );
                    }

                    if (status === 'CANCELLED') {
                        return (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.contactButton]}
                                disabled={true}
                            >
                                <Text style={styles.actionText}>Đơn hàng đã bị hủy</Text>
                            </TouchableOpacity>
                        );
                    }

                    // Trạng thái không hành động
                    return null;
                })()}
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
        padding: 16,
        marginBottom: 80, // Để tránh bị che bởi footer
    },
    heading: {
        fontSize: SIZES.xLarge,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.primary,
        marginBottom: 20,
    },
    orderInfo: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        marginBottom: 12,
        color: COLORS.dark,
    },
    infoText: {
        fontSize: SIZES.small,
        color: COLORS.gray,
        marginBottom: 6,
        lineHeight: 20,
    },
    bold: {
        fontWeight: '600',
        color: COLORS.dark,
    },
    status: {
        fontWeight: 'bold',
        color: COLORS.success,
        marginTop: 6,
        fontSize: SIZES.small,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    listItem: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
        alignItems: 'center',
    },
    itemImage: {
        width: 80,
        height: 110,
        borderRadius: 8,
        backgroundColor: COLORS.lightGray2,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: SIZES.medium,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 6,
    },
    itemQuantity: {
        fontSize: SIZES.small,
        color: COLORS.gray,
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: SIZES.small,
        color: COLORS.gray,
        fontWeight: '500',
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: SIZES.medium,
        fontWeight: '500',
        color: COLORS.dark,
    },
    totalValue: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray2,
        paddingBottom: 24, // Thêm padding cho an toàn trên các thiết bị có notch
    },
    actionButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    cancelButton: {
        backgroundColor: COLORS.secondary,
    },
    contactButton: {
        backgroundColor: COLORS.primary,
    },
    actionText: {
        color: COLORS.white,
        fontSize: SIZES.medium,
        fontWeight: '600',
    },
    headerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 10,
  backgroundColor: COLORS.white,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.lightGray,
},

backButton: {
  width: 40,
  alignItems: 'flex-start',
},

headerTitleContainer: {
  flex: 1,
  alignItems: 'center',
},

headerTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: COLORS.dark,
},

rightPlaceholder: {
  width: 40, 
},
});

export default ManageOrder;