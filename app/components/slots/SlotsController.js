/*global $, app */

app.controller('SlotsController', ['$scope', '$deck', 'SlotsService', '$log', function ($scope, $deck, SlotsService, $log) {
    "use strict";
    // place bets
    // roll dice
    // evaluate
    $scope.d1 = 0;
    $scope.d2 = 0;
    
    $scope.spin = function () {
        var d1 = Math.floor(Math.random() * 6) + 1,
            d2 = Math.floor(Math.random() * 6) + 1;
        $scope.d1 = d1;
        $scope.d2 = d2;
    };
    
    $scope.spin();
}]);