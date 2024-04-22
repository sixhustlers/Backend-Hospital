const mongoose = require('mongoose');
const BACKEND_DOCTOR_HOST = process.env.BACKEND_DOCTOR_HOST;
const axios = require('axios');
const { response } = require('express');

exports.sendPatientDetailsToDoctor = async (patient_id,patient, doctor_id) => {
    try{
        const {
            patient_details,
            doctor_id_name_department,
            hospital_id_name,
            appointment_id,
            is_Patient_Diagnosed,
            temporary_symptoms_disease_id_name,
        }=patient;

        console.log("hii")
        const response=await axios.post(`${BACKEND_DOCTOR_HOST}/newAppointment/${doctor_id}`, {
          patient_id,
          patient_details,
          hospital_id_name,
          event_id:appointment_id,
          is_Patient_Diagnosed,
          doctor_id_name_department,
          temporary_symptoms_disease_id_name,
          event_type: 'Appointment',
        }) 
        console.log(response.data.message);
        return {message:response.data.message, status:response.status};
    }
    catch(err){
        console.log(err.message);
    }
}
        