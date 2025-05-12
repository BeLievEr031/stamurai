import axios from "axios"
import { io } from "socket.io-client";
const api = axios.create({
    baseURL: `https://stamurai-il1u.onrender.com/api/v1`,
    withCredentials: true
})

const socket = io('https://stamurai-il1u.onrender.com', {
    autoConnect: true,
    transports: ['websocket'],
    withCredentials: true,
});

export { socket };

export default api;