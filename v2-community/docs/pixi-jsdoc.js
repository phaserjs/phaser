/**
* @namespace PIXI
*/
/**
* @fileoverview
* @author Richard Davey <rich@photonstorm.com>
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 1
*/
/**
* @class PIXI.PIXI.DisplayObject
* @description The base class for all objects that are rendered. Contains properties for position, scaling,
rotation, masks and cache handling.

This is an abstract class and should not be used on its own, rather it should be extended.

It is used internally by the likes of PIXI.Sprite.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 7
*/
/**
* @description The coordinates, in pixels, of this DisplayObject, relative to its parent container.

The value of this property does not reflect any positioning happening further up the display list.
To obtain that value please see the `worldPosition` property.
* @member PIXI.PIXI.DisplayObject#position
* @type {PIXIPoint}
* @default 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
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
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 31
*/
/**
* @description The pivot point of this DisplayObject that it rotates around. The values are expressed
in pixel values.
* @member PIXI.PIXI.DisplayObject#pivot
* @type {PIXIPoint}
* @default 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
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
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
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
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
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
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 75
*/
/**
* @description This is the defined area that will pick up mouse / touch events. It is null by default.
Setting it is a neat way of optimising the hitTest function that the interactionManager will use (as it will not need to hit test all the children)
* @member PIXI.PIXI.DisplayObject#hitArea
* @type {(Rectangle|Circle|Ellipse|Polygon)}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 89
*/
/**
* @description Should this DisplayObject be rendered by the renderer? An object with a renderable value of
`false` is skipped during the render pass.
* @member PIXI.PIXI.DisplayObject#renderable
* @type {Boolean}
* @default 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
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
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 107
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
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 119
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
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 135
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
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 150
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
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 165
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
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 180
*/
/**
* @description The rectangular area used by filters when rendering a shader for this DisplayObject.
* @member PIXI.PIXI.DisplayObject#filterArea
* @type {Rectangle}
* @default 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 195
*/
/**
* @member PIXI.PIXI.DisplayObject#_sr - Cached rotation value.
* @type {Number}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 204
*/
/**
* @member PIXI.PIXI.DisplayObject#_cr - Cached rotation value.
* @type {Number}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 210
*/
/**
* @member PIXI.PIXI.DisplayObject#_bounds - The cached bounds of this object.
* @type {PIXIRectangle}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 216
*/
/**
* @member PIXI.PIXI.DisplayObject#_currentBounds - The most recently calculated bounds of this object.
* @type {PIXIRectangle}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 222
*/
/**
* @member PIXI.PIXI.DisplayObject#_mask - The cached mask of this object.
* @type {PIXIRectangle}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 228
*/
/**
* @member PIXI.PIXI.DisplayObject#_cacheAsBitmap - Internal cache as bitmap flag.
* @type {Boolean}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 234
*/
/**
* @member PIXI.PIXI.DisplayObject#_cacheIsDirty - Internal dirty cache flag.
* @type {Boolean}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 240
*/
/**
* @description Destroy this DisplayObject.

Removes any cached sprites, sets renderable flag to false, and nulls filters, bounds and mask.

Also iteratively calls `destroy` on any children.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 252
*/
/**
* @description To be overridden by classes that require it.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#preUpdate
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 403
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
* @return {PhaserRenderTexture} - A RenderTexture containing an image of this DisplayObject at the time it was invoked.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 412
*/
/**
* @description If this DisplayObject has a cached Sprite, this method generates and updates it.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#updateCache
* @return {PIXIDisplayObject} - A reference to this DisplayObject.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 440
*/
/**
* @description Calculates the global position of this DisplayObject, based on the position given.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#toGlobal
* @param {PIXIPoint} position - - The global position to calculate from.
* @return {PIXIPoint} - A point object representing the position of this DisplayObject based on the global position given.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 454
*/
/**
* @description Calculates the local position of this DisplayObject, relative to another point.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#toLocal
* @param {PIXIPoint} position - - The world origin to calculate from.
* @param {PIXIDisplayObject} [from] - - An optional DisplayObject to calculate the global position from.
* @return {PIXIPoint} - A point object representing the position of this DisplayObject based on the global position given.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 469
*/
/**
* @description Internal method.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#_renderCachedSprite
* @param {Object} renderSession - - The render session
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 490
*/
/**
* @description Internal method.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#_generateCachedSprite
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 512
*/
/**
* @description Destroys a cached Sprite.
* @method PIXI.PIXI.DisplayObject#PIXI.DisplayObject#_destroyCachedSprite
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 562
*/
/**
* @description The horizontal position of the DisplayObject, in pixels, relative to its parent.
If you need the world position of the DisplayObject, use `DisplayObject.worldPosition` instead.
* @member PIXI.PIXI.DisplayObject#x - The horizontal position of the DisplayObject, in pixels, relative to its parent.
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 588
*/
/**
* @description The vertical position of the DisplayObject, in pixels, relative to its parent.
If you need the world position of the DisplayObject, use `DisplayObject.worldPosition` instead.
* @member PIXI.PIXI.DisplayObject#y - The vertical position of the DisplayObject, in pixels, relative to its parent.
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 610
*/
/**
* @description Indicates if this DisplayObject is visible, based on it, and all of its parents, `visible` property values.
* @member PIXI.PIXI.DisplayObject#worldVisible - Indicates if this DisplayObject is visible, based on it, and all of its parents, `visible` property values.
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 632
*/
/**
* @description Sets a mask for this DisplayObject. A mask is an instance of a Graphics object.
When applied it limits the visible area of this DisplayObject to the shape of the mask.
Under a Canvas renderer it uses shape clipping. Under a WebGL renderer it uses a Stencil Buffer.
To remove a mask, set this property to `null`.
* @member PIXI.PIXI.DisplayObject#mask - The mask applied to this DisplayObject. Set to `null` to remove an existing mask.
* @type {PIXIGraphics}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 675
*/
/**
* @description Sets the filters for this DisplayObject. This is a WebGL only feature, and is ignored by the Canvas
Renderer. A filter is a shader applied to this DisplayObject. You can modify the placement of the filter
using `DisplayObject.filterArea`.

To remove filters, set this property to `null`.

Note: You cannot have a filter set, and a MULTIPLY Blend Mode active, at the same time. Setting a 
filter will reset this DisplayObjects blend mode to NORMAL.
* @member PIXI.PIXI.DisplayObject#filters - An Array of Phaser.Filter objects, or objects that extend them.
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 710
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
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObject.js
* @sourceline 763
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 1
*/
/**
* @class PIXI.DisplayObjectContainer
* @description A DisplayObjectContainer represents a collection of display objects.
It is the base class of all display objects that act as a container for other objects.
* @augments DisplayObject
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 5
*/
/**
* @description [read-only] The array of children of this container.
* @member PIXI.DisplayObjectContainer#children
* @type {Array<DisplayObject>}
* @readonly 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 17
*/
/**
* @description If `ignoreChildInput`  is `false` it will allow this objects _children_ to be considered as valid for Input events.

If this property is `true` then the children will _not_ be considered as valid for Input events.

Note that this property isn't recursive: only immediate children are influenced, it doesn't scan further down.
* @member PIXI.DisplayObjectContainer#ignoreChildInput
* @type {Boolean}
* @default 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 26
*/
/**
* @description Adds a child to the container.
* @method PIXI.DisplayObjectContainer#addChild
* @param {DisplayObject} child - The DisplayObject to add to the container
* @return {DisplayObject} The child that was added.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 42
*/
/**
* @description Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
* @method PIXI.DisplayObjectContainer#addChildAt
* @param {DisplayObject} child - The child to add
* @param {Number} index - The index to place the child in
* @return {DisplayObject} The child that was added.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 55
*/
/**
* @description Swaps the position of 2 Display Objects within this container.
* @method PIXI.DisplayObjectContainer#swapChildren
* @param {DisplayObject} child - 
* @param {DisplayObject} child2 - 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 85
*/
/**
* @description Returns the index position of a child DisplayObject instance
* @method PIXI.DisplayObjectContainer#getChildIndex
* @param {DisplayObject} child - The DisplayObject instance to identify
* @return {Number} The index position of the child display object to identify
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 112
*/
/**
* @description Changes the position of an existing child in the display object container
* @method PIXI.DisplayObjectContainer#setChildIndex
* @param {DisplayObject} child - The child DisplayObject instance for which you want to change the index number
* @param {Number} index - The resulting index number for the child display object
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 132
*/
/**
* @description Returns the child at the specified index
* @method PIXI.DisplayObjectContainer#getChildAt
* @param {Number} index - The index to get the child from
* @return {DisplayObject} The child at the given index, if any.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 153
*/
/**
* @description Removes a child from the container.
* @method PIXI.DisplayObjectContainer#removeChild
* @param {DisplayObject} child - The DisplayObject to remove
* @return {DisplayObject} The child that was removed.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 171
*/
/**
* @description Removes a child from the specified index position.
* @method PIXI.DisplayObjectContainer#removeChildAt
* @param {Number} index - The index to get the child from
* @return {DisplayObject} The child that was removed.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 191
*/
/**
* @description Removes all children from this container that are within the begin and end indexes.
* @method PIXI.DisplayObjectContainer#removeChildren
* @param {Number} beginIndex - The beginning position. Default value is 0.
* @param {Number} endIndex - The ending position. Default value is size of the container.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 213
*/
/**
* @description Retrieves the global bounds of the displayObjectContainer as a rectangle. The bounds calculation takes all visible children into consideration.
* @method PIXI.DisplayObjectContainer#getBounds
* @param {(PIXIDisplayObject|PIXIMatrix)} [targetCoordinateSpace] - Returns a rectangle that defines the area of the display object relative to the coordinate system of the targetCoordinateSpace object.
* @return {Rectangle} The rectangular bounding area
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 280
*/
/**
* @description Retrieves the non-global local bounds of the displayObjectContainer as a rectangle without any transformations. The calculation takes all visible children into consideration.
* @method PIXI.DisplayObjectContainer#getLocalBounds
* @return {Rectangle} The rectangular bounding area
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 437
*/
/**
* @description Determines whether the specified display object is a child of the DisplayObjectContainer instance or the instance itself.
* @method PIXI.DisplayObjectContainer#contains
* @param {DisplayObject} child - 
* @return {Boolean} 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 449
*/
/**
* @description Renders the object using the WebGL renderer
* @method PIXI.DisplayObjectContainer#_renderWebGL
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 472
*/
/**
* @description Renders the object using the Canvas renderer
* @method PIXI.DisplayObjectContainer#_renderCanvas
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 534
*/
/**
* @description The width of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
* @member PIXI.DisplayObjectContainer#width
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 571
*/
/**
* @description The height of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
* @member PIXI.DisplayObjectContainer#height
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/DisplayObjectContainer.js
* @sourceline 600
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 1
*/
/**
* @class PIXI.Sprite
* @description The Sprite object is the base for all textured objects that are rendered to the screen
* @augments PIXI.DisplayObjectContainer
* @param {PIXI.Texture} texture - The texture for this sprite
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 5
*/
/**
* @description The anchor sets the origin point of the texture.
The default is 0,0 this means the texture's origin is the top left
Setting than anchor to 0.5,0.5 means the textures origin is centered
Setting the anchor to 1,1 would mean the textures origin points will be the bottom right corner
* @member PIXI.Sprite#anchor
* @type {Point}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 17
*/
/**
* @description The texture that the sprite is using
* @member PIXI.Sprite#texture
* @type {PIXI.Texture}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 28
*/
/**
* @description The width of the sprite (this is initially set by the texture)
* @member PIXI.Sprite#_width
* @type {Number}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 36
*/
/**
* @description The height of the sprite (this is initially set by the texture)
* @member PIXI.Sprite#_height
* @type {Number}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 45
*/
/**
* @description The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
* @member PIXI.Sprite#tint
* @type {Number}
* @default 0xFFFFFF
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 54
*/
/**
* @description The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
* @member PIXI.Sprite#cachedTint
* @type {Number}
* @default -1
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 63
*/
/**
* @description A canvas that contains the tinted version of the Sprite (in Canvas mode, WebGL doesn't populate this)
* @member PIXI.Sprite#tintedTexture
* @type {Canvas}
* @default null
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 73
*/
/**
* @description The blend mode to be applied to the sprite. Set to PIXI.blendModes.NORMAL to remove any blend mode.

Warning: You cannot have a blend mode and a filter active on the same Sprite. Doing so will render the sprite invisible.
* @member PIXI.Sprite#blendMode
* @type {Number}
* @default PIXI.blendModes.NORMAL;
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 82
*/
/**
* @description The shader that will be used to render this Sprite.
Set to null to remove a current shader.
* @member PIXI.Sprite#shader
* @type {PhaserFilter}
* @default null
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 93
*/
/**
* @description Controls if this Sprite is processed by the core Phaser game loops and Group loops.
* @member PIXI.Sprite#exists
* @type {Boolean}
* @default true
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 103
*/
/**
* @description The width of the sprite, setting this will actually modify the scale to achieve the value set
* @member PIXI.Sprite#width
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 125
*/
/**
* @description The height of the sprite, setting this will actually modify the scale to achieve the value set
* @member PIXI.Sprite#height
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 144
*/
/**
* @description Sets the texture of the sprite. Be warned that this doesn't remove or destroy the previous
texture this Sprite was using.
* @method PIXI.Sprite#setTexture
* @param {PIXI.Texture} texture - The PIXI texture that is displayed by the sprite
* @param {Boolean} [destroy=false] - Call Texture.destroy on the current texture before replacing it with the new one?
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 163
*/
/**
* @description When the texture is updated, this event will fire to update the scale and frame
* @method PIXI.Sprite#onTextureUpdate
* @param {} event - 
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 185
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
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 199
*/
/**
* @description Retrieves the non-global local bounds of the Sprite as a rectangle. The calculation takes all visible children into consideration.
* @method PIXI.Sprite#getLocalBounds
* @return {Rectangle} The rectangular bounding area
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 315
*/
/**
* @description Renders the object using the WebGL renderer
* @method PIXI.Sprite#_renderWebGL
* @param {RenderSession} renderSession - 
* @param {Matrix} [matrix] - - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 345
*/
/**
* @description Renders the object using the Canvas renderer
* @method PIXI.Sprite#_renderCanvas
* @param {RenderSession} renderSession - 
* @param {Matrix} [matrix] - - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/display/Sprite.js
* @sourceline 415
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasBuffer.js
* @sourceline 1
*/
/**
* @class PIXI.CanvasBuffer
* @description Creates a Canvas element of the given size.
* @param {Number} width - the width for the newly created canvas
* @param {Number} height - the height for the newly created canvas
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasBuffer.js
* @sourceline 5
*/
/**
* @description The width of the Canvas in pixels.
* @member PIXI.CanvasBuffer#width
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasBuffer.js
* @sourceline 15
*/
/**
* @description The height of the Canvas in pixels.
* @member PIXI.CanvasBuffer#height
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasBuffer.js
* @sourceline 23
*/
/**
* @description The Canvas object that belongs to this CanvasBuffer.
* @member PIXI.CanvasBuffer#canvas
* @type {HTMLCanvasElement}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasBuffer.js
* @sourceline 31
*/
/**
* @description A CanvasRenderingContext2D object representing a two-dimensional rendering context.
* @member PIXI.CanvasBuffer#context
* @type {CanvasRenderingContext2D}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasBuffer.js
* @sourceline 39
*/
/**
* @description Clears the canvas that was created by the CanvasBuffer class.
* @method PIXI.CanvasBuffer#clear
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasBuffer.js
* @sourceline 53
*/
/**
* @description Resizes the canvas to the specified width and height.
* @method PIXI.CanvasBuffer#resize
* @param {Number} width - the new width of the canvas
* @param {Number} height - the new height of the canvas
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasBuffer.js
* @sourceline 65
*/
/**
* @description Frees the canvas up for use again.
* @method PIXI.CanvasBuffer#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasBuffer.js
* @sourceline 78
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasMaskManager.js
* @sourceline 1
*/
/**
* @class PIXI.CanvasMaskManager
* @description A set of functions used to handle masking.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasMaskManager.js
* @sourceline 5
*/
/**
* @description This method adds it to the current stack of masks.
* @method PIXI.CanvasMaskManager#pushMask
* @param {Object} maskData - the maskData that will be pushed
* @param {Object} renderSession - The renderSession whose context will be used for this mask manager.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasMaskManager.js
* @sourceline 17
*/
/**
* @description Restores the current drawing context to the state it was before the mask was applied.
* @method PIXI.CanvasMaskManager#popMask
* @param {Object} renderSession - The renderSession whose context will be used for this mask manager.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasMaskManager.js
* @sourceline 49
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasTinter.js
* @sourceline 1
*/
/**
* @class PIXI.CanvasTinter
* @description Utility methods for Sprite/Texture tinting.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasTinter.js
* @sourceline 5
*/
/**
* @description Basically this method just needs a sprite and a color and tints the sprite with the given color.
* @method PIXI.CanvasTinter.getTintedTexture
* @param {PIXI.Sprite} sprite - the sprite to tint
* @param {Number} color - the color to use to tint the sprite with
* @return {HTMLCanvasElement} The tinted canvas
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasTinter.js
* @sourceline 13
*/
/**
* @description Tint a texture using the "multiply" operation.
* @method PIXI.CanvasTinter.tintWithMultiply
* @param {PIXI.Texture} texture - the texture to tint
* @param {Number} color - the color to use to tint the sprite with
* @param {HTMLCanvasElement} canvas - the current canvas
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasTinter.js
* @sourceline 31
*/
/**
* @description Tint a texture pixel per pixel.
* @method PIXI.CanvasTinter.tintPerPixel
* @param {PIXI.Texture} texture - the texture to tint
* @param {Number} color - the color to use to tint the sprite with
* @param {HTMLCanvasElement} canvas - the current canvas
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/utils/CanvasTinter.js
* @sourceline 73
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasGraphics.js
* @sourceline 1
*/
/**
* @class PIXI.CanvasGraphics
* @description A set of functions used by the canvas renderer to draw the primitive graphics data.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasGraphics.js
* @sourceline 6
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 1
*/
/**
* @class PIXI.CanvasRenderer
* @description The CanvasRenderer draws the Stage and all its content onto a 2d canvas. This renderer should be used for browsers that do not support webGL.
Don't forget to add the CanvasRenderer.view to your DOM or you will not see anything :)
* @param {PhaserGame} game - A reference to the Phaser Game instance
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 5
*/
/**
* @member PIXI.CanvasRenderer#game - A reference to the Phaser Game instance.
* @type {PhaserGame}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 15
*/
/**
* @description The renderer type.
* @member PIXI.CanvasRenderer#type
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 25
*/
/**
* @description The resolution of the canvas.
* @member PIXI.CanvasRenderer#resolution
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
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
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 41
*/
/**
* @description Whether the render view is transparent
* @member PIXI.CanvasRenderer#transparent
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 53
*/
/**
* @description Whether the render view should be resized automatically
* @member PIXI.CanvasRenderer#autoResize
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 61
*/
/**
* @description The width of the canvas view
* @member PIXI.CanvasRenderer#width
* @type {Number}
* @default 800
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 69
*/
/**
* @description The height of the canvas view
* @member PIXI.CanvasRenderer#height
* @type {Number}
* @default 600
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 78
*/
/**
* @description The canvas element that everything is drawn to.
* @member PIXI.CanvasRenderer#view
* @type {HTMLCanvasElement}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 87
*/
/**
* @description The canvas 2d context that everything is drawn with
* @member PIXI.CanvasRenderer#context
* @type {CanvasRenderingContext2D}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 95
*/
/**
* @description Boolean flag controlling canvas refresh.
* @member PIXI.CanvasRenderer#refresh
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 102
*/
/**
* @description Internal var.
* @member PIXI.CanvasRenderer#count
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 110
*/
/**
* @description Instance of a PIXI.CanvasMaskManager, handles masking when using the canvas renderer
* @member PIXI.CanvasRenderer#CanvasMaskManager
* @type {PIXI.CanvasMaskManager}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 118
*/
/**
* @description The render session is just a bunch of parameter used for rendering
* @member PIXI.CanvasRenderer#renderSession
* @type {Object}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 125
*/

