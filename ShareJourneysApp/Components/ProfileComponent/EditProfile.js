import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    Modal,
  } from "react-native";
  import React, { useContext, useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import * as ImagePicker from "expo-image-picker";
  import { COLORS, FONTS } from "../../constants";
  import { MaterialIcons } from "@expo/vector-icons";
  import { imagesDataURL } from "../../constants/data";
  import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import Mycontext from "../../config/Mycontext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../config/APIs";
import { v4 as uuidv4 } from 'uuid';

  const EditProfile = ({ navigation }) => {
    const dlUser= useContext(Mycontext)
    const [selectedImage, setSelectedImage] = useState(dlUser[0].avatar);
    const [name, setName] = useState(dlUser[0].username);
    const [email, setEmail] = useState(dlUser[0].email);
    // const [password, setPassword] = useState("");
    const [first_name, setFirstName] = useState(dlUser[0].firstname);
    const [last_name, setLastName] = useState(dlUser[0].lastname);

  
    const patch_user = async () => {
      
      let userData = {
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'username': name,
        'avatar': selectedImage,
      };
      console.log('1234',userData)
      const form = new FormData();
      for (let key in userData){
          if (key === 'avatar') {
              form.append(key, {
                  uri: userData[key].uri,
                  name: userData[key].fileName,
                  type: 'image/jpeg'
              })
          } else
              form.append(key, userData[key]);
        }
      console.log('12345', form._parts[4]);

      try {
          let a= await AsyncStorage.getItem('access-token')
          let user = await authApi(a).patch(endpoints['current-user'],form,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          
          });

      } catch (ex) {
          console.error(ex);
          Alert.alert("Tai khoan bi khoa hoac chua dang ki nguoi dung");
      } finally {
          setLoading(false);
      }
    }


  //   const change = (field, value) => {
  //     console.log("User Register:",userData)
  //     setUser(current => {
  //         return {...current, [field]: value}
  //     })
  // }



    const handleImageSelection = async () => {
      let result = await ImagePicker.launchImageLibraryAsync();
    
      if (!result.canceled) {
        setSelectedImage(result.assets[0])

      }
      
    };
   
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          paddingHorizontal: 22,
        }}
      >
        <View
          style={{
            marginHorizontal: 12,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
  
          <Text style={{ ...FONTS.h3 }}>Edit Profile</Text>
        </View>
  
        <ScrollView>
          <View
            style={{
              alignItems: "center",
              marginVertical: 22,
            }}
          >
            <TouchableOpacity onPress={handleImageSelection}>
            {console.log('abc',selectedImage)}
              <Image
                source={{ uri: selectedImage.uri || dlUser[0].avatar }}
                style={{
                  height: 170,
                  width: 170,
                  borderRadius: 85,
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                }}
              />
  
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 10,
                  zIndex: 9999,
                }}
              >
                <MaterialIcons
                  name="photo-camera"
                  size={32}
                  color={COLORS.primary}
                />
              </View>
            </TouchableOpacity>
          </View>
  
          <View>
            <View
              style={{
                flexDirection: "column",
                marginBottom: 6,
              }}
            >
              <Text style={{ ...FONTS.h4 }}>Name</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={name}
                  onChangeText={(value) => setName(value)}
                  editable={true}
                />
              </View>
            </View>
  
            <View
              style={{
                flexDirection: "column",
                marginBottom: 6,
              }}
            >
              <Text style={{ ...FONTS.h4 }}>Email</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={email}
                  onChangeText={(value) => setEmail(value)}
                  editable={true}
                />
              </View>
            </View>
  
            {/* <View
              style={{
                flexDirection: "column",
                marginBottom: 6,
              }}
            >
              <Text style={{ ...FONTS.h4 }}>Password</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={dlUser[0].password}
                  onChangeText={(value) => setPassword(value)}
                  editable={true}
                  secureTextEntry
                />
              </View>
            </View> */}
  
            <View
              style={{
                flexDirection: "column",
                marginBottom: 6,
              }}
            >
              <Text style={{ ...FONTS.h4 }}>Họ</Text>
              <View
                style={{
                  height: 44,
                  width: "100%",
                  borderColor: COLORS.secondaryGray,
                  borderWidth: 1,
                  borderRadius: 4,
                  marginVertical: 6,
                  justifyContent: "center",
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={last_name}
                  onChangeText={(value) => setLastName(value)}
                  editable={true}
                />
              </View>
            </View>
          </View>
  
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Text style={{ ...FONTS.h4 }}>Tên</Text>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: COLORS.secondaryGray,
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={first_name}
                onChangeText={(value) => setFirstName(value)}
                // editable={true}
              />
            </View>
          </View>
  
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              height: 44,
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={patch_user}
          >
            <Text
              style={{
                ...FONTS.body3,
                color: COLORS.white,
              }}
            >
              Save Change
            </Text>
          </TouchableOpacity>
  
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default EditProfile;