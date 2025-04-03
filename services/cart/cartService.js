import { Alert } from "react-native";
import { IP_CONFIG } from "../../config/ipconfig";

export const addBookToCart = async (cartId,bookId,quantity,token) => {
    try {
        const response = await fetch(
          `http://${IP_CONFIG}:8080/api/cart/addBookToCart?cartId=${cartId}&bookId=${bookId}&quantity=${quantity}`,
          {
            method: "PUT",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify({}), 
          }
        );
      
        if (response.ok) {
          Alert.alert("Thành công", "Thêm sách vào giỏ hàng thành công!");
        //   const data = await response.json(); 
        //   return data.data;
        } else {
          const errorData = await response.json();
          console.error("Error adding book to cart:", response.status, errorData);
          return null;
        }
      } catch (error) {
        console.error("Error adding book to cart:", error);
        return null;
      }
}