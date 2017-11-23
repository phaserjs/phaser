var Bodies = require('./lib/factory/Bodies');
var Class = require('../../utils/Class');
var Composites = require('./lib/factory/Composites');
var Constraint = require('./lib/constraint/Constraint');
var MatterImage = require('./MatterImage');
var MatterSprite = require('./MatterSprite');
var PointerConstraint = require('./PointerConstraint');

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

var Factory = new Class({

    initialize:

    function Factory (world)
    {
        this.world = world;

        this.scene = world.scene;

        this.sys = world.scene.sys;
    },

    rectangle: function (x, y, width, height, options)
    {
        var body = Bodies.rectangle(x, y, width, height, options);

        this.world.add(body);

        return body;
    },

    trapezoid: function (x, y, width, height, slope, options)
    {
        var body = Bodies.trapezoid(x, y, width, height, slope, options);

        this.world.add(body);

        return body;
    },

    circle: function (x, y, radius, options, maxSides)
    {
        var body = Bodies.circle(x, y, radius, options, maxSides);

        this.world.add(body);

        return body;
    },

    polygon: function (x, y, sides, radius, options)
    {
        var body = Bodies.polygon(x, y, sides, radius, options);

        this.world.add(body);

        return body;
    },

    fromVertices: function (x, y, vertexSets, options, flagInternal, removeCollinear, minimumArea)
    {
        var body = Bodies.fromVertices(x, y, vertexSets, options, flagInternal, removeCollinear, minimumArea);

        this.world.add(body);

        return body;
    },

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

    stack: function (x, y, columns, rows, columnGap, rowGap, callback)
    {
        var stack = Composites.stack(x, y, columns, rows, columnGap, rowGap, callback);

        this.world.add(stack);

        return stack;
    },

    //  To help those used to Box2D
    joint: function (bodyA, bodyB, length, stiffness, options)
    {
        return this.constraint(bodyA, bodyB, length, stiffness, options);
    },

    spring: function (bodyA, bodyB, length, stiffness, options)
    {
        return this.constraint(bodyA, bodyB, length, stiffness, options);
    },

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

    mouseSpring: function (options)
    {
        return this.pointerConstraint(options);
    },

    pointerConstraint: function (options)
    {
        var pointerConstraint = new PointerConstraint(this.scene, this.world, options);

        this.world.add(pointerConstraint.constraint);

        return pointerConstraint;
    },

    image: function (x, y, key, frame, options)
    {
        var image = new MatterImage(this.world, x, y, key, frame, options);

        this.sys.displayList.add(image);

        return image;
    },

    sprite: function (x, y, key, frame, options)
    {
        var sprite = new MatterSprite(this.world, x, y, key, frame, options);

        this.sys.displayList.add(sprite);
        this.sys.updateList.add(sprite);

        return sprite;
    },

    /*
    group: function (children, config)
    {
        return this.sys.updateList.add(new PhysicsGroup(this.world, this.world.scene, children, config));
    }
    */

});

module.exports = Factory;