/**
* @description Renders the DisplayObjectContainer, usually the Phaser.Stage, to this canvas view.
* @method PIXI.CanvasRenderer#render
* @param {(PhaserStage|PIXIDisplayObjectContainer)} root - The root element to be rendered.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 152
*/
/**
* @description Removes everything from the renderer and optionally removes the Canvas DOM element.
* @method PIXI.CanvasRenderer#destroy
* @param {Boolean} [removeView=true] - Removes the Canvas element from the DOM.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 201
*/
/**
* @description Resizes the canvas view to the specified width and height
* @method PIXI.CanvasRenderer#resize
* @param {Number} width - the new width of the canvas view
* @param {Number} height - the new height of the canvas view
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 223
*/
/**
* @description Renders a display object
* @method PIXI.CanvasRenderer#renderDisplayObject
* @param {DisplayObject} displayObject - The displayObject to render
* @param {CanvasRenderingContext2D} context - the context 2d method of the canvas
* @param {Matrix} [matrix] - Optional matrix to apply to the display object before rendering.
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 251
*/
/**
* @description Maps Pixi blend modes to canvas blend modes.
* @method PIXI.CanvasRenderer#mapBlendModes
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/canvas/CanvasRenderer.js
* @sourceline 268
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/ComplexPrimitiveShader.js
* @sourceline 1
*/
/**
* @class PIXI.ComplexPrimitiveShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/ComplexPrimitiveShader.js
* @sourceline 5
*/
/**
* @member PIXI.ComplexPrimitiveShader#_UID
* @type {Number}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/ComplexPrimitiveShader.js
* @sourceline 12
*/
/**
* @member PIXI.ComplexPrimitiveShader#gl
* @type {WebGLContext}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/ComplexPrimitiveShader.js
* @sourceline 19
*/
/**
* @description The WebGL program.
* @member PIXI.ComplexPrimitiveShader#program
* @type {}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/ComplexPrimitiveShader.js
* @sourceline 25
*/
/**
* @description The fragment shader.
* @member PIXI.ComplexPrimitiveShader#fragmentSrc
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/ComplexPrimitiveShader.js
* @sourceline 32
*/
/**
* @description The vertex shader.
* @member PIXI.ComplexPrimitiveShader#vertexSrc
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/ComplexPrimitiveShader.js
* @sourceline 48
*/
/**
* @description Initialises the shader.
* @method PIXI.ComplexPrimitiveShader#init
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/ComplexPrimitiveShader.js
* @sourceline 79
*/
/**
* @description Destroys the shader.
* @method PIXI.ComplexPrimitiveShader#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/ComplexPrimitiveShader.js
* @sourceline 110
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiFastShader.js
* @sourceline 1
*/
/**
* @class PIXI.PixiFastShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiFastShader.js
* @sourceline 5
*/
/**
* @member PIXI.PixiFastShader#_UID
* @type {Number}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiFastShader.js
* @sourceline 11
*/
/**
* @member PIXI.PixiFastShader#gl
* @type {WebGLContext}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiFastShader.js
* @sourceline 18
*/
/**
* @description The WebGL program.
* @member PIXI.PixiFastShader#program
* @type {}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiFastShader.js
* @sourceline 24
*/
/**
* @description The fragment shader.
* @member PIXI.PixiFastShader#fragmentSrc
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiFastShader.js
* @sourceline 42
*/
/**
* @description The vertex shader.
* @member PIXI.PixiFastShader#vertexSrc
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiFastShader.js
* @sourceline 75
*/
/**
* @description A local texture counter for multi-texture shaders.
* @member PIXI.PixiFastShader#textureCount
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiFastShader.js
* @sourceline 114
*/
/**
* @description Initialises the shader.
* @method PIXI.PixiFastShader#init
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiFastShader.js
* @sourceline 126
*/
/**
* @description Destroys the shader.
* @method PIXI.PixiFastShader#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiFastShader.js
* @sourceline 201
*/
/**
* @fileoverview
* @author Richard Davey http://www.photonstorm.com @photonstorm
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 1
*/
/**
* @class PIXI.PixiShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 6
*/
/**
* @member PIXI.PixiShader#_UID
* @type {Number}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 13
*/
/**
* @member PIXI.PixiShader#gl
* @type {WebGLContext}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 20
*/
/**
* @description The WebGL program.
* @member PIXI.PixiShader#program
* @type {}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 26
*/
/**
* @description The fragment shader.
* @member PIXI.PixiShader#fragmentSrc
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 33
*/
/**
* @description A local texture counter for multi-texture shaders.
* @member PIXI.PixiShader#textureCount
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 40
*/
/**
* @description A local flag
* @member PIXI.PixiShader#firstRun
* @type {Boolean}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 47
*/
/**
* @description A dirty flag
* @member PIXI.PixiShader#dirty
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 55
*/
/**
* @description Uniform attributes cache.
* @member PIXI.PixiShader#attributes
* @type {Array}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 62
*/
/**
* @description Initialises the shader.
* @method PIXI.PixiShader#init
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 218
*/
/**
* @description Initialises the shader uniform values.

Uniforms are specified in the GLSL_ES Specification: http://www.khronos.org/registry/webgl/specs/latest/1.0/
http://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf
* @method PIXI.PixiShader#initUniforms
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 232
*/
/**
* @description Initialises a Sampler2D uniform (which may only be available later on after initUniforms once the texture has loaded)
* @method PIXI.PixiShader#initSampler2D
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 306
*/
/**
* @description Updates the shader uniform values.
* @method PIXI.PixiShader#syncUniforms
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 382
*/
/**
* @description Destroys the shader.
* @method PIXI.PixiShader#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 449
*/
/**
* @description The Default Vertex shader source.
* @member PIXI.PixiShader#defaultVertexSrc
* @type {String}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PixiShader.js
* @sourceline 463
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PrimitiveShader.js
* @sourceline 1
*/
/**
* @class PIXI.PrimitiveShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PrimitiveShader.js
* @sourceline 5
*/
/**
* @member PIXI.PrimitiveShader#_UID
* @type {Number}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PrimitiveShader.js
* @sourceline 12
*/
/**
* @member PIXI.PrimitiveShader#gl
* @type {WebGLContext}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PrimitiveShader.js
* @sourceline 19
*/
/**
* @description The WebGL program.
* @member PIXI.PrimitiveShader#program
* @type {}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PrimitiveShader.js
* @sourceline 25
*/
/**
* @description The fragment shader.
* @member PIXI.PrimitiveShader#fragmentSrc
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PrimitiveShader.js
* @sourceline 32
*/
/**
* @description The vertex shader.
* @member PIXI.PrimitiveShader#vertexSrc
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PrimitiveShader.js
* @sourceline 46
*/
/**
* @description Initialises the shader.
* @method PIXI.PrimitiveShader#init
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PrimitiveShader.js
* @sourceline 75
*/
/**
* @description Destroys the shader.
* @method PIXI.PrimitiveShader#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/PrimitiveShader.js
* @sourceline 105
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/StripShader.js
* @sourceline 1
*/
/**
* @class PIXI.StripShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/StripShader.js
* @sourceline 5
*/
/**
* @member PIXI.StripShader#_UID
* @type {Number}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/StripShader.js
* @sourceline 12
*/
/**
* @member PIXI.StripShader#gl
* @type {WebGLContext}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/StripShader.js
* @sourceline 19
*/
/**
* @description The WebGL program.
* @member PIXI.StripShader#program
* @type {}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/StripShader.js
* @sourceline 25
*/
/**
* @description The fragment shader.
* @member PIXI.StripShader#fragmentSrc
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/StripShader.js
* @sourceline 44
*/
/**
* @description The fragment shader.
* @member PIXI.StripShader#fragmentSrc
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/StripShader.js
* @sourceline 65
*/
/**
* @description The vertex shader.
* @member PIXI.StripShader#vertexSrc
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/StripShader.js
* @sourceline 84
*/
/**
* @description Initialises the shader.
* @method PIXI.StripShader#init
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/StripShader.js
* @sourceline 118
*/
/**
* @description Destroys the shader.
* @method PIXI.StripShader#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/shaders/StripShader.js
* @sourceline 169
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/FilterTexture.js
* @sourceline 1
*/
/**
* @class PIXI.FilterTexture
* @param {WebGLContext} gl - the current WebGL drawing context
* @param {Number} width - the horizontal range of the filter
* @param {Number} height - the vertical range of the filter
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/FilterTexture.js
* @sourceline 46
*/
/**
* @member PIXI.FilterTexture#gl
* @type {WebGLContext}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/FilterTexture.js
* @sourceline 57
*/
/**
* @member PIXI.FilterTexture#frameBuffer
* @type {}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/FilterTexture.js
* @sourceline 64
*/
/**
* @member PIXI.FilterTexture#texture
* @type {}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/FilterTexture.js
* @sourceline 69
*/
/**
* @description Clears the filter texture.
* @method PIXI.FilterTexture#clear
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/FilterTexture.js
* @sourceline 81
*/
/**
* @description Resizes the texture to the specified width and height
* @method PIXI.FilterTexture#resize
* @param {Number} width - the new width of the texture
* @param {Number} height - the new height of the texture
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/FilterTexture.js
* @sourceline 94
*/
/**
* @description Destroys the filter texture.
* @method PIXI.FilterTexture#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/FilterTexture.js
* @sourceline 116
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLBlendModeManager.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLBlendModeManager
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLBlendModeManager.js
* @sourceline 5
*/
/**
* @member PIXI.WebGLBlendModeManager#currentBlendMode
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLBlendModeManager.js
* @sourceline 12
*/
/**
* @description Sets the WebGL Context.
* @method PIXI.WebGLBlendModeManager#setContext
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLBlendModeManager.js
* @sourceline 21
*/
/**
* @description Sets-up the given blendMode from WebGL's point of view.
* @method PIXI.WebGLBlendModeManager#setBlendMode
* @param {Number} blendMode - the blendMode, should be a Pixi const, such as PIXI.BlendModes.ADD
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLBlendModeManager.js
* @sourceline 32
*/
/**
* @description Destroys this object.
* @method PIXI.WebGLBlendModeManager#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLBlendModeManager.js
* @sourceline 54
*/
/**
* @fileoverview
* @author Mat Groves

Big thanks to the very clever Matt DesLauriers <mattdesl> https://github.com/mattdesl/
for creating the original pixi version!

Heavily inspired by LibGDX's WebGLSpriteBatch:
https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/WebGLSpriteBatch.java
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLFastSpriteBatch
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 11
*/
/**
* @member PIXI.WebGLFastSpriteBatch#vertSize
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 18
*/
/**
* @member PIXI.WebGLFastSpriteBatch#maxSize
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 24
*/
/**
* @member PIXI.WebGLFastSpriteBatch#size
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 30
*/
/**
* @description Vertex data
* @member PIXI.WebGLFastSpriteBatch#vertices
* @type {Float32Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 42
*/
/**
* @description Index data
* @member PIXI.WebGLFastSpriteBatch#indices
* @type {Uint16Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 49
*/
/**
* @member PIXI.WebGLFastSpriteBatch#vertexBuffer
* @type {Object}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 56
*/
/**
* @member PIXI.WebGLFastSpriteBatch#indexBuffer
* @type {Object}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 62
*/
/**
* @member PIXI.WebGLFastSpriteBatch#lastIndexCount
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 68
*/
/**
* @member PIXI.WebGLFastSpriteBatch#drawing
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 84
*/
/**
* @member PIXI.WebGLFastSpriteBatch#currentBatchSize
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 90
*/
/**
* @member PIXI.WebGLFastSpriteBatch#currentBaseTexture
* @type {PIXI.BaseTexture}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 96
*/
/**
* @member PIXI.WebGLFastSpriteBatch#currentBlendMode
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 102
*/
/**
* @member PIXI.WebGLFastSpriteBatch#renderSession
* @type {Object}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 108
*/
/**
* @member PIXI.WebGLFastSpriteBatch#shader
* @type {Object}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 114
*/
/**
* @member PIXI.WebGLFastSpriteBatch#matrix
* @type {Matrix}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 120
*/
/**
* @description Sets the WebGL Context.
* @method PIXI.WebGLFastSpriteBatch#setContext
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 131
*/
/**
* @method PIXI.WebGLFastSpriteBatch#begin
* @param {PIXI.WebGLSpriteBatch} spriteBatch - 
* @param {Object} renderSession - 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 155
*/
/**
* @method PIXI.WebGLFastSpriteBatch#end
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 170
*/
/**
* @method PIXI.WebGLFastSpriteBatch#render
* @param {PIXI.WebGLSpriteBatch} spriteBatch - 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 178
*/
/**
* @method PIXI.WebGLFastSpriteBatch#renderSprite
* @param {PIXI.Sprite} sprite - 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 209
*/
/**
* @method PIXI.WebGLFastSpriteBatch#flush
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 360
*/
/**
* @method PIXI.WebGLFastSpriteBatch#stop
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 403
*/
/**
* @method PIXI.WebGLFastSpriteBatch#start
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js
* @sourceline 411
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFilterManager.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLFilterManager
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFilterManager.js
* @sourceline 5
*/
/**
* @member PIXI.WebGLFilterManager#filterStack
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFilterManager.js
* @sourceline 11
*/
/**
* @member PIXI.WebGLFilterManager#offsetX
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFilterManager.js
* @sourceline 17
*/
/**
* @member PIXI.WebGLFilterManager#offsetY
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFilterManager.js
* @sourceline 23
*/
/**
* @description Initialises the context and the properties.
* @method PIXI.WebGLFilterManager#setContext
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFilterManager.js
* @sourceline 32
*/
/**
* @method PIXI.WebGLFilterManager#begin
* @param {RenderSession} renderSession - 
* @param {ArrayBuffer} buffer - 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFilterManager.js
* @sourceline 46
*/
/**
* @description Applies the filter and adds it to the current filter stack.
* @method PIXI.WebGLFilterManager#pushFilter
* @param {Object} filterBlock - the filter that will be pushed to the current filter stack
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFilterManager.js
* @sourceline 62
*/
/**
* @description Removes the last filter from the filter stack and doesn't return it.
* @method PIXI.WebGLFilterManager#popFilter
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFilterManager.js
* @sourceline 145
*/
/**
* @description Applies the filter to the specified area.
* @method PIXI.WebGLFilterManager#applyFilterPass
* @param {PhaserFilter} filter - the filter that needs to be applied
* @param {PIXI.Texture} filterArea - TODO - might need an update
* @param {Number} width - the horizontal range of the filter
* @param {Number} height - the vertical range of the filter
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFilterManager.js
* @sourceline 336
*/
/**
* @description Initialises the shader buffers.
* @method PIXI.WebGLFilterManager#initShaderBuffers
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFilterManager.js
* @sourceline 397
*/
/**
* @description Destroys the filter and removes it from the filter stack.
* @method PIXI.WebGLFilterManager#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLFilterManager.js
* @sourceline 445
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLGraphics.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLGraphics
* @description A set of functions used by the webGL renderer to draw the primitive graphics data
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLGraphics.js
* @sourceline 5
*/

