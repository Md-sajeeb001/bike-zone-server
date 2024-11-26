require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middel ware !

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("connect database coming soon");
});

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
});

const uri = `mongodb+srv://${process.env.DB_BIKENAME}:${process.env.DB_BIKEPASS}@cluster0.e4qpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const bikeCollection = client.db("bikeZoneDB").collection("bikeZone");

    app.get("/addBike", async (req, res) => {
      const cursor = bikeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/addBike/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await bikeCollection.findOne(quary);
      res.send(result);
    });

    app.post("/addBike", async (req, res) => {
      const newBike = req.body;
      const result = await bikeCollection.insertOne(newBike);
      res.send(result);
    });

    app.put("/addBike/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBike = req.body;
      const bike = {
        $set: {
          name: updatedBike.name,
          quantity: updatedBike.quantity,
          hight: updatedBike.hight,
          waight: updatedBike.waight,
          engine: updatedBike.engine,
          category: updatedBike.category,
          photo: updatedBike.photo,
        },
      };
      const result = await bikeCollection.updateOne(filter, bike, options);
      res.send(result);
    });

    app.delete("/addBike/:id", async (req, res) => {
      const id = req.params.id;
      const newBike = { _id: new ObjectId(id) };
      const result = await bikeCollection.deleteOne(newBike);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
