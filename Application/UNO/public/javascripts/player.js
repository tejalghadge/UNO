const randomStringGenerator = require('randomstring');
const cardDeck = require('./card.deck');

class player {
    constructor(name, cards){
        this.id = randomStringGenerator.generate({length: 10, capitalization: 'lowercase' });
        this.cards = cards;
        this.name = name;
        this.status = 'waiting';
        //this.cardTaken = null;
        this.UNO = false;
        //this.visiting = null;
    }
    
}