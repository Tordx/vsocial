import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from "@react-native-firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import {  CombinedData, postlist, userdetails } from '../../../../interface';
import { useNavigation } from '@react-navigation/native';
import { black, theme, white } from '../../../../assets/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image } from 'react-native';
import TimeAgo from 'react-native-timeago'
import PostDetails from './postdetails';

const PAGE_SIZE =  10

export default function PostList() {

    const {userdata} = useSelector((action: userdetails) => action._userdata)
    const [search, setsearch] = useState<string>('');
    const [data, setdata] = useState<CombinedData[]>([])
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [unfiltereddata, setunfiltereddata] = useState<CombinedData[]>([]);
		const [openImageModal, setOpenImageModal] = useState<boolean>(false)
		const [postlistdata, setpostlistdata] = useState<CombinedData | undefined>()
    const [pageIndex, setPageIndex] = useState<number>(0);
		const [refresh, setrefresh] = useState<boolean>(false)
		const [seemore, setseemore] = useState<boolean>(false)
    const navigation = useNavigation()
    const dispatch = useDispatch()

    useEffect(() => {
        const unsubscribe = firestore().collection('posts').onSnapshot(async (querySnapshot) => {
          const combinedData: CombinedData[] = [];
          for (const documentSnapshot of querySnapshot.docs) {
            const postData = documentSnapshot.data() as postlist;
            const userDataRef = firestore().collection('user').doc(postData.id);
            const userDataSnapshot = await userDataRef.get();
            const userData = userDataSnapshot.data() as userdetails;
      
            combinedData.push({ postData, userData });
          }
      
          const filterBySearch: CombinedData[] = combinedData.filter((item) => {
            const searchData = new RegExp(search, 'i');
            return searchData.test(item.postData.description);
          });
      
          const paginatedData = filterBySearch.slice(0, PAGE_SIZE);
          setdata(paginatedData);
          setunfiltereddata(filterBySearch);
          setdata(filterBySearch);
          setPageIndex(1);
					setrefresh(false)
        });
      
        return () => unsubscribe();
      }, [search, refresh]);

  const loadMoreData = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPageData = unfiltereddata.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);
    setTimeout(() => {
        setdata(prevData => [...prevData, ...nextPageData]);
        setLoadingMore(false);
        setPageIndex(prevIndex => prevIndex + 1);
    }, 1000); 
};

  const openImage = (item: CombinedData) => {

		setpostlistdata(item);
		setOpenImageModal(true)

	}
  
  const renderItem = ({ item, index }: { item: CombinedData, index: number }) => { 
		const timeInSeconds = item.postData.timestamp?._seconds || 0; 
    const date = new Date(timeInSeconds * 1000);
		return(

    <View style={styles.itemContainer}>
        <View style = {styles.itemCard}>
					<View style = {{justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row'}}>
						<Image source={{uri: item.userData?.photoURL || 'https://i.imgur.com/zPKzLoe.gif'}} resizeMode='cover' style = {{width: 30, height: 30, borderRadius: 10, marginRight: 10}} />
						<View  style = {{justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column'}}>
							<Text style = {{color: theme.accenta, fontFamily: 'Montserrat-Regular'}}>
								{item.userData.fullname.firstname + ' ' + item.userData.fullname.lastname}
							</Text>
							<View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
								<Icon name='clock-time-two-outline' color = '#707070' />
								<TimeAgo time={date} textStyle={{fontSize: 10, marginLeft: 2, fontFamily: 'Montserrat-Regular', color: '#707070'}} />
							</View>
						</View>
					</View>
					<View style = {{marginTop: 10}}>
					<Text style = {{fontSize: 12, marginLeft: 2, fontFamily: 'Montserrat-Regular', color: '#000'}}>{item.postData?.description.length < 50 ?  item.postData?.description : seemore ?  item.postData?.description :   item.postData?.description.slice(0,45) }{ item.postData?.description.length > 50 && <Text onPress={() => setseemore(!seemore)} style = {{color: theme.accenta, fontSize: 12, fontFamily: 'Montserrat-Medium'}} >{seemore ? '  see less' : '  see more'}</Text>}</Text>
					{item.postData.photo && 
						<Pressable onPress={() => openImage(item)}>
						<Image source={{uri: item.postData.photo || 'https://st2.depositphotos.com/1561359/12101/v/950/depositphotos_121012076-stock-illustration-blank-photo-icon.jpg'}} resizeMode='contain' style = {{width: '100%', height: 400, marginTop: item.postData.description == '' ? 0 : 10}} />
						</Pressable>
					}
					</View>
				</View>
    </View>
  );}

  return (
    <>
    <FlatList 
        data={data}
				style = {{width: '100%', height: '100%', paddingBottom: 300}}
        renderItem={renderItem}
        keyExtractor={(item) => item.postData.postid?.toString()}
        onEndReached={loadMoreData}
        showsVerticalScrollIndicator = {false}
				refreshControl={<RefreshControl onRefresh={() => setrefresh(true)} refreshing = {refresh}  />}
        ListHeaderComponent={<View style = {{justifyContent: 'center', alignItems: 'center', marginVertical: 20}}><Text style = {{fontSize: 20, fontFamily: 'Montserrat-Black', color: theme.accenta}}>Bits</Text>
        <Pressable onPress={() => navigation.navigate('AddPost' as never)} style = {{position: 'absolute', top: 0, right:20}}>
        <Icon name = 'plus' size={30} color={black.B001} />
        </Pressable>
        </View>}
        ListFooterComponent={<View style = {{height: 150, justifyContent: 'flex-start', alignItems: 'center'}}>{loadingMore && <ActivityIndicator style = {{paddingTop: 15}} size={40} color={theme.accenta} />}</View>}
        ListEmptyComponent={<View style = {{height: 150, justifyContent: 'flex-start', alignItems: 'center', marginTop: 10}}><Icon name='progress-clock' size={50} color={theme.accenta} /><Text style = {{color: theme.accenta, margin: 10}}>No Post yet</Text></View>}
    />
		<PostDetails visible = {openImageModal} onRequestClose={() => setOpenImageModal(false)}  data={postlistdata} />
    </>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,

  },
  headerText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: '#000',
    paddingLeft: 10,
		textAlign: 'left'
  },
  itemContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
    marginVertical: 2,
  },
  itemCard: {
    width: '98%',
    height: '100%',
    borderColor: theme.accenta,
		
    borderBottomWidth: 0.5,
		paddingVertical: 20
  },
  itemText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#000',
		
		textAlign: 'left'
  },
});
