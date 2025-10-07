// WebSocket service for real-time updates
class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectInterval = 5000; // 5 seconds
    this.maxReconnectAttempts = 5;
    this.reconnectAttempts = 0;
    this.listeners = {};
    this.url = null; // Store the URL for reconnection
    this.isConnecting = false; // Prevent multiple connection attempts
  }

  connect(url) {
    // Prevent multiple connection attempts
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket connection already in progress or already connected');
      return;
    }
    
    // Close existing connection if it exists
    if (this.ws) {
      this.ws.close();
    }
    
    try {
      this.isConnecting = true;
      this.url = url; // Store the URL for reconnection
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.notifyListeners('open');
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners('message', data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected', event);
        this.isConnecting = false;
        this.notifyListeners('close');
        // Only attempt to reconnect if it wasn't a clean close (code 1005) or normal close (code 1000)
        if (event.code !== 1000 && event.code !== 1005) {
          this.attemptReconnect();
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        this.notifyListeners('error', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
    }
  }
  
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        // Use the stored URL for reconnection
        if (this.url) {
          this.connect(this.url);
        }
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
      this.reconnectAttempts = 0; // Reset for future attempts
    }
  }
  
  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }
  
  addListener(eventType, callback) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
  }
  
  removeListener(eventType, callback) {
    if (this.listeners[eventType]) {
      this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
    }
  }
  
  notifyListeners(eventType, data) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach(callback => callback(data));
    }
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
    this.url = null;
    this.reconnectAttempts = 0;
  }
}

// Export a singleton instance
export default new WebSocketService();