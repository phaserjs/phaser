/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Layer = require('../layer/Layer');
var Render = require('./LightLayerRender');

/**
 * @classdesc
 *
 * @class LightLayer
 * @extends Phaser.GameObjects.Layer
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to this Layer.
 */
var LightLayer = new Class({

    Extends: Layer,

    Mixins: [
        Render
    ],

    initialize:

    function LightLayer (scene, children)
    {
        Layer.call(this, scene, children);
    }

});

module.exports = LightLayer;
