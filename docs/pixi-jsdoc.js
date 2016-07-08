/**
* @namespace PIXI
*/
/**
* @fileoverview
* @author Richard Davey <rich@photonstorm.com>
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 1
*/
/**
* @class PIXI.PIXI.DisplayObject
* @description The base class for all objects that are rendered. Contains properties for position, scaling,
rotation, masks and cache handling.

This is an abstract class and should not be used on its own, rather it should be extended.

It is used internally by the likes of PIXI.Sprite.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 7
*/
/**
* @description The coordinates, in pixels, of this DisplayObject, relative to its parent container.

The value of this property does not reflect any positioning happening further up the display list.
To obtain that value please see the `worldPosition` property.
* @member PIXI.PIXI.DisplayObject#position
* @type {PIXIPoint}
* @default 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 20
*/
/**
* @description The scale of this DisplayObject. A scale of 1:1 represents the DisplayObject
at its default size. A value of 0.5 would scale this DisplayObject by half, and so on.

The value of this property does not reflect any scaling happening further up the display list.
To obtain that value please see the `worldScale` property.
* @member PIXI.PIXI.DisplayObject#scale
* @type {PIXIPoint}
* @default 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 31
*/
/**
* @description The pivot point of this DisplayObject that it rotates around. The values are expressed
in pixel values.
* @member PIXI.PIXI.DisplayObject#pivot
* @type {PIXIPoint}
* @default 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 43
*/
/**
* @description The rotation of this DisplayObject. The value is given, and expressed, in radians, and is based on
a right-handed orientation.

The value of this property does not reflect any rotation happening further up the display list.
To obtain that value please see the `worldRotation` property.
* @member PIXI.PIXI.DisplayObject#rotation
* @type {Number}
* @default 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 51
*/
/**
* @description The alpha value of this DisplayObject. A value of 1 is fully opaque. A value of 0 is transparent.
Please note that an object with an alpha value of 0 is skipped during the render pass.

The value of this property does not reflect any alpha values set further up the display list.
To obtain that value please see the `worldAlpha` property.
* @member PIXI.PIXI.DisplayObject#alpha
* @type {Number}
* @default 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 63
*/
/**
* @description The visibility of this DisplayObject. A value of `false` makes the object invisible.
A value of `true` makes it visible. Please note that an object with a visible value of
`false` is skipped during the render pass. Equally a DisplayObject with visible false will
not render any of its children.

The value of this property does not reflect any visible values set further up the display list.
To obtain that value please see the `worldVisible` property.
* @member PIXI.PIXI.DisplayObject#visible
* @type {Boolean}
* @default 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 75
*/
/**
* @description This is the defined area that will pick up mouse / touch events. It is null by default.
Setting it is a neat way of optimising the hitTest function that the interactionManager will use (as it will not need to hit test all the children)
* @member PIXI.PIXI.DisplayObject#hitArea
* @type {(Rectangle|Circle|Ellipse|Polygon)}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 89
*/
/**
* @description Should this DisplayObject be rendered by the renderer? An object with a renderable value of
`false` is skipped during the render pass.
* @member PIXI.PIXI.DisplayObject#renderable
* @type {Boolean}
* @default 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 98
*/
/**
* @description The parent DisplayObjectContainer that this DisplayObject is a child of.
All DisplayObjects must belong to a parent in order to be rendered.
The root parent is the Stage object. This property is set automatically when the
DisplayObject is added to, or removed from, a DisplayObjectContainer.
* @member PIXI.PIXI.DisplayObject#parent
* @type {PIXIDisplayObjectContainer}
* @readonly 
* @default 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 107
*/
/**
* @description The stage that this DisplayObject is connected to.
* @member PIXI.PIXI.DisplayObject#stage
* @type {PIXIStage}
* @readonly 
* @default 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 119
*/
/**
* @description The multiplied alpha value of this DisplayObject. A value of 1 is fully opaque. A value of 0 is transparent.
This value is the calculated total, based on the alpha values of all parents of this DisplayObjects 
in the display list.

To obtain, and set, the local alpha value, see the `alpha` property.

Note: This property is only updated at the end of the `updateTransform` call, once per render. Until 
that happens this property will contain values based on the previous frame. Be mindful of this if
accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.
* @member PIXI.PIXI.DisplayObject#worldAlpha
* @type {Number}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 128
*/
/**
* @description The current transform of this DisplayObject.

This property contains the calculated total, based on the transforms of all parents of this 
DisplayObject in the display list.

Note: This property is only updated at the end of the `updateTransform` call, once per render. Until 
that happens this property will contain values based on the previous frame. Be mindful of this if
accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.
* @member PIXI.PIXI.DisplayObject#worldTransform
* @type {PIXIMatrix}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 144
*/
/**
* @description The coordinates, in pixels, of this DisplayObject within the world.

This property contains the calculated total, based on the positions of all parents of this 
DisplayObject in the display list.

Note: This property is only updated at the end of the `updateTransform` call, once per render. Until 
that happens this property will contain values based on the previous frame. Be mindful of this if
accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.
* @member PIXI.PIXI.DisplayObject#worldPosition
* @type {PIXIPoint}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 159
*/
/**
* @description The global scale of this DisplayObject.

This property contains the calculated total, based on the scales of all parents of this 
DisplayObject in the display list.

Note: This property is only updated at the end of the `updateTransform` call, once per render. Until 
that happens this property will contain values based on the previous frame. Be mindful of this if
accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.
* @member PIXI.PIXI.DisplayObject#worldScale
* @type {PIXIPoint}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 174
*/
/**
* @description The rotation, in radians, of this DisplayObject.

This property contains the calculated total, based on the rotations of all parents of this 
DisplayObject in the display list.

Note: This property is only updated at the end of the `updateTransform` call, once per render. Until 
that happens this property will contain values based on the previous frame. Be mindful of this if
accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.
* @member PIXI.PIXI.DisplayObject#worldRotation
* @type {Number}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 189
*/
/**
* @description The rectangular area used by filters when rendering a shader for this DisplayObject.
* @member PIXI.PIXI.DisplayObject#filterArea
* @type {Rectangle}
* @default 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 204
*/
/**
* @member PIXI.PIXI.DisplayObject#_sr - Cached rotation value.
* @type {Number}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 213
*/
/**
* @member PIXI.PIXI.DisplayObject#_cr - Cached rotation value.
* @type {Number}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 219
*/
/**
* @member PIXI.PIXI.DisplayObject#_bounds - The cached bounds of this object.
* @type {PIXIRectangle}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 225
*/
/**
* @member PIXI.PIXI.DisplayObject#_currentBounds - The most recently calculated bounds of this object.
* @type {PIXIRectangle}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 231
*/
/**
* @member PIXI.PIXI.DisplayObject#_mask - The cached mask of this object.
* @type {PIXIRectangle}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 237
*/
/**
* @member PIXI.PIXI.DisplayObject#_cacheAsBitmap - Internal cache as bitmap flag.
* @type {Boolean}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 243
*/
/**
* @member PIXI.PIXI.DisplayObject#_cacheIsDirty - Internal dirty cache flag.
* @type {Boolean}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 249
*/
/**
* @description Destroy this DisplayObject.

Removes any cached sprites, sets renderable flag to false, and nulls references to the Stage, filters,
bounds and mask.

Also iteratively calls `destroy` on any children.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 261
*/
/**
* @description Sets the root Stage object that this DisplayObject is connected to.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#setStageReference
* @param {PhaserStage} stage - - The stage that the object will have as its current stage reference
* @return {PIXIDisplayObject} - A reference to this DisplayObject.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 414
*/
/**
* @description To be overridden by classes that require it.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#preUpdate
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 429
*/
/**
* @description Generates a RenderTexture based on this DisplayObject, which can they be used to texture other Sprites.
This can be useful if your DisplayObject is static, or complicated, and needs to be reused multiple times.

Please note that no garbage collection takes place on old textures. It is up to you to destroy old textures,
and references to them, so they don't linger in memory.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#generateTexture
* @param {Number} [resolution=1] - - The resolution of the texture being generated.
* @param {Number} [scaleMode=PIXI.scaleModes.DEFAULT] - - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values.
* @param {(PIXICanvasRenderer|PIXIWebGLRenderer)} renderer - - The renderer used to generate the texture.
* @return {PIXIRenderTexture} - A RenderTexture containing an image of this DisplayObject at the time it was invoked.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 438
*/
/**
* @description If this DisplayObject has a cached Sprite, this method generates and updates it.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#updateCache
* @return {PIXIDisplayObject} - A reference to this DisplayObject.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 466
*/
/**
* @description Calculates the global position of this DisplayObject, based on the position given.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#toGlobal
* @param {PIXIPoint} position - - The global position to calculate from.
* @return {PIXIPoint} - A point object representing the position of this DisplayObject based on the global position given.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 480
*/
/**
* @description Calculates the local position of this DisplayObject, relative to another point.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#toLocal
* @param {PIXIPoint} position - - The world origin to calculate from.
* @param {PIXIDisplayObject} [from] - - An optional DisplayObject to calculate the global position from.
* @return {PIXIPoint} - A point object representing the position of this DisplayObject based on the global position given.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 495
*/
/**
* @description Internal method.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#_renderCachedSprite
* @param {Object} renderSession - - The render session
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 516
*/
/**
* @description Internal method.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#_generateCachedSprite
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 538
*/
/**
* @description Destroys a cached Sprite.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#_destroyCachedSprite
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 586
*/
/**
* @description The horizontal position of the DisplayObject, in pixels, relative to its parent.
If you need the world position of the DisplayObject, use `DisplayObject.worldPosition` instead.
* @member PIXI.PIXI.DisplayObject#x - The horizontal position of the DisplayObject, in pixels, relative to its parent.
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 612
*/
/**
* @description The vertical position of the DisplayObject, in pixels, relative to its parent.
If you need the world position of the DisplayObject, use `DisplayObject.worldPosition` instead.
* @member PIXI.PIXI.DisplayObject#y - The vertical position of the DisplayObject, in pixels, relative to its parent.
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 634
*/
/**
* @description Indicates if this DisplayObject is visible, based on it, and all of its parents, `visible` property values.
* @member PIXI.PIXI.DisplayObject#worldVisible - Indicates if this DisplayObject is visible, based on it, and all of its parents, `visible` property values.
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 656
*/
/**
* @description Sets a mask for this DisplayObject. A mask is an instance of a Graphics object.
When applied it limits the visible area of this DisplayObject to the shape of the mask.
Under a Canvas renderer it uses shape clipping. Under a WebGL renderer it uses a Stencil Buffer.
To remove a mask, set this property to `null`.
* @member PIXI.PIXI.DisplayObject#mask - The mask applied to this DisplayObject. Set to `null` to remove an existing mask.
* @type {PIXIGraphics}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 691
*/
/**
* @description Sets the filters for this DisplayObject. This is a WebGL only feature, and is ignored by the Canvas
Renderer. A filter is a shader applied to this DisplayObject. You can modify the placement of the filter
using `DisplayObject.filterArea`.

To remove filters, set this property to `null`.

Note: You cannot have a filter set, and a MULTIPLY Blend Mode active, at the same time. Setting a 
filter will reset this DisplayObjects blend mode to NORMAL.
* @member PIXI.PIXI.DisplayObject#filters - An Array of PIXI.AbstractFilter objects, or objects that extend them.
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 726
*/
/**
* @description Sets if this DisplayObject should be cached as a bitmap.

When invoked it will take a snapshot of the DisplayObject, as it is at that moment, and store it 
in a RenderTexture. This is then used whenever this DisplayObject is rendered. It can provide a
performance benefit for complex, but static, DisplayObjects. I.e. those with lots of children.

Cached Bitmaps do not track their parents. If you update a property of this DisplayObject, it will not
re-generate the cached bitmap automatically. To do that you need to call `DisplayObject.updateCache`.

To remove a cached bitmap, set this property to `null`.
* @member PIXI.PIXI.DisplayObject#cacheAsBitmap - Cache this DisplayObject as a Bitmap. Set to `null` to remove an existing cached bitmap.
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 779
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 1
*/
/**
* @class PIXI.DisplayObjectContainer
* @description A DisplayObjectContainer represents a collection of display objects.
It is the base class of all display objects that act as a container for other objects.
* @augments DisplayObject
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 5
*/
/**
* @description [read-only] The array of children of this container.
* @member PIXI.DisplayObjectContainer#children
* @type {Array<DisplayObject>}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 17
*/
/**
* @description If `ignoreChildInput`  is `false` it will allow this objects _children_ to be considered as valid for Input events.

If this property is `true` then the children will _not_ be considered as valid for Input events.

Note that this property isn't recursive: only immediate children are influenced, it doesn't scan further down.
* @member PIXI.DisplayObjectContainer#ignoreChildInput
* @type {Boolean}
* @default 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 26
*/
/**
* @description The width of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
* @member PIXI.DisplayObjectContainer#width
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 43
*/
/**
* @description The height of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
* @member PIXI.DisplayObjectContainer#height
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 72
*/
/**
* @description Adds a child to the container.
* @method PIXI.DisplayObjectContainer#addChild
* @param {DisplayObject} child - The DisplayObject to add to the container
* @return {DisplayObject} The child that was added.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 102
*/
/**
* @description Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
* @method PIXI.DisplayObjectContainer#addChildAt
* @param {DisplayObject} child - The child to add
* @param {Number} index - The index to place the child in
* @return {DisplayObject} The child that was added.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 114
*/
/**
* @description Swaps the position of 2 Display Objects within this container.
* @method PIXI.DisplayObjectContainer#swapChildren
* @param {DisplayObject} child - 
* @param {DisplayObject} child2 - 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 145
*/
/**
* @description Returns the index position of a child DisplayObject instance
* @method PIXI.DisplayObjectContainer#getChildIndex
* @param {DisplayObject} child - The DisplayObject instance to identify
* @return {Number} The index position of the child display object to identify
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 170
*/
/**
* @description Changes the position of an existing child in the display object container
* @method PIXI.DisplayObjectContainer#setChildIndex
* @param {DisplayObject} child - The child DisplayObject instance for which you want to change the index number
* @param {Number} index - The resulting index number for the child display object
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 187
*/
/**
* @description Returns the child at the specified index
* @method PIXI.DisplayObjectContainer#getChildAt
* @param {Number} index - The index to get the child from
* @return {DisplayObject} The child at the given index, if any.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 205
*/
/**
* @description Removes a child from the container.
* @method PIXI.DisplayObjectContainer#removeChild
* @param {DisplayObject} child - The DisplayObject to remove
* @return {DisplayObject} The child that was removed.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 222
*/
/**
* @description Removes a child from the specified index position.
* @method PIXI.DisplayObjectContainer#removeChildAt
* @param {Number} index - The index to get the child from
* @return {DisplayObject} The child that was removed.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 237
*/
/**
* @description Removes all children from this container that are within the begin and end indexes.
* @method PIXI.DisplayObjectContainer#removeChildren
* @param {Number} beginIndex - The beginning position. Default value is 0.
* @param {Number} endIndex - The ending position. Default value is size of the container.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 255
*/
/**
* @description Retrieves the bounds of the displayObjectContainer as a rectangle. The bounds calculation takes all visible children into consideration.
* @method PIXI.DisplayObjectContainer#getBounds
* @return {Rectangle} The rectangular bounding area
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 318
*/
/**
* @description Retrieves the non-global local bounds of the displayObjectContainer as a rectangle. The calculation takes all visible children into consideration.
* @method PIXI.DisplayObjectContainer#getLocalBounds
* @return {Rectangle} The rectangular bounding area
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 383
*/
/**
* @description Sets the containers Stage reference. This is the Stage that this object, and all of its children, is connected to.
* @method PIXI.DisplayObjectContainer#setStageReference
* @param {Stage} stage - the stage that the container will have as its current stage reference
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 412
*/
/**
* @description Removes the current stage reference from the container and all of its children.
* @method PIXI.DisplayObjectContainer#removeStageReference
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 428
*/
/**
* @description Renders the object using the WebGL renderer
* @method PIXI.DisplayObjectContainer#_renderWebGL
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 443
*/
/**
* @description Renders the object using the Canvas renderer
* @method PIXI.DisplayObjectContainer#_renderCanvas
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 501
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 1
*/
/**
* @class PIXI.Sprite
* @description The Sprite object is the base for all textured objects that are rendered to the screen
* @augments PIXI.DisplayObjectContainer
* @param {PIXI.Texture} texture - The texture for this sprite

A sprite can be created directly from an image like this :
var sprite = new PIXI.Sprite.fromImage('assets/image.png');
yourStage.addChild(sprite);
then obviously don't forget to add it to the stage you have already created
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 5
*/
/**
* @description The anchor sets the origin point of the texture.
The default is 0,0 this means the texture's origin is the top left
Setting than anchor to 0.5,0.5 means the textures origin is centered
Setting the anchor to 1,1 would mean the textures origin points will be the bottom right corner
* @member PIXI.Sprite#anchor
* @type {Point}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 22
*/
/**
* @description The texture that the sprite is using
* @member PIXI.Sprite#texture
* @type {PIXI.Texture}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 33
*/
/**
* @description The width of the sprite (this is initially set by the texture)
* @member PIXI.Sprite#_width
* @type {Number}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 41
*/
/**
* @description The height of the sprite (this is initially set by the texture)
* @member PIXI.Sprite#_height
* @type {Number}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 50
*/
/**
* @description The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
* @member PIXI.Sprite#tint
* @type {Number}
* @default 0xFFFFFF
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 59
*/
/**
* @description The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
* @member PIXI.Sprite#cachedTint
* @type {Number}
* @default -1
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 68
*/
/**
* @description A canvas that contains the tinted version of the Sprite (in Canvas mode, WebGL doesn't populate this)
* @member PIXI.Sprite#tintedTexture
* @type {Canvas}
* @default null
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 78
*/
/**
* @description The blend mode to be applied to the sprite. Set to PIXI.blendModes.NORMAL to remove any blend mode.

Warning: You cannot have a blend mode and a filter active on the same Sprite. Doing so will render the sprite invisible.
* @member PIXI.Sprite#blendMode
* @type {Number}
* @default PIXI.blendModes.NORMAL;
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 87
*/
/**
* @description The shader that will be used to render the texture to the stage. Set to null to remove a current shader.
* @member PIXI.Sprite#shader
* @type {PIXI.AbstractFilter}
* @default null
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 98
*/
/**
* @description Controls if this Sprite is processed by the core Phaser game loops and Group loops.
* @member PIXI.Sprite#exists
* @type {Boolean}
* @default true
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 107
*/
/**
* @description The width of the sprite, setting this will actually modify the scale to achieve the value set
* @member PIXI.Sprite#width
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 129
*/
/**
* @description The height of the sprite, setting this will actually modify the scale to achieve the value set
* @member PIXI.Sprite#height
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 148
*/
/**
* @description Sets the texture of the sprite. Be warned that this doesn't remove or destroy the previous
texture this Sprite was using.
* @method PIXI.Sprite#setTexture
* @param {PIXI.Texture} texture - The PIXI texture that is displayed by the sprite
* @param {Boolean} [destroy=false] - Call Texture.destroy on the current texture before replacing it with the new one?
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 167
*/
/**
* @description When the texture is updated, this event will fire to update the scale and frame
* @method PIXI.Sprite#onTextureUpdate
* @param {} event - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 189
*/
/**
* @description Returns the bounds of the Sprite as a rectangle.
The bounds calculation takes the worldTransform into account.

It is important to note that the transform is not updated when you call this method.
So if this Sprite is the child of a Display Object which has had its transform
updated since the last render pass, those changes will not yet have been applied
to this Sprites worldTransform. If you need to ensure that all parent transforms
are factored into this getBounds operation then you should call `updateTransform`
on the root most object in this Sprites display list first.
* @method PIXI.Sprite#getBounds
* @param {Matrix} matrix - the transformation matrix of the sprite
* @return {Rectangle} the framing rectangle
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 203
*/
/**
* @description Renders the object using the WebGL renderer
* @method PIXI.Sprite#_renderWebGL
* @param {RenderSession} renderSession - 
* @param {Matrix} [matrix] - - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 319
*/
/**
* @description Renders the object using the Canvas renderer
* @method PIXI.Sprite#_renderCanvas
* @param {RenderSession} renderSession - 
* @param {Matrix} [matrix] - - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 389
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/
* @sourcefile d:\wamp\www\phaser\src\pixi\display\SpriteBatch.js
* @sourceline 1
*/
/**
* @class PIXI.SpriteBatch
* @description The SpriteBatch class is a really fast version of the DisplayObjectContainer 
built solely for speed, so use when you need a lot of sprites or particles.
And it's extremely easy to use : 

   var container = new PIXI.SpriteBatch();

   stage.addChild(container);

   for(var i  = 0; i < 100; i++)
   {
       var sprite = new PIXI.Sprite.fromImage("myImage.png");
       container.addChild(sprite);
   }
And here you have a hundred sprites that will be renderer at the speed of light
* @param {PIXI.Texture} texture - 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\SpriteBatch.js
* @sourceline 5
*/
/**
* @description Renders the object using the WebGL renderer
* @method PIXI.SpriteBatch#_renderWebGL
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\SpriteBatch.js
* @sourceline 64
*/
/**
* @description Renders the object using the Canvas renderer
* @method PIXI.SpriteBatch#_renderCanvas
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\SpriteBatch.js
* @sourceline 96
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\Rope.js
* @sourceline 1
*/
/**
* @class PIXI.Rope
* @augments PIXI.Strip
* @param {PIXI.Texture} texture - - The texture to use on the rope.
* @param {Array} points - - An array of {PIXI.Point}.
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\Rope.js
* @sourceline 6
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\Strip.js
* @sourceline 1
*/
/**
* @class PIXI.Strip
* @augments PIXI.DisplayObjectContainer
* @param {PIXI.Texture} texture - The texture to use
* @param {Number} width - the width
* @param {Number} height - the height
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\Strip.js
* @sourceline 5
*/
/**
* @description The texture of the strip
* @member PIXI.Strip#texture
* @type {PIXI.Texture}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\Strip.js
* @sourceline 20
*/
/**
* @description Whether the strip is dirty or not
* @member PIXI.Strip#dirty
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\Strip.js
* @sourceline 43
*/
/**
* @description The blend mode to be applied to the sprite. Set to PIXI.blendModes.NORMAL to remove any blend mode.
* @member PIXI.Strip#blendMode
* @type {Number}
* @default PIXI.blendModes.NORMAL;
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\Strip.js
* @sourceline 51
*/
/**
* @description Triangles in canvas mode are automatically antialiased, use this value to force triangles to overlap a bit with each other.
* @member PIXI.Strip#canvasPadding
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\Strip.js
* @sourceline 60
*/
/**
* @description Renders a flat strip
* @method PIXI.Strip#renderStripFlat
* @param {PIXI.Strip} strip - The Strip to render
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\Strip.js
* @sourceline 344
*/
/**
* @description When the texture is updated, this event will fire to update the scale and frame
* @method PIXI.Strip#onTextureUpdate
* @param {} event - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\Strip.js
* @sourceline 392
*/
/**
* @description Returns the bounds of the mesh as a rectangle. The bounds calculation takes the worldTransform into account.
* @method PIXI.Strip#getBounds
* @param {Matrix} matrix - the transformation matrix of the sprite
* @return {Rectangle} the framing rectangle
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\Strip.js
* @sourceline 405
*/
/**
* @description Different drawing buffer modes supported
* @member PIXI.Strip.
* @type {{TRIANGLE_STRIP: number, TRIANGLES: number}}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\Strip.js
* @sourceline 462
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 1
*/
/**
* @class PIXI.TilingSprite
* @description A tiling sprite is a fast way of rendering a tiling image
* @augments PIXI.Sprite
* @param {PIXI.Texture} texture - the texture of the tiling sprite
* @param {Number} width - the width of the tiling sprite
* @param {Number} height - the height of the tiling sprite
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 5
*/
/**
* @description The width of the tiling sprite
* @member PIXI.TilingSprite#width
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 19
*/
/**
* @description The height of the tiling sprite
* @member PIXI.TilingSprite#height
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 27
*/
/**
* @description The scaling of the image that is being tiled
* @member PIXI.TilingSprite#tileScale
* @type {Point}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 35
*/
/**
* @description A point that represents the scale of the texture object
* @member PIXI.TilingSprite#tileScaleOffset
* @type {Point}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 43
*/
/**
* @description The offset position of the image that is being tiled
* @member PIXI.TilingSprite#tilePosition
* @type {Point}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 51
*/
/**
* @description Whether this sprite is renderable or not
* @member PIXI.TilingSprite#renderable
* @type {Boolean}
* @default true
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 59
*/
/**
* @description The tint applied to the sprite. This is a hex value
* @member PIXI.TilingSprite#tint
* @type {Number}
* @default 0xFFFFFF
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 68
*/
/**
* @description If enabled a green rectangle will be drawn behind the generated tiling texture, allowing you to visually
debug the texture being used.
* @member PIXI.TilingSprite#textureDebug
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 77
*/
/**
* @description The blend mode to be applied to the sprite
* @member PIXI.TilingSprite#blendMode
* @type {Number}
* @default PIXI.blendModes.NORMAL;
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 86
*/
/**
* @description The CanvasBuffer object that the tiled texture is drawn to.
* @member PIXI.TilingSprite#canvasBuffer
* @type {PIXICanvasBuffer}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 95
*/
/**
* @description An internal Texture object that holds the tiling texture that was generated from TilingSprite.texture.
* @member PIXI.TilingSprite#tilingTexture
* @type {PIXITexture}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 103
*/
/**
* @description The Context fill pattern that is used to draw the TilingSprite in Canvas mode only (will be null in WebGL).
* @member PIXI.TilingSprite#tilePattern
* @type {PIXITexture}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 111
*/
/**
* @description If true the TilingSprite will run generateTexture on its **next** render pass.
This is set by the likes of Phaser.LoadTexture.setFrame.
* @member PIXI.TilingSprite#refreshTexture
* @type {Boolean}
* @default true
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 119
*/
/**
* @description Renders the object using the WebGL renderer
* @method PIXI.TilingSprite#_renderWebGL
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 148
*/
/**
* @description Renders the object using the Canvas renderer
* @method PIXI.TilingSprite#_renderCanvas
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 216
*/
/**
* @description When the texture is updated, this event will fire to update the scale and frame
* @method PIXI.TilingSprite#onTextureUpdate
* @param {} event - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 320
*/
/**
* @method PIXI.TilingSprite#generateTilingTexture
* @param {Boolean} forcePowerOfTwo - Whether we want to force the texture to be a power of two
* @param {RenderSession} renderSession - 
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 332
*/
/**
* @description Returns the framing rectangle of the sprite as a PIXI.Rectangle object
* @method PIXI.TilingSprite#getBounds
* @return {Rectangle} the framing rectangle
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 417
*/
/**
* @description The width of the sprite, setting this will actually modify the scale to achieve the value set
* @member PIXI.TilingSprite#width
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 517
*/
/**
* @description The height of the TilingSprite, setting this will actually modify the scale to achieve the value set
* @member PIXI.TilingSprite#height
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 535
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 1
*/
/**
* @class PIXI.AbstractFilter
* @description This is the base class for creating a PIXI filter. Currently only webGL supports filters.
If you want to make a custom filter this should be your base class.
* @param {Array} fragmentSrc - The fragment source in an array of strings.
* @param {Object} uniforms - An object containing the uniforms for this filter.
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 5
*/
/**
* @description An array of passes - some filters contain a few steps this array simply stores the steps in a liniear fashion.
For example the blur filter has two passes blurX and blurY.
* @member PIXI.AbstractFilter#passes
* @type {Array}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 16
*/
/**
* @member PIXI.AbstractFilter#shaders
* @type {Array}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 25
*/
/**
* @member PIXI.AbstractFilter#dirty
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 32
*/
/**
* @member PIXI.AbstractFilter#padding
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 38
*/
/**
* @member PIXI.AbstractFilter#uniforms
* @type {Object}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 44
*/
/**
* @member PIXI.AbstractFilter#fragmentSrc
* @type {Array}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 51
*/
/**
* @description Syncs the uniforms between the class object and the shaders.
* @method PIXI.AbstractFilter#syncUniforms
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 61
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 1
*/
/**
* @class PIXI.Graphics
* @description The Graphics class contains methods used to draw primitive shapes such as lines, circles and rectangles to the display, and color and fill them.
* @augments PIXI.DisplayObjectContainer
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 5
*/
/**
* @description The alpha value used when filling the Graphics object.
* @member PIXI.Graphics#fillAlpha
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 18
*/
/**
* @description The width (thickness) of any lines drawn.
* @member PIXI.Graphics#lineWidth
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 26
*/
/**
* @description The color of any lines drawn.
* @member PIXI.Graphics#lineColor
* @type {String}
* @default 0
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 34
*/
/**
* @description Graphics data
* @member PIXI.Graphics#graphicsData
* @type {Array}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 43
*/
/**
* @description The tint applied to the graphic shape. This is a hex value. Apply a value of 0xFFFFFF to reset the tint.
* @member PIXI.Graphics#tint
* @type {Number}
* @default 0xFFFFFF
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 52
*/
/**
* @description The blend mode to be applied to the graphic shape. Apply a value of PIXI.blendModes.NORMAL to reset the blend mode.
* @member PIXI.Graphics#blendMode
* @type {Number}
* @default PIXI.blendModes.NORMAL;
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 61
*/
/**
* @description Current path
* @member PIXI.Graphics#currentPath
* @type {Object}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 70
*/
/**
* @description Array containing some WebGL-related properties used by the WebGL renderer.
* @member PIXI.Graphics#_webGL
* @type {Array}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 79
*/
/**
* @description Whether this shape is being used as a mask.
* @member PIXI.Graphics#isMask
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 88
*/
/**
* @description The bounds' padding used for bounds calculation.
* @member PIXI.Graphics#boundsPadding
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 96
*/
/**
* @description Used to detect if the graphics object has changed. If this is set to true then the graphics object will be recalculated.
* @member PIXI.Graphics#dirty
* @type {Boolean}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 106
*/
/**
* @description Used to detect if the webgl graphics object has changed. If this is set to true then the graphics object will be recalculated.
* @member PIXI.Graphics#webGLDirty
* @type {Boolean}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 115
*/
/**
* @description Used to detect if the cached sprite object needs to be updated.
* @member PIXI.Graphics#cachedSpriteDirty
* @type {Boolean}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 124
*/
/**
* @description Specifies the line style used for subsequent calls to Graphics methods such as the lineTo() method or the drawCircle() method.
* @method PIXI.Graphics#lineStyle
* @param {Number} lineWidth - width of the line to draw, will update the objects stored style
* @param {Number} color - color of the line to draw, will update the objects stored style
* @param {Number} alpha - alpha of the line to draw, will update the objects stored style
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 139
*/
/**
* @description Moves the current drawing position to x, y.
* @method PIXI.Graphics#moveTo
* @param {Number} x - the X coordinate to move to
* @param {Number} y - the Y coordinate to move to
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 173
*/
/**
* @description Draws a line using the current line style from the current drawing position to (x, y);
The current drawing position is then set to (x, y).
* @method PIXI.Graphics#lineTo
* @param {Number} x - the X coordinate to draw to
* @param {Number} y - the Y coordinate to draw to
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 188
*/
/**
* @description Calculate the points for a quadratic bezier curve and then draws it.
Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
* @method PIXI.Graphics#quadraticCurveTo
* @param {Number} cpX - Control point x
* @param {Number} cpY - Control point y
* @param {Number} toX - Destination point x
* @param {Number} toY - Destination point y
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 211
*/
/**
* @description Calculate the points for a bezier curve and then draws it.
* @method PIXI.Graphics#bezierCurveTo
* @param {Number} cpX - Control point x
* @param {Number} cpY - Control point y
* @param {Number} cpX2 - Second Control point x
* @param {Number} cpY2 - Second Control point y
* @param {Number} toX - Destination point x
* @param {Number} toY - Destination point y
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 266
*/
/**
* @description The arc method creates an arc/curve (used to create circles, or parts of circles).
* @method PIXI.Graphics#arc
* @param {Number} cx - The x-coordinate of the center of the circle
* @param {Number} cy - The y-coordinate of the center of the circle
* @param {Number} radius - The radius of the circle
* @param {Number} startAngle - The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
* @param {Number} endAngle - The ending angle, in radians
* @param {Boolean} anticlockwise - Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.
* @param {Number} segments - Optional. The number of segments to use when calculating the arc. The default is 40. If you need more fidelity use a higher number.
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 395
*/
/**
* @description Specifies a simple one-color fill that subsequent calls to other Graphics methods
(such as lineTo() or drawCircle()) use when drawing.
* @method PIXI.Graphics#beginFill
* @param {Number} color - the color of the fill
* @param {Number} alpha - the alpha of the fill
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 481
*/
/**
* @description Applies a fill to the lines and shapes that were added since the last call to the beginFill() method.
* @method PIXI.Graphics#endFill
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 509
*/
/**
* @method PIXI.Graphics#drawRect
* @param {Number} x - The X coord of the top-left of the rectangle
* @param {Number} y - The Y coord of the top-left of the rectangle
* @param {Number} width - The width of the rectangle
* @param {Number} height - The height of the rectangle
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 524
*/
/**
* @method PIXI.Graphics#drawRoundedRect
* @param {Number} x - The X coord of the top-left of the rectangle
* @param {Number} y - The Y coord of the top-left of the rectangle
* @param {Number} width - The width of the rectangle
* @param {Number} height - The height of the rectangle
* @param {Number} radius - Radius of the rectangle corners. In WebGL this must be a value between 0 and 9.
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 540
*/
/**
* @description Draws a circle.
* @method PIXI.Graphics#drawCircle
* @param {Number} x - The X coordinate of the center of the circle
* @param {Number} y - The Y coordinate of the center of the circle
* @param {Number} diameter - The diameter of the circle
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 555
*/
/**
* @description Draws an ellipse.
* @method PIXI.Graphics#drawEllipse
* @param {Number} x - The X coordinate of the center of the ellipse
* @param {Number} y - The Y coordinate of the center of the ellipse
* @param {Number} width - The half width of the ellipse
* @param {Number} height - The half height of the ellipse
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 571
*/
/**
* @description Draws a polygon using the given path.
* @method PIXI.Graphics#drawPolygon
* @param {(Array|PhaserPolygon)} path - The path data used to construct the polygon. Can either be an array of points or a Phaser.Polygon object.
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 588
*/
/**
* @description Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
* @method PIXI.Graphics#clear
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 623
*/
/**
* @description Useful function that returns a texture of the graphics object that can then be used to create sprites
This can be quite useful if your geometry is complicated and needs to be reused multiple times.
* @method PIXI.Graphics#generateTexture
* @param {Number} [resolution=1] - The resolution of the texture being generated
* @param {Number} [scaleMode=0] - Should be one of the PIXI.scaleMode consts
* @param {Number} [padding=0] - Add optional extra padding to the generated texture (default 0)
* @return {PIXI.Texture} a texture of the graphics object
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 643
*/
/**
* @description Renders the object using the WebGL renderer
* @method PIXI.Graphics#_renderWebGL
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 679
*/
/**
* @description Renders the object using the Canvas renderer
* @method PIXI.Graphics#_renderCanvas
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 758
*/
/**
* @description Retrieves the bounds of the graphic shape as a rectangle object
* @method PIXI.Graphics#getBounds
* @return {Rectangle} the rectangular bounding area
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 837
*/

