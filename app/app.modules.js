/*global angular*/

var app = angular.module('myApp', ['ngRoute'])
        .factory('$deck', ['$window', '$log', function ($window, $log) {
            'use strict';
            var deck = $window.cards,
                itr = 0;
            return {
                // randomize order of the cards
                shuffle: function () {
                    deck = $window.cards;
                    itr = 0;
                    var n = 100, i, j, k, temp;
                    for (i = 0; i < n; i += 1) {
                        j = Math.floor(Math.random() * 52);
                        k = Math.floor(Math.random() * 52);
                        // swap
                        temp = deck[j];
                        deck[j] = deck[k];
                        deck[k] = temp;
                    }
                    return;
                },
                // return an array of a specified length
                deal: function (num) {
                    if ((num + itr) > 52) {
                        $log.error("Not Enough Cards Left");
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
                },
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
                        $log.error("Error! Suit is " + a.suit);
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
                        $log.error("Error! Suit is " + b.suit);
                    }
                    return ta - tb;
                }
            };
        }])
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
            if (Object.keys(savings).length === 0) {
                savings = [100, 100, 100, 100, 100, 100];
            }
            if (Object.keys(names).length === 0) {
                names = ["Player 1", "AI 2", "AI 3", "AI 4", "AI 5", "AI 6"];
            }
            return {
                getSavings: function () {
                    return savings;
                },
                getNames: function () {
                    return names;
                },
                add: function (n, p) {
                    savings[p] += parseInt(n, 10);
                    $localstorage.putObject('savings', savings);
                },
                sub: function (n, p) {
                    savings[p] -= parseInt(n, 10);
                    $localstorage.putObject('savings', savings);
                },
                name: function (n, p) {
                    names[p] = n;
                    $localstorage.putObject('names', names);
                },
                resetSavings: function () {
                    savings = [100, 100, 100, 100, 100, 100];
                    $localstorage.remove('savings');
                },
                resetNames: function () {
                    names = ["Player 1", "AI 2", "AI 3", "AI 4", "AI 5", "AI 6"];
                    $localstorage.remove('names');
                },
                reset: function () {
                    savings = [100, 100, 100, 100, 100, 100];
                    names = ["Player 1", "AI 2", "AI 3", "AI 4", "AI 5", "AI 6"];
                    $localstorage.remove('savings');
                    $localstorage.remove('names');
                },
                getRStats: function () {
                    var stats = $localstorage.getObject('rStats');
                    if (Object.keys(stats).length === 0) {
                        stats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    }
                    return stats;
                },
                postRStats: function (stats) {
                    $localstorage.putObject('rStats', stats);
                }
            };
        }]);