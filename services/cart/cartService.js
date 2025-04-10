import { Alert } from "react-native";
import instance from "../../axios-instance";

export const addBookToCart = async (cartId, bookId, quantity) => {
    try {
        const response = await instance.put(
            `/api/cart/addBookToCart?cartId=${cartId}&bookId=${bookId}&quantity=${quantity}`,
            {}
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

export const removeBookFromCart = async (cartId, bookId) => {
    try {
        const response = await instance.delete(
            `/api/cart/deleteBookFromCart?cartId=${cartId}&bookId=${bookId}`
        );
        if (response.status === 200) {
            Alert.alert("Thành công", "Xóa sách khỏi giỏ hàng thành công!");
            return true;
        } else {
            console.error("Error removing book from cart:", response.status);
            return null;
        }
    } catch (error) {
        console.error("Error removing book from cart:", error);
        return null;
    }
}

export const decreaseBookFromCart = async (cartId, bookId) => {
    try {
        const response = await instance.post(
            `/api/cart/decreaseBookFromCart?cartId=${cartId}&bookId=${bookId}`,
            {}
        );
        if (response.status === 200) {
            return true;
        } else {
            console.error("Error decreasing book quantity:", response.status);
            return false;
        }
    } catch (error) {
        console.error("Error decreasing book quantity:", error);
        return false;
    }
}