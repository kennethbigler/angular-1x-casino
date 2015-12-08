/*global $, console, app, $scope, $location*/

app.controller('HomeController', function ($scope, $deck, $location) {
    "use strict";
    
    // set a $ amount
    $scope.money = 10000;
    $scope.myBet = 5;
    
    $scope.bet = function (win, odds) {
        if (win) {
            $scope.money += (odds * $scope.myBet);
        } else {
            $scope.money -= $scope.myBet;
        }
    };
    
    // set a tab as the active tab
    $scope.getClass = function (path) {
        if ($location.path() === path) {
            return 'active';
        } else { return ''; }
    };
    
    // close the navigation
    $scope.closeNav = function () { $("#navbar").collapse('hide'); };
});