const mongoose = require('mongoose');

const patientTracksSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true,
  },
  patient_details: {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    blood_group: {
      type: String,
    },
    time_slots: {
      event_start:{
        type: Date, //store the date and time of the appointment in IST format
      },
      event_duration:{
        type: Number,
      },
    },
    temporary_symptoms_disease_id_name: {
      type: [String],
    },
  },
  doctor_id_name_department: {
    type: [String],
  },
  // doctor_name: {
  //   type: String,
  // },
  // department_name: {
  //   type: String,
  // },
  disease_id_name:{
    type: [String],
  },
  hospital_id_name: {
    type: [String],
    required: true,
  },

  appointment_id: {
    type: String,
  },
  is_appointment_alloted: {
    type: Boolean,
    required: true,
  },
  is_patient_diagnosed: {
    type: Boolean,        // need to be updated to true when the doctor finishes the appointemnt
    required: true,
  },
  appointment_cancelled: {
    // byPatient: {
    //     type: Boolean,
    // },
    // byReceptionist: {
    //     responese:{
    //         type:Boolean,
    //     },
    //     reason:{
    //         type:String,
    //     }
    // }
    isCancelled: {
      type: Boolean,
    },
    byWhom: {
      type: [String],
      enum: ['patient', 'receptionist', 'doctor'],
    },
    reason: {
      type: String,
    },
  },
  
  // transaction_id: {
  //     type: String,
  // },
})

module.exports = {
    patientTracksSchema
};