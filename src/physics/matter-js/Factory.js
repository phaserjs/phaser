/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Bodies = require('./lib/factory/Bodies');
var Class = require('../../utils/Class');
var Composites = require('./lib/factory/Composites');
var Constraint = require('./lib/constraint/Constraint');
var MatterGameObject = require('./MatterGameObject');
var MatterImage = require('./MatterImage');
var MatterSprite = require('./MatterSprite');
var MatterTileBody = require('./MatterTileBody');
var PointerConstraint = require('./PointerConstraint');

/**
 * @classdesc
 * [description]
 *
 * @class Factory
 * @memberOf Phaser.Physics.Matter
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Matter.World} world - [description]
 */
var Factory = new Class({

    initialize:

    function Factory (world)
    {
        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.Factory#world
         * @type {Phaser.Physics.Matter.World}
         * @since 3.0.0
         */
        this.world = world;

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.Factory#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = world.scene;

        /**
         * A reference to the Scene.Systems this Matter Physics instance belongs to.
         *
         * @name Phaser.Physics.Matter.Factory#sys
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.sys = world.scene.sys;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Factory#rectangle
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {object} options - [description]
     *
     * @return {Matter.Body} A Matter JS Body.
     */
    rectangle: function (x, y, width, height, options)
    {
        var body = Bodies.rectangle(x, y, width, height, options);

        this.world.add(body);

        return body;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Factory#trapezoid
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {number} slope - [description]
     * @param {object} options - [description]
     *
     * @return {Matter.Body} A Matter JS Body.
     */
    trapezoid: function (x, y, width, height, slope, options)
    {
        var body = Bodies.trapezoid(x, y, width, height, slope, options);

        this.world.add(body);

        return body;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Factory#circle
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} radius - [description]
     * @param {object} options - [description]
     * @param {number} maxSides - [description]
     *
     * @return {Matter.Body} A Matter JS Body.
     */
    circle: function (x, y, radius, options, maxSides)
    {
        var body = Bodies.circle(x, y, radius, options, maxSides);

        this.world.add(body);

        return body;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Factory#polygon
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} sides - [description]
     * @param {number} radius - [description]
     * @param {object} options - [description]
     *
     * @return {Matter.Body} A Matter JS Body.
     */
    polygon: function (x, y, sides, radius, options)
    {
        var body = Bodies.polygon(x, y, sides, radius, options);

        this.world.add(body);

        return body;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Factory#fromVertices
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {array} vertexSets - [description]
     * @param {object} options - [description]
     * @param {boolean} flagInternal - [description]
     * @param {boolean} removeCollinear - [description]
     * @param {number} minimumArea - [description]
     *
     * @return {Matter.Body} A Matter JS Body.
     */
    fromVertices: function (x, y, vertexSets, options, flagInternal, removeCollinear, minimumArea)
    {
        var body = Bodies.fromVertices(x, y, vertexSets, options, flagInternal, removeCollinear, minimumArea);

        this.world.add(body);

        return body;
    },

    /**
     * Create a new composite containing Matter Image objects created in a grid arrangement.
     * This function uses the body bounds to prevent overlaps.
     *
     * @method Phaser.Physics.Matter.Factory#imageStack
     * @since 3.0.0
     *
     * @param {string} key - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     * @param {number} x - The horizontal position of this composite in the world.
     * @param {number} y - The vertical position of this composite in the world.
     * @param {number} columns - The number of columns in the grid.
     * @param {number} rows - The number of rows in the grid.
     * @param {number} columnGap - The distance between each column.
     * @param {number} rowGap - The distance between each row.
     * @param {object} options - [description]
     *
     * @return {Matter.Composite} A Matter JS Composite Stack.
     */
    imageStack: function (key, frame, x, y, columns, rows, columnGap, rowGap, options)
    {
        if (columnGap === undefined) { columnGap = 0; }
        if (rowGap === undefined) { rowGap = 0; }
        if (options === undefined) { options = {}; }

        var world = this.world;
        var displayList = this.sys.displayList;

        options.addToWorld = false;

        var stack = Composites.stack(x, y, columns, rows, columnGap, rowGap, function (x, y)
        {
            var image = new MatterImage(world, x, y, key, frame, options);

            displayList.add(image);

            return image.body;
        });

        world.add(stack);

        return stack;
    },

    /**
     * Create a new composite containing bodies created in the callback in a grid arrangement.
     * This function uses the body bounds to prevent overlaps.
     *
     * @method Phaser.Physics.Matter.Factory#stack
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of this composite in the world.
     * @param {number} y - The vertical position of this composite in the world.
     * @param {number} columns - The number of columns in the grid.
     * @param {number} rows - The number of rows in the grid.
     * @param {number} columnGap - The distance between each column.
     * @param {number} rowGap - The distance between each row.
     * @param {function} callback - The callback that creates the stack.
     *
     * @return {Matter.Composite} A new composite containing objects created in the callback.
     */
    stack: function (x, y, columns, rows, columnGap, rowGap, callback)
    {
        var stack = Composites.stack(x, y, columns, rows, columnGap, rowGap, callback);

        this.world.add(stack);

        return stack;
    },

    /**
     * Create a new composite containing bodies created in the callback in a pyramid arrangement.
     * This function uses the body bounds to prevent overlaps.
     *
     * @method Phaser.Physics.Matter.Factory#pyramid
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of this composite in the world.
     * @param {number} y - The vertical position of this composite in the world.
     * @param {number} columns - The number of columns in the pyramid.
     * @param {number} rows - The number of rows in the pyramid.
     * @param {number} columnGap - The distance between each column.
     * @param {number} rowGap - The distance between each row.
     * @param {function} callback - [description]
     *
     * @return {Matter.Composite} A Matter JS Composite pyramid.
     */
    pyramid: function (x, y, columns, rows, columnGap, rowGap, callback)
    {
        var stack = Composites.pyramid(x, y, columns, rows, columnGap, rowGap, callback);

        this.world.add(stack);

        return stack;
    },

    /**
     * Chains all bodies in the given composite together using constraints.
     *
     * @method Phaser.Physics.Matter.Factory#chain
     * @since 3.0.0
     *
     * @param {Matter.Composite} composite - [description]
     * @param {number} xOffsetA - [description]
     * @param {number} yOffsetA - [description]
     * @param {number} xOffsetB - [description]
     * @param {number} yOffsetB - [description]
     * @param {object} options - [description]
     *
     * @return {Matter.Composite} A new composite containing objects chained together with constraints.
     */
    chain: function (composite, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options)
    {
        return Composites.chain(composite, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options);
    },

    /**
     * Connects bodies in the composite with constraints in a grid pattern, with optional cross braces.
     *
     * @method Phaser.Physics.Matter.Factory#mesh
     * @since 3.0.0
     *
     * @param {Matter.Composite} composite - [description]
     * @param {number} columns - [description]
     * @param {number} rows - [description]
     * @param {boolean} crossBrace - [description]
     * @param {object} options - [description]
     *
     * @return {Matter.Composite} The composite containing objects meshed together with constraints.
     */
    mesh: function (composite, columns, rows, crossBrace, options)
    {
        return Composites.mesh(composite, columns, rows, crossBrace, options);
    },

    /**
     * Creates a composite with a Newton's Cradle setup of bodies and constraints.
     *
     * @method Phaser.Physics.Matter.Factory#newtonsCradle
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} number - [description]
     * @param {number} size - [description]
     * @param {number} length - [description]
     *
     * @return {Matter.Composite} A new composite newtonsCradle body.
     */
    newtonsCradle: function (x, y, number, size, length)
    {
        var composite = Composites.newtonsCradle(x, y, number, size, length);

        this.world.add(composite);

        return composite;
    },

    /**
     * Creates a composite with simple car setup of bodies and constraints.
     *
     * @method Phaser.Physics.Matter.Factory#car
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {number} wheelSize - [description]
     *
     * @return {Matter.Composite} A new composite car body.
     */
    car: function (x, y, width, height, wheelSize)
    {
        var composite = Composites.car(x, y, width, height, wheelSize);

        this.world.add(composite);

        return composite;
    },

    /**
     * Creates a simple soft body like object.
     *
     * @method Phaser.Physics.Matter.Factory#softBody
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of this composite in the world.
     * @param {number} y - The vertical position of this composite in the world.
     * @param {number} columns - The number of columns in the Composite.
     * @param {number} rows - The number of rows in the Composite.
     * @param {number} columnGap - The distance between each column.
     * @param {number} rowGap - The distance between each row.
     * @param {boolean} crossBrace - [description]
     * @param {number} particleRadius - [description]
     * @param {object} particleOptions - [description]
     * @param {object} constraintOptions - [description]
     *
     * @return {Matter.Composite} A new composite simple soft body.
     */
    softBody: function (x, y, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions)
    {
        var composite = Composites.softBody(x, y, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions);

        this.world.add(composite);

        return composite;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Factory#joint
     * @since 3.0.0
     *
     * @param {Matter.Body} bodyA - [description]
     * @param {Matter.Body} bodyB - [description]
     * @param {number} length - [description]
     * @param {number} [stiffness=1] - [description]
     * @param {object} [options={}] - [description]
     *
     * @return {Matter.Constraint} A Matter JS Constraint.
     */
    joint: function (bodyA, bodyB, length, stiffness, options)
    {
        return this.constraint(bodyA, bodyB, length, stiffness, options);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Factory#spring
     * @since 3.0.0
     *
     * @param {Matter.Body} bodyA - [description]
     * @param {Matter.Body} bodyB - [description]
     * @param {number} length - [description]
     * @param {number} [stiffness=1] - [description]
     * @param {object} [options={}] - [description]
     *
     * @return {Matter.Constraint} A Matter JS Constraint.
     */
    spring: function (bodyA, bodyB, length, stiffness, options)
    {
        return this.constraint(bodyA, bodyB, length, stiffness, options);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Factory#constraint
     * @since 3.0.0
     *
     * @param {Matter.Body} bodyA - [description]
     * @param {Matter.Body} bodyB - [description]
     * @param {number} length - [description]
     * @param {number} [stiffness=1] - [description]
     * @param {object} [options={}] - [description]
     *
     * @return {Matter.Constraint} A Matter JS Constraint.
     */
    constraint: function (bodyA, bodyB, length, stiffness, options)
    {
        if (stiffness === undefined) { stiffness = 1; }
        if (options === undefined) { options = {}; }

        options.bodyA = (bodyA.type === 'body') ? bodyA : bodyA.body;
        options.bodyB = (bodyB.type === 'body') ? bodyB : bodyB.body;
        options.length = length;
        options.stiffness = stiffness;

        var constraint = Constraint.create(options);

        this.world.add(constraint);

        return constraint;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Factory#worldConstraint
     * @since 3.0.0
     *
     * @param {Matter.Body} bodyB - [description]
     * @param {number} length - [description]
     * @param {number} [stiffness=1] - [description]
     * @param {object} [options={}] - [description]
     *
     * @return {Matter.Constraint} A Matter JS Constraint.
     */
    worldConstraint: function (bodyB, length, stiffness, options)
    {
        if (stiffness === undefined) { stiffness = 1; }
        if (options === undefined) { options = {}; }

        options.bodyB = (bodyB.type === 'body') ? bodyB : bodyB.body;
        options.length = length;
        options.stiffness = stiffness;

        var constraint = Constraint.create(options);

        this.world.add(constraint);

        return constraint;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Factory#mouseSpring
     * @since 3.0.0
     *
     * @param {object} options - [description]
     *
     * @return {Matter.Constraint} A Matter JS Constraint.
     */
    mouseSpring: function (options)
    {
        return this.pointerConstraint(options);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Factory#pointerConstraint
     * @since 3.0.0
     *
     * @param {object} options - [description]
     *
     * @return {Matter.Constraint} A Matter JS Constraint.
     */
    pointerConstraint: function (options)
    {
        var pointerConstraint = new PointerConstraint(this.scene, this.world, options);

        this.world.add(pointerConstraint.constraint);

        return pointerConstraint;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Factory#image
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of this Game Object in the world.
     * @param {number} y - The vertical position of this Game Object in the world.
     * @param {string} key - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     * @param {object} options - [description]
     *
     * @return {Phaser.Physics.Matter.MatterImage} [description]
     */
    image: function (x, y, key, frame, options)
    {
        var image = new MatterImage(this.world, x, y, key, frame, options);

        this.sys.displayList.add(image);

        return image;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Factory#tileBody
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Tile} tile - [description]
     * @param {object} options - [description]
     *
     * @return {Phaser.Physics.Matter.MatterTileBody} [description]
     */
    tileBody: function (tile, options)
    {
        var tileBody = new MatterTileBody(this.world, tile, options);

        return tileBody;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Factory#sprite
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of this Game Object in the world.
     * @param {number} y - The vertical position of this Game Object in the world.
     * @param {string} key - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     * @param {object} options - [description]
     *
     * @return {Phaser.Physics.Matter.MatterSprite} [description]
     */
    sprite: function (x, y, key, frame, options)
    {
        var sprite = new MatterSprite(this.world, x, y, key, frame, options);

        this.sys.displayList.add(sprite);
        this.sys.updateList.add(sprite);

        return sprite;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Factory#gameObject
     * @since 3.3.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to inject the Matter Body in to.
     * @param {object} options - [description]
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that had the Matter Body injected into it.
     */
    gameObject: function (gameObject, options)
    {
        return MatterGameObject(this.world, gameObject, options);
    }

});

module.exports = Factory;
