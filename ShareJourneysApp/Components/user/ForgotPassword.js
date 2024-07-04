
import React, {Component, useState} from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import color from '../../style/color';
import { generateVerificationCode, saveVerificationCodeToFirestore } from './saveOTP';
import { HelperText } from 'react-native-paper';
import APIs, { endpoints } from '../../config/APIs';

export default function ForgotPassword({navigation}){
  const [email,setEmail]=useState('');
  const [err, setErr] = useState(false);
  const handleEmail = async () => {

    try{
      const code=  generateVerificationCode();
      console.log(code);
      
      let sendEmail = await APIs.post(endpoints['apiEmail'],{
        'emailUser':email,// chỗ này mai mốt lấy id user của bên chi tiết bài đăng
        'nd':"Mã xác thực của bạn là" +" " +code
      })  
      console.log(sendEmail);
      await saveVerificationCodeToFirestore(email,code);
      console.log(email);
      navigation.navigate("EnterOTP",{email})
      
    }catch(ex){
      console.log(ex)
      setErr(true);

    }
    
};

   
    return (
      <KeyboardAvoidingView behavior="position" style={styles.mainCon}>
        <View style={{padding: 20,marginBottom:1}}>
            <TouchableOpacity onPress={() =>{ console.log("bafva"),navigation.goBack()}}>
                <Ionicons name="arrow-back" size={24} color={color.black} />
                </TouchableOpacity>
        </View>
        <View style={{padding: 20,marginTop:10}}>
        
        </View>
        <View style={{position: 'relative', bottom: 20}}>
          <View style={styles.container}>
            <View style={styles.loginLblCon}>
              <Text style={styles.loginLbl}>Forgot Password?</Text>
            </View>
            <View style={styles.forgotDes}>
              <Text style={styles.forgotDesLbl}>
                Don't worry! It happens, please enter the address associated
                with your account
              </Text>
            </View>
            <View style={styles.formCon}>
              <View style={styles.textBoxCon}>
                <View style={styles.at}>
                <Ionicons name="logo-google-playstore" size={24} color={color.black} />

                </View>
                <View style={styles.textCon}>
                  <TextInput
                    value={email}
                    style={styles.textInput}
                    placeholder={'Email ID'}
                    placeholderTextColor={'#aaa'}
                    onChangeText={t=>setEmail(t)}
                  />
                </View>
              </View>
            </View>
            <HelperText type="error" visible={err}>
             Email khong ton tai!!!
          </HelperText>
            <View style={[styles.loginIcon, {marginTop: 40}]}>
              <Pressable
                style={styles.LoginBtn}
                onPress={() => handleEmail()}>
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
  },
  loginLbl: {
    color: '#000',
    fontSize: 35,
  },
  at: {
    alignSelf: 'center',
    width: '10%',
  },

  textBoxCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textCon: {
    width: '90%',
  },

  textInput: {
    borderBottomColor: '#aaa',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    color: '#000',
    fontSize: 16,
    height: 40,
  },

  LoginBtn: {
    backgroundColor: '#0057ff',
    borderRadius: 30,
  },
  loginBtnLbl: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal:10,
  },

  forgotDes: {
    position: 'relative',
    bottom: 35,
  },
  forgotDesLbl: {
    color: '#000',
  },
});
