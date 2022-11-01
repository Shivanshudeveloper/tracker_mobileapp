import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API_SERVICE } from '../URI'
import axios from 'axios'
import { auth } from '../firebase'
import { DataTable, ActivityIndicator } from 'react-native-paper'
import AppBar from '../Components/AppBarComponent'
import moment from 'moment'

const LocationHistoryScreen = () => {
    const [menuVisible, setMenuVisible] = useState(false)
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)

    const openMenu = () => setMenuVisible(true)
    const closeMenu = () => setMenuVisible(false)

    let { phoneNumber } = auth.currentUser

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const { data } = await axios.get(
                    `${API_SERVICE}/get/location/${phoneNumber}`
                )
                setHistory(data)
                setLoading(false)
            } catch (error) {
                console.log(error.message)
            }
        }

        fetchData()
    }, [])

    return (
        <SafeAreaView
            style={{
                paddingBottom: 90,
                backgroundColor: 'white',
                height: '100%',
                minWidth: '100%',
            }}
        >
            <AppBar
                onPress={openMenu}
                closeMenu={closeMenu}
                title='Location History'
                menuVisible={menuVisible}
            />
            {loading && (
                <View
                    style={{
                        display: 'flex',
                        marginVertical: 50,
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <ActivityIndicator
                        animating={true}
                        color='purple'
                        size={30}
                    />
                </View>
            )}
            {history.length !== 0 ? (
                <ScrollView
                    style={{ paddingHorizontal: 10, paddingBottom: 50 }}
                >
                    <ScrollView horizontal>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>
                                    <Text style={{ color: 'gray' }}>Date</Text>
                                </DataTable.Title>
                                <DataTable.Title numeric>
                                    <Text style={{ color: 'gray' }}>
                                        Address
                                    </Text>
                                </DataTable.Title>
                                <DataTable.Title numeric>
                                    <Text style={{ color: 'gray' }}>Group</Text>
                                </DataTable.Title>
                            </DataTable.Header>
                            {history.map((x, i) => (
                                <DataTable.Row key={i}>
                                    <DataTable.Cell style={{ marginRight: 10 }}>
                                        <Text style={{ color: 'black' }}>
                                            {moment(x.createdAt).format(
                                                'DD-MMM-YYYY, hh:mm'
                                            )}
                                        </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                        style={{ marginHorizontal: 10 }}
                                    >
                                        <Text style={{ color: 'black' }}>
                                            {x.address}
                                        </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell style={{ marginLeft: 10 }}>
                                        {x.group && (
                                            <Text style={{ color: 'black' }}>
                                                {x.group.groupName}
                                            </Text>
                                        )}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable>
                    </ScrollView>
                </ScrollView>
            ) : (
                <View
                    style={{
                        height: 200,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {!loading && (
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            No History Found
                        </Text>
                    )}
                </View>
            )}
        </SafeAreaView>
    )
}

export default LocationHistoryScreen
