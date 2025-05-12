import axios from "axios"
import { io } from "socket.io-client";
const api = axios.create({
    baseURL: `http://localhost:5000/api/v1`,
    withCredentials: true
})

const socket = io('http://localhost:5000', {
    autoConnect: true,
    transports: ['websocket'],
    withCredentials: true,
});

export { socket };

export default api;