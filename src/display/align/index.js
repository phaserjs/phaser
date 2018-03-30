/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');
var Extend = require('../../utils/object/Extend');

/**
 * @namespace Phaser.Display.Align
 */

var Align = {

    In: require('./in'),
    To: require('./to')

};

//   Merge in the consts
Align = Extend(false, Align, CONST);

module.exports = Align;
