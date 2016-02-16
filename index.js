'use strict';

var BufferStreams = require("bufferstreams"),
  through = require('through2'),
  _ = require('underscore-node');

function transform(input) {
  var res = input,
    pieces = res.split('(function () {'),
    defPiece,
    defIndex,
    buffer;

    defPiece =_.find(pieces, function (piece, index) {
      if (piece.indexOf('angular.module(\'ute.ui\', [') >= 0) {
        defIndex = index;
        return true;
      };
    });

    if (defIndex !== 1) {
      console.log('ute-ui module definition is not on the most top, correct it!');
      // if the module definition is not on the top
      pieces[defIndex] = pieces[1];
      pieces[1] = defPiece;
    }


  res = pieces.join('(function () {');

  var buffer = new Buffer(res.length);

  buffer.write(res, "utf-8");

  return buffer;
}

module.exports = function(stream) {
  console.error('hoisting module definition...');

  /**
   * buffer each content
   * @param file
   * @param enc
   * @param callback
   */
  var bufferedContents = function (file, enc, callback) {

    if (file.isBuffer()) {
      //console.log(file.contents.toString());
      file.contents = transform(file.contents.toString());
    }

    //if (file.isStream()) {
    //
    //  this.emit('error', new gutil.PluginError('gulp-ng-module-renamer', 'Streams are not supported!'));
    //  callback();
    //
    //} else if (file.isNull()) {
    //
    //  callback(null, file); // Do nothing if no contents
    //
    //} else {
    //
    //  var ctx = file.contents.toString('utf8'),
    //    modulesString = reNameModules(ctx);
    //
    //  file.contents = new Buffer(modulesString);
    //  callback(null, file);
    //
    //}

    //this.push(file);
    //done();

    callback(null, file); // Do nothing if no contents
  };

  /**
   * returns streamed content
   */
  return through.obj(bufferedContents);


};