const router = require('express').Router()

const {
  patientBookingRequests,
  patientAppointmentResponse,
} = require('../controllers/patientBackendRequests')
const {
  pendingAppointmentsConfrimations,
} = require('../controllers/dueAppointments')

router.route('/bookingRequest').post(patientBookingRequests)
router
  .route('/pendingRequests/:hospital_id')
  .get(pendingAppointmentsConfrimations)
router.route('/bookingResponse/:hospital_id').post(patientAppointmentResponse)

module.exports = router
