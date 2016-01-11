/*jslint continue:true*/
/*global $, console, app, $scope */

app.controller('BlackjackController', ['$scope', '$deck', '$storage', function ($scope, $deck, $storage) {
    "use strict";
    // prepare data
    var humans = 1,
        bet = [5, 5, 5, 5, 5, 5],
        hands = [];
    $scope.turn = 0;
    $scope.ai = 5;
    $scope.hand = [];
    $scope.dealer = [];
    
    /********************     Gameplay Helper Functions     ********************/
    function weight(hand) {
        var i = 0,
            value = 0,
            soft = false;
        for (i = 0; i < hand.length; i += 1) {
            if (10 <= hand[i].rank <= 13) {
                value += 10;
            } else if (hand[i].rank < 10) {
                value += hand[i].rank;
            } else if (value <= 10 && hand[i].rank === 14) {
                value += 11;
                soft = true;
            } else if (value > 10 && hand[i].rank === 14) {
                value += 1;
            } else if (value > 21 && soft) {
                value -= 10;
                soft = false;
            }
        }
        return value;
    }
    
    function nextPlayer() {
        var i;
        $scope.turn += 1;
        for (i = $scope.turn; i < hands.length; i += 1) {
            if (weight(hands[i]) === 21) {
                $scope.turn += 1;
            } else {
                return;
            }
        }
        // clear any flags set earlier
    }
    
    /* Evaluate Play of the Game
     * check dealer score
     * check player score, compare to dealer score
     * check for special conditions
     * payout to players
    */
    function evaluate() {
        var i, temp, dealer = weight($scope.dealer);
        // skip blackjacks but not earned 21s
        if (dealer >= 21) {
            for (i = 0; i < hands.length; i += 1) {
                if (weight(hands[i]) <= 21) {
                    $storage.add(bet[i], i);
                } else {
                    $storage.sub(bet[i], i);
                }
            }
        } else {
            for (i = 0; i < hands.length; i += 1) {
                temp = weight(hands[i]);
                if (temp > dealer && temp < 22) {
                    $storage.add(bet[i], i);
                } else if (temp === dealer) {
                    // do nothing
                    continue;
                } else {
                    $storage.sub(bet[i], i);
                }
            }
        }
    }
    
    /********************     Gameplay Helper Functions     ********************/
    // bet
    $scope.setBet = function (n) {
        bet += parseInt(n, 10);
    };
    
    // reveal cards
    // if dealer has 21, game over
    // if player has 21, game over
    $scope.checkBlackjack = function () {
        var i;
        if (weight($scope.dealer) === 21) {
            for (i = 0; i < hands.length; i += 1) {
                if (weight(hands[i]) !== 21) {
                    $storage.sub(bet[i], i);
                }
                // if blackjack, do nothing
            }
        } else {
            for (i = 0; i < hands.length; i += 1) {
                if (weight(hands[i]) === 21) {
                    $storage.add(1.5 * bet[i], i);
                }
                // if not blackjack, do nothing
            }
        }
    };
    // hit / stay / split / double down player
    $scope.hit = function (p) {
        console.log("hit");
        hands[p].push($deck.deal(1)[0]);
        // check for 21
        // check for 22+
        // set flags accordingly
    };
    $scope.stay = function () {
        console.log("stay");
        nextPlayer();
    };
    $scope.split = function (p) {
        console.log("split");
        if (hands[p][0].rank === 14) {
            nextPlayer();
        }
        // track this hand to the bet of the player who split somehow
        hands.push([hands[p].pop(), $deck.deal(1)[0]]);
        hands[p].push($deck.deal(1)[0]);
    };
    $scope.doubledown = function (p) {
        console.log("doubledown");
        bet[p] *= 2;
        hands[p].push($deck.deal(1)[0]);
        nextPlayer();
    };
    // Dealer hits on 16 or less and soft 17
    // Dealer bust pays players left
    $scope.playAI = function () {
        
    };
    // new game
    $scope.newGame = function () {
        var i;
        $scope.turn = 0;
        $deck.shuffle();
        for (i = 0; i < (humans + $scope.ai); i += 1) {
            hands[i] = $deck.deal(2);
            hands[i].sort($deck.rankSort);
        }
        $scope.dealer = $deck.deal(2);
        $scope.hands = hands;
        $scope.hand = hands[$scope.turn];
    };
    
    /********************     UI Functions     ********************/
    // update ai and human players
    $scope.updateAI = function (n) {
        humans = n;
        $scope.ai = 6 - n;
        $('.btn-danger').removeClass('btn-danger');
        $('#b' + n).addClass('btn-danger');
    };
    /********************     Testing Code     ********************/
    $scope.newGame();
}]);

/* Computer Algorithm
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