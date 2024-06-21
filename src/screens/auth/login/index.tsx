import { View, Text, ScrollView, Alert, BackHandler, Image } from 'react-native'
import React, { useState } from 'react'
import { globalContainers } from '../../../styles'
import { GlobalButton } from '../../home/components/custom/buttons'
import { GlobalField } from '../../home/components/custom/fields'
import { appcontrol, login, userdetails } from '../../../interface'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { fetchAppControl, fetchuser, getSalesDetails } from '../../../firebase/functions'
import auth, {firebase } from "@react-native-firebase/auth"
import { useDispatch } from 'react-redux'
import { setuserdata } from '../../../context/userslice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore'
export default function Login () {


	useFocusEffect(() => {
    const exit = () =>{
      BackHandler.exitApp()
      return true
    }
    const handler = BackHandler.addEventListener('hardwareBackPress', exit)
      return() => handler.remove()
  })

	const version = '0.0.1'
	const navigation = useNavigation()
	const dispatch = useDispatch();
	const [focususername, setfocususername] = useState<boolean>(false)
	const [focuspassword, setfocuspassword] = useState<boolean>(false)

	const [pressed, setpressed] = useState(true);
	const [form, setform] = useState<login>({
			username:'',
			password: '',
	})

	const login = async() => {
		if(form.username == ''){
			Alert.alert('', 'Store ID must not be empty')
			return
		}
		if(form.password == ''){
			Alert.alert('', 'Passcode must not be empty')
			return
		}
		try {

			const result: userdetails[] =  await fetchuser(form.username) || []
			const resultObj = result[0]
			const appresult: appcontrol[] = await fetchAppControl() || []

			if (appresult[0].status == true){
				Alert.alert('', 'You are unauthorized to login')
				return
			}
			
			
			if(resultObj == null){
				console.log('error: account not found')
				Alert.alert('', 'Credentials not found')
			} else {
				const email = resultObj.email  
				const username = form.username
				const password = form.password
				await auth().signInWithEmailAndPassword(resultObj.email, form.password)
				.then(async(res) => {
					const userRef = firestore().collection('user').doc(res.user.uid);
					await userRef.update({
						lastLoggedIn: firebase.firestore.FieldValue.serverTimestamp()
					})
					AsyncStorage.setItem('login', JSON.stringify({email, password, username}))
					dispatch(setuserdata(resultObj))
					navigation.navigate('Tabs' as never)
				}).catch((err) => {
					if(err == 'Error: [auth/invalid-credential] The supplied auth credential is incorrect, malformed or has expired.'){
						Alert.alert('', 'Credentials not matched')
					}
					console.log(err)
				}) 
			}
			
		} catch(error){
			console.error(error)
		}
	}

  return (
		<View style = {globalContainers.container}>
			<ScrollView style = {{width: '100%', paddingTop: '30%', height: '100%', paddingBottom: '5%'}}>
				<View style = {globalContainers.container}>
					<Image source={require('../../../assets/images/vsocial.png')} style = {{width: 200, height: 150}} resizeMode='contain' />
					<Text style = {{fontFamily: 'Montserrat-Light', color: '#000', fontSize: 18}}>A Social Media Platform</Text>
					<Text style = {{fontFamily: 'Montserrat-LightItalic', color: '#a1a1a1', fontSize: 14, marginBottom: 75}}>{version}</Text>
						<GlobalField
								onChangeText={(e) => {
									setform((prev) => ({
											...prev,
											username: e,
									}))
								}}
								onFocus = {() => {setfocususername(!focususername)}}
								title= {focususername ? 'username' : '' || !focususername && form.username.length > 0 ? 'username' : ''}
								value = {form.username}
								placeholder={focususername ? '' : 'USERNAME'}
								name = {'account-outline'}
								disabled
								
						/>
						<GlobalField
								onChangeText={(e) => {
									setform((prev) => ({
											...prev,
											password: e,
									}))
								}}
								value = {form.password}
								onFocus = {() => {setfocuspassword(!focuspassword)}}
								title= {focuspassword ? 'password' : '' || !focuspassword && form.password.length > 0 ? 'password' : ''}
								placeholder={focuspassword ? '': 'PASSWORD'}
								name={pressed ? 'eye-off' : 'eye'}
								disabled = {false}
								onPress={() => setpressed(!pressed)}
								secureTextEntry = {pressed}
								
						/>
						<GlobalButton
								onPress={login}
								title='Sign In'
						/>
					<View style = {{height: 50}}/>
				<Text style = {{fontFamily: 'Montserrat-LightItalic', color: '#a1a1a1', fontSize: 14, marginTop: '20%'}}>
				Powered by vsodev.tech
			</Text>
				</View>
			</ScrollView>
			
		</View>
  )
}
