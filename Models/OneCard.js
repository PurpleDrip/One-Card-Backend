import mongoose from "mongoose";

const onecardSchema = new mongoose.Schema({
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  aadhar: { type: String, required: true },
  pan: { type: String, required: true },
  passport: { type: String, required: true },
  voter: { type: String, required: true },
  drivingLicense: { type: String, required: true },
  ration: { type: String, required: true },
  birthCertificate: { type: String, required: true },
  dob: { type: Date, required: true },
  phoneNumber: { type: String, required: true },
});

export default mongoose.model("OneCard", onecardSchema);
