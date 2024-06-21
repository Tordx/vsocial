import React from 'react'
import { View, Pressable } from 'react-native'
import PostList from './contents/postlist'
import { globalContainers } from '../../../styles'
import  Icon  from 'react-native-vector-icons/MaterialCommunityIcons'
import { black, white } from '../../../assets/colors'
import { useNavigation } from '@react-navigation/native'
type Props = {}

export default function Posts({}: Props) {


  return (
   <View style = {globalContainers.container}>
    <PostList/>
    
   </View>
  )
}