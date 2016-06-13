'use strict';

var through = require('through2'),
  _ = require('underscore-node');

function hoist(input, moduleName) {
  var res = input,
    pieces = res.split('(function () {'),
    defPiece,
    defIndex,
    buffer;

  moduleName = moduleName || 'ute-ui';

  defPiece =_.find(pieces, function (piece, index) {
    if (piece.indexOf('angular.module(\'' + moduleName + '\', [') >= 0) {
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

  buffer = new Buffer(res.length + 3);

  buffer.write(res, "utf-8");

  return buffer;
}

module.exports = function(moduleName) {
  console.error('hoisting module definition... ' + moduleName);

  /**
   * buffer each content
   * @param stream
   * @param enc
   * @param callback
   */
  var bufferedContents = function (stream, enc, callback) {

    if (stream.isBuffer()) {
      //console.log(file.contents.toString());
      stream.contents = hoist(stream.contents.toString(), moduleName);
    }
    callback(null, stream);
  };

  /**
   * returns streamed content
   */
  return through.obj(bufferedContents);

};