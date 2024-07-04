import React, { useState } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import color from '../../style/color';
import { HelperText } from 'react-native-paper';
import APIs, { endpoints } from '../../config/APIs';

export default function ResetPasswords({ navigation }) {
  const [userName, setUserName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [err, setErr] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); // State để điều khiển hiển thị mật khẩu cho New Password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State để điều khiển hiển thị mật khẩu cho Confirm Password

  // Xử lý lưu cập nhật password mới khi thực hiện submit reset password
  const handleSubmit = async() => {
    if (newPassword !== confirmPassword) {
      setErr(true);
      return;
    }
    setErr(false);
        try{
          let res = await APIs.post(endpoints['resetPassword'],{
            'email':userName,
            'new_password':newPassword
          })  
          console.log(res.detail);
          navigation.navigate("Login");
        }catch(ex){
          console.log(ex)
          Alert.alert("Username không đúng hoặc mật khẩu không đủ ít nhất 8 kí tự");
        }
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <KeyboardAvoidingView behavior="position" style={styles.mainCon}>
      <View style={{ padding: 20 }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={color.black} />
        </Pressable>
      </View>
      <View style={{ position: 'relative', bottom: 12 }}>
        
        <View style={styles.container}>
          <View style={styles.loginLblCon}>
            <Text style={styles.loginLbl}>Reset Password</Text>
          </View>
          <View style={styles.formCon}>
            <View style={[styles.textBoxCon]}>
              <Ionicons name="person" size={24} color={color.black} style={styles.icon} />
              <TextInput
                style={styles.textInput}
                placeholder={'User name cũ'}
                placeholderTextColor={'#aaa'}
                value={userName}
                onChangeText={text => setUserName(text)}
              />
            </View>
            <View style={[styles.textBoxCon]}>
              <Ionicons name="lock-closed" size={24} color={color.black} style={styles.icon} />
              <TextInput
                style={styles.textInput}
                placeholder={'New Password'}
                placeholderTextColor={'#aaa'}
                secureTextEntry={!showNewPassword} // Ẩn/mở mật khẩu dựa vào showNewPassword
                value={newPassword}
                onChangeText={text => setNewPassword(text)}
              />
              <Ionicons
                name={showNewPassword ? 'eye' : 'eye-off-outline'} // Thay đổi icon mắt
                size={24}
                color={color.black}
                style={styles.icon}
                onPress={toggleShowNewPassword} // Xử lý khi người dùng nhấn vào icon mắt
              />
            </View>
            <View style={[styles.textBoxCon, { marginBottom: 20 }]}>
              <Ionicons name="lock-closed" size={24} color={color.black} style={styles.icon} />
              <TextInput
                style={styles.textInput}
                placeholder={'Confirm Password'}
                placeholderTextColor={'#aaa'}
                secureTextEntry={!showConfirmPassword} // Ẩn/mở mật khẩu dựa vào showConfirmPassword
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
              />
              <Ionicons
                name={showConfirmPassword ? 'eye' : 'eye-off-outline'} // Thay đổi icon mắt
                size={24}
                color={color.black}
                style={styles.icon}
                onPress={toggleShowConfirmPassword} // Xử lý khi người dùng nhấn vào icon mắt
              />
            </View>
          </View>
          <HelperText type="error" visible={err}>
            Mật khẩu mới không khớp!
          </HelperText>
          <View style={[styles.loginIcon, { marginTop: 30 }]}>
            <Pressable style={styles.loginBtn} onPress={handleSubmit}>
              <Text style={styles.loginBtnLbl}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainCon: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: 10
  },
  loginIcon: {
    alignSelf: 'center',
  },
  formCon: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  container: {
    paddingHorizontal: 20,
  },
  loginLblCon: {
    position: 'relative',
    bottom: 40,
    alignItems: 'center',
  },
  loginLbl: {
    color: '#000',
    fontSize: 32,
    textAlign: 'center',
  },
  textBoxCon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    height: 40,
  },
  loginBtn: {
    backgroundColor: '#0057ff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  loginBtnLbl: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
});
