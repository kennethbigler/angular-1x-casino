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
        splits = [],
        tracker = 1,
        soft = false;
    $scope.turn = 0;
    $scope.ai = 5;
    $scope.hands = [];
    $scope.dealer = [];
    // buttons, hit, double, stay
    $scope.st = false;
    $scope.h = false;
    $scope.d = false;
    $scope.sp = false;
    $scope.stayb = "Stay";
    
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
                soft = false;
                value -= 10;
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
            }
            // End game, dont call eval
            $scope.st = false;
        }
    }
    
    // Dealer hits on 16 or less and soft 17
    function playDealer() {
        var n = weight($scope.dealer);
        while ((n < 17) || (n === 17 && soft)) {
            $scope.dealer.push($deck.deal(1)[0]);
            n = weight($scope.dealer);
            console.log(n);
        }
    }
    
    // AI: https://www.blackjackinfo.com/blackjack-basic-strategy-engine/
    function playBot() {
        var x = hands[$scope.turn][0].rank,
            y = hands[$scope.turn][1].rank,
            n = weight(hands[$scope.turn]),
            d = $scope.dealer[0].rank;
        while (n < 22) {
            // split algorithm 
            if (x === y) {
                if (x === 2 || x === 3 || x === 7) {
                    // 2,3,7, split d2-7, hit d8+
                    if (d <= 7) {
                        $scope.split();
                    } else {
                        $scope.hit();
                    }
                } else if (x === 4) {
                    // 4, split d5-6, else hit
                    if (d === 5 || d === 6) {
                        $scope.split();
                    } else {
                        $scope.hit();
                    }
                } else if (x === 5) {
                    // 5, double d2-9, hit d10+
                    if (d <= 9) {
                        $scope.double();
                    } else {
                        $scope.hit();
                    }
                } else if (x === 6) {
                    // 6, split d2-6, else hit
                    if (d <= 6) {
                        $scope.split();
                    } else {
                        $scope.hit();
                    }
                } else if (x === 9) {
                    // 9, d7,10+ stay, else split
                    if (d === 7 || d >= 10) {
                        return;
                    } else {
                        $scope.split();
                    }
                } else if (x === 8 || x === 14) {
                    // 8,A split
                    $scope.split();
                } else {
                    // 10 Stay
                    return;
                }
            } else if (n < 20 && soft) {
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
            x = 0;
            y = 1;
        }
        console.log("bust");
        return;
    }
    
    // check 21, then win, then draw, then lose
    function payout(s, d) {
        var temp, dealer = weight($scope.dealer);
        temp = weight(hands[s]);
        /* If split aces is bj, its not bj, check for this? */
        if (temp === 21 && hands[s].length === 2) {
            $storage.add(1.5 * bet[s], d);
        } else if ((temp > dealer || dealer > 21) && temp < 22) {
            $storage.add(bet[s], d);
        } else if (temp === dealer) {
            console.log("draw");
        } else {
            $storage.sub(bet[s], d);
        }
    }

    // check if splits, otherwise evaluate as normal
    function evaluate() {
        var i, temp = 0;
        for (i = 0; i < hands.length; i += 1) {
            // check if there was a split
            if (splits.indexOf(i) !== -1) {
                temp += 1;
                splits.splice(splits.indexOf(i), 1);
            }
            payout(i, i - temp);
        }
        $scope.st = false;
    }
    
    function resetVars() {
        var x, y;
        if ($scope.turn >= (humans + $scope.ai)) {
            $scope.h = false;
            $scope.d = false;
            $scope.sp = false;
            return;
        }
        x = hands[$scope.turn][0].rank;
        y = hands[$scope.turn][1].rank;
        // clear flags set earlier
        $scope.h = true;
        $scope.d = true;
        // check for split and show button if yes
        if (x === y || ((x >= 10 && x <= 13) && (y >= 10 && y <= 13))) {
            $scope.sp = true;
        }
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
        if (weight(hands[$scope.turn]) >= 21) {
            $scope.h = false;
        }
        // hide double and split
        $scope.d = false;
        $scope.sp = false;
    };
    // switches to the next players turn
    $scope.stay = function () {
        var i;
        soft = false;
        $scope.turn += 1;
        if ($scope.turn >= (humans + $scope.ai)) {
            playDealer();
            evaluate();
            $scope.stayb = "Stay";
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
        resetVars();
        if ($scope.turn >= humans && $scope.turn < (humans + $scope.ai)) {
            for (i = $scope.turn; i < (humans + $scope.ai); i += 1) {
                playBot();
                soft = false;
                console.log("AI " + $scope.turn + " stays");
                $scope.turn += 1;
            }
            $scope.turn += 1;
            $scope.h = false;
            $scope.d = false;
            $scope.sp = false;
            $scope.stayb = "Evaluate";
        }
    };
    // takes 1 hand of doubles, and turns it into 2 hands, duplicates bet
    $scope.split = function () {
        console.log("split");
        // track the hand number that will need to be removed
        splits.push($scope.turn + 1);
        // insert hands and position holders in bet and names
        hands.splice($scope.turn + 1, 0, [hands[$scope.turn].pop(), $deck.deal(1)[0]]);
        hands[$scope.turn].push($deck.deal(1)[0]);
        bet.splice($scope.turn + 1, 0, bet[$scope.turn]);
        $scope.sp = false;
        /* Create a way to pair hands together in view */
        resetVars();
        // add room in turn order for extra hand
        if ($scope.turn < humans) {
            humans += 1;
            // cannot hit after splitting aces
            if (hands[$scope.turn][0].rank === 14) {
                $scope.h = false;
                $scope.d = false;
                $scope.turn += 2;
                return;
            }
        } else {
            $scope.ai += 1;
            console.log("ai split");
        }
    };
    // double bet and get only 1 card
    $scope.double = function () {
        console.log("double");
        bet[$scope.turn] += bet[$scope.turn];
        hands[$scope.turn].push($deck.deal(1)[0]);
        $scope.h = false;
        $scope.d = false;
        $scope.sp = false;
    };
    
    // new game
    $scope.newGame = function () {
        var i;
        $scope.turn = 0;
        $scope.updateAI(tracker);
        $deck.shuffle();
        hands = [];
        for (i = 0; i < (humans + $scope.ai); i += 1) {
            hands[i] = $deck.deal(2);
            hands[i].sort($deck.rankSort);
        }
        $scope.dealer = $deck.deal(2);
        $scope.hands = hands;
        soft = false;
        // skip beginning hand w/ 21
        if (weight(hands[0]) === 21) {
            // skip play of initial blackjacks
            $scope.h = false;
            $scope.d = false;
            $scope.sp = false;
            return;
        }
        // start the game
        $scope.st = true;
        resetVars();
        checkBlackjack();
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
        tracker = n;
        $scope.ai = 6 - n;
        $('.btn-danger').removeClass('btn-danger');
        $('#b' + n).addClass('btn-danger');
    };
/********************     Testing Code     ********************/
    $scope.newGame();
}]);