/**
* @description Update the bounds of the object
* @method PIXI.Graphics#updateLocalBounds
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 960
*/
/**
* @description Generates the cached sprite when the sprite has cacheAsBitmap = true
* @method PIXI.Graphics#_generateCachedSprite
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 1072
*/
/**
* @description Updates texture size based on canvas size
* @method PIXI.Graphics#updateCachedSpriteTexture
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 1112
*/
/**
* @description Destroys a previous cached sprite.
* @method PIXI.Graphics#destroyCachedSprite
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 1136
*/
/**
* @description Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
* @method PIXI.Graphics#drawShape
* @param {(Circle|Rectangle|Ellipse|Line|Polygon)} shape - The Shape object to draw.
* @return {PIXI.GraphicsData} The generated GraphicsData object.
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 1147
*/
/**
* @description When cacheAsBitmap is set to true the graphics object will be rendered as if it was a sprite.
This is useful if your graphics element does not change often, as it will speed up the rendering of the object in exchange for taking up texture memory.
It is also useful if you need the graphics object to be anti-aliased, because it will be rendered using canvas.
This is not recommended if you are constantly redrawing the graphics element.
* @member PIXI.Graphics#cacheAsBitmap
* @type {Boolean}
* @default false
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 1192
*/
/**
* @class PIXI.GraphicsData
* @description A GraphicsData object.
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\GraphicsData.js
* @sourceline 1
*/
/**
* @class 
* @description A GraphicsData object.
* @param {Number} lineWidth - the width of the line to draw
* @param {Number} lineColor - the color of the line to draw
* @param {Number} lineAlpha - the alpha of the line to draw
* @param {Number} fillColor - the color of the fill
* @param {Number} fillAlpha - the alpha of the fill
* @param {Boolean} fill - whether or not the shape is filled with a colour
* @param {(Circle|Rectangle|Ellipse|Line|Polygon)} shape - The shape object to draw.
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\GraphicsData.js
* @sourceline 23
*/
/**
* @fileoverview Creates a new GraphicsData object with the same values as this one.
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\GraphicsData.js
* @sourceline 93
*/
/**
* @class PIXI.CanvasBuffer
* @description Creates a Canvas element of the given size.
* @param {Number} width - the width for the newly created canvas
* @param {Number} height - the height for the newly created canvas
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasBuffer.js
* @sourceline 5
*/

