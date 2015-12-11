/*global $, console, app, $scope */

app.controller('BlackjackController', function ($scope, $deck) {
    "use strict";
    // prepare data
    $scope.players = 2;
    $scope.turn = 0;
    
    // bet
    // deal cards
    $deck.shuffle();
    $deck.deal(2);
    // if dealer has 21, game over
    // if player has 21, game over
    // hit / stay / split / double down player
    // bust ends
    // else, hit or stay
    // next player
        // repeat
    // dealer
    // hit or stay
    // bust pays players left
    // evaluate
        // check for special conditions
        // check for higher score <= 21
        // return payout
    // payout
    // new game
});