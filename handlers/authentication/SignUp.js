const { isUserAlreadyRegistered, signUp } = require("../../entities/SignUp");

const Router = require("express");
const express = require("express");
const r = Router();

r.post("/sign-up", express.json(), async (req, res) => {
  const credentials = req.body;
  if (credentials) {
    try {
      if (
        credentials.userName === "" ||
        credentials.password === "" ||
        credentials.mail === "" ||
        credentials.role === "" ||
        credentials.authMethod === ""
      ) {
        return res.status(400).json("Invalid input");
      }

      const userAlreadyExisted = await isUserAlreadyRegistered(
        credentials.userName,
        credentials.mail
      );
      if (userAlreadyExisted) {
        return res.status(400).json("User already registered");
      }

      const userSignUpResult = await signUp(
        credentials.userName,
        credentials.password,
        credentials.mail,
        credentials.role,
        credentials.authMethod
      );
      if (userSignUpResult) {
        res.status(200).json("User registered successfully");
      } else {
        res.status(500).json("Failed to register user");
      }
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = r;