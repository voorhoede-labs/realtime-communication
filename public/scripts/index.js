const serverSentEvents = new EventSource('/');
var streamingCurrentTime;
const timeContainer = document.querySelector('[data-time]');
const websocket = new WebSocket('ws://localhost:8080');

// server-sent-events (SSE)
serverSentEvents.onmessage = function(e) {
    streamingCurrentTime = e.data;
    timeContainer.innerHTML = streamingCurrentTime;
};

// websockets (WS)
websocket.onopen = function(e) {
    console.log(e);
};

websocket.onerror = function(event) {
    console.log(event);
};

websocket.onclose = function(code, reason) {
    console.log(code, reason);
};

// on refresh close stream connections
window.addEventListener('beforeunload', function() {
    serverSentEvents.close();
    websocket.close();
});