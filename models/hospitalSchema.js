const mongoose=require('mongoose')


const locationSchema = new mongoose.Schema({
  hospital_id: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  coordinates: {
    type: [Number], // Assuming [latitude,longitude]
    index: '2dsphere',
    required: true,
  },
}) // schema of the hospital's location

const hospitalDetailsSchema=new mongoose.Schema({
    hospital_id:{
        type:String,
        required:true
    },
    hospital_name:{
        type:String,
        required:true
    },
    hospital_location:{
        type:locationSchema,
    },
    hospital_rating:{
        type:Number,
    }
})

//wrote it temporarily , needs more modifications
const doctorDetailsSchema = new mongoose.Schema({
  hospital_id: {
    type: String,
    required: true,
  },
  department: {
    type: [String],
  },
  doctor_id: {
    type: [[String]],
  },
  doctor_name: {
    type: [[String]],
  },
  // the length of the array should be same

  doctor_speciality: {
    type: [[[String]]], // [insidemost] is array to store if a doctor has speciality in >1 domains
  },
  doctor_rating:{
    type:[[Number]]
  },
})

module.exports={
    hospitalDetailsSchema,
    doctorDetailsSchema
}