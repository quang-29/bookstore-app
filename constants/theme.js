import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const COLORS = {
  primary: "#5E9EC3", 
  
  secondary: "#E9F1F5", 
  tertiary: "#FF9A8B", 
  gray: "#B4B4B4", 
  gray2: "#D1D1D6", 
  offWhite: "#F0F2F5", 
  white: "#FFFFFF", 
  black: "#212121", 
  red: "#FF4C4C", 
  green: "#4CAF50", 
  lightWhite: "#F9F9F9", 
  primaryLight: "#ffe141",
  secondaryLight: "#0d8332",
  text: "#363636",
  backgroundSecondary: "#f5f6fb",
  border: "#d0d4dc",
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 44,
  height,
  width,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15, // Softer shadow for light effect
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1, // Softer shadow for minimal look
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { COLORS, SHADOWS, SIZES };
