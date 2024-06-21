import { View, Text, BackHandler } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Sales from '../../screens/home/sales'
import { useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { theme, transparent } from '../../assets/colors'
import Account from '../../screens/home/settings'
import { useSelector } from 'react-redux'
import { userdetails } from '../../interface'
import Posts from '../../screens/home/post'
import Plans from '../../screens/home/planners'
type Props = {}

const Tabs = (props: Props) => {

	const {userdata} = useSelector((action: userdetails) => action._userdata)

	const Tab = createBottomTabNavigator()


	useFocusEffect(() => {
    const exit = () =>{
      BackHandler.exitApp()
      return true
    }
    const handler = BackHandler.addEventListener('hardwareBackPress', exit)
      return() => handler.remove()
  })

  return (
    <Tab.Navigator
			screenOptions={() => ({
				tabBarShowLabel: false,
				tabBarStyle: { borderColor: transparent.level01, height: 50, position: 'absolute', bottom: 10, margin: 10, borderRadius: 10},
				tabBarIconStyle: { height: 20, justifyContent: 'center', alignItems: 'center' },
			})}
		>
		
				<Tab.Screen
				name = {'Post'}
				component={Posts}
				options={{
					headerShown: false,
					tabBarIcon: ({focused}) => (
            <>
            <Icon
            name = {'home-outline'}
						color = {focused ? theme.accenta :theme.accentd}
            size = {focused ?34 : 30}
          />
          </>
          )
				}}
			/>
				<Tab.Screen
					name = {'Plans'}
					component={Plans}
					options={{
						headerShown: false,
						tabBarIcon: ({focused}) => (
							<>
							<Icon
							name = {'calendar-edit'}
							color = {focused ? theme.accenta : theme.accentd}
							size = {focused ?32 : 26}
						/>
						</>
						)
					}}
				/>

				<Tab.Screen
					name = {'Chat'}
					component={Plans}
					options={{
						headerShown: false,
						tabBarIcon: ({focused}) => (
							<>
							<Icon
							name = {'comment-text-multiple-outline'}
							color = {focused ? theme.accenta : theme.accentd}
							size = {focused ?32 : 26}
						/>
						</>
						)
					}}
				/>
					<Tab.Screen
					name = {'Account'}
					component={Plans}
					options={{
						headerShown: false,
						tabBarIcon: ({focused}) => (
							<>
							<Icon
							name = {'account-circle-outline'}
							color = {focused ? theme.accenta : theme.accentd}
							size = {focused ?32 : 26}
						/>
						</>
						)
					}}
				/>
		</Tab.Navigator>
  )
}

export default Tabs

// comment-text-multiple-outline