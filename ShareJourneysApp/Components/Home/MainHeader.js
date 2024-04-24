import React, {useState} from 'react';
import {Text, View, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image} from 'react-native';
import Icon from './Icon';
import {SIZES, SPACING, COLORS} from '../../constants';
import { MaterialIcons } from "@expo/vector-icons";
import ScreenHeader from './ScreenHeader';
import Filter from './Filter';
import Hamburger from 'react-native-hamburger';
import { Searchbar } from 'react-native-paper';



const MainHeader = () => {
  const [showComponent, setShowComponent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleButtonPress = () => {
    setShowComponent(!showComponent);
  };
  return (
    <>
        <View style={{...styles.container}}>
            <Image
              source={{ uri: 'https://tse1.mm.bing.net/th?id=OIP.cnrkuw5vYSBde9vFMxJrxwHaE8&pid=Api&rs=1&c=1&qlt=95&w=185&h=123'}}
              style={{ width: 30, height: 30, borderRadius: 15}}
            />
            <Searchbar style={styles.title}
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              
            />            
            <TouchableOpacity>
                <MaterialIcons
                name="travel-explore"
                size={30}
                color={COLORS.black}
                    />
            </TouchableOpacity>
            <Hamburger onPress={handleButtonPress} type = "spinCross" active = {showComponent}  />
            {showComponent && <Filter />}
        </View>
        <ScreenHeader/>
    </>
        
    
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    position: 'relative',
    marginTop: 30,
  },
  title: {
   borderStyle:'solid', borderColor:'black', borderWidth: 1, width: '70%'
  },
});

export default MainHeader;