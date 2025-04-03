import { IP_CONFIG } from "../../config/ipconfig";



export const getCurrentUser = async (token) => {
    try {
        const response = await fetch(`http://${IP_CONFIG}:8080/api/user/myInfo`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, 
            },
        });

        if (!response.ok) {
            console.log(`Error getting current user: ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
} 