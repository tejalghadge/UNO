import { readlinkSync } from "fs";

class cardDeck{
    constructor(){
        //data members
        this.suits = ['red', 'blue', 'green', 'yellow'];
        this.rank = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '2+', 'skip', 'reverse'];
        this.wildTypes = ['wild', '4+'];
        this.plusCards = ['2+', '4+'];
        this.skipCards = ['skip', ...this.plusCards];
        this.deck = [];
        this.discardDeck = [];
        //function members
        this.initializeDeck();
        this.shuffle();
    }
    // This method will initialize 108 cards for play
    initializeDeck() {
        let newDeck = [];
        let shuffledDeck = [];
        newDeck = makeDeck(this.suits, this.rank, this.wildTypes);
        shuffledDeck = shuffleDeck(newDeck); 
    }

    makeDeck(suits, rank, wildTypes){
        let formation = [];
        // If suits is not null or invalid, then make permutations of suits and ranks for example "Red 0"
        if(suits != null && suits != undefined && suits.length != 0){
            // Interate over each element in ranks and suits.
            suits.map((eachsuit, suitIndex) => {
                rank.map((eachrank, rankIndex) => {
                    // First time we will include the zero rank, then we would not
                    formation.push(this.createCard(suits,rank));
                    if(rank !== '0'){
                        formation.push(this.createCard(suits,rank));
                    }
                });
            });
            wildTypes.map((eachwild,wildIndex) => {
                for(let i of Array[4]){
                    formation.push(this.createCard('any', type));
                }
            });
        }
        return formation;
    }

    // To create a card for every instance of map function per suit per rank per wild
    createCard(color, symbol){
        return {color, symbol};
    }

    //  For distributing 7 cards per player
    distributePerPlayer(){
        let playerCards = [...this.deck.splice()];

        return playerCards;
    }

    // checking card eligibility
    canPlay(card) {
        const deskCard = this.discardDeck[ this.discardDeck.length - 1 ];
        // what if desk has any wild cards
        return (card.color === deskCard.color || card.symbol === deskCard.symbol || this.wildTypes.includes(card.symbol));
    }
    
    // Initializing and maintianing discard deck
    addToDiscardDeck(card){
        this.discardDeck.push(card);
    }

}

module.exports = cardDeck;