/**
* @description The width of the Canvas in pixels.
* @member PIXI.CanvasBuffer#width
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasBuffer.js
* @sourceline 15
*/
/**
* @description The height of the Canvas in pixels.
* @member PIXI.CanvasBuffer#height
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasBuffer.js
* @sourceline 23
*/
/**
* @description The Canvas object that belongs to this CanvasBuffer.
* @member PIXI.CanvasBuffer#canvas
* @type {HTMLCanvasElement}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasBuffer.js
* @sourceline 31
*/
/**
* @description A CanvasRenderingContext2D object representing a two-dimensional rendering context.
* @member PIXI.CanvasBuffer#context
* @type {CanvasRenderingContext2D}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasBuffer.js
* @sourceline 39
*/
/**
* @description Clears the canvas that was created by the CanvasBuffer class.
* @method PIXI.CanvasBuffer#clear
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasBuffer.js
* @sourceline 53
*/
/**
* @description Resizes the canvas to the specified width and height.
* @method PIXI.CanvasBuffer#resize
* @param {Number} width - the new width of the canvas
* @param {Number} height - the new height of the canvas
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasBuffer.js
* @sourceline 65
*/
/**
* @description Frees the canvas up for use again.
* @method PIXI.CanvasBuffer#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasBuffer.js
* @sourceline 78
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasMaskManager.js
* @sourceline 1
*/
/**
* @class PIXI.CanvasMaskManager
* @description A set of functions used to handle masking.
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasMaskManager.js
* @sourceline 5
*/
/**
* @description This method adds it to the current stack of masks.
* @method PIXI.CanvasMaskManager#pushMask
* @param {Object} maskData - the maskData that will be pushed
* @param {Object} renderSession - The renderSession whose context will be used for this mask manager.
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasMaskManager.js
* @sourceline 17
*/
/**
* @description Restores the current drawing context to the state it was before the mask was applied.
* @method PIXI.CanvasMaskManager#popMask
* @param {Object} renderSession - The renderSession whose context will be used for this mask manager.
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasMaskManager.js
* @sourceline 49
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 1
*/
/**
* @class PIXI.CanvasTinter
* @description Utility methods for Sprite/Texture tinting.
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 5
*/
/**
* @description Basically this method just needs a sprite and a color and tints the sprite with the given color.
* @method PIXI.CanvasTinter.getTintedTexture
* @param {PIXI.Sprite} sprite - the sprite to tint
* @param {Number} color - the color to use to tint the sprite with
* @return {HTMLCanvasElement} The tinted canvas
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 13
*/
/**
* @description Tint a texture using the "multiply" operation.
* @method PIXI.CanvasTinter.tintWithMultiply
* @param {PIXI.Texture} texture - the texture to tint
* @param {Number} color - the color to use to tint the sprite with
* @param {HTMLCanvasElement} canvas - the current canvas
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 31
*/
/**
* @description Tint a texture pixel per pixel.
* @method PIXI.CanvasTinter.tintPerPixel
* @param {PIXI.Texture} texture - the texture to tint
* @param {Number} color - the color to use to tint the sprite with
* @param {HTMLCanvasElement} canvas - the current canvas
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 65
*/
/**
* @description Checks if the browser correctly supports putImageData alpha channels.
* @method PIXI.CanvasTinter.checkInverseAlpha
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 113
*/
/**
* @description If the browser isn't capable of handling tinting with alpha this will be false.
This property is only applicable if using tintWithPerPixel.
* @member PIXI.CanvasTinter.canHandleAlpha
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 146
*/
/**
* @description Whether or not the Canvas BlendModes are supported, consequently the ability to tint using the multiply method.
* @member PIXI.CanvasTinter.canUseMultiply
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 156
*/
/**
* @description The tinting method that will be used.
* @method PIXI.CanvasTinter.tintMethod
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 165
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasGraphics.js
* @sourceline 1
*/
/**
* @class PIXI.CanvasGraphics
* @description A set of functions used by the canvas renderer to draw the primitive graphics data.
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasGraphics.js
* @sourceline 6
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 1
*/
/**
* @class PIXI.CanvasRenderer
* @description The CanvasRenderer draws the Stage and all its content onto a 2d canvas. This renderer should be used for browsers that do not support webGL.
Don't forget to add the CanvasRenderer.view to your DOM or you will not see anything :)
* @param {PhaserGame} game - A reference to the Phaser Game instance
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 5
*/
/**
* @member PIXI.CanvasRenderer#game - A reference to the Phaser Game instance.
* @type {PhaserGame}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 15
*/
/**
* @description The renderer type.
* @member PIXI.CanvasRenderer#type
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 25
*/
/**
* @description The resolution of the canvas.
* @member PIXI.CanvasRenderer#resolution
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 33
*/
/**
* @description This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
If the Stage is NOT transparent Pixi will use a canvas sized fillRect operation every frame to set the canvas background color.
If the Stage is transparent Pixi will use clearRect to clear the canvas every frame.
Disable this by setting this to false. For example if your game has a canvas filling background image you often don't need this set.
* @member PIXI.CanvasRenderer#clearBeforeRender
* @type {Boolean}
* @default 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 41
*/
/**
* @description Whether the render view is transparent
* @member PIXI.CanvasRenderer#transparent
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 53
*/
/**
* @description Whether the render view should be resized automatically
* @member PIXI.CanvasRenderer#autoResize
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 61
*/
/**
* @description The width of the canvas view
* @member PIXI.CanvasRenderer#width
* @type {Number}
* @default 800
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 69
*/
/**
* @description The height of the canvas view
* @member PIXI.CanvasRenderer#height
* @type {Number}
* @default 600
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 78
*/
/**
* @description The canvas element that everything is drawn to.
* @member PIXI.CanvasRenderer#view
* @type {HTMLCanvasElement}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 87
*/
/**
* @description The canvas 2d context that everything is drawn with
* @member PIXI.CanvasRenderer#context
* @type {CanvasRenderingContext2D}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 95
*/
/**
* @description Boolean flag controlling canvas refresh.
* @member PIXI.CanvasRenderer#refresh
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 102
*/
/**
* @description Internal var.
* @member PIXI.CanvasRenderer#count
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 110
*/
/**
* @description Instance of a PIXI.CanvasMaskManager, handles masking when using the canvas renderer
* @member PIXI.CanvasRenderer#CanvasMaskManager
* @type {PIXI.CanvasMaskManager}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 118
*/
/**
* @description The render session is just a bunch of parameter used for rendering
* @member PIXI.CanvasRenderer#renderSession
* @type {Object}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 125
*/

