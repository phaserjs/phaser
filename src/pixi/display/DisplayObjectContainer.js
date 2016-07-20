/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A DisplayObjectContainer represents a collection of display objects.
 * It is the base class of all display objects that act as a container for other objects.
 *
 * @class DisplayObjectContainer
 * @extends DisplayObject
 * @constructor
 */
PIXI.DisplayObjectContainer = function()
{
    PIXI.DisplayObject.call(this);

    /**
     * [read-only] The array of children of this container.
     *
     * @property children
     * @type Array(DisplayObject)
     * @readOnly
     */
    this.children = [];

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
    
};

// constructor
PIXI.DisplayObjectContainer.prototype = Object.create( PIXI.DisplayObject.prototype );
PIXI.DisplayObjectContainer.prototype.constructor = PIXI.DisplayObjectContainer;

/**
 * The width of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'width', {

    get: function() {
        return this.getLocalBounds().width;
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
        return this.getLocalBounds().height;
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

/**
 * Adds a child to the container.
 *
 * @method addChild
 * @param child {DisplayObject} The DisplayObject to add to the container
 * @return {DisplayObject} The child that was added.
 */
PIXI.DisplayObjectContainer.prototype.addChild = function(child)
{
    return this.addChildAt(child, this.children.length);
};

/**
 * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
 *
 * @method addChildAt
 * @param child {DisplayObject} The child to add
 * @param index {Number} The index to place the child in
 * @return {DisplayObject} The child that was added.
 */
PIXI.DisplayObjectContainer.prototype.addChildAt = function(child, index)
{
    if(index >= 0 && index <= this.children.length)
    {
        if(child.parent)
        {
            child.parent.removeChild(child);
        }

        child.parent = this;

        this.children.splice(index, 0, child);

        if(this.stage)child.setStageReference(this.stage);

        return child;
    }
    else
    {
        throw new Error(child + 'addChildAt: The index '+ index +' supplied is out of bounds ' + this.children.length);
    }
};

/**
 * Swaps the position of 2 Display Objects within this container.
 *
 * @method swapChildren
 * @param child {DisplayObject}
 * @param child2 {DisplayObject}
 */
PIXI.DisplayObjectContainer.prototype.swapChildren = function(child, child2)
{
    if(child === child2) {
        return;
    }

    var index1 = this.getChildIndex(child);
    var index2 = this.getChildIndex(child2);

    if(index1 < 0 || index2 < 0) {
        throw new Error('swapChildren: Both the supplied DisplayObjects must be a child of the caller.');
    }

    this.children[index1] = child2;
    this.children[index2] = child;

};

/**
 * Returns the index position of a child DisplayObject instance
 *
 * @method getChildIndex
 * @param child {DisplayObject} The DisplayObject instance to identify
 * @return {Number} The index position of the child display object to identify
 */
PIXI.DisplayObjectContainer.prototype.getChildIndex = function(child)
{
    var index = this.children.indexOf(child);
    if (index === -1)
    {
        throw new Error('The supplied DisplayObject must be a child of the caller');
    }
    return index;
};

/**
 * Changes the position of an existing child in the display object container
 *
 * @method setChildIndex
 * @param child {DisplayObject} The child DisplayObject instance for which you want to change the index number
 * @param index {Number} The resulting index number for the child display object
 */
PIXI.DisplayObjectContainer.prototype.setChildIndex = function(child, index)
{
    if (index < 0 || index >= this.children.length)
    {
        throw new Error('The supplied index is out of bounds');
    }
    var currentIndex = this.getChildIndex(child);
    this.children.splice(currentIndex, 1); //remove from old position
    this.children.splice(index, 0, child); //add at new position
};

/**
 * Returns the child at the specified index
 *
 * @method getChildAt
 * @param index {Number} The index to get the child from
 * @return {DisplayObject} The child at the given index, if any.
 */
PIXI.DisplayObjectContainer.prototype.getChildAt = function(index)
{
    if (index < 0 || index >= this.children.length)
    {
        throw new Error('getChildAt: Supplied index '+ index +' does not exist in the child list, or the supplied DisplayObject must be a child of the caller');
    }
    return this.children[index];
    
};

