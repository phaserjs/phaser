/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Extend = require('../utils/object/Extend');
var ScaleModes = require('./const');

/**
 * @namespace Phaser.DOM
 */

var Dom = {

    AddToDOM: require('./AddToDOM'),
    DOMContentLoaded: require('./DOMContentLoaded'),
    GetScreenOrientation: require('./GetScreenOrientation'),
    ParseXML: require('./ParseXML'),
    RemoveFromDOM: require('./RemoveFromDOM'),
    RequestAnimationFrame: require('./RequestAnimationFrame'),
    ScaleManager: require('./ScaleManager'),

    ScaleModes: ScaleModes

};

Dom = Extend(false, Dom, ScaleModes);

module.exports = Dom;