/**
* @description Renders the Stage to this canvas view
* @method PIXI.CanvasRenderer#render
* @param {Stage} stage - the Stage element to be rendered
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 152
*/
/**
* @description Removes everything from the renderer and optionally removes the Canvas DOM element.
* @method PIXI.CanvasRenderer#destroy
* @param {Boolean} [removeView=true] - Removes the Canvas element from the DOM.
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 193
*/
/**
* @description Resizes the canvas view to the specified width and height
* @method PIXI.CanvasRenderer#resize
* @param {Number} width - the new width of the canvas view
* @param {Number} height - the new height of the canvas view
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 215
*/
/**
* @description Renders a display object
* @method PIXI.CanvasRenderer#renderDisplayObject
* @param {DisplayObject} displayObject - The displayObject to render
* @param {CanvasRenderingContext2D} context - the context 2d method of the canvas
* @param {Matrix} [matrix] - Optional matrix to apply to the display object before rendering.
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 243
*/
/**
* @description Maps Pixi blend modes to canvas blend modes.
* @method PIXI.CanvasRenderer#mapBlendModes
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 260
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\ComplexPrimitiveShader.js
* @sourceline 1
*/
/**
* @class PIXI.ComplexPrimitiveShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\ComplexPrimitiveShader.js
* @sourceline 5
*/
/**
* @member PIXI.ComplexPrimitiveShader#_UID
* @type {Number}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\ComplexPrimitiveShader.js
* @sourceline 12
*/
/**
* @member PIXI.ComplexPrimitiveShader#gl
* @type {WebGLContext}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\ComplexPrimitiveShader.js
* @sourceline 19
*/
/**
* @description The WebGL program.
* @member PIXI.ComplexPrimitiveShader#program
* @type {}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\ComplexPrimitiveShader.js
* @sourceline 25
*/
/**
* @description The fragment shader.
* @member PIXI.ComplexPrimitiveShader#fragmentSrc
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\ComplexPrimitiveShader.js
* @sourceline 32
*/
/**
* @description The vertex shader.
* @member PIXI.ComplexPrimitiveShader#vertexSrc
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\ComplexPrimitiveShader.js
* @sourceline 48
*/
/**
* @description Initialises the shader.
* @method PIXI.ComplexPrimitiveShader#init
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\ComplexPrimitiveShader.js
* @sourceline 79
*/
/**
* @description Destroys the shader.
* @method PIXI.ComplexPrimitiveShader#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\ComplexPrimitiveShader.js
* @sourceline 110
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiFastShader.js
* @sourceline 1
*/
/**
* @class PIXI.PixiFastShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiFastShader.js
* @sourceline 5
*/
/**
* @member PIXI.PixiFastShader#_UID
* @type {Number}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiFastShader.js
* @sourceline 12
*/
/**
* @member PIXI.PixiFastShader#gl
* @type {WebGLContext}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiFastShader.js
* @sourceline 19
*/
/**
* @description The WebGL program.
* @member PIXI.PixiFastShader#program
* @type {}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiFastShader.js
* @sourceline 25
*/
/**
* @description The fragment shader.
* @member PIXI.PixiFastShader#fragmentSrc
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiFastShader.js
* @sourceline 32
*/
/**
* @description The vertex shader.
* @member PIXI.PixiFastShader#vertexSrc
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiFastShader.js
* @sourceline 47
*/
/**
* @description A local texture counter for multi-texture shaders.
* @member PIXI.PixiFastShader#textureCount
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiFastShader.js
* @sourceline 82
*/
/**
* @description Initialises the shader.
* @method PIXI.PixiFastShader#init
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiFastShader.js
* @sourceline 94
*/
/**
* @description Destroys the shader.
* @method PIXI.PixiFastShader#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiFastShader.js
* @sourceline 143
*/
/**
* @fileoverview
* @author Richard Davey http://www.photonstorm.com @photonstorm
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 1
*/
/**
* @class PIXI.PixiShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 6
*/
/**
* @member PIXI.PixiShader#_UID
* @type {Number}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 13
*/
/**
* @member PIXI.PixiShader#gl
* @type {WebGLContext}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 20
*/
/**
* @description The WebGL program.
* @member PIXI.PixiShader#program
* @type {}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 26
*/
/**
* @description The fragment shader.
* @member PIXI.PixiShader#fragmentSrc
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 33
*/
/**
* @description A local texture counter for multi-texture shaders.
* @member PIXI.PixiShader#textureCount
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 48
*/
/**
* @description A local flag
* @member PIXI.PixiShader#firstRun
* @type {Boolean}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 55
*/
/**
* @description A dirty flag
* @member PIXI.PixiShader#dirty
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 63
*/
/**
* @description Uniform attributes cache.
* @member PIXI.PixiShader#attributes
* @type {Array}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 70
*/
/**
* @description Initialises the shader.
* @method PIXI.PixiShader#init
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 83
*/
/**
* @description Initialises the shader uniform values.

Uniforms are specified in the GLSL_ES Specification: http://www.khronos.org/registry/webgl/specs/latest/1.0/
http://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf
* @method PIXI.PixiShader#initUniforms
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 134
*/
/**
* @description Initialises a Sampler2D uniform (which may only be available later on after initUniforms once the texture has loaded)
* @method PIXI.PixiShader#initSampler2D
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 208
*/
/**
* @description Updates the shader uniform values.
* @method PIXI.PixiShader#syncUniforms
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 283
*/
/**
* @description Destroys the shader.
* @method PIXI.PixiShader#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 351
*/
/**
* @description The Default Vertex shader source.
* @member PIXI.PixiShader#defaultVertexSrc
* @type {String}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PixiShader.js
* @sourceline 365
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PrimitiveShader.js
* @sourceline 1
*/
/**
* @class PIXI.PrimitiveShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PrimitiveShader.js
* @sourceline 5
*/
/**
* @member PIXI.PrimitiveShader#_UID
* @type {Number}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PrimitiveShader.js
* @sourceline 12
*/
/**
* @member PIXI.PrimitiveShader#gl
* @type {WebGLContext}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PrimitiveShader.js
* @sourceline 19
*/
/**
* @description The WebGL program.
* @member PIXI.PrimitiveShader#program
* @type {}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PrimitiveShader.js
* @sourceline 25
*/
/**
* @description The fragment shader.
* @member PIXI.PrimitiveShader#fragmentSrc
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PrimitiveShader.js
* @sourceline 32
*/
/**
* @description The vertex shader.
* @member PIXI.PrimitiveShader#vertexSrc
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PrimitiveShader.js
* @sourceline 46
*/
/**
* @description Initialises the shader.
* @method PIXI.PrimitiveShader#init
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PrimitiveShader.js
* @sourceline 75
*/
/**
* @description Destroys the shader.
* @method PIXI.PrimitiveShader#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\PrimitiveShader.js
* @sourceline 105
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\StripShader.js
* @sourceline 1
*/
/**
* @class PIXI.StripShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\StripShader.js
* @sourceline 5
*/
/**
* @member PIXI.StripShader#_UID
* @type {Number}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\StripShader.js
* @sourceline 12
*/
/**
* @member PIXI.StripShader#gl
* @type {WebGLContext}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\StripShader.js
* @sourceline 19
*/
/**
* @description The WebGL program.
* @member PIXI.StripShader#program
* @type {}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\StripShader.js
* @sourceline 25
*/
/**
* @description The fragment shader.
* @member PIXI.StripShader#fragmentSrc
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\StripShader.js
* @sourceline 32
*/
/**
* @description The vertex shader.
* @member PIXI.StripShader#vertexSrc
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\StripShader.js
* @sourceline 50
*/
/**
* @description Initialises the shader.
* @method PIXI.StripShader#init
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\StripShader.js
* @sourceline 80
*/
/**
* @description Destroys the shader.
* @method PIXI.StripShader#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\shaders\StripShader.js
* @sourceline 111
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\FilterTexture.js
* @sourceline 1
*/
/**
* @class PIXI.FilterTexture
* @param {WebGLContext} gl - the current WebGL drawing context
* @param {Number} width - the horizontal range of the filter
* @param {Number} height - the vertical range of the filter
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\FilterTexture.js
* @sourceline 5
*/
/**
* @member PIXI.FilterTexture#gl
* @type {WebGLContext}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\FilterTexture.js
* @sourceline 15
*/
/**
* @member PIXI.FilterTexture#frameBuffer
* @type {}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\FilterTexture.js
* @sourceline 23
*/
/**
* @member PIXI.FilterTexture#texture
* @type {}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\FilterTexture.js
* @sourceline 29
*/
/**
* @member PIXI.FilterTexture#scaleMode
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\FilterTexture.js
* @sourceline 35
*/
/**
* @description Clears the filter texture.
* @method PIXI.FilterTexture#clear
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\FilterTexture.js
* @sourceline 61
*/
/**
* @description Resizes the texture to the specified width and height
* @method PIXI.FilterTexture#resize
* @param {Number} width - the new width of the texture
* @param {Number} height - the new height of the texture
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\FilterTexture.js
* @sourceline 74
*/
/**
* @description Destroys the filter texture.
* @method PIXI.FilterTexture#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\FilterTexture.js
* @sourceline 97
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLBlendModeManager.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLBlendModeManager
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLBlendModeManager.js
* @sourceline 5
*/
/**
* @member PIXI.WebGLBlendModeManager#currentBlendMode
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLBlendModeManager.js
* @sourceline 12
*/
/**
* @description Sets the WebGL Context.
* @method PIXI.WebGLBlendModeManager#setContext
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLBlendModeManager.js
* @sourceline 21
*/
/**
* @description Sets-up the given blendMode from WebGL's point of view.
* @method PIXI.WebGLBlendModeManager#setBlendMode
* @param {Number} blendMode - the blendMode, should be a Pixi const, such as PIXI.BlendModes.ADD
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLBlendModeManager.js
* @sourceline 32
*/
/**
* @description Destroys this object.
* @method PIXI.WebGLBlendModeManager#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLBlendModeManager.js
* @sourceline 54
*/
/**
* @fileoverview
* @author Mat Groves

Big thanks to the very clever Matt DesLauriers <mattdesl> https://github.com/mattdesl/
for creating the original pixi version!

Heavily inspired by LibGDX's WebGLSpriteBatch:
https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/WebGLSpriteBatch.java
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLFastSpriteBatch
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 11
*/
/**
* @member PIXI.WebGLFastSpriteBatch#vertSize
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 17
*/
/**
* @member PIXI.WebGLFastSpriteBatch#maxSize
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 23
*/
/**
* @member PIXI.WebGLFastSpriteBatch#size
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 29
*/
/**
* @description Vertex data
* @member PIXI.WebGLFastSpriteBatch#vertices
* @type {Float32Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 41
*/
/**
* @description Index data
* @member PIXI.WebGLFastSpriteBatch#indices
* @type {Uint16Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 48
*/
/**
* @member PIXI.WebGLFastSpriteBatch#vertexBuffer
* @type {Object}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 55
*/
/**
* @member PIXI.WebGLFastSpriteBatch#indexBuffer
* @type {Object}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 61
*/
/**
* @member PIXI.WebGLFastSpriteBatch#lastIndexCount
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 67
*/
/**
* @member PIXI.WebGLFastSpriteBatch#drawing
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 83
*/
/**
* @member PIXI.WebGLFastSpriteBatch#currentBatchSize
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 89
*/
/**
* @member PIXI.WebGLFastSpriteBatch#currentBaseTexture
* @type {PIXI.BaseTexture}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 95
*/
/**
* @member PIXI.WebGLFastSpriteBatch#currentBlendMode
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 101
*/
/**
* @member PIXI.WebGLFastSpriteBatch#renderSession
* @type {Object}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 107
*/
/**
* @member PIXI.WebGLFastSpriteBatch#shader
* @type {Object}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 113
*/
/**
* @member PIXI.WebGLFastSpriteBatch#matrix
* @type {Matrix}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 119
*/
/**
* @description Sets the WebGL Context.
* @method PIXI.WebGLFastSpriteBatch#setContext
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 130
*/
/**
* @method PIXI.WebGLFastSpriteBatch#begin
* @param {PIXI.WebGLSpriteBatch} spriteBatch - 
* @param {Object} renderSession - 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 154
*/
/**
* @method PIXI.WebGLFastSpriteBatch#end
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 169
*/
/**
* @method PIXI.WebGLFastSpriteBatch#render
* @param {PIXI.WebGLSpriteBatch} spriteBatch - 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 177
*/
/**
* @method PIXI.WebGLFastSpriteBatch#renderSprite
* @param {PIXI.Sprite} sprite - 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 208
*/
/**
* @method PIXI.WebGLFastSpriteBatch#flush
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 349
*/
/**
* @method PIXI.WebGLFastSpriteBatch#stop
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 389
*/
/**
* @method PIXI.WebGLFastSpriteBatch#start
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFastSpriteBatch.js
* @sourceline 397
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFilterManager.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLFilterManager
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFilterManager.js
* @sourceline 5
*/
/**
* @member PIXI.WebGLFilterManager#filterStack
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFilterManager.js
* @sourceline 11
*/
/**
* @member PIXI.WebGLFilterManager#offsetX
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFilterManager.js
* @sourceline 17
*/
/**
* @member PIXI.WebGLFilterManager#offsetY
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFilterManager.js
* @sourceline 23
*/
/**
* @description Initialises the context and the properties.
* @method PIXI.WebGLFilterManager#setContext
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFilterManager.js
* @sourceline 32
*/
/**
* @method PIXI.WebGLFilterManager#begin
* @param {RenderSession} renderSession - 
* @param {ArrayBuffer} buffer - 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFilterManager.js
* @sourceline 46
*/
/**
* @description Applies the filter and adds it to the current filter stack.
* @method PIXI.WebGLFilterManager#pushFilter
* @param {Object} filterBlock - the filter that will be pushed to the current filter stack
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFilterManager.js
* @sourceline 62
*/
/**
* @description Removes the last filter from the filter stack and doesn't return it.
* @method PIXI.WebGLFilterManager#popFilter
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFilterManager.js
* @sourceline 145
*/
/**
* @description Applies the filter to the specified area.
* @method PIXI.WebGLFilterManager#applyFilterPass
* @param {PIXI.AbstractFilter} filter - the filter that needs to be applied
* @param {PIXI.Texture} filterArea - TODO - might need an update
* @param {Number} width - the horizontal range of the filter
* @param {Number} height - the vertical range of the filter
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFilterManager.js
* @sourceline 336
*/
/**
* @description Initialises the shader buffers.
* @method PIXI.WebGLFilterManager#initShaderBuffers
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFilterManager.js
* @sourceline 397
*/
/**
* @description Destroys the filter and removes it from the filter stack.
* @method PIXI.WebGLFilterManager#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFilterManager.js
* @sourceline 445
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLGraphics
* @description A set of functions used by the webGL renderer to draw the primitive graphics data
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 5
*/

