/*global angular, window, console*/

var app = angular.module('myApp', ['ngRoute'])
        .factory('$deck', function () {
            'use strict';
            var deck = window.cards,
                itr = 0;
            return {
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
                reset: function () {
                    itr = 0;
                    deck = window.cards;
                },
                isred: function (card) {
                    return (card.suit === "♦" || card.suit === "♥");
                },
                isblack: function (card) {
                    return (card.suit === "♣" || card.suit === "♠");
                }
            };
        });