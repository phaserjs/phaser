/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var IsoBoxRender = require('./IsoBoxRender');
var Class = require('../../../utils/Class');
var Shape = require('../Shape');

/**
 * @classdesc
 *
 * @class IsoBox
 * @extends Phaser.GameObjects.Shape
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 */
var IsoBox = new Class({

    Extends: Shape,

    Mixins: [
        IsoBoxRender
    ],

    initialize:

    function IsoBox (scene, x, y, size, height, fillTop, fillLeft, fillRight)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (size === undefined) { size = 48; }
        if (height === undefined) { height = 32; }
        if (fillTop === undefined) { fillTop = 0xeeeeee; }
        if (fillLeft === undefined) { fillLeft = 0x999999; }
        if (fillRight === undefined) { fillRight = 0xcccccc; }

        Shape.call(this, scene, 'IsoBox', null);

        this.fillTop = fillTop;
        this.fillLeft = fillLeft;
        this.fillRight = fillRight;

        this.isFilled = true;

        this.setPosition(x, y);
        this.setSize(size, height);

        this.updateDisplayOrigin();
    },

    setFillStyle: function (fillTop, fillLeft, fillRight)
    {
        this.fillTop = fillTop;
        this.fillLeft = fillLeft;
        this.fillRight = fillRight;

        this.isFilled = true;

        return this;
    }

});

module.exports = IsoBox;
