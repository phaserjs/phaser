/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var Render = require('./ContainerRender');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * A Container Game Object.
 *
 * @class Container
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.4.0
 *
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Transform
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 */
var Container = new Class({

    Extends: GameObject,

    Mixins: [
        Components.BlendMode,
        Components.Transform,
        Render
    ],

    initialize:

    function Container (scene, x, y)
    {
        GameObject.call(this, scene, 'Container');

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Container#parentContainer
         * @type {Phaser.GameObjects.Container}
         * @since 3.4.0
         */
        this.parentContainer = null;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Container#children
         * @type {Phaser.GameObjects.GameObject[]}
         * @since 3.4.0
         */
        this.children = [];

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Container#localTransform
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.4.0
         */
        this.localTransform = new Components.TransformMatrix();

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Container#tempTransformMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.4.0
         */
        this.tempTransformMatrix = new Components.TransformMatrix();

        this.setPosition(x, y);
    },

    /**
     * Adds the given Game Object, or array of Game Objects, to this Container.
     *
     * @method Phaser.GameObjects.Container#add
     * @since 3.4.0
     *
     * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} gameObject - The Game Object, or array of Game Objects, to add to this Container.
     *
     * @return {Phaser.GameObjects.Container} This Container instance.
     */
    add: function (gameObject)
    {
        if (!Array.isArray(gameObject))
        {
            gameObject = [ gameObject ];
        }

        for (var i = 0; i < gameObject.length; i++)
        {
            var entry = gameObject[i];

            if (entry.type === 'Container')
            {
                entry.parentContainer = this;
            }

            if (this.children.indexOf(entry) === -1)
            {
                this.children.push(entry);
            }
        }

        return this;
    },

    /**
     * Removes a Game Object from this Container.
     *
     * @method Phaser.GameObjects.Container#remove
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to remove from this Container.
     *
     * @return {Phaser.GameObjects.Container} This Container instance.
     */
    remove: function (gameObject)
    {
        var index = this.children.indexOf(gameObject);

        if (index !== -1)
        {
            if (gameObject.type === 'Container')
            {
                gameObject.parentContainer = null;
            }

            this.children.splice(index, 1);
        }

        return this;
    },

    /**
     * Takes a Point-like object, such as a Vector2, Geom.Point or object with public x and y properties,
     * and transforms it into the space of this Container, then returns it in the output object.
     *
     * @method Phaser.GameObjects.Container#pointToContainer
     * @since 3.4.0
     *
     * @param {(object|Phaser.Geom.Point|Phaser.Math.Vector2)} source - The Source Point to be transformed.
     * @param {(object|Phaser.Geom.Point|Phaser.Math.Vector2)} [output] - A destination object to store the transformed point in. If none given a Vector2 will be created and returned.
     *
     * @return {(object|Phaser.Geom.Point|Phaser.Math.Vector2)} The transformed point.
     */
    pointToContainer: function (source, output)
    {
        if (output === undefined) { output = new Vector2(); }

        if (this.parentContainer)
        {
            return this.parentContainer.pointToContainer(source, output);
        }

        var tempMatrix = this.tempTransformMatrix;

        //  No need to loadIdentity because applyITRS overwrites every value anyway
        tempMatrix.applyITRS(this.x, this.y, this.rotation, this.scaleX, this.scaleY);

        tempMatrix.invert();

        tempMatrix.transformPoint(source.x, source.y, output);

        return output;
    }

});

module.exports = Container;
