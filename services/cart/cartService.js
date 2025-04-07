import { Alert } from "react-native";
import instance from "../../axios-instance";

export const addBookToCart = async (cartId, bookId, quantity, token) => {
    try {
        const response = await instance.put(
            `/api/cart/addBookToCart?cartId=${cartId}&bookId=${bookId}&quantity=${quantity}`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );
      
        if (response.status === 200) {
            Alert.alert("Thành công", "Thêm sách vào giỏ hàng thành công!");
            return true;
        } else {
            console.error("Error adding book to cart:", response.status);
            return null;
        }
    } catch (error) {
        console.error("Error adding book to cart:", error);
        return null;
    }
}