/**
* @description Renders the graphics object
* @method PIXI.WebGLGraphics.renderGraphics
* @param {PIXI.Graphics} graphics - 
* @param {Object} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 23
*/
/**
* @description Updates the graphics object
* @method PIXI.WebGLGraphics.updateGraphics
* @param {PIXI.Graphics} graphicsData - The graphics object to update
* @param {WebGLContext} gl - the current WebGL drawing context
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 93
*/
/**
* @method PIXI.WebGLGraphics.switchMode
* @param {WebGLContext} webGL - 
* @param {Number} type - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 218
*/
/**
* @description Builds a rectangle to draw
* @method PIXI.WebGLGraphics.buildRectangle
* @param {PIXI.Graphics} graphicsData - The graphics object containing all the necessary properties
* @param {Object} webGLData - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 252
*/
/**
* @description Builds a rounded rectangle to draw
* @method PIXI.WebGLGraphics.buildRoundedRectangle
* @param {PIXI.Graphics} graphicsData - The graphics object containing all the necessary properties
* @param {Object} webGLData - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 320
*/
/**
* @description Calculate the points for a quadratic bezier curve. (helper function..)
Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
* @method PIXI.WebGLGraphics.quadraticBezierCurve
* @param {Number} fromX - Origin point x
* @param {Number} fromY - Origin point x
* @param {Number} cpX - Control point x
* @param {Number} cpY - Control point y
* @param {Number} toX - Destination point x
* @param {Number} toY - Destination point y
* @return {Array<Number>} 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 390
*/
/**
* @description Builds a circle to draw
* @method PIXI.WebGLGraphics.buildCircle
* @param {PIXI.Graphics} graphicsData - The graphics object to draw
* @param {Object} webGLData - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 442
*/
/**
* @description Builds a line to draw
* @method PIXI.WebGLGraphics.buildLine
* @param {PIXI.Graphics} graphicsData - The graphics object containing all the necessary properties
* @param {Object} webGLData - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 525
*/
/**
* @description Builds a complex polygon to draw
* @method PIXI.WebGLGraphics.buildComplexPoly
* @param {PIXI.Graphics} graphicsData - The graphics object containing all the necessary properties
* @param {Object} webGLData - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 737
*/
/**
* @description Builds a polygon to draw
* @method PIXI.WebGLGraphics.buildPoly
* @param {PIXI.Graphics} graphicsData - The graphics object containing all the necessary properties
* @param {Object} webGLData - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 799
*/
/**
* @class PIXI.WebGLGraphicsData
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 854
*/
/**
* @method PIXI.WebGLGraphicsData#reset
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 874
*/
/**
* @method PIXI.WebGLGraphicsData#upload
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 883
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLMaskManager.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLMaskManager
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLMaskManager.js
* @sourceline 5
*/
/**
* @description Sets the drawing context to the one given in parameter.
* @method PIXI.WebGLMaskManager#setContext
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLMaskManager.js
* @sourceline 16
*/
/**
* @description Applies the Mask and adds it to the current filter stack.
* @method PIXI.WebGLMaskManager#pushMask
* @param {Array} maskData - 
* @param {Object} renderSession - 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLMaskManager.js
* @sourceline 27
*/
/**
* @description Removes the last filter from the filter stack and doesn't return it.
* @method PIXI.WebGLMaskManager#popMask
* @param {Array} maskData - 
* @param {Object} renderSession - an object containing all the useful parameters
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLMaskManager.js
* @sourceline 51
*/
/**
* @description Destroys the mask stack.
* @method PIXI.WebGLMaskManager#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLMaskManager.js
* @sourceline 71
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderManager.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLShaderManager
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderManager.js
* @sourceline 5
*/
/**
* @member PIXI.WebGLShaderManager#maxAttibs
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderManager.js
* @sourceline 12
*/
/**
* @member PIXI.WebGLShaderManager#attribState
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderManager.js
* @sourceline 18
*/
/**
* @member PIXI.WebGLShaderManager#tempAttribState
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderManager.js
* @sourceline 24
*/
/**
* @member PIXI.WebGLShaderManager#stack
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderManager.js
* @sourceline 35
*/
/**
* @description Initialises the context and the properties.
* @method PIXI.WebGLShaderManager#setContext
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderManager.js
* @sourceline 45
*/
/**
* @description Takes the attributes given in parameters.
* @method PIXI.WebGLShaderManager#setAttribs
* @param {Array} attribs - attribs
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderManager.js
* @sourceline 73
*/
/**
* @description Sets the current shader.
* @method PIXI.WebGLShaderManager#setShader
* @param {} shader - 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderManager.js
* @sourceline 116
*/
/**
* @description Destroys this object.
* @method PIXI.WebGLShaderManager#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderManager.js
* @sourceline 136
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderUtils.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLSpriteBatch
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 12
*/
/**
* @method PIXI.WebGLSpriteBatch.initDefaultShaders
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderUtils.js
* @sourceline 5
*/
/**
* @method PIXI.WebGLSpriteBatch.CompileVertexShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @param {Array} shaderSrc - 
* @return {} 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderUtils.js
* @sourceline 14
*/
/**
* @method PIXI.WebGLSpriteBatch.CompileFragmentShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @param {Array} shaderSrc - 
* @return {} 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderUtils.js
* @sourceline 26
*/
/**
* @method PIXI.WebGLSpriteBatch._CompileShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @param {Array} shaderSrc - 
* @param {Number} shaderType - 
* @return {} 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderUtils.js
* @sourceline 38
*/
/**
* @method PIXI.WebGLSpriteBatch.compileProgram
* @param {WebGLContext} gl - the current WebGL drawing context
* @param {Array} vertexSrc - 
* @param {Array} fragmentSrc - 
* @return {} 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderUtils.js
* @sourceline 69
*/

