
let deck;

/**
 * Socket to listen playCard which updated updateBoardCard and disables tuen
 */
    module.exports.playCard = function (socket,io) {
        socket.on("playCard", function(src, card, cardCount,callback) {
            deck.addToPile(card);
            io.sockets.emit("updateBoardCard", src, card, cardCount);

            console.log("Crad Count" +cardCount);
            if(cardCount == 1){

                io.sockets.connected[socket.id].emit("sayUNO");
            }

            if(card.color != 'multi' && cardCount != 1){
                deck.resetTurn();
                io.sockets.emit("disableTurn", false);
                let turn = deck.getTurn(card, socket.sessionId);
                deck.players[turn].isTurn = true;
                io.sockets.connected[deck.players[turn].sessionId].emit("enableTurn", true);
                io.sockets.emit("updateTurnToAll", deck.players);
            }
        });


    },

    /**
     *  Socket to listen endTurn
      */
    module.exports.endTurn = function (socket,io) {
        socket.on("endTurn", function(src, card,callback) {
            deck.resetTurn();
            io.sockets.emit("disableTurn", false);
            let turn = deck.getTurn();
            deck.players[turn].isTurn = true;
            io.sockets.connected[deck.players[turn].sessionId].emit("enableTurn", true, card);
            io.sockets.emit("updateTurnToAll", deck.players);
        });
    },

    /**
     * Socket to start Game
      */
    module.exports.startGame = function (socket,io, cardDeck) {
        socket.on('startGame', function(playersList, callback) {
           // deck = new cardDeck();

            var clientIds = [];
            this.players = [];
            for(let i in deck.joinedPlayers){
                clientIds.push(deck.joinedPlayers[i].id);
                let isTurn = false;
                if(i == 0){
                    isTurn = true;
                }


                deck.addPlayers({sessionId: deck.joinedPlayers[i].id, index: i, playerName: deck.joinedPlayers[i].name, isTurn : isTurn});
            }
         /*   Object.keys( io.sockets.connected).forEach(function(key, index) {
                clientIds.push(key);
                var isTurn = false;
                if(index == 0){
                    isTurn = true;
                }
                deck.addPlayers({sessionId: key, index: index, playerName: playersName[index], isTurn : isTurn});
            })*/;

            console.log("JOINED PLAYERRS" ,deck.joinedPlayers);
            console.log("UNO PLAYERRS" ,deck.players);

            var decks = deck.initializeDeck();
            var shuffledDeck = decks[0];
            var distributedDeck = deck.dealDeck(shuffledDeck);

            var cardsMap = {};
            var cardsArray = distributedDeck[0];
            for(i in cardsArray){
                cardsMap[clientIds[i]] = cardsArray[i];
            }



            io.sockets.emit("distributeCards", cardsMap,decks[1] );
            io.sockets.connected[clientIds[0]].emit("enableTurn", true);
            io.sockets.emit("updateTurnToAll", deck.players);

        });

    },

    /**
     * Socket to draw card
     */
    module.exports.drawCard = function (socket,io) {
        socket.on("drawCard", function(count) {
            console.log(count);
            var poppedCards = [];
            for(var i = 0; i < count ; i++){
                 var card = deck.shuffledDeck.pop()
                poppedCards.push(card);
            }
            io.sockets.connected[socket.id].emit("cardDrawn", poppedCards, count);
        });
    },

    /**
     * Socket to raise UNO alert
      */
    module.exports.unoAlert = function (socket,io) {
        socket.on("unoAlert", function() {
            io.sockets.emit("unoAlertRaised", "Tejal");
        });


    },

    /**
     * Socket to change color
      */
    module.exports.colorChange = function (socket,io) {
        socket.on("colorChange", function(color) {
            deck.setWildCardColor(color);
            io.sockets.emit("colorChangedAlert", color);
        });
    },

    /**
     *  Socket to change if card is playable or not
      */
    module.exports.isCardPlayable = function (socket,io) {
        socket.on("isCardPlayable", function(card, element) {
            let status = deck.canPlayCard(card);
            io.sockets.connected[socket.id].emit("isCardPlayableStatus", status, card, element);
        });


        module.exports.endGame = function (socket,io) {
            socket.on("endGame", function() {
                let winner = null;
               for(let i in deck.players){
                  if(deck.players[i].sessionId == socket.id){
                      winner = deck.players[i].playerName;
                      break;
                  }
               }
                io.sockets.emit("endGameAlert", winner);
            });


        }


        /**
         * Socket to end draw
         * @param socket
         * @param io
         */
        module.exports.endDraw = function (socket,io) {
            socket.on("endDraw", function() {
                io.sockets.emit("endDrawUpdate");
            });
        }

        /**
         * This method stores the session id on player join
         * @param socket
         * @param io
         * @param cardDeck
         */
        module.exports.playerJoined = function (socket,io, cardDeck) {
            socket.on("playerJoined", function(player) {
                if(!deck){
                    deck = new cardDeck();
                }

                for(let i in  deck.joinedPlayers){
                    if(deck.joinedPlayers[i].name == player){
                       delete  deck.joinedPlayers[i];
                    }
                }
                deck.joinedPlayers.push({id: socket.id, name: player});
            });
        }


    }