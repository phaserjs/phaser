/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var MATH_CONST = require('../math/const');
var WrapAngle = require('../math/angle/Wrap');

/**
* 2D Transformation Component.
*
* @class
*/
var Transform = function (gameObject, x, y, scaleX, scaleY)
{
    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }
    if (scaleX === undefined) { scaleX = 1; }
    if (scaleY === undefined) { scaleY = 1; }

    this.gameObject = gameObject;

    this.state = (gameObject.state) ? gameObject.state : gameObject.parent.state;

    var w = 1;
    var h = 1;

    if (gameObject.frame)
    {
        w = gameObject.frame.cutWidth;
        h = gameObject.frame.cutHeight;
    }

    //  a = scale X
    //  b = shear Y
    //  c = shear X
    //  d = scale Y
    //  tx / ty = translation

    //  World Transform
    this.world = { a: scaleX, b: 0, c: 0, d: scaleY, tx: x, ty: y };

    //  Previous Transform (used for interpolation)
    this.old = { a: scaleX, b: 0, c: 0, d: scaleY, tx: x, ty: y };

    //  Cached Transform Calculations
    this.cache = { a: 1, b: 0, c: 0, d: 1, sr: 0, cr: 0 };

    //  GL Vertex Data
    this.glVertextData = { x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };

    //  Canvas SetTransform data
    this.canvasData = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0, dx: 0, dy: 0 };

    this.bounds = { x: x, y: y, width: w, height: h };

    this.immediate = false;

    this.interpolate = false;

    this.hasLocalRotation = false;

    //  Z-depth, for display list sorting
    this.z = 0;

    //  Private value holders, accessed via the getters and setters
    this._posX = x;
    this._posY = y;
    this._scaleX = scaleX;
    this._scaleY = scaleY;
    this._rotation = 0;
    this._pivotX = 0;
    this._pivotY = 0;
    this._anchorX = 0;
    this._anchorY = 0;

    this._worldRotation = 0;
    this._worldScaleX = scaleX;
    this._worldScaleY = scaleY;

    this._dirty = true;
    this._dirtyVertex = true;

    //  This Transforms entry in the State RTree.
    this._bbox = { minX: x, minY: y, maxX: x + w, maxY: y + h, gameObject: gameObject };

    //  The parent Transform (NOT the parent GameObject, although very often they are related)
    this.parent = null;

    //  Any child Transforms of this one - note that they don't have to belong to Game Objects
    //  that are children of the owner of this Transform
    this.children = [];

    this.state.sys.updates.add(this);
};

Transform.prototype.constructor = Transform;

