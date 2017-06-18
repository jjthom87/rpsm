$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyD3Vs4_4_Zv59igAXPhqv2EMdFTB9TG0Ak",
    authDomain: "rpsm-a0098.firebaseapp.com",
    databaseURL: "https://rpsm-a0098.firebaseio.com",
    projectId: "rpsm-a0098",
    storageBucket: "rpsm-a0098.appspot.com",
    messagingSenderId: "789669987661"
  };
  firebase.initializeApp(config);

  var firebaseRef = firebase.database().ref();

	var playerOneExists = false;
	var playerTwoExists = false;
	var firstPlayer = firebase.database().ref("First Player");
	var secondPlayer = firebase.database().ref("Second Player");
	var settings =  firebase.database().ref("game").child("settings");
	var players =  firebase.database().ref("users");
	var picks = ['Rocks', 'Paper', 'Scissors'];
	var currentPlayers = null;
	var currentPicks = null;
	var playerPicks = firebase.database().ref("picks");
	var playerOne = null;
	var playerTwo = null;

	firebaseRef.set({ appName: 'RPS' });
	settings.set({ gameOn: false });
	players.set({ playerOne: false, playerTwo: false});

	$('#submitName').on('click', function(e){
		e.preventDefault();
		var name = $('#name').val().trim();
		if (playerOne == null){
			firstPlayer.child("info").set({ name: name });
			players.set({ playerOne: true, playerTwo: false});
			appendGameButtonsOne();
			$('.picksOne').prop("disabled", true);
			$('#name').val('');
		} else if (playerOne == 1){
			secondPlayer.child("info").set({ name: name });
			$('#name').val('');
			players.set({ playerOne: true, playerTwo: true});
			appendGameButtonsTwo();
			settings.set({ gameOn: true });
		}
	});

	function appendGameButtonsOne(){
		if (playerOne == 1){
			picks.forEach(function(pick){
				var divOne = $('<div class="wordsDivOne" data-picked='+pick+'>');
				divOne.append('<button class="picksOne" id='+pick+'OneP" data-pick='+pick+'>'+pick+'</button><br>');
				$('.rpsWordsOne').append(divOne);
			});
		}
	}

	function appendGameButtonsTwo(){
		if (playerTwo == 1){
			picks.forEach(function(pick){
				var divOne = $('<div class="wordsDivTwo" data-picked='+pick+'>');
				divOne.append('<button class="picksTwo" id='+pick+'TwoP" data-pick='+pick+'>'+pick+'</button><br>');
				$('.rpsWordsTwo').append(divOne);
			});
		}
	};

	var game = () => {
		$(document).on('click', '.picksOne', function(){
			playerPicks.child("firstPlayer").set({ pick: $(this).data("pick")})
		})

		$(document).on('click', '.picksTwo', function(){
			playerPicks.child("secondPlayer").set({ pick: $(this).data("pick")})
		})
	}

	players.on("value", function(snapshot){
		// if(playerOne == 1 && playerTwo == null){
		// 	console.log("hello")
		// 	$('.picksOne').prop("disabled", true);
		// }
		// if(playerOne == 1 && playerTwo == 1){
		// 	var one = snapshot.val().playerOne;
		// 	var two = snapshot.val().playerTwo;	






		// }
		// if(one && two){

		// }
		// currentPlayers = snapshot.numChildren();
		// playerOneExists = snapshot.child('firstPlayer').exists();
		// playerTwoExists = snapshot.child('secondPlayer').exists();
		// if(currentPlayers == 1){
		// 	var playerOneDiv = $('<div id="plOne" data-one='+snapshot.val().firstPlayer.name+'>')
		// 	var playerOneP = $('<p id="plOneText">');
		// 	playerOneP.text(snapshot.val().firstPlayer.name);
		// 	playerOneDiv.append(playerOneP).css('font-size', '24px');
		// 	$('#playerOneName').data()
		// 	$('#playerOneName').append(playerOneDiv);
		// }
		// if(currentPlayers == 2){
		// 	var playerTwoDiv = $('<div id="plTwo" data-two='+snapshot.val().secondPlayer.name+'>')
		// 	var playerTwoP = $('<p id="plTwoText">');
		// 	playerTwoP.text(snapshot.val().secondPlayer.name);
		// 	playerTwoDiv.append(playerTwoP).css('font-size', '24px');
		// 	$('#playerTwoName').data(snapshot.val().secondPlayer.name)
		// 	$('#playerTwoName').append(playerTwoDiv);

		// 	appendGameButtons();
		// 	$('#submitName').prop("disabled", true);
		// 	$('#name').prop("disabled", true);
		// }
	});

	firstPlayer.on("child_added", function(snapshot){
		playerOne = snapshot.numChildren();
		if(playerOne == 1){
			var playerOneDiv = $('<div id="plOne" data-one='+snapshot.val().name+'>')
			var playerOneP = $('<p id="plOneText">');
			playerOneP.text(snapshot.val().name);
			playerOneDiv.append(playerOneP).css('font-size', '24px');
			$('#playerOneName').data()
			$('#playerOneName').append(playerOneDiv);
			$('#gameStatus').text("Waiting on Player Two");
		}
	});

	secondPlayer.on("child_added", function(snapshot){
		playerTwo = snapshot.numChildren();
		if(playerTwo == 1){
			var playerTwoDiv = $('<div id="plTwo" data-two='+snapshot.val().name+'>')
			var playerTwoP = $('<p id="plTwoText">');
			playerTwoP.text(snapshot.val().name);
			playerTwoDiv.append(playerTwoP).css('font-size', '24px');
			$('#playerTwoName').data(snapshot.val().name)
			$('#playerTwoName').append(playerTwoDiv);

			$('#gameStatus').empty();
			$('.picksOne').prop("disabled", false);
			$('#submitName').prop("disabled", true);
			$('#name').prop("disabled", true);
		}
	});

	playerPicks.on("value", function(snapshot){
		game();
		currentPicks = snapshot.numChildren();
	})

});