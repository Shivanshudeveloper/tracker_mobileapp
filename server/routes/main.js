const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')
let nodeGeocoder = require('node-geocoder')

// Getting Module

const Appt_Model = require('../models/Appointment')
const User_Model = require('../models/User')
const Class_Model = require('../models/Class')
const ClassSubject_Model = require('../models/ClassSubject')
const ClassLevel_Model = require('../models/ClassLevel')
const Teacher_Model = require('../models/Teacher')
const TeacherYear_Model = require('../models/TeacherYear')
const Observer_Model = require('../models/Observer')
const Form_Model = require('../models/Form')
const Training_Model = require('../models/Training')
const FormResponse_Model = require('../models/FormResponses')
const TrackerUser = require('../models/TrackerAppUserModel')
const UserForm = require('../models/TrackerUserFormModel')
const UserLocation = require('../models/TrackerUserLocation')
// const { findById } = require("../models/Class");
const emailId = require('../config/keys').Email
const emailPassword = require('../config/keys').Password

let options = {
  provider: 'openstreetmap',
}

let geoCoder = nodeGeocoder(options)

router.get('/test', (req, res) => {
  res.send('Working')
})

///////////////////////
// APPOINTMENT
///////////////////////

router.post('/saveappt', async (req, res) => {
  let appData = req.body
  try {
    const newUser = new Appt_Model(appData)
    const observer = await Observer_Model.findById(appData.observerId)
    await newUser.save()

    try {
      ;(transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailId,
          pass: emailPassword,
        },
      })),
        (mailOption = {
          from: emailId,
          to: appData?.teacherData[0]?.Email,
          subject: 'Appointment Booked',
          html: `Appointment booked by ${observer.name} for ${appData.apptDate}<br />${appData.note}`,
        }),
        transporter.sendMail(mailOption, (err, data) => {
          console.log('Email Sent!')
        })
    } catch (error) {
      console.log(error)
    }
    res.status(201).json({ message: 'New Appointment Created' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})
