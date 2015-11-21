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
            //$scope.hand.splice(cards[i], 1);
            $scope.hand[cards[i]] = $deck.deal(1)[0];
        }
    };
    
    /* Compare hands to see who wins
     * Hands should be assigned 3 hex values:
     *     poker hand, high card, high suit
     * Compare values to see who wins
     * Rankings:
     *   Straight Flush  8
     *   4 of a Kind     7
     *   Full House      6
     *   Flush           5
     *   Straight        4
     *   3 of a Kind     3
     *   2 Pair          2
     *   1 Pair          1
     *   High Card       0
    */
    $scope.evaluate = function (hand) {
        var i, j, hist, temp, s, f;
        // Histogram for the cards
        hist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        // put hand into the histrogram        
        for (i = 0; i < hand.length; i += 1) {
            temp = hand[i].rank - 2; //2-14 - 2 = 0-12
            hist[temp] += 1;
        }
        // iterate through and look for hands with multiple cards
        temp = hist.indexOf(4);
        // 4 of a kind
        if (temp !== -1) {
            console.log(temp);
            // for texas holdem, need to return indexOf(1) instead of 0 #1
            // return 7 / temp /0/0/0/0
        }
        temp = hist.indexOf(3);
        i = hist.indexOf(2);
        j = hist.indexOf(2, i + 1);
        if (temp !== -1 && i !== -1) {
            // full house
            // return 6 / temp / i /0/0/0
        } else if (temp !== -1) {
            // 3 of a kind
            // return 3 / temp / lastIndexOf(1) / indexOf(1) /0/0
        } else if (i !== -1 && j !== -1) {
            // 2 pair
            // return 2 / j / i / indexOf(1) /0/0
        } else if (i !== -1) {
            // 1 pair
            // return 1 / i / lastIndexOf(1) / lastIndexOf(1, q) / indexOf(1) /0
        } else {
            // all single cards, look for flush and straight
            temp = hist.indexOf(1);
            j = hist.lsatIndexOf(1);
            // check for straight
            s = ((j - temp) === 4);
            // A,2,3,4,5
            if (!s) {
                s = (hist[0] === 1 && hist[1] === 1 && hist[2] === 1 && hist[3] === 1 && hist[12] === 1);
            }
            // check for flush
            for (i = 0; i < hand.length; i += 1) {
                if (i === hand.length - 1) {
                    f = true;
                    break;
                } else if (hand[i].suit !== hand[i + 1].suit) {
                    f = false;
                    break;
                }
            }
            if (s && f) {
                // return 8 / j /0/0/0/0
            } else if (f) {
                // 2 of 5 
                // return 5 / j / hist.indexOf(1, j-1) / hist.indexOf(1, k-1) / hist.indexOf(1, L-1) / hist.indexOf(1, m-1)
            } else if (s) {
                // return 4 / j /0/0/0/0
            } else {
                // 2 of 5
                // return 0 / j / hist.indexOf(1, j-1) / hist.indexOf(1, k-1) / hist.indexOf(1, L-1) / hist.indexOf(1, m-1)
            }
        }
    };
    
    
    // testing
    $scope.discard([1, 3, 4]);
    $scope.hand.sort(suitSort);
    console.log($scope.hand);
    for (i = 0; i < $scope.hand.length; i += 1) {
        console.log($scope.hand[i].name);
    }
});






// js hex representation: 0xFFF;