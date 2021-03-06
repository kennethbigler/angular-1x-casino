/*jslint continue:true*/
/*global $, app */
/* Theoretical Max Score:   386 everyone splits 3 times and busts with 30, dealer bust with 26
 * Card Point Value:        340-380 */

app.controller('BlackjackController', ['$scope', 'BlackjackService', '$log', function ($scope, $BS, $log) {
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
    $scope.winners = [];
    $scope.dealer = [];
    $scope.bet = [];
    // display flags
    $scope.stayf = false;
    $scope.hitf = false;
    $scope.doublef = false;
    $scope.splitf = false;
    $scope.prePlayf = false;
    
/********************     Gameplay Helper Functions     ********************/
    function checkBlackjack() {
        var i;
        if ($BS.weight($scope.dealer) === 21) {
            for (i = 0; i < hands.length; i += 1) {
                if ($BS.weight(hands[i]) !== 21) {
                    $BS.sub($scope.bet[i], i);
                    $scope.winners.push("Loser :(");
                } else {
                    $scope.winners.push("Push :/");
                }
            }
            // End game, dont call eval
            $scope.hands = hands;
            $scope.hitf = $scope.doublef = $scope.splitf = $scope.stayf = false;
        }
        return;
    }
    // Dealer hits on 16 or less and soft 17
    function playDealer() {
        var n = $BS.weight($scope.dealer);
        while ((n < 17) || (n === 17 && $BS.soft)) {
            $scope.dealer.push($BS.deal(1)[0]);
            n = $BS.weight($scope.dealer);
        }
        return;
    }
    // AI: https://www.blackjackinfo.com/blackjack-basic-strategy-engine/
    function playBot() {
        var x = hands[turn][0].rank,
            y = hands[turn][1].rank,
            n = $BS.weight(hands[turn]),
            d = $scope.dealer[0].rank;
        while (n < 22) {
            // split algorithm
            if (x === y) {
                if (x === 2 || x === 3 || x === 7) { // 2,3,7, split d2-7, hit d8+
                    if (d <= 7) {
                        $scope.split();
                    } else {
                        $scope.hit();
                    }
                } else if (x === 4) { // 4, split d5-6, else hit
                    if (d === 5 || d === 6) {
                        $scope.split();
                    } else {
                        $scope.hit();
                    }
                } else if (x === 5) { // 5, double d2-9, hit d10+
                    if (d <= 9) {
                        $scope.double();
                    } else {
                        $scope.hit();
                    }
                } else if (x === 6) { // 6, split d2-6, else hit
                    if (d <= 6) {
                        $scope.split();
                    } else {
                        $scope.hit();
                    }
                } else if (x === 9) { // 9, d7,10+ stay, else split
                    if (d === 7 || d >= 10) {
                        return;
                    } else {
                        $scope.split();
                    }
                } else if (x === 8 || x === 14) { // 8,A split
                    $scope.split();
                } else { // 10 Stay
                    return;
                }
            } else if (n < 20 && $BS.soft) { // soft hands, A9+ stays
                if (n === 13 || n === 14) { // A2-A3 double d5-6, hit d2-4, d7-A
                    if (d === 5 || d === 6) {
                        $scope.double();
                        return;
                    } else {
                        $scope.hit();
                    }
                } else if (n === 15 || n === 16) { // A4-A5 double d4-6, hit d2-3, d7-A
                    if (d >= 4 && d <= 6) {
                        $scope.double();
                        return;
                    } else {
                        $scope.hit();
                    }
                } else if (n === 17) { // A6 double d3-6, hit d2, d7-A
                    if (d >= 3 && d <= 6) {
                        $scope.double();
                        return;
                    } else {
                        $scope.hit();
                    }
                } else if (n === 18) { // A7 double d2-6, stay d7-8, hit d9-A
                    if (n >= 2 && n <= 6) {
                        $scope.double();
                        return;
                    } else if (n === 7 || n === 8) {
                        return;
                    } else {
                        $scope.hit();
                    }
                } else if (n === 19) { // A8 double d6, else stay
                    if (d === 6) {
                        $scope.double();
                        return;
                    } else {
                        return;
                    }
                } else {
                    $log.error("AI " + turn + " Error: n " + n + ", d " + d + ", s " + $BS.soft);
                    return;
                }
            } else if (n < 17 && !$BS.soft) { // hard hands, 17+ stays
                if (n >= 5 && n <= 8) { // 5-8 hit
                    $scope.hit();
                } else if (n === 9) { // 9 double d3-6, hit d2, d7-A
                    if (d >= 3 && d <= 6) {
                        $scope.double();
                        return;
                    } else {
                        $scope.hit();
                    }
                } else if (n === 10) { // 10 double d2-9, hit d10-A
                    if (d >= 2 && d <= 9) {
                        $scope.double();
                        return;
                    } else {
                        $scope.hit();
                    }
                } else if (n === 11) { // 11 double
                    $scope.double();
                    return;
                } else if (n === 12) { // 12 hit d2-3, stay d4-6, hit 7-A
                    if (d >= 4 && d <= 6) {
                        return;
                    } else {
                        $scope.hit();
                    }
                } else if (n >= 13 && n <= 16) { // 13-16 stay d2-6, hit 7-A
                    if (d >= 2 && d <= 6) {
                        return;
                    } else {
                        $scope.hit();
                    }
                } else {
                    $log.error("AI " + turn + " Error: n " + n + ", d " + d + ", s " + $BS.soft);
                    return;
                }
            } else {
                //$log.log("AI " + turn + ": n " + n + ", d " + d + ", s " + $BS.soft);
                return;
            }
            n = $BS.weight(hands[turn]);
            x = 0;
            y = 1;
        }
        //$log.log("bust");
        return;
    }
    // check 21, then win, then draw, then lose
    function payout(s, d) {
        var temp, dealer = $BS.weight($scope.dealer);
        temp = $BS.weight(hands[s]);
        if (temp === 21 && hands[s].length === 2) {
            $BS.add(1.5 * $scope.bet[s], d);
            $scope.winners.push("BlackJack :D");
        } else if ((temp > dealer || dealer > 21) && temp < 22) {
            $BS.add($scope.bet[s], d);
            $scope.winners.push("Winner :)");
        } else if (temp === dealer) {
            $scope.winners.push("Push :/");
        } else {
            $BS.sub($scope.bet[s], d);
            $scope.winners.push("Loser :(");
        }
        return;
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
            //hands[i].push(53);
            //hands[i].concat(hands[i - temp]);
            //hands[i].splice((i - temp), 1);
        }
        $scope.stayf = false;
        return;
    }
    // change ui from bets to play
    function resetVars() {
        var x, y;
        if (turn >= (humans + $scope.ai) || $BS.weight(hands[turn]) === 21) {
            $scope.hitf = $scope.doublef = $scope.splitf = false;
            return;
        }
        x = hands[turn][0].rank;
        y = hands[turn][1].rank;
        // clear flags set earlier
        $scope.hitf = $scope.doublef = true;
        // check for split and show button if yes
        if (x === y || ((x >= 10 && x <= 13) && (y >= 10 && y <= 13))) {
            $scope.splitf = true;
        }
        return;
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
        return;
    };
    // transition from bets to play
    $scope.showHand = function () {
        $scope.prePlayf = false;
        $scope.hands = [hands[turn]];
        resetVars();
        checkBlackjack();
        return;
    };
    // player gets an extra card, forced to stay on x >= 21
    $scope.hit = function () {
        hands[turn].push($BS.deal(1)[0]);
        // cannot hit on 21 or over
        if ($BS.weight(hands[turn]) >= 21) {
            $scope.hitf = false;
        }
        // hide double and split
        $scope.doublef = $scope.splitf = false;
        return;
    };
    // switches to the next players turn
    $scope.stay = function () {
        var i;
        $BS.soft = false;
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
                    $BS.soft = false;
                    //$log.log("AI " + turn + " stays");
                    turn += 1;
                }
            }
            $scope.hitf = $scope.doublef = $scope.splitf = false;
            $scope.hands = hands;
            playDealer();
            evaluate();
        }
        return;
    };
    // takes 1 hand of doubles, and turns it into 2 hands, duplicates bet
    $scope.split = function () {
        // track the hand number that will need to be removed
        splits.push(turn + 1);
        // insert hands and position holders in bet and names
        splited += 1;
        hands.splice(turn + 1, 0, [hands[turn].pop(), $BS.deal(1)[0]]);
        hands[turn].push($BS.deal(1)[0]);
        $scope.hands.push(hands[turn + 1]);
        $scope.bet.splice(turn + 1, 0, $scope.bet[turn]);
        $scope.splitf = false;
        resetVars();
        // add room in turn order for extra hand
        if (turn < humans) {
            humans += 1;
            // cannot hit after splitting aces
            if (hands[turn][0].rank === 14) {
                $scope.hitf = $scope.doublef = false;
                turn += 2;
            }
        } else {
            $scope.ai += 1;
            //$log.log("ai split");
        }
        return;
    };
    // double bet and get only 1 card
    $scope.double = function () {
        $scope.bet[turn] += $scope.bet[turn];
        hands[turn].push($BS.deal(1)[0]);
        $scope.hitf = $scope.doublef = $scope.splitf = false;
        return;
    };
    // new game
    $scope.newGame = function () {
        var i;
        turn = 0;
        $scope.turn = 0;
        $scope.winners = [];
        $scope.bet = [5, 5, 5, 5, 5, 5];
        $scope.updateAI(tracker);
        $BS.shuffle();
        hands = [];
        for (i = 0; i < (humans + $scope.ai); i += 1) {
            hands[i] = $BS.deal(2);
            hands[i].sort($BS.rankSort);
        }
        $scope.dealer = $BS.deal(2);
        $scope.hands = hands;
        // start the game
        $BS.soft = $scope.hitf = $scope.doublef = $scope.splitf = false;
        $scope.stayf = $scope.prePlayf = true;
        return;
    };
    /* To do list:
    // if split aces is bj, its not bj, check for this?
    // fix player hand representations after splits in end view
    // change to dealer bj always wins -> buy insurance on A?
    */
/********************     UI Functions     ********************/
    // update ai and human players
    $scope.updateAI = function (n) {
        humans = n;
        tracker = n;
        $scope.ai = 6 - n;
        $('.btn-danger').removeClass('btn-danger');
        $('#b' + n).addClass('btn-danger');
        return;
    };
/********************     Testing Code     ********************/
    $scope.newGame();
}]);