/**
* @member PIXI.WebGLSpriteBatch#vertSize
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 20
*/
/**
* @description The number of images in the SpriteBatch before it flushes
* @member PIXI.WebGLSpriteBatch#size
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 26
*/
/**
* @description Holds the vertices
* @member PIXI.WebGLSpriteBatch#vertices
* @type {ArrayBuffer}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 38
*/
/**
* @description View on the vertices as a Float32Array
* @member PIXI.WebGLSpriteBatch#positions
* @type {Float32Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 46
*/
/**
* @description View on the vertices as a Uint32Array
* @member PIXI.WebGLSpriteBatch#colors
* @type {Uint32Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 54
*/
/**
* @description Holds the indices
* @member PIXI.WebGLSpriteBatch#indices
* @type {Uint16Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 62
*/
/**
* @member PIXI.WebGLSpriteBatch#lastIndexCount
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 70
*/
/**
* @member PIXI.WebGLSpriteBatch#drawing
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 86
*/
/**
* @member PIXI.WebGLSpriteBatch#currentBatchSize
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 92
*/
/**
* @member PIXI.WebGLSpriteBatch#currentBaseTexture
* @type {PIXI.BaseTexture}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 98
*/
/**
* @member PIXI.WebGLSpriteBatch#dirty
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 104
*/
/**
* @member PIXI.WebGLSpriteBatch#textures
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 110
*/
/**
* @member PIXI.WebGLSpriteBatch#blendModes
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 116
*/
/**
* @member PIXI.WebGLSpriteBatch#shaders
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 122
*/
/**
* @member PIXI.WebGLSpriteBatch#sprites
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 128
*/
/**
* @member PIXI.WebGLSpriteBatch#defaultShader
* @type {PIXI.AbstractFilter}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 134
*/
/**
* @method PIXI.WebGLSpriteBatch#setContext
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 149
*/
/**
* @method PIXI.WebGLSpriteBatch#begin
* @param {Object} renderSession - The RenderSession object
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 181
*/
/**
* @method PIXI.WebGLSpriteBatch#end
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 193
*/
/**
* @method PIXI.WebGLSpriteBatch#render
* @param {PIXI.Sprite} sprite - the sprite to render when using this spritebatch
* @param {Matrix} [matrix] - - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 201
*/
/**
* @description Renders a TilingSprite using the spriteBatch.
* @method PIXI.WebGLSpriteBatch#renderTilingSprite
* @param {PIXI.TilingSprite} sprite - the sprite to render
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 335
*/
/**
* @description Renders the content and empties the current batch.
* @method PIXI.WebGLSpriteBatch#flush
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 462
*/
/**
* @method PIXI.WebGLSpriteBatch#renderBatch
* @param {PIXI.Texture} texture - 
* @param {Number} size - 
* @param {Number} startIndex - 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 610
*/
/**
* @method PIXI.WebGLSpriteBatch#stop
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 647
*/
/**
* @method PIXI.WebGLSpriteBatch#start
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 656
*/
/**
* @description Destroys the SpriteBatch.
* @method PIXI.WebGLSpriteBatch#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 664
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLStencilManager.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLStencilManager
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLStencilManager.js
* @sourceline 5
*/
/**
* @description Sets the drawing context to the one given in parameter.
* @method PIXI.WebGLStencilManager#setContext
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLStencilManager.js
* @sourceline 17
*/
/**
* @description Applies the Mask and adds it to the current filter stack.
* @method PIXI.WebGLStencilManager#pushMask
* @param {PIXI.Graphics} graphics - 
* @param {Array} webGLData - 
* @param {Object} renderSession - 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLStencilManager.js
* @sourceline 28
*/
/**
* @description TODO this does not belong here!
* @method PIXI.WebGLStencilManager#bindGraphics
* @param {PIXI.Graphics} graphics - 
* @param {Array} webGLData - 
* @param {Object} renderSession - 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLStencilManager.js
* @sourceline 120
*/
/**
* @method PIXI.WebGLStencilManager#popStencil
* @param {PIXI.Graphics} graphics - 
* @param {Array} webGLData - 
* @param {Object} renderSession - 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLStencilManager.js
* @sourceline 193
*/
/**
* @description Destroys the mask stack.
* @method PIXI.WebGLStencilManager#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLStencilManager.js
* @sourceline 288
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLRenderer
* @description The WebGLRenderer draws the stage and all its content onto a webGL enabled canvas. This renderer
should be used for browsers that support webGL. This Render works by automatically managing webGLBatchs.
So no need for Sprite Batches or Sprite Clouds.
Don't forget to add the view to your DOM or you will not see anything :)
* @param {PhaserGame} game - A reference to the Phaser Game instance
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 8
*/
/**
* @member PIXI.WebGLRenderer#game - A reference to the Phaser Game instance.
* @type {PhaserGame}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 20
*/
/**
* @member PIXI.WebGLRenderer#type
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 30
*/
/**
* @description The resolution of the renderer
* @member PIXI.WebGLRenderer#resolution
* @type {Number}
* @default 1
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 36
*/
/**
* @description Whether the render view is transparent
* @member PIXI.WebGLRenderer#transparent
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 45
*/
/**
* @description Whether the render view should be resized automatically
* @member PIXI.WebGLRenderer#autoResize
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 53
*/
/**
* @description The value of the preserveDrawingBuffer flag affects whether or not the contents of the stencil buffer is retained after rendering.
* @member PIXI.WebGLRenderer#preserveDrawingBuffer
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 61
*/
/**
* @description This sets if the WebGLRenderer will clear the context texture or not before the new render pass. If true:
If the Stage is NOT transparent, Pixi will clear to alpha (0, 0, 0, 0).
If the Stage is transparent, Pixi will clear to the target Stage's background color.
Disable this by setting this to false. For example: if your game has a canvas filling background image, you often don't need this set.
* @member PIXI.WebGLRenderer#clearBeforeRender
* @type {Boolean}
* @default 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 69
*/
/**
* @description The width of the canvas view
* @member PIXI.WebGLRenderer#width
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 81
*/
/**
* @description The height of the canvas view
* @member PIXI.WebGLRenderer#height
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 89
*/
/**
* @description The canvas element that everything is drawn to
* @member PIXI.WebGLRenderer#view
* @type {HTMLCanvasElement}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 97
*/
/**
* @member PIXI.WebGLRenderer#_contextOptions
* @type {Object}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 105
*/
/**
* @member PIXI.WebGLRenderer#projection
* @type {Point}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 118
*/
/**
* @member PIXI.WebGLRenderer#offset
* @type {Point}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 124
*/
/**
* @description Deals with managing the shader programs and their attribs
* @member PIXI.WebGLRenderer#shaderManager
* @type {PIXI.WebGLShaderManager}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 132
*/
/**
* @description Manages the rendering of sprites
* @member PIXI.WebGLRenderer#spriteBatch
* @type {PIXI.WebGLSpriteBatch}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 139
*/
/**
* @description Manages the masks using the stencil buffer
* @member PIXI.WebGLRenderer#maskManager
* @type {PIXI.WebGLMaskManager}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 146
*/
/**
* @description Manages the filters
* @member PIXI.WebGLRenderer#filterManager
* @type {PIXI.WebGLFilterManager}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 153
*/
/**
* @description Manages the stencil buffer
* @member PIXI.WebGLRenderer#stencilManager
* @type {PIXI.WebGLStencilManager}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 160
*/
/**
* @description Manages the blendModes
* @member PIXI.WebGLRenderer#blendModeManager
* @type {PIXI.WebGLBlendModeManager}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 167
*/
/**
* @member PIXI.WebGLRenderer#renderSession
* @type {Object}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 174
*/
/**
* @method PIXI.WebGLRenderer#initContext
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 204
*/
/**
* @description Renders the stage to its webGL view
* @method PIXI.WebGLRenderer#render
* @param {Stage} stage - the Stage element to be rendered
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 243
*/
/**
* @description Renders a Display Object.
* @method PIXI.WebGLRenderer#renderDisplayObject
* @param {DisplayObject} displayObject - The DisplayObject to render
* @param {Point} projection - The projection
* @param {Array} buffer - a standard WebGL buffer
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 278
*/
/**
* @description Resizes the webGL view to the specified width and height.
* @method PIXI.WebGLRenderer#resize
* @param {Number} width - the new width of the webGL view
* @param {Number} height - the new height of the webGL view
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 315
*/
/**
* @description Updates and Creates a WebGL texture for the renderers context.
* @method PIXI.WebGLRenderer#updateTexture
* @param {PIXI.Texture} texture - the texture to update
* @return {Boolean} True if the texture was successfully bound, otherwise false.
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 341
*/
/**
* @description Removes everything from the renderer (event listeners, spritebatch, etc...)
* @method PIXI.WebGLRenderer#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 398
*/
/**
* @description Maps Pixi blend modes to WebGL blend modes.
* @method PIXI.WebGLRenderer#mapBlendModes
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 430
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 1
*/
/**
* @class PIXI.BaseTexture
* @description A texture stores the information that represents an image. All textures have a base texture.
* @param {(String|Canvas)} source - the source object (image or canvas)
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 5
*/
/**
* @description The Resolution of the texture.
* @member PIXI.BaseTexture#resolution
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 16
*/
/**
* @description [read-only] The width of the base texture set when the image has loaded
* @member PIXI.BaseTexture#width
* @type {Number}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 24
*/
/**
* @description [read-only] The height of the base texture set when the image has loaded
* @member PIXI.BaseTexture#height
* @type {Number}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 33
*/
/**
* @description The scale mode to apply when scaling this texture
* @member PIXI.BaseTexture#scaleMode
* @type {Number}
* @default PIXI.scaleModes.LINEAR
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 42
*/
/**
* @description [read-only] Set to true once the base texture has loaded
* @member PIXI.BaseTexture#hasLoaded
* @type {Boolean}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 51
*/
/**
* @description The image source that is used to create the texture.
* @member PIXI.BaseTexture#source
* @type {Image}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 60
*/
/**
* @description Controls if RGB channels should be pre-multiplied by Alpha  (WebGL only)
* @member PIXI.BaseTexture#premultipliedAlpha
* @type {Boolean}
* @default true
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 68
*/
/**
* @member PIXI.BaseTexture#_glTextures
* @type {Array}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 79
*/
/**
* @description Set this to true if a mipmap of this texture needs to be generated. This value needs to be set before the texture is used
Also the texture must be a power of two size to work
* @member PIXI.BaseTexture#mipmap
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 86
*/
/**
* @member PIXI.BaseTexture#_dirty
* @type {Array}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 95
*/
/**
* @description A BaseTexture can be set to skip the rendering phase in the WebGL Sprite Batch.

You may want to do this if you have a parent Sprite with no visible texture (i.e. uses the internal `__default` texture)
that has children that you do want to render, without causing a batch flush in the process.
* @member PIXI.BaseTexture#skipRender
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 115
*/
/**
* @member PIXI.BaseTexture#_powerOf2
* @type {Boolean}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 126
*/
/**
* @description Forces this BaseTexture to be set as loaded, with the given width and height.
Then calls BaseTexture.dirty.
Important for when you don't want to modify the source object by forcing in `complete` or dimension properties it may not have.
* @method PIXI.BaseTexture#forceLoaded
* @param {Number} width - - The new width to force the BaseTexture to be.
* @param {Number} height - - The new height to force the BaseTexture to be.
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 137
*/
/**
* @description Destroys this base texture
* @method PIXI.BaseTexture#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 154
*/
/**
* @description Changes the source image of the texture
* @method PIXI.BaseTexture#updateSourceImage
* @param {String} newSrc - the path of the image
* @deprecated true
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 171
*/
/**
* @description Sets all glTextures to be dirty.
* @method PIXI.BaseTexture#dirty
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 183
*/
/**
* @description Removes the base texture from the GPU, useful for managing resources on the GPU.
Atexture is still 100% usable and will simply be reuploaded if there is a sprite on screen that is using it.
* @method PIXI.BaseTexture#unloadFromGPU
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 196
*/
/**
* @description Helper function that creates a base texture from the given canvas element.
* @method PIXI.BaseTexture.fromCanvas
* @param {Canvas} canvas - The canvas element source of the texture
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @return {PIXI.BaseTexture} 
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 224
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 1
*/
/**
* @class PIXI.RenderTexture
* @description A RenderTexture is a special texture that allows any Pixi display object to be rendered to it.

__Hint__: All DisplayObjects (i.e. Sprites) that render to a RenderTexture should be preloaded otherwise black rectangles will be drawn instead.

A RenderTexture takes a snapshot of any Display Object given to its render method. The position and rotation of the given Display Objects is ignored. For example:

   var renderTexture = new PIXI.RenderTexture(800, 600);
   var sprite = PIXI.Sprite.fromImage("spinObj_01.png");
   sprite.position.x = 800/2;
   sprite.position.y = 600/2;
   sprite.anchor.x = 0.5;
   sprite.anchor.y = 0.5;
   renderTexture.render(sprite);

The Sprite in this case will be rendered to a position of 0,0. To render this sprite at its actual position a DisplayObjectContainer should be used:

   var doc = new PIXI.DisplayObjectContainer();
   doc.addChild(sprite);
   renderTexture.render(doc);  // Renders to center of renderTexture
* @augments PIXI.Texture
* @param {Number} width - The width of the render texture
* @param {Number} height - The height of the render texture
* @param {(PIXI.CanvasRenderer|PIXI.WebGLRenderer)} renderer - The renderer used for this RenderTexture
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @param {Number} resolution - The resolution of the texture being generated
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 5
*/
/**
* @description The with of the render texture
* @member PIXI.RenderTexture#width
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 37
*/
/**
* @description The height of the render texture
* @member PIXI.RenderTexture#height
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 45
*/
/**
* @description The Resolution of the texture.
* @member PIXI.RenderTexture#resolution
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 53
*/
/**
* @description The framing rectangle of the render texture
* @member PIXI.RenderTexture#frame
* @type {Rectangle}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 61
*/
/**
* @description This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)
* @member PIXI.RenderTexture#crop
* @type {Rectangle}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 69
*/
/**
* @description The base texture object that this texture uses
* @member PIXI.RenderTexture#baseTexture
* @type {PIXI.BaseTexture}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 78
*/
/**
* @description The renderer this RenderTexture uses. A RenderTexture can only belong to one renderer at the moment if its webGL.
* @member PIXI.RenderTexture#renderer
* @type {(PIXI.CanvasRenderer|PIXI.WebGLRenderer)}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 99
*/
/**
* @member PIXI.RenderTexture#valid
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 125
*/
/**
* @description Resizes the RenderTexture.
* @method PIXI.RenderTexture#resize
* @param {Number} width - The width to resize to.
* @param {Number} height - The height to resize to.
* @param {Boolean} updateBase - Should the baseTexture.width and height values be resized as well?
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 139
*/
/**
* @description Clears the RenderTexture.
* @method PIXI.RenderTexture#clear
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 175
*/
/**
* @description This function will draw the display object to the texture.
* @method PIXI.RenderTexture#renderWebGL
* @param {DisplayObject} displayObject - The display object to render this texture on
* @param {Matrix} [matrix] - Optional matrix to apply to the display object before rendering.
* @param {Boolean} [clear] - If true the texture will be cleared before the displayObject is drawn
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 195
*/
/**
* @description This function will draw the display object to the texture.
* @method PIXI.RenderTexture#renderCanvas
* @param {DisplayObject} displayObject - The display object to render this texture on
* @param {Matrix} [matrix] - Optional matrix to apply to the display object before rendering.
* @param {Boolean} [clear] - If true the texture will be cleared before the displayObject is drawn
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 250
*/
/**
* @description Will return a HTML Image of the texture
* @method PIXI.RenderTexture#getImage
* @return {Image} 
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 296
*/
/**
* @description Will return a base64 encoded string of this texture. It works by calling RenderTexture.getCanvas and then running toDataURL on that.
* @method PIXI.RenderTexture#getBase64
* @return {String} A base64 encoded string of the texture.
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 309
*/
/**
* @description Creates a Canvas element, renders this RenderTexture to it and then returns it.
* @method PIXI.RenderTexture#getCanvas
* @return {HTMLCanvasElement} A Canvas element with the texture rendered on.
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 320
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 1
*/
/**
* @class PIXI.Texture
* @description A texture stores the information that represents an image or part of an image. It cannot be added
to the display list directly. Instead use it as the texture for a PIXI.Sprite. If no frame is provided then the whole image is used.
* @param {PIXI.BaseTexture} baseTexture - The base texture source to create the texture from
* @param {Rectangle} frame - The rectangle frame of the texture to show
* @param {Rectangle} [crop] - The area of original texture
* @param {Rectangle} [trim] - Trimmed texture rectangle
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 14
*/

