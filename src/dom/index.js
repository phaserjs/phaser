/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Extend = require('../utils/object/Extend');
var ScaleModes = require('./const');

/**
 * @namespace Phaser.DOM
 */

var Dom = {

    AddToDOM: require('./AddToDOM'),
    Calibrate: require('./Calibrate'),
    ClientHeight: require('./ClientHeight'),
    ClientWidth: require('./ClientWidth'),
    DocumentBounds: require('./DocumentBounds'),
    DOMContentLoaded: require('./DOMContentLoaded'),
    GetAspectRatio: require('./GetAspectRatio'),
    GetBounds: require('./GetBounds'),
    GetOffset: require('./GetOffset'),
    GetScreenOrientation: require('./GetScreenOrientation'),
    InLayoutViewport: require('./InLayoutViewport'),
    ParseXML: require('./ParseXML'),
    RemoveFromDOM: require('./RemoveFromDOM'),
    RequestAnimationFrame: require('./RequestAnimationFrame'),
    ScaleManager: require('./ScaleManager'),
    VisualBounds: require('./VisualBounds'),

    ScaleModes: ScaleModes

};

Dom = Extend(false, Dom, ScaleModes);

module.exports = Dom;
