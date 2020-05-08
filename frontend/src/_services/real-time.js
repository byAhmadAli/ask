const io = require('socket.io-client');


class RealTime{
    constructor(){
        this.socket = io.connect("https://fadfed.me", {
            reconnection: true,
            path: '/socket.io'
        });
    }
}
export default new RealTime();