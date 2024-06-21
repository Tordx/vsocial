import { View, Text, ScrollView, Pressable, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalContainers } from '../../../../styles'
import { black, theme } from '../../../../assets/colors'
import { GlobalDescriptionField, GlobalField } from '../../components/custom/fields'
import { plannerlist, postlist, userdetails } from '../../../../interface'
import { GlobalButton, UploadButton } from '../../components/custom/buttons'
import  Icon  from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import firestore  from '@react-native-firebase/firestore'
import { generateRandomKey } from '../../../../lib'
import { uploadImageToFirebase } from '../../../../firebase/functions'
import { useSelector } from 'react-redux'

type Props = {}

const AddPost = (props: Props) => {

    const navigation = useNavigation()
    const [transfer, setTransferred] = useState(0)
    const {userdata} = useSelector((action: userdetails) => action._userdata)
	const [form, setform] = useState<postlist>({
        postid: '',
        photo: '',
        id: '',
        description: '',
        timestamp: '',
	})

    const getPhoto = (option: number) => {
        if (option == 0){
            launchCamera({mediaType: 'photo'}).then((res: any) => {
                const result = res.assets[0]
                console.log(result.uri)
                setform(prev => ({...prev, photo: result.uri}))
            })
           
        } else if (option == 1) {
            launchImageLibrary({mediaType: 'photo'}).then((res: any) => {
                const result = res.assets[0]
                console.log(result.uri)
                setform(prev => ({...prev, photo: result.uri}))
            })
        }
    }

    useEffect(() => {
        console.log(form.photo)
    },[form])

    const submit = async() => {

        try {

            const id = generateRandomKey(20)
            const result = await uploadImageToFirebase(form.photo, setTransferred) || ''
            firestore().collection('posts').doc(id).set({
                postid: id,
                photo: result,
                id: userdata.id,
                description: form.description,
                timestamp: new Date(),
            })
        } catch(err: any){
            console.log(err)
            Alert.alert('', 'something went wrong.')
        }
    }

  return (
    <View style = {globalContainers.container}>
			<ScrollView style = {{width: '100%', height: '100%'}}>
				<View style = {globalContainers.innerScrollContainer}>
					<Text style = {{fontSize: 20, fontFamily: 'Montserrat-Black', color: theme.accenta, marginTop: 20}}>Add Post</Text>
					<View style = {{height: 50}} />
					<GlobalDescriptionField
						onChangeText={(e) => {
							setform((prev) => ({
									...prev,
									description: e,
							}))
						}}
						title= {'Description'}
						value = {form.description}
						placeholder={'Share the latest bit...'}
						name = {'bullhorn-variant-outline'}
						disabled
						maxLength={200}
							
					/>
                    <Text style = {{alignSelf: 'flex-start', marginLeft: 25, fontSize: 12, marginBottom: 10, color: theme.accenta, fontFamily: 'Montserrat-Light'}}>Select Image (can only select or capture one(1))</Text>
                    <View style = {{width: '85%', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center'}}>
                        <Pressable
                            onPress={() => getPhoto(0)}
                            style = {{marginRight: 10, width: 30, height: 30, borderWidth: 1, borderColor: theme.accenta, borderRadius: 100, justifyContent: 'center', alignItems: 'center',}}>
                            <Icon name = 'camera' size={15} color={theme.accenta}/>
                        </Pressable>
                        <Pressable
                            onPress={() => getPhoto(1)}
                            style = {{ width: 30, height: 30, borderWidth: 1, borderColor: theme.accenta, borderRadius: 100, justifyContent: 'center', alignItems: 'center',}}>
                            <Icon name = 'image' size={15} color={theme.accenta}/>
                        </Pressable>
                    </View>
				
                    {form.photo == '' ? 
                    <View style = {{height: 150}} /> 
                    :
                    <Image source={{uri: form?.photo}} style = {{width: '100%', height: 500, marginTop: 10, borderRadius: 10}} resizeMode='contain' />
                    }
                    <GlobalButton 
                        title= {'Post Bit'}
                        onPress={submit}
                    />
                     <Pressable onPress={() => navigation.goBack()} style = {{position: 'absolute', top: 20, left:20}}>
                    <Icon name = 'chevron-left' size={30} color={black.B001} />
                    </Pressable>
				</View>
			</ScrollView>
    </View>
  )
}

export default AddPost