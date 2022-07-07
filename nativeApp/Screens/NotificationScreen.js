import React, { useState, useEffect } from 'react'
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native'
import { Subheading, Title, List, Divider, Avatar } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'
import AppBar from '../Components/AppBarComponent'

import { db, auth } from '../firebase'
import {
    doc,
    onSnapshot,
    query,
    orderBy,
    limit,
    collection,
    setDoc,
} from 'firebase/firestore'
import moment from 'moment'
import { SafeAreaView } from 'react-native-safe-area-context'

const NotificationScreen = () => {
    const [menuVisible, setMenuVisible] = useState(false)
    const [filter, setFilter] = useState('cpp')
    const [notificationList, setNotficationList] = useState([])

    const openMenu = () => setMenuVisible(true)
    const closeMenu = () => setMenuVisible(false)

    const currentUser = auth.currentUser
    let { phoneNumber } = currentUser
    phoneNumber = phoneNumber.slice(3)

    console.log('here 1')

    const getTime = (sec) => {
        const str = moment(new Date(sec * 1000)).fromNow()

        switch (str) {
            case 'in a few seconds':
                return 'few sec'
            case 'a few seconds ago':
                return 'few sec'
            case 'a minute ago':
                return '1m'
            case 'an hour ago':
                return '1h'
            case 'a day ago':
                return '1day'
            default:
                const first = str.split(' ')[0]
                let mid = str.split(' ')[1]
                if (mid === 'minutes' || mid === 'minute') {
                    mid = 'm'
                }
                if (mid === 'hours' || mid === 'hour') {
                    mid = 'h'
                }
                if (mid === 'days' || mid === 'day') {
                    mid = 'd'
                }
                return first + mid
        }
    }

    useEffect(() => {
        const ref = collection(
            db,
            'trackingAndroidNotification',
            phoneNumber,
            'notifications'
        )
        const q = query(ref, orderBy('createdAt', 'desc'), limit(100))

        const unsub = onSnapshot(q, (snapshots) => {
            const list = []
            snapshots.forEach((snap) => {
                list.push({ ...snap.data(), id: snap.id })
            })

            setNotficationList(list)
        })

        markedAsRead()

        return async () => {
            unsub()
        }
    }, [])

    const markedAsRead = async () => {
        const filteredArr = notificationList.filter((x) => x.seen === false)
        const idArr = filteredArr.map((x) => x.id)

        for (let id of idArr) {
            const ref = doc(
                db,
                'trackingAndroidNotification',
                phoneNumber,
                'notifications',
                id
            )

            setDoc(
                ref,
                {
                    seen: true,
                },
                { merge: true }
            ).catch((err) => console.log(err))
        }
    }

    return (
        <View style={styles.container}>
            <AppBar
                onPress={openMenu}
                closeMenu={closeMenu}
                title='Notifications'
                menuVisible={menuVisible}
            />
            <SafeAreaView style={styles.mainContainer}>
                <TouchableWithoutFeedback onPress={() => markedAsRead()}>
                    <Subheading style={styles.markAllText}>
                        Mark all as Read
                    </Subheading>
                </TouchableWithoutFeedback>
                <ScrollView style={styles.notificationContainer}>
                    {notificationList.map((item, i) => (
                        <View key={item.id}>
                            <List.Item
                                style={{ marginVertical: 5 }}
                                title={item.message}
                                titleStyle={{
                                    fontWeight: item.seen ? '500' : 'bold',
                                }}
                                description={`${getTime(
                                    item.createdAt.seconds
                                )} ago`}
                                left={(props) => (
                                    <Avatar.Image
                                        {...props}
                                        size={50}
                                        source={{
                                            uri: item.sender.profilePhoto,
                                        }}
                                    />
                                )}
                            />
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    mainContainer: {
        paddingHorizontal: 10,
        position: 'relative',
    },
    markAllText: {
        textAlign: 'right',
    },
    filterContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    filterTitleText: {
        textAlignVertical: 'center',
    },
    pickerContainer: {
        flex: 1,
        height: 50,
        marginLeft: 20,
        backgroundColor: '#d1d1d1',
    },
    notificationContainer: {
        marginTop: 10,
    },
})

export default NotificationScreen
