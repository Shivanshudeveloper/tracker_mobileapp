import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import {
    Button,
    List,
    Title,
    Dialog,
    Paragraph,
    Avatar,
} from 'react-native-paper'
import AppBar from '../Components/AppBarComponent'
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

const AlertDialog = (props) => {
    const { visible, hideDialog, turnOffTracking, item } = props
    return (
        <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
                <Paragraph>
                    Your Tracker will be notified that you turned off tracking
                </Paragraph>
                <Paragraph>Do you want to continue?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button style={{ marginRight: 8 }} onPress={hideDialog}>
                    Cancel
                </Button>
                <Button onPress={() => turnOffTracking(item)}>
                    Turn off Tracking
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

    const { currentUser } = auth
    let { phoneNumber } = currentUser
    phoneNumber = phoneNumber.slice(3)

    const showDialog = () => setVisible(true)
    const hideDialog = () => setVisible(false)

    const openMenu = () => setMenuVisible(true)
    const closeMenu = () => setMenuVisible(false)

    useEffect(() => {
        const requestRef = collection(
            db,
            'trackingRequest',
            phoneNumber,
            'requests'
        )
        const q = query(requestRef, where('requestStatus', '==', 'accepted'))
        const unsub = onSnapshot(q, (documents) => {
            const acceptedRequests = []
            documents.forEach((snap) => {
                acceptedRequests.push({ ...snap.data(), id: snap.id })
            })
            setTrackingList(acceptedRequests)
        })

        return () => unsub()
    }, [])

    const turnOffTracking = async (item) => {
        console.log(item)
        const requestRef = doc(
            db,
            'trackingRequest',
            phoneNumber,
            'requests',
            item.id
        )

        updateDoc(requestRef, {
            requestStatus: 'rejected',
        })
            .then(async () => {
                await updateUser('rejected', item)
                await sendNotification('rejected', item)
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
                <Title>You are currently being tracked by:</Title>
                <ScrollView style={styles.trackerListContainer}>
                    {trackingList.map((item, index) => (
                        <View key={index}>
                            <List.Item
                                title={item.companyName}
                                description='Tracking Schedule'
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
                                        <Button
                                            style={styles.btn}
                                            mode='contained'
                                            onPress={() => {
                                                setSelectedItem(item)
                                                showDialog()
                                            }}
                                        >
                                            Turn off
                                        </Button>
                                    </View>
                                )}
                            />
                        </View>
                    ))}
                    <View style={{ height: 100 }}></View>
                </ScrollView>
                <AlertDialog
                    visible={visible}
                    item={selectedItem}
                    hideDialog={hideDialog}
                    turnOffTracking={turnOffTracking}
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
    actionBtnContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    btn: {
        textTransform: 'capitalize',
    },
})
