var Rectangle = require('../../geom/rectangle/Rectangle');
var RotateAround = require('../../math/RotateAround');
var Vector2 = require('../../math/Vector2');

var GetBounds = {

    getTopLeft: function (output)
    {
        if (output === undefined) { output = new Vector2(); }

        output.x = this.x - (this.displayWidth * this.originX);
        output.y = this.y - (this.displayHeight * this.originY);

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        return output;
    },

    getTopRight: function (output)
    {
        if (output === undefined) { output = new Vector2(); }

        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = this.y - (this.displayHeight * this.originY);

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        return output;
    },

    getBottomLeft: function (output)
    {
        if (output === undefined) { output = new Vector2(); }

        output.x = this.x - (this.displayWidth * this.originX);
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        return output;
    },

    getBottomRight: function (output)
    {
        if (output === undefined) { output = new Vector2(); }

        output.x = (this.x - (this.displayWidth * this.originX)) + this.displayWidth;
        output.y = (this.y - (this.displayHeight * this.originY)) + this.displayHeight;

        if (this.rotation !== 0)
        {
            RotateAround(output, this.x, this.y, this.rotation);
        }

        return output;
    },

    getBounds: function (output)
    {
        if (output === undefined) { output = new Rectangle(); }

        //  We can use the output object to temporarily store the x/y coords in:

        this.getTopLeft(output);

        var TLx = output.x;
        var TLy = output.y;

        this.getTopRight(output);

        var TRx = output.x;
        var TRy = output.y;

        this.getBottomLeft(output);

        var BLx = output.x;
        var BLy = output.y;

        this.getBottomRight(output);

        var BRx = output.x;
        var BRy = output.y;

        output.x = Math.min(TLx, TRx, BLx, BRx);
        output.y = Math.min(TLy, TRy, BLy, BRy);
        output.width = Math.max(TLx, TRx, BLx, BRx) - output.x;
        output.height = Math.max(TLy, TRy, BLy, BRy) - output.y;

        return output;
    },

    //  Works but only if originX/Y = 0

    /*
    getBounds: function (output)
    {
        if (output === undefined) { output = new Rectangle(); }

        var x = this.x;
        var y = this.y;

        var w = this.displayWidth;
        var h = this.displayHeight;

        var r = this.rotation;

        var wct = w * Math.cos(r);
        var hct = h * Math.cos(r);

        var wst = w * Math.sin(r);
        var hst = h * Math.sin(r);

        var xMin = x;
        var xMax = x;
        var yMin = y;
        var yMax = y;

        if (r > 0)
        {
            if (r < 1.5707963267948966)
            {
                // 0 < theta < 90
                yMax = y + hct + wst;
                xMin = x - hst;
                xMax = x + wct;
            }
            else
            {
                // 90 <= theta <= 180
                yMin = y + hct;
                yMax = y + wst;
                xMin = x - hst + wct;
            }
        }
        else if (r > -1.5707963267948966)
        {
            // -90 < theta <= 0
            yMin = y + wst;
            yMax = y + hct;
            xMax = x + wct - hst;
        }
        else
        {
            // -180 <= theta <= -90
            yMin = y + wst + hct;
            xMin = x + wct;
            xMax = x - hst;
        }

        output.x = xMin;
        output.y = yMin;
        output.width = xMax - xMin;
        output.height = yMax - yMin;

        return output;
    }
    */
};

module.exports = GetBounds;
