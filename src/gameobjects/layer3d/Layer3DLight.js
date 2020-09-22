/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var RGB = require('../../display/RGB');
var Vector3 = require('../../math/Vector3');

/**
 * @classdesc
 * A Layer3D Light.
 *
 * @class Layer3DLight
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.50.0
 */
var Layer3DLight = new Class({

    initialize:

    function Layer3DLight (layer, x, y, z)
    {
        /**
         * The Layer3D instance this light belongs to.
         *
         * A light can only belong to a single Layer3D instance.
         *
         * You should consider this property as being read-only. You cannot move a
         * light to another Layer3D by simply changing it.
         *
         * @name Phaser.GameObjects.Layer3DLight#layer
         * @type {Phaser.GameObjects.Layer3D}
         * @since 3.50.0
         */
        this.layer = layer;

        /**
         * The position of the light in 3D space.
         *
         * You can modify this vector directly, or use the `x`, `y` and `z`
         * properties of this class.
         *
         * @name Phaser.GameObjects.Layer3DLight#position
         * @type {Phaser.Math.Vector3}
         * @since 3.50.0
         */
        this.position = new Vector3(x, y, z);

        /**
         * The ambient color of the light.
         *
         * The default ambient color is 1, 1, 1.
         *
         * You can modify the properties of this RGB object directly, or call
         * the `setAmbient` method of this class.
         *
         * The values in this object are used by the `uLightAmbient` shader uniform.
         *
         * @name Phaser.GameObjects.Layer3DLight#ambient
         * @type {Phaser.Display.RGB}
         * @since 3.50.0
         */
        this.ambient = new RGB(1, 1, 1);

        /**
         * The diffuse color of the light.
         *
         * The default diffuse color is 1, 1, 1.
         *
         * You can modify the properties of this RGB object directly, or call
         * the `setDiffuse` method of this class.
         *
         * The values in this object are used by the `uLightDiffuse` shader uniform.
         *
         * @name Phaser.GameObjects.Layer3DLight#diffuse
         * @type {Phaser.Display.RGB}
         * @since 3.50.0
         */
        this.diffuse = new RGB(1, 1, 1);

        /**
         * The specular color of the light.
         *
         * The default specular color is 1, 1, 1.
         *
         * You can modify the properties of this RGB object directly, or call
         * the `setSpecular` method of this class.
         *
         * The values in this object are used by the `uLightSpecular` shader uniform.
         *
         * @name Phaser.GameObjects.Layer3DLight#specular
         * @type {Phaser.Display.RGB}
         * @since 3.50.0
         */
        this.specular = new RGB(1, 1, 1);

        /**
         * Internal dirty cache array.
         *
         * @name Phaser.GameObjects.Layer3DLight#dirtyCache
         * @type {number[]}
         * @private
         * @since 3.50.0
         */
        this.dirtyCache = [ 0, 0, 0 ];
    },

    /**
     * Checks if the position of this light is dirty.
     *
     * Called internally by the Mesh Pipeline `onBind` method and if dirty
     * is used to set the `uLightPosition` uniform.
     *
     * @method Phaser.GameObjects.Layer3DLight#isDirty
     * @since 3.50.0
     *
     * @return {boolean} `true` if this light is dirty, otherwise `false`.
     */
    isDirty: function ()
    {
        var position = this.position;
        var dirtyCache = this.dirtyCache;

        var x = position.x;
        var y = position.y;
        var z = position.z;

        var xCached = dirtyCache[0];
        var yCached = dirtyCache[1];
        var zCached = dirtyCache[2];

        dirtyCache[0] = x;
        dirtyCache[1] = y;
        dirtyCache[2] = z;

        return (xCached !== x || yCached !== y || zCached !== z);
    },

    /**
     * Sets the position of this light.
     *
     * @method Phaser.GameObjects.Layer3DLight#setPosition
     * @since 3.50.0
     *
     * @param {number} x - The x position of this light.
     * @param {number} y - The y position of this light.
     * @param {number} z - The z position of this light.
     *
     * @return {this} This Layer3DLight instance.
     */
    setPosition: function (x, y, z)
    {
        this.position.set(x, y, z);

        return this;
    },

    /**
     * Sets the ambient color of this light.
     *
     * @method Phaser.GameObjects.Layer3DLight#setAmbient
     * @since 3.50.0
     *
     * @param {number} r - The red color value. Between 0 and 1.
     * @param {number} g - The green color value. Between 0 and 1.
     * @param {number} b - The blue color value. Between 0 and 1.
     *
     * @return {this} This Layer3DLight instance.
     */
    setAmbient: function (r, g, b)
    {
        this.ambient.set(r, g, b);

        return this;
    },

    /**
     * Sets the diffuse color of this light.
     *
     * @method Phaser.GameObjects.Layer3DLight#setDiffuse
     * @since 3.50.0
     *
     * @param {number} r - The red color value. Between 0 and 1.
     * @param {number} g - The green color value. Between 0 and 1.
     * @param {number} b - The blue color value. Between 0 and 1.
     *
     * @return {this} This Layer3DLight instance.
     */
    setDiffuse: function (r, g, b)
    {
        this.diffuse.set(r, g, b);

        return this;
    },

    /**
     * Sets the specular color of this light.
     *
     * @method Phaser.GameObjects.Layer3DLight#setSpecular
     * @since 3.50.0
     *
     * @param {number} r - The red color value. Between 0 and 1.
     * @param {number} g - The green color value. Between 0 and 1.
     * @param {number} b - The blue color value. Between 0 and 1.
     *
     * @return {this} This Layer3DLight instance.
     */
    setSpecular: function (r, g, b)
    {
        this.specular.set(r, g, b);

        return this;
    },

    /**
     * The x position of the light.
     *
     * @name Phaser.GameObjects.Layer3DLight#x
     * @type {number}
     * @since 3.50.0
     */
    x: {

        get: function ()
        {
            return this.position.x;
        },

        set: function (value)
        {
            this.position.x = value;
        }

    },

    /**
     * The y position of the light.
     *
     * @name Phaser.GameObjects.Layer3DLight#y
     * @type {number}
     * @since 3.50.0
     */
    y: {

        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.position.y = value;
        }

    },

    /**
     * The z position of the light.
     *
     * @name Phaser.GameObjects.Layer3DLight#z
     * @type {number}
     * @since 3.50.0
     */
    z: {

        get: function ()
        {
            return this.position.z;
        },

        set: function (value)
        {
            this.position.z = value;
        }

    },

    /**
     * Destroy handler for this light.
     *
     * @method Phaser.GameObjects.Layer3DLight#destroy
     * @since 3.50.0
     */
    destroy: function ()
    {
        this.layer = null;
        this.position = null;
    }

});

module.exports = Layer3DLight;
