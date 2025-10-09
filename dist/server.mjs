// server.mjs (for ES modules)
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { initSocket } from "./lib/socketServer.js";
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    const server = createServer(async (req, res) => {
        const parsedUrl = parse(req.url || "", true);
        await handle(req, res, parsedUrl);
    });
    initSocket(server);
    server.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
