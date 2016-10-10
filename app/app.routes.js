/*global app*/

app.config(function ($routeProvider) {
    "use strict";
    $routeProvider
        .when('/', {
            templateUrl: 'app/components/home/home.html'
        }).when('/blackjack', {
            templateUrl: 'app/components/blackjack/blackjack.html',
            controller: 'BlackjackController'
        }).when('/craps', {
            templateUrl: 'app/components/craps/craps.html',
            controller: 'CrapsController'
        }).when('/poker', {
            templateUrl: 'app/components/poker/poker.html',
            controller: 'PokerController'
        }).when('/roulette', {
            templateUrl: 'app/components/roulette/roulette.html',
            controller: 'RouletteController'
        }).when('/solitaire', {
            templateUrl: 'app/components/solitaire/solitaire.html',
            controller: 'SolitaireController'
        }).when('/bridge', {
            templateUrl: 'app/components/bridge/bridge.html',
            controller: 'BridgeController'
        }).when('/slots', {
            templateUrl: 'app/components/slots/slots.html',
            controller: 'SlotsController'
        }).when('/deal', {
            templateUrl: 'app/components/dealOrNoDeal/deal.html',
            controller: 'DealController'
        }).otherwise({ redirectTo: '/' });
    // use the HTML5 History API
    // $locationProvider.html5Mode(true);
});