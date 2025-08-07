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

// On Save -> generate salt ->  User Password will be Hashed for security using  this salt
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

  this.salt = salt;
  // Update User Object -> replace original Password with hasheedPassword
  this.password = hashedPassword;

  next();
});

// check user : signin -> create newhashedPassword with password given by user in signin and salt and
// check newHashedPassword matches with HashedPAssword created on signup or not
userSchema.static("matchPassword",async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("user not found");

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== userProvidedHash)
    throw new Error("Incorrect Password");

  // already hashed password matches with new hashedPAssword return user object
  // return hashedPassword === userProvidedHash;
  return { ...user, password: undefined, salt: undefined };
});

const User = model("user", userSchema);

module.exports = User;
