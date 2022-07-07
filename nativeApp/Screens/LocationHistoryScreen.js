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
    phoneNumber = phoneNumber.slice(3)

    useEffect(() => {
        const fetchData = async () => {
            console.log('Here')
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
        <SafeAreaView style={{ paddingBottom: 90 }}>
            <AppBar
                onPress={openMenu}
                closeMenu={closeMenu}
                title='Location History'
                menuVisible={menuVisible}
            />
            {loading ? (
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
            ) : (
                <ScrollView
                    style={{ paddingHorizontal: 10, paddingBottom: 50 }}
                >
                    <ScrollView horizontal>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Date</DataTable.Title>
                                <DataTable.Title numeric>
                                    Address
                                </DataTable.Title>
                                <DataTable.Title numeric>
                                    Hotspot
                                </DataTable.Title>
                            </DataTable.Header>
                            {history.map((x, i) => (
                                <DataTable.Row key={i}>
                                    <DataTable.Cell style={{ marginRight: 10 }}>
                                        {moment(x.createdAt).format(
                                            'DD-MMM-YYYY, hh:mm'
                                        )}
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                        style={{ marginHorizontal: 10 }}
                                    >
                                        {x.address}
                                    </DataTable.Cell>
                                    <DataTable.Cell style={{ marginLeft: 10 }}>
                                        {x.hotspot.hotspotName}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable>
                    </ScrollView>
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default LocationHistoryScreen
