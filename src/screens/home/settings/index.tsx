import { Button, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalContainers } from '../../../styles'
import { firebase } from '@react-native-firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import { setuserdata } from '../../../context/userslice'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GlobalButton } from '../components/custom/buttons'
import { sales, userdetails } from '../../../interface'
import firestore from '@react-native-firebase/firestore'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { theme } from '../../../assets/colors'

type Props = {}

const Account = (props: Props) => {

  const {userdata} = useSelector((action: userdetails) => action._userdata)
  const dispatch = useDispatch();
  const [userdetails, setuserdetails] = useState<userdetails>();
  const [sales, setsales] = useState<sales[]>([])
  const navigation = useNavigation()

  const logout = async() => {
    try {
      await firebase.auth().signOut().then((res) => {
        dispatch(setuserdata([]));
        AsyncStorage.clear()
        navigation.navigate('Login' as never)
        ToastAndroid.show('Logged out successfully', ToastAndroid.BOTTOM)

      })
    } catch(error){

    }
  }

  useEffect(() => {
    const unsubscribe =  firestore().collection('user').where('active', '==', true).onSnapshot((querySnapshot) => {
        const inventoryData: userdetails[] = [];
        querySnapshot?.forEach((documentSnapshot) => {
            const data = documentSnapshot.data() as userdetails;
            if(data.uid === userdata.uid){
            inventoryData.push(data);}
        });
        setuserdetails(inventoryData[0])
        dispatch(setuserdata(inventoryData[0]));
        if(inventoryData[0]?.restrict){
          logout()
        }
    })
    return () => unsubscribe();
  }, [])

  useEffect(() => {
    const unsubscribe =  firestore().collection('sales').where('staffId', '==', userdata.uid).onSnapshot((querySnapshot) => {
        const inventoryData: sales[] = [];
        querySnapshot?.forEach((documentSnapshot) => {
            const data = documentSnapshot.data() as sales;
            inventoryData.push(data);
        });

        setsales(inventoryData)
    })
    return () => unsubscribe();
  }, [])

  const salesToday: sales[] = sales.filter((item) => {
    const salesDate = item?.date instanceof firestore.Timestamp ? item.date.toDate() : null;
    
    if (salesDate) {
      const today = new Date();
      return salesDate.getDate() === today.getDate() &&
             salesDate.getMonth() === today.getMonth() &&
             salesDate.getFullYear() === today.getFullYear();
    }
    
    return false; 
  });

  return (
    <View style = {globalContainers.container}>
      <Text style = {{fontFamily: 'Montserrat-Black', color: '#000', fontSize: 50}}>{userdetails?.staff}</Text>
      <Text style = {{fontFamily: 'Montserrat-Regular', color: '#000', fontSize: 18, marginBottom: 50}}>{userdetails?.branch}</Text>
      <View style = {{width: '100%', height: 75,  justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#d9d9d9'}}>
          <Text style = {{fontFamily: 'Montserrat-Regular', color: '#000', fontSize: 18, marginLeft: '5%'}}>Sales Made Today: <Text style = {{fontFamily: 'Montserrat-Bold', color: theme.accenta}}>{salesToday.length}</Text></Text>
      </View>
      <View style = {{width: '100%', height: 75,  justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#fff'}}>
          <Text style = {{fontFamily: 'Montserrat-Regular', color: '#000', fontSize: 18, marginLeft: '5%'}}>All Sales Made: <Text style = {{fontFamily: 'Montserrat-Bold', color: theme.accenta, marginBottom: 50}}>{sales.length}</Text></Text>
      </View>
      <View style = {{width: '100%', height: 75,  justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#d9d9d9', marginBottom: 50}}>
        <Text style = {{fontFamily: 'Montserrat-Regular', color: '#000', fontSize: 18,  marginLeft: '5%'}}>Last Logged In: <Text style = {{fontFamily: 'Montserrat-Bold', color: theme.accenta, marginBottom: 50}}>{userdetails?.lastLoggedIn instanceof firestore.Timestamp ? userdetails.lastLoggedIn.toDate().toLocaleString() : ''}</Text></Text>
      </View>
      <GlobalButton
      title = 'Logout'
      onPress={logout}
      />
    </View>
  )
}

export default Account

const styles = StyleSheet.create({})