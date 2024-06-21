import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableHighlight, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from "@react-native-firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import {  CombinedData, CombinedPlannerData, plannerlist, postlist, userdetails } from '../../../../interface';
import { useNavigation } from '@react-navigation/native';
import { theme, white } from '../../../../assets/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image } from 'react-native';
import TimeAgo from 'react-native-timeago'
import LinearGradient from 'react-native-linear-gradient';

const PAGE_SIZE =  10

type Props = {
 itemdata: (e: CombinedPlannerData) => void,
 visible : (e: boolean) => void,
}

export default function PlansList(props:Props) {

    const {userdata} = useSelector((action: userdetails) => action._userdata)
    const [search, setsearch] = useState<string>('');
    const [data, setdata] = useState<CombinedPlannerData[]>([])
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [unfiltereddata, setunfiltereddata] = useState<CombinedPlannerData[]>([]);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [refresh, setrefresh] = useState<boolean>(false)
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [currentdate, setcurrentdate] = useState<string>('')

    useEffect(() => {
        const unsubscribe = firestore().collection('plans').onSnapshot(async (querySnapshot) => {
          const combinedData: CombinedPlannerData[] = [];
          for (const documentSnapshot of querySnapshot.docs) {
            const planData = documentSnapshot.data() as plannerlist;
            const userDataRef = firestore().collection('user').doc(planData.id);
            const userDataSnapshot = await userDataRef.get();
            const userData = userDataSnapshot.data() as userdetails;
        
            const planDate = new Date().toLocaleString()
            console.log(planData.when)
            console.log(new Date().toLocaleString(), 'ha',planDate)
            if (planDate >= planDate) {
              combinedData.push({ planData, userData });
            }
          }
    
          setdata(combinedData);
          setPageIndex(1);
          setrefresh(false);
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

    const getCurrentDayAndDate = () => {
    const options = { weekday: 'long', day: 'numeric' } as const;
    const currentDate = new Date();
    return currentDate.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    const dayAndDate = getCurrentDayAndDate();
    const separate = dayAndDate.split(' ')
    const newDayAndDateFormat = `${separate[1].toUpperCase()}${' '} ${separate[0]}`
    setcurrentdate(newDayAndDateFormat);
  }, []);

  const viewDetails = (item: CombinedPlannerData) => {
    props.itemdata(item)
    props.visible(true)

  }
  
  const renderItem = ({ item, index }: { item: CombinedPlannerData, index: number }) => { 
		const user = item.userData
        const plan = item.planData
		return(

    <TouchableOpacity  onPress={() =>viewDetails(item)} style={styles.itemContainer}>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 6 }}  style = {styles.itemCard} colors={plan.success ? ['#e81416','#ffa500','#faeb36','#79c314', '#487de7', '#4b369d', '#70369d']: plan.when > new Date().toLocaleDateString() ?   [white.W001, white.W001] :  ['#e81416', '#e81416']  }>
        <View  >
           <View style = {{margin: 2, marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
           <View style = {{margin: 2,}}>
            <Text style = {{fontSize: 14, fontFamily: 'Montserrat-Black', textShadowColor: 'grey', textShadowOffset: {width: 1, height: 1}, textShadowRadius: .5, color: plan.success ? white.W001 : plan.when > new Date().toLocaleDateString() ?    theme.accenta :  white.W001}}>{user?.fullname?.firstname}</Text>
            <Text style = {{fontSize: 16, fontFamily: 'Montserrat-Black', textShadowColor: 'grey', textShadowOffset: {width: 1, height: 1}, textShadowRadius: .5, color: plan.success ? white.W001 :  plan.when > new Date().toLocaleDateString() ?   theme.accenta :  white.W001 }}>{item.planData.title.slice(0, 6)}</Text>
            </View>
            <Text style = {{fontSize: 16, fontFamily: 'Montserrat-Black', textShadowColor: 'grey', textShadowOffset: {width: 1, height: 1}, textShadowRadius: .5, color: plan.success ?white.W001 :  plan.when > new Date().toLocaleDateString() ?   theme.accenta :  white.W001}}>{item.planData.when}</Text>
           </View>
           
        </View>
        
        </LinearGradient>
    </TouchableOpacity>
  );}

  return (
    <>
    <FlatList 
        data={data}
				style = {{width: '100%', height: '100%', paddingBottom: 300}}
        renderItem={renderItem}
        keyExtractor={(item) => item.planData.planid?.toString()}
        onEndReached={loadMoreData}
				refreshControl={<RefreshControl onRefresh={() => setrefresh(true)} refreshing = {refresh}  />}
        ListHeaderComponent={
            <View style = {{justifyContent: 'flex-start', alignItems: 'center', marginVertical: 20}}>
                <Text style = {{fontSize: 20, fontFamily: 'Montserrat-Black', color: theme.accenta}}>Sketches</Text>
                <Text style = {{ fontSize: 35, fontFamily: 'Montserrat-Light', color: theme.accenta, marginTop: 20}}> {currentdate}</Text>

            </View>
        }
        ListFooterComponent={<View style = {{height: 150, justifyContent: 'flex-start', alignItems: 'center'}}>{loadingMore && <ActivityIndicator style = {{paddingTop: 15}} size={40} color={theme.accenta} />}</View>}
        ListEmptyComponent={<View style = {{height: 150, justifyContent: 'flex-start', alignItems: 'center', marginTop: 40}}><Icon name='progress-clock' size={35} color={theme.accenta} /><Text style = {{color: theme.accenta, margin: 10}}>No Sketches</Text></View>}
    />
    
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
    marginVertical: 5,
  },
  itemCard: {
    width: '98%',
    height: '100%',
    backgroundColor: '#fff',
    elevation: 5,
    paddingVertical: 20,
    borderRadius: 10,
    flexDirection: 'column'
  },
  itemText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#000',
		
		textAlign: 'left'
  },
});
