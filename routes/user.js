const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async(req, res) =>{
  const {email, password} = req.body;
  const user =  User.matchPassword(email, password);//get user obj id user name password is correct

  console.log("user",user);
  return res.redirect("/");
})

// for signin : but users needs to signup first : then can sign in
router.post("/signup", async (req, res) => {
  // get user profile from frontend
  const { fullName, email, password } = req.body;

  await User.create({
    fullName,
    email,
    password,
  });

  return res.redirect("/");
  // return res.redirect("home");
});

module.exports = router;
