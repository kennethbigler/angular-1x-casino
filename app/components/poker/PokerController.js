/*global $, app */

app.controller('PokerController', ['$scope', '$deck', '$storage', 'PokerService', '$log', function ($scope, $deck, $storage, $PS, $log) {
    "use strict";
    
    /******************************     Prep Data and Variables     ******************************/
    var humans = 1;
    $scope.trash = [];
    $scope.ai = 4;
    $scope.turn = 0;
    $scope.discardf = false;
    $scope.nextf = false;
    $scope.showf = false;
    $scope.turnf = false;
    $scope.dropped = ["", "", "", "", ""];
    
    /******************************     View Functions     ******************************/
    // update ai and human players
    $scope.updateAI = function (n) {
        humans = n;
        $scope.ai = 5 - n;
        $('.btn-danger').removeClass('btn-danger');
        $('#b' + n).addClass('btn-danger');
    };
    
    // select cards to discard, visual function changing classes
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
        $PS.discard($scope.trash, $scope.turn);
        $scope.dropped = ["", "", "", "", ""];
        $scope.trash = [];
        $scope.discardf = true;
        //print($PS.hands[$scope.turn]);
    };
    
    // move to the next hand
    $scope.nextHand = function () {
        $scope.showf = false;
        $scope.turn += 1;
        if ($scope.turn === humans) {
            // to determine winner, decode w/ z = parseInt(result, 13);
            var i = 0,
                max = 0,
                player = 0,
                temp = 0;
            for (i = 0; i < humans; i += 1) {
                temp = $PS.evaluate($PS.hands[i]);
                $log.log(temp);
                temp = parseInt(temp, 13);
                if (temp > max) {
                    max = temp;
                    player = i;
                }
            }
            for (i = 0; i < $scope.ai; i += 1) {
                temp = $PS.computer($PS.hands[i + humans], $scope.turn);
                $scope.turn += 1;
                $log.log(temp);
                temp = parseInt(temp, 13);
                if (temp > max) {
                    max = temp;
                    player = i + humans;
                }
            }
            $scope.discardf = $scope.nextf = $scope.showf = true;
            $scope.turn = player;
            $scope.hand = $PS.hands[player];
            $scope.hands = $PS.hands;
            if (player === 0) {
                $storage.add(40, 0);
                //variable bets
            } else {
                $storage.sub(10, 0);
                //variable bets
            }
        } else {
            $scope.discardf = false;
            $scope.hand = $PS.hands[$scope.turn];
        }
        $scope.turnf = true;
        $scope.dropped = ["", "", "", "", ""];
        $scope.trash = [];
    };
    
    // shuffle the deck and re-distribute $PS.hands
    $scope.newGame = function () {
        var i;
        $scope.turn = 0;
        $deck.shuffle();
        for (i = 0; i < (humans + $scope.ai); i += 1) {
            $PS.hands[i] = $deck.deal(5);
            $PS.hands[i].sort($deck.rankSort);
        }
        $scope.discardf = $scope.nextf = $scope.showf = $scope.turnf = false;
        $scope.dropped = ["", "", "", "", ""];
        $scope.trash = [];
        $scope.hands = [];
        $scope.hand = $PS.hands[$scope.turn];
    };
    
    /******************************     Testing     ******************************/
    $scope.newGame();
}]);