/**
* @description Renders the graphics object
* @method PIXI.WebGLGraphics.renderGraphics
* @param {Graphics} graphics - 
* @param {Object} renderSession - 
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLGraphics.js
* @sourceline 23
*/
/**
* @description Updates the graphics object
* @method PIXI.WebGLGraphics.updateGraphics
* @param {Graphics} graphicsData - The graphics object to update
* @param {WebGLContext} gl - the current WebGL drawing context
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLGraphics.js
* @sourceline 93
*/
/**
* @method PIXI.WebGLGraphics.switchMode
* @param {WebGLContext} webGL - 
* @param {Number} type - 
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLGraphics.js
* @sourceline 218
*/
/**
* @description Builds a rectangle to draw
* @method PIXI.WebGLGraphics.buildRectangle
* @param {Graphics} graphicsData - The graphics object containing all the necessary properties
* @param {Object} webGLData - 
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLGraphics.js
* @sourceline 252
*/
/**
* @description Builds a rounded rectangle to draw
* @method PIXI.WebGLGraphics.buildRoundedRectangle
* @param {Graphics} graphicsData - The graphics object containing all the necessary properties
* @param {Object} webGLData - 
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLGraphics.js
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
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLGraphics.js
* @sourceline 390
*/
/**
* @description Builds a circle to draw
* @method PIXI.WebGLGraphics.buildCircle
* @param {Graphics} graphicsData - The graphics object to draw
* @param {Object} webGLData - 
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLGraphics.js
* @sourceline 442
*/
/**
* @description Builds a line to draw
* @method PIXI.WebGLGraphics.buildLine
* @param {Graphics} graphicsData - The graphics object containing all the necessary properties
* @param {Object} webGLData - 
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLGraphics.js
* @sourceline 525
*/
/**
* @description Builds a complex polygon to draw
* @method PIXI.WebGLGraphics.buildComplexPoly
* @param {Graphics} graphicsData - The graphics object containing all the necessary properties
* @param {Object} webGLData - 
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLGraphics.js
* @sourceline 737
*/
/**
* @description Builds a polygon to draw
* @method PIXI.WebGLGraphics.buildPoly
* @param {Graphics} graphicsData - The graphics object containing all the necessary properties
* @param {Object} webGLData - 
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLGraphics.js
* @sourceline 799
*/
/**
* @class PIXI.WebGLGraphicsData
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLGraphics.js
* @sourceline 854
*/
/**
* @method PIXI.WebGLGraphicsData#reset
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLGraphics.js
* @sourceline 874
*/
/**
* @method PIXI.WebGLGraphicsData#upload
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLGraphics.js
* @sourceline 883
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLMaskManager.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLMaskManager
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLMaskManager.js
* @sourceline 5
*/
/**
* @description Sets the drawing context to the one given in parameter.
* @method PIXI.WebGLMaskManager#setContext
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLMaskManager.js
* @sourceline 16
*/
/**
* @description Applies the Mask and adds it to the current filter stack.
* @method PIXI.WebGLMaskManager#pushMask
* @param {Array} maskData - 
* @param {Object} renderSession - 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLMaskManager.js
* @sourceline 27
*/
/**
* @description Removes the last filter from the filter stack and doesn't return it.
* @method PIXI.WebGLMaskManager#popMask
* @param {Array} maskData - 
* @param {Object} renderSession - an object containing all the useful parameters
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLMaskManager.js
* @sourceline 51
*/
/**
* @description Destroys the mask stack.
* @method PIXI.WebGLMaskManager#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLMaskManager.js
* @sourceline 71
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderManager.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLShaderManager
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderManager.js
* @sourceline 5
*/
/**
* @member PIXI.WebGLShaderManager#maxAttibs
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderManager.js
* @sourceline 12
*/
/**
* @member PIXI.WebGLShaderManager#attribState
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderManager.js
* @sourceline 18
*/
/**
* @member PIXI.WebGLShaderManager#tempAttribState
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderManager.js
* @sourceline 24
*/
/**
* @member PIXI.WebGLShaderManager#stack
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderManager.js
* @sourceline 35
*/
/**
* @description Initialises the context and the properties.
* @method PIXI.WebGLShaderManager#setContext
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderManager.js
* @sourceline 45
*/
/**
* @description Takes the attributes given in parameters.
* @method PIXI.WebGLShaderManager#setAttribs
* @param {Array} attribs - attribs
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderManager.js
* @sourceline 73
*/
/**
* @description Sets the current shader.
* @method PIXI.WebGLShaderManager#setShader
* @param {} shader - 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderManager.js
* @sourceline 116
*/
/**
* @description Destroys this object.
* @method PIXI.WebGLShaderManager#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderManager.js
* @sourceline 136
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderUtils.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLSpriteBatch
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 12
*/
/**
* @method PIXI.WebGLSpriteBatch.initDefaultShaders
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderUtils.js
* @sourceline 5
*/
/**
* @method PIXI.WebGLSpriteBatch.CompileVertexShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @param {Array} shaderSrc - 
* @return {} 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderUtils.js
* @sourceline 14
*/
/**
* @method PIXI.WebGLSpriteBatch.CompileFragmentShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @param {Array} shaderSrc - 
* @return {} 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderUtils.js
* @sourceline 26
*/
/**
* @method PIXI.WebGLSpriteBatch._CompileShader
* @param {WebGLContext} gl - the current WebGL drawing context
* @param {Array} shaderSrc - 
* @param {Number} shaderType - 
* @return {} 
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderUtils.js
* @sourceline 38
*/
/**
* @method PIXI.WebGLSpriteBatch.compileProgram
* @param {WebGLContext} gl - the current WebGL drawing context
* @param {Array} vertexSrc - 
* @param {Array} fragmentSrc - 
* @return {} 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLShaderUtils.js
* @sourceline 69
*/

