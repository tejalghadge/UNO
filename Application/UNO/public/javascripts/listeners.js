/**
 * Hides notification alert
 */
$(document).ready (function(){
    $("#success-alert").hide();
});

/**
 * Check for back card
 * @returns {number}
 */
function isBackCard() {
    var imgs = $($("#cardHolderDiv img"));
    for(i =0; i < imgs.length ;i ++){
       if($(imgs[i]).attr('src').indexOf('back') != -1){
           $(imgs[i].parentElement).css('display', 'none');
           return i;
       }
    }
    return -1;
}

/**
 * returns card count of card holder
 * @returns {jQuery}
 */
function cardCount() {
    return $($("#cardHolderDiv img")).length;
}

/**
 * Checks if card are present in card holder or not
 * @returns {boolean}
 */
function isCardLeft() {
    let flag = false;
    var imgs = $($("#cardHolderDiv img"));
    for(i =0; i < imgs.length ;i ++){
        if($($("#cardHolderDiv img")[i]).attr('src').indexOf('back') == -1){
            flag = true;
            break;
        }
    }
    return flag;
}

/**
 * listener for card click
 * @param event
 */
function userCardClicked(event) {

    let cardObj = {
        name:  $(event.target).attr('cardName'),
        color:  $(event.target).attr('cardColor')
    }

    if(cardObj.name === 'alt')
        return;

    $(event.target).addClass('isCardPlayable');
    socket.emit('isCardPlayable', cardObj, event.target) ;
}

/**
 * Save state
 * @param event
 */
function saveState(event) {
    console.log('the event is successful');
}

/**
 * Start game button listener
 */
$("#startGame").click(function () {

    let players = [];
    for(let i = 0; i < 4 ; i++){
        if($("#divPlayer"+i).html() != ""){
            if($("#divSession"+i).html() != "")
                  players.push({name : $("#divPlayer"+i).html(), id : ($("#divSession"+i).html())});
        }
    }
    socket.emit('startGame', players);
    
});

/**
 * draw card button listener
 */
$("#drawCard").click(function () {
   // alert("drawCard");
    var count = 1;
   var src =   $("#boardCard").attr('src');
   if(src) {
        if(src.indexOf('2+') != -1 && $("#boardCard").attr("status") == "true"){
            count = 2;
        }else if(src.indexOf('4+') != -1 && $("#boardCard").attr("status") == "true"){
            count = 4;
        }else{
            count = 1;
        }
    }
    socket.emit('drawCard',count);
});

/**
 * End turn button click event listener
 */
$("#endTurn").click(function () {
    socket.emit('endTurn');
});


/**
 * UNO button click eventlistener
 */
$("#uno").click(function () {

    $("#uno").removeClass("blinking");
    socket.emit('unoAlert');
    socket.emit('endTurn');
});

/**
 * Red color click event listener
 */
$("#red").click(function () {
    socket.emit('colorChange', 'red');
    socket.emit('endTurn');
});

/**
 *  Green color click event listener
 */
$("#green").click(function () {
    socket.emit('colorChange', 'green');
    socket.emit('endTurn');
});

/**
 *  Blue color click event listener
 */
$("#blue").click(function () {
    socket.emit('colorChange', 'blue');
    socket.emit('endTurn');
});

$("#yellow").click(function () {
    socket.emit('colorChange', 'yellow');
    socket.emit('endTurn');
});

$("#joined").click(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const player = urlParams.get('player');
    socket.emit('playerJoined', player);
});

/**
 * CSS handling to disable turn
 */
function disableTurn() {
    $("#turn").css('background-color', 'lightcoral');
    $("#cardHolderDiv").css('pointer-events', 'none');
    $("#unoActions").css('pointer-events', 'none');
    $("#turn").removeClass("blinking");


}

/**
 * CSS handling for enable turn
 * @param card
 */
function enableTurn(card) {
    $("#cardHolderDiv").css('pointer-events', 'auto');
    $("#unoActions").css('pointer-events', 'auto');
    $("#turn").addClass("blinking");
    $("#turn").css('background-color', 'lightgreen')
    $("#turn").removeClass("lightred");
    $("#drawCard").removeClass("blinking");


  if( $("#boardCard").attr('status') ==  'true'){
      if($("#boardCard").attr('src').indexOf('2+') != -1 && card != 'cardDrawn'){
          $("#cardHolderDiv").css('pointer-events', 'none');
          $("#drawCard").addClass("blinking");
      }

      if($("#boardCard").attr('src').indexOf('4+') != -1 && card != 'cardDrawn'){
          $("#cardHolderDiv").css('pointer-events', 'none');
          $("#drawCard").addClass("blinking");

      }
  }

}
