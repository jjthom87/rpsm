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

	var pOneWins, pOneLosses, pTwoWins, pTwoLosses, ties;

	firebaseRef.set({ appName: 'RPS' });
	settings.set({ gameOn: false });
	players.set({ playerOne: false, playerTwo: false});

	$('#submitName').on('click', function(e){
		e.preventDefault();
		var name = $('#name').val().trim();
		if (playerOne == null){
			firstPlayer.child("info").set({ name: name, wins: 0, losses: 0, ties: 0, num: 1 });
			players.set({ playerOne: true, playerTwo: false});
			appendGameButtons("One", playerOne);
			appendStats("One", pOneWins, pOneLosses, ties);
			$('.picksOne').prop("disabled", true);
			$('#name').val('');
		} else if (playerOne == 5){
			secondPlayer.child("info").set({ name: name, wins: 0, losses: 0, ties: 0, num: 2 });
			$('#name').val('');
			players.set({ playerOne: true, playerTwo: true});
			appendGameButtons("Two", playerTwo);
			appendStats("Two", pTwoWins, pTwoLosses, ties);
			settings.set({ gameOn: true });
		}
	});

	var appendGameButtons = (num, player) => {
		if(player == 5){
			picks.forEach(function(pick){
				var div = $('<div class="wordsDiv'+num+'" data-picked='+pick+'>');
				div.append('<button class="picks'+num+'" id="'+pick+num+'P" data-pick='+pick+'>'+pick+'</button><br>');
				$('.rpsWords'+num+'').append(div);
			});
		}
	}

	var game = () => {
		$(document).on('click', '.picksOne', function(){
			playerPicks.child("firstPlayer").set({ pick: $(this).data("pick")});
		});

		$(document).on('click', '.picksTwo', function(){
			playerPicks.child("secondPlayer").set({ pick: $(this).data("pick")});
		});
	}

	var appendStats = (num, wins, losses, tie) => {
		var div = $('<div id='+num+'Stats>');
		var winP = $('<p id='+num+'Wins>');
		var lossP = $('<p id='+num+'Losses>');
		var tieP = $('<p id='+num+'Ties>');
		winP.text("Wins: " + wins);
		lossP.text("Losses: " + losses);
		tieP.text("Ties: " + tie);
		div.append(winP).append(lossP).append(tieP);
		$('#p'+num+'Stats').append(div);
	}

	firstPlayer.on("child_added", function(snapshot){
		playerOne = snapshot.numChildren();
		pOneWins = snapshot.val().wins;
		pOneLosses = snapshot.val().losses;
		ties = snapshot.val().ties;
		if(playerOne == 5){
			var playerOneDiv = $('<div id="plOne" data-one='+snapshot.val().name+'>')
			var playerOneP = $('<p id="plOneText">');
			playerOneP.text(snapshot.val().name);
			playerOneDiv.append(playerOneP).css('font-size', '24px');
			$('#playerOneName').data(snapshot.val().name)
			$('#playerOneName').append(playerOneDiv);
			$('#gameStatus').text("Waiting on Player Two");
		}
	});

	secondPlayer.on("child_added", function(snapshot){
		playerTwo = snapshot.numChildren();
		pTwoWins = snapshot.val().wins;
		pTwoLosses = snapshot.val().losses;
		if(playerTwo == 5){
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
		if(currentPicks == 2){
			var onePick = snapshot.val().firstPlayer.pick;
			var twoPick = snapshot.val().secondPlayer.pick;
			if(onePick === 'Rocks' && twoPick === 'Scissors'){
				pOneWins++;
				pTwoLosses++;
				secondPlayer.child("info").child("losses").set(pTwoLosses);
				firstPlayer.child("info").child("wins").set(pOneWins);
				$('#OneWins').text("Wins: " + pOneWins);
				$('#TwoLosses').text("Losses: " + pTwoLosses);
				playerPicks.child("firstPlayer").set({});
				playerPicks.child("secondPlayer").set({});
			} else if (onePick === 'Rocks' && twoPick === 'Paper'){
				pTwoWins++;
				pOneLosses++;
				secondPlayer.child("info").child("wins").set(pTwoWins);
				firstPlayer.child("info").child("losses").set(pOneLosses);
				$('#TwoWins').text("Wins: " + pTwoWins);
				$('#OneLosses').text("Losses: " + pOneLosses);
				playerPicks.child("firstPlayer").set({});
				playerPicks.child("secondPlayer").set({});
			} else if (onePick === 'Rocks' && twoPick === 'Rocks'){
				ties++;
				firstPlayer.child("info").child("ties").set(ties);
				secondPlayer.child("info").child("ties").set(ties);
				$('#OneTies').text("Ties: " + ties);
				$('#TwoTies').text("Ties: " + ties);
				playerPicks.child("firstPlayer").set({});
				playerPicks.child("secondPlayer").set({});
			} else if (onePick === 'Paper' && twoPick === 'Paper'){
				ties++;
				firstPlayer.child("info").child("ties").set(ties);
				secondPlayer.child("info").child("ties").set(ties);
				$('#OneTies').text("Ties: " + ties);
				$('#TwoTies').text("Ties: " + ties);
				playerPicks.child("firstPlayer").set({});
				playerPicks.child("secondPlayer").set({});
			} else if (onePick === 'Paper' && twoPick === 'Scissors'){
				pTwoWins++;
				pOneLosses++;
				secondPlayer.child("info").child("wins").set(pTwoWins);
				firstPlayer.child("info").child("losses").set(pOneLosses);
				$('#TwoWins').text("Wins: " + pTwoWins);
				$('#OneLosses').text("Losses: " + pOneLosses);
				playerPicks.child("firstPlayer").set({});
				playerPicks.child("secondPlayer").set({});
			} else if (onePick === 'Paper' && twoPick === 'Rocks'){
				pOneWins++;
				pTwoLosses++;
				firstPlayer.child("info").child("wins").set(pOneWins);
				secondPlayer.child("info").child("losses").set(pTwoLosses);
				$('#OneWins').text("Wins: " + pOneWins);
				$('#TwoLosses').text("Losses: " + pTwoLosses);
				playerPicks.child("firstPlayer").set({});
				playerPicks.child("secondPlayer").set({});
			} else if (onePick === 'Scissors' && twoPick === 'Paper'){
				pOneWins++;
				pTwoLosses++;
				firstPlayer.child("info").child("wins").set(pOneWins);
				secondPlayer.child("info").child("losses").set(pTwoLosses);
				$('#OneWins').text("Wins: " + pOneWins);
				$('#TwoLosses').text("Losses: " + pTwoLosses);
				playerPicks.child("firstPlayer").set({});
				playerPicks.child("secondPlayer").set({});
			} else if (onePick === 'Scissors' && twoPick === 'Rocks'){
				pTwoWins++;
				pOneLosses++;
				secondPlayer.child("info").child("wins").set(pTwoWins);
				firstPlayer.child("info").child("losses").set(pOneLosses);
				$('#TwoWins').text("Wins: " + pTwoWins);
				$('#OneLosses').text("Losses: " + pOneLosses);
				playerPicks.child("firstPlayer").set({});
				playerPicks.child("secondPlayer").set({});
			} else if (onePick === 'Scissors' && twoPick === 'Scissors'){
				ties++;
				firstPlayer.child("info").child("ties").set(ties);
				secondPlayer.child("info").child("ties").set(ties);
				$('#OneTies').text("Ties: " + ties);
				$('#TwoTies').text("Ties: " + ties);
				playerPicks.child("firstPlayer").set({});
				playerPicks.child("secondPlayer").set({});
			}
		}
	});

});