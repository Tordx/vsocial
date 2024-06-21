import React, { useState } from 'react'
import { Pressable, View } from 'react-native'
import { globalContainers } from '../../../styles'
import PlansList from './content/plans'
import PlanDetails from './content/plandetails'
import { CombinedPlannerData } from '../../../interface'
import  Icon  from 'react-native-vector-icons/MaterialCommunityIcons'
import { black } from '../../../assets/colors'
import { useNavigation } from '@react-navigation/native'

type Props = {}

export default function Plans({}: Props) {

    const [detailsvisible, setdetailsvisible] = useState<boolean>(false)
    const navigation = useNavigation()
    const [itemdata, setitemdata] = useState<CombinedPlannerData>({
      userData: {
        _userdata: '',
        email: '',
        username: '',
        active: false,
        status: '',
        photoURL: '',
        id: '',
        fullname: {
          firstname: '', 
          middlename: '', 
          lastname: ''
        },
        lastloggedIn: '',
      },
      planData: {
        id: '',
        planid: '',
        description: '',
        photo: '',
        timestamp: null,
        when: '',
        title: '',
        importance: '',
        active: false,
        success: false,
      },
    })

  return (
   <View style = {globalContainers.container}>
    <PlansList visible={(e) => setdetailsvisible(e)}  itemdata={(e) => setitemdata(e)}/>
    <PlanDetails data={itemdata} visible = {detailsvisible} onRequestClose={() => setdetailsvisible(false)} onPress={() => setdetailsvisible(false)}/>
    <Pressable onPress={() => navigation.navigate('Add' as never)} style = {{position: 'absolute', top: 20, right: 20}}>
      <Icon name = 'plus' size={30} color={black.B001} />
    </Pressable>
   </View>
  )
}