/**
* @member PIXI.WebGLSpriteBatch#game - A reference to the currently running game.
* @type {PhaserGame}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 20
*/
/**
* @member PIXI.WebGLSpriteBatch#vertSize
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 25
*/
/**
* @description The number of images in the SpriteBatch before it flushes
* @member PIXI.WebGLSpriteBatch#size
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 31
*/
/**
* @description Holds the vertices
* @member PIXI.WebGLSpriteBatch#vertices
* @type {ArrayBuffer}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 48
*/
/**
* @description View on the vertices as a Float32Array
* @member PIXI.WebGLSpriteBatch#positions
* @type {Float32Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 56
*/
/**
* @description View on the vertices as a Uint32Array
* @member PIXI.WebGLSpriteBatch#colors
* @type {Uint32Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 64
*/
/**
* @description Holds the indices
* @member PIXI.WebGLSpriteBatch#indices
* @type {Uint16Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 72
*/
/**
* @member PIXI.WebGLSpriteBatch#lastIndexCount
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 80
*/
/**
* @member PIXI.WebGLSpriteBatch#drawing
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 95
*/
/**
* @member PIXI.WebGLSpriteBatch#currentBatchSize
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 101
*/
/**
* @member PIXI.WebGLSpriteBatch#currentBaseTexture
* @type {PIXI.BaseTexture}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 107
*/
/**
* @member PIXI.WebGLSpriteBatch#dirty
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 113
*/
/**
* @member PIXI.WebGLSpriteBatch#textures
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 119
*/
/**
* @member PIXI.WebGLSpriteBatch#blendModes
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 125
*/
/**
* @member PIXI.WebGLSpriteBatch#shaders
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 131
*/
/**
* @member PIXI.WebGLSpriteBatch#sprites
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 137
*/
/**
* @member PIXI.WebGLSpriteBatch#defaultShader
* @type {PhaserFilter}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 143
*/
/**
* @method PIXI.WebGLSpriteBatch#setContext
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 150
*/
/**
* @method PIXI.WebGLSpriteBatch#begin
* @param {Object} renderSession - The RenderSession object
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 222
*/
/**
* @method PIXI.WebGLSpriteBatch#end
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 233
*/
/**
* @method PIXI.WebGLSpriteBatch#render
* @param {PIXI.Sprite} sprite - the sprite to render when using this spritebatch
* @param {Matrix} [matrix] - - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 240
*/
/**
* @description Renders a TilingSprite using the spriteBatch.
* @method PIXI.WebGLSpriteBatch#renderTilingSprite
* @param {TilingSprite} sprite - the sprite to render
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 410
*/
/**
* @description Renders the content and empties the current batch.
* @method PIXI.WebGLSpriteBatch#flush
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 550
*/
/**
* @method PIXI.WebGLSpriteBatch#renderBatch
* @param {PIXI.Texture} texture - 
* @param {Number} size - 
* @param {Number} startIndex - 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 689
*/
/**
* @method PIXI.WebGLSpriteBatch#stop
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 714
*/
/**
* @method PIXI.WebGLSpriteBatch#start
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 722
*/
/**
* @description Destroys the SpriteBatch.
* @method PIXI.WebGLSpriteBatch#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js
* @sourceline 729
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLStencilManager.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLStencilManager
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLStencilManager.js
* @sourceline 5
*/
/**
* @description Sets the drawing context to the one given in parameter.
* @method PIXI.WebGLStencilManager#setContext
* @param {WebGLContext} gl - the current WebGL drawing context
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLStencilManager.js
* @sourceline 17
*/
/**
* @description Applies the Mask and adds it to the current filter stack.
* @method PIXI.WebGLStencilManager#pushMask
* @param {Graphics} graphics - 
* @param {Array} webGLData - 
* @param {Object} renderSession - 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLStencilManager.js
* @sourceline 28
*/
/**
* @description TODO this does not belong here!
* @method PIXI.WebGLStencilManager#bindGraphics
* @param {Graphics} graphics - 
* @param {Array} webGLData - 
* @param {Object} renderSession - 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLStencilManager.js
* @sourceline 120
*/
/**
* @method PIXI.WebGLStencilManager#popStencil
* @param {Graphics} graphics - 
* @param {Array} webGLData - 
* @param {Object} renderSession - 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLStencilManager.js
* @sourceline 193
*/
/**
* @description Destroys the mask stack.
* @method PIXI.WebGLStencilManager#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/utils/WebGLStencilManager.js
* @sourceline 288
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 1
*/
/**
* @class PIXI.WebGLRenderer
* @description The WebGLRenderer draws the stage and all its content onto a webGL enabled canvas. This renderer
should be used for browsers that support webGL. This Render works by automatically managing webGLBatchs.
So no need for Sprite Batches or Sprite Clouds.
Don't forget to add the view to your DOM or you will not see anything :)
* @param {PhaserGame} game - A reference to the Phaser Game instance
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 9
*/
/**
* @member PIXI.WebGLRenderer#game - A reference to the Phaser Game instance.
* @type {PhaserGame}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 21
*/
/**
* @member PIXI.WebGLRenderer#type
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 33
*/
/**
* @description The resolution of the renderer
* @member PIXI.WebGLRenderer#resolution
* @type {Number}
* @default 1
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 39
*/
/**
* @description Whether the render view is transparent
* @member PIXI.WebGLRenderer#transparent
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 48
*/
/**
* @description Whether the render view should be resized automatically
* @member PIXI.WebGLRenderer#autoResize
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 56
*/
/**
* @description The value of the preserveDrawingBuffer flag affects whether or not the contents of the stencil buffer is retained after rendering.
* @member PIXI.WebGLRenderer#preserveDrawingBuffer
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 64
*/
/**
* @description This sets if the WebGLRenderer will clear the context texture or not before the new render pass. If true:
If the Stage is NOT transparent, Pixi will clear to alpha (0, 0, 0, 0).
If the Stage is transparent, Pixi will clear to the target Stage's background color.
Disable this by setting this to false. For example: if your game has a canvas filling background image, you often don't need this set.
* @member PIXI.WebGLRenderer#clearBeforeRender
* @type {Boolean}
* @default 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 72
*/
/**
* @description The width of the canvas view
* @member PIXI.WebGLRenderer#width
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 84
*/
/**
* @description The height of the canvas view
* @member PIXI.WebGLRenderer#height
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 92
*/
/**
* @description The canvas element that everything is drawn to
* @member PIXI.WebGLRenderer#view
* @type {HTMLCanvasElement}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 100
*/
/**
* @member PIXI.WebGLRenderer#_contextOptions
* @type {Object}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 108
*/
/**
* @member PIXI.WebGLRenderer#projection
* @type {Point}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 121
*/
/**
* @member PIXI.WebGLRenderer#offset
* @type {Point}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 127
*/
/**
* @description Deals with managing the shader programs and their attribs
* @member PIXI.WebGLRenderer#shaderManager
* @type {PIXI.WebGLShaderManager}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 135
*/
/**
* @description Manages the rendering of sprites
* @member PIXI.WebGLRenderer#spriteBatch
* @type {PIXI.WebGLSpriteBatch}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 142
*/
/**
* @description Manages the masks using the stencil buffer
* @member PIXI.WebGLRenderer#maskManager
* @type {PIXI.WebGLMaskManager}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 149
*/
/**
* @description Manages the filters
* @member PIXI.WebGLRenderer#filterManager
* @type {PIXI.WebGLFilterManager}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 156
*/
/**
* @description Manages the stencil buffer
* @member PIXI.WebGLRenderer#stencilManager
* @type {PIXI.WebGLStencilManager}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 163
*/
/**
* @description Manages the blendModes
* @member PIXI.WebGLRenderer#blendModeManager
* @type {PIXI.WebGLBlendModeManager}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 170
*/
/**
* @member PIXI.WebGLRenderer#renderSession
* @type {Object}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 177
*/
/**
* @member PIXI.WebGLRenderer#currentBatchedTextures
* @type {Array}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 183
*/
/**
* @method PIXI.WebGLRenderer#initContext
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 213
*/
/**
* @description If Multi Texture support has been enabled, then calling this method will enable batching on the given
textures. The texture collection is an array of keys, that map to Phaser.Cache image entries.

The number of textures that can be batched is dependent on hardware. If you provide more textures
than can be batched by the GPU, then only those at the start of the array will be used. Generally
you shouldn't provide more than 16 textures to this method. You can check the hardware limit via the
`maxTextures` property.

You can also check the property `currentBatchedTextures` at any time, to see which textures are currently
being batched.

To stop all textures from being batched, call this method again with an empty array.

To change the textures being batched, call this method with a new array of image keys. The old ones
will all be purged out and no-longer batched, and the new ones enabled.

Note: Throws a warning if you haven't enabled Multiple Texture batching support in the Phaser Game config.
* @method PIXI.WebGLRenderer#setTexturePriority
* @param {Array} textureNameCollection - An Array of Texture Cache keys to use for multi-texture batching.
* @return {Array} An array containing the texture keys that were enabled for batching.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 265
*/
/**
* @description Renders the stage to its webGL view
* @method PIXI.WebGLRenderer#render
* @param {Stage} stage - the Stage element to be rendered
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 344
*/
/**
* @description Renders a Display Object.
* @method PIXI.WebGLRenderer#renderDisplayObject
* @param {DisplayObject} displayObject - The DisplayObject to render
* @param {Point} projection - The projection
* @param {Array} buffer - a standard WebGL buffer
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 379
*/
/**
* @description Resizes the webGL view to the specified width and height.
* @method PIXI.WebGLRenderer#resize
* @param {Number} width - the new width of the webGL view
* @param {Number} height - the new height of the webGL view
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 416
*/
/**
* @description Updates and creates a WebGL compressed texture for the renderers context.
* @method PIXI.WebGLRenderer#updateCompressedTexture
* @param {PIXI.Texture} texture - the texture to update
* @return {Boolean} True if the texture was successfully bound, otherwise false.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 442
*/
/**
* @description Updates and Creates a WebGL texture for the renderers context.
* @method PIXI.WebGLRenderer#updateTexture
* @param {PIXI.Texture} texture - the texture to update
* @return {Boolean} True if the texture was successfully bound, otherwise false.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 501
*/
/**
* @description Removes everything from the renderer (event listeners, spritebatch, etc...)
* @method PIXI.WebGLRenderer#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 562
*/
/**
* @description Maps Pixi blend modes to WebGL blend modes.
* @method PIXI.WebGLRenderer#mapBlendModes
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/renderers/webgl/WebGLRenderer.js
* @sourceline 594
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 1
*/
/**
* @class PIXI.BaseTexture
* @description A texture stores the information that represents an image. All textures have a base texture.
* @param {(String|Canvas)} source - the source object (image or canvas)
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @param {Number} [resolution] - the resolution of the texture (for HiDPI displays)
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 5
*/
/**
* @description The Resolution of the texture.
* @member PIXI.BaseTexture#resolution
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 17
*/
/**
* @description [read-only] The width of the base texture set when the image has loaded
* @member PIXI.BaseTexture#width
* @type {Number}
* @readonly 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 25
*/
/**
* @description [read-only] The height of the base texture set when the image has loaded
* @member PIXI.BaseTexture#height
* @type {Number}
* @readonly 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 34
*/
/**
* @description The scale mode to apply when scaling this texture
* @member PIXI.BaseTexture#scaleMode
* @type {Number}
* @default PIXI.scaleModes.LINEAR
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 43
*/
/**
* @description [read-only] Set to true once the base texture has loaded
* @member PIXI.BaseTexture#hasLoaded
* @type {Boolean}
* @readonly 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 52
*/
/**
* @description The image source that is used to create the texture.
* @member PIXI.BaseTexture#source
* @type {Image}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 61
*/
/**
* @description Controls if RGB channels should be pre-multiplied by Alpha  (WebGL only)
* @member PIXI.BaseTexture#premultipliedAlpha
* @type {Boolean}
* @default true
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 69
*/
/**
* @member PIXI.BaseTexture#_glTextures
* @type {Array}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 80
*/
/**
* @description Set this to true if a mipmap of this texture needs to be generated. This value needs to be set before the texture is used
Also the texture must be a power of two size to work
* @member PIXI.BaseTexture#mipmap
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 87
*/
/**
* @description The multi texture batching index number.
* @member PIXI.BaseTexture#textureIndex
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 96
*/
/**
* @member PIXI.BaseTexture#_dirty
* @type {Array}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 103
*/
/**
* @description A BaseTexture can be set to skip the rendering phase in the WebGL Sprite Batch.

You may want to do this if you have a parent Sprite with no visible texture (i.e. uses the internal `__default` texture)
that has children that you do want to render, without causing a batch flush in the process.
* @member PIXI.BaseTexture#skipRender
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 123
*/
/**
* @member PIXI.BaseTexture#_powerOf2
* @type {Boolean}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 134
*/
/**
* @description Forces this BaseTexture to be set as loaded, with the given width and height.
Then calls BaseTexture.dirty.
Important for when you don't want to modify the source object by forcing in `complete` or dimension properties it may not have.
* @method PIXI.BaseTexture#forceLoaded
* @param {Number} width - - The new width to force the BaseTexture to be.
* @param {Number} height - - The new height to force the BaseTexture to be.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 145
*/
/**
* @description Destroys this base texture
* @method PIXI.BaseTexture#destroy
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 162
*/
/**
* @description Changes the source image of the texture
* @method PIXI.BaseTexture#updateSourceImage
* @param {String} newSrc - the path of the image
* @deprecated true
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 179
*/
/**
* @description Sets all glTextures to be dirty.
* @method PIXI.BaseTexture#dirty
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 191
*/
/**
* @description Removes the base texture from the GPU, useful for managing resources on the GPU.
Atexture is still 100% usable and will simply be reuploaded if there is a sprite on screen that is using it.
* @method PIXI.BaseTexture#unloadFromGPU
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 204
*/
/**
* @description Helper function that creates a base texture from the given canvas element.
* @method PIXI.BaseTexture.fromCanvas
* @param {Canvas} canvas - The canvas element source of the texture
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @param {Number} [resolution] - the resolution of the texture (for HiDPI displays)
* @return {PIXI.BaseTexture} 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/BaseTexture.js
* @sourceline 232
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
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
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 14
*/

