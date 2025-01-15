import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  doc: {
    isAadharVerified: { type: Boolean, required: true, default: false },
    isPANVerified: { type: Boolean, required: true, default: false },
    isPassportVerified: { type: Boolean, required: true, default: false },
    isVoterVerified: { type: Boolean, required: true, default: false },
    isDrivingLicenseVerified: { type: Boolean, required: true, default: false },
    isRationVerified: { type: Boolean, required: true, default: false },
    isBirthVerified: { type: Boolean, required: true, default: false },
  },
});

export default mongoose.model("User", userSchema);
