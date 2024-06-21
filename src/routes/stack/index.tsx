import { View, Text, ToastAndroid } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack'
import Tabs from '../tabs'
import Login from '../../screens/auth/login'
import SalesDetails from '../../screens/home/sales/contents/salesdetail'
import Splash from '../../screens/auth/splash'
import { useSelector } from 'react-redux'
import { appcontrol, userdetails } from '../../interface'
import AddSales from '../../screens/home/sales/contents/add'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Add from '../../screens/home/planners/content/add'
import AddPost from '../../screens/home/post/contents/add'
export default function Stacks(){

    const Stack  = createStackNavigator()

    const navigation = useNavigation()
  
  useEffect(() => {
    const unsubscribe =  firestore().collection('appcontrol').onSnapshot((querySnapshot) => {
        const appcontrols: appcontrol[] = [];
        querySnapshot?.forEach((documentSnapshot) => {
            const data = documentSnapshot.data() as appcontrol;
            appcontrols.push(data);
        });
        if(appcontrols[0]?.status == true){
          navigation.navigate('Login' as never)
          ToastAndroid.show('App is currently under maintenance', ToastAndroid.BOTTOM)
          AsyncStorage.clear()
        }
        console.log(appcontrols)
    })
    return () => unsubscribe();
  }, [])

  return (
      <Stack.Navigator
        initialRouteName='Splash'
      >
      <Stack.Screen
            name='Splash'
            component={Splash}
            options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid
            }}
        />
      <Stack.Screen
            name='Login'
            component={Login}
            options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid
            }}
        />
        <Stack.Screen
            name='Tabs'
            component={Tabs}
            options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
            }}
        />
        <Stack.Screen
            name='SalesDetails'
            component={SalesDetails}
            options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
            }}
        />
        <Stack.Screen
            name='AddSales'
            component={AddSales}
            options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
            }}
        />
        <Stack.Screen
            name='Add'
            component={Add}
            options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
            }}
        />
        <Stack.Screen
            name='AddPost'
            component={AddPost}
            options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
            }}
        />
      </Stack.Navigator>
  )
}


