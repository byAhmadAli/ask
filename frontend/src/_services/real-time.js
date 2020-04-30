const io = require('socket.io-client');


class RealTime{
    constructor(){
        this.socket = io.connect("http://fadfed.me/notification", {
            reconnection: true,
            path: '/notification'
        });
    }
}
export default new RealTime();