// lib/socketServer.ts
import { Server } from "socket.io";
let io = null;
export const initSocket = (server) => {
    if (!io) {
        io = new Server(server, {
            cors: { origin: "*" },
            path: "/socket.io",
        });
        io.on("connection", (socket) => {
            console.log("✅ Client connected:", socket.id);
            socket.on("disconnect", () => {
                console.log("❌ Client disconnected:", socket.id);
            });
        });
    }
    return io;
};
export const getIO = () => {
    if (!io)
        throw new Error("Socket.io not initialized!");
    return io;
};
