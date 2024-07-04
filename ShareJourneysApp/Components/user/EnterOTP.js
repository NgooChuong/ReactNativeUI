import React, { useState } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import color from '../../style/color';
import { generateVerificationCode, saveVerificationCodeToFirestore, verifyVerificationCode } from './saveOTP';
import APIs, { endpoints } from '../../config/APIs';

const OTPPasword = ({ navigation,route}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const { email } = route.params;
  const handleInputChange = async(value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Tự động chuyển sang ô tiếp theo khi người dùng nhập xong một ký tự
    if (value !== '' && index < otp.length - 1) {
      const nextInput = `otpInput${index + 1}`;
      this[nextInput].focus();
    }

    // Kiểm tra nếu mã OTP đã nhập đủ 4 ký tự
    if (newOtp.join('').length === 4) {
      console.log(email);
      console.log(newOtp)
      await verifyVerificationCode(email, newOtp.join(''))
      navigation.navigate('ResetPassword');
    }
  };

  const resendOTP = async() => {
    // Logic gửi lại OTP
      const code=  generateVerificationCode();
      console.log(code);
      await saveVerificationCodeToFirestore(email,code);
      console.log(email);
      try{
        let sendEmail = await APIs.post(endpoints['apiEmail'],{
          'emailUser':email,// chỗ này mai mốt lấy id user của bên chi tiết bài đăng
          'nd':"Mã xác thực của bạn là" +" " +code
        })  
        console.log(sendEmail)
        navigation.navigate("EnterOTP",{email})
        
      }catch(ex){
        console.log(ex)
      }
      setOtp(['', '', '', ''])
    console.log("OTP Resent");
  };

  return (
    <KeyboardAvoidingView behavior="position" style={styles.mainCon}>
      <View style={{ padding: 20 }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={color.black} />
        </Pressable>
      </View>
      <View style={{ position: 'relative', bottom: 30 }}>
        <View style={styles.loginIcon}>
          <Ionicons name="water" size={24} color={color.black} />
        </View>
        <View style={styles.container}>
          <View style={styles.loginLblCon}>
            <Text style={styles.loginLbl}>Enter OTP?</Text>
          </View>
          <View style={styles.forgotDes}>
            <Text style={styles.forgotDesLbl}>
              A 4 digit code has been sent to
            </Text>
            <Text style={styles.forgotDesLbl}>+91 1234567890</Text>
          </View>
          <View style={styles.formCon}>
            <View style={styles.otpContainer}>
              {otp.map((value, index) => (
                <TextInput
                  key={index}
                  ref={(input) => { this[`otpInput${index}`] = input; }}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={value}
                  onChangeText={(text) => handleInputChange(text, index)}
                />
              ))}
            </View>
            <Pressable onPress={resendOTP}>
              <Text style={styles.registerLbl}>Resend OTP</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default OTPPasword

const styles = StyleSheet.create({
  mainCon: {
    backgroundColor: '#fff',
    flex: 1,
  },
  loginIcon: {
    alignSelf: 'center',
  },
  formCon: {
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 20,
    marginTop: 50,
  },
  loginLblCon: {
    position: 'relative',
    bottom: 40,
  },
  loginLbl: {
    color: '#000',
    fontSize: 40,
    textAlign: 'center',
  },
  forgotDes: {
    position: 'relative',
    bottom: 35,
    alignItems: 'center',
  },
  forgotDesLbl: {
    color: '#000',
    textAlign: 'center',
  },
  registerLbl: {
    color: '#0057ff',
    marginTop: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#000',
    textAlign: 'center',
    fontSize: 20,
    margin: 5,
  },
});
