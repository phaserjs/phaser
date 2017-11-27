var Bodies = require('../lib/factory/Bodies');
var Body = require('../lib/body/Body');
var GetFastValue = require('../../../utils/object/GetFastValue');

var SetBody = {

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
                    var radius = GetFastValue(config, 'radius', Math.max(bodyWidth, bodyHeight) / 2);
                    this.body = Bodies.polygon(bodyX, bodyY, sides, radius, options);
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
