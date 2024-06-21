
import React, { useEffect } from 'react'
import Stacks from './src/routes/stack'
import {Provider} from 'react-redux'
import store from './src/context/store'
import { StatusBar, ToastAndroid } from 'react-native'
import { theme } from './src/assets/colors'
import firestore from '@react-native-firebase/firestore'
import { userdetails } from './src/interface'
import { NavigationContainer, useNavigation } from '@react-navigation/native'

function App (){

  return (
    <NavigationContainer>
      <Provider store = {store} >
        <StatusBar backgroundColor={theme.accenta} barStyle={'light-content'} />
        <Stacks/>
      </Provider>
    </NavigationContainer>
  )
}

export default App