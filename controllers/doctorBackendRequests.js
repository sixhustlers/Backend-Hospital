const mongoose = require('mongoose');
const BACKEND_DOCTOR_HOST = process.env.BACKEND_DOCTOR_HOST;
const axios = require('axios');

// exports.sendPatientDetailsToDoctor = async (patient, doctor_id) => {
//     try{
//         const {
//             patient_id,
//             patient_details,
//             hospital_id,
//             appointment_id,
//             is_Patient_Diagnosed,
//         }=patient;

//         await axios.post(`${BACKEND_DOCTOR_HOST}/appointPatient`, {
//             patient_id,
//             patient_details,
//             hospital_id,
//             appointment_id,
//             is_Patient_Diagnosed,
//             doctor_id,
//         });         
//     }
//     catch(err){
//         console.log(err.message);
//     }
// }
        