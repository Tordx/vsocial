import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { globalContainers } from '../../../../styles'
import { sales, salesdetails } from '../../../../interface'
import { getSalesDetails } from '../../../../firebase/functions'
import { ExitButton } from '../../components/custom/buttons'
import { useNavigation } from '@react-navigation/native'

interface itemID {
    _itemdata: any,
    itemId: sales
}

const SalesDetails = () => {

 const {itemId} = useSelector((action: itemID) => action._itemdata);
 const navigation = useNavigation()
 const [result, setresult] = React.useState<salesdetails[]>()
  React.useEffect(() => {
    const getSalesData = async() => {
        if(itemId.transId) {
            const result: salesdetails[] = await getSalesDetails(itemId.transId) || []
            setresult(result)
            console.log(result)
        } else {
            return
        }
    }
    getSalesData()
  },[itemId])
  const renderItem = ({ item, index }: { item: salesdetails, index: number }) => (
    <View style={[styles.itemContainer, { backgroundColor: index % 2 === 0 ? '#d9d9d9' : '#fff' }]}>
      <Text style={[styles.itemText, { width: '30%' }]}>{item.itemno}</Text>
      <Text style={[styles.itemText, { width: '30%' }]}>{item.itemname}</Text>
      <Text style={[styles.itemText, { width: '25%' }]}>  {item.unit}</Text>
      <Text style={[styles.itemText, { width: '15%', textAlign: 'center' }]}>₱{item.unitprice}</Text>
    </View>
  );
  return (
    <View style = {globalContainers.container}>
        <View style = {globalContainers.innerScrollContainer}>
        <FlatList 
          data={result}
          style = {{width: '100%', height: '100%'}}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No Sales Record yet</Text>}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
                <View style = {{width: '100%', justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 20, flexDirection: 'row'}}>
                  <ExitButton
                    onPress = {() => {navigation.goBack()}}
                  />
                  <Text style = {{fontFamily: 'Montserrat-Medium', color: '#000', fontSize: 18, marginLeft: 20}}>
                    Transaction No.{itemId.transId}
                  </Text>
                </View>
                
              <View style={styles.headerRow}>
                <Text style={[styles.headerText, { width: '30%' }]}>Item No.</Text>
                <Text style={[styles.headerText, { width: '30%' }]}>Item Name</Text>
                <Text style={[styles.headerText, { width: '20%',  textAlign: 'left'  }]}>Unit</Text>
                <Text style={[styles.headerText, { width: '15%', textAlign: 'center' }]}>Total</Text>
              </View>
            </View>
            }
          />
          <View style = {{ height: 125, width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', elevation: 20, backgroundColor: '#fff'}}>
				<View style = {{flexDirection: 'column', width: '100%', height: '100%', justifyContent: 'center', paddingHorizontal: 10}}>
					<View style = {styles.totalstyle}>
					<Text style = {{fontFamily: 'Montserrat-Regular', color: '#000', fontSize: 15}}>Sub-total</Text><Text style = {{fontFamily: 'Montserrat-Regular', color: '#000', fontSize: 15, textAlign: 'right'}}>{itemId.subtotal || 0}</Text>
					</View>
					<View style = {styles.totalstyle}>
					<Text style = {{fontFamily: 'Montserrat-Regular', color: '#000', fontSize: 15}}>Discount</Text>{<Text style = {{fontFamily: 'Montserrat-Regular', color: 'red', fontSize: 15, textAlign: 'right'}}>-{itemId.discount || 0}</Text>}
					</View>
					<View style = {styles.totalstyle}>
					<Text style = {{fontFamily: 'Montserrat-Black', color: '#000', fontSize: 25}}>Total: </Text><Text style = {{fontFamily: 'Montserrat-Black', color: '#000', fontSize: 25, textAlign: 'right'}}>P{itemId.total || 0}</Text>
					</View>
				</View>
			</View>
        </View>
    </View>
  )
}
const styles = StyleSheet.create({
  totalstyle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		
	},

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


export default SalesDetails