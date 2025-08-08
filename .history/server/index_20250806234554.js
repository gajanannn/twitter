const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const nodemailer = require("nodemailer");

const uri =
  "mongodb+srv://admin:admin@twiller.7trsyfk.mongodb.net/?retryWrites=true&w=majority&appName=twiller";
const cors = require("cors");
const port = 5000;

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

    app.post("/request-otp", (req, res) => {});
    app.post("/loginHistory", async (req, res) => {
      const { email, browser, os, device } = req.body;

      // Get IP from request headers or socket
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;

      const loginRecord = {
        email,
        browser,
        os,
        device,
        ip,
        loginTime: new Date(),
      };

      console.log("Saving login history:", loginRecord);
      console.log("x-forwarded-for:", req.headers["x-forwarded-for"]);
      console.log("remoteAddress:", req.socket.remoteAddress);

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
        res.json(result);
      } catch (error) {
        console.error("DB error:", error);
        res.status(500).json({ message: "Something went wrong" });
      }
    });

    // 👇 Add support for trailing slash
    app.get("/loginHistory/", (req, res) => {
      res.redirect(
        "/loginHistory" + req.url.slice("/loginHistory/".length - 1)
      );
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

app.listen(port, () => {
  console.log(`Twiller is running on port ${port}`);
});
