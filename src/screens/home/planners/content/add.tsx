import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { globalContainers } from '../../../../styles'
import { theme } from '../../../../assets/colors'
import { GlobalField } from '../../components/custom/fields'
import { plannerlist, postlist } from '../../../../interface'
import { GlobalButton, UploadButton } from '../../components/custom/buttons'

type Props = {}

const Add = (props: Props) => {

	const [form, setform] = useState<plannerlist>({
		id: '',
    planid: '',
    description: '',
    photo: '',
    timestamp: new Date(),
    when: '',
    title: '',
    importance: '',
    active: true,
    success: false,
	})

  return (
    <View style = {globalContainers.container}>
			<ScrollView style = {{width: '100%', height: '100%'}}>
				<View style = {globalContainers.innerScrollContainer}>
					<Text style = {{fontSize: 20, fontFamily: 'Montserrat-Black', color: theme.accenta, marginTop: 20}}>Add Sketch</Text>
					<View style = {{height: 50}} />
					<GlobalField
						onChangeText={(e) => {
							setform((prev) => ({
									...prev,
									title: e,
							}))
						}}
						title= {'Title'}
						value = {form.title}
						placeholder={'add title'}
						name = {'format-title'}
						disabled
						maxLength={20}
							
					/>
					<GlobalField
						onChangeText={(e) => {
							setform((prev) => ({
									...prev,
									description: e,
							}))
						}}
						title= {'Description'}
						value = {form.description}
						placeholder={'add description'}
						name = {'subtitles-outline'}
						disabled
						maxLength={50}
							
					/>
					<GlobalField
						onChangeText={(e) => {
							setform((prev) => ({
									...prev,
									importance: e,
							}))
						}}
						title= {'Importance'}
						value = {form.importance}
						placeholder={'Low, Medium, High'}
						name = {'alert-circle-outline'}
						disabled
							
					/>
					<UploadButton
						
						onPress={() => {}}
						title = 'UPLOAD PHOTO'
					/>
				</View>
				
			</ScrollView>
    </View>
  )
}

export default Add