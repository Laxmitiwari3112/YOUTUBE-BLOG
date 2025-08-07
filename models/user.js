const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("node:crypto");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      // required: true,// salt is auto generated
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
      default: "/images/defaulProfile.jpeg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// On Save -> User Password will be Hashed for security
userSchema.pre("save", function (next) {
  // Current user
  const user = this;

  if (!user.isModified("password")) return;

  // create salt(randon str) for user --> key-randomBytes
  const salt = randomBytes(16).toString();

  // ('algorithmUsedToCreatePassword', usingKey);//key is defined
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  // Update User Object -> replace original Password
  this.salt = salt;
  this.password = hashedPassword;

  next();
});

const User = model("user", userSchema);

module.exports = User;