/**
* @description Does this Texture have any frame data assigned to it?
* @member PIXI.Texture#noFrame
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 28
*/
/**
* @description The base texture that this texture uses.
* @member PIXI.Texture#baseTexture
* @type {PIXI.BaseTexture}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 47
*/
/**
* @description The frame specifies the region of the base texture that this texture uses
* @member PIXI.Texture#frame
* @type {Rectangle}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 55
*/
/**
* @description The texture trim data.
* @member PIXI.Texture#trim
* @type {Rectangle}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 63
*/
/**
* @description This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.
* @member PIXI.Texture#valid
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 71
*/
/**
* @description Is this a tiling texture? As used by the likes of a TilingSprite.
* @member PIXI.Texture#isTiling
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 79
*/
/**
* @description This will let a renderer know that a texture has been updated (used mainly for webGL uv updates)
* @member PIXI.Texture#requiresUpdate
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 87
*/
/**
* @description This will let a renderer know that a tinted parent has updated its texture.
* @member PIXI.Texture#requiresReTint
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 95
*/
/**
* @description The WebGL UV data cache.
* @member PIXI.Texture#_uvs
* @type {Object}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 103
*/
/**
* @description The width of the Texture in pixels.
* @member PIXI.Texture#width
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 112
*/
/**
* @description The height of the Texture in pixels.
* @member PIXI.Texture#height
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 120
*/
/**
* @description This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)
* @member PIXI.Texture#crop
* @type {Rectangle}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 128
*/
/**
* @description Called when the base texture is loaded
* @method PIXI.Texture#onBaseTextureLoaded
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 147
*/
/**
* @description Destroys this texture
* @method PIXI.Texture#destroy
* @param {Boolean} destroyBase - Whether to destroy the base texture as well
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 165
*/
/**
* @description Specifies the region of the baseTexture that this texture will use.
* @method PIXI.Texture#setFrame
* @param {Rectangle} frame - The frame of the texture to set it to
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 178
*/
/**
* @description Updates the internal WebGL UV cache.
* @method PIXI.Texture#_updateUvs
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 222
*/
/**
* @description Helper function that creates a new a Texture based on the given canvas element.
* @method PIXI.Texture.fromCanvas
* @param {Canvas} canvas - The canvas element source of the texture
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @return {PIXI.Texture} 
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 249
*/
/**
* @fileoverview
* @author Richard Davey <rich@photonstorm.com>
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\CanvasPool.js
* @sourceline 1
*/
/**
* @class PIXI.CanvasPool
* @description The CanvasPool is a global static object that allows Pixi and Phaser to pool canvas DOM elements.
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\CanvasPool.js
* @sourceline 7
*/
/**
* @description Creates a new Canvas DOM element, or pulls one from the pool if free.
* @method PIXI.CanvasPool.create
* @param {} parent - The parent of the canvas element.
* @param {Number} width - The width of the canvas element.
* @param {Number} height - The height of the canvas element.
* @return {HTMLCanvasElement} The canvas element.
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\CanvasPool.js
* @sourceline 15
*/
/**
* @description Gets the first free canvas index from the pool.
* @method PIXI.CanvasPool.getFirst
* @return {Number} 
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\CanvasPool.js
* @sourceline 58
*/
/**
* @description Removes the parent from a canvas element from the pool, freeing it up for re-use.
* @method PIXI.CanvasPool.remove
* @param {} parent - The parent of the canvas element.
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\CanvasPool.js
* @sourceline 81
*/
/**
* @description Removes the parent from a canvas element from the pool, freeing it up for re-use.
* @method PIXI.CanvasPool.removeByCanvas
* @param {HTMLCanvasElement} canvas - The canvas element to remove
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\CanvasPool.js
* @sourceline 104
*/
/**
* @description Gets the total number of used canvas elements in the pool.
* @method PIXI.CanvasPool.getTotal
* @return {Number} The number of in-use (parented) canvas elements in the pool.
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\CanvasPool.js
* @sourceline 127
*/
/**
* @description Gets the total number of free canvas elements in the pool.
* @method PIXI.CanvasPool.getFree
* @return {Number} The number of free (un-parented) canvas elements in the pool.
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\CanvasPool.js
* @sourceline 151
*/
/**
* @description The pool into which the canvas dom elements are placed.
* @member PIXI.CanvasPool.pool
* @type {Array}
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\CanvasPool.js
* @sourceline 177
*/
/**
* @class PIXI.EarCut
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EarCut.js
* @sourceline 17
*/
/**
* @fileoverview
* @author Chad Engler https://github.com/englercj @Rolnaaba
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 1
*/
/**
* @class PIXI.EventTarget
* @description Mixins event emitter functionality to a class
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 11
*/


