const express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// TODO: This should probably be stored somewhere durable.
var POLLS = {

}

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/html/index.html')
});


app.get('/:pollId', function(req, res) {
    // Sockets require a "/" before the namespace.
    var pollId = "/" + req.params.pollId;

    // pollOptions is a map of the poll option to the number of votes.
    var pollOptions = {};
    if (pollId in POLLS) {
        pollOptions = POLLS[pollId];
    } else {
        POLLS[pollId] = pollOptions;
    }

    var nsp = io.of(roomId);
    nsp.on('connection', poll_connection_handler);

    res.sendFile(__dirname + '/html/poll.html');
})

// Socket connection handlers.
function poll_connection_handler(socket) {
    console.log('user connected');

    var pollId = socket.nsp.name;
    
    socket.on('new_poll_option', function(newPollOptions) {
        POLLS[pollId].push(newPollOption)
        // Just gonna have one function that updates everything.
        socket.broadcast.emit('polls_update', POLLS[pollId]);
    })

    socket.on('vote', function(pollOption) {
        POLLS[pollId][pollOption] += 1;
        socket.broadcast.emit('polls_update', POLLS[pollId]);
    })

    socket.on('disconnect', function() {
        console.log('user disconnected');
    })
}

http.listen(3000, function() {
    console.log('listening on :3000')
});
