import React, {  useState } from 'react';
import { Drawer } from 'react-native-paper';
import {StyleSheet, TouchableOpacity, Text,View,Button} from 'react-native';
import { COLORS, SIZES } from '../../constants';
import { RadioButton, Chip } from 'react-native-paper';
import { MaterialIcons } from "@expo/vector-icons";
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';



const Filter = ({tags}) => {
    const [active, setActive] = React.useState('');
    const [checked, setChecked] = useState(false);
    const [checkedRa, setCheckedRa] = useState('first');
    const [selectedChips, setSelectedChips] = useState([]);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handlePressChip = (chip) => {
      const index = selectedChips.indexOf(chip);
      if (index === -1) {
        // Chip chưa được chọn, thêm vào mảng
        setSelectedChips([...selectedChips, chip]);
      } else {
        // Chip đã được chọn, loại bỏ khỏi mảng
        setSelectedChips(selectedChips.filter((item) => item !== chip));
      }
    };
  
    const handlePress = (value) => {
      setChecked(value);
    };
    const handleToggle = () => {
        setCheckedRa(!checkedRa);
    };
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setShowDatePicker(Platform.OS === 'ios'); // Ẩn Date Picker trên iOS khi người dùng chọn ngày
        setDate(currentDate);
    };
    const showDatepicker = () => {
        setShowDatePicker(true);
    };    
   
    
  return (
    
    <Drawer.Section  style = {styles.container}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
            <Text style = {{fontSize: 30, paddingTop:5, paddingLeft: 25}}>FILTER</Text>
        </View>
        <View >
            <View style={{flexDirection:'row'}}>
                    <MaterialIcons name="share-location" size={30} color={COLORS.black} style ={{marginLeft:15}} />
                    <Text style = {{fontSize:16, marginLeft: 13, marginTop: 5}}>Đia điểm đi</Text>
            </View>            
            <RNPickerSelect
                placeholder={{label: 'Chọn địa diểm đi' }}
                onValueChange={(value) =>{}}
                items={[
                    { label: 'Football', value: 'football' },
                    { label: 'Baseball', value: 'baseball' },
                    { label: 'Hockey', value: 'hockey' },
                ]}
            />
        </View>
        <View >
            <View style={{flexDirection:'row'}}>
                <MaterialIcons name="share-location" size={30} color={COLORS.black} style ={{marginLeft:15}} />
                <Text style = {{fontSize:16, marginLeft: 13, marginTop: 5}}>Đia điểm đến</Text>
            </View>            
            <RNPickerSelect
                placeholder={{label: 'Chọn địa diểm đến' }}
                onValueChange={(value) =>{}}
                items={[
                    { label: 'Football', value: 'football' },
                    { label: 'Baseball', value: 'baseball' },
                    { label: 'Hockey', value: 'hockey' },
                ]}
            />
        </View>
        <View >
            <View style={{flexDirection:'row'}}>
                    <MaterialIcons name="filter-alt" size={30} color={COLORS.black} style ={{marginLeft:15}} />
                    <Text style = {{fontSize:16, marginLeft: 13, marginTop: 5}}>Tags</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 8 }}>
                <Chip
                    mode="flat"
                    selected={selectedChips.includes('chip1')}
                    onPress={() => handlePressChip('chip1')}
                    style={{ marginRight: 8, marginBottom: 8 }}
                >
                    Chip 1
                </Chip>
                <Chip
                    mode="flat"
                    selected={selectedChips.includes('chip2')}
                    onPress={() => handlePressChip('chip2')}
                    style={{ marginRight: 8, marginBottom: 8 }}
                >
                    Chip 2
                </Chip>
                <Chip
                    mode="flat"
                    selected={selectedChips.includes('chip3')}
                    onPress={() => handlePressChip('chip3')}
                    style={{ marginRight: 8, marginBottom: 8 }}
                >
                    Chip 3
                </Chip>
            </View>
        </View>     
        <RadioButton.Group onValueChange={handlePress} value={checked}>
            <View style={{flexDirection:'row'}}>
                <MaterialIcons name="star-border" size={30} color={COLORS.black} style ={{marginLeft:15}} />
                <Text style = {{fontSize:16, marginLeft: 13, marginTop: 5}}>Rating</Text>
            </View>

            <View>
                <View style={{flexDirection:'row', width: '100%', marginTop: 20}}>
                    <Text style = {{marginLeft : 30}}>1</Text>
                    <Text  style = {{marginLeft: 60}}>2</Text>
                    <Text  style = {{marginLeft: 60}}>3</Text>
                    <Text  style = {{marginLeft: 60}}>4</Text>
                    <Text  style = {{marginLeft: 60}}>5</Text>
                </View> 
                <View style={{flexDirection:'row', width: '100%', marginRight:'30%'}}>
                    <RadioButton.Item value="1"/>
                    <RadioButton.Item value="2"/>
                    <RadioButton.Item value="3"/>
                    <RadioButton.Item value="4" />
                    <RadioButton.Item value="5"/>
                </View>
            </View> 
            
        </RadioButton.Group>




        <View style={{flexDirection:'row'}}>
            <View style={{flexDirection:'row'}}>
                    <MaterialIcons name="timer" size={30} color={COLORS.black} style ={{marginLeft:15}} />
                    <Text style = {{fontSize:16, marginLeft: 13, marginTop: 5}}>Thời gian đi</Text>
            </View>
            <View>
                <View>
                    <TouchableOpacity onPress={showDatepicker}>
                        <MaterialIcons name="date-range" size={20} color={COLORS.black} style ={{marginLeft:15}} />
                    </TouchableOpacity>
                </View>
                {/* {showDatePicker && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="datetime"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    />
                )} */}

            </View>
  
        </View>
    </Drawer.Section>
  );
};

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      backgroundColor: COLORS.white,
      width: '95%',
      zIndex: 999,
      top:'3%',
      left: 0,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: COLORS.black,
      height: SIZES.height,
      
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width:50, 
        height:50
    },
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
    }

  });

export default Filter;