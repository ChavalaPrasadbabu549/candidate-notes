import { Server } from "socket.io";
import { Message } from "../models/Message";

export const initSocket = (io: Server) => {
    io.on("connection", (socket) => {
        // Join candidate room
        socket.on("joinRoom", (candidateId: string) => {
            socket.join(candidateId);
        });

        // Join personal user room (so tags/DMs can reach them)
        socket.on("joinUserRoom", (userId: string) => {
            socket.join(userId);
        });

        // Handle sending message
        socket.on("sendMessage",
            async ({ candidateId, sendId, message, tags, }: {
                candidateId: string;
                sendId: string;
                message: string;
                tags: string[];
            }) => {
                try {
                    // Save in DB
                    const newMessage = await Message.create({
                        candidateId,
                        sendId,
                        message,
                        tags,
                    });
                    // Populate sender & tags for frontend clarity
                    const populatedMsg = await newMessage.populate([
                        { path: "sendId", select: "name email" },
                        { path: "tags", select: "name email" },
                    ]);

                    // Emit to everyone in candidate room (group chat)
                    io.to(candidateId).emit("receiveMessage", populatedMsg);

                    if (tags?.length) {
                        tags.forEach((taggedUserId) => {
                            io.to(taggedUserId).emit("receiveTaggedMessage", populatedMsg);
                        });
                    }

                } catch (err) {
                    console.error("Error in sendMessage:", err);
                }
            }
        );

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
};
