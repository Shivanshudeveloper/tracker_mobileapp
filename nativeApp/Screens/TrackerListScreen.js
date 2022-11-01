import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import {
    Button,
    List,
    Title,
    Dialog,
    Paragraph,
    Avatar,
    ActivityIndicator,
} from 'react-native-paper'
import { auth, db } from '../firebase'
import {
    collection,
    onSnapshot,
    updateDoc,
    Timestamp,
    query,
    where,
    addDoc,
    doc,
} from 'firebase/firestore'
import axios from 'axios'
import { API_SERVICE } from '../URI'
import { SafeAreaView } from 'react-native-safe-area-context'
import moment from 'moment'

import AppBar from '../Components/AppBarComponent'

const AlertDialog = (props) => {
    const { visible, hideDialog, toggleTracking, item } = props
    return (
        <Dialog
            visible={visible}
            onDismiss={hideDialog}
            style={{ backgroundColor: 'white' }}
        >
            <Dialog.Title style={{ color: 'black' }}>Alert</Dialog.Title>
            <Dialog.Content>
                <Paragraph style={{ color: 'black' }}>
                    Your Tracker will be notified that you turned off tracking
                </Paragraph>
                <Paragraph style={{ color: 'black' }}>
                    Do you want to continue?
                </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button
                    labelStyle={{ color: 'red', fontWeight: 'bold' }}
                    style={{ marginRight: 8 }}
                    onPress={hideDialog}
                >
                    Cancel
                </Button>
                <Button
                    labelStyle={{ color: '#007bff', fontWeight: 'bold' }}
                    onPress={() => toggleTracking(item, 'turned off')}
                >
                    Turn of Tracking
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

const TrackerListScreen = () => {
    const [menuVisible, setMenuVisible] = useState(false)
    const [visible, setVisible] = React.useState(false)
    const [trackingList, setTrackingList] = useState([])
    const [selectedItem, setSelectedItem] = useState({})
    const [loading, setLoading] = useState(false)

    const { currentUser } = auth
    let { phoneNumber } = currentUser

    const showDialog = () => setVisible(true)
    const hideDialog = () => setVisible(false)

    const openMenu = () => setMenuVisible(true)
    const closeMenu = () => setMenuVisible(false)

    useEffect(() => {
        setLoading(true)
        const requestRef = collection(
            db,
            'trackingRequest',
            phoneNumber,
            'requests'
        )
        const q = query(
            requestRef,
            where('requestStatus', 'in', ['accepted', 'turned off'])
        )
        const unsub = onSnapshot(q, (documents) => {
            const acceptedRequests = []
            documents.forEach((snap) => {
                acceptedRequests.push({ ...snap.data(), id: snap.id })
            })
            setTrackingList(acceptedRequests)
            setLoading(false)
        })

        return () => unsub()
    }, [])

    const toggleTracking = async (item, status) => {
        console.log(item)
        const requestRef = doc(
            db,
            'trackingRequest',
            phoneNumber,
            'requests',
            item.id
        )

        updateDoc(requestRef, {
            requestStatus: status,
        })
            .then(async () => {
                await updateUser(status, item)
                status === 'turned off' &&
                    (await sendNotification(status, item))
            })
            .catch((error) => console.log(error))

        hideDialog()
    }

    const updateUser = async (status, item) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const body = {
            trackingStatus: status,
            phoneNumber: phoneNumber,
            createdBy: item.sender.id,
        }

        await axios
            .put(`${API_SERVICE}/update/device`, body, config)
            .catch((error) => console.log(error))
    }

    const sendNotification = async (status, item) => {
        const ref = collection(
            db,
            'trackingWebNotification',
            item.sender.id,
            'notifications'
        )

        await addDoc(ref, {
            message: `${item.recieverFullName} - ${phoneNumber} has ${status} your tracking Request`,
            name: item.recieverFullName,
            phoneNumber: phoneNumber,
            requestStatus: status,
            createdAt: Timestamp.now(),
            seen: false,
        }).catch((err) => console.log(err))
    }

    return (
        <View style={styles.container}>
            <AppBar
                onPress={openMenu}
                closeMenu={closeMenu}
                title=''
                menuVisible={menuVisible}
            />
            <SafeAreaView style={styles.mainContainer}>
                <Text style={{ fontSize: 20 }}>
                    You are currently being tracked by:
                </Text>
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
                <ScrollView style={styles.trackerListContainer}>
                    {trackingList.map((item, index) => (
                        <View key={index}>
                            <List.Item
                                title={item.companyName}
                                titleStyle={{ color: 'black' }}
                                description={`From: ${moment(
                                    item.createdAt.seconds * 1000
                                ).format('DD MMM YYYY')}`}
                                descriptionStyle={{ color: 'black' }}
                                left={(props) => (
                                    <Avatar.Image
                                        {...props}
                                        size={50}
                                        source={{
                                            uri: item.sender.profilePhoto,
                                        }}
                                    />
                                )}
                                right={() => (
                                    <View style={styles.actionBtnContainer}>
                                        {item.requestStatus === 'accepted' ? (
                                            <Button
                                                style={styles.btn}
                                                mode='contained'
                                                onPress={() => {
                                                    setSelectedItem(item)
                                                    showDialog()
                                                }}
                                                labelStyle={{
                                                    fontWeight: 'bold',
                                                    color: 'white',
                                                }}
                                            >
                                                Turn off
                                            </Button>
                                        ) : (
                                            <Button
                                                style={[
                                                    styles.btn,
                                                    { backgroundColor: 'red' },
                                                ]}
                                                mode='contained'
                                                onPress={() => {
                                                    toggleTracking(
                                                        item,
                                                        'accepted'
                                                    )
                                                }}
                                                labelStyle={{
                                                    fontWeight: 'bold',
                                                    color: 'white',
                                                }}
                                            >
                                                Turn on
                                            </Button>
                                        )}
                                    </View>
                                )}
                            />
                        </View>
                    ))}
                    {trackingList.length === 0 && (
                        <View style={styles.noTrackerListContainer}>
                            {!loading && (
                                <Text
                                    style={{ fontSize: 20, fontWeight: 'bold' }}
                                >
                                    No Tracker Found
                                </Text>
                            )}
                        </View>
                    )}
                    <View style={{ height: 100 }}></View>
                </ScrollView>
                <AlertDialog
                    visible={visible}
                    item={selectedItem}
                    hideDialog={hideDialog}
                    toggleTracking={toggleTracking}
                />
            </SafeAreaView>
        </View>
    )
}

export default TrackerListScreen

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    mainContainer: {
        position: 'relative',
        flex: 1,
        paddingHorizontal: 10,
    },
    trackerListContainer: {
        marginTop: 10,
    },
    noTrackerListContainer: {
        marginTop: 10,
        height: 100,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionBtnContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    btn: {
        textTransform: 'capitalize',
        backgroundColor: '#007bff',
    },
})
