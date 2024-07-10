import React, { useState } from 'react';
import { View, Button, Text, TextInput, FlatList } from 'react-native';
import ml from '@react-native-firebase/ml';

const Test = () => {
  const [inputText, setInputText] = useState('');
  const [replies, setReplies] = useState([]);

  const handleSmartReply = async () => {
    if (inputText.trim().length > 0) {
      try {
        const result = await ml().smartReply().suggestReplies([{
          text: inputText,
          userId: 'user123', // an identifier for the user that sent the message
          timestamp: Date.now(), // the time the message was sent
        }]);

        setReplies(result.suggestions);
      } catch (error) {
        console.error('Smart Reply Error:', error);
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        placeholder="Nhập tin nhắn"
        style={{ borderWidth: 1, marginBottom: 20, padding: 10 }}
      />
      <Button title="Get Smart Replies" onPress={handleSmartReply} />
      <FlatList
        data={replies}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={{ marginTop: 10 }}>{item.text}</Text>}
      />
    </View>
  );
};

export default Test;
