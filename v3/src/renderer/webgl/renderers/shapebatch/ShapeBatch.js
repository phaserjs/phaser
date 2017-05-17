var DataBuffer32 = require('../../utils/DataBuffer32');
var Earcut = require('./earcut');
var UntexturedAndNormalizedTintedShader = require('../../shaders/UntexturedAndNormalizedTintedShader');

var PHASER_CONST = require('../../../../const');
var CONST = require('./const');

var ShapeBatch = function (game, gl, manager)
{
    this.game = game;
    this.type = PHASER_CONST.WEBGL;
    this.view = game.canvas;
    this.resolution = game.config.resolution;
    this.width = game.config.width * game.config.resolution;
    this.height = game.config.height * game.config.resolution;
    this.glContext = gl;
    this.maxVertices = null;
    this.shader = null;
    this.vertexBufferObject = null;
    this.vertexDataBuffer = null;
    this.vertexCount = 0;
    this.viewMatrixLocation = null;
    this.tempTriangle = [
        {x: 0, y: 0, width: 0, rgb: 0xFFFFFF, alpha: 1.0},
        {x: 0, y: 0, width: 0, rgb: 0xFFFFFF, alpha: 1.0},
        {x: 0, y: 0, width: 0, rgb: 0xFFFFFF, alpha: 1.0},
        {x: 0, y: 0, width: 0, rgb: 0xFFFFFF, alpha: 1.0}
    ];

    //   All of these settings will be able to be controlled via the Game Config
    this.config = {
        clearBeforeRender: true,
        transparent: false,
        autoResize: false,
        preserveDrawingBuffer: false,

        WebGLContextOptions: {
            alpha: true,
            antialias: true,
            premultipliedAlpha: true,
            stencil: true,
            preserveDrawingBuffer: false
        }
    };

    this.manager = manager;
    this.dirty = false;
    this.context = null;
    this.init(this.glContext);

};

ShapeBatch.prototype.constructor = ShapeBatch;

