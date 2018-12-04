const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

//readCounter is called in getNextUniqueID with the callback 
//that we defined in it
const readCounter = (callback) => {
  //exports.counterFile = filepath
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      //turns fileData text into a number which becomes our ID
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      //runs the callback that we passed into writeCounter
      //i.e - callback that we created in getNextUniqueId
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

//getNextUniqueID is called from index.js with a callback (***TBD)
// Invoked due to user action for create, i.e. clicking on "add button"
exports.getNextUniqueId = (callback) => {
  //we call readCounter and define our own callback which needs to take in err and our fileData(id)
  readCounter(function(err, id) { 
    //if err, do nothing 
      // (this will never error out 
        // --will always be null as defined above if an error)
    if (err) {
      //console.log(err);
        //will pass error back up to the user
      callback(err);
    } else {
      //update our id(which was turned into a number in readCounter)
      var updatedID = id + 1;
      //invoke writeCounter with the updatedID
      //and the callback that is passed into this function 
      //(which was defined in index.js when this function was invoked)
        //define our own callback below to pass into writeCounter
      writeCounter(updatedID, function(err, counter) {
        if (err) {
          callback(err);
        } else {
          callback(null, counter);
        }
      });
    }
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
