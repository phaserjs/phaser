/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Bodies = require('../lib/factory/Bodies');
var Body = require('../lib/body/Body');
var GetFastValue = require('../../../utils/object/GetFastValue');

/**
 * [description]
 *
 * @name Phaser.Physics.Matter.Components.SetBody
 * @since 3.0.0
 */
var SetBody = {

    //  Calling any of these methods resets previous properties you may have set on the body, including plugins, mass, etc

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setRectangle
     * @since 3.0.0
     *
     * @param {[type]} width - [description]
     * @param {[type]} height - [description]
     * @param {[type]} options - [description]
     *
     * @return {[type]} [description]
     */
    setRectangle: function (width, height, options)
    {
        return this.setBody({ type: 'rectangle', width: width, height: height }, options);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setCircle
     * @since 3.0.0
     *
     * @param {[type]} radius - [description]
     * @param {[type]} options - [description]
     *
     * @return {[type]} [description]
     */
    setCircle: function (radius, options)
    {
        return this.setBody({ type: 'circle', radius: radius }, options);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setPolygon
     * @since 3.0.0
     *
     * @param {[type]} radius - [description]
     * @param {[type]} sides - [description]
     * @param {[type]} options - [description]
     *
     * @return {[type]} [description]
     */
    setPolygon: function (radius, sides, options)
    {
        return this.setBody({ type: 'polygon', sides: sides, radius: radius }, options);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setTrapezoid
     * @since 3.0.0
     *
     * @param {[type]} width - [description]
     * @param {[type]} height - [description]
     * @param {[type]} slope - [description]
     * @param {[type]} options - [description]
     *
     * @return {[type]} [description]
     */
    setTrapezoid: function (width, height, slope, options)
    {
        return this.setBody({ type: 'trapezoid', width: width, height: height, slope: slope }, options);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setExistingBody
     * @since 3.0.0
     *
     * @param {[type]} body - [description]
     * @param {[type]} addToWorld - [description]
     *
     * @return {[type]} [description]
     */
    setExistingBody: function (body, addToWorld)
    {
        if (addToWorld === undefined)
        {
            addToWorld = true;
        }

        if (this.body)
        {
            this.world.remove(this.body);
        }

        this.body = body;
        this.body.gameObject = this;

        var _this = this;

        this.body.destroy = function ()
        {
            _this.world.remove(_this.body);
            _this.body.gameObject = null;
        };

        if (addToWorld)
        {
            this.world.add(this.body);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.SetBody#setBody
     * @since 3.0.0
     *
     * @param {[type]} config - [description]
     * @param {[type]} options - [description]
     *
     * @return {[type]} [description]
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
                var pradius = GetFastValue(config, 'radius', Math.max(bodyWidth, bodyHeight) / 2);
                body = Bodies.polygon(bodyX, bodyY, sides, pradius, options);
                break;

            case 'fromVertices':
            case 'fromVerts':
                var verts = GetFastValue(config, 'verts', []);

                if (this.body)
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
                break;
        }

        this.setExistingBody(body, config.addToWorld);

        return this;
    }

};

module.exports = SetBody;
