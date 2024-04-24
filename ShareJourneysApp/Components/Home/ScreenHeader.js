import React, { useState } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView,Image} from 'react-native';
import {SIZES, SPACING, COLORS} from '../../constants/theme';
import { SEARCH_PLACES } from '../../data';
import { MaterialIcons } from "@expo/vector-icons";


const ScreenHeader = () => {
  // const users = [
  //   { name: 'Alice', age: 30 },
  //   { name: 'Bob', age: 25 },
  //   { name: 'Charlie', age: 35 },
  // ];
  // arrSort = users.sort((a,b)=>b.age - a.age)
  const [Tags, setTags] = useState(SEARCH_PLACES.sort((a,b) => b.id - a.id))  
  
  // // Sắp xếp mảng theo tuổi giảm dần
  // const sortedUsers = users.sort((a, b) => b.age - a.age);
  
  return (
      <View style={{...styles.container, width:'100%', height:'100%'}}>
            <ScrollView >
              {/*duyet qua tag*/}
              {Tags.map((tag,index)=>(
                <View key={index}>
                  <Text style={styles.mainTitle}>{tag.location}</Text>
                  <ScrollView  style={{ flex: 1, paddingHorizontal: 1}}horizontal={true} showsHorizontalScrollIndicator={false}>
                    {SEARCH_PLACES.map((place, index) => (
                    <View style={
                      { 
                        margin: 10, 
                        padding:5, 
                        borderRadius: 10 ,
                        backgroundColor: '#f0f0f0', // Màu nền của container
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 50,
                          height: 50,
                        },
                        shadowOpacity: 1,
                        shadowRadius: 0,
                        elevation: 5,
                        
                      }} key={place.id}>
                      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 1 }}>
                        <Image
                          source={{ uri: 'https://tse1.mm.bing.net/th?id=OIP.cnrkuw5vYSBde9vFMxJrxwHaE8&pid=Api&rs=1&c=1&qlt=95&w=185&h=123'}}
                          style={{ width: 30, height: 30, borderRadius: 15}}
                        />
                        <View>
                          <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 14 }}>{place.title}</Text>
                          <Text style={{ color: 'gray', fontSize: 12 }}>{place.location}</Text>
                        </View>
                      </View>
                      <View
                            style={{
                              flex: 1,
                              aspectRatio: 1,
                              borderRadius: 12,
                              overflow: 'hidden',
                              width:"60%",
                              height:"60%"
                            }}
                          >
                            <Image
                              key={index}
                              source={{ uri: 'https://tse1.mm.bing.net/th?id=OIP.cnrkuw5vYSBde9vFMxJrxwHaE8&pid=Api&rs=1&c=1&qlt=95&w=185&h=123'}}
                              style={{ width: "100%", height: "80%", borderRadius: 12 }}
                            />
                                <Text style={{ ...styles.text_Post, color: COLORS.black, fontSize: 25, textAlign:'center' }}>Chuyến tham quan</Text>
                                <View style = {{
                                  flexDirection: 'row', 
                                  paddingVertical: 5, 
                                  paddingHorizontal: 5, 
                                  justifyContent:'space-around'
                                  }}>
                                  <View style = {{flexDirection: 'row', }}>
                                    <MaterialIcons name="star-border" size={20} color={COLORS.black} />
                                    <Text 
                                      style={{color: COLORS.black, fontSize: 15 }}>
                                      {place.rating}
                                    </Text>
                                  </View>
                                  <View style = {{flexDirection: 'row', }}>
                                    <MaterialIcons name="lock-clock" size={20} color={COLORS.black} />
                                    <Text 
                                      style={{color: COLORS.black, fontSize: 15 }}>
                                      thoi gian di
                                    </Text>
                                  </View>
                                  <View style = {{flexDirection: 'row', }}>
                                    <MaterialIcons name="social-distance" size={20} color={COLORS.black} />
                                    <Text 
                                      style={{color: COLORS.black, fontSize: 15 }}>
                                      số km
                                    </Text>
                                  </View>
                                </View>
                                
                      </View>
                    </View>  
                  ))}
                  </ScrollView>
                </View>
                 
              ))}             
            </ScrollView>
          </View>

   
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.l,
  },
  mainTitle: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
  },
  secondTitle: {
    fontSize: SIZES.title,
  },
});

export default ScreenHeader;
