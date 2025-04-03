import { IP_CONFIG } from "../../config/ipconfig";

export const getBookUpSale = async () => {
    try {
        const response = await fetch(`http://${IP_CONFIG}:8080/api/book/upSaleBook`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.log(`Lỗi khi lấy thông tin sách: ${response.statusText}`);
            return null;
        }

        // Kiểm tra xem dữ liệu trả về có phải là JSON không
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("Dữ liệu trả về không phải dạng JSON.");
            return null;
        }

        const data = await response.json();
        
        // Trả về danh sách sách từ trường 'content'
        if (data && data.content) {
            return data.content;
        } else {
            console.error("Dữ liệu không hợp lệ.");
            return null;
        }

    } catch (error) {
        console.error("Lỗi khi gọi API lấy thông tin sách:", error);
        return null;
    }
} 