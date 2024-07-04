import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Modal, Button, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { HelperText } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import APIs, { authApi, endpoints } from '../../config/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mycontext from '../../config/Mycontext';
import MapViewComponent from './map';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseconf';

const JourneyModal = ({ idPost,visible, onClose, journey, diaDiemList }) => {
    const [selectedStartStop, setSelectedStartStop] = useState(null);
    const [selectedEndStop, setSelectedEndStop] = useState(null);
    const [startStopTime, setStartStopTime] = useState('');
    const [endStopTime, setEndStopTime] = useState('');
    const [isStartStopModalVisible, setStartStopModalVisible] = useState(false);
    const [isEndStopModalVisible, setEndStopModalVisible] = useState(false);
    const [invalid, setInvalid] = useState(false);
    

    const handleSave = async() => {
        const selectedStops = {
            startStop: selectedStartStop,
            endStop: selectedEndStop,
        };
        if ( selectedStartStop !== null && selectedEndStop !== null && selectedStartStop === selectedEndStop) {
            setInvalid(true);
            setSelectedEndStop(null);
            setSelectedStartStop(null);
            handleRoutePress(0,0)
            alert("Selected start stop cannot be the same as end stop.");
            return;
        }
        if (selectedStartStop === null && selectedEndStop === null){
            selectedStops.startStop = journey.id_tuyenDuong.id_noiDi.id;
            selectedStops.endStop = journey.id_tuyenDuong.id_noiDen.id;

        }
        if (selectedStartStop === null)
        {
            console.log('if')
            selectedStops.startStop = journey.id_tuyenDuong.id_noiDi.id;
        }else if(selectedEndStop === null)
        {
            console.log('elseif')
            selectedStops.endStop = journey.id_tuyenDuong.id_noiDen.id;
        }
       
        const startStopIndex = diaDiemList.findIndex(item => item.id === selectedStartStop);
        const endStopIndex = diaDiemList.findIndex(item => item.id === selectedEndStop);
        if (startStopIndex >= 0 && endStopIndex >= 0 && startStopIndex >= endStopIndex) {
            alert("Selected end stop must be after start stop in the list.");
            setInvalid(true);
            setSelectedEndStop(null);
            setSelectedStartStop(null);
            handleRoutePress(0,0)
            return;
        }
        try {
            let token = await AsyncStorage.getItem('access-token');
            let res = await authApi(token).post(endpoints['updateAcceptPost'](idPost), {
                id_NoiDi: selectedStops.startStop,
                id_NoiDen: selectedStops.endStop
            })
            
    
            } catch (ex) {
                console.error(ex);
                
            }
        setSelectedEndStop(null);
        setSelectedStartStop(null);
        setInvalid(false);
        onClose(selectedStops);

    };
    

    const handleStartStopChange = (item,index) => {
        setSelectedStartStop(item.id);
        setStartStopTime(item.ThoiGianDuKien);
        setStartStopModalVisible(false);
        handlePress(0, index+1)
    };

    const handleEndStopChange = (item,index) => {
        setSelectedEndStop(item.id);
        setEndStopTime(item.ThoiGianDuKien);
        setEndStopModalVisible(false);
        handlePress(index+1,diaDiemList.length+1)
    };


    const [Locals, setLocals] = useState([])
    const [route, setRoute] = useState(null);
    const [index, setIndex] = useState(0)
    const handleRoutePress = async (start, end) => {
        const routeCoordinates = [];
        for (let i = start; i <=end; i++) {
            routeCoordinates.push({
                latitude: Locals[i].latitude,
                longitude: Locals[i].longitude,
            }
        )
    }
        setRoute(routeCoordinates);
    };
    const getDiaDiemFireBase = async(docu) =>{
        const docRef = doc(db, 'Local', docu);
        const docs = await getDoc(docRef)
        return  docs.data()
    }
    const getDiaDiemSFireBase =async (length,data) =>{
        console.log('data',data)
        const arrLocal = []
        let toado
        for (let i = 0; i < length; i++) {
            if (i==0){
                console.log('1');
                toado = await getDiaDiemFireBase(data.id_tuyenDuong.id_noiDi.diaChi);
                console.log(i, toado);
                if (toado) {
                    arrLocal.push({
                        ...toado,
                        diaChi: data.id_tuyenDuong.id_noiDi.diaChi
                    });
                }
                            }
            else if (i==length-1) {
                console.log('2');
            toado = await getDiaDiemFireBase(data.id_tuyenDuong.id_noiDen.diaChi);
            console.log(i, toado);
            if (toado) {
                arrLocal.push({
                    ...toado,
                    diaChi: data.id_tuyenDuong.id_noiDen.diaChi
                });
            }

            }
            else {
                console.log('3');
                toado = await getDiaDiemFireBase(data.stoplocal[i-1].id_DiaDiem.diaChi)
                if (toado) {
                    arrLocal.push({
                        ...toado,
                        diaChi: data.stoplocal[i - 1].id_DiaDiem.diaChi
                    });
                }

            }
        }
        console.log('Query',arrLocal)
                    setLocals(arrLocal)

    } 
      useEffect(() => {
        console.log('journey',journey)
        getDiaDiemSFireBase(diaDiemList.length+2,journey)
         }, []);

  const handlePress = (s,e) => {
    setIndex(s);
    handleRoutePress(s,e)
  };
    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={() => onClose(null)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Journey Information</Text>
                        <TouchableOpacity onPress={() => onClose(null)}>
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    {
                        Locals.length == 0 && route==null ? <ActivityIndicator/> :
                        <View style = {{padding: 10,}}>
                        <MapViewComponent local={Locals} route={route} index={index}/>
                    </View>
                    }
               
                    <View>
                    <Ionicons name="location" size={16} color="green" >
                        <Text style={styles.infoText}>Điểm bắt đầu hành trình {journey.id_tuyenDuong.id_noiDi.diaChi}</Text>
                        </Ionicons>
                        <Text style={{padding:4,fontSize:16 }}>
                            <Ionicons name="calendar" size={16} color="black" >
                            </Ionicons>
                            Ngày đi:{moment(journey.ngayDi).format("DD/MM/YYYY HH:mm:ss")}

                        </Text>
                    </View>

                    <View style={styles.rowContainer}>
                        <View style={styles.pickerContainer}>
                            <TouchableOpacity
                                style={styles.selector}
                                onPress={() => setStartStopModalVisible(true)}
                            >
                                <Text>{selectedStartStop ? diaDiemList.find(item => item.id === selectedStartStop).diaChi : "Select Start Stop"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                    {startStopTime ? <Text style={styles.timeText}>Thoi Gian Du Kien:  {moment(startStopTime).format("DD/MM/YYYY HH:mm:ss")}</Text> : null}
                    <View style={styles.rowContainer}>
                        <View style={styles.pickerContainer}>
                            <TouchableOpacity
                                style={styles.selector}
                                onPress={() => setEndStopModalVisible(true)}
                            >
                                <Text>{selectedEndStop ? diaDiemList.find(item => item.id === selectedEndStop).diaChi : "Select End Stop"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {endStopTime ? <Text style={styles.timeText}>Thoi Gian Du Kien: {moment(endStopTime).format("DD/MM/YYYY HH:mm:ss")}</Text> : null}
                    <View style={{marginTop:10}}>
                        <TouchableOpacity style={{padding:4}}  onPress={() => handleRoutePress(0,diaDiemList.length+1)}>
                        <Ionicons name="location" size={16} color="red" >
                        <Text style={styles.infoText}>Điểm kết thúc hành trình {journey.id_tuyenDuong.id_noiDen.diaChi}</Text>
                        </Ionicons>
                        </TouchableOpacity>
                        <Text style={{padding:4,fontSize:16}}>
                            <Ionicons name="calendar" size={16} color="black" >
                            </Ionicons>
                            Ngày kết thúc: {moment(journey.ngayDen).format("DD/MM/YYYY HH:mm:ss")}

                        </Text>

                    </View>
                    <HelperText
                        type="error"
                        visible={invalid}
                    >
                        Start and end stops cannot be the same.
                    </HelperText>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSave}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    
                    </View>

                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={isStartStopModalVisible}
                        onRequestClose={() => setStartStopModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text>Chọn danh sách địa điểm đón(nếu có)</Text>
                                <ScrollView>
                                    {diaDiemList.map((item,index) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={styles.option}
                                            onPress={() => handleStartStopChange(item,index)}
                                        >
                                            <Text>{item.diaChi}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                <View style={{marginTop:10}}>
                                    <Button  title="Close" onPress={() => setStartStopModalVisible(false)} />
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={isEndStopModalVisible}
                        onRequestClose={() => setEndStopModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text>Chọn danh sách địa điểm đến(nếu có)</Text>
                                <ScrollView>
                                    {diaDiemList.map((item,index) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={styles.option}
                                            onPress={() => handleEndStopChange(item,index)}
                                        >
                                            <Text>{item.diaChi}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                <View style={{marginTop:10}}>
                                    <Button title="Close" onPress={() => setEndStopModalVisible(false)} />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </Modal>
    );
};

// Phần xử lý fetch api chi tiet post trong modal
const ModalSelectJourney = ({ visible,setModalVisible,id_Post }) => {
    // const journey = journeyData.journey;
    const [detail, setDetail] = useState();
    const loadDetailPost = async () =>{
        try{
          let res = await APIs.get(endpoints['posts'](id_Post))
          
          setDetail(res.data.journey)
          console.log('dawdawda',res.data.journey)
          }
          catch(ex)
          {
            console.error(ex);
          }
      }
    
    const diaDiemList =() =>[
            ...detail.stoplocal.map(stop => stop.id_DiaDiem),
        ].map(stop => ({
            ...stop,
            ThoiGianDuKien: detail.stoplocal.find(s => s.id_DiaDiem.id === stop.id)?.ThoiGianDuKien || ''
        }));

        
    

    const handleModalClose = (selectedStops) => {
        setModalVisible(selectedStops);
        if (selectedStops) {
            console.log("Selected Start Stop:", selectedStops.startStop);
            console.log("Selected End Stop:", selectedStops.endStop);
            // Xử lý việc thêm điểm dừng chân vào id_diemden tại đây
        }
    };
    useEffect(() => {
        loadDetailPost();

    }, []);
    return (
        <>
        {console.log('detail===undefined',detail===undefined)}
        {detail===undefined ? <ActivityIndicator/>: 
        
        <JourneyModal
            idPost={id_Post}
            visible={visible}
            onClose={handleModalClose}
            journey={detail}
            diaDiemList={diaDiemList()}
        />
        }
        </>
        
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 400,
        height: 600,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center',
    },
    infoText: {
        fontSize: 16,
        color:"black",
        marginBottom: 5,
        padding:3,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pickerContainer: {
        width: '50%',
    },
    selector: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginTop: 10,
        width: '100%',
        borderRadius: 5,
    },
    option: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 14,
        color: 'gray',
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});

export default ModalSelectJourney;
