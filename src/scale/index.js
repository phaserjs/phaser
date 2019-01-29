/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Extend = require('../utils/object/Extend');
var ScaleModes = require('./const');

/**
 * @namespace Phaser.Scale
 */

var Scale = {

    ScaleManager: require('./ScaleManager')

};

Scale = Extend(false, Scale, ScaleModes);

module.exports = Scale;
