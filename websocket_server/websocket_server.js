const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { WebSocketServer } = require('ws');
const WebSocket = require('ws');
const goggle_pb = require('google-protobuf');
const fs = require("fs")
const Schema = require('./alarm_area_pb_server');
const Pbf = require('pbf');

var message = "message";

var buf = new Uint8Array(message.data).buffer;
var pbf = new Pbf(buf);

var obj = Schema.alarm_area.read(pbf);
console.log(obj);

//const __dirname = './';
//app.set('view engine', 'ejs'); // 렌더링 엔진 모드를 ejs로 설정
//app.set('views',  __dirname + '/views');    // ejs이 있는 폴더를 지정

const wss = new WebSocket.Server({ port: 3020 })

// wss.on('connection', ws => {
//     ws.on('message', message => {
//         CLIENTS.push(ws);
//         console.log('received: %s', message);
//         ws.id = message;
//     })
//     ws.send('something')
//     //ws.id = wss.getUniqueID();
    
// })

wss.on('connection', function(ws, request){

    ws.onmessage = function(e){
        //console.log(e.data);
        let clientName = e.data;

        console.log(clientName);

        //연결한 client name 부여
        ws.name = clientName; 
    }
    
})

wss.clients.forEach((clinet) => {
    console.log(client.name);
});

app.get('/', (req, res) => {
    res.render('index');    // index.ejs을 사용자에게 전달
})

io.on('connection', (socket) => {   //연결이 들어오면 실행되는 이벤트
    // socket 변수에는 실행 시점에 연결한 상대와 연결된 소켓의 객체가 들어있다.
    
    //socket.emit으로 현재 연결한 상대에게 신호를 보낼 수 있다.
    socket.emit('usercount', io.engine.clientsCount);

    // on 함수로 이벤트를 정의해 신호를 수신할 수 있다.
    socket.on('message', (msg) => {
        //msg에는 클라이언트에서 전송한 매개변수가 들어온다. 이러한 매개변수의 수에는 제한이 없다.
        console.log('Message received: ' + msg);

        // io.emit으로 연결된 모든 소켓들에 신호를 보낼 수 있다.
        io.emit('message', msg);
    });
});

server.listen(3040, function() {
  console.log('Listening on http://localhost:3040/');
});

function client_send(){
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN && client.name == '1111') {
          //client.send('asdasd', { binary: true });
          client.send("test");
        }
        
    });
  
}

const test = setInterval(client_send, 3000);
