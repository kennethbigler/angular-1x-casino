/*jslint continue:true*/
/*global $, console, app, $scope */
/* Theoretical Max Score:   386 everyone splits 3 times and busts with 30, dealer bust with 26
 * Card Point Value:        340-380 */

app.controller('BlackjackController', ['$scope', '$deck', '$storage', function ($scope, $deck, $storage) {
    "use strict";
    // prepare data
    var humans = 1,
        bet = [5, 5, 5, 5, 5, 5],
        hands = [],
        soft = false;
    $scope.turn = 0;
    $scope.ai = 5;
    $scope.hands = [];
    $scope.dealer = [];
    // buttons, hit, double, stay
    $scope.b = false;
    $scope.h = false;
    $scope.d = false;
    $scope.s = false;
    
/********************     Gameplay Helper Functions     ********************/
    function weight(hand) {
        var i = 0,
            value = 0,
            temp = 0;
        for (i = 0; i < hand.length; i += 1) {
            temp = hand[i].rank;
            if (temp >= 10 && temp <= 13) {
                value += 10;
            } else if (temp < 10) {
                value += temp;
            } else if (value <= 10 && temp === 14) {
                value += 11;
                soft = true;
            } else if (value > 10 && temp === 14) {
                value += 1;
            } else {
                // error logging
                console.log("Weight Error: rank " + temp + ", val " + value);
            }
            // check for soft "busts"
            if (value > 21 && soft) {
                value -= 10;
                soft = false;
            }
        }
        return value;
    }
    function checkBlackjack() {
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
    }
    // Dealer hits on 16 or less and soft 17
    function playDealer() {
        var n = weight($scope.dealer);
        while ((n < 17) || (n === 17 && soft)) {
            $scope.dealer.push($deck.deal(1)[0]);
            n = weight($scope.dealer);
        }
    }
    
    // AI: https://www.blackjackinfo.com/blackjack-basic-strategy-engine/
    function playBot() {
        var x = hands[$scope.turn][0].rank,
            y = hands[$scope.turn][1].rank,
            n = weight(hands[$scope.turn]),
            d = $scope.dealer[0].rank;
        while (n < 22) {
            if (x === y) {
                /* write split algorithm */
                $scope.split();
            }
            if (n < 20 && soft) {
                // soft hands, A9+ stays
                if (n === 13 || n === 14) {
                    // A2-A3 double d5-6, hit d2-4, d7-A
                    if (d === 5 || d === 6) {
                        $scope.double();
                        return;
                    } else {
                        $scope.hit();
                    }
                } else if (n === 15 || n === 16) {
                    // A4-A5 double d4-6, hit d2-3, d7-A
                    if (d >= 4 && d <= 6) {
                        $scope.double();
                        return;
                    } else {
                        $scope.hit();
                    }
                } else if (n === 17) {
                    // A6 double d3-6, hit d2, d7-A
                    if (d >= 3 && d <= 6) {
                        $scope.double();
                        return;
                    } else {
                        $scope.hit();
                    }
                } else if (n === 18) {
                    // A7 double d2-6, stay d7-8, hit d9-A
                    if (n >= 2 && n <= 6) {
                        $scope.double();
                        return;
                    } else if (n === 7 || n === 8) {
                        return;
                    } else {
                        $scope.hit();
                    }
                } else if (n === 19) {
                    // A8 double d6, else stay
                    if (d === 6) {
                        $scope.double();
                        return;
                    } else {
                        return;
                    }
                } else {
                    console.log("AI " + $scope.turn + " Error: n " + n + ", d " + d + ", s " + soft);
                    return;
                }
            } else if (n < 17 && !soft) {
                // hard hands, 17+ stays
                if (n >= 5 && n <= 8) {
                    // 5-8 hit
                    $scope.hit();
                } else if (n === 9) {
                    // 9 double d3-6, hit d2, d7-A
                    if (d >= 3 && d <= 6) {
                        $scope.double();
                        return;
                    } else {
                        $scope.hit();
                    }
                } else if (n === 10) {
                    // 10 double d2-9, hit d10-A
                    if (d >= 2 && d <= 9) {
                        $scope.double();
                        return;
                    } else {
                        $scope.hit();
                    }
                } else if (n === 11) {
                    // 11 double
                    $scope.double();
                    return;
                } else if (n === 12) {
                    // 12 hit d2-3, stay d4-6, hit 7-A
                    if (d >= 4 && d <= 6) {
                        return;
                    } else {
                        $scope.hit();
                    }
                } else if (n >= 13 && n <= 16) {
                    // 13-16 stay d2-6, hit 7-A
                    if (d >= 2 && d <= 6) {
                        return;
                    } else {
                        $scope.hit();
                    }
                } else {
                    console.log("AI " + $scope.turn + " Error: n " + n + ", d " + d + ", s " + soft);
                    return;
                }
            } else {
                console.log("AI " + $scope.turn + ": n " + n + ", d " + d + ", s " + soft);
                return;
            }
            n = weight(hands[$scope.turn]);
        }
        console.log("bust");
        return;
    }
    /* Evaluate Play of the Game
     * check dealer score
     * check player score, compare to dealer score
     * payout to players and house
    */
    function evaluate() {
        var i, temp, dealer = weight($scope.dealer);
        // dealer bust
        if (dealer > 21) {
            for (i = 0; i < hands.length; i += 1) {
                temp = weight(hands[i]);
                // skip blackjacks but not earned 21s
                /* If split aces is bj, its not bj, check for this? */
                if (temp === 21 && hands[i].length === 2) {
                    continue;
                } else if (weight(hands[i]) <= 21) {
                    $storage.add(bet[i], i);
                } else {
                    $storage.sub(bet[i], i);
                }
            }
        } else {
            for (i = 0; i < hands.length; i += 1) {
                temp = weight(hands[i]);
                if (temp === 21 && hands[i].length === 2) {
                    continue;
                } else if (temp > dealer && temp < 22) {
                    $storage.add(bet[i], i);
                } else if (temp === dealer) {
                    continue;
                } else {
                    $storage.sub(bet[i], i);
                }
            }
        }
        $scope.b = false;
    }
    
/********************     Gameplay Functions     ********************/
    // modify bet
    $scope.setBet = function (n, p) {
        bet[p] += parseInt(n, 10);
        if (bet[p] < 5) {
            bet[p] = 5;
        }
    };
    // player gets an extra card, forced to stay on x >= 21
    $scope.hit = function () {
        console.log("hit");
        hands[$scope.turn].push($deck.deal(1)[0]);
        // cannot hit on 21 or over
        console.log(weight(hands[$scope.turn]));
        if (weight(hands[$scope.turn]) >= 21) {
            $scope.h = false;
        }
        // hide double and split
        $scope.d = false;
        $scope.s = false;
    };
    // switches to the next players turn
    $scope.stay = function () {
        var i;
        soft = false;
        $scope.turn += 1;
        if ($scope.turn > (humans + $scope.ai)) {
            evaluate();
            /* do something here to display the end */
            return;
        }
        // skip play of blackjacks
        for (i = $scope.turn; i < hands.length; i += 1) {
            if (weight(hands[i]) === 21) {
                $scope.turn += 1;
            } else { break; }
        }
        // clear flags set earlier
        $scope.h = true;
        $scope.d = true;
        /* check for split and show button if yes */
        $scope.s = true;
        /*if ($scope.turn >= humans && $scope.turn < (humans + $scope.ai)) {
            playBot();
        } else if ($scope.turn === (humans + $scope.ai)) {
            playDealer();
        }*/
        if ($scope.turn >= humans && $scope.turn <= (humans + $scope.ai)) {
            for (i = $scope.turn; i < (humans + $scope.ai); i += 1) {
                playBot();
                console.log("AI " + $scope.turn + " stays");
                $scope.turn += 1;
            }
            playDealer();
            $scope.turn += 1;
        }
    };
    // takes 1 hand of doubles, and turns it into 2 hands, duplicates bet
    $scope.split = function () {
        console.log("split");
        var x, y;
        /* splice into the turn +1 spot in hand, names, bet, etc.
         * global array: splits = []
         * splits.push($scope.turn)
         * durring evaluation:
            if (indexof(i, splits)) {
                add to playerscore[i-1];
                if (indexof(i+1, splits)) {
                    add to playerscore[i-2];
                    if (indexof(i+2, splits)) {
                        add to playerscore[i-3];
                    }
                }
            }
         * after evaluation (end), splice out splits array from [hand, names, bet]
        */
        hands[$scope.turn + 6] = [hands[$scope.turn].pop(), $deck.deal(1)[0]];
        hands[$scope.turn].push($deck.deal(1)[0]);
        // cannot hit after splitting aces
        // make it so that the hands split and the cards are face down
        if (hands[$scope.turn][0].rank === 14) {
            $scope.h = false;
            $scope.d = false;
            $scope.s = false;
            return;
        }
        $scope.h = true;
        $scope.d = true;
        // check for split and show button if yes
        x = hands[$scope.turn][0].rank;
        y = hands[$scope.turn][1].rank;
        if (x === y || ((x >= 10 && x <= 13) && (y >= 10 && y <= 13))) {
            $scope.s = true;
        }
    };
    // double bet and get only 1 card
    $scope.double = function () {
        console.log("double");
        bet[$scope.turn] *= 2;
        hands[$scope.turn].push($deck.deal(1)[0]);
        $scope.h = false;
        $scope.d = false;
        $scope.s = false;
    };
    
    // new game
    $scope.newGame = function () {
        var i, x, y;
        $scope.turn = 0;
        $deck.shuffle();
        for (i = 0; i < (humans + $scope.ai); i += 1) {
            hands[i] = $deck.deal(2);
            hands[i].sort($deck.rankSort);
        }
        $scope.dealer = $deck.deal(2);
        $scope.hands = hands;
        checkBlackjack();
        soft = false;
        // skip beginning hand w/ 21
        if (weight(hands[0]) === 21) {
            // skip play of initial blackjacks
            $scope.h = false;
            $scope.d = false;
            $scope.s = false;
            return;
        }
        // start the game
        $scope.b = true;
        $scope.h = true;
        $scope.d = true;
        // check for split and show button if yes
        x = hands[$scope.turn][0].rank;
        y = hands[$scope.turn][1].rank;
        if (x === y || ((x >= 10 && x <= 13) && (y >= 10 && y <= 13))) {
            $scope.s = true;
        }
        /* switch back to bets & player selection */
    };
    
    /*
    // show bets & # players at start, no hands & game buttons
    // functions like set bets, updateAI
    // click startgame button to:
    // hide bets & # players, then show hands & game buttons
    */
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