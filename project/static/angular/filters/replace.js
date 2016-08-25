'use strict'

angular.module('flaskAngular').filter('replace', function() {
  return function(input, stringReplaced, stringReplacing) {
    if (input){
        return input.replace(stringReplaced,stringReplacing,"g");
    } else {
        return input;
    }
  };
});
