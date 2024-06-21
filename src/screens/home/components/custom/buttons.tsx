import { ColorValue, Pressable, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { theme } from '../../../../assets/colors'

type floatingbutton = {
	onPress: () => void,
}

export const FloatingButton = ({onPress}: floatingbutton) => {
  return (
    <TouchableOpacity 
			onPress={onPress}
			style = {{backgroundColor: '#fff', borderRadius: 15, elevation: 5, position: 'absolute', bottom: '12%', right: '5%', width: 125, height: 125, justifyContent: 'center', alignItems: 'center'}}>
        <Icon 
            name = 'cart-plus'
            color={theme.accenta}
            size={60}
        />
				<Text style = {{color: theme.dark, fontFamily: 'Montserrat-Bold', fontSize: 12}} >ADD SALES</Text>
    </TouchableOpacity>
  )
}

type smallbutton = {
	onPress: () => void,
  title: string,
  icon: string,
  ViewStyle: ViewStyle,
  iconColor: ColorValue,
  textStyle: TextStyle
}


export const SmallButton = ({onPress,title, icon, ViewStyle, iconColor, textStyle}: smallbutton) => {
  return (
    <TouchableOpacity 
			onPress={onPress}
			style = {[{backgroundColor: '#fff', borderRadius: 15, elevation: 5, width: 75, height: 75, justifyContent: 'center', alignItems: 'center'}, ViewStyle]}>
        <Icon 
            name = {icon || 'blank'}
            color={iconColor ||theme.accenta}
            size={30}
        />
				<Text style = {[{color: theme.dark, fontFamily: 'Montserrat-Bold', fontSize: 12}, textStyle]} >{title}</Text>
    </TouchableOpacity>
  )
}

type globalbutton = {
  onPress: () => void,
  title: string,

}

export const GlobalButton = ({onPress, title}: globalbutton) => {

  return (
    <TouchableOpacity 
      onPress={onPress}
      style = {{backgroundColor: theme.accenta, width: '90%', height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginVertical: 15}}
    >
      <Text style = {{fontFamily: 'Montserrat-Bold', color: '#fff', fontSize: 14}}>{title}</Text>
    </TouchableOpacity>
  )

}

export const UploadButton = ({onPress, title}: globalbutton) => {

  return (
    <TouchableOpacity 
      onPress={onPress}
      style = {{backgroundColor: '#fff', borderWidth: 1, borderStyle: 'dashed', borderColor: '#000', width: '90%', height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginVertical: 15}}
    >
      <Text style = {{fontFamily: 'Montserrat-Bold', color: '#000', fontSize: 14}}>{title}</Text>
    </TouchableOpacity>
  )

}


type exitprops = {
  onPress: () => void
}

export const ExitButton = (props: exitprops) => {

  return (
    <TouchableOpacity 
      onPress={props.onPress}
      style = {{paddingLeft: 10}}
    >
      <Icon
        name = 'chevron-left'
        size={40}
        color={'#000'}
      />
    </TouchableOpacity>
  )

}