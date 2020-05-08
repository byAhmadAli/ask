const io = require('socket.io-client');


class RealTime{
    constructor(){
        this.socket = io.connect("https://fadfed.me/socket.io", {
            reconnection: true
        });
    }
}
export default new RealTime();