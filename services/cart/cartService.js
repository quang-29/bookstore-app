import { Alert } from "react-native";
import instance from "../../axios-instance";

export const addBookToCart = async (cartId, bookId, quantity) => {
    try {
        const response = await instance.post(
            `/api/cart/addBookToCart`,
            { cartId, bookId, quantity }
        );

        if (response.status === 200 || response.status === 201) {
            const cartData = response.data.data;
            Alert.alert("Thành công", "Thêm sách vào giỏ hàng thành công!");
            return cartData;
        } else {
            console.error("Lỗi không xác định:", response.status);
            return null;
        }
    } catch (error) {
        const message = error?.response?.data?.message;

        if (message === "Book quantity is less than requested quantity") {
            Alert.alert("Không đủ hàng", "Số lượng sách trong kho không đủ để thêm vào giỏ hàng.");
        } else {
            Alert.alert("Lỗi", message || "Đã xảy ra lỗi khi thêm vào giỏ hàng.");
        }
        return null;
    }
};



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

export const increaseBookFromCart = async (cartId, bookId, quantity) => {
    try {
        const response = await instance.post(
            `/api/cart/addBookToCart`,
            { cartId, bookId, quantity }
        );

        if (response.status === 200 || response.status === 201) {
            const cartData = response.data.data;
            Alert.alert("Thành công", "Thêm sách vào giỏ hàng thành công!");
            return cartData;
        } else {
            console.error("Lỗi không xác định:", response.status);
            return null;
        }
    } catch (error) {
        const message = error?.response?.data?.message;

        if (message === "Book quantity is less than requested quantity") {
            Alert.alert("Không đủ hàng", "Số lượng sách trong kho không đủ đã đạt đến giới hạn.");
        } else {
            Alert.alert("Lỗi", message || "Đã xảy ra lỗi khi thêm vào giỏ hàng.");
        }
        return null;
    }
}