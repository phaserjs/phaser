/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Bodies = require('../lib/factory/Bodies');
var Body = require('../lib/body/Body');
var FuzzyEquals = require('../../../math/fuzzy/Equal');
var GetFastValue = require('../../../utils/object/GetFastValue');
var PhysicsEditorParser = require('../PhysicsEditorParser');
var PhysicsJSONParser = require('../PhysicsJSONParser');
var Vertices = require('../lib/geometry/Vertices');

/**
 * Enables a Matter-enabled Game Object to set its Body. Should be used as a mixin and not directly.
 *
 * @namespace Phaser.Physics.Matter.Components.SetBody
 * @since 3.0.0
 */
var SetBody = {

    /**
     * Set the body on a Game Object to a rectangle.
     * 
     * Calling this methods resets previous properties you may have set on the body, including
     * plugins, mass, friction, etc. So be sure to re-apply these in the options object if needed.
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setRectangle
     * @since 3.0.0
     *
     * @param {number} width - Width of the rectangle.
     * @param {number} height - Height of the rectangle.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setRectangle: function (width, height, options)
    {
        return this.setBody({ type: 'rectangle', width: width, height: height }, options);
    },

    /**
     * Set the body on a Game Object to a circle.
     * 
     * Calling this methods resets previous properties you may have set on the body, including
     * plugins, mass, friction, etc. So be sure to re-apply these in the options object if needed.
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setCircle
     * @since 3.0.0
     *
     * @param {number} radius - The radius of the circle.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setCircle: function (radius, options)
    {
        return this.setBody({ type: 'circle', radius: radius }, options);
    },

    /**
     * Set the body on the Game Object to a polygon shape.
     * 
     * Calling this methods resets previous properties you may have set on the body, including
     * plugins, mass, friction, etc. So be sure to re-apply these in the options object if needed.
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setPolygon
     * @since 3.0.0
     *
     * @param {number} sides - The number of sides the polygon will have.
     * @param {number} radius - The "radius" of the polygon, i.e. the distance from its center to any vertex. This is also the radius of its circumcircle.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setPolygon: function (radius, sides, options)
    {
        return this.setBody({ type: 'polygon', sides: sides, radius: radius }, options);
    },

    /**
     * Set the body on the Game Object to a trapezoid shape.
     * 
     * Calling this methods resets previous properties you may have set on the body, including
     * plugins, mass, friction, etc. So be sure to re-apply these in the options object if needed.
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setTrapezoid
     * @since 3.0.0
     *
     * @param {number} width - The width of the trapezoid Body.
     * @param {number} height - The height of the trapezoid Body.
     * @param {number} slope - The slope of the trapezoid. 0 creates a rectangle, while 1 creates a triangle. Positive values make the top side shorter, while negative values make the bottom side shorter.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setTrapezoid: function (width, height, slope, options)
    {
        return this.setBody({ type: 'trapezoid', width: width, height: height, slope: slope }, options);
    },

    /**
     * Set this Game Object to use the given existing Matter Body.
     * 
     * The body is first removed from the world before being added to this Game Object.
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setExistingBody
     * @since 3.0.0
     *
     * @param {MatterJS.BodyType} body - The Body this Game Object should use.
     * @param {boolean} [addToWorld=true] - Should the body be immediately added to the World?
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setExistingBody: function (body, addToWorld)
    {
        if (addToWorld === undefined) { addToWorld = true; }

        if (this.body)
        {
            this.world.remove(this.body, true);
        }

        this.body = body;

        for (var i = 0; i < body.parts.length; i++)
        {
            body.parts[i].gameObject = this;
        }

        var _this = this;

        body.destroy = function destroy ()
        {
            _this.world.remove(_this.body, true);
            _this.body.gameObject = null;
        };

        if (addToWorld)
        {
            if (this.world.has(body))
            {
                //  Because it could be part of another Composite
                this.world.remove(body, true);
            }

            this.world.add(body);
        }

        if (this._originComponent)
        {
            var rx = body.render.sprite.xOffset;
            var ry = body.render.sprite.yOffset;

            var comx = body.centerOfMass.x;
            var comy = body.centerOfMass.y;

            if (FuzzyEquals(comx, 0.5) && FuzzyEquals(comy, 0.5))
            {
                this.setOrigin(rx + 0.5, ry + 0.5);
            }
            else
            {
                var cx = body.centerOffset.x;
                var cy = body.centerOffset.y;

                this.setOrigin(rx + (cx / this.displayWidth), ry + (cy / this.displayHeight));
            }
        }

        return this;
    },

    /**
     * Set this Game Object to create and use a new Body based on the configuration object given.
     * 
     * Calling this method resets previous properties you may have set on the body, including
     * plugins, mass, friction, etc. So be sure to re-apply these in the options object if needed.
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setBody
     * @since 3.0.0
     *
     * @param {(string|Phaser.Types.Physics.Matter.MatterSetBodyConfig)} config - Either a string, such as `circle`, or a Matter Set Body Configuration object.
     * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setBody: function (config, options)
    {
        if (!config)
        {
            return this;
        }

        var body;

        //  Allow them to do: shape: 'circle' instead of shape: { type: 'circle' }
        if (typeof config === 'string')
        {
            //  Using defaults
            config = { type: config };
        }

        var shapeType = GetFastValue(config, 'type', 'rectangle');
        var bodyX = GetFastValue(config, 'x', this._tempVec2.x);
        var bodyY = GetFastValue(config, 'y', this._tempVec2.y);
        var bodyWidth = GetFastValue(config, 'width', this.width);
        var bodyHeight = GetFastValue(config, 'height', this.height);

        switch (shapeType)
        {
            case 'rectangle':
                body = Bodies.rectangle(bodyX, bodyY, bodyWidth, bodyHeight, options);
                break;

            case 'circle':
                var radius = GetFastValue(config, 'radius', Math.max(bodyWidth, bodyHeight) / 2);
                var maxSides = GetFastValue(config, 'maxSides', 25);
                body = Bodies.circle(bodyX, bodyY, radius, options, maxSides);
                break;

            case 'trapezoid':
                var slope = GetFastValue(config, 'slope', 0.5);
                body = Bodies.trapezoid(bodyX, bodyY, bodyWidth, bodyHeight, slope, options);
                break;

            case 'polygon':
                var sides = GetFastValue(config, 'sides', 5);
                var pRadius = GetFastValue(config, 'radius', Math.max(bodyWidth, bodyHeight) / 2);
                body = Bodies.polygon(bodyX, bodyY, sides, pRadius, options);
                break;

            case 'fromVertices':
            case 'fromVerts':

                var verts = GetFastValue(config, 'verts', null);

                if (verts)
                {
                    //  Has the verts array come from Vertices.fromPath, or is it raw?
                    if (typeof verts === 'string')
                    {
                        verts = Vertices.fromPath(verts);
                    }

                    if (this.body && !this.body.hasOwnProperty('temp'))
                    {
                        Body.setVertices(this.body, verts);

                        body = this.body;
                    }
                    else
                    {
                        var flagInternal = GetFastValue(config, 'flagInternal', false);
                        var removeCollinear = GetFastValue(config, 'removeCollinear', 0.01);
                        var minimumArea = GetFastValue(config, 'minimumArea', 10);
    
                        body = Bodies.fromVertices(bodyX, bodyY, verts, options, flagInternal, removeCollinear, minimumArea);
                    }
                }

                break;

            case 'fromPhysicsEditor':
                body = PhysicsEditorParser.parseBody(bodyX, bodyY, config, options);
                break;

            case 'fromPhysicsTracer':
                body = PhysicsJSONParser.parseBody(bodyX, bodyY, config, options);
                break;
        }

        if (body)
        {
            this.setExistingBody(body, config.addToWorld);
        }

        return this;
    }

};

module.exports = SetBody;
