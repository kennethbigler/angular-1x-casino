/*global $, console, app, $scope */

app.controller('PokerController', ['$scope', '$deck', '$money', function ($scope, $deck, $money) {
    "use strict";
    
    /******************************     Prep Data and Variables     ******************************/
    var humans,
        hands = [];
    $scope.trash = [];
    humans = 1;
    $scope.ai = 4;
    $scope.turn = 0;
    $scope.df = false;
    $scope.nf = false;
    $scope.sf = false;
    $scope.tf = false;
    $scope.dropped = ["", "", "", "", ""];
    
    /******************************     Helper Functions     ******************************/
    /* Pass in an array of index numbers
     * iterate through array, removing each index number from hand
     * add new cards to the hand
    */
    function discard(cards, p) {
        var i;
        console.log(p + ": " + cards);
        for (i = 0; i < cards.length; i += 1) {
            hands[p][cards[i]] = $deck.deal(1)[0];
        }
        hands[p].sort($deck.rankSort);
    }
    
    /* Compare hands to see who wins
     * Hands is assigned a weight based on hand, then card values
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
     * Return value is a base 13 string, to be converted into base 10 for comparison
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
            if (!s) { s = (hist[0] === 1 && hist[1] === 1 && hist[2] === 1 && hist[3] === 1 && hist[12] === 1); }
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
    
    /* computer play algorithm:
    PAIRS
    draw 0 on 4 of a kind
    draw 0 on full house
    draw 1 on 3 of a kind, keep higher of 2
    draw 1 on 2 pair
    draw 3 on 2 of a kind

    This is a nice to have, for now we only follow the first half
    STRAIGHT/FLUSH
    draw 0 on s
    draw 0 on f
    draw 0 on sf
    if 1 away from sf -> draw 1
    if 1 away from S -> draw 1 if 5+ players, else regular hand
    if 1 away from F -> draw 1 if 5+ players, else regular hand

    REGULAR HAND
    if K / A -> draw 4
    else draw 5
    */
    function computer(hand) {
        var i, j, hist, temp, s, f, x, y;
        // Histogram for the cards
        hist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        // put hand into the histrogram        
        for (i = 0; i < hand.length; i += 1) {
            temp = hand[i].rank - 2; //2-14 - 2 = 0-12
            hist[temp] += 1;
        }
        temp = hist.indexOf(4);
        if (temp !== -1) {
            console.log(temp);
            // draw 0 on 4 of a kind
            return "7" + temp.toString(13) + "0000";
        }
        temp = hist.indexOf(3);
        i = hist.indexOf(2);
        j = hist.indexOf(2, i + 1);
        if (temp !== -1 && i !== -1) {
            // draw 0 on full house
            return "6" + temp.toString(13) + i.toString(13) + "000";
        } else if (temp !== -1) {
            // 3 of a kind
            temp = [];
            j = hist.indexOf(1);
            for (i = 0; i < hand.length; i += 1) {
                if (j === hand[i].rank - 2) {
                    temp.push(i);
                    break;
                }
            }
            discard(temp, $scope.turn);
            return evaluate(hands[$scope.turn]);
        } else if (i !== -1 && j !== -1) {
            // 2 pairs
            temp = [];
            j = hist.indexOf(1);
            for (i = 0; i < hand.length; i += 1) {
                if (j === hand[i].rank - 2) {
                    temp.push(i);
                    break;
                }
            }
            discard(temp, $scope.turn);
            return evaluate(hands[$scope.turn]);
        } else if (i !== -1) {
            // 1 pair
            temp = [];
            j = hist.indexOf(1);
            s = hist.indexOf(1, j + 1);
            f = hist.indexOf(1, s + 1);
            for (i = 0; i < hand.length; i += 1) {
                x = hand[i].rank - 2;
                if (j === x || s === x || f === x) {
                    temp.push(i);
                }
            }
            discard(temp, $scope.turn);
            return evaluate(hands[$scope.turn]);
        } else {
            // all single cards
            temp = hist.indexOf(1);
            j = hist.lastIndexOf(1);
            // check for straight
            s = ((j - temp) === 4);
            if (!s) { s = (hist[0] === 1 && hist[1] === 1 && hist[2] === 1 && hist[3] === 1 && hist[12] === 1); }
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
                i = hist.lastIndexOf(1);
                if (i === 12 || i === 11) {
                    // if ace || king
                    temp = [];
                    j = hist.indexOf(1);
                    s = hist.indexOf(1, j + 1);
                    f = hist.indexOf(1, s + 1);
                    y = hist.indexOf(1, f + 1);
                    for (i = 0; i < hand.length; i += 1) {
                        x = hand[i].rank - 2;
                        if (j === x || s === x || f === x || y === x) {
                            temp.push(i);
                        }
                    }
                    discard(temp, $scope.turn);
                    return evaluate(hands[$scope.turn]);
                } else {
                    // discard whole hand
                    temp = [0, 1, 2, 3, 4];
                    discard(temp, $scope.turn);
                    return evaluate(hands[$scope.turn]);
                }
            }
        }
    }
    
    /* Iterate through the hnad outputing the name of each to the console
     * This function is for testing purposes only
     */
    /*function print(hand) {
        console.log("-----");
        hand.sort($deck.rankSort);
        var i;
        for (i = 0; i < hand.length; i += 1) {
            console.log(hand[i].name);
        }
    }*/
    
    /******************************     View Functions     ******************************/
    // update ai and human players
    $scope.updateAI = function (n) {
        humans = n;
        $scope.ai = 5 - n;
        $('.btn-danger').removeClass('btn-danger');
        $('#b' + n).addClass('btn-danger');
    };
    
    // select cards to discard
    $scope.toss = function (t) {
        var i = $scope.trash.indexOf(t);
        if (i !== -1) {
            //splice: (index where, how many to remove)
            $scope.trash.splice(i, 1);
            $scope.dropped[t] = "";
        } else {
            $scope.trash.push(t);
            $scope.dropped[t] = "dropped";
        }
    };
    
    // discard selected cards and get replacements
    $scope.discard = function () {
        discard($scope.trash, $scope.turn);
        $scope.dropped = ["", "", "", "", ""];
        $scope.trash = [];
        $scope.df = true;
        //print(hands[$scope.turn]);
    };
    
    // move to the next hand
    $scope.nextHand = function () {
        $scope.sf = false;
        $scope.turn += 1;
        if ($scope.turn === humans) {
            // to determine winner, decode w/ z = parseInt(result, 13);
            var i = 0,
                max = 0,
                player = 0,
                temp = 0;
            for (i = 0; i < humans; i += 1) {
                temp = evaluate(hands[i]);
                console.log(temp);
                temp = parseInt(temp, 13);
                if (temp > max) {
                    max = temp;
                    player = i;
                }
            }
            for (i = 0; i < $scope.ai; i += 1) {
                temp = computer(hands[i + humans]);
                $scope.turn += 1;
                console.log(temp);
                temp = parseInt(temp, 13);
                if (temp > max) {
                    max = temp;
                    player = i + humans;
                }
            }
            $scope.df = true;
            $scope.nf = true;
            $scope.sf = true;
            $scope.turn = player;
            $scope.hand = hands[player];
            $scope.hands = hands;
            if (player === 0) {
                $money.add(40);
                //variable bets
            } else {
                $money.sub(10);
                //variable bets
            }
        } else {
            $scope.df = false;
            $scope.hand = hands[$scope.turn];
        }
        $scope.tf = true;
        $scope.dropped = ["", "", "", "", ""];
        $scope.trash = [];
    };
    
    // shuffle the deck and re-distribute hands
    $scope.newGame = function () {
        var i;
        $scope.turn = 0;
        $deck.shuffle();
        for (i = 0; i < (humans + $scope.ai); i += 1) {
            hands[i] = $deck.deal(5);
            hands[i].sort($deck.rankSort);
        }
        $scope.df = false;
        $scope.nf = false;
        $scope.sf = false;
        $scope.tf = false;
        $scope.dropped = ["", "", "", "", ""];
        $scope.trash = [];
        $scope.hands = [];
        $scope.hand = hands[$scope.turn];
    };
    
    /******************************     Testing     ******************************/
    $scope.newGame();
}]);