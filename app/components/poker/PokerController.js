/*global $, console, app, $scope */

app.controller('PokerController', ['$scope', '$deck', '$storage', 'PokerService', function ($scope, $deck, $storage, PokerService) {
    "use strict";
    
    /******************************     Prep Data and Variables     ******************************/
    var humans = 1;
    $scope.trash = [];
    $scope.ai = 4;
    $scope.turn = 0;
    $scope.df = false;
    $scope.nf = false;
    $scope.sf = false;
    $scope.tf = false;
    $scope.dropped = ["", "", "", "", ""];
    
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
        PokerService.discard($scope.trash, $scope.turn);
        $scope.dropped = ["", "", "", "", ""];
        $scope.trash = [];
        $scope.df = true;
        //print(PokerService.hands[$scope.turn]);
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
                temp = PokerService.evaluate(PokerService.hands[i]);
                console.log(temp);
                temp = parseInt(temp, 13);
                if (temp > max) {
                    max = temp;
                    player = i;
                }
            }
            for (i = 0; i < $scope.ai; i += 1) {
                temp = PokerService.computer(PokerService.hands[i + humans], $scope.turn);
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
            $scope.hand = PokerService.hands[player];
            $scope.hands = PokerService.hands;
            if (player === 0) {
                $storage.add(40, 0);
                //variable bets
            } else {
                $storage.sub(10, 0);
                //variable bets
            }
        } else {
            $scope.df = false;
            $scope.hand = PokerService.hands[$scope.turn];
        }
        $scope.tf = true;
        $scope.dropped = ["", "", "", "", ""];
        $scope.trash = [];
    };
    
    // shuffle the deck and re-distribute PokerService.hands
    $scope.newGame = function () {
        var i;
        $scope.turn = 0;
        $deck.shuffle();
        for (i = 0; i < (humans + $scope.ai); i += 1) {
            PokerService.hands[i] = $deck.deal(5);
            PokerService.hands[i].sort($deck.rankSort);
        }
        $scope.df = false;
        $scope.nf = false;
        $scope.sf = false;
        $scope.tf = false;
        $scope.dropped = ["", "", "", "", ""];
        $scope.trash = [];
        $scope.hands = [];
        $scope.hand = PokerService.hands[$scope.turn];
    };
    
    /******************************     Testing     ******************************/
    $scope.newGame();
}]);