import mongoose from "mongoose"

const companySchema = new mongoose.Schema({
  companyId: { 
    type: Number, 
    required: true 
  },
  developed: [Number],
  published: [Number],
  name: {
    type: String,
    required: true
  }
})

export default mongoose.model('Company', companySchema)