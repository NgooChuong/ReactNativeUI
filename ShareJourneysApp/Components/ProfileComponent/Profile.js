import {
    View,
    Text,
    Image,
    TouchableOpacity,
    useWindowDimensions,
    FlatList,
  } from "react-native";
  import React, { useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { COLORS, FONTS, SIZES, images } from "../../constants";
  import { StatusBar } from "expo-status-bar";
  import { MaterialIcons } from "@expo/vector-icons";



  
  const Profile = ({navigation}) => {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);    
    const ToEditProfile = () =>{
        navigation.navigate('EditProfile');
    }
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
        }}
      >
        <View style={{ flex: 1, alignItems: "center", marginTop:100 }}>
          <Image
            source={images.profile}
            resizeMode="contain"
            style={{
              height: 155,
              width: 155,
              borderRadius: 999,
              borderColor: COLORS.primary,
              borderWidth: 2,
              marginTop: -90,
            }}
          />
  
          <Text
            style={{
              ...FONTS.h2,
              color: COLORS.primary,
              marginVertical: 8,
            }}
          >
            Melissa Peters
          </Text>
          
  
          <View style = {{ width:'100%', height:'70%'}}>
            <TouchableOpacity onPress={ToEditProfile}
              style={{
                width: '100%',
                height: '10%',
                flexDirection: 'row',
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.white,
                justifyContent: "space-between",
                borderStyle: "solid",
                borderWidth: 2,
                }}
            >
              <Text
                style={{
                  ...FONTS.body2,
                  color: COLORS.black,
                }}
              >
                <MaterialIcons
              name="settings"
              size={24}
              color={COLORS.black}
                />
                Edit Profile
              </Text>
              <MaterialIcons
              name="arrow-circle-right"
              size={24}
              color={COLORS.black}
                />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: '100%',
                height: '10%',
                flexDirection: 'row',
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.white,
                justifyContent: "space-between",
                borderStyle: "solid",
                borderWidth: 2,
                }}
            >
              <Text
                style={{
                  ...FONTS.body2,
                  color: COLORS.black,
                }}
              >
                <MaterialIcons
              name="logout"
              size={24}
              color={COLORS.black}
                />
                Log Out
              </Text>
              <MaterialIcons
              name="arrow-circle-right"
              size={24}
              color={COLORS.black}
                />
            </TouchableOpacity>
          </View>
        </View>
  
      </SafeAreaView>
    );
  };
  
  export default Profile;