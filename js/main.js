"use strict;"

// sound effect from http://soundbible.com/

window.onload = function () {

   var keyCodes = {
     65 : "a",
     66 : "b",
     67 : "c",
     68 : "d",
     69 : "e",
     70 : "f",
     71 : "g",
     72 : "h",
     73 : "i",
     74 : "j",
     75 : "k",
     76 : "l",
     77 : "m",
     78 : "n",
     79 : "o",
     80 : "p",
     81 : "q",
     82 : "r",
     83 : "s",
     84 : "t",
     85 : "u",
     86 : "v",
     87 : "w",
     88 : "x",
     89 : "y",
     90 : "z"
     //     8 : "delete",
     //     13 : "enter",
   };

   var instructions = "Type a letter and press enter to make a guess";
   var duplicate = "you already guessed that letter";

   var word;   // word to be guessed
   var guess;  // char guessed
   var lives;  // remaining guesses
   var lettersRemaining; // number of spots that need filling

   var wordHolder;  // for div#word (TODO: new name)
   var letterList;  // new ul
   var letterPlace; // li for '_' or correct letter
   var letter = []; // array for letterPlace elements


   var turnHolder;  // for div#turns
   var guessHolder; // for div#guess

   var lettersGuessed = [];
   var guessedHolder;

   var refresh;
   var returnIcon;
   var promptTimer;

   var error =  new Audio('sound/error.wav');

   // get words with 3 or more letters
   var wordList = commonWords.filter(function(str) {return str.length > 2;});

////////////////////////////////////////////
////////////// FUNCTIONS ///////////////////
////////////////////////////////////////////
   var randomWord = function() {
      return wordList[Math.floor(Math.random()*wordList.length)];
   };

   var play = function(){
      lives = 8;
      guess = '';
      word = randomWord();
      lettersRemaining = word.length;

      wordHolder = document.getElementById('word');
      turnHolder = document.getElementById('turns');
      guessHolder = document.getElementById('guess');
      guessedHolder = document.getElementById('guessed-list');
      refresh = document.getElementById('refresh');
      returnIcon = document.getElementById('return-icon');

      letterList = document.createElement('ul');
      letterList.setAttribute('id', 'word-holder');

      for(var i=0; i<word.length; i++){
         letterPlace = document.createElement('li');
         letterPlace.setAttribute('class', 'letter-place');
         letterPlace.innerHTML = '_';
         letterList.appendChild(letterPlace);
         letter.push(letterPlace);
      }
      wordHolder.appendChild(letterList);

      guessHolder.innerHTML = instructions;
      guessHolder.classList.add('instructions');

      turnHolder.innerHTML = lives + ' lives';

      refresh.addEventListener('click', reset);
   };

   var reset = function() {
      wordHolder.innerHTML = '';
      guessedHolder.innerHTML = '';
      guessHolder.classList.remove('duplicate');
      returnIcon.classList.remove('prompt');
      closeFullscreen('win');
      closeFullscreen('lose');
      letter = [];
      lettersGuessed = [];
      play();
   };

   // close the fullscreen 'win' or 'lose' div and reset
   var closeFullscreen = function(id) {
      document.getElementById(id).classList.remove('fullscreen');
      turnHolder.classList.remove('bg-'+id);
   };

   // fullscreen for 'win' or 'lose' div
   var fullScreen = function(id) {
         var full = document.getElementById(id);
         document.getElementById(id).classList.add('fullscreen');

         if(id === 'lose'){   // reveal unguessed letters
            for(var i=0; i<word.length; i++) {
               if(letter[i].innerHTML === '_') {
                  letter[i].innerHTML = word[i];
                  letter[i].classList.add('missed');
               }
            }
         }
         turnHolder.innerHTML="";
         turnHolder.classList.add('bg-'+id);
         var query = '#'+id+' .reset-button';
         document.querySelector(query).addEventListener('click', function(){
            reset();
         });
   };

   var resetGuess = function(){
      guess = '';
      guessHolder.innerHTML = instructions;
      guessHolder.classList.remove('duplicate');
      guessHolder.classList.add('instructions');
   };

   var showDuplicate = function(){
      error.play();
      guess = '';
      guessHolder.innerHTML = duplicate;
      guessHolder.classList.add('duplicate');
   };

   var addGuessed = function(guess) {
      lettersGuessed.push(guess);
      var lg = document.createElement('div');
      lg.setAttribute('class', 'letter-guessed');
      lg.innerHTML = guess;
      guessedHolder.appendChild(lg);
   };


   var makeGuess = function() {
      addGuessed(guess);

      if(word.includes(guess)){     // if the guess is good
         for(var i=0; i<word.length; i++){
            if(guess === word[i]){
               letter[i].innerHTML = guess;
               lettersRemaining--;
            }
         }
         if (lettersRemaining < 1){
            fullScreen('win');
         }
      }

      else {      // else the guess is bad
         error.play();
         lives--;
         turnHolder.innerHTML = 'Turns: ' + lives;
         if (lives < 1) {
            fullScreen('lose');
         }
      }
      resetGuess();
   };


   document.addEventListener('keydown', function(e){

      returnIcon.classList.remove('prompt');
      clearTimeout(promptTimer);

      if(e.keyCode > 64 && e.keyCode < 90) { // if letter
         guess = keyCodes[e.keyCode];
         guessHolder.innerHTML = guess;
         guessHolder.classList.remove('instructions');
         guessHolder.classList.remove('duplicate');
         promptTimer = setTimeout(function(){
            returnIcon.classList.add('prompt');
         }, 2000);
      }
      else if(e.keyCode == 8) {   // if 'delete'
         resetGuess();
      }
      else if(e.keyCode == 13) {  // if 'enter'
         if(lettersGuessed.includes(guess)){ // if already guessed
            showDuplicate();
         }
         else if (guess == ''){   // if no guess – can indicate bad guess
            resetGuess();
         }
         else {
            makeGuess();
         }
      }
   });

   play();
}
