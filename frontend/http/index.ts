import axios from "axios"
import { io } from "socket.io-client";
const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
    withCredentials: true
})

const socket = io(process.env.NEXT_PUBLIC_API_URL, {
    autoConnect: true,
    transports: ['websocket'],
    withCredentials: true,
});

export { socket };

export default api;