ShapeBatch.prototype = {

    init: function (gl)
    {
        var vertexDataBuffer = new DataBuffer32(CONST.VERTEX_SIZE * CONST.MAX_VERTICES);
        var shader = this.manager.resourceManager.createShader('UntexturedAndNormalizedTintedShader', UntexturedAndNormalizedTintedShader);
        var vertexBufferObject = this.manager.resourceManager.createBuffer(gl.ARRAY_BUFFER, vertexDataBuffer.getByteCapacity(), gl.STREAM_DRAW);
        var viewMatrixLocation = shader.getUniformLocation('u_view_matrix');
        var max = CONST.MAX_VERTICES;

        vertexBufferObject.addAttribute(shader.getAttribLocation('a_position'), 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 0);
        vertexBufferObject.addAttribute(shader.getAttribLocation('a_color'), 4, gl.UNSIGNED_BYTE, true, CONST.VERTEX_SIZE, 8);
        vertexBufferObject.addAttribute(shader.getAttribLocation('a_alpha'), 1, gl.FLOAT, false, CONST.VERTEX_SIZE, 12);

        this.vertexDataBuffer = vertexDataBuffer;
        this.shader = shader;
        this.vertexBufferObject = vertexBufferObject;
        this.viewMatrixLocation = viewMatrixLocation;
        this.maxVertices = max;
        this.polygonCache = [];

        this.resize(this.width, this.height, this.game.config.resolution);
    },

    shouldFlush: function ()
    {
        return false;
    },

    isFull: function ()
    {
        return (this.vertexDataBuffer.getByteLength() >= this.vertexDataBuffer.getByteCapacity());
    },

    bind: function (shader)
    {
        if (shader === undefined)
        {
            this.shader.bind();
        }
        else
        {
            shader.bind();
            this.resize(this.width, this.height, this.game.config.resolution, shader);
        }
        this.vertexBufferObject.bind();
    },

    flush: function (shader)
    {
        var gl = this.glContext;
        var vertexDataBuffer = this.vertexDataBuffer;

        if (this.vertexCount === 0)
        {
            return;
        }

        this.bind(shader);
        this.vertexBufferObject.updateResource(vertexDataBuffer.getUsedBufferAsFloat(), 0);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
        vertexDataBuffer.clear();
        this.vertexCount = 0;
    },

    resize: function (width, height, resolution, shader)
    {
        var gl = this.glContext;
        var activeShader = shader !== undefined ? shader : this.shader;

        this.width = width * resolution;
        this.height = height * resolution;

        activeShader.setConstantMatrix4x4(
            this.viewMatrixLocation,
            new Float32Array([
                2 / this.width, 0, 0, 0,
                0, -2 / this.height, 0, 0,
                0, 0, 1, 1,
                -1, 1, 0, 0
            ])
        );
    },

    destroy: function ()
    {
        this.manager.resourceManager.deleteShader(this.shader);
        this.manager.resourceManager.deleteBuffer(this.vertexBufferObject);

        this.shader = null;
        this.vertexBufferObject = null;
    },

    addLine: function (
        /* Graphics Game Object properties */
        srcX, srcY, srcScaleX, srcScaleY, srcRotation,
        /* line properties */
        ax, ay, bx, by, aLineWidth, bLineWidth, aLineColor, bLineColor, lineAlpha,
        /* transform */
        a1, b1, c1, d1, e1, f1,
        currentMatrix
    ) {
        if (this.vertexCount + 6 > this.maxVertices)
        {
            this.flush();
        }

        this.vertexCount += 6;

        var a0 = currentMatrix.matrix[0];
        var b0 = currentMatrix.matrix[1];
        var c0 = currentMatrix.matrix[2];
        var d0 = currentMatrix.matrix[3];
        var e0 = currentMatrix.matrix[4];
        var f0 = currentMatrix.matrix[5];
        var a = a1 * a0 + b1 * c0;
        var b = a1 * b0 + b1 * d0;
        var c = c1 * a0 + d1 * c0;
        var d = c1 * b0 + d1 * d0;
        var e = e1 * a0 + f1 * c0 + e0;
        var f = e1 * b0 + f1 * d0 + f0;
        var vertexDataBuffer = this.vertexDataBuffer;
        var vertexBufferF32 = vertexDataBuffer.floatView;
        var vertexBufferU32 = vertexDataBuffer.uintView;
        var dx = bx - ax;
        var dy = by - ay;
        var len = Math.sqrt(dx * dx + dy * dy);
        var al0 = aLineWidth * (by - ay) / len;
        var al1 = aLineWidth * (ax - bx) / len;
        var bl0 = bLineWidth * (by - ay) / len;
        var bl1 = bLineWidth * (ax - bx) / len;
        var lx0 = bx - bl0;
        var ly0 = by - bl1;
        var lx1 = ax - al0;
        var ly1 = ay - al1;
        var lx2 = bx + bl0;
        var ly2 = by + bl1;
        var lx3 = ax + al0;
        var ly3 = ay + al1;
        var x0 = lx0 * a + ly0 * c + e;
        var y0 = lx0 * b + ly0 * d + f;
        var x1 = lx1 * a + ly1 * c + e;
        var y1 = lx1 * b + ly1 * d + f;
        var x2 = lx2 * a + ly2 * c + e;
        var y2 = lx2 * b + ly2 * d + f;
        var x3 = lx3 * a + ly3 * c + e;
        var y3 = lx3 * b + ly3 * d + f;
        var vertexOffset = vertexDataBuffer.allocate(24);

        vertexBufferF32[vertexOffset++] = x0;
        vertexBufferF32[vertexOffset++] = y0;
        vertexBufferU32[vertexOffset++] = bLineColor;
        vertexBufferF32[vertexOffset++] = lineAlpha;
        vertexBufferF32[vertexOffset++] = x1;
        vertexBufferF32[vertexOffset++] = y1;
        vertexBufferU32[vertexOffset++] = aLineColor;
        vertexBufferF32[vertexOffset++] = lineAlpha;
        vertexBufferF32[vertexOffset++] = x2;
        vertexBufferF32[vertexOffset++] = y2;
        vertexBufferU32[vertexOffset++] = bLineColor;
        vertexBufferF32[vertexOffset++] = lineAlpha;
        vertexBufferF32[vertexOffset++] = x1;
        vertexBufferF32[vertexOffset++] = y1;
        vertexBufferU32[vertexOffset++] = aLineColor;
        vertexBufferF32[vertexOffset++] = lineAlpha;
        vertexBufferF32[vertexOffset++] = x3;
        vertexBufferF32[vertexOffset++] = y3;
        vertexBufferU32[vertexOffset++] = aLineColor;
        vertexBufferF32[vertexOffset++] = lineAlpha;
        vertexBufferF32[vertexOffset++] = x2;
        vertexBufferF32[vertexOffset++] = y2;
        vertexBufferU32[vertexOffset++] = bLineColor;
        vertexBufferF32[vertexOffset++] = lineAlpha;

        return [
            x0, y0, bLineColor,
            x1, y1, aLineColor,
            x2, y2, bLineColor,
            x3, y3, aLineColor
        ];

    },

    addStrokePath: function (
        /* Graphics Game Object properties */
        srcX, srcY, srcScaleX, srcScaleY, srcRotation,
        /* Path properties */
        path, lineWidth, lineColor, lineAlpha,
        /* transform */
        a, b, c, d, e, f,
        /* is last connection */
        isLastPath,
        currentMatrix
    ) {
        var point0, point1;
        var pathLength = path.length;
        var polylines = this.polygonCache;
        var halfLineWidth = lineWidth * 0.5;
        var last, curr;
        var vertexDataBuffer = this.vertexDataBuffer;
        var vertexBufferF32 = vertexDataBuffer.floatView;
        var vertexBufferU32 = vertexDataBuffer.uintView;
        var vertexOffset;
        var x0, y0, x1, y1, x2, y2;
        var line;

        for (var pathIndex = 0; pathIndex + 1 < pathLength; pathIndex += 1)
        {
            point0 = path[pathIndex];
            point1 = path[pathIndex + 1];
            line = this.addLine(
                srcX, srcY, srcScaleX, srcScaleY, srcRotation,
                point0.x, point0.y, 
                point1.x, point1.y, 
                point0.width / 2, point1.width / 2, 
                point0.rgb, point1.rgb, lineAlpha,
                a, b, c, d, e, f,
                currentMatrix
            );
            polylines.push(line);
        }

        /* Render joints */
        for (var index = 1, polylinesLength = polylines.length;
            index < polylinesLength; ++index)
        {

            if (this.vertexCount + 6 > this.maxVertices)
            {
                this.flush();
            }

            last = polylines[index - 1] || polylines[polylinesLength - 1];
            curr = polylines[index];
            vertexOffset = vertexDataBuffer.allocate(24)

            vertexBufferF32[vertexOffset++] = last[3 * 2 + 0];
            vertexBufferF32[vertexOffset++] = last[3 * 2 + 1];
            vertexBufferU32[vertexOffset++] = last[3 * 2 + 2];
            vertexBufferF32[vertexOffset++] = lineAlpha;

            vertexBufferF32[vertexOffset++] = last[3 * 0 + 0];
            vertexBufferF32[vertexOffset++] = last[3 * 0 + 1];
            vertexBufferU32[vertexOffset++] = last[3 * 0 + 2];
            vertexBufferF32[vertexOffset++] = lineAlpha;

            vertexBufferF32[vertexOffset++] = curr[3 * 3 + 0];
            vertexBufferF32[vertexOffset++] = curr[3 * 3 + 1];
            vertexBufferU32[vertexOffset++] = curr[3 * 3 + 2];
            vertexBufferF32[vertexOffset++] = lineAlpha;

            vertexBufferF32[vertexOffset++] = last[3 * 0 + 0];
            vertexBufferF32[vertexOffset++] = last[3 * 0 + 1];
            vertexBufferU32[vertexOffset++] = last[3 * 0 + 2];
            vertexBufferF32[vertexOffset++] = lineAlpha;

            vertexBufferF32[vertexOffset++] = last[3 * 2 + 0];
            vertexBufferF32[vertexOffset++] = last[3 * 2 + 1];
            vertexBufferU32[vertexOffset++] = last[3 * 2 + 2];
            vertexBufferF32[vertexOffset++] = lineAlpha;

            vertexBufferF32[vertexOffset++] = curr[3 * 1 + 0];
            vertexBufferF32[vertexOffset++] = curr[3 * 1 + 1];
            vertexBufferU32[vertexOffset++] = curr[3 * 1 + 2];
            vertexBufferF32[vertexOffset++] = lineAlpha;

            this.vertexCount += 6;
        }
        polylines.length = 0;
    },

    addFillPath: function (
        /* Graphics Game Object properties */
        srcX, srcY, srcScaleX, srcScaleY, srcRotation,
        /* Path properties */
        path, fillColor, fillAlpha,
        /* transform */
        a1, b1, c1, d1, e1, f1,
        currentMatrix
    ) {
        var length = path.length;
        var polygonCache = this.polygonCache;
        var polygonIndexArray;
        var point;
        var v0, v1, v2;
        var vertexOffset;
        var vertexCount = this.vertexCount;
        var maxVertices = this.maxVertices;
        var vertexDataBuffer = this.vertexDataBuffer;
        var vertexBufferF32 = vertexDataBuffer.floatView;
        var vertexBufferU32 = vertexDataBuffer.uintView;
        var x0, y0, x1, y1, x2, y2;
        var tx0, ty0, tx1, ty1, tx2, ty2;
        var a0 = currentMatrix.matrix[0];
        var b0 = currentMatrix.matrix[1];
        var c0 = currentMatrix.matrix[2];
        var d0 = currentMatrix.matrix[3];
        var e0 = currentMatrix.matrix[4];
        var f0 = currentMatrix.matrix[5];
        var a = a1 * a0 + b1 * c0;
        var b = a1 * b0 + b1 * d0;
        var c = c1 * a0 + d1 * c0;
        var d = c1 * b0 + d1 * d0;
        var e = e1 * a0 + f1 * c0 + e0;
        var f = e1 * b0 + f1 * d0 + f0;

        for (var pathIndex = 0; pathIndex < length; ++pathIndex)
        {
            point = path[pathIndex];
            polygonCache.push(point.x, point.y);
        }
        polygonIndexArray = Earcut(polygonCache);
        length = polygonIndexArray.length;

        for (var index = 0; index < length; index += 3)
        {
            v0 = polygonIndexArray[index + 0] * 2;
            v1 = polygonIndexArray[index + 1] * 2;
            v2 = polygonIndexArray[index + 2] * 2;

            if (vertexCount + 3 > maxVertices)
            {
                this.vertexCount = vertexCount;
                this.flush();
                vertexCount = 0;
            }
            vertexOffset = vertexDataBuffer.allocate(12);
            vertexCount += 3;

            x0 = polygonCache[v0 + 0];
            y0 = polygonCache[v0 + 1];
            x1 = polygonCache[v1 + 0];
            y1 = polygonCache[v1 + 1];
            x2 = polygonCache[v2 + 0];
            y2 = polygonCache[v2 + 1];

            tx0 = x0 * a + y0 * c + e;
            ty0 = x0 * b + y0 * d + f;
            tx1 = x1 * a + y1 * c + e;
            ty1 = x1 * b + y1 * d + f;
            tx2 = x2 * a + y2 * c + e;
            ty2 = x2 * b + y2 * d + f;

            vertexBufferF32[vertexOffset++] = tx0;
            vertexBufferF32[vertexOffset++] = ty0;
            vertexBufferU32[vertexOffset++] = fillColor;
            vertexBufferF32[vertexOffset++] = fillAlpha;

            vertexBufferF32[vertexOffset++] = tx1;
            vertexBufferF32[vertexOffset++] = ty1;
            vertexBufferU32[vertexOffset++] = fillColor;
            vertexBufferF32[vertexOffset++] = fillAlpha;

            vertexBufferF32[vertexOffset++] = tx2;
            vertexBufferF32[vertexOffset++] = ty2;
            vertexBufferU32[vertexOffset++] = fillColor;
            vertexBufferF32[vertexOffset++] = fillAlpha;

        }
        this.vertexCount = vertexCount;
        polygonCache.length = 0;
    },

    addFillRect: function (
        /* Graphics Game Object properties */
        srcX, srcY, srcScaleX, srcScaleY, srcRotation,
        /* Rectangle properties */
        x, y, width, height, fillColor, fillAlpha,
        /* transform */
        a1, b1, c1, d1, e1, f1,
        currentMatrix
    ) {
        if (this.vertexCount + 6 > this.maxVertices)
        {
            this.flush();
        }
        var vertexDataBuffer = this.vertexDataBuffer;
        var vertexBufferF32 = vertexDataBuffer.floatView;
        var vertexBufferU32 = vertexDataBuffer.uintView;
        var vertexOffset = vertexDataBuffer.allocate(24);
        var xw = x + width;
        var yh = y + height;
        var a0 = currentMatrix.matrix[0];
        var b0 = currentMatrix.matrix[1];
        var c0 = currentMatrix.matrix[2];
        var d0 = currentMatrix.matrix[3];
        var e0 = currentMatrix.matrix[4];
        var f0 = currentMatrix.matrix[5];
        var a = a1 * a0 + b1 * c0;
        var b = a1 * b0 + b1 * d0;
        var c = c1 * a0 + d1 * c0;
        var d = c1 * b0 + d1 * d0;
        var e = e1 * a0 + f1 * c0 + e0;
        var f = e1 * b0 + f1 * d0 + f0;
        var tx0 = x * a + y * c + e;
        var ty0 = x * b + y * d + f;
        var tx1 = x * a + yh * c + e;
        var ty1 = x * b + yh * d + f;
        var tx2 = xw * a + yh * c + e;
        var ty2 = xw * b + yh * d + f;
        var tx3 = xw * a + y * c + e;
        var ty3 = xw * b + y * d + f;

        vertexBufferF32[vertexOffset++] = tx0;
        vertexBufferF32[vertexOffset++] = ty0;
        vertexBufferU32[vertexOffset++] = fillColor;
        vertexBufferF32[vertexOffset++] = fillAlpha;

        vertexBufferF32[vertexOffset++] = tx1;
        vertexBufferF32[vertexOffset++] = ty1;
        vertexBufferU32[vertexOffset++] = fillColor;
        vertexBufferF32[vertexOffset++] = fillAlpha;

        vertexBufferF32[vertexOffset++] = tx2;
        vertexBufferF32[vertexOffset++] = ty2;
        vertexBufferU32[vertexOffset++] = fillColor;
        vertexBufferF32[vertexOffset++] = fillAlpha;

        vertexBufferF32[vertexOffset++] = tx0;
        vertexBufferF32[vertexOffset++] = ty0;
        vertexBufferU32[vertexOffset++] = fillColor;
        vertexBufferF32[vertexOffset++] = fillAlpha;

        vertexBufferF32[vertexOffset++] = tx2;
        vertexBufferF32[vertexOffset++] = ty2;
        vertexBufferU32[vertexOffset++] = fillColor;
        vertexBufferF32[vertexOffset++] = fillAlpha;

        vertexBufferF32[vertexOffset++] = tx3;
        vertexBufferF32[vertexOffset++] = ty3;
        vertexBufferU32[vertexOffset++] = fillColor;
        vertexBufferF32[vertexOffset++] = fillAlpha;

        this.vertexCount += 6;
    },

    addFillTriangle: function (
        /* Graphics Game Object properties */
        srcX, srcY, srcScaleX, srcScaleY, srcRotation,
        /* Triangle properties */
        x0, y0, x1, y1, x2, y2, fillColor, fillAlpha,
        /* transform */
        a1, b1, c1, d1, e1, f1,
        currentMatrix
    ) {
        if (this.vertexCount + 3 > this.maxVertices)
        {
            this.flush();
        }
        var a0 = currentMatrix.matrix[0];
        var b0 = currentMatrix.matrix[1];
        var c0 = currentMatrix.matrix[2];
        var d0 = currentMatrix.matrix[3];
        var e0 = currentMatrix.matrix[4];
        var f0 = currentMatrix.matrix[5];
        var a = a1 * a0 + b1 * c0;
        var b = a1 * b0 + b1 * d0;
        var c = c1 * a0 + d1 * c0;
        var d = c1 * b0 + d1 * d0;
        var e = e1 * a0 + f1 * c0 + e0;
        var f = e1 * b0 + f1 * d0 + f0;
        var vertexDataBuffer = this.vertexDataBuffer;
        var vertexBufferF32 = vertexDataBuffer.floatView;
        var vertexBufferU32 = vertexDataBuffer.uintView;
        var vertexOffset = vertexDataBuffer.allocate(12);
        var tx0 = x0 * a + y0 * c + e;
        var ty0 = x0 * b + y0 * d + f;
        var tx1 = x1 * a + y1 * c + e;
        var ty1 = x1 * b + y1 * d + f;
        var tx2 = x2 * a + y2 * c + e;
        var ty2 = x2 * b + y2 * d + f;

        vertexBufferF32[vertexOffset++] = tx0;
        vertexBufferF32[vertexOffset++] = ty0;
        vertexBufferU32[vertexOffset++] = fillColor;
        vertexBufferF32[vertexOffset++] = fillAlpha;

        vertexBufferF32[vertexOffset++] = tx1;
        vertexBufferF32[vertexOffset++] = ty1;
        vertexBufferU32[vertexOffset++] = fillColor;
        vertexBufferF32[vertexOffset++] = fillAlpha;

        vertexBufferF32[vertexOffset++] = tx2;
        vertexBufferF32[vertexOffset++] = ty2;
        vertexBufferU32[vertexOffset++] = fillColor;
        vertexBufferF32[vertexOffset++] = fillAlpha;

        this.vertexCount += 3;
    },

    addStrokeTriangle: function (
        /* Graphics Game Object properties */
        srcX, srcY, srcScaleX, srcScaleY, srcRotation,
        /* Triangle properties */
        x0, y0, x1, y1, x2, y2, lineWidth, lineColor, lineAlpha,
        /* transform */
        a, b, c, d, e, f,
        currentMatrix
    ) {
        var tempTriangle = this.tempTriangle;

        tempTriangle[0].x = x0;
        tempTriangle[0].y = y0;
        tempTriangle[0].width = lineWidth;
        tempTriangle[0].rgb = lineColor;
        tempTriangle[0].alpha = lineAlpha;
        tempTriangle[1].x = x1;
        tempTriangle[1].y = y1;
        tempTriangle[1].width = lineWidth;
        tempTriangle[1].rgb = lineColor;
        tempTriangle[1].alpha = lineAlpha;
        tempTriangle[2].x = x2;
        tempTriangle[2].y = y2;
        tempTriangle[2].width = lineWidth;
        tempTriangle[2].rgb = lineColor;
        tempTriangle[2].alpha = lineAlpha;
        tempTriangle[3].x = x0;
        tempTriangle[3].y = y0;
        tempTriangle[3].width = lineWidth;
        tempTriangle[3].rgb = lineColor;
        tempTriangle[3].alpha = lineAlpha;

        this.addStrokePath(
            srcX, srcY, srcScaleX, srcScaleY, srcRotation,
            tempTriangle, lineWidth, lineColor, lineAlpha,
            a, b, c, d, e, f,
            false,
            currentMatrix
        );
    }
};

module.exports = ShapeBatch;