/**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param child {DisplayObject} The DisplayObject to remove
 * @return {DisplayObject} The child that was removed.
 */
PIXI.DisplayObjectContainer.prototype.removeChild = function(child)
{
    var index = this.children.indexOf( child );
    if(index === -1)return;
    
    return this.removeChildAt( index );
};

/**
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param index {Number} The index to get the child from
 * @return {DisplayObject} The child that was removed.
 */
PIXI.DisplayObjectContainer.prototype.removeChildAt = function(index)
{
    var child = this.getChildAt( index );
    if(this.stage)
        child.removeStageReference();

    child.parent = undefined;
    this.children.splice( index, 1 );
    return child;
};

/**
* Removes all children from this container that are within the begin and end indexes.
*
* @method removeChildren
* @param beginIndex {Number} The beginning position. Default value is 0.
* @param endIndex {Number} The ending position. Default value is size of the container.
*/
PIXI.DisplayObjectContainer.prototype.removeChildren = function(beginIndex, endIndex)
{
    var begin = beginIndex || 0;
    var end = typeof endIndex === 'number' ? endIndex : this.children.length;
    var range = end - begin;

    if (range > 0 && range <= end)
    {
        var removed = this.children.splice(begin, range);
        for (var i = 0; i < removed.length; i++) {
            var child = removed[i];
            if(this.stage)
                child.removeStageReference();
            child.parent = undefined;
        }
        return removed;
    }
    else if (range === 0 && this.children.length === 0)
    {
        return [];
    }
    else
    {
        throw new Error( 'removeChildren: Range Error, numeric values are outside the acceptable range' );
    }
};

/*
 * Updates the transform on all children of this container for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.DisplayObjectContainer.prototype.updateTransform = function ()
{
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

// performance increase to avoid using call.. (10x faster)
PIXI.DisplayObjectContainer.prototype.displayObjectContainerUpdateTransform = PIXI.DisplayObjectContainer.prototype.updateTransform;

/**
 * Retrieves the global bounds of the displayObjectContainer as a rectangle. The bounds calculation takes all visible children into consideration.
 *
 * @method getBounds
 * @param {PIXI.DisplayObject|PIXI.Matrix} [targetCoordinateSpace] Returns a rectangle that defines the area of the display object relative to the coordinate system of the targetCoordinateSpace object.
 * @return {Rectangle} The rectangular bounding area
 */