/**
* @description Does this Texture have any frame data assigned to it?
* @member PIXI.Texture#noFrame
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 28
*/
/**
* @description The base texture that this texture uses.
* @member PIXI.Texture#baseTexture
* @type {PIXI.BaseTexture}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 47
*/
/**
* @description The frame specifies the region of the base texture that this texture uses
* @member PIXI.Texture#frame
* @type {Rectangle}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 55
*/
/**
* @description The texture trim data.
* @member PIXI.Texture#trim
* @type {Rectangle}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 63
*/
/**
* @description This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.
* @member PIXI.Texture#valid
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 71
*/
/**
* @description Is this a tiling texture? As used by the likes of a TilingSprite.
* @member PIXI.Texture#isTiling
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 79
*/
/**
* @description This will let a renderer know that a texture has been updated (used mainly for webGL uv updates)
* @member PIXI.Texture#requiresUpdate
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 87
*/
/**
* @description This will let a renderer know that a tinted parent has updated its texture.
* @member PIXI.Texture#requiresReTint
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 95
*/
/**
* @description The WebGL UV data cache.
* @member PIXI.Texture#_uvs
* @type {Object}
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 103
*/
/**
* @description The width of the Texture in pixels.
* @member PIXI.Texture#width
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 112
*/
/**
* @description The height of the Texture in pixels.
* @member PIXI.Texture#height
* @type {Number}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 120
*/
/**
* @description This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)
* @member PIXI.Texture#crop
* @type {Rectangle}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 128
*/
/**
* @description A flag that controls if this frame is rotated or not.
Rotation allows you to use rotated frames in texture atlas packing, it has nothing to do with
Sprite rotation.
* @member PIXI.Texture#rotated
* @type {Boolean}
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 137
*/
/**
* @description Called when the base texture is loaded
* @method PIXI.Texture#onBaseTextureLoaded
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 157
*/
/**
* @description Destroys this texture
* @method PIXI.Texture#destroy
* @param {Boolean} destroyBase - Whether to destroy the base texture as well
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 175
*/
/**
* @description Specifies the region of the baseTexture that this texture will use.
* @method PIXI.Texture#setFrame
* @param {Rectangle} frame - The frame of the texture to set it to
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 188
*/
/**
* @description Updates the internal WebGL UV cache.
* @method PIXI.Texture#_updateUvs
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 232
*/
/**
* @description Updates the internal WebGL UV cache.
* @method PIXI.Texture#_updateUvsInverted
* @access private
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 259
*/
/**
* @description Helper function that creates a new a Texture based on the given canvas element.
* @method PIXI.Texture.fromCanvas
* @param {Canvas} canvas - The canvas element source of the texture
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @return {PIXI.Texture} 
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/textures/Texture.js
* @sourceline 287
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/Intro.js
* @sourceline 1
*/
/**
* @class PIXI.PIXI
* @description Namespace-class for [pixi.js](http://www.pixijs.com/).

Contains assorted static properties and enumerations.
* @sourcefile /Users/Makkyla/phaser/v2-community/src/pixi/Pixi.js
* @sourceline 11
*/

