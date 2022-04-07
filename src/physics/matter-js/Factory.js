/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Bodies = require('./lib/factory/Bodies');
var Class = require('../../utils/Class');
var Composites = require('./lib/factory/Composites');
var Constraint = require('./lib/constraint/Constraint');
var Svg = require('./lib/geometry/Svg');
var MatterGameObject = require('./MatterGameObject');
var MatterImage = require('./MatterImage');
var MatterSprite = require('./MatterSprite');
var MatterTileBody = require('./MatterTileBody');
var PhysicsEditorParser = require('./PhysicsEditorParser');
var PhysicsJSONParser = require('./PhysicsJSONParser');
var PointerConstraint = require('./PointerConstraint');
var Vertices = require('./lib/geometry/Vertices');

/**
 * @classdesc
 * The Matter Factory is responsible for quickly creating a variety of different types of
 * bodies, constraints and Game Objects and adding them into the physics world.
 *
 * You access the factory from within a Scene using `add`:
 *
 * ```javascript
 * this.matter.add.rectangle(x, y, width, height);
 * ```
 *
 * Use of the Factory is optional. All of the objects it creates can also be created
 * directly via your own code or constructors. It is provided as a means to keep your
 * code concise.
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
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     *
     * @return {MatterJS.BodyType} A Matter JS Body.
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
     * @param {number} width - The width of the trapezoid Body.
     * @param {number} height - The height of the trapezoid Body.
     * @param {number} slope - The slope of the trapezoid. 0 creates a rectangle, while 1 creates a triangle. Positive values make the top side shorter, while negative values make the bottom side shorter.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     *
     * @return {MatterJS.BodyType} A Matter JS Body.
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
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     * @param {number} [maxSides] - The maximum amount of sides to use for the polygon which will approximate this circle.
     *
     * @return {MatterJS.BodyType} A Matter JS Body.
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
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     *
     * @return {MatterJS.BodyType} A Matter JS Body.
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
     * @param {(string|array)} vertexSets - The vertices data. Either a path string or an array of vertices.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     * @param {boolean} [flagInternal=false] - Flag internal edges (coincident part edges)
     * @param {number} [removeCollinear=0.01] - Whether Matter.js will discard collinear edges (to improve performance).
     * @param {number} [minimumArea=10] - During decomposition discard parts that have an area less than this.
     *
     * @return {MatterJS.BodyType} A Matter JS Body.
     */
    fromVertices: function (x, y, vertexSets, options, flagInternal, removeCollinear, minimumArea)
    {
        if (typeof vertexSets === 'string')
        {
            vertexSets = Vertices.fromPath(vertexSets);
        }

        var body = Bodies.fromVertices(x, y, vertexSets, options, flagInternal, removeCollinear, minimumArea);

        this.world.add(body);

        return body;
    },

    /**
     * Creates a body using data exported from the application PhysicsEditor (https://www.codeandweb.com/physicseditor)
     *
     * The PhysicsEditor file should be loaded as JSON:
     *
     * ```javascript
     * preload ()
     * {
     *   this.load.json('vehicles', 'assets/vehicles.json);
     * }
     *
     * create ()
     * {
     *   const vehicleShapes = this.cache.json.get('vehicles');
     *   this.matter.add.fromPhysicsEditor(400, 300, vehicleShapes.truck);
     * }
     * ```
     *
     * Do not pass the entire JSON file to this method, but instead pass one of the shapes contained within it.
     *
     * If you pas in an `options` object, any settings in there will override those in the PhysicsEditor config object.
     *
     * @method Phaser.Physics.Matter.Factory#fromPhysicsEditor
     * @since 3.22.0
     *
     * @param {number} x - The horizontal world location of the body.
     * @param {number} y - The vertical world location of the body.
     * @param {any} config - The JSON data exported from PhysicsEditor.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     * @param {boolean} [addToWorld=true] - Should the newly created body be immediately added to the World?
     *
     * @return {MatterJS.BodyType} A Matter JS Body.
     */
    fromPhysicsEditor: function (x, y, config, options, addToWorld)
    {
        if (addToWorld === undefined) { addToWorld = true; }

        var body = PhysicsEditorParser.parseBody(x, y, config, options);

        if (addToWorld && !this.world.has(body))
        {
            this.world.add(body);
        }

        return body;
    },

    /**
     * Creates a body using the path data from an SVG file.
     *
     * SVG Parsing requires the pathseg polyfill from https://github.com/progers/pathseg
     *
     * The SVG file should be loaded as XML, as this method requires the ability to extract
     * the path data from it. I.e.:
     *
     * ```javascript
     * preload ()
     * {
     *   this.load.xml('face', 'assets/face.svg);
     * }
     *
     * create ()
     * {
     *   this.matter.add.fromSVG(400, 300, this.cache.xml.get('face'));
     * }
     * ```
     *
     * @method Phaser.Physics.Matter.Factory#fromSVG
     * @since 3.22.0
     *
     * @param {number} x - The X coordinate of the body.
     * @param {number} y - The Y coordinate of the body.
     * @param {object} xml - The SVG Path data.
     * @param {number} [scale=1] - Scale the vertices by this amount after creation.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     * @param {boolean} [addToWorld=true] - Should the newly created body be immediately added to the World?
     *
     * @return {MatterJS.BodyType} A Matter JS Body.
     */
    fromSVG: function (x, y, xml, scale, options, addToWorld)
    {
        if (scale === undefined) { scale = 1; }
        if (options === undefined) { options = {}; }
        if (addToWorld === undefined) { addToWorld = true; }

        var path = xml.getElementsByTagName('path');
        var vertexSets = [];

        for (var i = 0; i < path.length; i++)
        {
            var points = Svg.pathToVertices(path[i], 30);

            if (scale !== 1)
            {
                Vertices.scale(points, scale, scale);
            }

            vertexSets.push(points);
        }

        var body = Bodies.fromVertices(x, y, vertexSets, options);

        if (addToWorld)
        {
            this.world.add(body);
        }

        return body;
    },

    /**
     * Creates a body using the supplied physics data, as provided by a JSON file.
     *
     * The data file should be loaded as JSON:
     *
     * ```javascript
     * preload ()
     * {
     *   this.load.json('ninjas', 'assets/ninjas.json);
     * }
     *
     * create ()
     * {
     *   const ninjaShapes = this.cache.json.get('ninjas');
     *
     *   this.matter.add.fromJSON(400, 300, ninjaShapes.shinobi);
     * }
     * ```
     *
     * Do not pass the entire JSON file to this method, but instead pass one of the shapes contained within it.
     *
     * If you pas in an `options` object, any settings in there will override those in the config object.
     *
     * The structure of the JSON file is as follows:
     *
     * ```text
     * {
     *   'generator_info': // The name of the application that created the JSON data
     *   'shapeName': {
     *     'type': // The type of body
     *     'label': // Optional body label
     *     'vertices': // An array, or an array of arrays, containing the vertex data in x/y object pairs
     *   }
     * }
     * ```
     *
     * At the time of writing, only the Phaser Physics Tracer App exports in this format.
     *
     * @method Phaser.Physics.Matter.Factory#fromJSON
     * @since 3.22.0
     *
     * @param {number} x - The X coordinate of the body.
     * @param {number} y - The Y coordinate of the body.
     * @param {any} config - The JSON physics data.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     * @param {boolean} [addToWorld=true] - Should the newly created body be immediately added to the World?
     *
     * @return {MatterJS.BodyType} A Matter JS Body.
     */
    fromJSON: function (x, y, config, options, addToWorld)
    {
        if (options === undefined) { options = {}; }
        if (addToWorld === undefined) { addToWorld = true; }

        var body = PhysicsJSONParser.parseBody(x, y, config, options);

        if (body && addToWorld)
        {
            this.world.add(body);
        }

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
     * @param {(string|number)} frame - An optional frame from the Texture this Game Object is rendering with. Set to `null` to skip this value.
     * @param {number} x - The horizontal position of this composite in the world.
     * @param {number} y - The vertical position of this composite in the world.
     * @param {number} columns - The number of columns in the grid.
     * @param {number} rows - The number of rows in the grid.
     * @param {number} [columnGap=0] - The distance between each column.
     * @param {number} [rowGap=0] - The distance between each row.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     *
     * @return {MatterJS.CompositeType} A Matter JS Composite Stack.
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
     *
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
     * @return {MatterJS.CompositeType} A new composite containing objects created in the callback.
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
     * @return {MatterJS.CompositeType} A Matter JS Composite pyramid.
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
     * @param {MatterJS.CompositeType} composite - The composite in which all bodies will be chained together sequentially.
     * @param {number} xOffsetA - The horizontal offset of the BodyA constraint. This is a percentage based on the body size, not a world position.
     * @param {number} yOffsetA - The vertical offset of the BodyA constraint. This is a percentage based on the body size, not a world position.
     * @param {number} xOffsetB - The horizontal offset of the BodyB constraint. This is a percentage based on the body size, not a world position.
     * @param {number} yOffsetB - The vertical offset of the BodyB constraint. This is a percentage based on the body size, not a world position.
     * @param {Phaser.Types.Physics.Matter.MatterConstraintConfig} [options] - An optional Constraint configuration object that is used to set initial Constraint properties on creation.
     *
     * @return {MatterJS.CompositeType} The original composite that was passed to this method.
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
     * @param {MatterJS.CompositeType} composite - The composite in which all bodies will be chained together.
     * @param {number} columns - The number of columns in the mesh.
     * @param {number} rows - The number of rows in the mesh.
     * @param {boolean} crossBrace - Create cross braces for the mesh as well?
     * @param {Phaser.Types.Physics.Matter.MatterConstraintConfig} [options] - An optional Constraint configuration object that is used to set initial Constraint properties on creation.
     *
     * @return {MatterJS.CompositeType} The original composite that was passed to this method.
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
     * @param {number} x - The horizontal position of the start of the cradle.
     * @param {number} y - The vertical position of the start of the cradle.
     * @param {number} number - The number of balls in the cradle.
     * @param {number} size - The radius of each ball in the cradle.
     * @param {number} length - The length of the 'string' the balls hang from.
     *
     * @return {MatterJS.CompositeType} A Newton's cradle composite.
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
     * @param {number} x - The horizontal position of the car in the world.
     * @param {number} y - The vertical position of the car in the world.
     * @param {number} width - The width of the car chasis.
     * @param {number} height - The height of the car chasis.
     * @param {number} wheelSize - The radius of the car wheels.
     *
     * @return {MatterJS.CompositeType} A new composite car body.
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
     * @param {boolean} crossBrace - `true` to create cross braces between the bodies, or `false` to create just straight braces.
     * @param {number} particleRadius - The radius of this circlular composite.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [particleOptions] - An optional Body configuration object that is used to set initial Body properties on creation.
     * @param {Phaser.Types.Physics.Matter.MatterConstraintConfig} [constraintOptions] - An optional Constraint configuration object that is used to set initial Constraint properties on creation.
     *
     * @return {MatterJS.CompositeType} A new composite simple soft body.
     */
    softBody: function (x, y, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions)
    {
        var composite = Composites.softBody(x, y, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions);

        this.world.add(composite);

        return composite;
    },

    /**
     * This method is an alias for `Factory.constraint`.
     *
     * Constraints (or joints) are used for specifying that a fixed distance must be maintained
     * between two bodies, or a body and a fixed world-space position.
     *
     * The stiffness of constraints can be modified to create springs or elastic.
     *
     * To simulate a revolute constraint (or pin joint) set `length: 0` and a high `stiffness`
     * value (e.g. `0.7` or above).
     *
     * If the constraint is unstable, try lowering the `stiffness` value and / or increasing
     * `constraintIterations` within the Matter Config.
     *
     * For compound bodies, constraints must be applied to the parent body and not one of its parts.
     *
     * @method Phaser.Physics.Matter.Factory#joint
     * @since 3.0.0
     *
     * @param {MatterJS.BodyType} bodyA - The first possible `Body` that this constraint is attached to.
     * @param {MatterJS.BodyType} bodyB - The second possible `Body` that this constraint is attached to.
     * @param {number} [length] - A Number that specifies the target resting length of the constraint. If not given it is calculated automatically in `Constraint.create` from initial positions of the `constraint.bodyA` and `constraint.bodyB`.
     * @param {number} [stiffness=1] - A Number that specifies the stiffness of the constraint, i.e. the rate at which it returns to its resting `constraint.length`. A value of `1` means the constraint should be very stiff. A value of `0.2` means the constraint acts as a soft spring.
     * @param {Phaser.Types.Physics.Matter.MatterConstraintConfig} [options] - An optional Constraint configuration object that is used to set initial Constraint properties on creation.
     *
     * @return {MatterJS.ConstraintType} A Matter JS Constraint.
     */
    joint: function (bodyA, bodyB, length, stiffness, options)
    {
        return this.constraint(bodyA, bodyB, length, stiffness, options);
    },

    /**
     * This method is an alias for `Factory.constraint`.
     *
     * Constraints (or joints) are used for specifying that a fixed distance must be maintained
     * between two bodies, or a body and a fixed world-space position.
     *
     * The stiffness of constraints can be modified to create springs or elastic.
     *
     * To simulate a revolute constraint (or pin joint) set `length: 0` and a high `stiffness`
     * value (e.g. `0.7` or above).
     *
     * If the constraint is unstable, try lowering the `stiffness` value and / or increasing
     * `constraintIterations` within the Matter Config.
     *
     * For compound bodies, constraints must be applied to the parent body and not one of its parts.
     *
     * @method Phaser.Physics.Matter.Factory#spring
     * @since 3.0.0
     *
     * @param {MatterJS.BodyType} bodyA - The first possible `Body` that this constraint is attached to.
     * @param {MatterJS.BodyType} bodyB - The second possible `Body` that this constraint is attached to.
     * @param {number} [length] - A Number that specifies the target resting length of the constraint. If not given it is calculated automatically in `Constraint.create` from initial positions of the `constraint.bodyA` and `constraint.bodyB`.
     * @param {number} [stiffness=1] - A Number that specifies the stiffness of the constraint, i.e. the rate at which it returns to its resting `constraint.length`. A value of `1` means the constraint should be very stiff. A value of `0.2` means the constraint acts as a soft spring.
     * @param {Phaser.Types.Physics.Matter.MatterConstraintConfig} [options] - An optional Constraint configuration object that is used to set initial Constraint properties on creation.
     *
     * @return {MatterJS.ConstraintType} A Matter JS Constraint.
     */
    spring: function (bodyA, bodyB, length, stiffness, options)
    {
        return this.constraint(bodyA, bodyB, length, stiffness, options);
    },

    /**
     * Constraints (or joints) are used for specifying that a fixed distance must be maintained
     * between two bodies, or a body and a fixed world-space position.
     *
     * The stiffness of constraints can be modified to create springs or elastic.
     *
     * To simulate a revolute constraint (or pin joint) set `length: 0` and a high `stiffness`
     * value (e.g. `0.7` or above).
     *
     * If the constraint is unstable, try lowering the `stiffness` value and / or increasing
     * `constraintIterations` within the Matter Config.
     *
     * For compound bodies, constraints must be applied to the parent body and not one of its parts.
     *
     * @method Phaser.Physics.Matter.Factory#constraint
     * @since 3.0.0
     *
     * @param {MatterJS.BodyType} bodyA - The first possible `Body` that this constraint is attached to.
     * @param {MatterJS.BodyType} bodyB - The second possible `Body` that this constraint is attached to.
     * @param {number} [length] - A Number that specifies the target resting length of the constraint. If not given it is calculated automatically in `Constraint.create` from initial positions of the `constraint.bodyA` and `constraint.bodyB`.
     * @param {number} [stiffness=1] - A Number that specifies the stiffness of the constraint, i.e. the rate at which it returns to its resting `constraint.length`. A value of `1` means the constraint should be very stiff. A value of `0.2` means the constraint acts as a soft spring.
     * @param {Phaser.Types.Physics.Matter.MatterConstraintConfig} [options] - An optional Constraint configuration object that is used to set initial Constraint properties on creation.
     *
     * @return {MatterJS.ConstraintType} A Matter JS Constraint.
     */
    constraint: function (bodyA, bodyB, length, stiffness, options)
    {
        if (stiffness === undefined) { stiffness = 1; }
        if (options === undefined) { options = {}; }

        options.bodyA = (bodyA.type === 'body') ? bodyA : bodyA.body;
        options.bodyB = (bodyB.type === 'body') ? bodyB : bodyB.body;

        if (!isNaN(length))
        {
            options.length = length;
        }

        options.stiffness = stiffness;

        var constraint = Constraint.create(options);

        this.world.add(constraint);

        return constraint;
    },

    /**
     * Constraints (or joints) are used for specifying that a fixed distance must be maintained
     * between two bodies, or a body and a fixed world-space position.
     *
     * A world constraint has only one body, you should specify a `pointA` position in
     * the constraint options parameter to attach the constraint to the world.
     *
     * The stiffness of constraints can be modified to create springs or elastic.
     *
     * To simulate a revolute constraint (or pin joint) set `length: 0` and a high `stiffness`
     * value (e.g. `0.7` or above).
     *
     * If the constraint is unstable, try lowering the `stiffness` value and / or increasing
     * `constraintIterations` within the Matter Config.
     *
     * For compound bodies, constraints must be applied to the parent body and not one of its parts.
     *
     * @method Phaser.Physics.Matter.Factory#worldConstraint
     * @since 3.0.0
     *
     * @param {MatterJS.BodyType} body - The Matter `Body` that this constraint is attached to.
     * @param {number} [length] - A number that specifies the target resting length of the constraint. If not given it is calculated automatically in `Constraint.create` from initial positions of the `constraint.bodyA` and `constraint.bodyB`.
     * @param {number} [stiffness=1] - A Number that specifies the stiffness of the constraint, i.e. the rate at which it returns to its resting `constraint.length`. A value of `1` means the constraint should be very stiff. A value of `0.2` means the constraint acts as a soft spring.
     * @param {Phaser.Types.Physics.Matter.MatterConstraintConfig} [options] - An optional Constraint configuration object that is used to set initial Constraint properties on creation.
     *
     * @return {MatterJS.ConstraintType} A Matter JS Constraint.
     */
    worldConstraint: function (body, length, stiffness, options)
    {
        if (stiffness === undefined) { stiffness = 1; }
        if (options === undefined) { options = {}; }

        options.bodyB = (body.type === 'body') ? body : body.body;

        if (!isNaN(length))
        {
            options.length = length;
        }

        options.stiffness = stiffness;

        var constraint = Constraint.create(options);

        this.world.add(constraint);

        return constraint;
    },

    /**
     * This method is an alias for `Factory.pointerConstraint`.
     *
     * A Pointer Constraint is a special type of constraint that allows you to click
     * and drag bodies in a Matter World. It monitors the active Pointers in a Scene,
     * and when one is pressed down it checks to see if that hit any part of any active
     * body in the world. If it did, and the body has input enabled, it will begin to
     * drag it until either released, or you stop it via the `stopDrag` method.
     *
     * You can adjust the stiffness, length and other properties of the constraint via
     * the `options` object on creation.
     *
     * @method Phaser.Physics.Matter.Factory#mouseSpring
     * @since 3.0.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterConstraintConfig} [options] - An optional Constraint configuration object that is used to set initial Constraint properties on creation.
     *
     * @return {MatterJS.ConstraintType} A Matter JS Constraint.
     */
    mouseSpring: function (options)
    {
        return this.pointerConstraint(options);
    },

    /**
     * A Pointer Constraint is a special type of constraint that allows you to click
     * and drag bodies in a Matter World. It monitors the active Pointers in a Scene,
     * and when one is pressed down it checks to see if that hit any part of any active
     * body in the world. If it did, and the body has input enabled, it will begin to
     * drag it until either released, or you stop it via the `stopDrag` method.
     *
     * You can adjust the stiffness, length and other properties of the constraint via
     * the `options` object on creation.
     *
     * @method Phaser.Physics.Matter.Factory#pointerConstraint
     * @since 3.0.0
     *
     * @param {Phaser.Types.Physics.Matter.MatterConstraintConfig} [options] - An optional Constraint configuration object that is used to set initial Constraint properties on creation.
     *
     * @return {MatterJS.ConstraintType} A Matter JS Constraint.
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
     * Creates a Matter Physics Image Game Object.
     *
     * An Image is a light-weight Game Object useful for the display of static images in your game,
     * such as logos, backgrounds, scenery or other non-animated elements. Images can have input
     * events and physics bodies, or be tweened, tinted or scrolled. The main difference between an
     * Image and a Sprite is that you cannot animate an Image as they do not have the Animation component.
     *
     * @method Phaser.Physics.Matter.Factory#image
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of this Game Object in the world.
     * @param {number} y - The vertical position of this Game Object in the world.
     * @param {string} key - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with. Set to `null` to skip this value.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     *
     * @return {Phaser.Physics.Matter.Image} The Matter Image Game Object.
     */
    image: function (x, y, key, frame, options)
    {
        var image = new MatterImage(this.world, x, y, key, frame, options);

        this.sys.displayList.add(image);

        return image;
    },

    /**
     * Creates a wrapper around a Tile that provides access to a corresponding Matter body. A tile can only
     * have one Matter body associated with it. You can either pass in an existing Matter body for
     * the tile or allow the constructor to create the corresponding body for you. If the Tile has a
     * collision group (defined in Tiled), those shapes will be used to create the body. If not, the
     * tile's rectangle bounding box will be used.
     *
     * The corresponding body will be accessible on the Tile itself via Tile.physics.matterBody.
     *
     * Note: not all Tiled collision shapes are supported. See
     * Phaser.Physics.Matter.TileBody#setFromTileCollision for more information.
     *
     * @method Phaser.Physics.Matter.Factory#tileBody
     * @since 3.0.0
     *
     * @param {Phaser.Tilemaps.Tile} tile - The target tile that should have a Matter body.
     * @param {Phaser.Types.Physics.Matter.MatterTileOptions} [options] - Options to be used when creating the Matter body.
     *
     * @return {Phaser.Physics.Matter.TileBody} The Matter Tile Body Game Object.
     */
    tileBody: function (tile, options)
    {
        return new MatterTileBody(this.world, tile, options);
    },

    /**
     * Creates a Matter Physics Sprite Game Object.
     *
     * A Sprite Game Object is used for the display of both static and animated images in your game.
     * Sprites can have input events and physics bodies. They can also be tweened, tinted, scrolled
     * and animated.
     *
     * The main difference between a Sprite and an Image Game Object is that you cannot animate Images.
     * As such, Sprites take a fraction longer to process and have a larger API footprint due to the Animation
     * Component. If you do not require animation then you can safely use Images to replace Sprites in all cases.
     *
     * @method Phaser.Physics.Matter.Factory#sprite
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of this Game Object in the world.
     * @param {number} y - The vertical position of this Game Object in the world.
     * @param {string} key - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with. Set to `null` to skip this value.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     *
     * @return {Phaser.Physics.Matter.Sprite} The Matter Sprite Game Object.
     */
    sprite: function (x, y, key, frame, options)
    {
        var sprite = new MatterSprite(this.world, x, y, key, frame, options);

        this.sys.displayList.add(sprite);
        this.sys.updateList.add(sprite);

        return sprite;
    },

    /**
     * Takes an existing Game Object and injects all of the Matter Components into it.
     *
     * This enables you to use component methods such as `setVelocity` or `isSensor` directly from
     * this Game Object.
     *
     * You can also pass in either a Matter Body Configuration object, or a Matter Body instance
     * to link with this Game Object.
     *
     * @method Phaser.Physics.Matter.Factory#gameObject
     * @since 3.3.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to inject the Matter Components in to.
     * @param {(Phaser.Types.Physics.Matter.MatterBodyConfig|MatterJS.Body)} [options] - A Matter Body configuration object, or an instance of a Matter Body.
     * @param {boolean} [addToWorld=true] - Add this Matter Body to the World?
     *
     * @return {(Phaser.Physics.Matter.Image|Phaser.Physics.Matter.Sprite|Phaser.GameObjects.GameObject)} The Game Object that had the Matter Components injected into it.
     */
    gameObject: function (gameObject, options, addToWorld)
    {
        return MatterGameObject(this.world, gameObject, options, addToWorld);
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
