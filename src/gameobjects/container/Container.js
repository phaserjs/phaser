/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var List = require('../../structs/List');
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
 * @extends Phaser.Structs.List
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to this Container.
 */
var Container = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Transform,
        Components.Visible,
        Render,
        List
    ],

    initialize:

    function Container (scene, x, y, children)
    {
        GameObject.call(this, scene, 'Container');

        /**
         * The parent property as used by the List methods.
         *
         * @name Phaser.GameObjects.Container#parent
         * @type {Phaser.GameObjects.Container}
         * @private
         * @since 3.4.0
         */
        this.parent = this;

        /**
         * An array holding the children of this Container.
         *
         * @name Phaser.GameObjects.Container#list
         * @type {Phaser.GameObjects.GameObject[]}
         * @since 3.4.0
         */
        this.list = [];

        /**
         * Does this Container exclusively manage its children?
         * 
         * The default is `true` which means a child added to this Container cannot
         * belong in another Container, which includes the Scene display list.
         * 
         * If you disable this then this Container will no longer exclusively manage its children.
         * This allows you to create all kinds of interesting graphical effects, such as replicating
         * Game Objects without reparenting them all over the Scene.
         * However, doing so will prevent children from receiving any kind of input event or have
         * their physics bodies work by default, as they're no longer a single entity on the
         * display list, but are being replicated where-ever this Container is.
         *
         * @name Phaser.GameObjects.Container#exclusive
         * @type {boolean}
         * @default true
         * @since 3.4.0
         */
        this.exclusive = true;

        /**
         * The cursor position.
         *
         * @name Phaser.GameObjects.Container#position
         * @type {integer}
         * @since 3.4.0
         */
        this.position = 0;

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
         * @private
         * @since 3.4.0
         */
        this.tempTransformMatrix = new Components.TransformMatrix();

        /**
         * A callback that is invoked every time a child is added to this list.
         *
         * @name Phaser.GameObjects.Container#addCallback
         * @type {function}
         * @private
         * @since 3.4.0
         */
        this.addCallback = this.addHandler;

        /**
         * A callback that is invoked every time a child is removed from this list.
         *
         * @name Phaser.GameObjects.Container#removeCallback
         * @type {function}
         * @private
         * @since 3.4.0
         */
        this.removeCallback = this.removeHandler;

        /**
         * A reference to the Scene Display List.
         *
         * @name Phaser.GameObjects.Container#_displayList
         * @type {Phaser.GameObjects.DisplayList}
         * @private
         * @since 3.4.0
         */
        this._displayList = scene.sys.displayList;

        this.setPosition(x, y);
        this.clearAlpha();

        if (Array.isArray(children))
        {
            this.addMultiple(children);
        }
    },

    /**
     * Does this Container exclusively manage its children?
     * 
     * The default is `true` which means a child added to this Container cannot
     * belong in another Container, which includes the Scene display list.
     * 
     * If you disable this then this Container will no longer exclusively manage its children.
     * This allows you to create all kinds of interesting graphical effects, such as replicating
     * Game Objects without reparenting them all over the Scene.
     * However, doing so will prevent children from receiving any kind of input event or have
     * their physics bodies work by default, as they're no longer a single entity on the
     * display list, but are being replicated where-ever this Container is.
     *
     * @method Phaser.GameObjects.Container#setExclusive
     * @since 3.4.0
     *
     * @param {boolean} [value=true] - The exclusive state of this Container.
     *
     * @return {Phaser.GameObjects.Container} This Container.
     */
    setExclusive: function (value)
    {
        if (value === undefined) { value = true; }

        this.exclusive = value;

        return this;
    },

    /**
     * Internal add handler.
     *
     * @method Phaser.GameObjects.Container#addHandler
     * @private
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.Container} list - The List the Game Object was added to (also this Container)
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that was just added to this Container.
     */
    addHandler: function (list, gameObject)
    {
        gameObject.on('destroy', this.remove, this);

        if (this.exclusive)
        {
            this._displayList.remove(gameObject);

            if (gameObject.parentContainer)
            {
                gameObject.parentContainer.remove(gameObject);
            }

            gameObject.parentContainer = list;
        }
    },

    /**
     * Internal remove handler.
     *
     * @method Phaser.GameObjects.Container#removeHandler
     * @private
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.Container} list - The List the Game Object was removed from (also this Container)
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that was just removed from this Container.
     */
    removeHandler: function (list, gameObject)
    {
        gameObject.off('destroy', list.remove, this);

        if (this.exclusive)
        {
            gameObject.parentContainer = null;
        }
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
    },

    /**
     * Destroys this Container removing it and all children from the Display List and
     * severing all ties to parent resources.
     *
     * Use this to remove a Container from your game if you don't ever plan to use it again.
     * As long as no reference to it exists within your own code it should become free for
     * garbage collection by the browser.
     *
     * If you just want to temporarily disable an object then look at using the
     * Game Object Pool instead of destroying it, as destroyed objects cannot be resurrected.
     *
     * @method Phaser.GameObjects.Container#destroy
     * @since 3.4.0
     */
    destroy: function ()
    {
        //  This Game Object had already been destroyed
        if (!this.scene)
        {
            return;
        }

        if (this.preDestroy)
        {
            this.preDestroy.call(this);
        }

        this.emit('destroy', this);

        var sys = this.scene.sys;

        sys.displayList.remove(this);

        if (this.data)
        {
            this.data.destroy();

            this.data = undefined;
        }

        //  Tell the Scene to re-sort the children
        sys.queueDepthSort();

        this.active = false;
        this.visible = false;

        this.scene = undefined;

        this.removeAllListeners();

        this.removeAll();

        this.list = [];

        this.parent = null;
        this.parentContainer = null;
    }

});

module.exports = Container;
