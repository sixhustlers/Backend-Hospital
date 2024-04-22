const mongoose = require('mongoose')

const { patientTracksSchema } = require('../models/patientTracksSchema')

// checks all the pending appointments requests from different patients and their doctor allocations
const pendingAppointmentsConfrimations = async (req, res) => {
  try {
    const hospital_id = req.params.hospital_id

    const patientQueue = mongoose.model('patientTracks', patientTracksSchema)
    
    const pending_requests_confirmations = await patientQueue.find(
      {
          is_appointment_alloted: false,
          "hospital_id_name.0": hospital_id,
          doctor_id_name_department: { $ne: []},
      }
    )
                              //OR
    // const pending_requests_confirmations = await patientQueue.aggregate([
    //   {
    //     $match: {
    //       is_appointment_alloted: false,
    //       'hospital_id_name.0': hospital_id,
    //       doctor_id_name_department: { $ne: [] },
    //     },
    //   },
    // ])

    const pending_doctor_allocations = await patientQueue.find({
      is_appointment_alloted: false,
      'hospital_id_name.0': hospital_id,
      doctor_id_name_department: { $eq: [] },
    })

    res
      .status(200)
      .json({ pending_requests_confirmations, pending_doctor_allocations })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message })
  }
}

const allocateDoctors=async(req,res)=>{
  try{
    
  }
  catch(err){
    console.log(err.message);
    res.status(500).json({message:err.message});
  }
}

module.exports = {
  pendingAppointmentsConfrimations,
}
