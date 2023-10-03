const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require('../../config/key');

// Load input validation
const validateRegisterInput = require("../../validation/registeration");


// Load User model
const User = require("../../Schema/User");

// @route POST api/users/register
// @desc Register user
// @access Public
const RegisterControllers = ((req, res) => {

  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }


  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      const payload = {
        id: user.id,
        name: user.name
      };

      jwt.sign(
        payload,
        keys.key,
        {
          expiresIn: 31556926 // 1 year in seconds
        },
        (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token,
            name: user.name,
          });
        }
      );
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        image: req.body.dp
      });

      newUser
        .save()
        .catch(err => console.log(err));

      User.findOne({ email: req.body.email }).then(user => {
        console.log(newUser._id.toString())
        console.log(newUser)
        const payload = {
          id: newUser._id.toString(),
          name: newUser.name.toString()
        };

        jwt.sign(
          payload,
          keys.key,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              name: newUser.name.toString(),
            });
          }
        );
      })


    }
  });
});




module.exports = RegisterControllers