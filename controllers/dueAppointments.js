const mongoose = require('mongoose')


const { patientTracksSchema } = require('../models/patientTracksSchema')

const pendingAppointmentsConfrimations = async (req, res) => {
  const patinetQueue = mongoose.model('patientTracks', patientTracksSchema)
  try {
    const hospital_id = req.params.hospital_id
    const pending_requests_confirmations = await patinetQueue.find({
      is_appointment_alloted: false,
      hospital_id,
    })
    const pending_doctor_allocations = await patinetQueue.find({
      is_appointment_alloted: true,
      doctor_id: null,
    })

    res
      .status(200)
      .json({ pending_requests_confirmations, pending_doctor_allocations })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


module.exports = {
  pendingAppointmentsConfrimations
}
