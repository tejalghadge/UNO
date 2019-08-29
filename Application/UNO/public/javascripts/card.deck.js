
const shuffle = require('shuffle-array');

/**
 * UNO card dec
 */
class CardDeck {
constructor (){
    this.suits = [
        "red",
        "blue",
        "green",
        "yellow",
    ];
    this.rank = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8', 
        '9', 
        '2+',
        'skip',
        'reverse',
    ];
    this.wildTypes = [
        'wild',
        '4+',
    ];
    this.penaltyCards = [
        '2+',
      '4+',
    ];
    this.skipCards = ['skip'];
    this.shuffleDeck = [];
    this.discardDeck = [];

    this.wildCardColor;
    this.players = [];
    this.count = 0;
    this.joinedPlayers = [];
}

    /**
     * This function initialize UNO deck
     * @returns {Array[]}
     */
    initializeDeck() {
        this.discardDeck = [];
        this.joinedPlayers = [];
        var newDeck = [];
        newDeck = this.makeDeck();
        this.shuffledDeck = shuffle(newDeck);
        var discardedCard = this.shuffledDeck.pop();
        console.log(discardedCard);
        while(this.isSpecialCard(discardedCard) == true){
            discardedCard = this.shuffledDeck.pop();
        }
        console.log("DISCARDEDDD"+discardedCard.name);
        this.discardDeck.push(discardedCard);
        return [this.shuffledDeck, this.discardDeck];
    }

    /**
     * check for wild card
     * @param card
     * @returns {boolean}
     */
    isSpecialCard(card) {
        return (card.name == 'skip' || card.name == 'reverse' || card.name == 'wild' || card.name == '2+' || card.name == '4+')
    }

    /**
     * Deal deck
     * @param deck
     * @returns {*[]}
     */
    dealDeck(deck) {
        var name = [];
        var numberOfPlayers = 4;
        for (let i = 0; i < numberOfPlayers; i++) {
            name[i] = deck.splice(0, 7);
        }
        return [name,deck];
    }

    /**
     * Make deck
     * @returns {Array}
     */
    makeDeck() {
    let formation = [];
        // If suits is not null or invalid, then make permutations of suits and ranks for example "Red 0"
            // Iterate over each element in ranks and suits.
            this.suits.map((eachSuit, suitIndex) => {
                this.rank.map((eachRank, rankIndex) => {
                // var pushString = `${eachRank} ${eachSuit}`;
                 var cardObj = {
                   name: `${eachRank}`,
                   color: `${eachSuit}`
                    };
        
                      formation.push(cardObj);
                      if(cardObj.name !== '0')formation.push(cardObj);
                    });
        
                });
                this.wildTypes.map((eachwild,wildIndex) => {
                    const temp = {
                        name: `${eachwild}`,
                        color: 'multi'};
                    formation.push(temp, temp, temp, temp);
            });
        return formation;
    }

    /**
     * Check if the passed card is playable or not
     * @param card
     * @returns {boolean}
     */
    canPlayCard(card) {

        const discardCard = this.discardDeck[this.discardDeck.length - 1];
        var isCardPlayable = false
        if((card.color === discardCard.color  || card.name == discardCard.name || card.color === 'multi' || this.wildCardColor)){
            if( this.wildCardColor){
                if(card.color == this.wildCardColor){
                    this.wildCardColor = null;
                    isCardPlayable = true;
                    console.log("CardPlayable1");
                }else if(card.color == discardCard.color && card.color =="multi") {
                    isCardPlayable = true;
                }else{
                    isCardPlayable = false;
                    console.log("CardPlayable2");
                }
            }
            else{
                console.log("CardPlayable3");
                isCardPlayable = true;
            }


        }

        return isCardPlayable;
    }

    /**
     * Add card to pile
     * @param card
     */
    addToPile(card) {
        this.discardDeck.push(card);
    }


    /**
     * set wild card to check is playable
     * @param color
     */
    setWildCardColor(color){
        this.wildCardColor = color;
    }

    /**
     * Add players to players obj
     * @param player
     */
    addPlayers(player){
        this.players.push(player);
    }

    /**
     * Next player is player at index turn
     * @param card
     * @returns {number} index of array i.e. turn
     */
    getTurn(card){

        if(this.count == this.players.length - 1){
            if(card && card.name == "reverse"){
                this.reverseCards();
            }else if(card && card.name == "skip"){
                this.count = 1;
            }else{
                this.count = 0;
            }
            return  this.count;
        }

        while(this.count < this.players.length -1){
            if(card && card.name == "skip"){
                this.count = (this.count + 2 >= this.players.length) ? 0 : this.count + 2;
            }else if(card && card.name == "reverse"){
                this.reverseCards();
            }
            else{
                this.count = this.count + 1;
            }
            return this.count;
        }
    }

    /**
     * Cards rearranged on reverse
     */
    reverseCards(){
        let playerTemp = [];
        for(let i= this.count - 1; i >= 0; i--){
            playerTemp.push(this.players[i]);
        }

        for(let i = this.players.length-1; i >= this.count; i--){
            playerTemp.push(this.players[i]);
        }
        this.players = playerTemp;
        this.count = 0;
    }

    /**
     * Resets turn of all players
     */
    resetTurn(){
        for(let i in this.players){
            this.players[i].isTurn = false;
        }
    }


} 

module.exports = CardDeck;
