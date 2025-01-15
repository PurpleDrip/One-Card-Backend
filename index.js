// Updated backend code with login and register endpoints

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./Models/User.js";
import OneCard from "./Models/OneCard.js";
import onecard from "one-card";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set in environment variables.");
  process.exit(1);
}

// Register endpoint
app.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create and save new user
    const newUser = new User({ username, password, email });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      userName: newUser.username,
      id: newUser._id,
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.status(200).json({
      message: "Login successful",
      userName: user.username,
      doc: user.doc,
      id: user._id,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

app.post("/onecard", async (req, res) => {
  console.log("hello");
  const {
    fullName,
    aadhar,
    pan,
    passport,
    voter,
    drivingLicense,
    ration,
    birthCertificate,
    dob,
    password,
    phoneNumber,
  } = req.body;

  const obj = new onecard("guru");
  obj.signin("guru");
  obj.setAadhar(aadhar);
  obj.setPan(pan);
  obj.setPassport(passport);
  obj.setVoter(voter);
  obj.setDrivingLicense(drivingLicense);
  obj.setRation(ration);
  obj.setBirthCertificate(birthCertificate);
  obj.setDob(dob);

  const encrypted = obj.encrypt(obj.data);
  const { key, iv } = obj.getKeyAndIv();

  console.log(obj.getAuditLogs());

  res.status(200).json({ encrypted, key, iv });
});

app.post("/verifydoc", async (req, res) => {
  try {
    let { doc, encrypted, key, iv, id } = req.body;

    if (!doc || !encrypted || !key || !iv) {
      return res.status(400).json({
        message: "document name, encrypted, key, and iv are required",
      });
    }

    // Decrypt data
    const obj = new onecard("guru");
    obj.signin("guru");
    console.log(obj.data);
    const data = obj.decrypt(encrypted, key, iv);
    console.log(data);

    switch (doc.toLowerCase()) {
      case "aadhar":
        doc = "Aadhar";
        data.isAadharVerified = true;
        break;
      case "pan":
        doc = "Pan";
        data.isPanVerified = true;
        break;
      case "passport":
        doc = "Passport";
        data.isPassportVerified = true;
        break;
      case "voter":
        doc = "Voter";
        data.isVoterVerified = true;
        break;
      case "drivinglicense":
        doc = "Driving License";
        data.isDrivingLicenseVerified = true;
        break;
      case "ration":
        doc = "Ration";
        data.isRationVerified = true;
        break;
      case "birthcertificate":
        doc = "Birth Certificate";
        data.isBirthCertificateVerified = true;
        break;
      default:
        return res.status(400).json({ message: "Invalid document name" });
    }
    const isAadharVerified = data.isAadharVerified;
    const isPANVerified = data.isPanVerified;
    const isPassportVerified = data.isPassportVerified;
    const isVoterVerified = data.isVoterVerified;
    const isDrivingLicenseVerified = data.isDrivingLicenseVerified;
    const isRationVerified = data.isRationVerified;
    const isBirthCertificateVerified = data.isBirthCertificateVerified;

    const newdoc = {
      isAadharVerified,
      isPANVerified,
      isPassportVerified,
      isVoterVerified,
      isDrivingLicenseVerified,
      isRationVerified,
      isBirthCertificateVerified,
    };

    const user = await User.findByIdAndUpdate(id, { doc: newdoc });
    if (!user) {
      return res.status(500).json({ message: "redirect" });
    }

    // Re-encrypt the updated data
    const newEncrypted = obj.encrypt(data);
    const { key: newKey, iv: newIv } = obj.getKeyAndIv();

    // Log audit information (optional)
    console.log(obj.getAuditLogs());

    res.status(200).json({
      message: `Document ${doc} verified`,
      encrypted: newEncrypted,
      key: newKey,
      iv: newIv,
      doc: {
        isAadharVerified,
        isPANVerified,
        isPassportVerified,
        isVoterVerified,
        isDrivingLicenseVerified,
        isRationVerified,
        isBirthCertificateVerified,
      },
    });
  } catch (error) {
    console.error("Verification error:", error.message);
    res
      .status(500)
      .json({ message: "Failed to verify document", error: error.message });
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log("Listening on port:", port));
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
