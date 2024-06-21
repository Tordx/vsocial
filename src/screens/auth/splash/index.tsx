import { View, Text, ToastAndroid, Alert, Image } from 'react-native'
import React from 'react'
import { globalContainers } from '../../../styles'
import { theme } from '../../../assets/colors'
import { useNavigation } from '@react-navigation/native'
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { firebase } from '@react-native-firebase/auth'
import { fetchAppControl, fetchuser } from '../../../firebase/functions'
import { appcontrol, login, userdetails } from '../../../interface'
import { useDispatch } from 'react-redux'
import { setuserdata } from '../../../context/userslice'
import firestore from '@react-native-firebase/firestore'


const Splash = () => {

	const navigation = useNavigation()
	const dispatch = useDispatch()

	React.useEffect(() => {

		const unsubscribe = NetInfo.addEventListener(async (state) =>{
				try {			
					const result: appcontrol[] = await fetchAppControl() || []
					if(result[0].status == true){
						ToastAndroid.show('Under Maintenance', ToastAndroid.BOTTOM)
						return
					}
								if(state.isConnected === true) {
										const authCredentials = await AsyncStorage.getItem('login')
										console.log(authCredentials)
										if(authCredentials){
												const loginAuth = JSON.parse(authCredentials)
												const email = loginAuth.email
												const password = loginAuth.password
												const username = loginAuth.username
												await firebase.auth().signInWithEmailAndPassword(email, password).then(async(res) => {
														const userRef = firestore().collection('user').doc(res.user.uid);
														await userRef.update({
															lastLoggedIn: firebase.firestore.FieldValue.serverTimestamp()
														})
														const data: userdetails[] = await fetchuser(username)
														
														dispatch(setuserdata(data[0]))
														ToastAndroid.show("Auto-login success", ToastAndroid.BOTTOM)
														navigation.navigate('Tabs' as never)
														console.log('oy2')

												})
										} else {
												navigation.navigate('Login' as never)
												console.log('oy3')

										}
								} else {
										ToastAndroid.show("You are not connected to the internet", ToastAndroid.BOTTOM)
										navigation.navigate('Login' as never)
										console.log('oy')
										return
								}   
				} catch(error){
						ToastAndroid.show("Please check your internet connection", ToastAndroid.BOTTOM)
						navigation.navigate('Login' as never)
				}
		})

		return () => unsubscribe();

},[])

  return (
    <View style = {[globalContainers.container, {backgroundColor: theme.accenta}]}>
      <Image source={require('../../../assets/images/vsocial-white.png')} style = {{width: 200, height: 150}} resizeMode='contain' />
			<Text style = {{fontFamily: 'Montserrat-Light', color: '#fff', fontSize: 18}}>A Social Media Platform</Text>	
    </View>
  )
}

export default Splash