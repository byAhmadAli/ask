const io = require('socket.io-client');


class RealTime{
    constructor(){
        this.socket = io.connect("http://localhost:5002", {
            reconnection: true,
            path: '/notification'
        });
    }
}
export default new RealTime();