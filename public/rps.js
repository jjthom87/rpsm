$(document).ready(function(){

var Game = function(){
	this.name = false;
	this.pick = '';
}

var playerOne = new Game();
var playerTwo = new Game();
var picks = ['Rocks', 'Paper', 'Scissors'];

	$('#submitName').on('click', function(e){
		e.preventDefault();
		var name = $('#name').val().trim();

		if(!playerOne.name && !playerTwo.name){
			var playerOneDiv = $('<div id="plOne" data-oneName='+name+'>')
			var playerOneP = $('<p id="plOneText">');
			playerOneP.text(name);
			playerOneDiv.append(playerOneP).css('font-size', '24px');
			$('#playerOneName').append(playerOneDiv);
			playerOne.name = true;
			$('#name').val('');
		} else if (playerOne.name && !playerTwo.name){
			var playerTwoDiv = $('<div id="plTwo">')
			var playerTwoP = $('<p id="plTwoText">');
			playerTwoP.text(name);
			playerTwoDiv.append(playerTwoP).css('font-size', '24px');
			playerTwo.name = true;
			$('#playerTwoName').append(playerTwoDiv);
			$('#name').val('');
		} 
		if (playerOne.name && playerTwo.name) {
			appendGameButtons();
		}
	})

	function appendGameButtons(){

		picks.forEach(function(pick){
			var divOne = $('<div class="wordsDivOne" data-picked='+pick+'>');
			divOne.append('<button id='+pick+'OneP" data-pick='+pick+'>'+pick+'</button><br>');
			$('.rpsWordsOne').append(divOne);
		});

		picks.forEach(function(pick){
			var divOne = $('<div class="wordsDivTwo" data-picked='+pick+'>');
			divOne.append('<button id='+pick+'TwoP" data-pick='+pick+'>'+pick+'</button><br>');
			$('.rpsWordsTwo').append(divOne);
		});

		$(document).on('click', '.wordsDivOne', function(){
			playerOne.pick = $(this).data('picked');
		})

		$(document).on('click', '.wordsDivTwo', function(){
			playerTwo.pick = $(this).data('picked');
		})

		if(playerOne.pick === '' && playerTwo.pick === ''){
			console.log('worked');
		} else {
			console.log('yo you')
			if(playerOne.pick === 'Rocks' && playerTwo.pick === 'Scissors'){
				alert('Player One Wins');
			} else if (playerOne.pick === 'Rocks' && playerTwo.pick === 'Paper'){
				alert('Player Two Wins');
			} else if (playerOne.pick === 'Rocks' && playerTwo.pick === 'Rocks'){
				alert('Tie');
			} else if (playerOne.pick === 'Paper' && playerTwo.pick === 'Paper'){
				alert('Tie');
			} else if (playerOne.pick === 'Paper' && playerTwo.pick === 'Scissors'){
				alert('Player Two Wins');
			} else if (playerOne.pick === 'Paper' && playerTwo.pick === 'Rock'){
				alert('Player One Wins');
			} else if (playerOne.pick === 'Scissors' && playerTwo.pick === 'Paper'){
				alert('Player One Wins');
			} else if (playerOne.pick === 'Scissors' && playerTwo.pick === 'Rocks'){
				alert('Player Two Wins');
			} else if (playerOne.pick === 'Scissors' && playerTwo.pick === 'Scissors'){
				alert('Player Two Wins');
			}
		}
	}

});