router.get('/getappt', async (req, res) => {
  try {
    const data = await Appt_Model.find()
    res.status(201).json(data)
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

// /////////////////////
// USERS
// /////////////////////
router.post('/adduser', async (req, res) => {
  let userData = req.body
  try {
    const newUser = new User_Model(userData)
    await newUser.save()
    console.log(newUser)
    res.status(201).json({ message: 'New Class Created' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})
router.get('/getuser/:id', async (req, res) => {
  let { id } = req.params
  try {
    const newUser = await User_Model.find({ userId: id })
    res.status(201).json(newUser)
  } catch (error) {
    console.log(error)
    res.status(404).json({ message: 'Error' })
  }
})
router.post('/updateuser/:id', async (req, res) => {
  let { id } = req.params
  let formData = req.body

  try {
    const newUser = await User_Model.find({ userId: id })
    await User_Model.findByIdAndUpdate(newUser[0]._id, formData, {
      useFindAndModify: false,
    })
    res.status(201).json({ message: 'Updated' })
  } catch (error) {
    console.log(error)
    res.status(404).json({ message: 'Error' })
  }
})

// ////////////
// CLASS
// ////////////
router.post('/addclasslist', async (req, res) => {
  let formData = req.body
  try {
    const newClass = new Class_Model(formData)
    await newClass.save()
    res.status(201).json({ message: 'New Class Created' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.patch('/editclasslist', async (req, res) => {
  let formData = req.body
  try {
    const newClass = await Class_Model.findByIdAndUpdate(
      { _id: formData._id },
      formData,
      { useFindAndModify: false }
    )
    res.status(201).json({ message: 'New Level Created' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.get('/getclasslist', async (req, res) => {
  try {
    const allClasses = await Class_Model.find({})
    res.status(201).json(allClasses)
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.delete('/deleteclasslist/:id', async (req, res) => {
  const { id } = req.params
  try {
    await Class_Model.findByIdAndDelete(id)
    res.status(201).json({ message: 'Deleted' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

//
//

router.post('/addclasssubject', async (req, res) => {
  let formData = req.body
  try {
    const newClass = new ClassSubject_Model(formData)
    await newClass.save()
    const prevClass = await Class_Model.find({ name: formData.class })
    prevClass[0].numberOfSubjects = prevClass[0].numberOfSubjects + 1
    await Class_Model.findByIdAndUpdate(
      { _id: prevClass[0]._id },
      prevClass[0],
      {
        useFindAndModify: false,
      }
    )
    res.status(201).json({ message: 'New Class Created' })
  } catch (error) {
    console.log(error)
    res.status(404).json({ message: 'Error' })
  }
})

router.patch('/editclasssubject', async (req, res) => {
  let formData = req.body
  try {
    const newClass = await ClassSubject_Model.findByIdAndUpdate(
      { _id: formData._id },
      formData,
      { useFindAndModify: false }
    )
    res.status(201).json({ message: 'New Level Created' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.get('/getclasssubject', async (req, res) => {
  try {
    const allClasses = await ClassSubject_Model.find({})
    res.status(201).json(allClasses)
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})
router.delete('/deleteclasssubject/:id', async (req, res) => {
  const { id } = req.params
  try {
    const prevSubject = await ClassSubject_Model.findById(id)
    const prevClass = await Class_Model.find({ name: prevSubject.class })
    prevClass[0].numberOfSubjects = prevClass[0].numberOfSubjects - 1
    await Class_Model.findByIdAndUpdate(
      { _id: prevClass[0]._id },
      prevClass[0],
      {
        useFindAndModify: false,
      }
    )
    await ClassSubject_Model.findByIdAndDelete(id)
    res.status(201).json({ message: 'Deleted' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

//
//

router.post('/addclasslevel', async (req, res) => {
  let formData = req.body
  try {
    const newClass = new ClassLevel_Model(formData)
    await newClass.save()
    res.status(201).json({ message: 'New Level Created' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.patch('/editclasslevel', async (req, res) => {
  let formData = req.body
  try {
    const newClass = await ClassLevel_Model.findByIdAndUpdate(
      { _id: formData._id },
      formData,
      { useFindAndModify: false }
    )
    res.status(201).json({ message: 'New Level Created' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.get('/getclasslevel', async (req, res) => {
  try {
    const allClasses = await ClassLevel_Model.find({})
    res.status(201).json(allClasses)
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.delete('/deleteclasslevel/:id', async (req, res) => {
  const { id } = req.params
  try {
    await ClassLevel_Model.findByIdAndDelete(id)
    res.status(201).json({ message: 'Deleted' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

// /////////////////////
// TEACHERS
// /////////////////////

router.post('/addteacherlist', async (req, res) => {
  let formData = req.body
  try {
    const newClass = new Teacher_Model(formData)
    await newClass.save()
    const year = await TeacherYear_Model.find({
      yearOfJoining: formData.yearOfJoining,
    })

    if (year.length === 0) {
      const newYear = new TeacherYear_Model({
        yearOfJoining: formData.yearOfJoining,
      })
      await newYear.save()
    } else {
      console.log(year[0].total)
      await TeacherYear_Model.findByIdAndUpdate({ _id: year[0]._id }, year[0], {
        useFindAndModify: false,
      })
    }

    res.status(201).json({ message: 'New Level Created' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.patch('/editteacherlist', async (req, res) => {
  let formData = req.body
  try {
    const newClass = await Teacher_Model.findByIdAndUpdate(
      { _id: formData._id },
      formData,
      { useFindAndModify: false }
    )
    res.status(201).json({ message: 'New Level Created' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.get('/getteacherlist', async (req, res) => {
  try {
    const allClasses = await Teacher_Model.find({})
    res.status(201).json(allClasses)
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})
router.get('/getteacheryears', async (req, res) => {
  try {
    const allClasses = await TeacherYear_Model.find()
    res.status(201).json(allClasses)
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.delete('/deleteteacher/:id', async (req, res) => {
  const { id } = req.params
  try {
    const teacher = await Teacher_Model.findById(id)

    await Teacher_Model.findByIdAndDelete(id)

    const year = await TeacherYear_Model.find({
      yearOfJoining: teacher.yearOfJoining,
    })

    year[0].total = year[0].total - 1
    await TeacherYear_Model.findByIdAndUpdate({ _id: year[0]._id }, year[0], {
      useFindAndModify: false,
    })

    res.status(201).json({ message: 'Deleted' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

// ////////////////////
// OBSERVSERS
// ////////////////////

router.post('/addobserver', async (req, res) => {
  let formData = req.body
  try {
    const newClass = new Observer_Model(formData)
    await newClass.save()
    res.status(201).json({ message: 'New Observer Created' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.patch('/editobserver', async (req, res) => {
  let formData = req.body
  try {
    const newClass = await Observer_Model.findByIdAndUpdate(
      { _id: formData._id },
      formData,
      { useFindAndModify: false }
    )
    res.status(201).json({ message: 'Observer Updated' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.get('/getobserver', async (req, res) => {
  try {
    const allClasses = await Observer_Model.find({})
    res.status(201).json(allClasses)
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.delete('/deleteobserver/:id', async (req, res) => {
  const { id } = req.params
  try {
    await Observer_Model.findByIdAndDelete(id)
    res.status(201).json({ message: 'Deleted' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

// //////////////////
// FORMS
// ///////////////////
router.post('/saveform', async (req, res) => {
  let fieldData = req.body
  try {
    const newClass = new Form_Model(fieldData)
    await newClass.save()
    res.status(201).json({ message: 'New Form Created' })
  } catch (error) {
    console.log(error)
    res.status(404).json({ message: 'Error' })
  }
})

router.get('/getforms/:id', async (req, res) => {
  const { id } = req.params
  try {
    const allClasses = await Form_Model.find({ observerId: id })
    res.status(201).json(allClasses)
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})
router.get('/getallforms', async (req, res) => {
  const { id } = req.params
  try {
    const allClasses = await Form_Model.find()
    res.status(201).json(allClasses)
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})
router.get('/getformpreview/:id', async (req, res) => {
  const { id } = req.params
  try {
    const allClasses = await Form_Model.find({ _id: id })
    res.status(201).json(allClasses)
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})
router.get('/getformresponses/:id', async (req, res) => {
  const { id } = req.params
  try {
    const allClasses = await FormResponse_Model.find({ formId: id })
    res.status(201).json(allClasses)
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})
router.get('/getallresponses', async (req, res) => {
  try {
    const allClasses = await FormResponse_Model.find()
    res.status(201).json(allClasses)
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.post('/submitform', async (req, res) => {
  const formData = req.body
  console.log(formData)
  try {
    const newResponse = new FormResponse_Model(formData)
    const form = await Form_Model.find({ _id: formData.formId })
    form[0].noOfResponses = form[0].noOfResponses + 1
    await Form_Model.findByIdAndUpdate({ _id: form[0]._id }, form[0], {
      useFindAndModify: false,
    })
    await newResponse.save()
    res.status(201).json(newResponse)
  } catch (error) {
    res.status(404).json({ message: error })
  }
})

router.delete('/deleteform/:id', async (req, res) => {
  const { id } = req.params
  try {
    await Form_Model.findByIdAndDelete(id)
    const allForms = await FormResponse_Model.find({ formId: id })
    allForms.map(
      async (form) => await FormResponse_Model.findByIdAndDelete(form._id)
    )
    res.status(201).json({ message: 'Deleted' })
  } catch (error) {
    console.log(error)
    res.status(404).json({ message: 'Error' })
  }
})

// ////////////////////////////
// TRAINING
// ///////////////////////////
router.post('/addtraininglist', async (req, res) => {
  let formData = req.body
  try {
    const newClass = new Training_Model(formData)
    await newClass.save()
    res.status(201).json({ message: 'New Class Created' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.patch('/edittraininglist', async (req, res) => {
  let formData = req.body
  try {
    const newClass = await Training_Model.findByIdAndUpdate(
      { _id: formData._id },
      formData,
      { useFindAndModify: false }
    )
    res.status(201).json({ message: 'New Level Created' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.get('/gettraininglist', async (req, res) => {
  try {
    const allClasses = await Training_Model.find({})
    res.status(201).json(allClasses)
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})
router.get('/gettraininglist/:id', async (req, res) => {
  const { id } = req.params
  try {
    const allClasses = await Training_Model.find({ _id: id })
    res.status(201).json(allClasses)
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.delete('/deletetraininglist/:id', async (req, res) => {
  const { id } = req.params
  try {
    await Training_Model.findByIdAndDelete(id)
    res.status(201).json({ message: 'Deleted' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

// ////////////////////////////
// TRAINING Teacher
// ///////////////////////////
router.post('/addtrainingteacher/:id', async (req, res) => {
  const { id } = req.params
  let formData = req.body
  try {
    const newClass = await Training_Model.find({ _id: id })
    newClass[0].teachers.push(formData)
    const newTraining = await Training_Model.findByIdAndUpdate(
      id,
      newClass[0],
      {
        new: true,
        useFindAndModify: false,
      }
    )
    console.log(newTraining)
    res.status(201).json({ message: 'New Teacher Added' })
  } catch (error) {
    console.log(error)
    res.status(404).json({ message: 'Error' })
  }
})

// router.patch("/edittrainingteacher", async (req, res) => {
//   let formData = req.body;
//   try {
//     const newClass = await Training_Model.findByIdAndUpdate(
//       { _id: formData._id },
//       formData,
//       { useFindAndModify: false }
//     );
//     res.status(201).json({ message: "New Level Created" });
//   } catch (error) {
//     res.status(404).json({ message: "Error" });
//   }
// });

router.get('/gettrainingteacher', async (req, res) => {
  try {
    const allClasses = await Training_Model.find({})
    res.status(201).json(allClasses)
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.post('/deletetrainingteacher/:id', async (req, res) => {
  const { id } = req.params
  let formData = req.body
  try {
    const newClass = await Training_Model.find({ _id: id })
    newClass[0].teachers = newClass[0].teachers.filter((t) => t != formData)
    const newTraining = await Training_Model.findByIdAndUpdate(
      id,
      newClass[0],
      {
        new: true,
        useFindAndModify: false,
      }
    )
    res.status(201).json({ message: 'Deleted' })
  } catch (error) {
    res.status(404).json({ message: 'Error' })
  }
})

router.get('/getlatlong/:latitude/:longitude', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const { latitude, longitude } = req.params
  geoCoder
    .reverse({ lat: Number(latitude), lon: Number(longitude) })
    .then((res2) => {
      res.status(201).json(res2[0])
    })
    .catch((err) => {
      console.log(err)
    })
})

// *************** Tracker User *************** //

// @desc registering a new user
// @route POST
// @access public
router.post('/tracker/register', async (req, res) => {
  try {
    const { firstName, lastName, email, companyName, password, policy } =
      req.body
    const userExist = await TrackerUser.findOne({ email })

    if (userExist) {
      res.json({ success: false, data: 'user already exist' })
      return
    }

    const response = await TrackerUser.create({
      firstName,
      lastName,
      email,
      companyName,
      password,
      policy,
    })

    res.status(200).json({ success: true, data: response })
  } catch (error) {
    res.status(500).json(`Error: ${error.message}`)
  }
})

// @desc login an existing user
// @route GET
// @access public
router.post('/tracker/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const userExist = await TrackerUser.findOne({ email })

    if (userExist && (await userExist.matchPassword(password))) {
      res.status(200)
      res.json({
        success: true,
        data: {
          _id: userExist._id,
          firstName: userExist.firstName,
          lastName: userExist.lastName,
          email: userExist.email,
          companyName: userExist.companyName,
        },
      })
    } else {
      res.status(401)
      res.json({
        success: false,
        data: 'Invalid email or Password',
      })
    }
  } catch (error) {
    res.status(401).json(`Error: ${error.message}`)
  }
})

// *************** Tracker User Form *************** //

// @desc adding a user form
// @route POST
// @access private
router.post('/tracker/userform', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      designation,
      salary,
      senderEmail,
      requestId,
    } = req.body

    const data = await UserForm.create({
      fullName,
      email,
      phoneNumber,
      designation,
      salary,
      senderEmail,
      requestId,
    })

    if (data) {
      res.status(200).send(data)
    }
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`)
  }
})

// @desc getting a user form
// @route GET
// @access private
router.get('/tracker/userform/:email', async (req, res) => {
  try {
    const { email } = req.params

    const data = await UserForm.find({ senderEmail: email })

    if (data) {
      res.status(200)
      res.send(data)
    } else {
      res.status(404)
      res.send('not found')
    }
  } catch (error) {
    res.send(`Error: ${error.message}`)
  }
})

// @desc deleting form
// @route Request to Delete the content form
// @access private
router.delete('/tracker/userform/:id', async (req, res) => {
  try {
    const { id } = req.params
    const form = await UserForm.findById({ _id: id })
    if (form) {
      await UserForm.deleteOne({ _id: id })
        .then(() => res.status(200).send('Form Deleted Successfully'))
        .catch((error) => console.log(`Error: ${error.message}`))
    } else {
      throw new Error('Form not available')
    }
  } catch (error) {
    res.send(`Error: ${error.message}`)
  }
})

// *************** Tracker User Form *************** //

// @desc adding a user location
// @route POST
// @access private
router.post('/tracker/userlocation', async (req, res) => {
  try {
    const { email, hotspot, phoneNumber, fullName } = req.body

    const data = await UserLocation.create({
      email,
      phoneNumber,
      hotspot,
      fullName,
    })

    if (data) {
      res.status(200).send(data)
    }
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`)
  }
})

// @desc getting a user location
// @route POST
// @access private
router.get('/tracker/userlocation/:email', async (req, res) => {
  try {
    const { email } = req.params

    const data = await UserLocation.find({ email: email }).sort({
      createdAt: -1,
    })

    if (data) {
      res.status(200).send(data)
    }
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`)
  }
})

module.exports = router
