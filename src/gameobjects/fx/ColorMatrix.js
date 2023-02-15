/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var BaseColorMatrix = require('../../display/ColorMatrix');
var FX_CONST = require('./const');

/**
 * @classdesc
 *
 * @class ColorMatrix
 * @extends Phaser.Display.ColorMatrix
 * @memberof Phaser.GameObjects.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
 */
var ColorMatrix = new Class({

    Extends: BaseColorMatrix,

    initialize:

    function ColorMatrix (gameObject)
    {
        BaseColorMatrix.call(this);

        this.type = FX_CONST.COLOR_MATRIX;

        this.gameObject = gameObject;

        this.active = true;
    },

    destroy: function ()
    {
        this.gameObject = null;
        this._matrix = null;
        this._data = null;
    }

});

module.exports = ColorMatrix;
