/**
* @author       George https://github.com/georgiee
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Draws a P2 Body to a Graphics instance for visual debugging.
* Needless to say, for every body you enable debug drawing on, you are adding processor and graphical overhead.
* So use sparingly and rarely (if ever) in production code.
*
* @class Phaser.Physics.P2.BodyDebug
* @constructor
* @extends Phaser.Group
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {Phaser.Physics.P2.Body} body - The P2 Body to display debug data for.
* @param {object} settings - Settings object.
*/
Phaser.Physics.P2.BodyDebug = function(game, body, settings) {

    Phaser.Group.call(this, game);

    /**
    * @property {object} defaultSettings - Default debug settings.
    * @private
    */
    var defaultSettings = {
        pixelsPerLengthUnit: 20,
        debugPolygons: false,
        lineWidth: 1,
        alpha: 0.5
    };

    this.settings = Phaser.Utils.extend(defaultSettings, settings);

    /**
    * @property {number} ppu - Pixels per Length Unit.
    */
    this.ppu = this.settings.pixelsPerLengthUnit;
    this.ppu = -1 * this.ppu;

    /**
    * @property {Phaser.Physics.P2.Body} body - The P2 Body to display debug data for.
    */
    this.body = body;

    /**
    * @property {Phaser.Graphics} canvas - The canvas to render the debug info to.
    */
    this.canvas = new Phaser.Graphics(game);

    this.canvas.alpha = this.settings.alpha;

    this.add(this.canvas);

    this.draw();

};

Phaser.Physics.P2.BodyDebug.prototype = Object.create(Phaser.Group.prototype);
Phaser.Physics.P2.BodyDebug.prototype.constructor = Phaser.Physics.P2.BodyDebug;

