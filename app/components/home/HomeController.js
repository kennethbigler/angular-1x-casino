/*global $, console, app, $scope, $location*/

app.controller('HomeController', ['$scope', '$location', '$money', function ($scope, $location, $money) {
    "use strict";
    
    // get global money
    $scope.money = $money;
    
    // set a tab as the active tab
    $scope.getClass = function (path) {
        if ($location.path() === path) {
            return 'active';
        } else { return ''; }
    };
    
    // close the navigation
    $scope.closeNav = function () { $("#navbar").collapse('hide'); };
}]);