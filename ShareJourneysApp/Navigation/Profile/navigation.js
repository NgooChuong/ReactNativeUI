import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../../Components/ProfileComponent/Profile';
import EditProfile from '../../Components/ProfileComponent/EditProfile';
import ChangePassword from '../../Components/ProfileComponent/ChangePassword';

const Stack = createNativeStackNavigator();
const ProfileNavigate = () => {
  return (
        <Stack.Navigator initialRouteName='Profile'>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="ChangePassword" options={{
                      headerShown: false
                    }} component={ChangePassword} />

        </Stack.Navigator>
  );
}

export default ProfileNavigate;