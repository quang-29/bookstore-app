import { IP_CONFIG } from "../../config/ipconfig";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from "../../storage"; 
import instance from '../../axios-instance';

export const getCurrentUser = async (token) => {

    try {
        const response = await instance.get("api/user/myInfo");
        console.log("data", response.data);
        if (response.data.code !== 200) {
            throw new Error("Failed to fetch user info");
        }
        return response.data.data;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
} 