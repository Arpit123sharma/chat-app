// socketService.js

import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    
  }

  connect(url, options) {
    if (!this.socket) {
      this.socket = io(url, options);

      this.socket.on('connect', () => {
        console.log('Socket connected with the user id :',this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const socketService = new SocketService();
export default socketService;
