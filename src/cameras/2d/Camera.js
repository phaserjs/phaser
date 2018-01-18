var Class = require('../../utils/Class');
var DegToRad = require('../../math/DegToRad');
var Rectangle = require('../../geom/rectangle/Rectangle');
var TransformMatrix = require('../../gameobjects/components/TransformMatrix');
var ValueToColor = require('../../display/color/ValueToColor');
var Vector2 = require('../../math/Vector2');

//  Phaser.Cameras.Scene2D.Camera

var Camera = new Class({

    initialize:

    function Camera (x, y, width, height)
    {
        this.scene;

        this.name = '';

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.roundPixels = false;

        //  Bounds
        this.useBounds = false;
        this._bounds = new Rectangle();

        this.inputEnabled = true;

        this.scrollX = 0.0;
        this.scrollY = 0.0;
        this.zoom = 1.0;
        this.rotation = 0.0;
        this.matrix = new TransformMatrix(1, 0, 0, 1, 0, 0);

        this.transparent = true;
        this.clearBeforeRender = true;
        this.backgroundColor = ValueToColor('rgba(0,0,0,0)');

        this.disableCull = false;
        this.culledObjects = [];

        //  Shake
        this._shakeDuration = 0;
        this._shakeIntensity = 0;
        this._shakeOffsetX = 0;
        this._shakeOffsetY = 0;

        //  Fade
        this._fadeDuration = 0;
        this._fadeRed = 0;
        this._fadeGreen = 0;
        this._fadeBlue = 0;
        this._fadeAlpha = 0;

        //  Flash
        this._flashDuration = 0;
        this._flashRed = 1;
        this._flashGreen = 1;
        this._flashBlue = 1;
        this._flashAlpha = 0;

        //  Follow
        this._follow = null;

        this._id = 0;
    },

    centerToBounds: function ()
    {
        this.scrollX = (this._bounds.width * 0.5) - (this.width * 0.5);
        this.scrollY = (this._bounds.height * 0.5) - (this.height * 0.5);
        
        return this;
    },

    centerToSize: function ()
    {
        this.scrollX = this.width * 0.5;
        this.scrollY = this.height * 0.5;
        
        return this;
    },

    cull: function (renderableObjects)
    {
        if (this.disableCull)
        {
            return renderableObjects;
        }

        var cameraMatrix = this.matrix.matrix;

        var mva = cameraMatrix[0];
        var mvb = cameraMatrix[1];
        var mvc = cameraMatrix[2];
        var mvd = cameraMatrix[3];
        
        /* First Invert Matrix */
        var determinant = (mva * mvd) - (mvb * mvc);

        if (!determinant)
        {
            return renderableObjects;
        }

        var mve = cameraMatrix[4];
        var mvf = cameraMatrix[5];

        var scrollX = this.scrollX;
        var scrollY = this.scrollY;
        var cameraW = this.width;
        var cameraH = this.height;
        var culledObjects = this.culledObjects;
        var length = renderableObjects.length;

        determinant = 1 / determinant;

        culledObjects.length = 0;

        for (var index = 0; index < length; ++index)
        {
            var object = renderableObjects[index];

            if (!object.hasOwnProperty('width'))
            {
                culledObjects.push(object);
                continue;
            }

            var objectW = object.width;
            var objectH = object.height;
            var objectX = (object.x - (scrollX * object.scrollFactorX)) - (objectW * object.originX);
            var objectY = (object.y - (scrollY * object.scrollFactorY)) - (objectH * object.originY);
            var tx = (objectX * mva + objectY * mvc + mve);
            var ty = (objectX * mvb + objectY * mvd + mvf);
            var tw = ((objectX + objectW) * mva + (objectY + objectH) * mvc + mve);
            var th = ((objectX + objectW) * mvb + (objectY + objectH) * mvd + mvf);
            var cullW = cameraW + objectW;
            var cullH = cameraH + objectH;

            if (tx > -objectW || ty > -objectH || tx < cullW || ty < cullH ||
                tw > -objectW || th > -objectH || tw < cullW || th < cullH)
            {
                culledObjects.push(object);
            }
        }

        return culledObjects;
    },

    cullHitTest: function (interactiveObjects)
    {
        if (this.disableCull)
        {
            return interactiveObjects;
        }

        var cameraMatrix = this.matrix.matrix;

        var mva = cameraMatrix[0];
        var mvb = cameraMatrix[1];
        var mvc = cameraMatrix[2];
        var mvd = cameraMatrix[3];
        
        /* First Invert Matrix */
        var determinant = (mva * mvd) - (mvb * mvc);

        if (!determinant)
        {
            return interactiveObjects;
        }

        var mve = cameraMatrix[4];
        var mvf = cameraMatrix[5];

        var scrollX = this.scrollX;
        var scrollY = this.scrollY;
        var cameraW = this.width;
        var cameraH = this.height;
        var length = interactiveObjects.length;

        determinant = 1 / determinant;

        var culledObjects = [];

        for (var index = 0; index < length; ++index)
        {
            var object = interactiveObjects[index].gameObject;

            if (!object.hasOwnProperty('width'))
            {
                culledObjects.push(interactiveObjects[index]);
                continue;
            }

            var objectW = object.width;
            var objectH = object.height;
            var objectX = (object.x - (scrollX * object.scrollFactorX)) - (objectW * object.originX);
            var objectY = (object.y - (scrollY * object.scrollFactorY)) - (objectH * object.originY);
            var tx = (objectX * mva + objectY * mvc + mve);
            var ty = (objectX * mvb + objectY * mvd + mvf);
            var tw = ((objectX + objectW) * mva + (objectY + objectH) * mvc + mve);
            var th = ((objectX + objectW) * mvb + (objectY + objectH) * mvd + mvf);
            var cullW = cameraW + objectW;
            var cullH = cameraH + objectH;

            if (tx > -objectW || ty > -objectH || tx < cullW || ty < cullH ||
                tw > -objectW || th > -objectH || tw < cullW || th < cullH)
            {
                culledObjects.push(interactiveObjects[index]);
            }
        }

        return culledObjects;
    },

    cullTilemap: function (tilemap)
    {
        var cameraMatrix = this.matrix.matrix;

        var mva = cameraMatrix[0];
        var mvb = cameraMatrix[1];
        var mvc = cameraMatrix[2];
        var mvd = cameraMatrix[3];
        
        /* First Invert Matrix */
        var determinant = (mva * mvd) - (mvb * mvc);

        if (!determinant)
        {
            return tiles;
        }

        var mve = cameraMatrix[4];
        var mvf = cameraMatrix[5];
        var tiles = tilemap.tiles;
        var scrollX = this.scrollX;
        var scrollY = this.scrollY;
        var cameraW = this.width;
        var cameraH = this.height;
        var culledObjects = this.culledObjects;
        var length = tiles.length;
        var tileW = tilemap.tileWidth;
        var tileH = tilemap.tileHeight;
        var cullW = cameraW + tileW;
        var cullH = cameraH + tileH;
        var scrollFactorX = tilemap.scrollFactorX;
        var scrollFactorY = tilemap.scrollFactorY;

        determinant = 1 / determinant;

        culledObjects.length = 0;

        for (var index = 0; index < length; ++index)
        {
            var tile = tiles[index];
            var tileX = (tile.x - (scrollX * scrollFactorX));
            var tileY = (tile.y - (scrollY * scrollFactorY));
            var tx = (tileX * mva + tileY * mvc + mve);
            var ty = (tileX * mvb + tileY * mvd + mvf);
            var tw = ((tileX + tileW) * mva + (tileY + tileH) * mvc + mve);
            var th = ((tileX + tileW) * mvb + (tileY + tileH) * mvd + mvf);

            if (tx > -tileW && ty > -tileH && tw < cullW && th < cullH)
            {
                culledObjects.push(tile);
            }
        }

        return culledObjects;
    },

    destroy: function ()
    {
        this._bounds = undefined;
        this.matrix = undefined;
        this.culledObjects = [];
        this.scene = undefined;
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

    getWorldPoint: function (x, y, output)
    {
        if (output === undefined) { output = new Vector2(); }

        var cameraMatrix = this.matrix.matrix;

        var mva = cameraMatrix[0];
        var mvb = cameraMatrix[1];
        var mvc = cameraMatrix[2];
        var mvd = cameraMatrix[3];
        var mve = cameraMatrix[4];
        var mvf = cameraMatrix[5];
        
        /* First Invert Matrix */
        var determinant = (mva * mvd) - (mvb * mvc);

        if (!determinant)
        {
            output.x = x;
            output.y = y;

            return output;
        }

        determinant = 1 / determinant;

        var ima = mvd * determinant;
        var imb = -mvb * determinant;
        var imc = -mvc * determinant;
        var imd = mva * determinant;
        var ime = (mvc * mvf - mvd * mve) * determinant;
        var imf = (mvb * mve - mva * mvf) * determinant;

        var c = Math.cos(this.rotation);
        var s = Math.sin(this.rotation);

        var zoom = this.zoom;

        var scrollX = this.scrollX;
        var scrollY = this.scrollY;

        var sx = x + ((scrollX * c - scrollY * s) * zoom);
        var sy = y + ((scrollX * s + scrollY * c) * zoom);

        /* Apply transform to point */
        output.x = (sx * ima + sy * imc + ime);
        output.y = (sx * imb + sy * imd + imf);
        
        return output;
    },

    ignore: function (gameObjectOrArray)
    {
        if (gameObjectOrArray instanceof Array)
        {
            for (var index = 0; index < gameObjectOrArray.length; ++index)
            {
                gameObjectOrArray[index].cameraFilter |= this._id;
            }
        }
        else
        {
            gameObjectOrArray.cameraFilter |= this._id;
        }
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

            var bw = Math.max(0, bounds.right - width);
            var bh = Math.max(0, bounds.bottom - height);

            if (this.scrollX < bounds.x)
            {
                this.scrollX = bounds.x;
            }
            else if (this.scrollX > bw)
            {
                this.scrollX = bw;
            }

            if (this.scrollY < bounds.y)
            {
                this.scrollY = bounds.y;
            }
            else if (this.scrollY > bh)
            {
                this.scrollY = bh;
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

    removeBounds: function ()
    {
        this.useBounds = false;

        this._bounds.setEmpty();

        return this;
    },

    setAngle: function (value)
    {
        if (value === undefined) { value = 0; }

        this.rotation = DegToRad(value);

        return this;
    },

    setBackgroundColor: function (color)
    {
        if (color === undefined) { color = 'rgba(0,0,0,0)'; }

        this.backgroundColor = ValueToColor(color);

        this.transparent = (this.backgroundColor.alpha === 0);

        return this;
    },

    setBounds: function (x, y, width, height)
    {
        this._bounds.setTo(x, y, width, height);

        this.useBounds = true;

        return this;
    },

    setName: function (value)
    {
        if (value === undefined) { value = ''; }

        this.name = value;

        return this;
    },

    setPosition: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    },

    setRotation: function (value)
    {
        if (value === undefined) { value = 0; }

        this.rotation = value;

        return this;
    },

    setRoundPixels: function (value)
    {
        this.roundPixels = value;

        return this;
    },

    setScene: function (scene)
    {
        this.scene = scene;

        return this;
    },

    setScroll: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.scrollX = x;
        this.scrollY = y;

        return this;
    },

    setSize: function (width, height)
    {
        if (height === undefined) { height = width; }

        this.width = width;
        this.height = height;

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

    setZoom: function (value)
    {
        if (value === undefined) { value = 1; }

        this.zoom = value;

        return this;
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

        return this;
    },

    stopFollow: function ()
    {
        /* do unfollow work here */
        this._follow = null;
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
    }

});

module.exports = Camera;
