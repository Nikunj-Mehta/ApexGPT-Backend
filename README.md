**ApexGPT Backend**

- **Description:** Backend API for a simple chat application that stores conversation threads in MongoDB and uses GROQ's chat completions API to generate assistant replies.

**Features**
- **Store Chats:** Saves conversation threads and messages in MongoDB (`Thread` model).
- **Chat Completion:** Sends user messages to GROQ API and stores assistant replies.
- **REST API:** Endpoints to create/read/delete threads and send chat messages.

**Prerequisites**
- **Node.js:** v18+ recommended.
- **MongoDB:** A MongoDB Atlas connection string (or local MongoDB URI).
- **GROQ API Key:** A valid GROQ API key for calling the chat completions endpoint.

**Required Environment Variables**
- `MONGODB_URI` : MongoDB connection string used by Mongoose.
- `GROQ_API_KEY` : API key for GROQ's chat completions endpoint.

Create a `.env` file in the project root with:

```
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

**Install**
Open a PowerShell terminal in the project root and run:

```powershell
npm install
```

**Run**
- Start the server (default port is `8080`):

```powershell
node server.js
# or (if you have nodemon installed globally)
nodemon server.js
```

The server listens on port `8080` (see `server.js`).

**API Endpoints**
All routes are prefixed with `/api` (e.g. `http://localhost:8080/api/...`).

- `POST /api/test`
	- Creates a sample thread (for testing). Returns the saved thread document.
	- Body: none (the route creates a sample thread with hardcoded `threadId: "abcd"`).

- `GET /api/thread`
	- Returns all threads sorted by `updatedAt` (most recent first).

- `GET /api/thread/:threadId`
	- Returns the messages array for the specified `threadId`.

- `DELETE /api/thread/:threadId`
	- Deletes the thread with the given `threadId`.

- `POST /api/chat`
	- Main chat endpoint. Sends user message to GROQ and stores both user and assistant messages in the thread.
	- Body (JSON):
		- `threadId` (string): unique id for the conversation thread
		- `message` (string): user's message/prompt
	- Response (JSON): `{ reply: "assistant reply text" }`

Example `curl` (PowerShell-friendly) for sending a chat:

```powershell
curl -Method POST -Uri http://localhost:8080/api/chat -ContentType 'application/json' -Body (
	ConvertTo-Json @{ threadId = 'thread-1'; message = 'Hello, world' }
)
```

**Project Structure**
- `server.js` — Express server and MongoDB connection.
- `routes/chat.js` — All API routes for threads and chat.
- `models/Thread.js` — Mongoose schema for `Thread` and nested `Message`.
- `utils/groq.js` — Small helper to call GROQ's chat completions API.
- `package.json` — Project dependencies.

**Author**
- **Nikunj Mehta**: https://github.com/Nikunj-Mehta

