/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ArrayUtils = require('../../utils/array');
var BlendModes = require('../../renderer/BlendModes');
var Class = require('../../utils/Class');
var Components = require('../components');
var Events = require('../events');
var GameObject = require('../GameObject');
var Rectangle = require('../../geom/rectangle/Rectangle');
var Render = require('./ContainerRender');
var Union = require('../../geom/rectangle/Union');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * A Container Game Object.
 *
 * A Container, as the name implies, can 'contain' other types of Game Object.
 * When a Game Object is added to a Container, the Container becomes responsible for the rendering of it.
 * By default it will be removed from the Display List and instead added to the Containers own internal list.
 *
 * The position of the Game Object automatically becomes relative to the position of the Container.
 *
 * The transform point of a Container is 0x0 (in local space) and that cannot be changed. The children you add to the
 * Container should be positioned with this value in mind. I.e. you should treat 0x0 as being the center of
 * the Container, and position children positively and negative around it as required.
 *
 * When the Container is rendered, all of its children are rendered as well, in the order in which they exist
 * within the Container. Container children can be repositioned using methods such as `MoveUp`, `MoveDown` and `SendToBack`.
 *
 * If you modify a transform property of the Container, such as `Container.x` or `Container.rotation` then it will
 * automatically influence all children as well.
 *
 * Containers can include other Containers for deeply nested transforms.
 *
 * Containers can have masks set on them and can be used as a mask too. However, Container children cannot be masked.
 * The masks do not 'stack up'. Only a Container on the root of the display list will use its mask.
 *
 * Containers can be enabled for input. Because they do not have a texture you need to provide a shape for them
 * to use as their hit area. Container children can also be enabled for input, independent of the Container.
 *
 * If input enabling a _child_ you should not set both the `origin` and a **negative** scale factor on the child,
 * or the input area will become misaligned.
 *
 * Containers can be given a physics body for either Arcade Physics, Impact Physics or Matter Physics. However,
 * if Container _children_ are enabled for physics you may get unexpected results, such as offset bodies,
 * if the Container itself, or any of its ancestors, is positioned anywhere other than at 0 x 0. Container children
 * with physics do not factor in the Container due to the excessive extra calculations needed. Please structure
 * your game to work around this.
 *
 * It's important to understand the impact of using Containers. They add additional processing overhead into
 * every one of their children. The deeper you nest them, the more the cost escalates. This is especially true
 * for input events. You also loose the ability to set the display depth of Container children in the same
 * flexible manner as those not within them. In short, don't use them for the sake of it. You pay a small cost
 * every time you create one, try to structure your game around avoiding that where possible.
 *
 * @class Container
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.4.0
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to this Container.
 */
