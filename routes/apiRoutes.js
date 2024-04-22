const router = require('express').Router()

const {
  patientBookingRequests,
  patientAppointmentResponse,
  fetchHospitalsCardDetails,
  fetchHospitalDetails,
} = require('../controllers/patientBackendRequests')

const {
  pendingAppointmentsConfrimations,
} = require('../controllers/dueAppointments')


router.route('/bookingRequest').post(patientBookingRequests)
router.route('/bookingResponse/:hospital_id').post(patientAppointmentResponse)


router.route('/pendingRequests/:hospital_id').get(pendingAppointmentsConfrimations)

router.route('/fetchHospitalsCardDetails').post(fetchHospitalsCardDetails)
router.route('/fetchHospitalDetails/:hospital_id').post(fetchHospitalDetails)

module.exports = router
