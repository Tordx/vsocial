import { BackHandler, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FloatingButton } from '../components/custom/buttons'
import { globalContainers } from '../../../styles'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import SalesList from './contents/data'
import { Keyboard } from 'react-native'

type Props = {}

const Sales = (props: Props) => {

  const navigation = useNavigation()
  const [hide, sethide] = useState(false)
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
     sethide(false)
    });

    return () => {
      keyboardDidHideListener.remove(); // Remove the event listener when component unmounts
    };
  }, []);
  return (
    <View style = {{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
        
    }}>
      <SalesList hide = {(e) => sethide(e)}/>
     {!hide && <FloatingButton
        onPress={() => {navigation.navigate('AddSales' as never)}}
      />}
    </View>
  )
}

export default Sales