Phaser.Utils.extend(Phaser.Physics.P2.BodyDebug.prototype, {

    /**
    * Core update.
    *
    * @method Phaser.Physics.P2.BodyDebug#updateSpriteTransform
    */
    updateSpriteTransform: function() {

        this.position.x = this.body.position[0] * this.ppu;
        this.position.y = this.body.position[1] * this.ppu;
        this.rotation = this.body.angle;

    },

    /**
    * Draws the P2 shapes to the Graphics object.
    *
    * @method Phaser.Physics.P2.BodyDebug#draw
    */
    draw: function() {

        var angle, child, color, i, j, lineColor, lw, obj, offset, sprite, v, verts, vrot, _j, _ref1;
        obj = this.body;
        sprite = this.canvas;
        sprite.clear();
        color = parseInt(this.randomPastelHex(), 16);
        lineColor = 0xff0000;
        lw = this.lineWidth;

        if (obj instanceof p2.Body && obj.shapes.length)
        {
            var l = obj.shapes.length;

            i = 0;

            while (i !== l)
            {
                child = obj.shapes[i];
                offset = obj.shapeOffsets[i];
                angle = obj.shapeAngles[i];
                offset = offset || 0;
                angle = angle || 0;

                if (child instanceof p2.Circle)
                {
                    this.drawCircle(sprite, offset[0] * this.ppu, offset[1] * this.ppu, angle, child.radius * this.ppu, color, lw);
                }
                else if (child instanceof p2.Convex)
                {
                    verts = [];
                    vrot = p2.vec2.create();

                    for (j = _j = 0, _ref1 = child.vertices.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j)
                    {
                        v = child.vertices[j];
                        p2.vec2.rotate(vrot, v, angle);
                        verts.push([(vrot[0] + offset[0]) * this.ppu, -(vrot[1] + offset[1]) * this.ppu]);
                    }

                    this.drawConvex(sprite, verts, child.triangles, lineColor, color, lw, this.settings.debugPolygons, [offset[0] * this.ppu, -offset[1] * this.ppu]);
                }
                else if (child instanceof p2.Plane)
                {
                    this.drawPlane(sprite, offset[0] * this.ppu, -offset[1] * this.ppu, color, lineColor, lw * 5, lw * 10, lw * 10, this.ppu * 100, angle);
                }
                else if (child instanceof p2.Line)
                {
                    this.drawLine(sprite, child.length * this.ppu, lineColor, lw);
                }
                else if (child instanceof p2.Rectangle)
                {
                    this.drawRectangle(sprite, offset[0] * this.ppu, -offset[1] * this.ppu, angle, child.width * this.ppu, child.height * this.ppu, lineColor, color, lw);
                }

                i++;
            }
        }

    },

    /**
    * Draws the P2 shapes to the Graphics object.
    *
    * @method Phaser.Physics.P2.BodyDebug#draw
    */
    drawRectangle: function(g, x, y, angle, w, h, color, fillColor, lineWidth) {

        if (typeof lineWidth === 'undefined') { lineWidth = 1; }
        if (typeof color === 'undefined') { color = 0x000000; }

        g.lineStyle(lineWidth, color, 1);
        g.beginFill(fillColor);
        g.drawRect(x - w / 2, y - h / 2, w, h);

    },

    /**
    * Draws a P2 Circle shape.
    *
    * @method Phaser.Physics.P2.BodyDebug#drawCircle
    */
    drawCircle: function(g, x, y, angle, radius, color, lineWidth) {

        if (typeof lineWidth === 'undefined') { lineWidth = 1; }
        if (typeof color === 'undefined') { color = 0xffffff; }
        g.lineStyle(lineWidth, 0x000000, 1);
        g.beginFill(color, 1.0);
        g.drawCircle(x, y, -radius*2);
        g.endFill();
        g.moveTo(x, y);
        g.lineTo(x + radius * Math.cos(-angle), y + radius * Math.sin(-angle));

    },

    /**
    * Draws a P2 Line shape.
    *
    * @method Phaser.Physics.P2.BodyDebug#drawCircle
    */
    drawLine: function(g, len, color, lineWidth) {

        if (typeof lineWidth === 'undefined') { lineWidth = 1; }
        if (typeof color === 'undefined') { color = 0x000000; }

        g.lineStyle(lineWidth * 5, color, 1);
        g.moveTo(-len / 2, 0);
        g.lineTo(len / 2, 0);

    },

    /**
    * Draws a P2 Convex shape.
    *
    * @method Phaser.Physics.P2.BodyDebug#drawConvex
    */
    drawConvex: function(g, verts, triangles, color, fillColor, lineWidth, debug, offset) {

        var colors, i, v, v0, v1, x, x0, x1, y, y0, y1;

        if (typeof lineWidth === 'undefined') { lineWidth = 1; }
        if (typeof color === 'undefined') { color = 0x000000; }

        if (!debug)
        {
            g.lineStyle(lineWidth, color, 1);
            g.beginFill(fillColor);
            i = 0;

            while (i !== verts.length)
            {
                v = verts[i];
                x = v[0];
                y = v[1];

                if (i === 0)
                {
                    g.moveTo(x, -y);
                }
                else
                {
                    g.lineTo(x, -y);
                }

                i++;
            }

            g.endFill();

            if (verts.length > 2)
            {
                g.moveTo(verts[verts.length - 1][0], -verts[verts.length - 1][1]);
                return g.lineTo(verts[0][0], -verts[0][1]);
            }
        }
        else
        {
            colors = [0xff0000, 0x00ff00, 0x0000ff];
            i = 0;

            while (i !== verts.length + 1)
            {
                v0 = verts[i % verts.length];
                v1 = verts[(i + 1) % verts.length];
                x0 = v0[0];
                y0 = v0[1];
                x1 = v1[0];
                y1 = v1[1];
                g.lineStyle(lineWidth, colors[i % colors.length], 1);
                g.moveTo(x0, -y0);
                g.lineTo(x1, -y1);
                g.drawCircle(x0, -y0, lineWidth * 2);
                i++;
            }

            g.lineStyle(lineWidth, 0x000000, 1);
            return g.drawCircle(offset[0], offset[1], lineWidth * 2);
        }

    },

    /**
    * Draws a P2 Path.
    *
    * @method Phaser.Physics.P2.BodyDebug#drawPath
    */
    drawPath: function(g, path, color, fillColor, lineWidth) {

        var area, i, lastx, lasty, p1x, p1y, p2x, p2y, p3x, p3y, v, x, y;
        if (typeof lineWidth === 'undefined') { lineWidth = 1; }
        if (typeof color === 'undefined') { color = 0x000000; }

        g.lineStyle(lineWidth, color, 1);

        if (typeof fillColor === "number")
        {
            g.beginFill(fillColor);
        }

        lastx = null;
        lasty = null;
        i = 0;

        while (i < path.length)
        {
            v = path[i];
            x = v[0];
            y = v[1];

            if (x !== lastx || y !== lasty)
            {
                if (i === 0)
                {
                    g.moveTo(x, y);
                }
                else
                {
                    p1x = lastx;
                    p1y = lasty;
                    p2x = x;
                    p2y = y;
                    p3x = path[(i + 1) % path.length][0];
                    p3y = path[(i + 1) % path.length][1];
                    area = ((p2x - p1x) * (p3y - p1y)) - ((p3x - p1x) * (p2y - p1y));

                    if (area !== 0)
                    {
                        g.lineTo(x, y);
                    }
                }
                lastx = x;
                lasty = y;
            }

            i++;

        }

        if (typeof fillColor === "number")
        {
            g.endFill();
        }

        if (path.length > 2 && typeof fillColor === "number")
        {
            g.moveTo(path[path.length - 1][0], path[path.length - 1][1]);
            g.lineTo(path[0][0], path[0][1]);
        }

    },

    /**
    * Draws a P2 Plane shape.
    *
    * @method Phaser.Physics.P2.BodyDebug#drawPlane
    */
    drawPlane: function(g, x0, x1, color, lineColor, lineWidth, diagMargin, diagSize, maxLength, angle) {

        var max, xd, yd;
        if (typeof lineWidth === 'undefined') { lineWidth = 1; }
        if (typeof color === 'undefined') { color = 0xffffff; }

        g.lineStyle(lineWidth, lineColor, 11);
        g.beginFill(color);
        max = maxLength;

        g.moveTo(x0, -x1);
        xd = x0 + Math.cos(angle) * this.game.width;
        yd = x1 + Math.sin(angle) * this.game.height;
        g.lineTo(xd, -yd);

        g.moveTo(x0, -x1);
        xd = x0 + Math.cos(angle) * -this.game.width;
        yd = x1 + Math.sin(angle) * -this.game.height;
        g.lineTo(xd, -yd);

    },

    /**
    * Picks a random pastel color.
    *
    * @method Phaser.Physics.P2.BodyDebug#randomPastelHex
    */
    randomPastelHex: function() {

        var blue, green, mix, red;
        mix = [255, 255, 255];

        red = Math.floor(Math.random() * 256);
        green = Math.floor(Math.random() * 256);
        blue = Math.floor(Math.random() * 256);

        red = Math.floor((red + 3 * mix[0]) / 4);
        green = Math.floor((green + 3 * mix[1]) / 4);
        blue = Math.floor((blue + 3 * mix[2]) / 4);

        return this.rgbToHex(red, green, blue);

    },

    /**
    * Converts from RGB to Hex.
    *
    * @method Phaser.Physics.P2.BodyDebug#rgbToHex
    */
    rgbToHex: function(r, g, b) {
        return this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    },

    /**
    * Component to hex conversion.
    *
    * @method Phaser.Physics.P2.BodyDebug#componentToHex
    */
    componentToHex: function(c) {

        var hex;
        hex = c.toString(16);

        if (hex.len === 2)
        {
            return hex;
        }
        else
        {
            return hex + '0';
        }

    }

});
