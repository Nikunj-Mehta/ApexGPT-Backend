import express from "express"; 
import "dotenv/config"; // Used to import and use .env file
import cors from "cors"; // Cross orgin resourse sharing allows backend to accept request from other domains like communication between frontend and backend.
import mongoose from "mongoose"; // npm package used to connect MongoDB Atlas with our backend, also use to define schema and validations, middlewares
import chatRoutes from "./routes/chat.js"; // Used to define routes

const app = express();
const PORT = 8080;

app.use(express.json()); // This is going to parse our incomming requests
app.use(cors());

app.use("/api", chatRoutes); // Whichever request comes that starts with /api, send it to chatRoutes.

app.listen(PORT, "0.0.0.0", () => { // so that the backend can listen to request form anywhere and not only local host
  console.log(`server running on: ${PORT}`);
  connectDB(); // Whenever we are starting the server the second thing we are going to do is connect with db.
});

const connectDB = async() => { // Mongoose: To see this syntax visit mongoose npm documentation.
  try{
    await mongoose.connect(process.env.MONGODB_URI); // URI → Uniform Resource Identifier
    console.log("Connected with Database");
  } catch(err) {
    console.log(`Failed to connect with Database ${err}`);
  }
}

// Just a simple change so that we can see CI/CD
app.get("/test", async (req, res) => {
  res.json({
    msg: "FINA: UPDATE: test was successful!"
  })
});