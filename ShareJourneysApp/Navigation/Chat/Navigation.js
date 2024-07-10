import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../Components/Chat/Home';
import Chat from '../../Components/Chat/Chat';
import GroupChat from '../../Components/GroupChat/GroupChat';
import GroupChatScreen from '../../Components/GroupChat/GroupChatS';
import GroupMemberList from '../../Components/GroupChat/GroupMemberList';
import AddMenberGr from '../../Components/GroupChat/ModalAddMember';


const Stack = createNativeStackNavigator();
const ChatNavigate = () => {
  return (
    <>
     <Stack.Navigator initialRouteName ="HomeChat">
        <Stack.Screen name="HomeChat"  options={{headerShown: false}} component={Home} />
        <Stack.Screen name="Chat" options={{headerShown: false}} component={Chat} />
        <Stack.Screen
                  name='GroupChat'
                  component={GroupChat}
                  options={{
                    headerShown: false
                }}
                />
                 <Stack.Screen
                  name='GroupChatScreen'
                  component={GroupChatScreen}
                  options={{
                    headerShown: false
                }}
                />
                 <Stack.Screen name="GroupMemberList" options={{headerShown: false}} component={GroupMemberList} />
                 <Stack.Screen
                  name='GroupChatScreen1'
                  component={GroupChatScreen}
                  options={{
                    headerShown: false
                }}
                />
      </Stack.Navigator>
    </>
           
        
  );
}

export default ChatNavigate;