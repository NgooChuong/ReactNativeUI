import { View, Text, Platform } from "react-native";
import React, { useReducer, useState } from "react";
import {
  SimpleLineIcons,
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLORS } from "../constants";
import MainHeader from "../Components/Home/MainHeader";
import Profile from "../Components/ProfileComponent/Profile";
import ProfileNavigate from "./Profile/navigation";
import HomeNavigate from "./Home/Navigation";
import { NavigationContainer } from "@react-navigation/native";
import LoginNavigation from "./Login/Navigation";
import JourneyHistory from "../Components/Post/JourneyHistory";
import HistoryNavigate from "./History/Navigation";
import UpPostNavigate from "./UpPostNavigation/navigation";
import Home from "../Components/Chat/Home";
import ChatNavigate from "./Chat/Navigation";

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarHideOnKeyboard: true,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 60,
    backgroundColor: COLORS.white,
  },
};
const BottomTabNav = () => {
  // const [visible, setVisible] = useState(true);
  return (
      
      <Tab.Navigator screenOptions={screenOptions} >
      <Tab.Screen
          name="Home"
          component={HomeNavigate}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              return (
                
                <SimpleLineIcons
                  name="home"
                  size={24}
                  color={focused ? COLORS.carrot : COLORS.black}
                />
              );
            },
          }}
        />
        
      <Tab.Screen
          name="ChatUser"
          component={ChatNavigate}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <MaterialCommunityIcons
                  name="chat"
                  size={24}
                  color={focused ? COLORS.carrot : COLORS.black}
                />
              );
            },
          }}
        />

        <Tab.Screen
          name="UpPost"
          component={UpPostNavigate}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <MaterialCommunityIcons
                  name="post"
                  size={24}
                  color={focused ? COLORS.carrot : COLORS.black}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="ProfileUser"
          component={ProfileNavigate}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <MaterialCommunityIcons
                  name="face-man-profile"
                  size={24}
                  color={focused ? COLORS.carrot : COLORS.black}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="HistoryPost"
          component={HistoryNavigate}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <MaterialCommunityIcons
                  name="history"
                  size={24}
                  color={focused ? COLORS.carrot : COLORS.black}
                />
              );
            },
          }}
          
        />


        

      </Tab.Navigator>

  );
};

export default BottomTabNav;
