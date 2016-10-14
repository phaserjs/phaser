/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* 2D Transformation Component.
*
* @class
*/
Phaser.Component.Transform = function (gameObject, x, y, scaleX, scaleY)
{
    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }
    if (scaleX === undefined) { scaleX = 1; }
    if (scaleY === undefined) { scaleY = 1; }

    this.game = gameObject.game;

    this.gameObject = gameObject;

    //  Local Transform
    //  a = scale X
    //  b = shear Y
    //  c = shear X
    //  d = scale Y
    //  tx / ty = translation
    // this.local = { a: scaleX, b: 0, c: 0, d: scaleY, tx: x, ty: y };

    //  World Transform
    this.world = { a: scaleX, b: 0, c: 0, d: scaleY, tx: x, ty: y };

    //  Cached Transform Calculations
    this.cache = { a: 1, b: 0, c: 0, d: 1, sr: 0, cr: 0 };

    this.hasLocalRotation = false;

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
    
    this.game.updates.add(this);

    //  The parent Transform (NOT the parent GameObject, although very often they are related)
    this.parent = null;

    //  Any child Tranforms of this one - note that they don't have to belong to Game Objects
    //  that are children of the owner of this Transform
    this.children = [];

    // if (gameObject.parent && gameObject.parent.transform)
    // {
    //     gameObject.parent.transform.add(this);
    // }
};

Phaser.Component.Transform.prototype.constructor = Phaser.Component.Transform;

Phaser.Component.Transform.prototype = {

    add: function (child)
    {
        return this.addAt(child, this.children.length);
    },

    addAt: function (child, index)
    {
        //  Invalid child?
        if (child === this || child.parent === this || index < 0 || index > this.children.length)
        {
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

        return this.update();
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
        if (this.hasLocalRotation)
        {
            // console.log(this.name, 'Transform.updateFromRoot');

            this.world.a = this.cache.a;
            this.world.b = this.cache.b;
            this.world.c = this.cache.c;
            this.world.d = this.cache.d;
            this.world.tx = this._posX - (this._pivotX * this.cache.a + this._pivotY * this.cache.c);
            this.world.ty = this._posY - (this._pivotX * this.cache.b + this._pivotY * this.cache.d);

            this._worldRotation = Math.atan2(-this.cache.c, this.cache.d);
        }
        else
        {
            // console.log(this.name, 'Transform.updateFromRoot FAST');

            this.world.a = this._scaleX;
            this.world.b = 0;
            this.world.c = 0;
            this.world.d = this._scaleY;
            this.world.tx = this._posX - (this._pivotX * this._scaleX);
            this.world.ty = this._posY - (this._pivotY * this._scaleY);

            this._worldRotation = 0;
        }

        this._worldScaleX = this._scaleX;
        this._worldScaleY = this._scaleY;

        return this;
    },

    updateFromParent: function ()
    {
        var parent = this.parent.world;
        var tx = 0;
        var ty = 0;

        if (this.hasLocalRotation)
        {
            // console.log(this.name, 'Transform.updateFromParent', this.parent.name);

            var a = this.cache.a;
            var b = this.cache.b;
            var c = this.cache.c;
            var d = this.cache.d;

            tx = this._posX - ((this._pivotX * a) + (this._pivotY * c));
            ty = this._posY - ((this._pivotX * b) + (this._pivotY * d));

            this.world.a = (a * parent.a) + (b * parent.c);
            this.world.b = (a * parent.b) + (b * parent.d);
            this.world.c = (c * parent.a) + (d * parent.c);
            this.world.d = (c * parent.b) + (d * parent.d);
        }
        else
        {
            // console.log(this.name, 'Transform.updateFromParent FAST', this.parent.name);

            tx = this._posX - (this._pivotX * this._scaleX);
            ty = this._posY - (this._pivotY * this._scaleY);

            this.world.a = this._scaleX * parent.a;
            this.world.b = this._scaleX * parent.b;
            this.world.c = this._scaleY * parent.c;
            this.world.d = this._scaleY * parent.d;
        }

        this._worldRotation = Math.atan2(-this.world.c, this.world.d);

        this.world.tx = (tx * parent.a) + (ty * parent.c) + parent.tx;
        this.world.ty = (tx * parent.b) + (ty * parent.d) + parent.ty;

        this._worldScaleX = this._scaleX * Math.sqrt((this.world.a * this.world.a) + (this.world.c * this.world.c));
        this._worldScaleY = this._scaleY * Math.sqrt((this.world.b * this.world.b) + (this.world.d * this.world.d));

        return this;
    },

    updateAncestors: function ()
    {
        //  No parent? Then just update the children and leave, our job is done
        if (!this.parent)
        {
            this.updateFromRoot();
            this.updateChildren();
            this.dirty = false;

            return this;
        }

        // console.log(this.name, 'updateAncestors');

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
        for (var i = 0; i < this.children.length; i++)
        {
            this.children[i].update();
        }
    },

    updateFromDirtyParent: function ()
    {
        this.updateFromParent();

        if (this.children.length)
        {
            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].updateFromDirtyParent();
            }
        }

        this._dirty = false;
    },

    update: function ()
    {
        // console.log('Transform.update', this.gameObject.name, this.dirty);

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

        var len = this.children.length;

        if (len)
        {
            for (var i = 0; i < len; i++)
            {
                this.children[i].updateFromDirtyParent();
            }
        }

        this._dirty = false;
    },

    updateCache: function ()
    {
        this.cache.a = this.cache.cr * this._scaleX;
        this.cache.b = this.cache.sr * this._scaleX;
        this.cache.c = -this.cache.sr * this._scaleY;
        this.cache.d = this.cache.cr * this._scaleY;
    }

};

Object.defineProperties(Phaser.Component.Transform.prototype, {

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
                    this.game.updates.add(this);
                }

                this._dirty = true;
            }
            else
            {
                this._dirty = false;
            }
        }

    },

    //  GLOBAL read-only properties from here on
    //  Need *all* parents taken into account to get the correct values

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
