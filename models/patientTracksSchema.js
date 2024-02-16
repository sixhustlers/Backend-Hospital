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
      type: String,
    },
    temporary_symptoms: {
      type: String,
    },
  },
  doctor_id: {
    type: String,
  },
  doctor_name: {
    type: String,
  },
  department_name: {
    type: String,
  },
  hospital_id: {
    type: String,
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
    type: Boolean,
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