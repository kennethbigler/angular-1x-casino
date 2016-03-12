/*jslint continue:true*/
/*global $, console, app, $scope */
/* Theoretical Max Score:   386 everyone splits 3 times and busts with 30, dealer bust with 26
 * Card Point Value:        340-380 */

app.controller('BlackjackController', ['$scope', '$deck', '$storage', 'BlackjackService', function ($scope, $deck, $storage, BlackjackService) {
    "use strict";
    // prepare data
    var humans = 1,
        hands = [],
        splits = [],
        tracker = 1,
        splited = 0,
        turn = 0;
    $scope.turn = 0;
    $scope.ai = 5;
    $scope.hands = [];
    $scope.dealer = [];
    $scope.bet = [];
    // buttons, stay, hit, double, split, players, showHand
    $scope.st = false;
    $scope.h = false;
    $scope.d = false;
    $scope.sp = false;
    $scope.p = false;
    $scope.sh = false;
/********************     Gameplay Helper Functions     ********************/
    function checkBlackjack() {
        var i;
        if (BlackjackService.weight($scope.dealer) === 21) {
            for (i = 0; i < hands.length; i += 1) {
                if (BlackjackService.weight(hands[i]) !== 21) {
                    $storage.sub($scope.bet[i], i);
                }
            }
            // End game, dont call eval
            $scope.st = false;
        }
    }
    // Dealer hits on 16 or less and soft 17
    function playDealer() {
        var n = BlackjackService.weight($scope.dealer);
        while ((n < 17) || (n === 17 && BlackjackService.soft)) {
            $scope.dealer.push($deck.deal(1)[0]);
            n = BlackjackService.weight($scope.dealer);
            //console.log(n);
        }
    }
    // AI: https://www.blackjackinfo.com/blackjack-basic-strategy-engine/
    function playBot() {
        var x = hands[turn][0].rank,
            y = hands[turn][1].rank,
            n = BlackjackService.weight(hands[turn]),
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
            } else if (n < 20 && BlackjackService.soft) {
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
                    console.log("AI " + turn + " Error: n " + n + ", d " + d + ", s " + BlackjackService.soft);
                    return;
                }
            } else if (n < 17 && !BlackjackService.soft) {
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
                    console.log("AI " + turn + " Error: n " + n + ", d " + d + ", s " + BlackjackService.soft);
                    return;
                }
            } else {
                //console.log("AI " + turn + ": n " + n + ", d " + d + ", s " + BlackjackService.soft);
                return;
            }
            n = BlackjackService.weight(hands[turn]);
            x = 0;
            y = 1;
        }
        //console.log("bust");
        return;
    }
    // check 21, then win, then draw, then lose
    function payout(s, d) {
        var temp, dealer = BlackjackService.weight($scope.dealer);
        temp = BlackjackService.weight(hands[s]);
        if (temp === 21 && hands[s].length === 2) {
            $storage.add(1.5 * $scope.bet[s], d);
        } else if ((temp > dealer || dealer > 21) && temp < 22) {
            $storage.add($scope.bet[s], d);
        } else if (temp === dealer) {
            console.log("draw");
        } else {
            $storage.sub($scope.bet[s], d);
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
    // change ui from bets to play
    function resetVars() {
        var x, y;
        if (turn >= (humans + $scope.ai) || BlackjackService.weight(hands[turn]) === 21) {
            $scope.h = $scope.d = $scope.sp = false;
            return;
        }
        x = hands[turn][0].rank;
        y = hands[turn][1].rank;
        // clear flags set earlier
        $scope.h = $scope.d = true;
        // check for split and show button if yes
        if (x === y || ((x >= 10 && x <= 13) && (y >= 10 && y <= 13))) {
            $scope.sp = true;
        }
    }
/********************     Gameplay Functions     ********************/
    // modify bet
    $scope.setBet = function (n, p) {
        $scope.bet[p] += parseInt(n, 10);
        if ($scope.bet[p] < 5) {
            $scope.bet[p] = 5;
        } else if ($scope.bet[p] > 100) {
            $scope.bet[p] = 100;
        }
    };
    // transition from bets to play
    $scope.showHand = function () {
        $scope.p = $scope.sh = false;
        $scope.hands = [hands[turn]];
        resetVars();
        checkBlackjack();
    };
    // player gets an extra card, forced to stay on x >= 21
    $scope.hit = function () {
        //console.log("hit");
        hands[turn].push($deck.deal(1)[0]);
        // cannot hit on 21 or over
        if (BlackjackService.weight(hands[turn]) >= 21) {
            $scope.h = false;
        }
        // hide double and split
        $scope.d = $scope.sp = false;
    };
    // switches to the next players turn
    $scope.stay = function () {
        var i;
        BlackjackService.soft = false;
        turn += 1;
        resetVars();
        if (splited) {
            splited -= 1;
        } else {
            $scope.hands = [hands[turn]];
            $scope.turn += 1;
        }
        // check for ai turn then play ai
        if (turn >= humans) {
            if (turn < (humans + $scope.ai)) {
                for (i = turn; i < (humans + $scope.ai); i += 1) {
                    playBot();
                    BlackjackService.soft = false;
                    //console.log("AI " + turn + " stays");
                    turn += 1;
                }
            }
            $scope.h = $scope.d = $scope.sp = false;
            $scope.hands = hands;
            playDealer();
            evaluate();
        }
    };
    // takes 1 hand of doubles, and turns it into 2 hands, duplicates bet
    $scope.split = function () {
        // track the hand number that will need to be removed
        splits.push(turn + 1);
        // insert hands and position holders in bet and names
        splited += 1;
        hands.splice(turn + 1, 0, [hands[turn].pop(), $deck.deal(1)[0]]);
        hands[turn].push($deck.deal(1)[0]);
        $scope.hands.push(hands[turn + 1]);
        $scope.bet.splice(turn + 1, 0, $scope.bet[turn]);
        $scope.sp = false;
        resetVars();
        // add room in turn order for extra hand
        if (turn < humans) {
            humans += 1;
            // cannot hit after splitting aces
            if (hands[turn][0].rank === 14) {
                $scope.h = $scope.d = false;
                turn += 2;
                return;
            }
        } else {
            $scope.ai += 1;
            //console.log("ai split");
        }
    };
    // double bet and get only 1 card
    $scope.double = function () {
        //console.log("double");
        $scope.bet[turn] += $scope.bet[turn];
        hands[turn].push($deck.deal(1)[0]);
        $scope.h = $scope.d = $scope.sp = false;
    };
    // new game
    $scope.newGame = function () {
        var i;
        turn = 0;
        $scope.turn = 0;
        $scope.bet = [5, 5, 5, 5, 5, 5];
        $scope.updateAI(tracker);
        $deck.shuffle();
        hands = [];
        for (i = 0; i < (humans + $scope.ai); i += 1) {
            hands[i] = $deck.deal(2);
            hands[i].sort($deck.rankSort);
        }
        $scope.dealer = $deck.deal(2);
        $scope.hands = hands;
        // start the game
        BlackjackService.soft = $scope.h = $scope.d = $scope.sp = false;
        $scope.st = $scope.p = $scope.sh = true;
    };
    /* To do list:
    // if split aces is bj, its not bj, check for this?
    // fix player hand representations after splits in end view
    // have a way to display winners and losers and net gains/losses
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