import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        // Attempt to verify the token and log the decoded result
        try {
          const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          const email = decoded.useremail;
          const user = await User.findOne({ email });
          req.user = user;
          next();
        } catch (verificationError) {
          res.status(400).send({ status: verificationError });
        }
      } else {
        res.status(400).send({ status: "Token is empty" });
      }
    } catch (error) {
      res.status(400).send({ status: error });
    }
  } else {
    res.status(400).send({ status: "There is no token attached to header" });
  }
});

// check wether the user is a admin
const isPatient = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.userType !== "Patient") {
    res.status(405).send({ status: "you are not an Patient" });
  } else {
    next();
  }
});

const isDoctor = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.userType !== "Doctor") {
    res.status(405).send({ status: "you are not a Doctor" });
  } else {
    next();
  }
});

const isManager = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.userType !== "Manager") {
    res.status(405).send({ status: "you are not a Manager" });
  } else {
    next();
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.userType !== "Admin") {
    res.status(405).send({ status: "you are not a Admin" });
  } else {
    next();
  }
});

//expotation
export { protect, isAdmin, isManager, isDoctor, isPatient};
