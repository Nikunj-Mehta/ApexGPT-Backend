import express from "express";
import Thread from "../models/Thread.js"; // To import ThreadSchema
import getGroqAPIResponse from "../utils/groq.js"; // Used to make api calls the core logic is in that function just pass the message and store the response in a variable.

const router = express.Router(); // used to create mini, modular, separate route handlers in Express.

// test
router.post("/test", async (req, res) => { // if post request comes http://localhost:8080/api/test then this will be done.
  try {
    const thread = new Thread({
      threadId: "abcd", // you need to change this everytime you send a request as this field must be unique
      title: "Testing New Thread"
    });

    const response = await thread.save(); // This will save the thread in mongodb atlas, where ? as we have already connected Mongoose to db so it will take care of that. when mongoose sees .save() Mongoose automatically: Takes the connected database (configured earlier) Finds the correct collection (threads) Inserts the document there
    res.send(response);
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

// GET all threads(As we see the previous Threads(chat) for that we need this) sorted by updatedAt
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 }); // .sort({updatedAt: -1}) will sort by updatedAt and because of -1 it will be in descending order, as we want most recent chat at top
    res.json(threads);
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// GET the info of a particular thread using threadId (on clicking on a previous thread we want all the messages of that thread)
router.get("/thread/:threadId", async (req, res) => {
  const {threadId} = req.params; // Take the threadId from request parameter
  
  try{
    const thread = await Thread.findOne({ threadId }); // Try and find the Chat(Thread) with that threadId
    
    if(!thread) {
      res.status(404).json({ error: "Thread not found" });
    } 

    res.json(thread.messages); //response.json(): Converts HTTP response body → JS object  As we need to display only messages[] of req and reply so we will send message array only
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// DELETE : find the thread by threadId and delete it
router.delete("/thread/:threadId", async (req, res) => {
  const {threadId} = req.params; // Extract threadId from request params

  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId }); // find the thread by threadId and delete that

    if(!deletedThread) {
      res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

// POST: Most Imp request. The user types and sends the message, now we need ThreadId and message, we will first search in DB that is there a thread with this threadId. If yes then store the user's message, but if not then we will create a new Thread and will store the message in there. Now we will send a call to GROQ's API with the message and when we get the reply from API we will store that message(assistant) in the Thread.messages and then store the Thread in db, then the response will be sent to the frontend.
router.post("/chat", async (req, res) => {
  const {threadId, message} = req.body; // Extract threadId and messages from POST request's body
  
  if(!threadId || !message) {
    res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId }); // Search for the thread by threadId in DB first

    if(!thread) { // If thread not found then create a new thread with this threadId and store the message in that thread
      thread = new Thread({
        threadId,
        title: message, // message.split(" ").slice(0, 4).join(" ") : To store first 4 words of messages string.
        messages: [{ role: "user", content: message }] // It is an array of objects
      });
    } else { // If the thread already exists
      thread.messages.push({ role: "user", content: message }); // Push the new object in existing thread's messages array(of objects) and give role: user, content: message 
    }

    // We have already made the api call in groq.js in utils. We just need to send the message and store the response in a variable.
    const assistantReply = await getGroqAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply }); // Both new and existing Thread have the same name so this will be added correctly in new or existing thread.
    thread.updatedAt = new Date(); // update the existing Thread's updatedAt so that it comes to the top.

    await thread.save(); // Save the thread in DB. Thread is new the new thread with user, assistant message will be saved, or if the thread already exists then user, assistant reply will be added and existing thread will be updated and saved.
    res.json({ reply: assistantReply }); // Send the reply to Frontend
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;