var Bodies = require('../lib/factory/Bodies');
var Body = require('../lib/body/Body');
var GetFastValue = require('../../../utils/object/GetFastValue');

var SetBody = {

    //  Calling any of these methods resets previous properties you may have set on the body, including plugins, mass, etc

    setRectangle: function (width, height, options)
    {
        return this.setBody({ type: 'rectangle', width: width, height: height }, options);
    },

    setCircle: function (radius, options)
    {
        return this.setBody({ type: 'circle', radius: radius }, options);
    },

    setPolygon: function (radius, sides, options)
    {
        return this.setBody({ type: 'polygon', sides: sides, radius: radius }, options);
    },

    setTrapezoid: function (width, height, slope, options)
    {
        return this.setBody({ type: 'trapezoid', width: width, height: height, slope: slope }, options);
    },

    setBody: function (config, options)
    {
        //  Existing body? Remove it.
        if (this.body)
        {
            this.world.remove(this.body);
        }

        if (!config)
        {
            return this;
        }
        else
        {
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
                    this.body = Bodies.rectangle(bodyX, bodyY, bodyWidth, bodyHeight, options);
                    break;

                case 'circle':
                    var radius = GetFastValue(config, 'radius', Math.max(bodyWidth, bodyHeight) / 2);
                    var maxSides = GetFastValue(config, 'maxSides', 25);
                    this.body = Bodies.circle(bodyX, bodyY, radius, options, maxSides);
                    break;

                case 'trapezoid':
                    var slope = GetFastValue(config, 'slope', 0.5);
                    this.body = Bodies.trapezoid(bodyX, bodyY, bodyWidth, bodyHeight, slope, options);
                    break;

                case 'polygon':
                    var sides = GetFastValue(config, 'sides', 5);
                    var pradius = GetFastValue(config, 'radius', Math.max(bodyWidth, bodyHeight) / 2);
                    this.body = Bodies.polygon(bodyX, bodyY, sides, pradius, options);
                    break;

                case 'fromVertices':
                case 'fromVerts':
                    var verts = GetFastValue(config, 'verts', []);

                    if (this.body)
                    {
                        Body.setVertices(this.body, verts);
                    }
                    else
                    {
                        var flagInternal = GetFastValue(config, 'flagInternal', false);
                        var removeCollinear = GetFastValue(config, 'removeCollinear', 0.01);
                        var minimumArea = GetFastValue(config, 'minimumArea', 10);
                        this.body = Bodies.fromVertices(bodyX, bodyY, verts, options, flagInternal, removeCollinear, minimumArea);
                    }
                    break;
            }
        }

        this.body.gameObject = this;
        
        if (GetFastValue(config, 'addToWorld', true))
        {
            this.world.add(this.body);
        }

        return this;
    }

};

module.exports = SetBody;
