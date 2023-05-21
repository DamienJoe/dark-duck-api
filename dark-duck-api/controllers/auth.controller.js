var express = require("express");
var app = express();
const nodemailer = require("nodemailer");
const ejs = require("ejs");
app.engine("ejs", ejs.__express); // intializing ejs to send email template
app.set("view engine", "ejs");

const check = require("../helpers");
const bcrypt = require("bcryptjs"); // It is used for encrypt password
// ----------------- Import Model Starts -------------------- //
const Model = require("../models");
// ---------------- Import Model Ends ---------------------- //

const jwt = require("jsonwebtoken");
const env = require("../config");
const countries = require("countries-list");
const cities = require("cities-list");

// ----------  Mailer Configuration ---------- //
const transporter = nodemailer.createTransport(env.email);
// --------- ------------------------------------ //

exports.user_register = async (req, res, next) => {
  console.log("req", req.body);
  if (
    req.body.username &&
    req.body.email &&
    req.body.password &&
    req.body.alias &&
    req.body.countryCode &&
    req.body.age &&
    req.body.country &&
    req.body.occupation &&
    req.body.language &&
    req.body.instruments &&
    req.body.research &&
    req.body.software &&
    req.body.highEducation &&
    req.body.zipCode &&
    req.body.address &&
    req.body.username.trim() !== "" &&
    req.body.email.trim() !== "" &&
    req.body.password.trim() !== "" &&
    req.body.alias.trim() !== "" &&
    req.body.countryCode.trim() !== "" &&
    req.body.phone.trim() !== "" &&
    req.body.age.trim() !== "" &&
    req.body.country.trim() !== "" &&
    req.body.language.trim() !== "" &&
    req.body.occupation.trim() !== "" &&
    req.body.instruments.trim() !== "" &&
    req.body.research.trim() !== "" &&
    req.body.software.trim() !== "" &&
    req.body.highEducation.trim() !== "" &&
    req.body.zipCode.trim() !== "" &&
    req.body.address.trim() !== "" &&
    req.body.cityCode.trim() !== ""
  ) {
    try {
      req.body.username = req.body.username.trim();
      req.body.alias = req.body.alias.trim();
      req.body.email = req.body.email.trim();
      req.body.password = req.body.password.trim();

      req.body.countryCode = req.body.countryCode.trim();
      req.body.phone = req.body.phone.trim();
      req.body.age = req.body.age.trim();
      req.body.country = req.body.country.trim();

      req.body.language = req.body.language.trim();
      req.body.occupation = req.body.occupation.trim();
      req.body.instruments = req.body.instruments.trim();
      req.body.research = req.body.research.trim();

      req.body.software = req.body.software.trim();
      req.body.highEducation = req.body.highEducation.trim();
      req.body.zipCode = req.body.zipCode.trim();
      req.body.address = req.body.address.trim();

      req.body.cityCode = req.body.cityCode.trim();

      if (!check.EmailValidation(req.body.email)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Email" });
      }

      if (!check.AphabeticalsValidation(req.body.username)) {
        return res
          .status(400)
          .json({ success: false, message: "username, Enter only letters" });
      }
      if (req.body.password.length < 8) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Password, minimum length must be 8",
          });
      }
      let data = {
        username: check.capitalizeFirstLetterEachWord(req.body.username),
        password: bcrypt.hashSync(req.body.password, 10),
        termsCondition: req.body.termsCondition ? true : false,
        alias: req.body.email,
        countryCode: req.body.countryCode,
        phone: req.body.phone,
        age: req.body.age,
        country: req.body.country,
        language: req.body.language,
        occupation: req.body.occupation,
        instruments: req.body.instruments,
        research: req.body.research,
        software: req.body.software,
        highEducation: req.body.highEducation,
        zipCode: req.body.zipCode,
        address: req.body.address,
        cityCode: req.body.cityCode,
        email: req.body.email.toLowerCase(),
      };

      const userExist = await Model.User.findOne({ email: data.email });
      if (!userExist) {
        const newAccount = await Model.User.create(data);
        // const token = jwt.sign({ userId: newAccount._id }, env.secret, { expiresIn:"1h" });
        const token = jwt.sign(
          {
            userId: newAccount._id,
            email: newAccount.email,
            username: newAccount.username,
          },
          env.secret,
          {
            expiresIn: "7 days",
          }
        );
        if (newAccount) {
          let passData = {
            link: `${env.baseURL}/user/api/v1/verify-email/${btoa(token)}`,
            name: data.username,
          };
          ejs.renderFile(
            env.viewsPath + "/welcome-email.ejs",
            passData,
            async function (err, htmlData) {
              if (err) {
                console.log("Ejs Error Check  ---->> ", err);
                await Model.User.findByIdAndDelete(newAccount._id);
                res.status(200).json({
                  success: true,
                  message:
                    "Due to some technical reason unable to create your account, please try after some time.",
                });
              } else {
                let mailOptions = {
                  from: env.email.from,
                  to: data.email,
                  subject: `Welcome Email`,
                  html: htmlData,
                };
                transporter.sendMail(mailOptions, async function (error, info) {
                  if (error) {
                    console.log(
                      "Error in Sending Nodemailer Mail ------  - -- -  ",
                      error
                    );
                    await Model.User.findByIdAndDelete(newAccount._id);
                    res.status(200).json({
                      success: true,
                      message:
                        "Due to some technical reason unable to create your account, please try after some time.",
                    });
                  } else {
                    console.log(
                      "Nodemailer Message sent: - - -- - - -  ---  " +
                        info.response
                    );
                    res.status(200).json({
                      success: true,
                      token: token,
                      message:
                        "Account Created Successfully!, Welcome email has been sent to regsitered email",
                    });
                  }
                });
              }
            }
          );
        }
      } else {
        res
          .status(400)
          .json({ success: false, message: "email already in use" });
      }
    } catch (error) {
      console.log("error", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Something went wrong, please try again later",
          error,
        });
    }
  } else {
    res
      .status(400)
      .json({
        success: false,
        message: "Bad Request, username, email, password, gender is required",
      });
  }
};

