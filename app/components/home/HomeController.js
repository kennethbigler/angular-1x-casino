/*global $, app*/

app.controller('HomeController', ['$scope', '$location', '$storage', function ($scope, $location, $storage) {
    "use strict";
    
    $scope.names = $storage.getNames();
    $scope.savings = $storage.getSavings();
    
    // get global money
    $scope.reset = function () {
        $storage.reset();
        $scope.names = $storage.getNames();
    };
    
    $scope.updateNames = function () {
        var i = 0;
        for (i = 0; i < $scope.names.length; i += 1) {
            $storage.name($scope.names[i], i);
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
}]);