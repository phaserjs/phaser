var Class = require('../utils/Class');
var Rectangle = require('../geom/rectangle/Rectangle');
var TransformMatrix = require('../gameobjects/components/TransformMatrix');
var ValueToColor = require('../graphics/color/ValueToColor');

var Camera = new Class({

    initialize:

    function Camera (x, y, width, height)
    {
        this.name = '';

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.roundPixels = false;
        this.useBounds = false;

        this._bounds = new Rectangle();

        this.scrollX = 0.0;
        this.scrollY = 0.0;
        this.zoom = 1.0;
        this.rotation = 0.0;
        this.matrix = new TransformMatrix(1, 0, 0, 1, 0, 0);
        this.culledObjects = [];

        // shake
        this._shakeDuration = 0.0;
        this._shakeIntensity = 0.0;
        this._shakeOffsetX = 0.0;
        this._shakeOffsetY = 0.0;

        // fade
        this._fadeDuration = 0.0;
        this._fadeRed = 0.0;
        this._fadeGreen = 0.0;
        this._fadeBlue = 0.0;
        this._fadeAlpha = 0.0;

        // flash
        this._flashDuration = 0.0;
        this._flashRed = 1.0;
        this._flashGreen = 1.0;
        this._flashBlue = 1.0;
        this._flashAlpha = 0.0;

        // origin
        this._follow = null;

        this.clearBeforeRender = true;
        this.backgroundColor = ValueToColor('rgba(0,0,0,0)');
        this.transparent = true;
    },

    cull: function (renderableObjects)
    {
        var scrollX = this.scrollX;
        var scrollY = this.scrollY;
        var cameraW = this.width;
        var cameraH = this.height;
        var culledObjects = this.culledObjects;
        var length = renderableObjects.length;

        culledObjects.length = 0;

        for (var index = 0; index < length; ++index)
        {
            var object = renderableObjects[index];

            /* Not every renderable object has a dimension */ 
            if (typeof object.width === 'number')
            {
                var objectW = object.width;
                var objectH = object.height;
                var objectX = (object.x - (scrollX * object.scrollFactorX)) - (objectW * object.originX);
                var objectY = (object.y - (scrollY * object.scrollFactorY)) - (objectH * object.originY);
                var cullW = cameraW + objectW;
                var cullH = cameraH + objectH;

                if (objectX > -objectW && objectY > -objectH &&
                    objectX < cullW && objectY < cullH)
                {
                    culledObjects.push(object);
                }
            }
            else
            {
                culledObjects.push(object);
            }
        }

        return culledObjects;
    },

    setBackgroundColor: function (color)
    {
        if (color === undefined) { color = 'rgba(0,0,0,0)'; }

        this.backgroundColor = ValueToColor(color);

        this.transparent = (this.backgroundColor.alpha === 0);
    },

    removeBounds: function ()
    {
        this.useBounds = false;

        this._bounds.setEmpty();

        return this;
    },

    setBounds: function (x, y, width, height)
    {
        this._bounds.setTo(x, y, width, height);

        this.useBounds = true;

        return this;
    },

    setViewport: function (x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        return this;
    },

    setPosition: function (x, y)
    {
        this.x = x;
        this.y = y;

        return this;
    },

    setSize: function (width, height)
    {
        this.width = width;
        this.height = height;

        return this;
    },

    setState: function (state)
    {
        this.state = state;

        return this;
    },

    update: function (timestep, delta)
    {
        if (this._flashAlpha > 0.0)
        {
            this._flashAlpha -= delta / this._flashDuration;

            if (this._flashAlpha < 0.0)
            {
                this._flashAlpha = 0.0;
            }
        }

        if (this._fadeAlpha > 0.0 && this._fadeAlpha < 1.0)
        {
            this._fadeAlpha += delta / this._fadeDuration;

            if (this._fadeAlpha >= 1.0)
            {
                this._fadeAlpha = 1.0;
            }
        }

        if (this._shakeDuration > 0.0)
        {
            var intensity = this._shakeIntensity;

            this._shakeDuration -= delta;

            if (this._shakeDuration <= 0.0)
            {
                this._shakeOffsetX = 0.0;
                this._shakeOffsetY = 0.0;
            }
            else
            {
                this._shakeOffsetX = (Math.random() * intensity * this.width * 2 - intensity * this.width) * this.zoom;
                this._shakeOffsetY = (Math.random() * intensity * this.height * 2 - intensity * this.height) * this.zoom;
            }
        }
    },

    startFollow: function (gameObjectOrPoint, roundPx)
    {
        if (this._follow !== null)
        {
            this.stopFollow();
        }

        this._follow = gameObjectOrPoint;

        if (roundPx !== undefined)
        {
            this.roundPixels = roundPx;
        }
    },

    stopFollow: function ()
    {
        /* do unfollow work here */
        this._follow = null;
    },

    setRoundPixels: function (value)
    {
        this.roundPixels = value;

        return this;
    },

    flash: function (duration, red, green, blue, force)
    {
        if (!force && this._flashAlpha > 0.0)
        {
            return;
        }

        if (red === undefined) { red = 1.0; }
        if (green === undefined) { green = 1.0; }
        if (blue === undefined) { blue = 1.0; }

        this._flashRed = red;
        this._flashGreen = green;
        this._flashBlue = blue;

        if (duration <= 0)
        {
            duration = Number.MIN_VALUE;
        }

        this._flashDuration = duration;
        this._flashAlpha = 1.0;
    },

    fade: function (duration, red, green, blue, force)
    {
        if (red === undefined) { red = 0.0; }
        if (green === undefined) { green = 0.0; }
        if (blue === undefined) { blue = 0.0; }

        if (!force && this._fadeAlpha > 0.0)
        {
            return;
        }

        this._fadeRed = red;
        this._fadeGreen = green;
        this._fadeBlue = blue;

        if (duration <= 0)
        {
            duration = Number.MIN_VALUE;
        }

        this._fadeDuration = duration;
        this._fadeAlpha = Number.MIN_VALUE;
    },

    shake: function (duration, intensity, force)
    {
        if (intensity === undefined) { intensity = 0.05; }

        if (!force && (this._shakeOffsetX !== 0.0 || this._shakeOffsetY !== 0.0))
        {
            return;
        }

        this._shakeDuration = duration;
        this._shakeIntensity = intensity;
        this._shakeOffsetX = 0;
        this._shakeOffsetY = 0;
    },

    centerToSize: function ()
    {
        this.scrollX = this.width * 0.5;
        this.scrollY = this.height * 0.5;
        
        return this;
    },

    centerToBounds: function () 
    {
        this.scrollX = (this._bounds.width * 0.5) - (this.width * 0.5);
        this.scrollY = (this._bounds.height * 0.5) - (this.height * 0.5);
        
        return this;  
    },

    transformPoint: function (pointIn, pointOut)
    {
        var cameraMatrix = this.matrix.matrix;
        var mva = cameraMatrix[0];
        var mvb = cameraMatrix[1];
        var mvc = cameraMatrix[2];
        var mvd = cameraMatrix[3];
        var mve = cameraMatrix[4];
        var mvf = cameraMatrix[5];
        var x = pointIn.x;
        var y = pointIn.y;

        if (!pointOut)
        {
            pointOut = {x: 0, y: 0};
        }

        pointOut.x = (x * mva + y * mvc + mve);
        pointOut.y = (x * mvb + y * mvd + mvf);
        
        return pointOut;
    },

    preRender: function ()
    {
        var width = this.width;
        var height = this.height;
        var zoom = this.zoom;
        var matrix = this.matrix;
        var originX = width / 2;
        var originY = height / 2;
        var follow = this._follow;

        if (follow !== null)
        {
            originX = follow.x;
            originY = follow.y;
            
            this.scrollX = originX - width * 0.5;
            this.scrollY = originY - height * 0.5;
        }

        if (this.useBounds)
        {
            var bounds = this._bounds;
            var boundsX = bounds.x;
            var boundsY = bounds.y;
            var boundsR = Math.max(bounds.right - width, width);
            var boundsB = Math.max(bounds.bottom - height, height);

            if (this.scrollX < boundsX)
            {
                this.scrollX = boundsX;
            }
            if (this.scrollX > boundsR)
            {
                this.scrollX = boundsR;
            }

            if (this.scrollY < boundsY)
            {
                this.scrollY = boundsY;
            }
            if (this.scrollY > boundsB)
            {
                this.scrollY = boundsB;
            }
        }

        if (this.roundPixels)
        {
            this.scrollX = Math.round(this.scrollX);
            this.scrollY = Math.round(this.scrollY);
        }

        matrix.loadIdentity();
        matrix.translate(this.x + originX, this.y + originY);
        matrix.rotate(this.rotation);
        matrix.scale(zoom, zoom);
        matrix.translate(-originX, -originY);
        matrix.translate(this._shakeOffsetX, this._shakeOffsetY);
    },

    /*
        camera: {
            x: int
            y: int
            width: int
            height: int
            zoom: float
            rotation: float
            roundPixels: bool
            scrollX: float
            scrollY: float
            backgroundColor: string
            bounds: {
                x: int
                y: int
                width: int
                height: int
            }
        }
    */
    toJSON: function ()
    {
        var output = {
            name: this.name,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            zoom: this.zoom,
            rotation: this.rotation,
            roundPixels: this.roundPixels,
            scrollX: this.scrollX,
            scrollY: this.scrollY,
            backgroundColor: this.backgroundColor.rgba
        };

        if (this.useBounds)
        {
            output['bounds'] = {
                x: this._bounds.x,
                y: this._bounds.y,
                width: this._bounds.width,
                height: this._bounds.height
            };
        }

        return output;
    },

    destroy: function ()
    {
        this.state = undefined;
    }

});

module.exports = Camera;
