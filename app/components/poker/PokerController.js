/*global $, console, app, $scope */

app.controller('PokerController', function ($scope, $deck) {
    "use strict";
    
    /******************************     Prep Data and Variables     ******************************/
    var hand, i, rankSort, suitSort;
    $scope.trash = [];
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
    
    /******************************     Prep Helper Functions     ******************************/
    /* Pass in an array of index numbers
     * iterate through array, removing each index number from hand
     * add new cards to the hand
    */
    function discard(cards) {
        var i;
        for (i = 0; i < cards.length; i += 1) {
            $scope.hand[cards[i]] = $deck.deal(1)[0];
        }
    }
    
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
    function evaluate(hand) {
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
            return "7" + temp.toString(13) + "0000";
            // for texas holdem, need to return indexOf(1) instead of first 0
        }
        temp = hist.indexOf(3);
        i = hist.indexOf(2);
        j = hist.indexOf(2, i + 1);
        if (temp !== -1 && i !== -1) {
            // full house
            return "6" + temp.toString(13) + i.toString(13) + "000";
        } else if (temp !== -1) {
            // 3 of a kind
            i = hist.lastIndexOf(1).toString(13);
            j = hist.indexOf(1).toString(13);
            return "3" + temp.toString(13) + i + j + "00";
        } else if (i !== -1 && j !== -1) {
            // 2 pair
            temp = hist.indexOf(1).toString(13);
            return "2" + j.toString(13) + i.toString(13) + temp + "00";
        } else if (i !== -1) {
            // 1 pair
            j = hist.lastIndexOf(1);
            temp = hist.lastIndexOf(1, j - 1).toString(13);
            s = hist.indexOf(1).toString(13);
            return "1" + i.toString(13) + j.toString(13) + temp + s + "0";
        } else {
            // all single cards, look for flush and straight
            temp = hist.indexOf(1);
            j = hist.lastIndexOf(1);
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
                return "8" + j.toString(13) + "0000";
            } else if (f) {
                // flush
                i = hist.lastIndexOf(1, j - 1);
                temp = hist.lastIndexOf(1, i - 1);
                s = hist.lastIndexOf(1, temp - 1);
                f = hist.lastIndexOf(1, s - 1);
                return "5" + j.toString(13) + i.toString(13) + temp.toString(13) + s.toString(13) + f.toString(13);
            } else if (s) {
                // straight
                return "4" + j.toString(13) + "0000";
            } else {
                // high card
                i = hist.lastIndexOf(1, j - 1);
                temp = hist.lastIndexOf(1, i - 1);
                s = hist.lastIndexOf(1, temp - 1);
                f = hist.lastIndexOf(1, s - 1);
                return "0" + j.toString(13) + i.toString(13) + temp.toString(13) + s.toString(13) + f.toString(13);
            }
        }
    }
    
    function print(hand) {
        $scope.hand.sort(rankSort);
        for (i = 0; i < hand.length; i += 1) {
            console.log(hand[i].name);
        }
    }
    
    /******************************     Prep View Functions     ******************************/
    // call the evaluate function for each hand and determine winner
    $scope.evaluate = function () {
        // to determine winner, decode w/ z = parseInt(result, 13);
        var r = evaluate($scope.hand);
        console.log(r);
        console.log(parseInt(r, 13));
    };
    
    // select cards to discard
    $scope.toss = function (t) {
        var i = $scope.trash.indexOf(t);
        if (i !== -1) {
            //splice: (index where, how many to remove)
            $scope.hand.splice(i, 1);
        } else {
            $scope.trash.push(t);
        }
        console.log($scope.trash);
    };
    
    // discard selected cards and get replacements
    $scope.discard = function () {
        discard($scope.trash);
        $scope.trash = [];
    };
    
    
    
    /******************************     Testing     ******************************/
    $deck.shuffle();
    hand = $deck.deal(5);
    $scope.hand = hand;
    $scope.hand.sort(suitSort);
    print($scope.hand);
});