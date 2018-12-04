const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // On ADD todo, we take the id (generated by counter.getNextUniqueId) and create a new 
  // file. The contents of the file is in var TEXT and the callback needs to 
  counter.getNextUniqueId(function(err, id) {
    if (err) {
      callback(err);
    } else {
      const filePath = path.join(exports.dataDir, id + '.txt');
      fs.writeFile(path.join(filePath), text, function(err) {
        // console.log(filePath);
        // console.log("file written");
        if (err) {
          callback(err);
        } else {
          // this call back sends the todo as a response from the server.
          callback(null, { id, text });
        }
      });
    }
  });
};
/*
[
         {
      -    "id": 0
      -    "text": "00001.txt"
      +    "id": "00001"
      +    "text": "00001"
         }
         {
      -    "id": 1
      -    "text": "00002.txt"
      +    "id": "00002"
      +    "text": "00002"
         }
       ]

*/

exports.readAll = (callback) => {
  var data = [];
  //iterate through files in data and build an array of objects that stores ids/texts
  fs.readdir(exports.dataDir, function(err, files) {
    if (err) {
      callback(err);
    } else {
      _.each(files, (text, id) => {
        id = text.split('.')[0];
        data.push({ id, text: id });
      });
      callback(null, data);
    }
  });
  return data;
};

exports.readOne = (id, callback) => {

  // We are trying to read the contents of ONE of our files.

  // Invoke the fs.readFile and pass in the filepath of the specific id
  fs.readFile(path.join(exports.dataDir, id + '.txt'), function(err, contents) {
    if (err) {
      callback(err);
    } else {
      callback(null, {id, text: contents.toString()});
    }
  });
  // On error, invoke the callback and pass the err as an argument
  // On successful read, invoke the callback

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
