import mongoose from "mongoose";

// First we will create MessageSchema
const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// We usually create a new schema in new file but since MessageSchema is a part of ThreadSchema itself, therefor we are creating ThreadSchema in same file
const ThreadSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    default: "New Chat"
  },
  messages: [MessageSchema], // Jo bhi properties MessageSchema ki hai whi rhnge
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    defaule: Date.now
  }
});

export default mongoose.model("Thread", ThreadSchema); // export ThreadSchema as Thread.