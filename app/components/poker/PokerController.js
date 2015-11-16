/*global $, console, app, $scope */

app.controller('PokerController', function ($scope, $deck) {
    "use strict";
    var hand, i, rankSort, suitSort;
    rankSort = function (a, b) {return a.rank - b.rank; };
    suitSort = function (a, b) {
        var ta, tb;
        switch (a.suit) {
        case "♦":
            ta = 0;
            break;
        case "♣":
            ta = 1;
            break;
        case "♥":
            ta = 2;
            break;
        case "♠":
            ta = 3;
            break;
        default:
            ta = 0;
            console.log("Error! Suit is " + a.suit);
        }
        switch (b.suit) {
        case "♦":
            tb = 0;
            break;
        case "♣":
            tb = 1;
            break;
        case "♥":
            tb = 2;
            break;
        case "♠":
            tb = 3;
            break;
        default:
            tb = 0;
            console.log("Error! Suit is " + b.suit);
        }
        return ta - tb;
    };
    
    $deck.shuffle();
    hand = $deck.deal(5);
    $scope.hand = hand;
    $scope.hand.sort(suitSort);
    
    for (i = 0; i < $scope.hand.length; i += 1) {
        console.log($scope.hand[i].name);
    }
    
    /* Pass in an array of index numbers
     * iterate through array, removing each index number from hand
     * add new cards to the hand
    */
    $scope.discard = function (cards) {
        var i;
        for (i = 0; i < cards.length; i += 1) {
            //splice: (index where, how many to remove)
            $scope.hand.splice(cards[i], 1);
        }
    };
});