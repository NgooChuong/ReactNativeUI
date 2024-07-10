import React, { useReducer } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginNavigation from './Login/Navigation';
import BottomTabNav from './BottomTabNav';
import Test from "../Components/Test/test";

const Stack = createNativeStackNavigator();

const MainNavigate = () => {
  return (
            <Stack.Navigator initialRouteName ="Authenticate">
                {/* <Stack.Screen name="test"  options={{headerShown: false}} component={Test} /> */}
                <Stack.Screen name="Authenticate"  options={{headerShown: false}} component={LoginNavigation} />
                <Stack.Screen name="BottomTabNav" options={{headerShown: false}} component={BottomTabNav} />
            </Stack.Navigator>

  );
}

export default MainNavigate;