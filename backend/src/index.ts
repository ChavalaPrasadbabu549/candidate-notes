import connectDB from "./config/db";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./utils/socket";
import userRoutes from "./routes/user";
import candidateRoutes from "./routes/candidate";
import messageRoutes from "./routes/message";
import notificationRoutes from "./routes/notification";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", userRoutes);
app.use("/candidates", candidateRoutes);
app.use("/messages", messageRoutes);
app.use("/notifications", notificationRoutes);


// Socket.io
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH"],
        credentials: true,
    },
});


initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
