const mongoose = require('mongoose')
const axios = require('axios')
const { patientTracksSchema } = require('../models/patientTracksSchema')
require('dotenv').config()
const BACKEND_PATIENT_HOST = process.env.BACKEND_PATIENT_HOST //http://localhost:5000

exports.patientBookingRequests = async (req, res) => {
  try {
    const {
      name,
      age,
      sex,
      blood_group,
      weight,
      height,
      patient_id,
      doctor_id,
      doctor_name,
      time_slots,
      temporary_symptoms,
      hospital_id,
    } = req.body
    console.log(req.body)
    const patient = mongoose.model('patienttracks', patientTracksSchema)
    const new_patient = new patient({
      patient_id,
      patient_details: {
        name: name,
        age: age,
        sex: sex,
        blood_group: blood_group,
        height: height,
        weight: weight,
        temporary_symptoms: temporary_symptoms,
        time_slots: time_slots,
      },
      doctor_id,
      doctor_name,
      hospital_id,
      is_appointment_alloted: false,
      is_patient_diagnosed: false,
    })
    await new_patient.save()
    res.status(200).json({ message: 'Wait for the Confirmation' })

    // as soon as the details are saved, the list of patient Queue should be updated
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message })
  }
}

exports.patientAppointmentResponse = async (req, res) => {
  const { patient_id, doctor_id, bookingStatus, reason } = req.body //reason is optional
  const hospital_id = req.params.hospital_id
  const patientQueue = mongoose.model('patienttracks', patientTracksSchema)
  try {
    let response = ''

    if (bookingStatus) {
      const appointment_id = new mongoose.Types.ObjectId()
      console.log(appointment_id)

      const patient = await patientQueue.findOneAndUpdate(
        { patient_id, hospital_id },
        { appointment_id, is_appointment_alloted: true },
        { new: true }
      )

      // sendPatientDetailsToDoctor(patient, doctor_id) // deal in the doctorBackendRequests

      const details = {
        appointment_id,
        doctor_id,
        hospital_id,
        time_slots: patient.patient_details.time_slots,
        doctor_name: patient.doctor_name,
      }
      console.log(details)

      const res = await axios.post(
        `${BACKEND_PATIENT_HOST}/appointmentBookingUpdate/${patient_id}`,
        {
          details,
          bookingStatus,
        }
      )

      console.log(res.data.message)
      response = res.data.message
    }

    if (!bookingStatus) {
      const details = {
        appointment_cancelled: {
          byWhom: 'receptionist',
          reason,
        },
        patient_id,
        hospital_id,
        doctor_id,
      }

      const options = {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
        method: 'POST',
        body: JSON.stringify({ details, bookingStatus }),
      }

      const res = await fetch(
        `${BACKEND_PATIENT_HOST}/appointmentBookingUpdate/patient_id`,
        options
      )

      const data = await res.json()
      console.log(data.message)
      response = data.message

      // const res = await axios.post(
      //   `${BACKEND_PATIENT_HOST}/appointmentBookingUpdate/patient_id`,
      //   {
      //     details,
      //     bookingStatus,
      //   }
      // )

      // response = res.data.message
    }

    res.status(200).json({ response })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message })
  }
}
