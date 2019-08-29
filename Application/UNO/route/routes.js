var controller = require('../controller/controllers.js');

module.exports = function(app){

	/**
	 * Route for index
	 */
	app.get('/', function(req, res, next) {
  		res.render('index', { title: 'UNO' , action: 'Login'});
	});

	/**
	 * Route for login
	 */
	app.post('/login', function(request, response){
		controller.login(request, response);
	})

	//Handles Registration
	app.get('/register', function(req, res, next) {
  		res.render('register', { title: 'UNO' , action: 'Register'});
	});
	app.post('/add', function(request, response){
		controller.add(request, response);
	})

	/**
	 * Route for lobby
	 */
	app.get('/lobby', function(req, res, next) {

		controller.getRooms(req, res);
  		// res.render('lobby', { title: 'UNO' , action: 'Logged In', action2: 'Make room'});
	});

	/**
	 * Route for create game
	 */
	app.post('/creategame', function(request, response){
		controller.creategame(request, response);
	})

	/**
	 * Route for roomname
	 */
	app.get('/game/:room_name', function(request, response){

		var room_name = request.params.room_name;
	
		controller.renderGame(room_name, request, response);

	});

	/**
	 * Added listeners
	 */
	app.get('/listeners', function(req, res, next) {
  		res.render(__dirname+ "/listeners.js")
	});

	app.get('/start', function(req, res, next) {
		res.send("Started");
	});

	/**
	 * Route for join game
	 */
	app.post('/joingame', function(request,response){
	controller.joinGame(request,response);
	});
}

