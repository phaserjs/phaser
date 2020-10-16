/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../../src/utils/Class');
var Container = require('../../../../src/gameobjects/container/Container');
var SpineContainerRender = require('./SpineContainerRender');

/**
 * @classdesc
 * A Spine Container is a special kind of Container created specifically for Spine Game Objects.
 *
 * You have all of the same features of a standard Container, but the rendering functions are optimized specifically
 * for Spine Game Objects. You must only add ever Spine Game Objects, or other Spine Containers, to this type of Container.
 * Although Phaser will not prevent you from adding other types, they will not render and are likely to throw runtime errors.
 *
 * To create one in a Scene, use the factory methods:
 *
 * ```javascript
 * this.add.spinecontainer();
 * ```
 *
 * or
 *
 * ```javascript
 * this.make.spinecontainer();
 * ```
 *
 * Note that you should not nest Spine Containers inside regular Containers if you wish to use masks on the
 * container children. You can, however, mask children of Spine Containers if they are embedded within other
 * Spine Containers. In short, if you need masking, don't mix and match the types.
 *
 * See the Container documentation for further details about what Containers can do.
 *
 * @class SpineContainer
 * @extends Phaser.GameObjects.Container
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that this Game Object belongs to.
 * @param {SpinePlugin} pluginManager - A reference to the Phaser Spine Plugin.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {SpineGameObject[]} [children] - An optional array of Spine Game Objects to add to this Container.
 */
var SpineContainer = new Class({

    Extends: Container,

    Mixins: [
        SpineContainerRender
    ],

    initialize:

    function SpineContainer (scene, plugin, x, y, children)
    {
        Container.call(this, scene, x, y, children);

        //  Same as SpineGameObject, to prevent the renderer from mis-typing it when batching
        this.type = 'Spine';

        /**
         * A reference to the Spine Plugin.
         *
         * @name SpineContainer#plugin
         * @type {SpinePlugin}
         * @since 3.50.0
         */
        this.plugin = plugin;
    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method SpineContainer#preDestroy
     * @protected
     * @since 3.50.0
     */
    preDestroy: function ()
    {
        this.removeAll(!!this.exclusive);

        this.localTransform.destroy();
        this.tempTransformMatrix.destroy();

        this.list = [];
        this._displayList = null;
        this.plugin = null;
    }

});

module.exports = SpineContainer;
