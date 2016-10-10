/*global $, app */

app.controller('DealController', ['$scope', 'DealService', '$log', function ($scope, $DS, $log) {
    "use strict";
    
    var i, turn, sum, cases, board = $DS.board();
    $scope.board = [];
    $scope.caseClass = [];
    $scope.valClass = [];
    $scope.counter = 0;
    $scope.offer = 0;
    
    $scope.newGame = function () {
        $DS.newGame();
        for (i = 0; i < board.length; i += 1) {
            $scope.board[i] = board[i].sCase;
            $scope.caseClass[i] = '';
            $scope.valClass[i] = 'btn-warning';
        }
        turn = 1;
        sum = 3418418;
        cases = 26;
        $scope.counter = 6;
        $scope.offer = (sum / cases) * (turn / 10);
        
        return;
    };
    $scope.newGame();
    
    $scope.caseSelect = function (x) {
        if ($scope.counter === 0) {
            return;
        }
        var t, n = $DS.openCase(x),
            vals = [1, 2, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000];
        $scope.board[x] = n;
        $scope.caseClass[x] = 'btn-danger';
        
        t = vals.indexOf(n);
        $scope.valClass[t] = 'btn-danger';
        $scope.counter -= 1;
        sum -= n;
        cases -= 1;
        $scope.offer = (sum / cases) * (turn / 10);
        
        return;
    };
    
    $scope.deal = function () {
        $scope.newGame();
        return;
    };
    
    $scope.noDeal = function () {
        turn += 1;
        $scope.offer = (sum / cases) * (turn / 10);
        if (turn > 6) {
            $scope.counter = 1;
        } else {
            $scope.counter = 7 - turn;
        }
        return;
    };
}]);