PIXI.DisplayObjectContainer.prototype.getBounds = function (targetCoordinateSpace)
{
    var isTargetCoordinateSpaceDisplayObject = targetCoordinateSpace && targetCoordinateSpace instanceof PIXI.DisplayObject;
    var isTargetCoordinateSpaceThisOrParent = true;

    if (!isTargetCoordinateSpaceDisplayObject) {
        targetCoordinateSpace = this;
    } else if (targetCoordinateSpace instanceof PIXI.DisplayObjectContainer) {
        isTargetCoordinateSpaceThisOrParent = targetCoordinateSpace.contains(this);
    } else {
        isTargetCoordinateSpaceThisOrParent = false;
    }

    var i;

    if (isTargetCoordinateSpaceDisplayObject) {

        var matrixCache = targetCoordinateSpace.worldTransform;

        targetCoordinateSpace.worldTransform = PIXI.identityMatrix;

        for (i = 0; i < targetCoordinateSpace.children.length; i++) {
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

    for (i = 0; i < this.children.length; i++) {
        var child = this.children[i];

        if (!child.visible) {
            continue;
        }

        childVisible = true;

        childBounds = this.children[i].getBounds();

        minX = minX < childBounds.x ? minX : childBounds.x;
        minY = minY < childBounds.y ? minY : childBounds.y;

        childMaxX = childBounds.width + childBounds.x;
        childMaxY = childBounds.height + childBounds.y;

        maxX = maxX > childMaxX ? maxX : childMaxX;
        maxY = maxY > childMaxY ? maxY : childMaxY;
    }

    var bounds = this._bounds;

    if (!childVisible) {
        bounds = new PIXI.Rectangle();

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

    if (isTargetCoordinateSpaceDisplayObject) {
        targetCoordinateSpace.worldTransform = matrixCache;

        for (i = 0; i < targetCoordinateSpace.children.length; i++) {
            targetCoordinateSpace.children[i].updateTransform();
        }
    }

    if (!isTargetCoordinateSpaceThisOrParent) {
        var targetCoordinateSpaceBounds = targetCoordinateSpace.getBounds();

        bounds.x -= targetCoordinateSpaceBounds.x;
        bounds.y -= targetCoordinateSpaceBounds.y;
    }

    return bounds;
};

/**
 * Retrieves the non-global local bounds of the displayObjectContainer as a rectangle. The calculation takes all visible children into consideration.
 *
 * @method getLocalBounds
 * @return {Rectangle} The rectangular bounding area
 */
PIXI.DisplayObjectContainer.prototype.getLocalBounds = function()
{
    return this.getBounds(this.parent);
};

/**
* Determines whether the specified display object is a child of the DisplayObjectContainer instance or the instance itself.
*
* @method contains
* @param {DisplayObject} child
* @returns {boolean}
*/
PIXI.DisplayObjectContainer.prototype.contains = function (child) {
    if (!child)
        return false;

    if (child === this) {
        return true;
    }
    else {
        return this.contains(child.parent);
    }
}

/**
 * Sets the containers Stage reference. This is the Stage that this object, and all of its children, is connected to.
 *
 * @method setStageReference
 * @param stage {Stage} the stage that the container will have as its current stage reference
 */
PIXI.DisplayObjectContainer.prototype.setStageReference = function(stage)
{
    this.stage = stage;
    
    for (var i=0; i < this.children.length; i++)
    {
        this.children[i].setStageReference(stage)
    }
};

/**
 * Removes the current stage reference from the container and all of its children.
 *
 * @method removeStageReference
 */
PIXI.DisplayObjectContainer.prototype.removeStageReference = function()
{
    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i].removeStageReference();
    }

    this.stage = null;
};

/**
* Renders the object using the WebGL renderer
*
* @method _renderWebGL
* @param renderSession {RenderSession} 
* @private
*/
PIXI.DisplayObjectContainer.prototype._renderWebGL = function(renderSession)
{
    if (!this.visible || this.alpha <= 0) return;
    
    if (this._cacheAsBitmap)
    {
        this._renderCachedSprite(renderSession);
        return;
    }
    
    var i;

    if (this._mask || this._filters)
    {
        // push filter first as we need to ensure the stencil buffer is correct for any masking
        if (this._filters)
        {
            renderSession.spriteBatch.flush();
            renderSession.filterManager.pushFilter(this._filterBlock);
        }

        if (this._mask)
        {
            renderSession.spriteBatch.stop();
            renderSession.maskManager.pushMask(this.mask, renderSession);
            renderSession.spriteBatch.start();
        }

        // simple render children!
        for (i = 0; i < this.children.length; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }

        renderSession.spriteBatch.stop();

        if (this._mask) renderSession.maskManager.popMask(this._mask, renderSession);
        if (this._filters) renderSession.filterManager.popFilter();
        
        renderSession.spriteBatch.start();
    }
    else
    {
        // simple render children!
        for (i = 0; i < this.children.length; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }
    }
};

/**
* Renders the object using the Canvas renderer
*
* @method _renderCanvas
* @param renderSession {RenderSession} 
* @private
*/
PIXI.DisplayObjectContainer.prototype._renderCanvas = function(renderSession)
{
    if (this.visible === false || this.alpha === 0) return;

    if (this._cacheAsBitmap)
    {
        this._renderCachedSprite(renderSession);
        return;
    }

    if (this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, renderSession);
    }

    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i]._renderCanvas(renderSession);
    }

    if (this._mask)
    {
        renderSession.maskManager.popMask(renderSession);
    }

};
