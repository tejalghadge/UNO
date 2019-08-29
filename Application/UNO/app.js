var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var app = require('express')();
app.use(bodyParser.urlencoded());
app.use(cookieSession({
  name: 'session',
  keys: {name : "No Session Set"}
}))

var routes = require('./route/routes.js')(app);
var http = require('http').Server(app);
const io = require('socket.io')(http);
const chatboxSocket = require('./socket/chatbox');
const playeractionsSocket = require('./socket/playeractions');
var cardDeck = require('./public/javascripts/card.deck.js')


app.set('port', process.env.PORT || 8080);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

http.listen(8080, function(){
  console.log('listening on 8080');
});

/**
 * Register socket listeners on connection open
 */
io.on("connection", function(socket) {
  console.log(socket.id);

  socket.on('create', function(room) {
        socket.join(room);
  });

  chatboxSocket.sendMessage(socket, io);
  playeractionsSocket.startGame(socket, io, cardDeck);
  playeractionsSocket.playCard(socket, io);
  playeractionsSocket.drawCard(socket, io, cardDeck);
  playeractionsSocket.unoAlert(socket, io);
  playeractionsSocket.colorChange(socket, io);
  playeractionsSocket.isCardPlayable(socket, io);
  playeractionsSocket.endTurn(socket,io);
  playeractionsSocket.endGame(socket,io);
  playeractionsSocket.endDraw(socket,io);
  playeractionsSocket.playerJoined(socket, io, cardDeck);

    socket.on('disconnect', () => {
        console.log(`cardDeck ${io.cardDeck}`);
        console.log(`Socket ${socket.id} disconnected.`);

    });

});

/**
 * Get currnt date time
 * @returns {string}
 */
function getCurrentDate() {
    var currentDate = new Date();
    var day = (currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate();
    var month = ((currentDate.getMonth() + 1) < 10 ? '0' : '') + (currentDate.getMonth() + 1);
    var year = currentDate.getFullYear();
    var hour = (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours();
    var minute = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
    var second = (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}