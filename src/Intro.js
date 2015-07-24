/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'Phaser'], function (exports, Phaser) {
            factory((root.commonJsStrictGlobal = exports), Phaser);
        });
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('Phaser'));
    } else {
        // Browser globals
        factory((root.commonJsStrictGlobal = {}), root.Phaser);
    }
}(this, function (exports, Phaser) {
    