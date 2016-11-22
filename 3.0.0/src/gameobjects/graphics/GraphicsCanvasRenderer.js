
/**
* Note that 'this' in all functions here refer to the owning object.
* For example the Group, Stage, Sprite, etc. because the render function
* here is mapped to the prototype for the game object.
*/
Phaser.Renderer.Canvas.GameObjects.Graphics = {

    TYPES: [
        Phaser.GameObject.Graphics.prototype
    ],

    render: function (renderer, src)
    {
        var context = renderer.context;

        if (this.dirty)
        {
            this.updateGraphicsTint();

            this.dirty = false;
        }

        for (var i = 0; i < this.graphicsData.length; i++)
        {
            var data = this.graphicsData[i];

            context.lineWidth = data.lineWidth;

            switch (data.type)
            {
                case Phaser.RECTANGLE:
                    Phaser.Renderer.Canvas.GameObjects.Graphics.drawRectangle(data, context);
                    break;

                case Phaser.CIRCLE:
                    Phaser.Renderer.Canvas.GameObjects.Graphics.drawCircle(data, context);
                    break;

                case Phaser.POLYGON:
                    Phaser.Renderer.Canvas.GameObjects.Graphics.drawPolygon(data, context);
                    break;

                case Phaser.ELLIPSE:
                    Phaser.Renderer.Canvas.GameObjects.Graphics.drawEllipse(data, context);
                    break;

                case Phaser.ROUNDEDRECTANGLE:
                    Phaser.Renderer.Canvas.GameObjects.Graphics.drawRoundedRectangle(data, context);
                    break;
            }
        }

    },

    drawRectangle: function (data, context)
    {
        var shape = data.shape;

        if (data.fillColor || data.fillColor === 0)
        {
            context.globalAlpha = data.fillAlpha * this.worldAlpha;
            context.fillStyle = '#' + ('00000' + (data._fillTint | 0).toString(16)).substr(-6);
            context.fillRect(shape.x, shape.y, shape.width, shape.height);
        }

        if (data.lineWidth)
        {
            context.globalAlpha = data.lineAlpha * this.worldAlpha;
            context.strokeStyle = '#' + ('00000' + (data._lineTint | 0).toString(16)).substr(-6);
            context.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }

    },

    drawRoundedRectangle: function (data, context)
    {
        var shape = data.shape;

        var rx = shape.x;
        var ry = shape.y;
        var width = shape.width;
        var height = shape.height;
        var radius = shape.radius;

        var maxRadius = Math.min(width, height) / 2 | 0;
        radius = radius > maxRadius ? maxRadius : radius;

        context.beginPath();
        context.moveTo(rx, ry + radius);
        context.lineTo(rx, ry + height - radius);
        context.quadraticCurveTo(rx, ry + height, rx + radius, ry + height);
        context.lineTo(rx + width - radius, ry + height);
        context.quadraticCurveTo(rx + width, ry + height, rx + width, ry + height - radius);
        context.lineTo(rx + width, ry + radius);
        context.quadraticCurveTo(rx + width, ry, rx + width - radius, ry);
        context.lineTo(rx + radius, ry);
        context.quadraticCurveTo(rx, ry, rx, ry + radius);
        context.closePath();

        if (data.fillColor || data.fillColor === 0)
        {
            context.globalAlpha = data.fillAlpha * this.worldAlpha;
            context.fillStyle = '#' + ('00000' + (data._fillTint | 0).toString(16)).substr(-6);
            context.fill();
        }

        if (data.lineWidth)
        {
            context.globalAlpha = data.lineAlpha * this.worldAlpha;
            context.strokeStyle = '#' + ('00000' + (data._lineTint | 0).toString(16)).substr(-6);
            context.stroke();
        }

    },

    drawEllipse: function (data, context)
    {
        var shape = data.shape;

        // ellipse code taken from: http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas

        var w = shape.width * 2;
        var h = shape.height * 2;

        var x = shape.x - (w / 2);
        var y = shape.y - (h / 2);

        context.beginPath();

        var kappa = 0.5522848;
        var ox = (w / 2) * kappa;   // control point offset horizontal
        var oy = (h / 2) * kappa;   // control point offset vertical
        var xe = x + w;             // x-end
        var ye = y + h;             // y-end
        var xm = x + (w / 2);       // x-middle
        var ym = y + (h / 2);       // y-middle

        context.moveTo(x, ym);
        context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

        context.closePath();

        if (data.fill)
        {
            context.globalAlpha = data.fillAlpha * this.worldAlpha;
            context.fillStyle = '#' + ('00000' + (data._fillTint | 0).toString(16)).substr(-6);
            context.fill();
        }

        if (data.lineWidth)
        {
            context.globalAlpha = data.lineAlpha * this.worldAlpha;
            context.strokeStyle = '#' + ('00000' + (data._lineTint | 0).toString(16)).substr(-6);
            context.stroke();
        }

    },

    drawCircle: function (data, context)
    {
        var shape = data.shape;

        context.beginPath();
        context.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        context.closePath();

        if (data.fill)
        {
            context.globalAlpha = data.fillAlpha * this.worldAlpha;
            context.fillStyle = '#' + ('00000' + (data._fillTint | 0).toString(16)).substr(-6);
            context.fill();
        }

        if (data.lineWidth)
        {
            context.globalAlpha = data.lineAlpha * this.worldAlpha;
            context.strokeStyle = '#' + ('00000' + (data._lineTint | 0).toString(16)).substr(-6);
            context.stroke();
        }

    },

    drawPolygon: function (data, context)
    {
        var shape = data.shape;

        context.beginPath();

        var points = shape.points;

        context.moveTo(points[0], points[1]);

        for (var j = 1; j < points.length / 2; j++)
        {
            context.lineTo(points[j * 2], points[j * 2 + 1]);
        }

        if (shape.closed)
        {
            context.lineTo(points[0], points[1]);
        }

        // if the first and last point are the same close the path - much neater :)
        if (points[0] === points[points.length - 2] && points[1] === points[points.length - 1])
        {
            context.closePath();
        }

        if (data.fill)
        {
            context.globalAlpha = data.fillAlpha * this.worldAlpha;
            context.fillStyle = '#' + ('00000' + (data._fillTint | 0).toString(16)).substr(-6);
            context.fill();
        }

        if (data.lineWidth)
        {
            context.globalAlpha = data.lineAlpha * this.worldAlpha;
            context.strokeStyle = '#' + ('00000' + (data._lineTint | 0).toString(16)).substr(-6);
            context.stroke();
        }

    }

};