var Container = new Class({

    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
        Components.BlendMode,
        Components.ComputedSize,
        Components.Depth,
        Components.Mask,
        Components.Pipeline,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function Container (scene, x, y, children)
    {
        GameObject.call(this, scene, 'Container');

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
         * Containers can have an optional maximum size. If set to anything above 0 it
         * will constrict the addition of new Game Objects into the Container, capping off
         * the maximum limit the Container can grow in size to.
         *
         * @name Phaser.GameObjects.Container#maxSize
         * @type {number}
         * @default -1
         * @since 3.4.0
         */
        this.maxSize = -1;

        /**
         * The cursor position.
         *
         * @name Phaser.GameObjects.Container#position
         * @type {number}
         * @since 3.4.0
         */
        this.position = 0;

        /**
         * Internal Transform Matrix used for local space conversion.
         *
         * @name Phaser.GameObjects.Container#localTransform
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.4.0
         */
        this.localTransform = new Components.TransformMatrix();

        /**
         * Internal temporary Transform Matrix used to avoid object creation.
         *
         * @name Phaser.GameObjects.Container#tempTransformMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 3.4.0
         */
        this.tempTransformMatrix = new Components.TransformMatrix();

        /**
         * The property key to sort by.
         *
         * @name Phaser.GameObjects.Container#_sortKey
         * @type {string}
         * @private
         * @since 3.4.0
         */
        this._sortKey = '';

        /**
         * A reference to the Scene Systems Event Emitter.
         *
         * @name Phaser.GameObjects.Container#_sysEvents
         * @type {Phaser.Events.EventEmitter}
         * @private
         * @since 3.9.0
         */
        this._sysEvents = scene.sys.events;

        /**
         * The horizontal scroll factor of this Container.
         *
         * The scroll factor controls the influence of the movement of a Camera upon this Container.
         *
         * When a camera scrolls it will change the location at which this Container is rendered on-screen.
         * It does not change the Containers actual position values.
         *
         * For a Container, setting this value will only update the Container itself, not its children.
         * If you wish to change the scrollFactor of the children as well, use the `setScrollFactor` method.
         *
         * A value of 1 means it will move exactly in sync with a camera.
         * A value of 0 means it will not move at all, even if the camera moves.
         * Other values control the degree to which the camera movement is mapped to this Container.
         *
         * Please be aware that scroll factor values other than 1 are not taken in to consideration when
         * calculating physics collisions. Bodies always collide based on their world position, but changing
         * the scroll factor is a visual adjustment to where the textures are rendered, which can offset
         * them from physics bodies if not accounted for in your code.
         *
         * @name Phaser.GameObjects.Container#scrollFactorX
         * @type {number}
         * @default 1
         * @since 3.4.0
         */
        this.scrollFactorX = 1;

        /**
         * The vertical scroll factor of this Container.
         *
         * The scroll factor controls the influence of the movement of a Camera upon this Container.
         *
         * When a camera scrolls it will change the location at which this Container is rendered on-screen.
         * It does not change the Containers actual position values.
         *
         * For a Container, setting this value will only update the Container itself, not its children.
         * If you wish to change the scrollFactor of the children as well, use the `setScrollFactor` method.
         *
         * A value of 1 means it will move exactly in sync with a camera.
         * A value of 0 means it will not move at all, even if the camera moves.
         * Other values control the degree to which the camera movement is mapped to this Container.
         *
         * Please be aware that scroll factor values other than 1 are not taken in to consideration when
         * calculating physics collisions. Bodies always collide based on their world position, but changing
         * the scroll factor is a visual adjustment to where the textures are rendered, which can offset
         * them from physics bodies if not accounted for in your code.
         *
         * @name Phaser.GameObjects.Container#scrollFactorY
         * @type {number}
         * @default 1
         * @since 3.4.0
         */
        this.scrollFactorY = 1;

        this.initPipeline();

        this.setPosition(x, y);

        this.clearAlpha();

        this.setBlendMode(BlendModes.SKIP_CHECK);

        if (children)
        {
            this.add(children);
        }
    },

    /**
     * Internal value to allow Containers to be used for input and physics.
     * Do not change this value. It has no effect other than to break things.
     *
     * @name Phaser.GameObjects.Container#originX
     * @type {number}
     * @readonly
     * @override
     * @since 3.4.0
     */
    originX: {

        get: function ()
        {
            return 0.5;
        }

    },

    /**
     * Internal value to allow Containers to be used for input and physics.
     * Do not change this value. It has no effect other than to break things.
     *
     * @name Phaser.GameObjects.Container#originY
     * @type {number}
     * @readonly
     * @override
     * @since 3.4.0
     */
    originY: {

        get: function ()
        {
            return 0.5;
        }

    },

    /**
     * Internal value to allow Containers to be used for input and physics.
     * Do not change this value. It has no effect other than to break things.
     *
     * @name Phaser.GameObjects.Container#displayOriginX
     * @type {number}
     * @readonly
     * @override
     * @since 3.4.0
     */
    displayOriginX: {

        get: function ()
        {
            return this.width * 0.5;
        }

    },

    /**
     * Internal value to allow Containers to be used for input and physics.
     * Do not change this value. It has no effect other than to break things.
     *
     * @name Phaser.GameObjects.Container#displayOriginY
     * @type {number}
     * @readonly
     * @override
     * @since 3.4.0
     */
    displayOriginY: {

        get: function ()
        {
            return this.height * 0.5;
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
     * @return {this} This Container.
     */
    setExclusive: function (value)
    {
        if (value === undefined) { value = true; }

        this.exclusive = value;

        return this;
    },

    /**
     * Gets the bounds of this Container. It works by iterating all children of the Container,
     * getting their respective bounds, and then working out a min-max rectangle from that.
     * It does not factor in if the children render or not, all are included.
     *
     * Some children are unable to return their bounds, such as Graphics objects, in which case
     * they are skipped.
     *
     * Depending on the quantity of children in this Container it could be a really expensive call,
     * so cache it and only poll it as needed.
     *
     * The values are stored and returned in a Rectangle object.
     *
     * @method Phaser.GameObjects.Container#getBounds
     * @since 3.4.0
     *
     * @param {Phaser.Geom.Rectangle} [output] - A Geom.Rectangle object to store the values in. If not provided a new Rectangle will be created.
     *
     * @return {Phaser.Geom.Rectangle} The values stored in the output object.
     */
    getBounds: function (output)
    {
        if (output === undefined) { output = new Rectangle(); }

        output.setTo(this.x, this.y, 0, 0);

        if (this.parentContainer)
        {
            var parentMatrix = this.parentContainer.getBoundsTransformMatrix();
            var transformedPosition = parentMatrix.transformPoint(this.x, this.y);

            output.setTo(transformedPosition.x, transformedPosition.y, 0, 0);
        }

        if (this.list.length > 0)
        {
            var children = this.list;
            var tempRect = new Rectangle();
            var hasSetFirst = false;

            output.setEmpty();

            for (var i = 0; i < children.length; i++)
            {
                var entry = children[i];

                if (entry.getBounds)
                {
                    entry.getBounds(tempRect);

                    if (!hasSetFirst)
                    {
                        output.setTo(tempRect.x, tempRect.y, tempRect.width, tempRect.height);
                        hasSetFirst = true;
                    }
                    else
                    {
                        Union(tempRect, output, output);
                    }
                }
            }
        }

        return output;
    },

    /**
     * Internal add handler.
     *
     * @method Phaser.GameObjects.Container#addHandler
     * @private
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that was just added to this Container.
     */
    addHandler: function (gameObject)
    {
        gameObject.once(Events.DESTROY, this.remove, this);

        if (this.exclusive)
        {
            if (gameObject.parentContainer)
            {
                gameObject.parentContainer.remove(gameObject);
            }

            gameObject.removeFromDisplayList();

            gameObject.parentContainer = this;
        }
    },

    /**
     * Internal remove handler.
     *
     * @method Phaser.GameObjects.Container#removeHandler
     * @private
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that was just removed from this Container.
     */
    removeHandler: function (gameObject)
    {
        gameObject.off(Events.DESTROY, this.remove);

        if (this.exclusive)
        {
            gameObject.parentContainer = null;

            gameObject.addToDisplayList();
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
            this.parentContainer.pointToContainer(source, output);
        }
        else
        {
            output = new Vector2(source.x, source.y);
        }

        var tempMatrix = this.tempTransformMatrix;

        //  No need to loadIdentity because applyITRS overwrites every value anyway
        tempMatrix.applyITRS(this.x, this.y, this.rotation, this.scaleX, this.scaleY);

        tempMatrix.invert();

        tempMatrix.transformPoint(source.x, source.y, output);

        return output;
    },

    /**
     * Returns the world transform matrix as used for Bounds checks.
     *
     * The returned matrix is temporal and shouldn't be stored.
     *
     * @method Phaser.GameObjects.Container#getBoundsTransformMatrix
     * @since 3.4.0
     *
     * @return {Phaser.GameObjects.Components.TransformMatrix} The world transform matrix.
     */
    getBoundsTransformMatrix: function ()
    {
        return this.getWorldTransformMatrix(this.tempTransformMatrix, this.localTransform);
    },

    /**
     * Adds the given Game Object, or array of Game Objects, to this Container.
     *
     * Each Game Object must be unique within the Container.
     *
     * @method Phaser.GameObjects.Container#add
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} child - The Game Object, or array of Game Objects, to add to the Container.
     *
     * @return {this} This Container instance.
     */
    add: function (child)
    {
        ArrayUtils.Add(this.list, child, this.maxSize, this.addHandler, this);

        return this;
    },

    /**
     * Adds the given Game Object, or array of Game Objects, to this Container at the specified position.
     *
     * Existing Game Objects in the Container are shifted up.
     *
     * Each Game Object must be unique within the Container.
     *
     * @method Phaser.GameObjects.Container#addAt
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} child - The Game Object, or array of Game Objects, to add to the Container.
     * @param {number} [index=0] - The position to insert the Game Object/s at.
     *
     * @return {this} This Container instance.
     */
    addAt: function (child, index)
    {
        ArrayUtils.AddAt(this.list, child, index, this.maxSize, this.addHandler, this);

        return this;
    },

    /**
     * Returns the Game Object at the given position in this Container.
     *
     * @method Phaser.GameObjects.Container#getAt
     * @since 3.4.0
     *
     * @param {number} index - The position to get the Game Object from.
     *
     * @return {?Phaser.GameObjects.GameObject} The Game Object at the specified index, or `null` if none found.
     */
    getAt: function (index)
    {
        return this.list[index];
    },

    /**
     * Returns the index of the given Game Object in this Container.
     *
     * @method Phaser.GameObjects.Container#getIndex
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object to search for in this Container.
     *
     * @return {number} The index of the Game Object in this Container, or -1 if not found.
     */
    getIndex: function (child)
    {
        return this.list.indexOf(child);
    },

    /**
     * Sort the contents of this Container so the items are in order based on the given property.
     * For example: `sort('alpha')` would sort the elements based on the value of their `alpha` property.
     *
     * @method Phaser.GameObjects.Container#sort
     * @since 3.4.0
     *
     * @param {string} property - The property to lexically sort by.
     * @param {function} [handler] - Provide your own custom handler function. Will receive 2 children which it should compare and return a boolean.
     *
     * @return {this} This Container instance.
     */
    sort: function (property, handler)
    {
        if (!property)
        {
            return this;
        }

        if (handler === undefined)
        {
            handler = function (childA, childB)
            {
                return childA[property] - childB[property];
            };
        }

        ArrayUtils.StableSort(this.list, handler);

        return this;
    },

    /**
     * Searches for the first instance of a child with its `name` property matching the given argument.
     * Should more than one child have the same name only the first is returned.
     *
     * @method Phaser.GameObjects.Container#getByName
     * @since 3.4.0
     *
     * @param {string} name - The name to search for.
     *
     * @return {?Phaser.GameObjects.GameObject} The first child with a matching name, or `null` if none were found.
     */
    getByName: function (name)
    {
        return ArrayUtils.GetFirst(this.list, 'name', name);
    },

    /**
     * Returns a random Game Object from this Container.
     *
     * @method Phaser.GameObjects.Container#getRandom
     * @since 3.4.0
     *
     * @param {number} [startIndex=0] - An optional start index.
     * @param {number} [length] - An optional length, the total number of elements (from the startIndex) to choose from.
     *
     * @return {?Phaser.GameObjects.GameObject} A random child from the Container, or `null` if the Container is empty.
     */
    getRandom: function (startIndex, length)
    {
        return ArrayUtils.GetRandom(this.list, startIndex, length);
    },

    /**
     * Gets the first Game Object in this Container.
     *
     * You can also specify a property and value to search for, in which case it will return the first
     * Game Object in this Container with a matching property and / or value.
     *
     * For example: `getFirst('visible', true)` would return the first Game Object that had its `visible` property set.
     *
     * You can limit the search to the `startIndex` - `endIndex` range.
     *
     * @method Phaser.GameObjects.Container#getFirst
     * @since 3.4.0
     *
     * @param {string} property - The property to test on each Game Object in the Container.
     * @param {*} value - The value to test the property against. Must pass a strict (`===`) comparison check.
     * @param {number} [startIndex=0] - An optional start index to search from.
     * @param {number} [endIndex=Container.length] - An optional end index to search up to (but not included)
     *
     * @return {?Phaser.GameObjects.GameObject} The first matching Game Object, or `null` if none was found.
     */
    getFirst: function (property, value, startIndex, endIndex)
    {
        return ArrayUtils.GetFirst(this.list, property, value, startIndex, endIndex);
    },

    /**
     * Returns all Game Objects in this Container.
     *
     * You can optionally specify a matching criteria using the `property` and `value` arguments.
     *
     * For example: `getAll('body')` would return only Game Objects that have a body property.
     *
     * You can also specify a value to compare the property to:
     *
     * `getAll('visible', true)` would return only Game Objects that have their visible property set to `true`.
     *
     * Optionally you can specify a start and end index. For example if this Container had 100 Game Objects,
     * and you set `startIndex` to 0 and `endIndex` to 50, it would return matches from only
     * the first 50 Game Objects.
     *
     * @method Phaser.GameObjects.Container#getAll
     * @since 3.4.0
     *
     * @param {string} [property] - The property to test on each Game Object in the Container.
     * @param {any} [value] - If property is set then the `property` must strictly equal this value to be included in the results.
     * @param {number} [startIndex=0] - An optional start index to search from.
     * @param {number} [endIndex=Container.length] - An optional end index to search up to (but not included)
     *
     * @return {Phaser.GameObjects.GameObject[]} An array of matching Game Objects from this Container.
     */
    getAll: function (property, value, startIndex, endIndex)
    {
        return ArrayUtils.GetAll(this.list, property, value, startIndex, endIndex);
    },

    /**
     * Returns the total number of Game Objects in this Container that have a property
     * matching the given value.
     *
     * For example: `count('visible', true)` would count all the elements that have their visible property set.
     *
     * You can optionally limit the operation to the `startIndex` - `endIndex` range.
     *
     * @method Phaser.GameObjects.Container#count
     * @since 3.4.0
     *
     * @param {string} property - The property to check.
     * @param {any} value - The value to check.
     * @param {number} [startIndex=0] - An optional start index to search from.
     * @param {number} [endIndex=Container.length] - An optional end index to search up to (but not included)
     *
     * @return {number} The total number of Game Objects in this Container with a property matching the given value.
     */
    count: function (property, value, startIndex, endIndex)
    {
        return ArrayUtils.CountAllMatching(this.list, property, value, startIndex, endIndex);
    },

    /**
     * Swaps the position of two Game Objects in this Container.
     * Both Game Objects must belong to this Container.
     *
     * @method Phaser.GameObjects.Container#swap
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.GameObject} child1 - The first Game Object to swap.
     * @param {Phaser.GameObjects.GameObject} child2 - The second Game Object to swap.
     *
     * @return {this} This Container instance.
     */
    swap: function (child1, child2)
    {
        ArrayUtils.Swap(this.list, child1, child2);

        return this;
    },

    /**
     * Moves a Game Object to a new position within this Container.
     *
     * The Game Object must already be a child of this Container.
     *
     * The Game Object is removed from its old position and inserted into the new one.
     * Therefore the Container size does not change. Other children will change position accordingly.
     *
     * @method Phaser.GameObjects.Container#moveTo
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object to move.
     * @param {number} index - The new position of the Game Object in this Container.
     *
     * @return {this} This Container instance.
     */
    moveTo: function (child, index)
    {
        ArrayUtils.MoveTo(this.list, child, index);

        return this;
    },

    /**
     * Moves a Game Object above another one within this Container.
     *
     * These 2 Game Objects must already be children of this Container.
     *
     * @method Phaser.GameObjects.Container#moveAbove
     * @since 3.55.0
     *
     * @param {Phaser.GameObjects.GameObject} child1 - The Game Object to move above base Game Object.
     * @param {Phaser.GameObjects.GameObject} child2 - The base Game Object.
     *
     * @return {this} This Container instance.
     */
    moveAbove: function (child1, child2)
    {
        ArrayUtils.MoveAbove(this.list, child1, child2);

        return this;
    },

    /**
     * Moves a Game Object below another one within this Container.
     *
     * These 2 Game Objects must already be children of this Container.
     *
     * @method Phaser.GameObjects.Container#moveBelow
     * @since 3.55.0
     *
     * @param {Phaser.GameObjects.GameObject} child1 - The Game Object to move below base Game Object.
     * @param {Phaser.GameObjects.GameObject} child2 - The base Game Object.
     *
     * @return {this} This Container instance.
     */
    moveBelow: function (child1, child2)
    {
        ArrayUtils.MoveBelow(this.list, child1, child2);

        return this;
    },

    /**
     * Removes the given Game Object, or array of Game Objects, from this Container.
     *
     * The Game Objects must already be children of this Container.
     *
     * You can also optionally call `destroy` on each Game Object that is removed from the Container.
     *
     * @method Phaser.GameObjects.Container#remove
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} child - The Game Object, or array of Game Objects, to be removed from the Container.
     * @param {boolean} [destroyChild=false] - Optionally call `destroy` on each child successfully removed from this Container.
     *
     * @return {this} This Container instance.
     */
    remove: function (child, destroyChild)
    {
        var removed = ArrayUtils.Remove(this.list, child, this.removeHandler, this);

        if (destroyChild && removed)
        {
            if (!Array.isArray(removed))
            {
                removed = [ removed ];
            }

            for (var i = 0; i < removed.length; i++)
            {
                removed[i].destroy();
            }
        }

        return this;
    },

    /**
     * Removes the Game Object at the given position in this Container.
     *
     * You can also optionally call `destroy` on the Game Object, if one is found.
     *
     * @method Phaser.GameObjects.Container#removeAt
     * @since 3.4.0
     *
     * @param {number} index - The index of the Game Object to be removed.
     * @param {boolean} [destroyChild=false] - Optionally call `destroy` on the Game Object if successfully removed from this Container.
     *
     * @return {this} This Container instance.
     */
    removeAt: function (index, destroyChild)
    {
        var removed = ArrayUtils.RemoveAt(this.list, index, this.removeHandler, this);

        if (destroyChild && removed)
        {
            removed.destroy();
        }

        return this;
    },

    /**
     * Removes the Game Objects between the given positions in this Container.
     *
     * You can also optionally call `destroy` on each Game Object that is removed from the Container.
     *
     * @method Phaser.GameObjects.Container#removeBetween
     * @since 3.4.0
     *
     * @param {number} [startIndex=0] - An optional start index to search from.
     * @param {number} [endIndex=Container.length] - An optional end index to search up to (but not included)
     * @param {boolean} [destroyChild=false] - Optionally call `destroy` on each Game Object successfully removed from this Container.
     *
     * @return {this} This Container instance.
     */
    removeBetween: function (startIndex, endIndex, destroyChild)
    {
        var removed = ArrayUtils.RemoveBetween(this.list, startIndex, endIndex, this.removeHandler, this);

        if (destroyChild)
        {
            for (var i = 0; i < removed.length; i++)
            {
                removed[i].destroy();
            }
        }

        return this;
    },

    /**
     * Removes all Game Objects from this Container.
     *
     * You can also optionally call `destroy` on each Game Object that is removed from the Container.
     *
     * @method Phaser.GameObjects.Container#removeAll
     * @since 3.4.0
     *
     * @param {boolean} [destroyChild=false] - Optionally call `destroy` on each Game Object successfully removed from this Container.
     *
     * @return {this} This Container instance.
     */
    removeAll: function (destroyChild)
    {
        var removed = ArrayUtils.RemoveBetween(this.list, 0, this.list.length, this.removeHandler, this);

        if (destroyChild)
        {
            for (var i = 0; i < removed.length; i++)
            {
                removed[i].destroy();
            }
        }

        return this;
    },

    /**
     * Brings the given Game Object to the top of this Container.
     * This will cause it to render on-top of any other objects in the Container.
     *
     * @method Phaser.GameObjects.Container#bringToTop
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object to bring to the top of the Container.
     *
     * @return {this} This Container instance.
     */
    bringToTop: function (child)
    {
        ArrayUtils.BringToTop(this.list, child);

        return this;
    },

    /**
     * Sends the given Game Object to the bottom of this Container.
     * This will cause it to render below any other objects in the Container.
     *
     * @method Phaser.GameObjects.Container#sendToBack
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object to send to the bottom of the Container.
     *
     * @return {this} This Container instance.
     */
    sendToBack: function (child)
    {
        ArrayUtils.SendToBack(this.list, child);

        return this;
    },

    /**
     * Moves the given Game Object up one place in this Container, unless it's already at the top.
     *
     * @method Phaser.GameObjects.Container#moveUp
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object to be moved in the Container.
     *
     * @return {this} This Container instance.
     */
    moveUp: function (child)
    {
        ArrayUtils.MoveUp(this.list, child);

        return this;
    },

    /**
     * Moves the given Game Object down one place in this Container, unless it's already at the bottom.
     *
     * @method Phaser.GameObjects.Container#moveDown
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object to be moved in the Container.
     *
     * @return {this} This Container instance.
     */
    moveDown: function (child)
    {
        ArrayUtils.MoveDown(this.list, child);

        return this;
    },

    /**
     * Reverses the order of all Game Objects in this Container.
     *
     * @method Phaser.GameObjects.Container#reverse
     * @since 3.4.0
     *
     * @return {this} This Container instance.
     */
    reverse: function ()
    {
        this.list.reverse();

        return this;
    },

    /**
     * Shuffles the all Game Objects in this Container using the Fisher-Yates implementation.
     *
     * @method Phaser.GameObjects.Container#shuffle
     * @since 3.4.0
     *
     * @return {this} This Container instance.
     */
    shuffle: function ()
    {
        ArrayUtils.Shuffle(this.list);

        return this;
    },

    /**
     * Replaces a Game Object in this Container with the new Game Object.
     * The new Game Object cannot already be a child of this Container.
     *
     * @method Phaser.GameObjects.Container#replace
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.GameObject} oldChild - The Game Object in this Container that will be replaced.
     * @param {Phaser.GameObjects.GameObject} newChild - The Game Object to be added to this Container.
     * @param {boolean} [destroyChild=false] - Optionally call `destroy` on the Game Object if successfully removed from this Container.
     *
     * @return {this} This Container instance.
     */
    replace: function (oldChild, newChild, destroyChild)
    {
        var moved = ArrayUtils.Replace(this.list, oldChild, newChild);

        if (moved)
        {
            this.addHandler(newChild);
            this.removeHandler(oldChild);

            if (destroyChild)
            {
                oldChild.destroy();
            }
        }

        return this;
    },

    /**
     * Returns `true` if the given Game Object is a direct child of this Container.
     *
     * This check does not scan nested Containers.
     *
     * @method Phaser.GameObjects.Container#exists
     * @since 3.4.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object to check for within this Container.
     *
     * @return {boolean} True if the Game Object is an immediate child of this Container, otherwise false.
     */
    exists: function (child)
    {
        return (this.list.indexOf(child) > -1);
    },

    /**
     * Sets the property to the given value on all Game Objects in this Container.
     *
     * Optionally you can specify a start and end index. For example if this Container had 100 Game Objects,
     * and you set `startIndex` to 0 and `endIndex` to 50, it would return matches from only
     * the first 50 Game Objects.
     *
     * @method Phaser.GameObjects.Container#setAll
     * @since 3.4.0
     *
     * @param {string} property - The property that must exist on the Game Object.
     * @param {any} value - The value to get the property to.
     * @param {number} [startIndex=0] - An optional start index to search from.
     * @param {number} [endIndex=Container.length] - An optional end index to search up to (but not included)
     *
     * @return {this} This Container instance.
     */
    setAll: function (property, value, startIndex, endIndex)
    {
        ArrayUtils.SetAll(this.list, property, value, startIndex, endIndex);

        return this;
    },

    /**
     * @callback EachContainerCallback
     * @generic I - [item]
     *
     * @param {*} item - The child Game Object of the Container.
     * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
     */

    /**
     * Passes all Game Objects in this Container to the given callback.
     *
     * A copy of the Container is made before passing each entry to your callback.
     * This protects against the callback itself modifying the Container.
     *
     * If you know for sure that the callback will not change the size of this Container
     * then you can use the more performant `Container.iterate` method instead.
     *
     * @method Phaser.GameObjects.Container#each
     * @since 3.4.0
     *
     * @param {function} callback - The function to call.
     * @param {object} [context] - Value to use as `this` when executing callback.
     * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
     *
     * @return {this} This Container instance.
     */
    each: function (callback, context)
    {
        var args = [ null ];
        var i;
        var temp = this.list.slice();
        var len = temp.length;

        for (i = 2; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        for (i = 0; i < len; i++)
        {
            args[0] = temp[i];

            callback.apply(context, args);
        }

        return this;
    },

    /**
     * Passes all Game Objects in this Container to the given callback.
     *
     * Only use this method when you absolutely know that the Container will not be modified during
     * the iteration, i.e. by removing or adding to its contents.
     *
     * @method Phaser.GameObjects.Container#iterate
     * @since 3.4.0
     *
     * @param {function} callback - The function to call.
     * @param {object} [context] - Value to use as `this` when executing callback.
     * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
     *
     * @return {this} This Container instance.
     */
    iterate: function (callback, context)
    {
        var args = [ null ];
        var i;

        for (i = 2; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        for (i = 0; i < this.list.length; i++)
        {
            args[0] = this.list[i];

            callback.apply(context, args);
        }

        return this;
    },

    /**
     * Sets the scroll factor of this Container and optionally all of its children.
     *
     * The scroll factor controls the influence of the movement of a Camera upon this Game Object.
     *
     * When a camera scrolls it will change the location at which this Game Object is rendered on-screen.
     * It does not change the Game Objects actual position values.
     *
     * A value of 1 means it will move exactly in sync with a camera.
     * A value of 0 means it will not move at all, even if the camera moves.
     * Other values control the degree to which the camera movement is mapped to this Game Object.
     *
     * Please be aware that scroll factor values other than 1 are not taken in to consideration when
     * calculating physics collisions. Bodies always collide based on their world position, but changing
     * the scroll factor is a visual adjustment to where the textures are rendered, which can offset
     * them from physics bodies if not accounted for in your code.
     *
     * @method Phaser.GameObjects.Container#setScrollFactor
     * @since 3.4.0
     *
     * @param {number} x - The horizontal scroll factor of this Game Object.
     * @param {number} [y=x] - The vertical scroll factor of this Game Object. If not set it will use the `x` value.
     * @param {boolean} [updateChildren=false] - Apply this scrollFactor to all Container children as well?
     *
     * @return {this} This Game Object instance.
     */
    setScrollFactor: function (x, y, updateChildren)
    {
        if (y === undefined) { y = x; }
        if (updateChildren === undefined) { updateChildren = false; }

        this.scrollFactorX = x;
        this.scrollFactorY = y;

        if (updateChildren)
        {
            ArrayUtils.SetAll(this.list, 'scrollFactorX', x);
            ArrayUtils.SetAll(this.list, 'scrollFactorY', y);
        }

        return this;
    },

    /**
     * The number of Game Objects inside this Container.
     *
     * @name Phaser.GameObjects.Container#length
     * @type {number}
     * @readonly
     * @since 3.4.0
     */
    length: {

        get: function ()
        {
            return this.list.length;
        }

    },

    /**
     * Returns the first Game Object within the Container, or `null` if it is empty.
     *
     * You can move the cursor by calling `Container.next` and `Container.previous`.
     *
     * @name Phaser.GameObjects.Container#first
     * @type {?Phaser.GameObjects.GameObject}
     * @readonly
     * @since 3.4.0
     */
    first: {

        get: function ()
        {
            this.position = 0;

            if (this.list.length > 0)
            {
                return this.list[0];
            }
            else
            {
                return null;
            }
        }

    },

    /**
     * Returns the last Game Object within the Container, or `null` if it is empty.
     *
     * You can move the cursor by calling `Container.next` and `Container.previous`.
     *
     * @name Phaser.GameObjects.Container#last
     * @type {?Phaser.GameObjects.GameObject}
     * @readonly
     * @since 3.4.0
     */
    last: {

        get: function ()
        {
            if (this.list.length > 0)
            {
                this.position = this.list.length - 1;

                return this.list[this.position];
            }
            else
            {
                return null;
            }
        }

    },

    /**
     * Returns the next Game Object within the Container, or `null` if it is empty.
     *
     * You can move the cursor by calling `Container.next` and `Container.previous`.
     *
     * @name Phaser.GameObjects.Container#next
     * @type {?Phaser.GameObjects.GameObject}
     * @readonly
     * @since 3.4.0
     */
    next: {

        get: function ()
        {
            if (this.position < this.list.length)
            {
                this.position++;

                return this.list[this.position];
            }
            else
            {
                return null;
            }
        }

    },

    /**
     * Returns the previous Game Object within the Container, or `null` if it is empty.
     *
     * You can move the cursor by calling `Container.next` and `Container.previous`.
     *
     * @name Phaser.GameObjects.Container#previous
     * @type {?Phaser.GameObjects.GameObject}
     * @readonly
     * @since 3.4.0
     */
    previous: {

        get: function ()
        {
            if (this.position > 0)
            {
                this.position--;

                return this.list[this.position];
            }
            else
            {
                return null;
            }
        }

    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.Container#preDestroy
     * @protected
     * @since 3.9.0
     */
    preDestroy: function ()
    {
        this.removeAll(!!this.exclusive);

        this.localTransform.destroy();
        this.tempTransformMatrix.destroy();

        this.list = [];
    }

});

module.exports = Container;
