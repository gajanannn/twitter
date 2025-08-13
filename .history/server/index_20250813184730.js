const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const express = require("express");
const uri =
  "mongodb+srv://admin:admin@twiller.7trsyfk.mongodb.net/?retryWrites=true&w=majority&appName=twiller";
const cors = require("cors");
const port = 5000;
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log(`server is running on port ${port}`);
    const postcollection = client.db("database").collection("posts");
    const usercollection = client.db("database").collection("users");
    const loginHistory = client.db("database").collection("login history");

    app.post("/canreset", async (req, res) => {
      const { email } = req.body;

      if (!email) return res.status(400).send({ message: "Email is required" });

      try {
        console.log({ email });
        const user = await usercollection.findOne({ email });

        if (!user) {
          return res.status(404).send({
            allowed: false,
            message: "User not found",
          });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // reset time to midnight

        const lastResetDate = user.lastResetDate
          ? new Date(user.lastResetDate)
          : null;
        const resetCount = user.resetCount || 0;

        if (!lastResetDate || lastResetDate < today) {
          // First reset of the day
          await usercollection.updateOne(
            { email },
            {
              $set: { lastResetDate: today, resetCount: 1 },
            }
          );
          return res.send({
            allowed: true,
            message: "Reset allowed (1st today)",
          });
        }

        if (resetCount >= 2) {
          return res.send({
            allowed: false,
            message: "Reset limit reached for today",
          });
        }

        // Second reset allowed
        await usercollection.updateOne(
          { email },
          {
            $inc: { resetCount: 1 },
          }
        );

        return res.send({
          allowed: true,
          message: "Reset allowed (2nd today)",
        });
      } catch (error) {
        console.error("Error in /canreset:", error);
        res
          .status(500)
          .send({ allowed: false, message: "Internal server error" });
      }
    });

    app.post("/register", async (req, res) => {
      const user = req.body;
      const result = await usercollection.insertOne(user);
      res.send(result);
    });
    app.get("/loggedinuser", async (req, res) => {
      const email = req.query.email;
      const user = await usercollection.find({ email: email }).toArray();
      res.send(user);
    });
    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postcollection.insertOne(post);
      res.send(result);
    });
    app.get("/post", async (req, res) => {
      const post = (await postcollection.find().toArray()).reverse();
      res.send(post);
    });
    app.get("/userpost", async (req, res) => {
      const email = req.query.email;
      const post = (
        await postcollection.find({ email: email }).toArray()
      ).reverse();
      res.send(post);
    });
    app.get("/user", async (req, res) => {
      const user = await usercollection.find().toArray();
      res.send(user);
    });

    app.set("trust proxy", true);
    app.post("/loginHistory", async (req, res) => {
      const { email, browser, os, device } = req.body;

      let ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;

      // Remove IPv6 prefix if present
      if (ip.startsWith("::ffff:")) {
        ip = ip.replace("::ffff:", "");
      }

      const loginRecord = {
        email,
        browser,
        os,
        device,
        ip,
        loginTime: new Date(),
      };

      try {
        await loginHistory.insertOne(loginRecord);
        res.json({ success: true, message: "Login history saved" });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });

    app.get("/loginHistory", async (req, res) => {
      const email = req.query.email;
      console.log("Email from query:", email);

      if (!email) {
        return res
          .status(400)
          .json({ message: "Email query parameter is required" });
      }

      try {
        const result = await loginHistory.find({ email }).toArray();
        res.json(result); // return JSON
      } catch (error) {
        console.error("DB error:", error);
        res.status(500).json({ message: "Something went wrong" });
      }
    });

    app.patch("/userupdate/:email", async (req, res) => {
      const filter = req.params;
      const profile = req.body;
      const options = { upsert: true };
      const updatedoc = { $set: profile };
      const result = await usercollection.updateOne(filter, updatedoc, options);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("twiller is running");
});
const otpStore = {}; // In-memory store: { email: { otp, expiresAt } }

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // valid for 5 minutes

  otpStore[email] = { otp, expiresAt };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP send failed:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" }); // ✅ And here
  }
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) {
    return res.status(400).json({ success: false, message: "No OTP sent" });
  }

  const { otp: storedOtp, expiresAt } = otpStore[email];

  if (Date.now() > expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (storedOtp === otp) {
    delete otpStore[email];
    return res.json({ success: true, message: "OTP verified successfully" });
  }

  return res.status(400).json({ success: false, message: "Invalid OTP" });
});

const languageOtpStore = {}; // { email: { otp, expiresAt } }
app.post("/send-language-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  languageOtpStore[email] = { otp, expiresAt };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP for Language Change",
    text: `Your OTP for changing language is ${otp}. It expires in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Language OTP sent successfully" });
  } catch (error) {
    console.error("Language OTP send failed:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});
app.post("/verify-language-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!languageOtpStore[email]) {
    return res.status(400).json({ success: false, message: "No OTP sent" });
  }

  const { otp: storedOtp, expiresAt } = languageOtpStore[email];

  if (Date.now() > expiresAt) {
    delete languageOtpStore[email];
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (storedOtp === otp) {
    delete languageOtpStore[email];
    return res.json({
      success: true,
      message: "OTP verified. Language can be changed.",
    });
  }

  return res.status(400).json({ success: false, message: "Invalid OTP" });
});

app.listen(port, () => {
  console.log(`Twiller is running on port ${port}`);
});
