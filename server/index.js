const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
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