exports.user_login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (email && password && email.trim() !== "" && password !== "") {
      email = email.toLowerCase();
      const result = await Model.User.findOne({ email });
      // console.log(result)
      if (result !== null && result !== "" && result !== undefined) {
        if (
          result.email === email &&
          bcrypt.compareSync(password, result.password)
        ) {
          const token = jwt.sign(
            {
              userId: result._id,
              email: result.email,
              username: result.username,
            },
            env.secret,
            {
              expiresIn: "7 days",
            }
          );
          if (token) {
            res
              .status(200)
              .json({
                success: true,
                message: "Authenticated Successfully!",
                token: token,
              });
          } else {
            res
              .status(500)
              .json({
                success: false,
                message:
                  "Internal Server Error, Please try to login after some time",
              });
          }
        } else {
          res
            .status(401)
            .json({ success: false, message: "Invalid Credentials" });
        }
      } else {
        res
          .status(401)
          .json({
            success: false,
            message: `It seems, email is not registered`,
          });
      }
    } else {
      res
        .status(400)
        .json({
          success: false,
          message: `Bad Request, 'email', 'password' required`,
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong, please try again later",
        error,
      });
  }
};

exports.request_otp = async (req, res, next) => {
  try {
    let { email } = req.body;
    if (email && email.trim() !== "") {
      email = email.trim();
      email = email.toLowerCase();
      if (!check.EmailValidation(email)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Email" });
      }

      let user = await Model.User.findOne({ email: email });

      if (!user) {
        res
          .status(200)
          .json({
            success: false,
            message: `It seem's your email is not registered`,
          });
      }
      let otp = check.generate6digitCode();

      await Model.User.findByIdAndUpdate(user._id, { otp });
      let passData = { name: user.username, otp: otp };
      ejs.renderFile(
        env.viewsPath + "/request-otp-email.ejs",
        passData,
        async function (err, htmlData) {
          if (err) {
            console.log("Ejs Error Check  ---->> ", err);
            await Model.User.findByIdAndUpdate(user._id, { otp: null });
            res.status(200).json({
              success: true,
              message:
                "Due to some technical reason unable to send request otp email, please try after some time.",
            });
          } else {
            let mailOptions = {
              from: env.email.from,
              to: user.email,
              subject: `Request Otp Email`,
              html: htmlData,
            };
            transporter.sendMail(mailOptions, async function (error, info) {
              if (error) {
                console.log(
                  "Error in Sending Nodemailer Mail ------  - -- -  ",
                  error
                );
                await Model.User.findByIdAndUpdate(user._id, { otp: null });
                res.status(200).json({
                  success: true,
                  message:
                    "Due to some technical reason unable to send request otp email, please try after some time.",
                });
              } else {
                console.log(
                  "Nodemailer Message sent: - - -- - - -  ---  " + info.response
                );
                res.status(200).json({
                  success: true,
                  message: "Otp sent on your registered email",
                });
              }
            });
          }
        }
      );
    } else {
      res
        .status(400)
        .json({ success: false, message: "Bad Request, email is required" });
    }
  } catch (error) {
    next(error);
  }
};

exports.verify_otp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (email && otp && email.trim() !== "" && otp.trim() !== "") {
      if (!check.EmailValidation(email)) {
        return res
          .status(200)
          .json({ success: false, message: "Invalid Email" });
      }

      if (!check.NumericsValidation(otp)) {
        return res.status(200).json({ success: false, message: "Invalid Otp" });
      }

      const user = await Model.User.findOne({ email: email, otp: otp });
      console.log("user->>", user);

      if (!user) {
        res.status(200).json({ success: false, message: `Otp not matched` });
      } else {
        await Model.User.findByIdAndUpdate(user._id, { otp: true });
        res.status(200).json({ success: true, message: "Verified" });
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.reset_password = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // const result = await UserSchema.validateAsync({ email, password});
    if (!check.EmailValidation(email)) {
      return res.status(200).json({ success: false, message: "Invalid Email" });
    }
    if (password.length < 8) {
      return res
        .status(200)
        .json({
          success: false,
          message: "Password, minimum length must be 8",
        });
    }
    const user = await Model.User.findOne({ email: email });
    console.log("user", user);
    if (user.otp === null) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid Request" });
    } else {
      const regExp = new RegExp("/^d+$/");
      if (user.otp !== true && regExp.test(user.otp)) {
        return res
          .status(200)
          .json({
            success: false,
            message: "Invalid Request, Please verify OTP",
          });
      } else {
        if (!user) {
          return res
            .status(200)
            .json({
              success: false,
              message: "Account seems to be not registered",
            });
        } else {
          let encryptedPass = bcrypt.hashSync(req.body.password, 10);
          await Model.User.findByIdAndUpdate(
            user._id,
            { password: encryptedPass, otp: null },
            { new: true }
          );
          res
            .status(200)
            .json({ success: true, message: "Your Password has been reset" });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.all_countries = async (req, res) => {
  try {
    res
      .status(200)
      .json({
        success: true,
        data: countries.countries,
        languages: countries.languagesAll,
      });
  } catch (error) {
    console.log(error);
  }
};
