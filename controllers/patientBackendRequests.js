const mongoose = require('mongoose')
const axios = require('axios')
require('dotenv').config()
const BACKEND_PATIENT_HOST = process.env.BACKEND_PATIENT_HOST //http://localhost:5000

const { patientTracksSchema } = require('../models/patientTracksSchema')
const { hospitalDetailsSchema,doctorDetailsSchema} = require('../models/hospitalSchema')
const {sendPatientDetailsToDoctor} = require('./doctorBackendRequests')


// stores the patient details and the their requests for the appointment which would be verified and confirmed by the hospital/receptionist
// The request is received from the patient Backend
exports.patientBookingRequests = async (req, res) => {
  try {
    console.log(req.body)
    const {
      name,
      age,
      sex,
      blood_group,
      weight,
      height,
      patient_id,
      doctor_id_name_department,
      time_slots,
      temporary_symptoms_disease_id_name,
      hospital_id_name,
    } = req.body
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
        temporary_symptoms_disease_id_name,  // this is the predicted disease id & name according to the symptoms
                                            // we can also add the actual disease id & name after the diagnosis
                                            //either create a different object or change this only
        time_slots: {
          event_start: time_slots.event_start,
          event_duration: time_slots.event_duration,

        },
      },
      doctor_id_name_department,
      hospital_id_name,
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

// The response from the hospital/receptionist to the patient's appointment request
// The response is sent to the patient Backend and if the response is positive, the patient details are sent to the doctor Backend
exports.patientAppointmentResponse = async (req, res) => {
  const { patient_id, doctor_id, bookingStatus, reason,event_id } = req.body //reason is optional
  const hospital_id = req.params.hospital_id
  const patientQueue = mongoose.model('patienttracks', patientTracksSchema)
  try {
    let response = ''

    if (bookingStatus==true) {
      const appointment_id = new mongoose.Types.ObjectId()
      // console.log(appointment_id)

      // const patient = await patientQueue.findOneAndUpdate(
      //   { patient_id, hospital_id,is_appointment_alloted:false,appointment_cancelled:{isCancelled:false}},
      //   { appointment_id, is_appointment_alloted: true },
      //   { new: true }
      // )

      const patient=await patientQueue.findOneAndUpdate({_id:event_id},
        {appointment_id,is_appointment_alloted:true},
        {new:true}
      )

      console.log(patient)
      
      if(patient!=null)
      {
        var doctor_response= await sendPatientDetailsToDoctor(patient_id,patient, doctor_id) // deal in the doctorBackendRequests
        console.log(doctor_response.message);
      }

      const details = {
        appointment_id,
        doctor_id,
        hospital_id,
        doctor_name: patient.doctor_id_name_department[1],
        hospital_name: patient.hospital_id_name[1],
        time_slots: patient.patient_details.time_slots,
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
      response = {patient_server_response:res.data.message,doctor_server_response:doctor_response.message}
    }
    else  {
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


exports.fetchHospitalsCardDetails=async(req,res)=>{
  try{
    const hospital_ids = req.body.hospital_ids;
    const hospitalDetails = mongoose.model('details', hospitalDetailsSchema);
    const response = [];
    const promises = hospital_ids.map(async(hospital_id)=>{
      const hospital_details = await hospitalDetails.findOne({hospital_id});
      
      if(hospital_details!=null)
      {
        let arr = [];
        arr.push(hospital_id);
        arr.push(hospital_details.hospital_name);
        arr.push(hospital_details.hospital_location.address);
        arr.push(hospital_details.hospital_rating);
        await response.push(arr);
      }
    });
    await Promise.all(promises);
    res.status(200).json({hospitals_card_details:response});
  }
  catch(err)
  {
    console.log(err);
    res.status(500).json({message:err.message});
  }
}

exports.fetchHospitalDetails=async(req,res)=>{
  try{
    const hospital_id=req.params.hospital_id;

    const doctor_details=new mongoose.model('doctors',doctorDetailsSchema);

    const doctors=await doctor_details.findOne({hospital_id});
    console.log(doctors);

    res.status(200).json({response:doctors})
  }
  catch(err)
  {
    console.log(err.message);
    res.status(500).json({message:err.message});
  }
}