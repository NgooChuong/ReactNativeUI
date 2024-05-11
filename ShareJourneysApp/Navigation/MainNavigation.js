import React, { useReducer } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginNavigation from './Login/Navigation';
import BottomTabNav from './BottomTabNav';
import MyUserReducer from "../reducers/MyUserReducer";
import Mycontext from "../config/Mycontext";

const Stack = createNativeStackNavigator();

const MainNavigate = () => {
  return (
            <Stack.Navigator initialRouteName ="Login">
                <Stack.Screen name="Login"  options={{headerShown: false}} component={LoginNavigation} />
                <Stack.Screen name="BottomTabNav" options={{headerShown: false}} component={BottomTabNav} />
            </Stack.Navigator>

  );
}

export default MainNavigate;