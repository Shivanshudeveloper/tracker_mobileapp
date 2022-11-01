const asyncHandler = require('express-async-handler')
const Attendance = require('../models/TrackingAttendance')
const Location = require('../models/TrackingLocations')
const LiveLocation = require('../models/TrackingLivelocation')
const Device = require('../models/TrackingDevice')
const moment = require('moment')
let nodeGeocoder = require('node-geocoder')
const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()

let options = {
    provider: 'openstreetmap',
}

let geoCoder = nodeGeocoder(options)

const WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]

const checkStartAndEndDay = async (startDay, endDay, currentDay) => {
    if (currentDay === startDay || currentDay === endDay) {
        return true
    } else if (startDay <= endDay) {
        return startDay < currentDay && currentDay < endDay
    } else {
        if (startDay < currentDay) {
            return currentDay < endDay + 6
        } else {
            return currentDay < endDay
        }
    }
}

const checkLatAndLong = async (lastLat, lastLong, latitude, longitude) => {
    if (lastLat === 0 && lastLong === 0) {
        return true
    }

    if (
        latitude >= lastLat - 0.0005 &&
        latitude <= lastLat + 0.0005 &&
        longitude > lastLong - 0.0005 &&
        longitude <= lastLong + 0.0005
    ) {
        return false
    }

    return true
}

const getGroupAndHotspot = async (phoneNumber) => {
    return new Promise(async (resolve) => {
        const { data } = await axios.get(
            `https://murmuring-brook-41081.herokuapp.com/api/v1/main/get/device/${phoneNumber}`
        )

        const hotspots = []
        data.forEach((device) => {
            device.groups.forEach((group) => {
                const arr = group.hotspots.map((x) => ({
                    ...x,
                    schedule: group.schedule,
                    groupId: group._id,
                    device: {
                        fullName: device.fullName,
                    },
                }))
                hotspots.push(...arr)
            })
        })

        resolve(hotspots)
    })
}

const updateLocationAndAttendance = asyncHandler(async (req, res) => {
    try {
        const { phoneNumber, latitude, longitude } = req.body

        const device = await LiveLocation.findOne({ phoneNumber })
        const lastLat = device.location.latitude
        const lastLon = device.location.longitude
        let response = {}

        // Updating live location in db
        if (await checkLatAndLong(lastLat, lastLon, latitude, longitude)) {
            const location = {
                latitude,
                longitude,
            }
            device.location = location || device.location
            await device.save()
            response.liveLocation = 'Live Location Marked'
        }

        //getting hotspots
        const hotspots = await getGroupAndHotspot(phoneNumber)

        // marking attendance and location
        const rawDate = new Date()
        const date = moment(new Date(rawDate)).format('DD-MM-YYYY')

        // getting address from coordinates
        const address = await geoCoder.reverse({
            lat: latitude,
            lon: longitude,
        })

        const currZipCode = address[0].zipcode
        const currAddress = address[0].formattedAddress

        for (let hotspot of hotspots) {
            const month = new Date(rawDate).getMonth() + 1
            const year = new Date(rawDate).getFullYear()

            const body = {
                group: hotspot.groupId,
                hotspot: hotspot._id,
                phoneNumber,
                createdBy: hotspot.createdBy,
                address: currAddress,
                latitude,
                longitude,
                zipCode: currZipCode,
                month,
                year,
            }

            await Location.create(body)
            response[`${hotspot._id} - location`] = 'Location Marked'

            //checking if attendance marked
            const isExist = await Attendance.find({
                phoneNumber: phoneNumber,
                hotspot: hotspot._id,
                date: date,
            })
                .sort({ _id: -1 })
                .limit(1)

            if (isExist[0]) {
                response[hotspot._id] = 'Attendance Already Marked'
                continue
            }
            // checking end

            const schedule = hotspot.schedule

            var format = 'hh:mm a'
            const { time } = schedule
            const currentTime = moment()
            const startTime = moment(
                moment(time.startTime).format('hh:mm a'),
                format
            )
            const endTime = moment(
                moment(time.endTime).format('hh:mm a'),
                format
            )

            const startDay = WEEK.indexOf(schedule.startDays)
            const endDay = WEEK.indexOf(schedule.endDay)
            const currentDay = moment(rawDate).day()

            if (
                currentTime.isBetween(startTime, endTime) &&
                (await checkStartAndEndDay(startDay, endDay, currentDay))
            ) {
                const body = {
                    hotspot: hotspot._id,
                    phoneNumber,
                    device: hotspot.device,
                    createdBy: hotspot.createdBy,
                    date,
                    month,
                    year,
                }

                await Attendance.create(body)
                response[hotspot._id] = 'Attendance Marked'
            } else {
                response[hotspot._id] = 'Attendance Skipped'
            }
        }

        res.status(200).json({
            message: 'Location and Attendance marked sucessfully',
            response,
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = { updateLocationAndAttendance }
