import { View, Text, TextInput, TextInputFocusEventData, TextInputProps } from 'react-native'
import React from 'react'
import { NativeSyntheticEvent } from 'react-native'
import { theme } from '../../../../assets/colors'
import  Icon  from 'react-native-vector-icons/MaterialCommunityIcons'
import { IconProps } from 'react-native-vector-icons/Icon'
import { TouchableOpacity } from 'react-native-gesture-handler'

type Props = {

    onChangeText: (e: string) => void,
    value: string | undefined,
    placeholder: string
    onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void,
    onFocus: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void,
    onPress?: () => void,
    exit?: boolean

}

export const SearchField = ({onChangeText, value, placeholder, onBlur, onFocus, onPress, exit}: Props) => {
  return (
    <View style = {{width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
     {exit && <TouchableOpacity onPress={onPress} style = {{paddingLeft: 10}}>
        <Icon
          name='chevron-left'
          size={40}
          color={'#000'}
        />
      </TouchableOpacity>
    }
      <View style = {{width:exit ?  '80%' : '95%', height: 40, borderRadius: 5, borderWidth: .5, backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'center', margin: 20}}>
        <TextInput
          style = {{width: '95%', height: '100%', color: '#000'}}
          onChangeText={onChangeText}
          value = {value}
          placeholder={placeholder}
          onBlur={onBlur}
          onFocus={onFocus}
          
        />
      </View>
    </View>
  )
}

type GlobalFieldProp = {
  title?: string | undefined,
  onChangeText: (text: string) => void;
    value: string | undefined | undefined,
  placeholder: string | undefined,
  name?: string | undefined,
  secureTextEntry?: boolean | undefined,
  onPress?: () => void,
  disabled?: boolean,
  onFocus?: () => void,
  onBlur?: () => void,
  maxLength?: number,
}

export const GlobalField = ({
      title, 
      onChangeText, 
      value, 
      placeholder, 
      name, 
      secureTextEntry,
      onPress,
      disabled,
      onFocus,
      onBlur,
      maxLength
    }: GlobalFieldProp) => {

    return (
      <View 

        style = {{width: '100%',justifyContent: 'center', alignItems: 'center', borderRadius: 5, flexDirection: 'column', marginVertical: 5}}
      >
        <Text style = {{fontFamily: 'Montserrat-Medium', color: '#000', fontSize: 14, width: '90%'}}>{title}</Text>
        <View 
        style = {{marginVertical: 3, borderColor: theme.accenta, borderBottomWidth: .5,  width: '90%', height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 5, flexDirection: 'row'}}
        >
        <TextInput
          style = {{paddingLeft: 15, width: '100%', height: '100%', color: '#000', fontFamily: 'Montserrat-Regular'}}
          onChangeText={onChangeText}
          value = {value}
          placeholder={placeholder}
          onFocus = {onFocus}
          onBlur={onFocus}
          secureTextEntry = {secureTextEntry}
          maxLength={maxLength}

        />
            <Icon
              onPress={onPress}
              disabled = {disabled}
              name = {name || 'blank'}
              size={25}
              color={'#c9c9c9'}
              style = {{position: 'absolute', right: 10}}
             />
        </View>
        
      </View>
    )
  
}

export const GlobalDescriptionField = ({
  title, 
  onChangeText, 
  value, 
  placeholder, 
  name, 
  secureTextEntry,
  onPress,
  disabled,
  onFocus,
  onBlur,
  maxLength
}: GlobalFieldProp) => {

return (
  <View 

    style = {{width: '100%',justifyContent: 'center', alignItems: 'center', borderRadius: 5, flexDirection: 'column', marginVertical: 5}}
  >
    <Text style = {{fontFamily: 'Montserrat-Medium', color: '#000', fontSize: 14, width: '90%'}}>{title}</Text>
    <View 
    style = {{marginVertical: 3, borderColor: theme.accenta, borderBottomWidth: .5,  width: '90%', height: 100, justifyContent: 'flex-start', alignItems: 'center', borderRadius: 5, flexDirection: 'row'}}
    >
    <TextInput
      style = {{paddingLeft: 10, width: '90%', height: '100%', color: '#000', fontFamily: 'Montserrat-Regular', textAlignVertical: 'top'}}
      onChangeText={onChangeText}
      value = {value}
      placeholder={placeholder}
      onFocus = {onFocus}
      onBlur={onFocus}
      secureTextEntry = {secureTextEntry}
      maxLength={maxLength}
      multiline

    />
        <Icon
          onPress={onPress}
          disabled = {disabled}
          name = {name || 'blank'}
          size={25}
          color={'#c9c9c9'}
          style = {{position: 'absolute', right: 10}}
         />
    </View>
    
  </View>
)

}

