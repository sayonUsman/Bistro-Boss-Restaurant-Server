const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `${process.env.DB_URI}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("Bistro_Boss_Restaurant_DB");
    const selectedOrders = database.collection("selected orders");

    app.get("/", async (req, res) => {
      res.send("Server is running.");
    });

    app.get("/menu", async (req, res) => {
      const menu = await database.collection("menu").find().toArray();
      res.send(menu);
    });

    app.get("/reviews", async (req, res) => {
      const reviews = await database.collection("reviews").find().toArray();
      res.send(reviews);
    });

    app.post("/selected-orders", async (req, res) => {
      const ordersDetails = req.body;
      const result = await selectedOrders.insertOne(ordersDetails);
      res.send(result);
    });

    app.get("/selected-orders", async (req, res) => {
      const email = req.query.email;
      const query = { customerEmail: email };
      const result = await selectedOrders.find(query).toArray();
      res.send(result);
    });
  } catch {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.listen(port);
