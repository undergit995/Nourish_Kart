import { io } from 'socket.io-client';

// The URL of your backend server.
// In a real production app, you might use environment variables here.
const URL = 'http://localhost:4500';

export const socket = io(URL, {
  autoConnect: false // We will connect manually when the user is logged in.
});