Transform.prototype = {

    add: function (child)
    {
        return this.addAt(child, this.children.length);
    },

    addAt: function (child, index)
    {
        //  Invalid child?
        if (child === this || child.parent === this || index < 0 || index > this.children.length)
        {
            console.log('Invalid child');
            return child;
        }

        //  Child already parented? Remove it
        if (child.parent)
        {
            child.parent.remove(child);
        }

        child.parent = this;

        this.children.splice(index, 0, child);

        this.dirty = true;

        this.updateAncestors();

        return child;
    },

    remove: function (child)
    {
        //  Invalid child?
        if (child === this || child.parent !== this)
        {
            return child;
        }

        var index = this.children.indexOf(child);

        if (index !== -1)
        {
            return this.removeAt(index);
        }
    },

    removeAt: function (index)
    {
        //  Valid index?
        if (index >= 0 && index < this.children.length)
        {
            var child = this.children.splice(index, 1);

            if (child[0])
            {
                child[0].parent = null;

                return child[0];
            }
        }
    },

    enableInterpolation: function ()
    {
        this.interpolate = true;

        this.syncInterpolation();
    },

    syncInterpolation: function ()
    {
        this._dirty = true;

        this.update();

        var old = this.old;
        var world = this.world;

        old.a = world.a;
        old.b = world.b;
        old.c = world.c;
        old.d = world.d;
        old.tx = world.tx;
        old.ty = world.ty;
    },

    disableInterpolation: function ()
    {
        this.interpolate = false;
    },

    setPosition: function (x, y)
    {
        if (y === undefined) { y = x; }

        this._posX = x;
        this._posY = y;

        return this.update();
    },

    setScale: function (x, y)
    {
        if (y === undefined) { y = x; }

        this._scaleX = x;
        this._scaleY = y;
        this.updateCache();

        return this.update();
    },

    setPivot: function (x, y)
    {
        if (y === undefined) { y = x; }

        this._pivotX = x;
        this._pivotY = y;

        return this.update();
    },

    setAnchor: function (x, y)
    {
        if (y === undefined) { y = x; }

        this._anchorX = x;
        this._anchorY = y;

        this.dirty = true;
    },

    setRotation: function (rotation)
    {
        this.rotation = rotation;

        return this.update();
    },

    //  Updates the Transform.world object, ready for rendering
    //  Assuming this Transform is a root node (i.e. no transform parent)
    updateFromRoot: function ()
    {
        var old = this.old;
        var world = this.world;

        old.a = world.a;
        old.b = world.b;
        old.c = world.c;
        old.d = world.d;
        old.tx = world.tx;
        old.ty = world.ty;

        if (this.hasLocalRotation)
        {
            // console.log(this.name, 'Transform.updateFromRoot');

            world.a = this.cache.a;
            world.b = this.cache.b;
            world.c = this.cache.c;
            world.d = this.cache.d;
            world.tx = this._posX - ((this._pivotX * this.cache.a) + (this._pivotY * this.cache.c));
            world.ty = this._posY - ((this._pivotX * this.cache.b) + (this._pivotY * this.cache.d));

            this._worldRotation = Math.atan2(-this.cache.c, this.cache.d);
        }
        else
        {
            // console.log(this.name, 'Transform.updateFromRoot FAST');

            world.a = this._scaleX;
            world.b = 0;
            world.c = 0;
            world.d = this._scaleY;
            world.tx = this._posX - (this._pivotX * this._scaleX);
            world.ty = this._posY - (this._pivotY * this._scaleY);

            this._worldRotation = 0;
        }

        this._worldScaleX = this._scaleX;
        this._worldScaleY = this._scaleY;

        return this;
    },

    updateFromParent: function ()
    {
        var old = this.old;
        var world = this.world;

        old.a = world.a;
        old.b = world.b;
        old.c = world.c;
        old.d = world.d;
        old.tx = world.tx;
        old.ty = world.ty;

        var parent = this.parent.world;
        var tx = 0;
        var ty = 0;
        var a;
        var b;
        var c;
        var d;

        if (this.hasLocalRotation)
        {
            // console.log(this.name, 'Transform.updateFromParent', this.parent.name);

            a = this.cache.a;
            b = this.cache.b;
            c = this.cache.c;
            d = this.cache.d;

            tx = this._posX - ((this._pivotX * a) + (this._pivotY * c));
            ty = this._posY - ((this._pivotX * b) + (this._pivotY * d));

            world.a = (a * parent.a) + (b * parent.c);
            world.b = (a * parent.b) + (b * parent.d);
            world.c = (c * parent.a) + (d * parent.c);
            world.d = (c * parent.b) + (d * parent.d);
        }
        else
        {
            // console.log(this.name, 'Transform.updateFromParent FAST', this.parent.name);

            tx = this._posX - (this._pivotX * this._scaleX);
            ty = this._posY - (this._pivotY * this._scaleY);

            world.a = this._scaleX * parent.a;
            world.b = this._scaleX * parent.b;
            world.c = this._scaleY * parent.c;
            world.d = this._scaleY * parent.d;
        }

        world.tx = (tx * parent.a) + (ty * parent.c) + parent.tx;
        world.ty = (tx * parent.b) + (ty * parent.d) + parent.ty;

        a = world.a;
        b = world.b;
        c = world.c;
        d = world.d;

        var determ = (a * d) - (b * c);

        if (a || b)
        {
            var r = Math.sqrt((a * a) + (b * b));

            this._worldRotation = (b > 0) ? Math.acos(a / r) : -Math.acos(a / r);
            this._worldScaleX = r;
            this._worldScaleY = determ / r;
        }
        else if (c || d)
        {
            var s = Math.sqrt((c * c) + (d * d));

            this._worldRotation = MATH_CONST.TAU - ((d > 0) ? Math.acos(-c / s) : -Math.acos(c / s));
            this._worldScaleX = determ / s;
            this._worldScaleY = s;
        }
        else
        {
            this._worldScaleX = 0;
            this._worldScaleY = 0;
        }

        return this;
    },

    updateAncestors: function ()
    {
        // console.log(this.name, 'Transform.updateAncestors');

        //  No parent? Then just update the children and leave, our job is done
        if (!this.parent)
        {
            // console.log(this.name, 'updateAncestors has no parent Transform');

            this.updateFromRoot();

            this.updateChildren();

            this.dirty = false;

            return this;
        }

        // console.log(this.name, 'start updateAncestors while');

        //  Gets all parent nodes, starting from this Transform.
        //  Then updates from the top, down, but only on the ancestors,
        //  not any other children - will give us accurate worldX etc properties

        var node = this.parent;
        var nodes = [];

        do
        {
            nodes.push(node);
            node = node.parent;
        }
        while (node);

        //  We've got all the ancestors in the 'nodes' array, let's loop it

        while (nodes.length)
        {
            node = nodes.pop();

            if (node.parent)
            {
                node.updateFromParent();
            }
            else
            {
                node.updateFromRoot();
            }
        }

        //  By this point all of this Transforms ancestors have been
        //  updated, in the correct order, so we can now do this one
        //  and any of its children too

        this.update();
    },

    updateChildren: function ()
    {
        // console.log(this.name, 'Transform.updateChildren');

        for (var i = 0; i < this.children.length; i++)
        {
            this.children[i].update();
        }
    },

    updateFromDirtyParent: function ()
    {
        // console.log(this.name, 'is updateFromDirtyParent', this.parent.name);

        this.updateFromParent();

        if (this.children.length)
        {
            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].updateFromDirtyParent();
            }
        }

        this._dirty = false;
        this._dirtyVertex = true;
    },

    update: function ()
    {
        if (!this._dirty)
        {
            return;
        }

        //  If we got this far then this Transform is dirty
        //  so we need to update it from its parent
        //  and then force the update to all children

        if (this.parent)
        {
            this.updateFromParent();
        }
        else
        {
            this.updateFromRoot();
        }

        //  Calculate local bounds

        this.calculateLocalBounds();

        //  Update the RTree bbox entry

        if (this._bbox)
        {
            var x = this.world.tx;
            var y = this.world.ty;

            this.state.sys.tree.remove(this._bbox);

            this._bbox.minX = x;
            this._bbox.minY = y;
            this._bbox.maxX = x + this.bounds.width;
            this._bbox.maxY = y + this.bounds.height;

            this.state.sys.tree.insert(this._bbox);
        }

        //  Update the children

        var len = this.children.length;

        if (len)
        {
            for (var i = 0; i < len; i++)
            {
                this.children[i].updateFromDirtyParent();
            }
        }

        this._dirty = false;
        this._dirtyVertex = true;
    },

    deleteTreeNode: function ()
    {
        this.state.sys.tree.remove(this._bbox);

        this._bbox = undefined;
    },

    removeTreeNode: function ()
    {
        this.state.sys.tree.remove(this._bbox);
    },

    updateCache: function ()
    {
        this.cache.a = this.cache.cr * this._scaleX;
        this.cache.b = this.cache.sr * this._scaleX;
        this.cache.c = -this.cache.sr * this._scaleY;
        this.cache.d = this.cache.cr * this._scaleY;
    },

    updateVertexData: function (interpolationPercentage, renderer)
    {
        if (!this.gameObject.frame || (!this._dirtyVertex && !this.interpolate))
        {
            return;
        }

        var frame = this.gameObject.frame;

        var w0;
        var h0;
        var w1;
        var h1;

        if (frame.data.trim)
        {
            //  If the sprite is trimmed, add the extra space before transforming
            w1 = frame.x - (this._anchorX * frame.width);
            w0 = w1 + frame.cutWidth;

            h1 = frame.y - (this._anchorY * frame.height);
            h0 = h1 + frame.cutHeight;
        }
        else
        {
            w0 = frame.cutWidth * (1 - this._anchorX);
            w1 = frame.cutWidth * -this._anchorX;

            h0 = frame.cutHeight * (1 - this._anchorY);
            h1 = frame.cutHeight * -this._anchorY;
        }

        var resolution = frame.source.resolution;

        var wt = this.world;

        var a = wt.a / resolution;
        var b = wt.b / resolution;
        var c = wt.c / resolution;
        var d = wt.d / resolution;
        var tx = wt.tx;
        var ty = wt.ty;

        if (this.interpolate)
        {
            var old = this.old;

            // Interpolate with the last position to reduce stuttering.
            a = old.a + ((a - old.a) * interpolationPercentage);
            b = old.b + ((b - old.b) * interpolationPercentage);
            c = old.c + ((c - old.c) * interpolationPercentage);
            d = old.d + ((d - old.d) * interpolationPercentage);
            tx = old.tx + ((tx - old.tx) * interpolationPercentage);
            ty = old.ty + ((ty - old.ty) * interpolationPercentage);
        }

        if (frame.rotated)
        {
            // var cw = frame.cutWidth;
            var ch = frame.height;
            var a0 = a;
            var b0 = b;
            var c0 = c;
            var d0 = d;
            var _w1 = w1;
            var _w0 = w0;

            //  Offset before rotating
            tx = (wt.c * ch) + tx;
            ty = (wt.d * ch) + ty;
            
            //  Rotate matrix by 90 degrees with precalc values for sine and cosine of rad(90)
            a = (a0 * 6.123233995736766e-17) + -c0;
            b = (b0 * 6.123233995736766e-17) + -d0;
            c = a0 + (c0 * 6.123233995736766e-17);
            d = b0 + (d0 * 6.123233995736766e-17);

            // Update UV coordinates
            frame.updateUVsInverted();

            // Rotate dimensions
            w0 = h0;
            w1 = h1;
            h0 = _w0;
            h1 = _w1;
        }

        if (frame.autoRound === 1 || (frame.autoRound === -1 && renderer.roundPixels))
        {
            tx |= 0;
            ty |= 0;
        }

        var vert = this.glVertextData;

        //  Top Left Vert
        // vert.x0 = (a * w1) + (c * h1) + tx;
        // vert.y0 = (d * h1) + (b * w1) + ty;

        //  Top Right Vert
        // vert.x1 = (a * w0) + (c * h1) + tx;
        // vert.y1 = (d * h1) + (b * w0) + ty;

        //  Bottom Right Vert
        // vert.x2 = (a * w0) + (c * h0) + tx;
        // vert.y2 = (d * h0) + (b * w0) + ty;

        //  Bottom Left Vert
        // vert.x3 = (a * w1) + (c * h0) + tx;
        // vert.y3 = (d * h0) + (b * w1) + ty;
        
        return vert;
    },

    getVertexData: function (interpolationPercentage, renderer)
    {
        if (this.interpolate || this._dirtyVertex)
        {
            this.updateVertexData(interpolationPercentage, renderer);

            this._dirtyVertex = false;
        }

        return this.glVertextData;
    },

    cloneVertexData: function ()
    {
        var src = this.glVertextData;

        return {
            x0: src.x0,
            y0: src.y0,
            x1: src.x1,
            y1: src.y1,
            x2: src.x2,
            y2: src.y2,
            x3: src.x3,
            y3: src.y3
        };
    },

    getCanvasTransformData: function (interpolationPercentage, renderer)
    {
        var frame = this.gameObject.frame;

        var world = this.world;
        var data = this.canvasData;

        if (this.interpolate)
        {
            var old = this.old;

            // Interpolate with the last position to reduce stuttering.
            data.a = old.a + ((world.a - old.a) * interpolationPercentage);
            data.b = old.b + ((world.b - old.b) * interpolationPercentage);
            data.c = old.c + ((world.c - old.c) * interpolationPercentage);
            data.d = old.d + ((world.d - old.d) * interpolationPercentage);
            data.tx = old.tx + ((world.tx - old.tx) * interpolationPercentage);
            data.ty = old.ty + ((world.ty - old.ty) * interpolationPercentage);
            data.dx = old.dx + ((frame.x - (this.anchorX * frame.width)) * interpolationPercentage);
            data.dy = old.dy + ((frame.y - (this.anchorY * frame.height)) * interpolationPercentage);
        }
        else
        {
            //  Copy over the values to the canvasData object, in case the renderer needs to adjust them
            data.a = world.a;
            data.b = world.b;
            data.c = world.c;
            data.d = world.d;
            data.tx = world.tx;
            data.ty = world.ty;
            data.dx = frame.x - (this.anchorX * frame.width);
            data.dy = frame.y - (this.anchorY * frame.height);
        }

        if (frame.autoRound === 1 || (frame.autoRound === -1 && renderer.roundPixels))
        {
            data.tx |= 0;
            data.ty |= 0;
            data.dx |= 0;
            data.dy |= 0;
        }

        return data;
    },

    calculateLocalBounds: function ()
    {
        //  TODO
    }

};

