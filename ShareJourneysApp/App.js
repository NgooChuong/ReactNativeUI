import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import HomeNavigator from './Navigation/Home/HomeNavigator';
// import ProfileNavigate from './Navigation/Profile/navigation';
import MainHeader from './Components/Home/MainHeader';
// import TabNavigator from './Navigation/Home/TabNavigator';
import { SafeAreaView } from "react-native-safe-area-context";
import BottomTabNav from './Navigation/BottomTabNav';
import { NavigationContainer } from '@react-navigation/native';


const App = () =>{
  return (
      <NavigationContainer>
        < BottomTabNav/>
       </NavigationContainer>
    
  )
}

export default App;