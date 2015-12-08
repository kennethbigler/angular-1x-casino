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


/* Player rules
https://www.blackjackinfo.com/blackjack-basic-strategy-engine/

Blackjack
    Delt a A and a 10, should pay 3:2, but most casinos do 6:5

Double Down:
    This option is available with a two card hand, before another card has been drawn
    double your bet and receive one (and only one) additional card to your hand

Splitting Pairs
    When you are dealt a pair of cards of the same rank
    allowed to split into two separate hands and play them independently
    Double after split is ok
    
Resplitting
    When you get additional pairs in the first two cards of a hand you can resplit
    Typically a player is allowed to split up to 3 times (delt 4 of a kind)
    
Splitting Aces
    Player is limited to drawing only one additional card on each Ace
    If you draw a ten-valued card on one of your split Aces, the hand is not considered a Blackjack (treated as a normal 21)
    Can re-split aces
    

Dealer hits on 16 or less and soft 17
Minimum bet is $5
*/