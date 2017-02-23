var GetBounds = {

    getBounds: function ()
    {
        var a = this.angle;
        var r = this.rotation;

        var hct = this.height * Math.cos(r);
        var wct = this.width * Math.cos(r);
        var hst = this.height * Math.sin(r);
        var wst = this.width * Math.sin(r);

        var x = this.x;
        var y = this.y;

        var x_min;
        var x_max;
        var y_min;
        var y_max;

        if (a > 0)
        {
            if (a < 90)
            {
                // 0 < theta < 90
                y_min = y;
                y_max = y + hct + wst;
                x_min = x - hst;
                x_max = x + wct;
            }
            else
            {
                // 90 <= theta <= 180
                y_min = y + hct;
                y_max = y + wst;
                x_min = x - hst + wct;
                x_max = x;
            }
        }
        else
        {
            if (a > -90)
            {
                // -90 < theta <= 0
                y_min = y + wst;
                y_max = y + hct;
                x_min = x;
                x_max = x + wct - hst;
            }
            else
            {
                // -180 <= theta <= -90
                y_min = y + wst + hct;
                y_max = y;
                x_min = x + wct;
                x_max = x - hst;
            }
        }

        return {
            x: x_min,
            y: y_min,
            width: x_max - x_min,
            height: y_max - y_min
        };
    }
};

module.exports = GetBounds;
