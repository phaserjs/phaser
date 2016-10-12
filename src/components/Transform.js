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

    //  Local Transform
    //  a = scale X
    //  b = shear Y
    //  c = shear X
    //  d = scale Y
    //  tx / ty = translation
    this.local = { a: scaleX, b: 0, c: 0, d: scaleY, tx: x, ty: y };

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

    this._worldRotation = 0;
    this._worldScaleX = scaleX;
    this._worldScaleY = scaleY;

    this.dirty = false;

    this.parent = null;

     // Optional if Flat Display List?
    // this.children = new Children(this);

    // if (parent)
    // {
    //     parent.children.add(this);
    // }
};

Phaser.Component.Transform.prototype.constructor = Phaser.Component.Transform;

Phaser.Component.Transform.prototype = {

    setContextTransform: function (context)
    {
        //  Have they modified a local property? (like x, y, scale, etc)
        //  If so, we need to update, and spread it down to the children.
        //  It's possible this has already been called by an update further
        //  up the display list too.

        if (this.dirty)
        {
            this.update();
        }

        context.setTransform(
            this.world.a,
            this.world.b,
            this.world.c,
            this.world.d,
            this.world.tx,
            this.world.ty);

        return this;
    },

    //  Updates the Transform.world object, ready for rendering
    //  Assuming this Transform is attached to the root (i.e. no parent)
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
            this.world.tx = this._posX - this._pivotX * this._scaleX;
            this.world.ty = this._posY - this._pivotY * this._scaleY;

            this._worldRotation = 0;
        }

        this._worldScaleX = this._scaleX;
        this._worldScaleY = this._scaleY;

        return this;
    },

    updateFromParent: function ()
    {
        let parent = this.parent.world;
        let tx = 0;
        let ty = 0;

        if (this.hasLocalRotation)
        {
            // console.log(this.name, 'Transform.updateFromParent', this.parent.name);

            let a = this.cache.a;
            let b = this.cache.b;
            let c = this.cache.c;
            let d = this.cache.d;

            tx = this._posX - (this._pivotX * a + this._pivotY * c);
            ty = this._posY - (this._pivotX * b + this._pivotY * d);

            this.world.a = a * parent.a + b * parent.c;
            this.world.b = a * parent.b + b * parent.d;
            this.world.c = c * parent.a + d * parent.c;
            this.world.d = c * parent.b + d * parent.d;

            this._worldRotation = Math.atan2(-this.world.c, this.world.d);
        }
        else
        {
            // console.log(this.name, 'Transform.updateFromParent FAST', this.parent.name);

            tx = this._posX - this._pivotX * this._scaleX;
            ty = this._posY - this._pivotY * this._scaleY;

            this.world.a = this._scaleX * parent.a;
            this.world.b = this._scaleX * parent.b;
            this.world.c = this._scaleY * parent.c;
            this.world.d = this._scaleY * parent.d;

            this._worldRotation = 0;
        }

        this.world.tx = tx * parent.a + ty * parent.c + parent.tx;
        this.world.ty = ty * parent.b + ty * parent.d + parent.ty;

        this._worldScaleX = this._scaleX * Math.sqrt(this.world.a * this.world.a + this.world.c * this.world.c);
        this._worldScaleY = this._scaleY * Math.sqrt(this.world.b * this.world.b + this.world.d * this.world.d);

        return this;
    },

    updateAncestors: function ()
    {
        //  No parent? Then just update the children and leave, our job is done
        if (!this.parent)
        {
            this.updateFromRoot();
            this.children.update();
            this.dirty = false;

            return this;
        }

        // console.log(this.name, 'updateAncestors');

        //  Gets all parent nodes, starting from this Transform.
        //  Then updates from the top, down, but only on the ancestors,
        //  not any other children - will give us accurate worldX etc properties

        let node = this.parent;
        let nodes = [];

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

        return this.update();
    },

    update: function ()
    {
        if (this.parent)
        {
            this.updateFromParent();
        }
        else
        {
            this.updateFromRoot();
        }

        //  Update children

        this.children.update();

        this.dirty = false;

        return this;
    },

    updateCache: function ()
    {
        this.cache.a = this.cache.cr * this._scaleX;
        this.cache.b = this.cache.sr * this._scaleX;
        this.cache.c = -this.cache.sr * this._scaleY;
        this.cache.d = this.cache.cr * this._scaleY;
    }

};
