/*global app*/

app.config(function ($routeProvider) {
    "use strict";
    $routeProvider
        .when('/', {
            templateUrl: 'app/components/home/home.html'
        }).when('/poker', {
            templateUrl: 'app/components/poker/poker.html',
            controller: 'PokerController'
        }).when('/solitaire', {
            templateUrl: 'app/components/solitaire/solitaire.html',
            controller: 'SolitaireController'
        }).otherwise({ redirectTo: '/' });
    // use the HTML5 History API
    // $locationProvider.html5Mode(true);
});