var Camera = require('../../cameras/2d/Camera.js');
var CanvasPool = require('../../display/canvas/CanvasPool');
var Class = require('../../utils/Class');
var Commands = require('./Commands');
var Components = require('../components');
var Ellipse = require('../../geom/ellipse/');
var GameObject = require('../GameObject');
var GetValue = require('../../utils/object/GetValue');
var MATH_CONST = require('../../math/const');
var Matrix4 = require('../../math/Matrix4');
var Mesh = require('../../geom/mesh/Mesh');
var Render = require('./GraphicsRender');
var Vector3 = require('../../math/Vector3');

var Graphics = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Transform,
        Components.RenderTarget,
        Components.Visible,
        Components.ScrollFactor,
        Render
    ],

    initialize:

    function Graphics (scene, options)
    {
        var x = GetValue(options, 'x', 0);
        var y = GetValue(options, 'y', 0);

        GameObject.call(this, scene, 'Graphics');

        this.setPosition(x, y);

        this.displayOriginX = 0;
        this.displayOriginY = 0;

        this.commandBuffer = [];

        this.defaultFillColor = -1;
        this.defaultFillAlpha = 1;

        this.defaultStrokeWidth = 1;
        this.defaultStrokeColor = -1;
        this.defaultStrokeAlpha = 1;
        this._lineWidth = 1.0;

        this.setDefaultStyles(options);

        //  Mesh viewport camera

        this.viewportWidth = scene.sys.game.config.width;
        this.viewportHeight = scene.sys.game.config.height;

        this.camera = {
            position: new Vector3(),
            target: new Vector3()
        };

        this.up = new Vector3().up();
        this.projectionMatrix = new Matrix4();
        this.viewMatrix = new Matrix4().lookAt(this.camera.position, this.camera.target, this.up);

        this.setViewport(this.viewportWidth, this.viewportHeight);

        var resourceManager = scene.sys.game.renderer.resourceManager;

        if (resourceManager !== undefined)
        {
            this.resourceManager = resourceManager;
            this.gl = scene.sys.game.renderer.gl;
        }
    },

    //  STYLES

    setDefaultStyles: function (options)
    {
        if (GetValue(options, 'lineStyle', null))
        {
            this.defaultStrokeWidth = GetValue(options, 'lineStyle.width', 1);
            this.defaultStrokeColor = GetValue(options, 'lineStyle.color', 0xffffff);
            this.defaultStrokeAlpha = GetValue(options, 'lineStyle.alpha', 1);

            this.lineStyle(this.defaultStrokeWidth, this.defaultStrokeColor, this.defaultStrokeAlpha);
        }

        if (GetValue(options, 'fillStyle', null))
        {
            this.defaultFillColor = GetValue(options, 'fillStyle.color', 0xffffff);
            this.defaultFillAlpha = GetValue(options, 'fillStyle.alpha', 1);

            this.fillStyle(this.defaultFillColor, this.defaultFillAlpha);
        }

        return this;
    },

    lineStyle: function (lineWidth, color, alpha)
    {
        if (alpha === undefined) { alpha = 1; }

        this.commandBuffer.push(
            Commands.LINE_STYLE,
            lineWidth, color, alpha
        );

        this._lineWidth = lineWidth;

        return this;
    },

    fillStyle: function (color, alpha)
    {
        if (alpha === undefined) { alpha = 1; }

        this.commandBuffer.push(
            Commands.FILL_STYLE,
            color, alpha
        );

        return this;
    },

    //  PATH

    beginPath: function ()
    {
        this.commandBuffer.push(
            Commands.BEGIN_PATH
        );

        return this;
    },

    closePath: function ()
    {
        this.commandBuffer.push(
            Commands.CLOSE_PATH
        );

        return this;
    },

    fillPath: function ()
    {
        this.commandBuffer.push(
            Commands.FILL_PATH
        );

        return this;
    },

    strokePath: function ()
    {
        this.commandBuffer.push(
            Commands.STROKE_PATH
        );

        return this;
    },

    //  CIRCLE

    fillCircleShape: function (circle)
    {
        return this.fillCircle(circle.x, circle.y, circle.radius);
    },

    strokeCircleShape: function (circle)
    {
        return this.strokeCircle(circle.x, circle.y, circle.radius);
    },

    fillCircle: function (x, y, radius)
    {
        this.beginPath();
        this.arc(x, y, radius, 0, MATH_CONST.PI2);
        this.closePath();
        this.fillPath();

        return this;
    },

    strokeCircle: function (x, y, radius)
    {
        this.beginPath();
        this.arc(x, y, radius, 0, MATH_CONST.PI2);
        this.closePath();
        this.strokePath();

        return this;
    },

    //  RECTANGLE

    fillRectShape: function (rect)
    {
        return this.fillRect(rect.x, rect.y, rect.width, rect.height);
    },

    strokeRectShape: function (rect)
    {
        return this.strokeRect(rect.x, rect.y, rect.width, rect.height);
    },

    fillRect: function (x, y, width, height)
    {
        this.commandBuffer.push(
            Commands.FILL_RECT,
            x, y, width, height
        );

        return this;
    },

    strokeRect: function (x, y, width, height)
    {
        var lineWidthHalf = this._lineWidth / 2;
        var minx = x - lineWidthHalf;
        var maxx = x + lineWidthHalf;

        this.beginPath();
        this.moveTo(x, y);
        this.lineTo(x, y + height);
        this.strokePath();
        this.closePath();

        this.beginPath();
        this.moveTo(x + width, y);
        this.lineTo(x + width, y + height);
        this.strokePath();
        this.closePath();

        this.beginPath();
        this.moveTo(minx, y);
        this.lineTo(maxx + width, y);
        this.strokePath();
        this.closePath();

        this.beginPath();
        this.moveTo(minx, y + height);
        this.lineTo(maxx + width, y + height);
        this.strokePath();
        this.closePath();

        return this;
    },

    //  POINT

    fillPointShape: function (point, size)
    {
        return this.fillPoint(point.x, point.y, size);
    },

    fillPoint: function (x, y, size)
    {
        if (!size || size < 1)
        {
            size = 1;
        }
        else
        {
            x -= (size / 2);
            y -= (size / 2);
        }

        this.commandBuffer.push(
            Commands.FILL_RECT,
            x, y, size, size
        );

        return this;
    },

    //  TRIANGLE

    fillTriangleShape: function (triangle)
    {
        return this.fillTriangle(triangle.x1, triangle.y1, triangle.x2, triangle.y2, triangle.x3, triangle.y3);
    },

    strokeTriangleShape: function (triangle)
    {
        return this.strokeTriangle(triangle.x1, triangle.y1, triangle.x2, triangle.y2, triangle.x3, triangle.y3);
    },

    fillTriangle: function (x0, y0, x1, y1, x2, y2)
    {
        this.commandBuffer.push(
            Commands.FILL_TRIANGLE,
            x0, y0, x1, y1, x2, y2
        );

        return this;
    },

    strokeTriangle: function (x0, y0, x1, y1, x2, y2)
    {
        this.commandBuffer.push(
            Commands.STROKE_TRIANGLE,
            x0, y0, x1, y1, x2, y2
        );

        return this;
    },

    //  LINE

    strokeLineShape: function (line)
    {
        return this.lineBetween(line.x1, line.y1, line.x2, line.y2);
    },

    lineBetween: function (x1, y1, x2, y2)
    {
        this.beginPath();
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
        this.strokePath();

        return this;
    },

    lineTo: function (x, y)
    {
        this.commandBuffer.push(
            Commands.LINE_TO,
            x, y
        );

        return this;
    },

    moveTo: function (x, y)
    {
        this.commandBuffer.push(
            Commands.MOVE_TO,
            x, y
        );

        return this;
    },

    lineFxTo: function (x, y, width, rgb)
    {
        this.commandBuffer.push(
            Commands.LINE_FX_TO,
            x, y, width, rgb, 1
        );

        return this;
    },

    moveFxTo: function (x, y, width, rgb)
    {
        this.commandBuffer.push(
            Commands.MOVE_FX_TO,
            x, y, width, rgb, 1
        );

        return this;
    },

    //  STROKE LINES BETWEEN AN ARRAY OF POINTS

    strokePoints: function (points, autoClose, endIndex)
    {
        if (autoClose === undefined) { autoClose = false; }
        if (endIndex === undefined) { endIndex = points.length; }

        this.beginPath();

        this.moveTo(points[0].x, points[0].y);

        for (var i = 1; i < endIndex; i++)
        {
            this.lineTo(points[i].x, points[i].y);
        }

        if (autoClose)
        {
            this.lineTo(points[0].x, points[0].y);
        }

        this.strokePath();

        return this;
    },

    fillPoints: function (points, autoClose, endIndex)
    {
        if (autoClose === undefined) { autoClose = false; }
        if (endIndex === undefined) { endIndex = points.length; }

        this.beginPath();

        this.moveTo(points[0].x, points[0].y);

        for (var i = 1; i < endIndex; i++)
        {
            this.lineTo(points[i].x, points[i].y);
        }

        if (autoClose)
        {
            this.lineTo(points[0].x, points[0].y);
        }

        this.fillPath();

        return this;
    },

    //  ELLIPSE

    strokeEllipseShape: function (ellipse, smoothness)
    {
        if (smoothness === undefined) { smoothness = 32; }

        var points = ellipse.getPoints(smoothness);

        return this.strokePoints(points, true);
    },

    strokeEllipse: function (x, y, width, height, smoothness)
    {
        if (smoothness === undefined) { smoothness = 32; }

        var ellipse = new Ellipse(x, y, width, height);

        var points = ellipse.getPoints(smoothness);

        return this.strokePoints(points, true);
    },
	 
    fillEllipseShape: function (ellipse, smoothness)
    {
        if (smoothness === undefined) { smoothness = 32; }

        var points = ellipse.getPoints(smoothness);

        return this.fillPoints(points, true);
    },

    fillEllipse: function (x, y, width, height, smoothness)
    {
        if (smoothness === undefined) { smoothness = 32; }

        var ellipse = new Ellipse(x, y, width, height);

        var points = ellipse.getPoints(smoothness);

        return this.fillPoints(points, true);
    },

    //  ARC

    arc: function (x, y, radius, startAngle, endAngle, anticlockwise)
    {
        this.commandBuffer.push(
            Commands.ARC,
            x, y, radius, startAngle, endAngle, anticlockwise
        );

        return this;
    },

    //  MESH + VIEWPORT + CAMERA

    cameraX: {

        get: function ()
        {
            return this.camera.position.x;
        },

        set: function (value)
        {
            this.camera.position.x = value;
            this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);
        }

    },

    cameraY: {

        get: function ()
        {
            return this.camera.position.y;
        },

        set: function (value)
        {
            this.camera.position.y = value;
            this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);
        }

    },

    cameraZ: {

        get: function ()
        {
            return this.camera.position.z;
        },

        set: function (value)
        {
            this.camera.position.z = value;
            this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);
        }

    },

    cameraTargetX: {

        get: function ()
        {
            return this.camera.target.x;
        },

        set: function (value)
        {
            this.camera.target.x = value;
            this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);
        }

    },

    cameraTargetY: {

        get: function ()
        {
            return this.camera.target.y;
        },

        set: function (value)
        {
            this.camera.target.y = value;
            this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);
        }

    },

    cameraTargetZ: {

        get: function ()
        {
            return this.camera.target.z;
        },

        set: function (value)
        {
            this.camera.target.z = value;
            this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);
        }

    },

    setCameraPosition: function (x, y, z)
    {
        this.camera.position.set(x, y, z);

        this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);

        return this;
    },

    setCameraTarget: function (x, y, z)
    {
        this.camera.target.set(x, y, z);

        this.viewMatrix.lookAt(this.camera.position, this.camera.target, this.up);

        return this;
    },

    // @param {number} fovy Vertical field of view in radians
    // @param {number} near Near bound of the frustum
    // @param {number} far Far bound of the frustum
    setViewport: function (width, height, fov, near, far)
    {
        if (fov === undefined) { fov = 0.8; }
        if (near === undefined) { near = 0.01; }
        if (far === undefined) { far = 1; }

        this.viewportWidth = width;
        this.viewportHeight = height;

        //  fov, aspect, near, far
        this.projectionMatrix.perspective(fov, width / height, near, far);

        return this;
    },

    //  Allow key to be a data array OR object containing the rest of the properties + color etc
    createMesh: function (key, x, y, z)
    {
        var data = this.scene.sys.cache.obj.get(key);

        var mesh = new Mesh(data, x, y, z);

        return mesh;
    },

    fillMesh: function (mesh)
    {
        mesh.fill(this);

        return this;
    },

    strokeMesh: function (mesh)
    {
        mesh.stroke(this);

        return this;
    },

    //  TRANSFORM

    save: function ()
    {
        this.commandBuffer.push(
            Commands.SAVE
        );

        return this;
    },

    restore: function ()
    {
        this.commandBuffer.push(
            Commands.RESTORE
        );

        return this;
    },

    translate: function (x, y)
    {
        this.commandBuffer.push(
            Commands.TRANSLATE,
            x, y
        );

        return this;
    },

    scale: function (x, y)
    {
        this.commandBuffer.push(
            Commands.SCALE,
            x, y
        );

        return this;
    },

    rotate: function (radian)
    {
        this.commandBuffer.push(
            Commands.ROTATE,
            radian
        );

        return this;
    },

    clear: function ()
    {
        this.commandBuffer.length = 0;

        if (this.defaultFillColor > -1)
        {
            this.fillStyle(this.defaultFillColor, this.defaultFillAlpha);
        }

        if (this.defaultStrokeColor > -1)
        {
            this.lineStyle(this.defaultStrokeWidth, this.defaultStrokeColor, this.defaultStrokeAlpha);
        }

        return this;
    },

    //  If key is a string it'll generate a new texture using it and add it into the
    //  Texture Manager (assuming no key conflict happens).
    //
    //  If key is a Canvas it will draw the texture to that canvas context. Note that it will NOT
    //  automatically upload it to the GPU in WebGL mode.

    generateTexture: function (key, width, height)
    {
        var sys = this.scene.sys;

        if (width === undefined) { width = sys.game.config.width; }
        if (height === undefined) { height = sys.game.config.height; }

        Graphics.TargetCamera.setViewport(0, 0, width, height);
        Graphics.TargetCamera.scrollX = this.x;
        Graphics.TargetCamera.scrollY = this.y;

        var texture;
        var ctx;

        if (typeof key === 'string')
        {
            if (sys.textures.exists(key))
            {
                //  Key is a string, it DOES exist in the Texture Manager AND is a canvas, so draw to it

                texture = sys.textures.get(key);

                var src = texture.getSourceImage();

                if (src instanceof HTMLCanvasElement)
                {
                    ctx = src.getContext('2d');
                }
            }
            else
            {
                //  Key is a string and doesn't exist in the Texture Manager, so generate and save it

                texture = sys.textures.createCanvas(key, width, height);

                ctx = texture.getSourceImage().getContext('2d');
            }
        }
        else if (key instanceof HTMLCanvasElement)
        {
            //  Key is a Canvas, so draw to it

            ctx = key.getContext('2d');
        }

        if (ctx)
        {
            this.renderCanvas(sys.game.renderer, this, 0, Graphics.TargetCamera, ctx);

            if (this.gl && texture)
            {
                sys.game.renderer.uploadCanvasToGPU(ctx.canvas, texture.source[0].glTexture, true);
            }
        }

        return this;
    }

});

Graphics.TargetCamera = new Camera(0, 0, 0, 0);

module.exports = Graphics;
