/*global $, app*/

app.controller('HomeController', ['$scope', '$location', '$storage', function ($scope, $location, $storage) {
    "use strict";
    
    // get global money
    $scope.storage = $storage;
    
    // set a tab as the active tab
    $scope.getClass = function (path) {
        if ($location.path() === path) {
            return 'active';
        } else { return ''; }
    };
    
    // close the navigation
    $scope.closeNav = function () { $("#navbar").collapse('hide'); };
}]);