Object.defineProperties(Transform.prototype, {

    //  Transform getters / setters

    x: {

        enumerable: true,

        get: function ()
        {
            return this._posX;
        },

        set: function (value)
        {
            this._posX = value;
            this.dirty = true;
        }

    },

    y: {

        enumerable: true,

        get: function ()
        {
            return this._posY;
        },

        set: function (value)
        {
            this._posY = value;
            this.dirty = true;
        }

    },

    scale: {

        enumerable: true,

        get: function ()
        {
            return this._scaleX;
        },

        set: function (value)
        {
            this._scaleX = value;
            this._scaleY = value;

            this.dirty = true;
            this.updateCache();
        }

    },

    scaleX: {

        enumerable: true,

        get: function ()
        {
            return this._scaleX;
        },

        set: function (value)
        {
            this._scaleX = value;

            this.dirty = true;
            this.updateCache();
        }

    },

    scaleY: {

        enumerable: true,

        get: function ()
        {
            return this._scaleY;
        },

        set: function (value)
        {
            this._scaleY = value;

            this.dirty = true;
            this.updateCache();
        }

    },

    anchor: {

        enumerable: true,

        get: function ()
        {
            return this._anchorX;
        },

        set: function (value)
        {
            this.setAnchor(value);
        }

    },

    anchorX: {

        enumerable: true,

        get: function ()
        {
            return this._anchorX;
        },

        set: function (value)
        {
            this._anchorX = value;
            this.dirty = true;
        }

    },

    anchorY: {

        enumerable: true,

        get: function ()
        {
            return this._anchorY;
        },

        set: function (value)
        {
            this._anchorY = value;
            this.dirty = true;
        }

    },

    pivotX: {

        enumerable: true,

        get: function ()
        {
            return this._pivotX;
        },

        set: function (value)
        {
            this._pivotX = value;
            this.dirty = true;
            this.updateCache();
        }

    },

    pivotY: {

        enumerable: true,

        get: function ()
        {
            return this._pivotY;
        },

        set: function (value)
        {
            this._pivotY = value;
            this.dirty = true;
            this.updateCache();
        }

    },

    angle: {

        enumerable: true,

        get: function ()
        {
            return WrapAngle(this.rotation * MATH_CONST.RAD_TO_DEG);
        },

        set: function (value)
        {
            this.rotation = WrapAngle(value) * MATH_CONST.DEG_TO_RAD;
        }

    },

    rotation: {

        enumerable: true,

        get: function ()
        {
            return this._rotation;
        },

        set: function (value)
        {
            if (this._rotation === value)
            {
                return;
            }

            this._rotation = value;
            this.dirty = true;

            if (this._rotation % MATH_CONST.PI2)
            {
                this.cache.sr = Math.sin(this._rotation);
                this.cache.cr = Math.cos(this._rotation);
                this.updateCache();
                this.hasLocalRotation = true;
            }
            else
            {
                this.hasLocalRotation = false;
            }
        }

    },

    //  Sets this *component* as being dirty
    dirty: {

        enumerable: true,

        get: function ()
        {
            return this._dirty;
        },

        set: function (value)
        {
            if (value)
            {
                if (!this._dirty)
                {
                    this._dirty = true;

                    if (this.immediate)
                    {
                        this.update();
                    }
                    else
                    {
                        this._dirtyVertex = true;
                        this.state.sys.updates.add(this);
                    }
                }
            }
            else
            {
                this._dirty = false;
            }
        }

    },

    //  GLOBAL read-only properties from here on
    //  Need *all* parents taken into account to get the correct values

    name: {

        enumerable: true,

        get: function ()
        {
            return (this.gameObject) ? this.gameObject.name : '';
        }

    },

    worldRotation: {

        enumerable: true,

        get: function ()
        {
            this.updateAncestors();

            return this._worldRotation;
        }

    },

    worldScaleX: {

        enumerable: true,

        get: function ()
        {
            this.updateAncestors();

            return this._worldScaleX;
        }

    },

    worldScaleY: {

        enumerable: true,

        get: function ()
        {
            this.updateAncestors();

            return this._worldScaleY;
        }

    },

    worldX: {

        enumerable: true,

        get: function ()
        {
            this.updateAncestors();

            return this.world.tx;
        }

    },

    worldY: {

        enumerable: true,

        get: function ()
        {
            this.updateAncestors();

            return this.world.ty;
        }

    }

});

module.exports = Transform;
