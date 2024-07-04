import React, {useContext, useState} from 'react';
import {Text, View, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Image} from 'react-native';
import {SIZES, SPACING, COLORS} from '../../constants';
import { MaterialIcons } from "@expo/vector-icons";
import ScreenHeader from './ScreenHeader';
import Filter from './Filter';
import { Searchbar } from 'react-native-paper';
import Mycontext from '../../config/Mycontext';
import HomePage from './HomePage';



const MainHeader = ({navigation, route}) => {
  const [showComponent, setShowComponent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dlUser= useContext(Mycontext)
  const [filter, setFilter] = useState({})
  const tag_id = route.params?.tag_id
  const tag_name = route.params?.tag_name

  // const route = useRoute();
  // const formData = route.params?.filter
  // if (formData) console.log('fdata',formData)
  const handleButtonPress = () => {
    setShowComponent(true);
  };

  

  return (

    
    <>
        <View style={{width:'100%',height:50,position:'relative'}}>
        <TouchableOpacity
        style={
              styles.touchableOpacityGoBack

        }
        onPress={() =>{
            navigation.goBack(
            )
        }}
      >
        <MaterialIcons name="arrow-back" size={30} color="black" />
      </TouchableOpacity>
          </View >
        <View style={{...styles.container}}>
          
            <Image
              source={{ uri: dlUser[0].avatar}}
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
            <TouchableOpacity style={{}} onPress={handleButtonPress}>
                <MaterialIcons name="filter-alt" size={24} color="black" />
            </TouchableOpacity>
            {showComponent && <Filter fil ={filter} setfil = {setFilter} X={showComponent} setShow = {setShowComponent} />}
        </View>
        <ScreenHeader fil = {filter} navigation ={navigation} q={searchQuery} tag_id ={tag_id} tag_name={tag_name} />
    </>
        
    
  );
};

const styles = StyleSheet.create({
  touchableOpacityGoBack:
  {
      position: 'absolute',
        top: 40,
        left: 15,
        zIndex: 1,
  },
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