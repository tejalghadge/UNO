const CardDeck = require('./card.deck');
const Player = require('./player');
const socketService = require('./../socket.service');
const randomStringGenerator = require('randomstring');
const shuffle = require('shuffle-array');

class Uno {
  constructor(gameId, randomizePlayers = false) {
    this.id = gameId || randomStringGenerator.generate({length: 10, capitalization: 'lowercase'});
    this.currentPlayerId = 0;
    this.deck = new CardDeck();
    this.direction = 1;
    this.players = [];
    this.randomizePlayers = randomizePlayers;
    this.status = 'waiting';

    socketService.manageGame(this);
    }

    broadcastGameState() {
        const cardsState = {
            deckState: this.deck.state
        };
        const currentPlayer = this.status === 'complete' || this.status === 'waiting' ? {} : this.getCurrentPlayer();

        const direction = this.direction;
        const status = this.status;

        // for array of players
        for(let player of [...this.players]){
            let turn = currentPlayer.id === player.id;
            let state = {
                player: {player.json(), turn},
                room: {...cardsState, direction, status}
            };
            console.log('broadcast', player.id, JSON.stringify(state));

            socketService.broadcast(this.id, player.id, state);
        }
    }

    broadcastParticipants() {
        for(let player of [...this.players]) {
    
          socketService.broadcast(this.id, player.id);
        }
    }

    callUno(playerId) {
        const player = this.getPlayer(playerId);
        player.callUno(this.canPlay(playerId));
    
        if(player.isUno()) {
          this.broadcastParticipants();
        }
    }

}

module.exports = Uno;