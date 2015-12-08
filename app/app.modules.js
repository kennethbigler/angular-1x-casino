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
                        j = Math.round(Math.random() * 51);
                        k = Math.round(Math.random() * 51);
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
        });