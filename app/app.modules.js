/*global angular, window, console*/

var app = angular.module('myApp', ['ngRoute'])
        .factory('$deck', function () {
            'use strict';
            var deck = window.cards,
                itr = 0;
            return {
                // randomize order of the cards
                shuffle: function () {
                    deck = window.cards;
                    itr = 0;
                    var n = 100, i, j, k, temp;
                    for (i = 0; i < n; i += 1) {
                        j = Math.floor(Math.random() * 52) + 1;
                        k = Math.floor(Math.random() * 52) + 1;
                        if (j > 51) { j = 51; }
                        if (k > 51) { k = 51; }
                        temp = deck[j];
                        deck[j] = deck[k];
                        deck[k] = temp;
                    }
                    return;
                },
                // return an array of a specified length
                deal: function (num) {
                    if ((num + itr) > 52) {
                        console.log("Not Enough Cards Left");
                        return;
                    }
                    var i, value = [];
                    for (i = itr; i < itr + num; i += 1) {
                        value[(i - itr)] = deck[i];
                    }
                    itr += num;
                    return value;
                },
                // sort cards by rank
                rankSort: function (a, b) {
                    return a.rank - b.rank;
                }/*,
                // sort cards by suit
                suitSort: function (a, b) {
                    var ta, tb;
                    switch (a.suit) {
                    case "♦":
                        ta = 0;
                        break;
                    case "♣":
                        ta = 1;
                        break;
                    case "♥":
                        ta = 2;
                        break;
                    case "♠":
                        ta = 3;
                        break;
                    default:
                        ta = 0;
                        console.log("Error! Suit is " + a.suit);
                    }
                    switch (b.suit) {
                    case "♦":
                        tb = 0;
                        break;
                    case "♣":
                        tb = 1;
                        break;
                    case "♥":
                        tb = 2;
                        break;
                    case "♠":
                        tb = 3;
                        break;
                    default:
                        tb = 0;
                        console.log("Error! Suit is " + b.suit);
                    }
                    return ta - tb;
                },
                // old function, now done every time the deck is shuffled
                reset: function () {
                    itr = 0;
                    deck = window.cards;
                }*/
            };
        })
        .factory('$localstorage', ['$window', function ($window) {
            'use strict';
            return {
                set: function (key, value) {
                    $window.localStorage[key] = value;
                },
                get: function (key, defaultValue) {
                    return $window.localStorage[key] || defaultValue;
                },
                putObject: function (key, value) {
                    $window.localStorage[key] = JSON.stringify(value);
                },
                getObject: function (key) {
                    return JSON.parse($window.localStorage[key] || '{}');
                },
                remove: function (key) {
                    $window.localStorage.removeItem(key);
                }
            };
        }])
        .factory('$storage', ['$localstorage', function ($localstorage) {
            'use strict';
            var savings = $localstorage.getObject('savings'),
                names = $localstorage.getObject('names');
            // if no game data, fill with default
            if (savings === '{}') {
                savings = [100, 100, 100, 100, 100, 100];
            } else if (names === '{}') {
                names = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6"];
            }
            return {
                savings: savings,
                names: names,
                add: function (n, p) {
                    this.savings[p] += parseInt(n, 10);
                    $localstorage.putObject('savings', this.savings);
                },
                sub: function (n, p) {
                    this.savings[p] -= parseInt(n, 10);
                    $localstorage.putObject('savings', this.savings);
                },
                name: function (n, p) {
                    this.names[p] = n;
                    $localstorage.putObject('names', this.names);
                },
                resetSavings: function () {
                    this.savings = [100, 100, 100, 100, 100, 100];
                    $localstorage.remove('savings');
                },
                resetNames: function () {
                    this.names = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6"];
                    $localstorage.remove('names');
                },
                reset: function () {
                    this.savings = [100, 100, 100, 100, 100, 100];
                    this.names = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6"];
                    $localstorage.remove('savings');
                    $localstorage.remove('names');
                }
            };
        }]);