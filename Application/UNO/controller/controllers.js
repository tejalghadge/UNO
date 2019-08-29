var UnoController = {}
var db = require('../model/db.js');

/**
 * Inserts user to database
 * @param request
 * @param response
 */
UnoController.add = function(request, response){

  var stringname = request.body.username + "";
  var stringpw = request.body.password + "";
	var sql = "INSERT INTO USER (USERNAME, PASSWORD) VALUES ('"+ stringname + "','"+ stringpw +"')";
	db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
 	});



	response.redirect("/");
}

/**
 * Performs login by fetching user from database
 * @param request
 * @param response
 */
UnoController.login = function(request,response){

	username = request.body.username;
	password = request.body.password;

	var sql = "select * from USER where USERNAME = '"+ request.body.username + "' AND PASSWORD = '"
	+ request.body.password+"'";


	db.query(sql, function (err, result) {
    if (err) throw err;

    console.log(result);

   	if (result[0]){
      request.sessionCookies.keys.name = request.body.username;
   		response.redirect("/lobby");
   	}
   	else {
   		response.redirect("/");
   	}
	}); 

}

/**
 * This method saves session of player
 * @param request
 * @param response
 */
UnoController.creategame = function(request,response){
	console.log(request.body.lobbyname);

  var room = request.body.lobbyname;
  var sql = "INSERT INTO ROOM (room_name, player_1) VALUES ('" + room + "' , '" + request.sessionCookies.keys.name + "');"

	db.query(sql, function (err, result) {
    if (err) throw err;
	});

    response.redirect('/lobby');
}


/**
 * Populates rooms
 * @param request
 * @param response
 */
UnoController.getRooms = function(request,response){

 	var sql = "select * from ROOM";
 	db.query(sql, function (err, result) {
    if (err) throw err;

    console.log(result);
    response.render('lobby', { x: result });  
	});
}

/**
 * render game while passing the user name as well as the full list of data from the database about the game : names, roomname etc
 * @param room_name
 * @param request
 * @param response
 */
UnoController.renderGame = function(room_name, request, response){

  var sql = "select * from ROOM where room_name = '" + room_name + "'";

  db.query(sql, function (err, result) {
    if (err) throw err;

  console.log(result[0]);
  
  response.render('game', { results: result[0] , username: request.sessionCookies.keys.name});  
  });
}

/**
 * Tries to get the user to join the game that he clicks
 * @param request
 * @param response
 */

UnoController.joinGame = function(request,response){

  let flag = true;

  var sql = "select * from ROOM where room_name = '" + request.body.room_name + "'";
  // console.log(sql);
  var playername = request.sessionCookies.keys.name;

  db.query(sql, function (err, result) {
    if (err) throw err;


    //Checks if user exists first as one fo the 4 players
    if (checkPlayerIsInLobby(result[0], playername)) {


  } else {
    //Player is not on the list so add them into the next available Slot

      if ((result[0].player_1 != null & result[0].player_2 != null) & (result[0].player_3 != null & result[0].player_4 != null)){

          flag = false;
      } else if (result[0].player_1 == null){
        var sql2 = "UPDATE ROOM SET player_1 = '" + request.sessionCookies.keys.name + "' WHERE room_name = '" + request.body.room_name + "'";
        db.query(sql2, function (err, result) {
        if (err) throw err;
        });

      } else if (result[0].player_2 == null){
        var sql3 = "UPDATE ROOM SET player_2 = '" + request.sessionCookies.keys.name + "' WHERE room_name = '" + request.body.room_name + "'";
        db.query(sql3, function (err, result) {
        if (err) throw err;
        });
      } else if (result[0].player_3 == null){
        var sql4 = "UPDATE ROOM SET player_3 = '" + request.sessionCookies.keys.name + "' WHERE room_name = '" + request.body.room_name + "'";
        db.query(sql4, function (err, result) {
        if (err) throw err;
        });
      } else if (result[0].player_4 == null){
        var sql5 = "UPDATE ROOM SET player_4 = '" + request.sessionCookies.keys.name + "' WHERE room_name = '" + request.body.room_name + "'";
        db.query(sql5, function (err, result) {
        if (err) throw err;
        });
      }

  }

      if(flag == true){
          response.redirect('/game/' + request.body.room_name +'?player='+ request.sessionCookies.keys.name);
      }else{
          response.redirect('/lobby');
      }
  });




}


/**
 * Helper Function to check if user is one of the 4 players in the lobby
 * @param Arr
 * @param playername
 * @returns {boolean}
 */
function checkPlayerIsInLobby(Arr, playername){
  if ((Arr.player_1 == playername || Arr.player_2 == playername) || (Arr.player_3 == playername || Arr.player_4 == playername)){
    return true;
  } else {
    return false;
  }

}



module.exports = UnoController;