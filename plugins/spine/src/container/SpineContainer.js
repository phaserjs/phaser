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
 * for Spine Game Objects. You cannot mix and match Spine Game Objects with regular Game Objects inside of this
 * type of Container, however.
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
 * See the Container documentation for further details.
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
         * @name SpineGameObject#plugin
         * @type {SpinePlugin}
         * @since 3.19.0
         */
        this.plugin = plugin;
    }

});

module.exports = SpineContainer;