/**
* @description Mixes in the properties of the EventTarget prototype onto another object
* @method PIXI.EventTarget#mixin
* @param {Object} object - The obj to mix into
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 34
*/
/**
* @description Return a list of assigned event listeners.
* @method PIXI.EventTarget#listeners
* @param {String} eventName - The events that should be listed.
* @return {Array} An array of listener functions
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 41
*/
/**
* @description Emit an event to all registered event listeners.
* @method PIXI.EventTarget#emit
* @param {String} eventName - The name of the event.
* @return {Boolean} Indication if we've emitted an event.
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 54
*/
/**
* @description Register a new EventListener for the given event.
* @method PIXI.EventTarget#on
* @param {String} eventName - Name of the event.
* @param {Functon} callback - fn Callback function.
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 107
*/
/**
* @description Add an EventListener that's only called once.
* @method PIXI.EventTarget#once
* @param {String} eventName - Name of the event.
* @param {Function} callback - Callback function.
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 124
*/
/**
* @description Remove event listeners.
* @method PIXI.EventTarget#off
* @param {String} eventName - The event we want to remove.
* @param {Function} callback - The listener that we need to find.
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 143
*/
/**
* @description Remove all listeners or only the listeners for the specified event.
* @method PIXI.EventTarget#removeAllListeners
* @param {String} eventName - The event you want to remove all listeners for.
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 173
*/
/**
* @class PIXI.Event
* @description Creates an homogenous object for tracking events so users can know what to expect.
* @augments Object
* @param {Object} target - The target object that the event is called on
* @param {String} name - The string name of the event that was triggered
* @param {Object} data - Arbitrary event data to pass along
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 192
*/
/**
* @description Tracks the state of bubbling propagation. Do not
set this directly, instead use `event.stopPropagation()`
* @member PIXI.Event#stopped
* @type {Boolean}
* @readonly 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 206
*/
/**
* @description Tracks the state of sibling listener propagation. Do not
set this directly, instead use `event.stopImmediatePropagation()`
* @member PIXI.Event#stoppedImmediate
* @type {Boolean}
* @readonly 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 217
*/
/**
* @description The original target the event triggered on.
* @member PIXI.Event#target
* @type {Object}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 228
*/
/**
* @description The string name of the event that this represents.
* @member PIXI.Event#type
* @type {String}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 237
*/
/**
* @description The data that was passed in with this event.
* @member PIXI.Event#data
* @type {Object}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 246
*/
/**
* @description The timestamp when the event occurred.
* @member PIXI.Event#timeStamp
* @type {Number}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 258
*/
/**
* @description Stops the propagation of events up the scene graph (prevents bubbling).
* @method PIXI.Event#stopPropagation
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 268
*/
/**
* @description Stops the propagation of events to sibling listeners (no longer calls any listeners).
* @method PIXI.Event#stopImmediatePropagation
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\EventTarget.js
* @sourceline 277
*/
/**
* @class PIXI.PolyK
* @description Based on the Polyk library http://polyk.ivank.net released under MIT licence.
This is an amazing lib!
Slightly modified by Mat Groves (matgroves.com);
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\Polyk.js
* @sourceline 34
*/
/**
* @description Triangulates shapes for webGL graphic fills.
* @method PIXI.PolyK#Triangulate
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\Polyk.js
* @sourceline 42
*/
/**
* @description Checks whether a point is within a triangle
* @method PIXI.PolyK#_PointInTriangle
* @param {Number} px - x coordinate of the point to test
* @param {Number} py - y coordinate of the point to test
* @param {Number} ax - x coordinate of the a point of the triangle
* @param {Number} ay - y coordinate of the a point of the triangle
* @param {Number} bx - x coordinate of the b point of the triangle
* @param {Number} by - y coordinate of the b point of the triangle
* @param {Number} cx - x coordinate of the c point of the triangle
* @param {Number} cy - y coordinate of the c point of the triangle
* @return {Boolean} 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\Polyk.js
* @sourceline 120
*/
/**
* @description Checks whether a shape is convex
* @method PIXI.PolyK#_convex
* @return {Boolean} 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\Polyk.js
* @sourceline 158
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\Utils.js
* @sourceline 1
*/
/**
* @class PIXI.PIXI
* @description Namespace-class for [pixi.js](http://www.pixijs.com/).

Contains assorted static properties and enumerations.
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 11
*/
/**
* @description Converts a hex color number to an [R, G, B] array
* @method PIXI.PIXI#hex2rgb
* @param {Number} hex - 
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\Utils.js
* @sourceline 5
*/
/**
* @description Converts a color as an [R, G, B] array to a hex number
* @method PIXI.PIXI#rgb2hex
* @param {Array} rgb - 
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\Utils.js
* @sourceline 15
*/
/**
* @description Checks whether the Canvas BlendModes are supported by the current browser for drawImage
* @method PIXI.PIXI#canUseNewCanvasBlendModes
* @return {Boolean} whether they are supported
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\Utils.js
* @sourceline 25
*/
/**
* @description Given a number, this function returns the closest number that is a power of two
this function is taken from Starling Framework as its pretty neat ;)
* @method PIXI.PIXI#getNextPowerOfTwo
* @param {Number} number - 
* @return {Number} the closest number that is a power of two
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\Utils.js
* @sourceline 63
*/
/**
* @description checks if the given width and height make a power of two texture
* @method PIXI.PIXI#isPowerOfTwo
* @param {Number} width - 
* @param {Number} height - 
* @return {Boolean} 
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\Utils.js
* @sourceline 83
*/



/**
* @description A reference to the Phaser Game instance that owns this Pixi renderer.
* @member PIXI.PIXI.game
* @type {PhaserGame}
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 21
*/
/**
* @member PIXI.PIXI.WEBGL_RENDERER
* @type {Number}
* @access protected
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 28
*/
/**
* @member PIXI.PIXI.CANVAS_RENDERER
* @type {Number}
* @access protected
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 35
*/
/**
* @description Version of pixi that is loaded.
* @member PIXI.PIXI.VERSION
* @type {String}
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 42
*/
/**
* @member PIXI.PIXI.PI_2
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 71
*/
/**
* @member PIXI.PIXI.RAD_TO_DEG
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 77
*/
/**
* @member PIXI.PIXI.DEG_TO_RAD
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 83
*/
/**
* @member PIXI.PIXI.RETINA_PREFIX
* @type {String}
* @access protected
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 89
*/
/**
* @description The default render options if none are supplied to
{{#crossLink "WebGLRenderer"}}{{/crossLink}} or {{#crossLink "CanvasRenderer"}}{{/crossLink}}.
* @member PIXI.PIXI.defaultRenderOptions
* @type {Object}
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 96
*/