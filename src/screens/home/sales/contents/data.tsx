import { View, Text, FlatList, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { sales, userdetails } from '../../../../interface'
import { SearchField } from '../../components/custom/fields'
import { theme } from '../../../../assets/colors'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { setItemId } from '../../../../context/itemslice'
import firestore, { firebase } from '@react-native-firebase/firestore'
type Props = {

	hide: (e: boolean) => void,
}


const SalesList = ({hide}: Props) => {

	const {userdata} = useSelector((action: userdetails) => action._userdata)
	const [search, setsearch] = useState<string>('');
	const [data, setdata] = useState<sales[]>([])
	const navigation = useNavigation()
	const dispatch = useDispatch()
	const viewTicket = (id: sales) => {
		try {
			
			dispatch(setItemId(id))
			navigation.navigate('SalesDetails' as never)
			console.log
		} catch(error) {
			console.error(error)
		}
	}

  useEffect(() => {
    const unsubscribe =  firestore().collection('sales').orderBy('transId', "desc").onSnapshot((querySnapshot) => {
        const inventoryData: sales[] = [];
        querySnapshot?.forEach((documentSnapshot) => {
            const data = documentSnapshot.data() as sales;
            data.docId = documentSnapshot.id;
            inventoryData.push(data);
        });
         
        const filterbysearch: sales[] = inventoryData.filter((item) =>{
          const searchdata = new RegExp(search, 'i')
  
          // Check if dateObject is a valid Date object
          const dateString = item.date instanceof firestore.Timestamp ? item.date.toDate().toLocaleDateString('en-US') : ''
          return searchdata.test(item.transId?.toString()) || searchdata.test(dateString)
        })
        const filterbybranch: sales[] = filterbysearch.filter((item) => {
          return item.branch === userdata.branch
        })
        setdata(filterbybranch);
    })
    return () => unsubscribe();
}, [search])

  const renderItem = ({ item, index }: { item: sales, index: number }) => (
    <TouchableOpacity onPress={() => viewTicket(item)} style={[styles.itemContainer, { backgroundColor: index % 2 === 0 ? '#d9d9d9' : '#fff' }]}>
      <Text style={[styles.itemText, { width: '25%' }]}>  {item.date instanceof firestore.Timestamp ? item.date.toDate().toLocaleDateString('en-US') : ''}</Text>
      <Text style={[styles.itemText, { width: '30%' }]}>{item.transId}</Text>
      <Text style={[styles.itemText, { width: '30%' }]}>{item.noitem}</Text>
      <Text style={[styles.itemText, { width: '15%', textAlign: 'center' }]}>₱{item.total}</Text>
    </TouchableOpacity>
  );

  return (
    <>
    <FlatList 
        data={data}
				style = {{width: '100%', height: '100%'}}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No Sales Record yet</Text>}
        ListHeaderComponent={
					<View style={styles.headerContainer}>
						<SearchField
							onBlur={() => {hide(false)}}
							onFocus={() => {hide(true)}}
							onChangeText={(e) => setsearch(e)}
							value= {search}
							placeholder='Search'
						/>
						<View style={styles.headerRow}>
							<Text style={[styles.headerText, { width: '20%',  textAlign: 'left'  }]}>Date</Text>
							<Text style={[styles.headerText, { width: '30%' }]}>Transaction No.</Text>
							<Text style={[styles.headerText, { width: '30%' }]}>No. of Items</Text>
							<Text style={[styles.headerText, { width: '15%', textAlign: 'center' }]}>Total</Text>
						</View>
					</View>
			}
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
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  itemText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: '#000',
		
		textAlign: 'left'
  },
});


export default SalesList