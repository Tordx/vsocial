import { View, Text, FlatList, StatusBar, StyleSheet, TouchableOpacity, ScrollView, Animated, Modal, TextInput, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { inventory, sales, salesdetails, userdetails } from '../../../../interface'
import { SearchField } from '../../components/custom/fields'
import { theme } from '../../../../assets/colors'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { setItemId } from '../../../../context/itemslice'
import firestore, { firebase } from '@react-native-firebase/firestore'
import { globalContainers } from '../../../../styles'
import { GlobalButton, SmallButton } from '../../components/custom/buttons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Inventory from '../../inventory'
import { generateRandomKey } from '../../../../lib'

const PAGE_SIZE = 10;

const AddSales = () => {


	const [search, setsearch] = useState<string>('');
	const [data, setdata] = useState<inventory[]>([]);
	const [unfiltereddata, setunfiltereddata] = useState<inventory[]>([]);
	const [selecteditem, setselecteditem] = useState<inventory[]>([])
	const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [pageIndex, setPageIndex] = useState<number>(0);
	const [discount, setdiscount] = useState<number>(0)
	const [total, setotal] = useState<number[]>([])
	const [openDiscount, setOpenDiscount] = useState<boolean>(false)
	const [issubmitting, setissubmitting] = useState<boolean>(false)
	const [submittext, setsubmittext] = useState<string>('')
	const navigation = useNavigation()
	const dispatch = useDispatch()
	const {userdata} = useSelector((action: userdetails) => action._userdata)

	useEffect(() => {
		const unsubscribe = firestore().collection(userdata.branch || 'inventory').onSnapshot((querySnapshot) => {
			const inventoryData: inventory[] = [];
			querySnapshot?.forEach((documentSnapshot) => {
				const data = documentSnapshot.data();
				// Assuming 'data' contains an array field named 'data'
				const dataArray: inventory[] = data.data || []; // Access the 'data' array from the document
				// Add each item from the 'data' array to the inventoryData array
				dataArray.forEach((item) => {
					// Ensure the 'branch' property of each item matches 'userdata.branch'
					if (item.branch === userdata.branch  && item.supplier !== '' && item.itemname !== '') {
						inventoryData.push(item);
					}
				});
			});
	
			const filterbysearch: inventory[] = inventoryData.filter((item) =>{
			  const searchdata = new RegExp(search, 'i')
			  return searchdata.test(item.itemname) || searchdata.test(item.itemno.toString())
		  })
	
		  const paginatedData = filterbysearch.slice(0, PAGE_SIZE);
		  setdata(paginatedData);
		  setunfiltereddata(filterbysearch);
			setdata(filterbysearch);
			
			setPageIndex(1);
		});
	
		return () => unsubscribe();
	}, [userdata.branch, search]);
	

    const loadMoreData = () => {
        if (loadingMore) return;
        setLoadingMore(true);
        const nextPageData = unfiltereddata.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);
        setTimeout(() => {
            setdata(prevData => [...prevData, ...nextPageData]);
            setLoadingMore(false);
            setPageIndex(prevIndex => prevIndex + 1);
        }, 1000); // Simulating a delay for loading data
    };

	const selectItem = (id: inventory, stocks: number) => {
		if(stocks <= 5) {
			Alert.alert('', 'Please inform the main office for all low stock items')
		}
		if(stocks !== 0){
			setselecteditem((prev) => [...prev, id])
		} else {
			Alert.alert('', 'You have no remaining stock of this item')
			return
		}
	}

	const removeItem = (itemnoToRemove: number) => {
		// Find the index of the last occurrence of the item with the specified itemno
		const indexToRemove = selecteditem.slice().reverse().findIndex(item => item.itemno === itemnoToRemove);
		if (indexToRemove !== -1) {
			// Create a copy of the selecteditem array
			const updatedSelectedItems = [...selecteditem];
			// Remove the item at the calculated index
			updatedSelectedItems.splice(updatedSelectedItems.length - 1 - indexToRemove, 1);
			// Update the state with the modified array
			setselecteditem(updatedSelectedItems);
		}
	}

	const [expanded, setExpanded] = useState(true);

  const heightAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    const targetHeight = expanded ? 250 : 0; 
    Animated.timing(
      heightAnim,
      {
        toValue: targetHeight,
        duration: 300, 
        useNativeDriver: false,
      }
    ).start();
    setExpanded(!expanded);
  };


  const renderItem = ({ item, index }: { item: inventory, index: number }) => (
    <TouchableOpacity onPress={() =>{ selectItem(item, item.stocks);}} style={[styles.itemContainer, { backgroundColor: item.stocks < 10 ? '#FF7F7F' : index % 2 === 0 ? '#d9d9d9' : '#fff'}]}>
      <Text style={[styles.itemText, { width: '25%', color: item.stocks < 10 ? '#fff' : '#000' }]}>{item.itemno}</Text>
      <Text style={[styles.itemText, { width: '30%', color: item.stocks < 10 ? '#fff' : '#000'  }]}>{item.itemname}</Text>
      <Text style={[styles.itemText, { width: '30%', color: item.stocks < 10 ? '#fff' : '#000'  }]}>{item.stocks}</Text>
      <Text style={[styles.itemText, { width: '15%', textAlign: 'center', color: item.stocks < 10 ? '#fff' : '#000'  }]}>₱{item.unitprice}</Text>
    </TouchableOpacity>
  );

	const groupedItems: { [itemno: string]: inventory[] } = {};
					selecteditem.forEach(item => {
						if (!groupedItems[item.itemno]) {
							groupedItems[item.itemno] = [item];
						} else {
							groupedItems[item.itemno].push(item);
						}
	});

	useEffect(() => {
		const newTotals = Object.keys(groupedItems).map(item => {
			const items = groupedItems[item];
			// Calculate the total price for all items in the group
			const totalPrice = items.reduce((acc, currentItem) => {
				return acc + (currentItem.unitprice);
			}, 0);
			return Math.floor(totalPrice);
		});
		setotal(newTotals);
	}, [selecteditem]);

	const totalSum = total.reduce((acc, currentValue) => acc + currentValue, 0);
	const withDiscount = totalSum - discount
	
	const submit = async () => {
		const id = generateRandomKey(25)
		setissubmitting(true)
		setsubmittext('updating stocks')
		if(withDiscount > 0){
			try {
				const querySnapshot = await firestore().collection('sales').orderBy('transId', 'desc').limit(1).get();

				let highesttransId: number = 0;
				

				if (!querySnapshot.empty) {
					querySnapshot?.forEach(doc => {
						highesttransId = doc.data().transId;
					});
				}
				let totalItemCount = 0;
				for (const key in groupedItems) {
					if (groupedItems.hasOwnProperty(key)) {
							const items = groupedItems[key];
							const itemCount = items.length;
							totalItemCount += itemCount;
							const updatedStocks = items[0].stocks - itemCount;
							const sold = items[0].unitsales
							const salesDetailPromises = Object.values(items.reduce((acc: { [key: string]: salesdetails[] }, currentItem: inventory) => {
								
								const detsid = generateRandomKey(20)
								const key = currentItem.itemno; // Using itemno as the key
								if (!acc[key]) {
										acc[key] = []; // Initialize if not exists
								}
								// Push the salesdetails object to the array
								acc[key].push({
										transId: highesttransId + 1, 
										docId: detsid, 
										unit: itemCount, 
										itemno: currentItem.itemno.toString(),
										itemname: currentItem.itemname,
										unitprice: currentItem.unitprice,
								});
								return acc;
						}, {} as { [key: string]: salesdetails[] })).map(async (items: salesdetails[]) => {
								try {
										await Promise.all(items.map(async (item) => {
												// Add each sales detail to Firestore with a unique docId
												await firestore().collection('salesdetails').doc(item.docId).set({
														transId: item.transId,
														docId: item.docId,
														unit: item.unit,
														itemno: item.itemno,
														itemname: item.itemname,
														unitprice: item.unitprice
												});
										}));
										console.log('Sales details added successfully');
								} catch (error) {
										console.error('Error adding sales details:', error);
								}
						});
						
						await Promise.all(salesDetailPromises);
            await Promise.all(items.map(async (item) => {
							const branchDocRef = firestore().collection(item.branch || 'inventory').doc(item.supplier);
							
							// Fetch the document data
							const docSnapshot = await branchDocRef.get();
							if (docSnapshot.exists) {
									const branchData = docSnapshot.data() as inventory;
									
									if (Array.isArray(branchData.data)) {
											// Find the item in the 'data' array by its 'docId'
											const updatedData = branchData.data.map((dataItem) => {
													if (dataItem.docId === item.docId) {
															// Update the 'stocks' and 'unitsales' of the matching item
															return {
																	...dataItem,
																	stocks: updatedStocks,
																	unitsales: dataItem.unitsales + 1 // Increment unitsales by 1
															};
													}
													return dataItem;
											});
											// Update the 'data' array in the document
											await branchDocRef.update({ data: updatedData });
											console.log('Document updated successfully');
									} else {
											console.error('Document data is not an array or does not exist');
									}
							} else {
									console.error('Document does not exist');
							}
					}));
					
					setsubmittext('updated stocks');
					} 
        }
				setsubmittext('updating sales')
				
				await firestore().collection('sales').doc(id).set({
					transId: highesttransId + 1,
					docId: id,
					branch: userdata.branch,
					date: new Date(),
					total: withDiscount,
					noitem: totalItemCount,
					discount: discount,
					subtotal: totalSum,
					staffId: userdata.uid
				}).then(() => {
				
				})

				setsubmittext('Successfully Added Sales!')
				setselecteditem([])
			}catch(error) {
					console.log(error)
					setissubmitting(false)
					Alert.alert('Something went wrong, please contact your administrator')

			}
		} else {
			Alert.alert('', "Please add at least 1 item")
			setissubmitting(false)

		}
	}

	useEffect(() => {
		const successSubmit = () => {
			if(submittext === 'Successfully Added Sales!'){
				setTimeout(() => {
					
				setissubmitting(false)
				}, 2000);
			}
		}
		successSubmit()
	},[submittext])


  return (
    <View style = {globalContainers.container}>
    <FlatList 
                data={data}
                style = {{width: '100%', height: '50%'}}
                renderItem={renderItem}
                keyExtractor={(item) => item.itemno.toString()}
                onEndReached={loadMoreData}
				ListFooterComponent={<View style = {{height: 150, justifyContent: 'flex-start', alignItems: 'center'}}>{loadingMore && <ActivityIndicator style = {{paddingTop: 15}} size={40} color={theme.accenta} />}</View>}
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <SearchField
                            onBlur={() => {}}
                            onFocus={() => {}}
                            onChangeText={(e) => setsearch(e)}
                            value= {search}
                            placeholder='Search'
                            onPress={() => navigation.goBack()}
                            exit
                        />
                        <View style={styles.headerRow}>
                            <Text style={[styles.headerText, { width: '22%',  textAlign: 'left'  }]}>Item No.</Text>
                            <Text style={[styles.headerText, { width: '33%' }]}>Item Name</Text>
                            <Text style={[styles.headerText, { width: '25%' }]}>Stocks</Text>
                            <Text style={[styles.headerText, { width: '20%', textAlign: 'center' }]}>Unit Price</Text>
                        </View>
                    </View>
                }
            />
		<View style = {{ overflow: 'hidden', width: '100%', position: 'absolute', bottom: 0, borderTopRightRadius: 15, borderTopLeftRadius: 15, elevation: 10, backgroundColor:'#fff'}}>
			
      <TouchableOpacity style = {{justifyContent: 'center', alignItems: 'center'}} onPress={toggleExpand}>
			<Icon name = {expanded ? 'chevron-up' : 'chevron-down'} size={50} color={'#101010'} />
      </TouchableOpacity>		
			<View style={[styles.headerRow, {marginTop: 15}]}>
				<Text style={[styles.headerText, { width: '22%',  textAlign: 'left'  }]}>Units</Text>
				<Text style={[styles.headerText, { width: '33%' }]}>Item Name</Text>
				<Text style={[styles.headerText, { width: '25%' }]}>Unit Price</Text>
				<Text style={[styles.headerText, { width: '20%', textAlign: 'center' }]}>Total</Text>
			</View>
			<ScrollView style = {{width: '100%', height: '100%'}}>
			<Animated.View style = {{width: '100%', justifyContent: 'flex-start', alignItems: 'center', height: heightAnim}}>
			
			{selecteditem.length == 0 && <Text style = {{color: '#d9d9d9', marginTop: 50}}>No added Item yet</Text>}
			<ScrollView style = {{width: '100%', height: '100%'}}>
			{Object.keys(groupedItems).map((item, index) => {
      		const items = groupedItems[item];
					return(
					 <TouchableOpacity key={index} onPress={() => removeItem(items[0].itemno)} style={[styles.itemContainer, { backgroundColor: index % 2 === 0 ? '#d9d9d9' : '#fff'}]}>
					 <Text style={[styles.itemText, { width: '25%', color: '#000' }]}>{items.length}</Text>
					 <Text style={[styles.itemText, { width: '30%', color: '#000'  }]}>{items[0].itemname}</Text>
					 <Text style={[styles.itemText, { width: '30%', color: '#000'  }]}>₱{items[0].unitprice}</Text>
					 <Text style={[styles.itemText, { width: '15%', textAlign: 'center', color: '#000'  }]}>₱{total[index]}</Text>
				 </TouchableOpacity>
				)})}
			</ScrollView>
			</Animated.View>
			</ScrollView>
			<View style = {{ height: 125, width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', elevation: 20, backgroundColor: '#fff'}}>
				<View style = {{flexDirection: 'row', width: '45%', justifyContent: 'space-between', paddingLeft: 10}}>
				
					<SmallButton
						iconColor={'#fff'}
						textStyle={{color: '#fff'}}
						ViewStyle={{backgroundColor: theme.accenta}}
					  icon='cart-plus'
						title = 'Add Sales'
						onPress={submit}
					/>
						<SmallButton
						iconColor={'#000'}
						textStyle={{color: '#000'}}
						ViewStyle={{backgroundColor: 'orange'}}
						icon='percent'
						title='Discount'
						onPress={() => {setOpenDiscount(true)}}
					/>
				</View>
				<View style = {{flexDirection: 'column', width: '55%', height: '100%', justifyContent: 'center', paddingHorizontal: 10}}>
					<View style = {styles.totalstyle}>
					<Text style = {{fontFamily: 'Montserrat-Regular', color: '#000', fontSize: 15}}>Sub-total</Text><Text style = {{fontFamily: 'Montserrat-Regular', color: '#000', fontSize: 15, textAlign: 'right'}}>{totalSum > 0 ? totalSum : ''}</Text>
					</View>
					<View style = {styles.totalstyle}>
					<Text style = {{fontFamily: 'Montserrat-Regular', color: '#000', fontSize: 15}}>Discount</Text>{<Text style = {{fontFamily: 'Montserrat-Regular', color: 'red', fontSize: 15, textAlign: 'right'}}>-{discount > 0 ? discount : ''}</Text>}
					</View>
					<View style = {styles.totalstyle}>
					<Text style = {{fontFamily: 'Montserrat-Black', color: '#000', fontSize: 25}}>Total: </Text><Text style = {{fontFamily: 'Montserrat-Black', color: '#000', fontSize: 25, textAlign: 'right'}}>{withDiscount > 0 ? withDiscount : ''}</Text>
					</View>
				</View>
			</View>
		</View>
		<Modal 
		
			animationType='fade' 
			visible = {openDiscount}
			onRequestClose={() => {setOpenDiscount(false); setdiscount(0)}}
			transparent
		>
			<View style = {{backgroundColor: '#00000099', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
				<View style = {{width: '90%', height: 300, backgroundColor: '#fff', elevation: 10, borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
					<Text style = {{color: 'orange', fontFamily: 'Montserrat-Black', fontSize: 30, marginBottom: 20}}>ADD DISCOUNT</Text>
						<View style = {{width: '90%', height: 100, borderWidth: 2, borderColor: '#d9d9d9', borderRadius: 15}}>
						<TextInput
								value={`₱${discount.toFixed(1)}`} // Assuming you want to display up to 2 decimal places
								onChangeText={(e) => {
										const parsedValue = parseFloat(e.replace(/[^\d.]/g, '')); // Allow decimal points as well
										if (!isNaN(parsedValue)) {
												setdiscount(parsedValue);
										}
								}}
								style={{ width: '100%', height: '100%', fontFamily: 'Montserrat-Black', fontSize: 50 }}
						/>
						</View>
						<GlobalButton
							title='Add discount'
							onPress={() => setOpenDiscount(false)}
						/>
				</View>
			</View>
		</Modal>
		<Modal
			animationType='fade' 
			visible = {issubmitting}
			transparent
		>
			<View style = {{backgroundColor: '#00000099', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
				<View style = {{width: '50%', height: '20%', backgroundColor: '#fff', elevation: 10, borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
					{submittext !== 'Successfully Added Sales!' &&	
						<ActivityIndicator 
							size={50}
							color={theme.accenta}
						/>
					}
					<Text style = {{color: 'orange', fontFamily: 'Montserrat-Black', fontSize: 16, marginBottom: 20, textAlign: 'center'}}>{submittext}</Text>
				</View>
			</View>
		</Modal>
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


export default AddSales