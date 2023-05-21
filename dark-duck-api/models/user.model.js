const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema(
  {
    username: { type: String, trim: true, required: true },
    alias: { type: String, trim: true, required: true },
    email: {
      type: String,
      trim: true,
      required: [true, `Email Can't be blank`],
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
      unique: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, trim: true }, // password: { type:String, required: true, trim: true },
    countryCode: { type: String, trim: true, required: true },
    phone: { type: Number, trim: true, required: true },
    age: { type: Number, trim: true, required: true },
    country: { type: String, trim: true, required: true },
    language: { type: String, trim: true, required: true },
    occupation: { type: String, trim: true, required: true },
    instruments: { type: String, trim: true, required: true },
    research: { type: String, trim: true, required: true },
    software: { type: String, trim: true, required: true },
    highEducation: { type: String, trim: true, required: true },
    zipCode: { type: String, trim: true, required: true },
    address: { type: String, trim: true, required: true },
    cityCode: { type: String, trim: true, required: true },
    termsCondition: { type: Boolean, default: false, enum: [false, true] },
    otp: { type: String, default: null },
  },
  {
    strict: true,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  next();
});

UserSchema.plugin(timestamps);
UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", UserSchema);
module.exports.Schema = UserSchema;
