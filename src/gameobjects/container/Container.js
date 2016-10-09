/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
Phaser.GameObject.Container = function () {

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.CONTAINER;

    /**
    * If `ignoreChildInput`  is `false` it will allow this objects _children_ to be considered as valid for Input events.
    * 
    * If this property is `true` then the children will _not_ be considered as valid for Input events.
    * 
    * Note that this property isn't recursive: only immediate children are influenced, it doesn't scan further down.
    * @property {boolean} ignoreChildInput
    * @default
    */
    this.ignoreChildInput = false;


    // PIXI.Sprite.call(this, Phaser.Cache.DEFAULT);

    // Phaser.Component.Core.init.call(this, game, x, y, key, frame);

};

Phaser.GameObject.Container.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.GameObject.Container.prototype.constructor = Phaser.GameObject.Container;

/*
 * Updates the transform on all children of this container for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.DisplayObjectContainer.prototype.updateTransform = function () {

    if (!this.visible)
    {
        return;
    }

    this.displayObjectUpdateTransform();

    if (this._cacheAsBitmap)
    {
        return;
    }

    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i].updateTransform();
    }

};

/**
 * Retrieves the global bounds of the displayObjectContainer as a rectangle. The bounds calculation takes all visible children into consideration.
 *
 * @method getBounds
 * @param {PIXI.DisplayObject|PIXI.Matrix} [targetCoordinateSpace] Returns a rectangle that defines the area of the display object relative to the coordinate system of the targetCoordinateSpace object.
 * @return {Rectangle} The rectangular bounding area
 */
PIXI.DisplayObjectContainer.prototype.getBounds = function (targetCoordinateSpace) {

    var isTargetCoordinateSpaceDisplayObject = (targetCoordinateSpace && targetCoordinateSpace instanceof PIXI.DisplayObject);
    var isTargetCoordinateSpaceThisOrParent = true;

    if (!isTargetCoordinateSpaceDisplayObject) 
    {
        targetCoordinateSpace = this;
    } 
    else if (targetCoordinateSpace instanceof PIXI.DisplayObjectContainer) 
    {
        isTargetCoordinateSpaceThisOrParent = targetCoordinateSpace.contains(this);
    } 
    else 
    {
        isTargetCoordinateSpaceThisOrParent = false;
    }

    var i;

    if (isTargetCoordinateSpaceDisplayObject)
    {
        var matrixCache = targetCoordinateSpace.worldTransform;

        targetCoordinateSpace.worldTransform = Phaser.identityMatrix;

        for (i = 0; i < targetCoordinateSpace.children.length; i++) 
        {
            targetCoordinateSpace.children[i].updateTransform();
        }
    }

    var minX = Infinity;
    var minY = Infinity;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var childBounds;
    var childMaxX;
    var childMaxY;

    var childVisible = false;

    for (i = 0; i < this.children.length; i++)
    {
        var child = this.children[i];

        if (!child.visible)
        {
            continue;
        }

        childVisible = true;

        childBounds = this.children[i].getBounds();

        minX = (minX < childBounds.x) ? minX : childBounds.x;
        minY = (minY < childBounds.y) ? minY : childBounds.y;

        childMaxX = childBounds.width + childBounds.x;
        childMaxY = childBounds.height + childBounds.y;

        maxX = (maxX > childMaxX) ? maxX : childMaxX;
        maxY = (maxY > childMaxY) ? maxY : childMaxY;
    }

    var bounds = this._bounds;

    if (!childVisible) 
    {
        bounds = new Phaser.Rectangle();

        var w0 = bounds.x;
        var w1 = bounds.width + bounds.x;

        var h0 = bounds.y;
        var h1 = bounds.height + bounds.y;

        var worldTransform = this.worldTransform;

        var a = worldTransform.a;
        var b = worldTransform.b;
        var c = worldTransform.c;
        var d = worldTransform.d;
        var tx = worldTransform.tx;
        var ty = worldTransform.ty;

        var x1 = a * w1 + c * h1 + tx;
        var y1 = d * h1 + b * w1 + ty;

        var x2 = a * w0 + c * h1 + tx;
        var y2 = d * h1 + b * w0 + ty;

        var x3 = a * w0 + c * h0 + tx;
        var y3 = d * h0 + b * w0 + ty;

        var x4 = a * w1 + c * h0 + tx;
        var y4 = d * h0 + b * w1 + ty;

        maxX = x1;
        maxY = y1;

        minX = x1;
        minY = y1;

        minX = x2 < minX ? x2 : minX;
        minX = x3 < minX ? x3 : minX;
        minX = x4 < minX ? x4 : minX;

        minY = y2 < minY ? y2 : minY;
        minY = y3 < minY ? y3 : minY;
        minY = y4 < minY ? y4 : minY;

        maxX = x2 > maxX ? x2 : maxX;
        maxX = x3 > maxX ? x3 : maxX;
        maxX = x4 > maxX ? x4 : maxX;

        maxY = y2 > maxY ? y2 : maxY;
        maxY = y3 > maxY ? y3 : maxY;
        maxY = y4 > maxY ? y4 : maxY;
    }

    bounds.x = minX;
    bounds.y = minY;
    bounds.width = maxX - minX;
    bounds.height = maxY - minY;

    if (isTargetCoordinateSpaceDisplayObject) 
    {
        targetCoordinateSpace.worldTransform = matrixCache;

        for (i = 0; i < targetCoordinateSpace.children.length; i++) 
        {
            targetCoordinateSpace.children[i].updateTransform();
        }
    }

    if (!isTargetCoordinateSpaceThisOrParent) 
    {
        var targetCoordinateSpaceBounds = targetCoordinateSpace.getBounds();

        bounds.x -= targetCoordinateSpaceBounds.x;
        bounds.y -= targetCoordinateSpaceBounds.y;
    }

    return bounds;

};

/**
 * Retrieves the non-global local bounds of the displayObjectContainer as a rectangle without any transformations. The calculation takes all visible children into consideration.
 *
 * @method getLocalBounds
 * @return {Rectangle} The rectangular bounding area
 */
PIXI.DisplayObjectContainer.prototype.getLocalBounds = function () {

    return this.getBounds(this);

};

/**
 * The width of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'width', {

    get: function() {
        return this.getLocalBounds().width * this.scale.x;
    },

    set: function(value) {
        
        var width = this.getLocalBounds().width;

        if (width !== 0)
        {
            this.scale.x = value / width;
        }
        else
        {
            this.scale.x = 1;
        }
        
        this._width = value;
    }
});

/**
 * The height of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'height', {

    get: function() {
        return this.getLocalBounds().height * this.scale.y;
    },

    set: function(value) {

        var height = this.getLocalBounds().height;

        if (height !== 0)
        {
            this.scale.y = value / height;
        }
        else
        {
            this.scale.y = 1;
        }

        this._height = value;
    }

});

