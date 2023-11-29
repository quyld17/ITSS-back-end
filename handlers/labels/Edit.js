const { tokenVerification } = require("../../middlewares/JWT");
const { editLabel } = require("../../entities/Labels");

const Router = require("express");
const express = require("express");

const r = Router();

r.post("/label", express.json(), async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json("Unauthorized");
  }
  const userId = await tokenVerification(token, res);
  if (!userId) {
    return res.status(401).json("Failed to authorize user");
  }

  const label = req.body;
  if (label) {
    try {
      if (
        label.labelId === null ||
        label.labelName === "" ||
        label.color === ""
      ) {
        return res.status(400).json("Invalid input");
      }
      const editLabelResult = await editLabel(label, userId);
      if (editLabelResult) {
        res.status(200).json("Updated label successfully");
      } else {
        return res.status(500).json("Failed to update label");
      }
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json("Internal Server Error");
    }
  } else {
    return res.status(400).json("Bad request");
  }
});

module.exports = r;