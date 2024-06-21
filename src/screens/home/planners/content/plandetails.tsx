import { View, Text, Modal, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { globalContainers } from '../../../../styles'
import { CombinedPlannerData, plannerlist, userdetails } from '../../../../interface'
import { theme, white } from '../../../../assets/colors'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type Props = {

	visible: boolean,
	onRequestClose: () => void,
	data: CombinedPlannerData,
	onPress: () => void,

}

const PlanDetails = (props: Props) => {

	const plan = props.data.planData as plannerlist
	const user = props.data.userData as userdetails
  return (
    <Modal animationType='slide' visible = {props.visible} onRequestClose={props.onRequestClose}>
      <LinearGradient colors={plan.success ? ['#e81416','#ffa500','#faeb36','#79c314', '#487de7', '#4b369d', '#70369d']: plan.when > new Date().toLocaleDateString() ?   [white.W001, white.W001] :  ['#e81416', '#e81416']  } style = {[globalContainers.container]}>
				<ScrollView style = {{width: '100%', height: '100%'}}>
					<View style = {globalContainers.innerScrollContainer}>
						<View style = {{padding: 2, marginTop: 20, width: '100%', justifyContent: 'center', alignItems: 'center',}}>
						<Text style = {{fontSize: 30, fontFamily: 'Montserrat-Black', textShadowColor: 'grey', textShadowOffset: {width: 1, height: 1}, textShadowRadius: .5, color: plan.success ? white.W001 : plan.when > new Date().toLocaleDateString() ?    theme.accenta :  white.W001}}>{props.data?.planData.title}</Text>
						<Text style = {{marginTop: 30, marginLeft: 20, textAlign: 'left', alignSelf: 'flex-start',fontSize: 25, fontFamily: 'Montserrat-Regular', textShadowColor: 'grey', textShadowOffset: {width: 1, height: 1}, textShadowRadius: .5, color: plan.success ? white.W001 : plan.when > new Date().toLocaleDateString() ?    theme.accenta :  white.W001}}>{props.data?.planData.description}</Text>
						</View>
					</View>
				</ScrollView>
				<Pressable onPress={props.onPress} style = {{position: 'absolute', top: 10, right: 10}}>
				<Icon name = 'close' size={30} color={white.W001} />
			</Pressable>
			</LinearGradient>
		
    </Modal>
  )
}

export default PlanDetails