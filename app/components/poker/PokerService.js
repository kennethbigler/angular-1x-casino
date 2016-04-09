/*global app, console */

app.factory('PokerService', ['$deck', function ($deck) {
    "use strict";
    var factory = {};
    
    factory.hands = [];
    
    /* Pass in an array of index numbers
     * iterate through array, removing each index number from hand
     * add new cards to the hand
    */
    factory.discard = function (cards, p) {
        var i;
        console.log(p + ": " + cards);
        for (i = 0; i < cards.length; i += 1) {
            factory.hands[p][cards[i]] = $deck.deal(1)[0];
        }
        factory.hands[p].sort($deck.rankSort);
    };
    
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
    factory.evaluate = function (hand) {
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
    };
    
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
    factory.computer = function (hand, turn) {
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
            factory.discard(temp, turn);
            return factory.evaluate(factory.hands[turn]);
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
            factory.discard(temp, turn);
            return factory.evaluate(factory.hands[turn]);
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
            factory.discard(temp, turn);
            return factory.evaluate(factory.hands[turn]);
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
                    factory.discard(temp, turn);
                    return factory.evaluate(factory.hands[turn]);
                } else {
                    // discard whole hand
                    temp = [0, 1, 2, 3, 4];
                    factory.discard(temp, turn);
                    return factory.evaluate(factory.hands[turn]);
                }
            }
        }
    };
    
    return factory;
}]);