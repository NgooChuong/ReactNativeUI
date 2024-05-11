import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostDetail from '../../Components/Post/PostDetail';
import ScreenHeader from '../../Components/Home/ScreenHeader';
import MainHeader from '../../Components/Home/MainHeader';
import Profile from '../../Components/ProfileComponent/ProfileUser';

const Stack = createNativeStackNavigator();
const HomeNavigate = () => {
  return (
            <Stack.Navigator initialRouteName ="HomePage">
                <Stack.Screen name="HomePage"  options={{headerShown: false}} component={MainHeader} />
                <Stack.Screen name="PostDetail" component={PostDetail} />
                <Stack.Screen name="ProfileUser" options={{headerShown: false}} component={Profile} />

            </Stack.Navigator>
        
  );
}

export default HomeNavigate;