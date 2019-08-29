const socket = io();

/**
 * Emits sendMessage event when during chat
 */
$("#send").click(function () {
    socket.emit('sendMessage',$("#message").val());
    $("#message").val("");
});

/**
 * Handled enter event for send message
 */
$('#message').on('keydown', function(e) {
    if (e.which == 13) {
        e.preventDefault();
        socket.emit('sendMessage',$("#message").val());
        $("#message").val("");
    }
});

/**
 * Update message on chat box
 */
socket.on("updateMessages", function(msg){
    var final_message = $("<p  style='color: white'/>").text(msg);
    $("#chatBox").append(final_message);
});


/**
 * Updates board card i.e. card played
 */
socket.on("updateBoardCard", function(src, card){
    $('#boardCard').attr('src', src);
    $('#boardCard').attr('cardcolor', card.color);
    $('#boardCard').attr('cardname', card.name);

    if(card.color == 'multi' || card.name == '2+'){
        $("#boardCard").attr('status', 'true');
    }

    if(isCardLeft() == false){
        socket.emit("endGame");
    }

});


/**
 * sayUNO listener when one card is remaining
 */
socket.on("sayUNO", function () {
    $("#uno").addClass("blinking");
    $("#cardHolderDiv").css('pointer-events', 'none');
});


/**
 * Listener for unoAlertRaised
 */
socket.on("unoAlertRaised", function(){

   $('#success-alert').css('background-color', '#cbf7cz');
    notify('UNO');
});

/**
 * Listener for color change
 */
socket.on("colorChangedAlert", function(color){
    let backgroundColor ;
    switch (color) {
        case 'red': backgroundColor = 'lightcoral'
                break;
        case 'green': backgroundColor = 'lightgreen'
                break;
        case 'yellow': backgroundColor = '#FFFF99'
            break;
        case 'blue': backgroundColor = 'cornflowerblue'
            break;

    }
    $('#success-alert').css('background-color', backgroundColor);
    notify('Color changed to '+color);
});


/**
 * not allow player to draw card again once drawn
 */
socket.on("endDrawUpdate", function () {
    $("#boardCard").attr('status', 'false');
});

/**
 * cardDrawn Listener
 */
socket.on("cardDrawn", function(cards, count){

    socket.emit('endDraw');
    for (var i in cards){
        var imgPath = "/images/large/" + cards[i].color + "_" + cards[i].name + "_large.png";
        $("#cardHolderDiv").append('<div class="rectangle pull-left"><img src= ' + imgPath + ' height="100%" cardname='+cards[i].name+' cardcolor=' +cards[i].color+'  width="100%" onclick="userCardClicked(event)"> + </div>');

    }

    if(count == 1 ){
        let boardCard = $("#boardCard")
        if(cards[0].color == 'multi' || cards[0].color == $(boardCard).attr('cardcolor') || cards[0].name == $(boardCard).attr('cardname')){

        }else{
            socket.emit('endTurn');
        }

    }else{
        socket.emit('endTurn');
    }
    $("#drawCard").removeClass("blinking");

});

/**
 * Checks the card is wild card or not
 * @param src
 * @returns {boolean}
 */
function  checkForSpecialCard(src){

    return (src.indexOf('multi') != -1 || src.indexOf('+2') != -1 || src.indexOf('+4') != -1);
}


/**
 * Distributes card on start
 */
socket.on("distributeCards", function(playercards, discardedCard, isTurn){
    $("#startGame").removeClass("blinking");

    var imgPath = "/images/large/" + discardedCard[0].color + "_" + discardedCard[0].name + "_large.png";
    $('#boardCard').attr('src', imgPath);
    $('#boardCard').attr('cardcolor', discardedCard[0].color);
    $('#boardCard').attr('cardname', discardedCard[0].name );

    $("#cardHolderDiv").empty();
    let cards = playercards[socket.id];
    for (var i in cards){
        var imagPath = "/images/large/" + cards[i].color+ "_" + cards[i].name +"_large.png";
        $("#cardHolderDiv").append('<div class="rectangle pull-left"><img src= '+ imagPath+' height="100%" width="100%"  cardName='+cards[i].name+' cardColor=' +cards[i].color+' onclick="userCardClicked(event)"> + </div>')
    }

    disableTurn();

});


/**
 * Checks card playable status and then play card
 */
socket.on("isCardPlayableStatus", function(status, card){
    let element = $(".isCardPlayable")[0];
    $(element).removeClass('isCardPlayable');
    if(status == true) {
        $(element.parentElement).remove();
        let src = '/images/large/' + card.color + '_' + card.name + '_large.png';
        if (src === '/images/large/multi_4+_large.png' || src === '/images/large/multi_wild_large.png') {
            notify('Choose Color.');
        }

        socket.emit('playCard', src, card, cardCount());
    }

});


/**
 * Listener for enables turn
 */
socket.on("enableTurn", function(isTurn, card){
    if(isTurn == true)
        enableTurn(card);
});

/**
 * Listener for disable turn
 */
socket.on("disableTurn", function(isTurn){
    if(isTurn == false)
        disableTurn();
});

/**
 * Listener for end game alert
 */
socket.on("endGameAlert", function (winner) {
    notify("Game Over!!!!  Winner is "+winner);
    disableTurn();
});

/**
 * Updates turn to all sessions and highlights the current player
 */
socket.on("updateTurnToAll", function (players) {

    let idCounter = 1;
    let turnCounter = 1;
    for (let i in players) {
        $('#playerTurn' + turnCounter).css('background-color', 'lightblue');
        turnCounter++;
    }

   /* for (let i in players) {
        players[i].playerName =  $("#divPlayer"+i).html();
    }*/

    turnCounter = 1;
    for (let i in players) {
        if (players[i].sessionId != socket.id) {
            $('#player' + idCounter).html(players[i].playerName);
            idCounter++;
            if (players[i].isTurn == true) {
                $('#playerTurn' + turnCounter).css('background-color', 'lightgreen');
                $('#playerTurn' + turnCounter).addClass('playing');
                $('#playerTurn' + turnCounter).addClass('zoomImg');
                turnCounter++;
            } else {

                $('#playerTurn' + turnCounter).removeClass('playing');
                $('#playerTurn' + turnCounter).removeClass('zoomImg');
                turnCounter++;
            }
        }


    }
});



/**
 * Notification message
 * @param msg
 */
function notify(msg) {
    $('#unoAlertMessage').html(msg);
    $("#success-alert").fadeTo(2000, 2000).slideUp(2000, function(){
        $("#success-alert").slideUp(2000);
    });
}
