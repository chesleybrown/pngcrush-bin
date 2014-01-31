'use strict';

var assert = require('assert');
var execFile = require('child_process').execFile;
var fs = require('fs');
var path = require('path');

describe('pngcrush()', function () {
  after(function () {
    fs.unlinkSync('test/minified.png');
  });

  it('should return path to pngcrush binary', function (cb) {
    var binPath = require('../lib/pngcrush').path;

    execFile(binPath, ['-v', '-'], function (err, stdout, stderr) {
      assert(stderr.toString().indexOf('pngcrush') !== -1);
      cb();
    });
  });

  it('should successfully proxy pngcrush', function (cb) {
    var binPath = path.join(__dirname, '../bin/pngcrush.js');

    execFile('node', [binPath, '-v', '-'], function (err, stdout, stderr) {
      assert(stderr.toString().indexOf('pngcrush') !== -1);
      cb();
    });
  });

  it('should minify a .png', function (cb) {
    var binPath = path.join(__dirname, '../bin/pngcrush.js');
    var args = [
      '-rem alla',
      '-brute',
      '-reduce',
      path.join(__dirname, 'fixtures', 'test.png'),
      path.join(__dirname, 'fixtures', 'minified.png')
    ];

    execFile('node', [binPath].concat(args), function () {
      var actual = fs.statSync('test/fixtures/minified.png').size;
      var original = fs.statSync('test/fixtures/test.png').size;

      assert(actual < original);
      cb();
    });
  });
});