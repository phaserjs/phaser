/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * The Matter Factory can create different types of bodies and them to a physics world.
 *
 * @class Factory
 * @memberof Phaser.Physics.Matter
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Matter.World} world - The Matter World which this Factory adds to.
 */
var Factory = new Class({

    initialize:

    function Factory (world)
    {
        /**
         * The Matter World which this Factory adds to.
         *
         * @name Phaser.Physics.Matter.Factory#world
         * @type {Phaser.Physics.Matter.World}
         * @since 3.0.0
         */
        this.world = world;

        /**
         * The Scene which this Factory's Matter World belongs to.
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
     * Creates a new rigid rectangular Body and adds it to the World.
     *
     * @method Phaser.Physics.Matter.Factory#rectangle
     * @since 3.0.0
     *
     * @param {number} x - The X coordinate of the center of the Body.
     * @param {number} y - The Y coordinate of the center of the Body.
     * @param {number} width - The width of the Body.
     * @param {number} height - The height of the Body.
     * @param {object} options - An object of properties to set on the Body. You can also specify a `chamfer` property to automatically adjust the body.
     *
     * @return {MatterJS.Body} A Matter JS Body.
     */
    rectangle: function (x, y, width, height, options)
    {
        var body = Bodies.rectangle(x, y, width, height, options);

        this.world.add(body);

        return body;
    },

    /**
     * Creates a new rigid trapezoidal Body and adds it to the World.
     *
     * @method Phaser.Physics.Matter.Factory#trapezoid
     * @since 3.0.0
     *
     * @param {number} x - The X coordinate of the center of the Body.
     * @param {number} y - The Y coordinate of the center of the Body.
     * @param {number} width - The width of the trapezoid of the Body.
     * @param {number} height - The height of the trapezoid of the Body.
     * @param {number} slope - The slope of the trapezoid. 0 creates a rectangle, while 1 creates a triangle. Positive values make the top side shorter, while negative values make the bottom side shorter.
     * @param {object} options - An object of properties to set on the Body. You can also specify a `chamfer` property to automatically adjust the body.
     *
     * @return {MatterJS.Body} A Matter JS Body.
     */
    trapezoid: function (x, y, width, height, slope, options)
    {
        var body = Bodies.trapezoid(x, y, width, height, slope, options);

        this.world.add(body);

        return body;
    },

    /**
     * Creates a new rigid circular Body and adds it to the World.
     *
     * @method Phaser.Physics.Matter.Factory#circle
     * @since 3.0.0
     *
     * @param {number} x - The X coordinate of the center of the Body.
     * @param {number} y - The Y coordinate of the center of the Body.
     * @param {number} radius - The radius of the circle.
     * @param {object} [options] - An object of properties to set on the Body. You can also specify a `chamfer` property to automatically adjust the body.
     * @param {number} [maxSides] - The maximum amount of sides to use for the polygon which will approximate this circle.
     *
     * @return {MatterJS.Body} A Matter JS Body.
     */
    circle: function (x, y, radius, options, maxSides)
    {
        var body = Bodies.circle(x, y, radius, options, maxSides);

        this.world.add(body);

        return body;
    },

    /**
     * Creates a new rigid polygonal Body and adds it to the World.
     *
     * @method Phaser.Physics.Matter.Factory#polygon
     * @since 3.0.0
     *
     * @param {number} x - The X coordinate of the center of the Body.
     * @param {number} y - The Y coordinate of the center of the Body.
     * @param {number} sides - The number of sides the polygon will have.
     * @param {number} radius - The "radius" of the polygon, i.e. the distance from its center to any vertex. This is also the radius of its circumcircle.
     * @param {object} options - An object of properties to set on the Body. You can also specify a `chamfer` property to automatically adjust the body.
     *
     * @return {MatterJS.Body} A Matter JS Body.
     */
    polygon: function (x, y, sides, radius, options)
    {
        var body = Bodies.polygon(x, y, sides, radius, options);

        this.world.add(body);

        return body;
    },

    /**
     * Creates a body using the supplied vertices (or an array containing multiple sets of vertices) and adds it to the World.
     * If the vertices are convex, they will pass through as supplied. Otherwise, if the vertices are concave, they will be decomposed. Note that this process is not guaranteed to support complex sets of vertices, e.g. ones with holes.
     *
     * @method Phaser.Physics.Matter.Factory#fromVertices
     * @since 3.0.0
     *
     * @param {number} x - The X coordinate of the center of the Body.
     * @param {number} y - The Y coordinate of the center of the Body.
     * @param {array} vertexSets - [description]
     * @param {object} options - [description]
     * @param {boolean} flagInternal - Flag internal edges (coincident part edges)
     * @param {boolean} removeCollinear - Whether Matter.js will discard collinear edges (to improve performance).
     * @param {number} minimumArea - During decomposition discard parts that have an area less than this
     *
     * @return {MatterJS.Body} A Matter JS Body.
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
     * @param {(string|integer)} frame - An optional frame from the Texture this Game Object is rendering with. Set to `null` to skip this value.
     * @param {number} x - The horizontal position of this composite in the world.
     * @param {number} y - The vertical position of this composite in the world.
     * @param {number} columns - The number of columns in the grid.
     * @param {number} rows - The number of rows in the grid.
     * @param {number} [columnGap=0] - The distance between each column.
     * @param {number} [rowGap=0] - The distance between each row.
     * @param {object} [options] - [description]
     *
     * @return {MatterJS.Composite} A Matter JS Composite Stack.
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
     * @return {MatterJS.Composite} A new composite containing objects created in the callback.
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
     * @param {function} callback - The callback function to be invoked.
     *
     * @return {MatterJS.Composite} A Matter JS Composite pyramid.
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
     * @param {MatterJS.Composite} composite - [description]
     * @param {number} xOffsetA - [description]
     * @param {number} yOffsetA - [description]
     * @param {number} xOffsetB - [description]
     * @param {number} yOffsetB - [description]
     * @param {object} options - [description]
     *
     * @return {MatterJS.Composite} A new composite containing objects chained together with constraints.
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
     * @param {MatterJS.Composite} composite - [description]
     * @param {number} columns - [description]
     * @param {number} rows - [description]
     * @param {boolean} crossBrace - [description]
     * @param {object} options - [description]
     *
     * @return {MatterJS.Composite} The composite containing objects meshed together with constraints.
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
     * @return {MatterJS.Composite} A new composite newtonsCradle body.
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
     * @return {MatterJS.Composite} A new composite car body.
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
     * @param {number} particleRadius - The radius of this circlular composite.
     * @param {object} particleOptions - [description]
     * @param {object} constraintOptions - [description]
     *
     * @return {MatterJS.Composite} A new composite simple soft body.
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
     * @param {MatterJS.Body} bodyA - [description]
     * @param {MatterJS.Body} bodyB - [description]
     * @param {number} length - [description]
     * @param {number} [stiffness=1] - [description]
     * @param {object} [options={}] - [description]
     *
     * @return {MatterJS.Constraint} A Matter JS Constraint.
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
     * @param {MatterJS.Body} bodyA - The first possible `Body` that this constraint is attached to.
     * @param {MatterJS.Body} bodyB - The second possible `Body` that this constraint is attached to.
     * @param {number} length - A Number that specifies the target resting length of the constraint. It is calculated automatically in `Constraint.create` from initial positions of the `constraint.bodyA` and `constraint.bodyB`
     * @param {number} [stiffness=1] - A Number that specifies the stiffness of the constraint, i.e. the rate at which it returns to its resting `constraint.length`. A value of `1` means the constraint should be very stiff. A value of `0.2` means the constraint acts as a soft spring.
     * @param {object} [options={}] - [description]
     *
     * @return {MatterJS.Constraint} A Matter JS Constraint.
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
     * @param {MatterJS.Body} bodyA - [description]
     * @param {MatterJS.Body} bodyB - [description]
     * @param {number} length - [description]
     * @param {number} [stiffness=1] - [description]
     * @param {object} [options={}] - [description]
     *
     * @return {MatterJS.Constraint} A Matter JS Constraint.
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
     * @param {MatterJS.Body} bodyB - [description]
     * @param {number} length - [description]
     * @param {number} [stiffness=1] - [description]
     * @param {object} [options={}] - [description]
     *
     * @return {MatterJS.Constraint} A Matter JS Constraint.
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
     * @return {MatterJS.Constraint} A Matter JS Constraint.
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
     * @return {MatterJS.Constraint} A Matter JS Constraint.
     */
    pointerConstraint: function (options)
    {
        if (options === undefined) { options = {}; }

        if (!options.hasOwnProperty('render'))
        {
            options.render = { visible: false };
        }

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
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with. Set to `null` to skip this value.
     * @param {object} [options={}] - [description]
     *
     * @return {Phaser.Physics.Matter.Image} [description]
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
     * @param {Phaser.Tilemaps.Tile} tile - [description]
     * @param {object} options - [description]
     *
     * @return {Phaser.Physics.Matter.TileBody} [description]
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
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with. Set to `null` to skip this value.
     * @param {object} [options={}] - [description]
     *
     * @return {Phaser.Physics.Matter.Sprite} [description]
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
    },

    /**
     * Destroys this Factory.
     *
     * @method Phaser.Physics.Matter.Factory#destroy
     * @since 3.5.0
     */
    destroy: function ()
    {
        this.world = null;
        this.scene = null;
        this.sys = null;
    }

});

module.exports = Factory;
