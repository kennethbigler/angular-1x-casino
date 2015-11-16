/*global $, console, app, $scope, $location*/

app.controller('HomeController', function ($scope, $deck, $location) {
    "use strict";
    $scope.getClass = function (path) {
        if ($location.path() === path) {
            return 'active';
        } else { return ''; }
    };
});