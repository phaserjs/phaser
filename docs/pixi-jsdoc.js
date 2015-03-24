/**
* @namespace PIXI
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 1
*/
/**
* @class PIXI.DisplayObject
* @description The base class for all objects that are rendered on the screen.
This is an abstract class and should not be used on its own rather it should be extended.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 5
*/
/**
* @description The coordinate of the object relative to the local coordinates of the parent.
* @member PIXI.DisplayObject#position
* @type {Point}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 14
*/
/**
* @description The scale factor of the object.
* @member PIXI.DisplayObject#scale
* @type {Point}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 22
*/
/**
* @description The transform callback is an optional callback that if set will be called at the end of the updateTransform method and sent two parameters:
This Display Objects worldTransform matrix and its parents transform matrix. Both are PIXI.Matrix object types.
The matrix are passed by reference and can be modified directly without needing to return them.
This ability allows you to check any of the matrix values and perform actions such as clamping scale or limiting rotation, regardless of the parent transforms.
* @member PIXI.DisplayObject#transformCallback
* @type {Function}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 30
*/
/**
* @description The context under which the transformCallback is invoked.
* @member PIXI.DisplayObject#transformCallbackContext
* @type {Object}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 41
*/
/**
* @description The pivot point of the displayObject that it rotates around
* @member PIXI.DisplayObject#pivot
* @type {Point}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 49
*/
/**
* @description The rotation of the object in radians.
* @member PIXI.DisplayObject#rotation
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 57
*/
/**
* @description The opacity of the object.
* @member PIXI.DisplayObject#alpha
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 65
*/
/**
* @description The visibility of the object.
* @member PIXI.DisplayObject#visible
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 73
*/
/**
* @description This is the defined area that will pick up mouse / touch events. It is null by default.
Setting it is a neat way of optimising the hitTest function that the interactionManager will use (as it will not need to hit test all the children)
* @member PIXI.DisplayObject#hitArea
* @type {(Rectangle|Circle|Ellipse|Polygon)}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 81
*/
/**
* @description Can this object be rendered
* @member PIXI.DisplayObject#renderable
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 90
*/
/**
* @description [read-only] The display object container that contains this display object.
* @member PIXI.DisplayObject#parent
* @type {PIXI.DisplayObjectContainer}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 98
*/
/**
* @description [read-only] The stage the display object is connected to, or undefined if it is not connected to the stage.
* @member PIXI.DisplayObject#stage
* @type {PIXI.Stage}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 107
*/
/**
* @description [read-only] The multiplied alpha of the displayObject
* @member PIXI.DisplayObject#worldAlpha
* @type {Number}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 116
*/
/**
* @description [read-only] Current transform of the object based on world (parent) factors
* @member PIXI.DisplayObject#worldTransform
* @type {Matrix}
* @readonly 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 125
*/
/**
* @description cached sin rotation and cos rotation
* @member PIXI.DisplayObject#_sr
* @type {Number}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 135
*/
/**
* @description cached sin rotation and cos rotation
* @member PIXI.DisplayObject#_cr
* @type {Number}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 144
*/
/**
* @description The area the filter is applied to like the hitArea this is used as more of an optimisation
rather than figuring out the dimensions of the displayObject each frame you can set this rectangle
* @member PIXI.DisplayObject#filterArea
* @type {Rectangle}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 153
*/
/**
* @description The original, cached bounds of the object
* @member PIXI.DisplayObject#_bounds
* @type {Rectangle}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 162
*/
/**
* @description The most up-to-date bounds of the object
* @member PIXI.DisplayObject#_currentBounds
* @type {Rectangle}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 171
*/
/**
* @description The original, cached mask of the object
* @member PIXI.DisplayObject#_mask
* @type {Rectangle}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 180
*/
/**
* @description Cached internal flag.
* @member PIXI.DisplayObject#_cacheAsBitmap
* @type {Boolean}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 189
*/
/**
* @description Cached internal flag.
* @member PIXI.DisplayObject#_cacheIsDirty
* @type {Boolean}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 198
*/
/**
* @description Destroy this DisplayObject.
Removes all references to transformCallbacks, its parent, the stage, filters, bounds, mask and cached Sprites.
* @method PIXI.DisplayObject#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 212
*/
/**
* @description [read-only] Indicates if the sprite is globally visible.
* @member PIXI.DisplayObject#worldVisible
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 249
*/
/**
* @description Sets a mask for the displayObject. A mask is an object that limits the visibility of an object to the shape of the mask applied to it.
In PIXI a regular mask must be a PIXI.Graphics object. This allows for much faster masking in canvas as it utilises shape clipping.
To remove a mask, set this property to null.
* @member PIXI.DisplayObject#mask
* @type {PIXI.Graphics}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 273
*/
/**
* @description Sets the filters for the displayObject.
* IMPORTANT: This is a webGL only feature and will be ignored by the canvas renderer.
To remove filters simply set this property to 'null'
* @member PIXI.DisplayObject#filters
* @type {Array<Filter>}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 298
*/
/**
* @description Set if this display object is cached as a bitmap.
This basically takes a snap shot of the display object as it is at that moment. It can provide a performance benefit for complex static displayObjects.
To remove simply set this property to 'null'
* @member PIXI.DisplayObject#cacheAsBitmap
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 336
*/
/**
* @description Retrieves the bounds of the displayObject as a rectangle object
* @method PIXI.DisplayObject#getBounds
* @param {Matrix} matrix - 
* @return {Rectangle} the rectangular bounding area
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 451
*/
/**
* @description Retrieves the local bounds of the displayObject as a rectangle object
* @method PIXI.DisplayObject#getLocalBounds
* @return {Rectangle} the rectangular bounding area
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 464
*/
/**
* @description Sets the object's stage reference, the stage this object is connected to
* @method PIXI.DisplayObject#setStageReference
* @param {PIXI.Stage} stage - the stage that the object will have as its current stage reference
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 475
*/
/**
* @description Empty, to be overridden by classes that require it.
* @method PIXI.DisplayObject#preUpdate
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 486
*/
/**
* @description Useful function that returns a texture of the displayObject object that can then be used to create sprites
This can be quite useful if your displayObject is static / complicated and needs to be reused multiple times.
* @method PIXI.DisplayObject#generateTexture
* @param {Number} resolution - The resolution of the texture being generated
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @param {(PIXI.CanvasRenderer|PIXI.WebGLRenderer)} renderer - The renderer used to generate the texture.
* @return {PIXI.Texture} a texture of the graphics object
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 495
*/
/**
* @description Generates and updates the cached sprite for this object.
* @method PIXI.DisplayObject#updateCache
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 519
*/
/**
* @description Calculates the global position of the display object
* @method PIXI.DisplayObject#toGlobal
* @param {Point} position - The world origin to calculate from
* @return {Point} A point object representing the position of this object
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 529
*/
/**
* @description Calculates the local position of the display object relative to another point
* @method PIXI.DisplayObject#toLocal
* @param {Point} position - The world origin to calculate from
* @param {PIXI.DisplayObject} [from] - The DisplayObject to calculate the global position from
* @return {Point} A point object representing the position of this object
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 543
*/
/**
* @description Internal method.
* @method PIXI.DisplayObject#_renderCachedSprite
* @param {Object} renderSession - The render session
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 564
*/
/**
* @description Internal method.
* @method PIXI.DisplayObject#_generateCachedSprite
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 585
*/
/**
* @description Destroys the cached sprite.
* @method PIXI.DisplayObject#_destroyCachedSprite
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 628
*/
/**
* @description Renders the object using the WebGL renderer
* @method PIXI.DisplayObject#_renderWebGL
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 644
*/
/**
* @description Renders the object using the Canvas renderer
* @method PIXI.DisplayObject#_renderCanvas
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 658
*/
/**
* @description The position of the displayObject on the x axis relative to the local coordinates of the parent.
* @member PIXI.DisplayObject#x
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 672
*/
/**
* @description The position of the displayObject on the y axis relative to the local coordinates of the parent.
* @member PIXI.DisplayObject#y
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObject.js
* @sourceline 690
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
* @augments PIXI.DisplayObject
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
* @description The width of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
* @member PIXI.DisplayObjectContainer#width
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 32
*/
/**
* @description The height of the displayObjectContainer, setting this will actually modify the scale to achieve the value set
* @member PIXI.DisplayObjectContainer#height
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 62
*/
/**
* @description Adds a child to the container.
* @method PIXI.DisplayObjectContainer#addChild
* @param {PIXI.DisplayObject} child - The DisplayObject to add to the container
* @return {PIXI.DisplayObject} The child that was added.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 92
*/
/**
* @description Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
* @method PIXI.DisplayObjectContainer#addChildAt
* @param {PIXI.DisplayObject} child - The child to add
* @param {Number} index - The index to place the child in
* @return {PIXI.DisplayObject} The child that was added.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 104
*/
/**
* @description Swaps the position of 2 Display Objects within this container.
* @method PIXI.DisplayObjectContainer#swapChildren
* @param {PIXI.DisplayObject} child - 
* @param {PIXI.DisplayObject} child2 - 
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 135
*/
/**
* @description Returns the index position of a child DisplayObject instance
* @method PIXI.DisplayObjectContainer#getChildIndex
* @param {PIXI.DisplayObject} child - The DisplayObject instance to identify
* @return {Number} The index position of the child display object to identify
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 160
*/
/**
* @description Changes the position of an existing child in the display object container
* @method PIXI.DisplayObjectContainer#setChildIndex
* @param {PIXI.DisplayObject} child - The child DisplayObject instance for which you want to change the index number
* @param {Number} index - The resulting index number for the child display object
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 177
*/
/**
* @description Returns the child at the specified index
* @method PIXI.DisplayObjectContainer#getChildAt
* @param {Number} index - The index to get the child from
* @return {PIXI.DisplayObject} The child at the given index, if any.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 195
*/
/**
* @description Removes a child from the container.
* @method PIXI.DisplayObjectContainer#removeChild
* @param {PIXI.DisplayObject} child - The DisplayObject to remove
* @return {PIXI.DisplayObject} The child that was removed.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 212
*/
/**
* @description Removes a child from the specified index position.
* @method PIXI.DisplayObjectContainer#removeChildAt
* @param {Number} index - The index to get the child from
* @return {PIXI.DisplayObject} The child that was removed.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 227
*/
/**
* @description Removes all children from this container that are within the begin and end indexes.
* @method PIXI.DisplayObjectContainer#removeChildren
* @param {Number} beginIndex - The beginning position. Default value is 0.
* @param {Number} endIndex - The ending position. Default value is size of the container.
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 245
*/
/**
* @description Retrieves the bounds of the displayObjectContainer as a rectangle. The bounds calculation takes all visible children into consideration.
* @method PIXI.DisplayObjectContainer#getBounds
* @return {Rectangle} The rectangular bounding area
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 304
*/
/**
* @description Retrieves the non-global local bounds of the displayObjectContainer as a rectangle. The calculation takes all visible children into consideration.
* @method PIXI.DisplayObjectContainer#getLocalBounds
* @return {Rectangle} The rectangular bounding area
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 364
*/
/**
* @description Sets the containers Stage reference. This is the Stage that this object, and all of its children, is connected to.
* @method PIXI.DisplayObjectContainer#setStageReference
* @param {PIXI.Stage} stage - the stage that the container will have as its current stage reference
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 388
*/
/**
* @description Removes the current stage reference from the container and all of its children.
* @method PIXI.DisplayObjectContainer#removeStageReference
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 404
*/
/**
* @description Renders the object using the WebGL renderer
* @method PIXI.DisplayObjectContainer#_renderWebGL
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 419
*/
/**
* @description Renders the object using the Canvas renderer
* @method PIXI.DisplayObjectContainer#_renderCanvas
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\DisplayObjectContainer.js
* @sourceline 477
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
* @description The blend mode to be applied to the sprite. Set to PIXI.blendModes.NORMAL to remove any blend mode.
* @member PIXI.Sprite#blendMode
* @type {Number}
* @default PIXI.blendModes.NORMAL;
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 68
*/
/**
* @description The shader that will be used to render the texture to the stage. Set to null to remove a current shader.
* @member PIXI.Sprite#shader
* @type {PIXI.AbstractFilter}
* @default null
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 77
*/
/**
* @description The width of the sprite, setting this will actually modify the scale to achieve the value set
* @member PIXI.Sprite#width
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 99
*/
/**
* @description The height of the sprite, setting this will actually modify the scale to achieve the value set
* @member PIXI.Sprite#height
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 118
*/
/**
* @description Sets the texture of the sprite
* @method PIXI.Sprite#setTexture
* @param {PIXI.Texture} texture - The PIXI texture that is displayed by the sprite
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 137
*/
/**
* @description When the texture is updated, this event will fire to update the scale and frame
* @method PIXI.Sprite#onTextureUpdate
* @param {} event - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 149
*/
/**
* @description Returns the bounds of the Sprite as a rectangle. The bounds calculation takes the worldTransform into account.
* @method PIXI.Sprite#getBounds
* @param {Matrix} matrix - the transformation matrix of the sprite
* @return {Rectangle} the framing rectangle
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 163
*/
/**
* @description Renders the object using the WebGL renderer
* @method PIXI.Sprite#_renderWebGL
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 258
*/
/**
* @description Renders the object using the Canvas renderer
* @method PIXI.Sprite#_renderCanvas
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 321
*/
/**
* @description Helper function that creates a sprite that will contain a texture from the TextureCache based on the frameId
 The frame ids are created when a Texture packer file has been loaded
* @method PIXI.Sprite.fromFrame
* @param {String} frameId - The frame Id of the texture in the cache
* @return {PIXI.Sprite} A new Sprite using a texture from the texture cache matching the frameId
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 434
*/
/**
* @description Helper function that creates a sprite that will contain a texture based on an image url
 If the image is not in the texture cache it will be loaded
* @method PIXI.Sprite.fromImage
* @param {String} imageId - The image url of the texture
* @return {PIXI.Sprite} A new Sprite using a texture from the texture cache matching the image id
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Sprite.js
* @sourceline 453
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
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Stage.js
* @sourceline 1
*/
/**
* @class PIXI.Stage
* @description A Stage represents the root of the display tree. Everything connected to the stage is rendered
* @augments PIXI.DisplayObjectContainer
* @param {Number} backgroundColor - the background color of the stage, you have to pass this in is in hex format
     like: 0xFFFFFF for white

Creating a stage is a mandatory process when you use Pixi, which is as simple as this : 
var stage = new PIXI.Stage(0xFFFFFF);
where the parameter given is the background colour of the stage, in hex
you will use this stage instance to add your sprites to it and therefore to the renderer
Here is how to add a sprite to the stage : 
stage.addChild(sprite);
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Stage.js
* @sourceline 5
*/
/**
* @description [read-only] Current transform of the object based on world (parent) factors
* @member PIXI.Stage#worldTransform
* @type {Matrix}
* @readonly 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Stage.js
* @sourceline 25
*/
/**
* @description Sets the background color for the stage
* @method PIXI.Stage#setBackgroundColor
* @param {Number} backgroundColor - the color of the background, easiest way to pass this in is in hex format
     like: 0xFFFFFF for white
* @sourcefile d:\wamp\www\phaser\src\pixi\display\Stage.js
* @sourceline 61
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
* @sourceline 341
*/
/**
* @description When the texture is updated, this event will fire to update the scale and frame
* @method PIXI.Strip#onTextureUpdate
* @param {} event - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\Strip.js
* @sourceline 389
*/
/**
* @description Returns the bounds of the mesh as a rectangle. The bounds calculation takes the worldTransform into account.
* @method PIXI.Strip#getBounds
* @param {Matrix} matrix - the transformation matrix of the sprite
* @return {Rectangle} the framing rectangle
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\Strip.js
* @sourceline 402
*/
/**
* @description Different drawing buffer modes supported
* @member PIXI.Strip.
* @type {{TRIANGLE_STRIP: number, TRIANGLES: number}}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\Strip.js
* @sourceline 459
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
* @description The with of the tiling sprite
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
* @description The blend mode to be applied to the sprite
* @member PIXI.TilingSprite#blendMode
* @type {Number}
* @default PIXI.blendModes.NORMAL;
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 77
*/
/**
* @description The width of the sprite, setting this will actually modify the scale to achieve the value set
* @member PIXI.TilingSprite#width
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 95
*/
/**
* @description The height of the TilingSprite, setting this will actually modify the scale to achieve the value set
* @member PIXI.TilingSprite#height
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 111
*/
/**
* @description Renders the object using the WebGL renderer
* @method PIXI.TilingSprite#_renderWebGL
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 137
*/
/**
* @description Renders the object using the Canvas renderer
* @method PIXI.TilingSprite#_renderCanvas
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 192
*/
/**
* @description Returns the framing rectangle of the sprite as a PIXI.Rectangle object
* @method PIXI.TilingSprite#getBounds
* @return {Rectangle} the framing rectangle
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 278
*/
/**
* @description When the texture is updated, this event will fire to update the scale and frame
* @method PIXI.TilingSprite#onTextureUpdate
* @param {} event - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 358
*/
/**
* @method PIXI.TilingSprite#generateTilingTexture
* @param {Boolean} forcePowerOfTwo - Whether we want to force the texture to be a power of two
* @sourcefile d:\wamp\www\phaser\src\pixi\extras\TilingSprite.js
* @sourceline 371
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
* @type {Array<Filter>}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 15
*/
/**
* @member PIXI.AbstractFilter#shaders
* @type {Array<Shader>}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 24
*/
/**
* @member PIXI.AbstractFilter#dirty
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 31
*/
/**
* @member PIXI.AbstractFilter#padding
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 37
*/
/**
* @member PIXI.AbstractFilter#uniforms
* @type {object}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 43
*/
/**
* @member PIXI.AbstractFilter#fragmentSrc
* @type {Array}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 50
*/
/**
* @description Syncs the uniforms between the class object and the shaders.
* @method PIXI.AbstractFilter#syncUniforms
* @sourcefile d:\wamp\www\phaser\src\pixi\filters\AbstractFilter.js
* @sourceline 60
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
* @sourceline 210
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
* @sourceline 256
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
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 374
*/
/**
* @description Specifies a simple one-color fill that subsequent calls to other Graphics methods
(such as lineTo() or drawCircle()) use when drawing.
* @method PIXI.Graphics#beginFill
* @param {Number} color - the color of the fill
* @param {Number} alpha - the alpha of the fill
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 455
*/
/**
* @description Applies a fill to the lines and shapes that were added since the last call to the beginFill() method.
* @method PIXI.Graphics#endFill
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 483
*/
/**
* @method PIXI.Graphics#drawRect
* @param {Number} x - The X coord of the top-left of the rectangle
* @param {Number} y - The Y coord of the top-left of the rectangle
* @param {Number} width - The width of the rectangle
* @param {Number} height - The height of the rectangle
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 498
*/
/**
* @method PIXI.Graphics#drawRoundedRect
* @param {Number} x - The X coord of the top-left of the rectangle
* @param {Number} y - The Y coord of the top-left of the rectangle
* @param {Number} width - The width of the rectangle
* @param {Number} height - The height of the rectangle
* @param {Number} radius - Radius of the rectangle corners
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 514
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
* @sourceline 546
*/
/**
* @description Draws a polygon using the given path.
* @method PIXI.Graphics#drawPolygon
* @param {Array} path - The path data used to construct the polygon.
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 563
*/
/**
* @description Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
* @method PIXI.Graphics#clear
* @return {PIXI.Graphics} 
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 579
*/
/**
* @description Useful function that returns a texture of the graphics object that can then be used to create sprites
This can be quite useful if your geometry is complicated and needs to be reused multiple times.
* @method PIXI.Graphics#generateTexture
* @param {Number} resolution - The resolution of the texture being generated
* @param {Number} scaleMode - Should be one of the PIXI.scaleMode consts
* @return {PIXI.Texture} a texture of the graphics object
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 597
*/
/**
* @description Renders the object using the WebGL renderer
* @method PIXI.Graphics#_renderWebGL
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 626
*/
/**
* @description Renders the object using the Canvas renderer
* @method PIXI.Graphics#_renderCanvas
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 705
*/
/**
* @description Retrieves the bounds of the graphic shape as a rectangle object
* @method PIXI.Graphics#getBounds
* @return {Rectangle} the rectangular bounding area
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 775
*/
/**
* @description Update the bounds of the object
* @method PIXI.Graphics#updateLocalBounds
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 854
*/
/**
* @description Generates the cached sprite when the sprite has cacheAsBitmap = true
* @method PIXI.Graphics#_generateCachedSprite
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 966
*/
/**
* @description Updates texture size based on canvas size
* @method PIXI.Graphics#updateCachedSpriteTexture
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 1006
*/
/**
* @description Destroys a previous cached sprite.
* @method PIXI.Graphics#destroyCachedSprite
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 1030
*/
/**
* @description Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
* @method PIXI.Graphics#drawShape
* @param {(Circle|Rectangle|Ellipse|Line|Polygon)} shape - The Shape object to draw.
* @return {PIXI.GraphicsData} The generated GraphicsData object.
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 1041
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
* @sourceline 1082
*/
/**
* @class PIXI.GraphicsData
* @description A GraphicsData object.
* @sourcefile d:\wamp\www\phaser\src\pixi\primitives\Graphics.js
* @sourceline 1116
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasBuffer.js
* @sourceline 1
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
* @sourceline 15
*/
/**
* @description Tint a texture using the "multiply" operation.
* @method PIXI.CanvasTinter.tintWithMultiply
* @param {PIXI.Texture} texture - the texture to tint
* @param {Number} color - the color to use to tint the sprite with
* @param {HTMLCanvasElement} canvas - the current canvas
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 64
*/
/**
* @description Tint a texture using the "overlay" operation.
* @method PIXI.CanvasTinter.tintWithOverlay
* @param {PIXI.Texture} texture - the texture to tint
* @param {Number} color - the color to use to tint the sprite with
* @param {HTMLCanvasElement} canvas - the current canvas
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 111
*/
/**
* @description Tint a texture pixel per pixel.
* @method PIXI.CanvasTinter.tintPerPixel
* @param {PIXI.Texture} texture - the texture to tint
* @param {Number} color - the color to use to tint the sprite with
* @param {HTMLCanvasElement} canvas - the current canvas
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 147
*/
/**
* @description Rounds the specified color according to the PIXI.CanvasTinter.cacheStepsPerColorChannel.
* @method PIXI.CanvasTinter.roundColor
* @param {Number} color - the color to round, should be a hex color
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 202
*/
/**
* @description Checks if the browser correctly supports putImageData alpha channels.
* @method PIXI.CanvasTinter.checkInverseAlpha
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 222
*/
/**
* @description Number of steps which will be used as a cap when rounding colors.
* @member PIXI.CanvasTinter.cacheStepsPerColorChannel
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 250
*/
/**
* @description Tint cache boolean flag.
* @member PIXI.CanvasTinter.convertTintToImage
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 259
*/
/**
* @description If the browser isn't capable of handling tinting with alpha this will be false.
This property is only applicable if using tintWithPerPixel.
* @member PIXI.CanvasTinter.canHandleAlpha
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 268
*/
/**
* @description Whether or not the Canvas BlendModes are supported, consequently the ability to tint using the multiply method.
* @member PIXI.CanvasTinter.canUseMultiply
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 278
*/
/**
* @description The tinting method that will be used.
* @method PIXI.CanvasTinter.tintMethod
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\utils\CanvasTinter.js
* @sourceline 287
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
* @param {Number} [width=800] - the width of the canvas view
* @param {Number} [height=600] - the height of the canvas view
* @param {Object} [options] - The optional renderer parameters
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 5
*/
/**
* @description The renderer type.
* @member PIXI.CanvasRenderer#type
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 39
*/
/**
* @description The resolution of the canvas.
* @member PIXI.CanvasRenderer#resolution
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 47
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
* @sourceline 55
*/
/**
* @description Whether the render view is transparent
* @member PIXI.CanvasRenderer#transparent
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 67
*/
/**
* @description Whether the render view should be resized automatically
* @member PIXI.CanvasRenderer#autoResize
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 75
*/
/**
* @description The width of the canvas view
* @member PIXI.CanvasRenderer#width
* @type {Number}
* @default 800
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 84
*/
/**
* @description The height of the canvas view
* @member PIXI.CanvasRenderer#height
* @type {Number}
* @default 600
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 93
*/
/**
* @description The canvas element that everything is drawn to.
* @member PIXI.CanvasRenderer#view
* @type {HTMLCanvasElement}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 105
*/
/**
* @description The canvas 2d context that everything is drawn with
* @member PIXI.CanvasRenderer#context
* @type {CanvasRenderingContext2D}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 113
*/
/**
* @description Boolean flag controlling canvas refresh.
* @member PIXI.CanvasRenderer#refresh
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 120
*/
/**
* @description Internal var.
* @member PIXI.CanvasRenderer#count
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 131
*/
/**
* @description Instance of a PIXI.CanvasMaskManager, handles masking when using the canvas renderer
* @member PIXI.CanvasRenderer#CanvasMaskManager
* @type {PIXI.CanvasMaskManager}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 139
*/
/**
* @description The render session is just a bunch of parameter used for rendering
* @member PIXI.CanvasRenderer#renderSession
* @type {Object}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 146
*/

/**
* @description Renders the Stage to this canvas view
* @method PIXI.CanvasRenderer#render
* @param {PIXI.Stage} stage - the Stage element to be rendered
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 183
*/
/**
* @description Removes everything from the renderer and optionally removes the Canvas DOM element.
* @method PIXI.CanvasRenderer#destroy
* @param {Boolean} [removeView=true] - Removes the Canvas element from the DOM.
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 223
*/
/**
* @description Resizes the canvas view to the specified width and height
* @method PIXI.CanvasRenderer#resize
* @param {Number} width - the new width of the canvas view
* @param {Number} height - the new height of the canvas view
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 245
*/
/**
* @description Renders a display object
* @method PIXI.CanvasRenderer#renderDisplayObject
* @param {PIXI.DisplayObject} displayObject - The displayObject to render
* @param {CanvasRenderingContext2D} context - the context 2d method of the canvas
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 266
*/
/**
* @description Maps Pixi blend modes to canvas blend modes.
* @method PIXI.CanvasRenderer#mapBlendModes
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\canvas\CanvasRenderer.js
* @sourceline 281
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
* @sourceline 50
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
* @sourceline 138
*/
/**
* @description Applies the filter to the specified area.
* @method PIXI.WebGLFilterManager#applyFilterPass
* @param {PIXI.AbstractFilter} filter - the filter that needs to be applied
* @param {PIXI.Texture} filterArea - TODO - might need an update
* @param {Number} width - the horizontal range of the filter
* @param {Number} height - the vertical range of the filter
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFilterManager.js
* @sourceline 315
*/
/**
* @description Initialises the shader buffers.
* @method PIXI.WebGLFilterManager#initShaderBuffers
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFilterManager.js
* @sourceline 376
*/
/**
* @description Destroys the filter and removes it from the filter stack.
* @method PIXI.WebGLFilterManager#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLFilterManager.js
* @sourceline 424
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
* @sourceline 16
*/
/**
* @description Updates the graphics object
* @method PIXI.WebGLGraphics.updateGraphics
* @param {PIXI.Graphics} graphicsData - The graphics object to update
* @param {WebGLContext} gl - the current WebGL drawing context
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 86
*/
/**
* @method PIXI.WebGLGraphics.switchMode
* @param {WebGLContext} webGL - 
* @param {Number} type - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 211
*/
/**
* @description Builds a rectangle to draw
* @method PIXI.WebGLGraphics.buildRectangle
* @param {PIXI.Graphics} graphicsData - The graphics object containing all the necessary properties
* @param {Object} webGLData - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 245
*/
/**
* @description Builds a rounded rectangle to draw
* @method PIXI.WebGLGraphics.buildRoundedRectangle
* @param {PIXI.Graphics} graphicsData - The graphics object containing all the necessary properties
* @param {Object} webGLData - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 313
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
* @sourceline 384
*/
/**
* @description Builds a circle to draw
* @method PIXI.WebGLGraphics.buildCircle
* @param {PIXI.Graphics} graphicsData - The graphics object to draw
* @param {Object} webGLData - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 436
*/
/**
* @description Builds a line to draw
* @method PIXI.WebGLGraphics.buildLine
* @param {PIXI.Graphics} graphicsData - The graphics object containing all the necessary properties
* @param {Object} webGLData - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 519
*/
/**
* @description Builds a complex polygon to draw
* @method PIXI.WebGLGraphics.buildComplexPoly
* @param {PIXI.Graphics} graphicsData - The graphics object containing all the necessary properties
* @param {Object} webGLData - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 731
*/
/**
* @description Builds a polygon to draw
* @method PIXI.WebGLGraphics.buildPoly
* @param {PIXI.Graphics} graphicsData - The graphics object containing all the necessary properties
* @param {Object} webGLData - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 793
*/
/**
* @class PIXI.WebGLGraphicsData
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 848
*/
/**
* @method PIXI.WebGLGraphicsData#reset
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 868
*/
/**
* @method PIXI.WebGLGraphicsData#upload
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLGraphics.js
* @sourceline 877
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
* @sourceline 48
*/
/**
* @description Destroys the mask stack.
* @method PIXI.WebGLMaskManager#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLMaskManager.js
* @sourceline 61
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
* @sourceline 72
*/
/**
* @description Sets the current shader.
* @method PIXI.WebGLShaderManager#setShader
* @param {} shader - 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderManager.js
* @sourceline 115
*/
/**
* @description Destroys this object.
* @method PIXI.WebGLShaderManager#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLShaderManager.js
* @sourceline 135
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
* @sourceline 63
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
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 201
*/
/**
* @description Renders a TilingSprite using the spriteBatch.
* @method PIXI.WebGLSpriteBatch#renderTilingSprite
* @param {PIXI.TilingSprite} sprite - the tilingSprite to render
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 328
*/
/**
* @description Renders the content and empties the current batch.
* @method PIXI.WebGLSpriteBatch#flush
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 446
*/
/**
* @method PIXI.WebGLSpriteBatch#renderBatch
* @param {PIXI.Texture} texture - 
* @param {Number} size - 
* @param {Number} startIndex - 
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 572
*/
/**
* @method PIXI.WebGLSpriteBatch#stop
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 602
*/
/**
* @method PIXI.WebGLSpriteBatch#start
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 611
*/
/**
* @description Destroys the SpriteBatch.
* @method PIXI.WebGLSpriteBatch#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\utils\WebGLSpriteBatch.js
* @sourceline 619
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
* @param {Number} [width=0] - the width of the canvas view
* @param {Number} [height=0] - the height of the canvas view
* @param {Object} [options] - The optional renderer parameters
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 8
*/
/**
* @member PIXI.WebGLRenderer#type
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 45
*/
/**
* @description The resolution of the renderer
* @member PIXI.WebGLRenderer#resolution
* @type {Number}
* @default 1
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 51
*/
/**
* @description Whether the render view is transparent
* @member PIXI.WebGLRenderer#transparent
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 62
*/
/**
* @description Whether the render view should be resized automatically
* @member PIXI.WebGLRenderer#autoResize
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 70
*/
/**
* @description The value of the preserveDrawingBuffer flag affects whether or not the contents of the stencil buffer is retained after rendering.
* @member PIXI.WebGLRenderer#preserveDrawingBuffer
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 78
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
* @sourceline 86
*/
/**
* @description The width of the canvas view
* @member PIXI.WebGLRenderer#width
* @type {Number}
* @default 800
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 98
*/
/**
* @description The height of the canvas view
* @member PIXI.WebGLRenderer#height
* @type {Number}
* @default 600
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 107
*/
/**
* @description The canvas element that everything is drawn to
* @member PIXI.WebGLRenderer#view
* @type {HTMLCanvasElement}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 116
*/
/**
* @member PIXI.WebGLRenderer#contextLostBound
* @type {Function}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 126
*/
/**
* @member PIXI.WebGLRenderer#contextRestoredBound
* @type {Function}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 132
*/
/**
* @member PIXI.WebGLRenderer#_contextOptions
* @type {Object}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 141
*/
/**
* @member PIXI.WebGLRenderer#projection
* @type {Point}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 154
*/
/**
* @member PIXI.WebGLRenderer#offset
* @type {Point}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 160
*/
/**
* @description Deals with managing the shader programs and their attribs
* @member PIXI.WebGLRenderer#shaderManager
* @type {PIXI.WebGLShaderManager}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 168
*/
/**
* @description Manages the rendering of sprites
* @member PIXI.WebGLRenderer#spriteBatch
* @type {PIXI.WebGLSpriteBatch}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 175
*/
/**
* @description Manages the masks using the stencil buffer
* @member PIXI.WebGLRenderer#maskManager
* @type {PIXI.WebGLMaskManager}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 182
*/
/**
* @description Manages the filters
* @member PIXI.WebGLRenderer#filterManager
* @type {PIXI.WebGLFilterManager}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 189
*/
/**
* @description Manages the stencil buffer
* @member PIXI.WebGLRenderer#stencilManager
* @type {PIXI.WebGLStencilManager}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 196
*/
/**
* @description Manages the blendModes
* @member PIXI.WebGLRenderer#blendModeManager
* @type {PIXI.WebGLBlendModeManager}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 203
*/
/**
* @description TODO remove
* @member PIXI.WebGLRenderer#renderSession
* @type {Object}
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 210
*/
/**
* @method PIXI.WebGLRenderer#initContext
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 237
*/
/**
* @description Renders the stage to its webGL view
* @method PIXI.WebGLRenderer#render
* @param {PIXI.Stage} stage - the Stage element to be rendered
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 275
*/
/**
* @description Renders a Display Object.
* @method PIXI.WebGLRenderer#renderDisplayObject
* @param {PIXI.DisplayObject} displayObject - The DisplayObject to render
* @param {Point} projection - The projection
* @param {Array} buffer - a standard WebGL buffer
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 322
*/
/**
* @description Resizes the webGL view to the specified width and height.
* @method PIXI.WebGLRenderer#resize
* @param {Number} width - the new width of the webGL view
* @param {Number} height - the new height of the webGL view
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 359
*/
/**
* @description Updates and Creates a WebGL texture for the renderers context.
* @method PIXI.WebGLRenderer#updateTexture
* @param {PIXI.Texture} texture - the texture to update
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 385
*/
/**
* @description Handles a lost webgl context
* @method PIXI.WebGLRenderer#handleContextLost
* @param {PIXI.Event} event - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 433
*/
/**
* @description Handles a restored webgl context
* @method PIXI.WebGLRenderer#handleContextRestored
* @param {PIXI.Event} event - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 446
*/
/**
* @description Removes everything from the renderer (event listeners, spritebatch, etc...)
* @method PIXI.WebGLRenderer#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 467
*/
/**
* @description Maps Pixi blend modes to WebGL blend modes.
* @method PIXI.WebGLRenderer#mapBlendModes
* @sourcefile d:\wamp\www\phaser\src\pixi\renderers\webgl\WebGLRenderer.js
* @sourceline 501
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
* @sourcefile d:\wamp\www\phaser\src\pixi\text\BitmapText.js
* @sourceline 1
*/
/**
* @class PIXI.BitmapText
* @description A BitmapText object will create a line or multiple lines of text using bitmap font. To split a line you can use '\n', '\r' or '\r\n' in your string.
You can generate the fnt files using
http://www.angelcode.com/products/bmfont/ for windows or
http://www.bmglyph.com/ for mac.
* @augments PIXI.DisplayObjectContainer
* @param {String} text - The copy that you would like the text to display
* @param {Object} style - The style parameters
* @sourcefile d:\wamp\www\phaser\src\pixi\text\BitmapText.js
* @sourceline 5
*/
/**
* @description [read-only] The width of the overall text, different from fontSize,
which is defined in the style object
* @member PIXI.BitmapText#textWidth
* @type {Number}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\text\BitmapText.js
* @sourceline 23
*/
/**
* @description [read-only] The height of the overall text, different from fontSize,
which is defined in the style object
* @member PIXI.BitmapText#textHeight
* @type {Number}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\text\BitmapText.js
* @sourceline 33
*/
/**
* @description The max width of this bitmap text in pixels. If the text provided is longer than the value provided, line breaks will be 
automatically inserted in the last whitespace. Disable by setting value to 0.
* @member PIXI.BitmapText#maxWidth
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\text\BitmapText.js
* @sourceline 43
*/
/**
* @member PIXI.BitmapText#anchor
* @type {Point}
* @sourcefile d:\wamp\www\phaser\src\pixi\text\BitmapText.js
* @sourceline 52
*/
/**
* @member PIXI.BitmapText#_prevAnchor
* @type {Point}
* @sourcefile d:\wamp\www\phaser\src\pixi\text\BitmapText.js
* @sourceline 58
*/
/**
* @member PIXI.BitmapText#_pool
* @type {Array}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\text\BitmapText.js
* @sourceline 64
*/
/**
* @description The dirty state of this object.
* @member PIXI.BitmapText#dirty
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\text\BitmapText.js
* @sourceline 75
*/
/**
* @description Set the text string to be rendered.
* @method PIXI.BitmapText#setText
* @param {String} text - The text that you would like displayed
* @sourcefile d:\wamp\www\phaser\src\pixi\text\BitmapText.js
* @sourceline 87
*/
/**
* @description Set the style of the text
style.font {String} The size (optional) and bitmap font id (required) eq 'Arial' or '20px Arial' (must have loaded previously)
[style.align='left'] {String} Alignment for multiline text ('left', 'center' or 'right'), does not affect single lines of text
* @method PIXI.BitmapText#setStyle
* @param {Object} style - The style parameters, contained as properties of an object
* @sourcefile d:\wamp\www\phaser\src\pixi\text\BitmapText.js
* @sourceline 99
*/
/**
* @description Renders text and updates it when needed
* @method PIXI.BitmapText#updateText
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\text\BitmapText.js
* @sourceline 121
*/
/**
* @description Updates the transform of this object
* @method PIXI.BitmapText#updateTransform
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\text\BitmapText.js
* @sourceline 243
*/
/**
* @fileoverview
* @author Mat Groves http://matgroves.com/ @Doormat23
Modified by Tom Slezakowski http://www.tomslezakowski.com @TomSlezakowski (24/03/2014) - Added dropShadowColor.
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 1
*/
/**
* @class PIXI.Text
* @description A Text Object will create a line or multiple lines of text. To split a line you can use '\n' in your text string,
or add a wordWrap property set to true and and wordWrapWidth property with a value in the style object.
* @augments PIXI.Sprite
* @param {String} text - The copy that you would like the text to display
* @param {Object} [style] - The style parameters
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 6
*/
/**
* @description The canvas element that everything is drawn to
* @member PIXI.Text#canvas
* @type {HTMLCanvasElement}
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 29
*/
/**
* @description The canvas 2d context that everything is drawn with
* @member PIXI.Text#context
* @type {HTMLCanvasElement}
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 37
*/
/**
* @description The resolution of the canvas.
* @member PIXI.Text#resolution
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 44
*/
/**
* @description The width of the Text, setting this will actually modify the scale to achieve the value set
* @member PIXI.Text#width
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 62
*/
/**
* @description The height of the Text, setting this will actually modify the scale to achieve the value set
* @member PIXI.Text#height
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 86
*/
/**
* @description Set the style of the text
* @method PIXI.Text#setStyle
* @param {Object} [style] - The style parameters
* @param {Object} [style.fill='black'] - A canvas fillstyle that will be used on the text eg 'red', '#00FF00'
* @param {String} [style.align='left'] - Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
* @param {String} [style.stroke='black'] - A canvas fillstyle that will be used on the text stroke eg 'blue', '#FCFF00'
* @param {Number} [style.strokeThickness=0] - A number that represents the thickness of the stroke. Default is 0 (no stroke)
* @param {Boolean} [style.wordWrap=false] - Indicates if word wrap should be used
* @param {Number} [style.wordWrapWidth=100] - The width at which text will wrap
* @param {Boolean} [style.dropShadow=false] - Set a drop shadow for the text
* @param {String} [style.dropShadowColor='#000000'] - A fill style to be used on the dropshadow e.g 'red', '#00FF00'
* @param {Number} [style.dropShadowAngle=Math.PI/4] - Set a angle of the drop shadow
* @param {Number} [style.dropShadowDistance=5] - Set a distance of the drop shadow
* @param {String} [style.font='bold - 20pt Arial']  The style and size of the font
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 110
*/
/**
* @description Set the copy for the text object. To split a line you can use '\n'.
* @method PIXI.Text#setText
* @param {String} text - The copy that you would like the text to display
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 147
*/
/**
* @description Renders text and updates it when needed
* @method PIXI.Text#updateText
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 159
*/
/**
* @description Updates texture size based on canvas size
* @method PIXI.Text#updateTexture
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 285
*/
/**
* @description Renders the object using the WebGL renderer
* @method PIXI.Text#_renderWebGL
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 305
*/
/**
* @description Renders the object using the Canvas renderer
* @method PIXI.Text#_renderCanvas
* @param {RenderSession} renderSession - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 325
*/
/**
* @description Calculates the ascent, descent and fontSize of a given fontStyle
* @method PIXI.Text#determineFontProperties
* @param {Object} fontStyle - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 345
*/
/**
* @description Applies newlines to a string to have it optimally fit into the horizontal
bounds set by the Text object's wordWrapWidth property.
* @method PIXI.Text#wordWrap
* @param {String} text - 
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 450
*/
/**
* @description Returns the bounds of the Text as a rectangle. The bounds calculation takes the worldTransform into account.
* @method PIXI.Text#getBounds
* @param {Matrix} matrix - the transformation matrix of the Text
* @return {Rectangle} the framing rectangle
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 498
*/
/**
* @description Destroys this text object.
* @method PIXI.Text#destroy
* @param {Boolean} destroyBaseTexture - whether to destroy the base texture as well
* @sourcefile d:\wamp\www\phaser\src\pixi\text\Text.js
* @sourceline 516
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
* @param {String} source - the source object (image or canvas)
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 9
*/
/**
* @description The Resolution of the texture.
* @member PIXI.BaseTexture#resolution
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 20
*/
/**
* @description [read-only] The width of the base texture set when the image has loaded
* @member PIXI.BaseTexture#width
* @type {Number}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 28
*/
/**
* @description [read-only] The height of the base texture set when the image has loaded
* @member PIXI.BaseTexture#height
* @type {Number}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 37
*/
/**
* @description The scale mode to apply when scaling this texture
* @member PIXI.BaseTexture#scaleMode
* @type {Number}
* @default PIXI.scaleModes.LINEAR
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 46
*/
/**
* @description [read-only] Set to true once the base texture has loaded
* @member PIXI.BaseTexture#hasLoaded
* @type {Boolean}
* @readonly 
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 55
*/
/**
* @description The image source that is used to create the texture.
* @member PIXI.BaseTexture#source
* @type {Image}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 64
*/
/**
* @description Controls if RGB channels should be pre-multiplied by Alpha  (WebGL only)
* @member PIXI.BaseTexture#premultipliedAlpha
* @type {Boolean}
* @default true
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 74
*/
/**
* @member PIXI.BaseTexture#_glTextures
* @type {Array}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 85
*/
/**
* @description Set this to true if a mipmap of this texture needs to be generated. This value needs to be set before the texture is used
 Also the texture must be a power of two size to work
* @member PIXI.BaseTexture#mipmap
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 92
*/
/**
* @member PIXI.BaseTexture#_dirty
* @type {Array}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 104
*/
/**
* @member PIXI.BaseTexture#imageUrl
* @type {String}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 143
*/
/**
* @member PIXI.BaseTexture#_powerOf2
* @type {Boolean}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 149
*/
/**
* @description Destroys this base texture
* @method PIXI.BaseTexture#destroy
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 162
*/
/**
* @description Changes the source image of the texture
* @method PIXI.BaseTexture#updateSourceImage
* @param {String} newSrc - the path of the image
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 185
*/
/**
* @description Sets all glTextures to be dirty.
* @method PIXI.BaseTexture#dirty
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 198
*/
/**
* @description Removes the base texture from the GPU, useful for managing resources on the GPU.
Atexture is still 100% usable and will simply be reuploaded if there is a sprite on screen that is using it.
* @method PIXI.BaseTexture#unloadFromGPU
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 211
*/
/**
* @description Helper function that creates a base texture from the given image url.
If the image is not in the base texture cache it will be created and loaded.
* @method PIXI.BaseTexture.fromImage
* @param {String} imageUrl - The image url of the texture
* @param {Boolean} crossorigin - 
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @return BaseTexture
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 239
*/
/**
* @description Helper function that creates a base texture from the given canvas element.
* @method PIXI.BaseTexture.fromCanvas
* @param {Canvas} canvas - The canvas element source of the texture
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @return BaseTexture
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\BaseTexture.js
* @sourceline 282
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
* @sourceline 137
*/
/**
* @description Clears the RenderTexture.
* @method PIXI.RenderTexture#clear
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 173
*/
/**
* @description This function will draw the display object to the texture.
* @method PIXI.RenderTexture#renderWebGL
* @param {PIXI.DisplayObject} displayObject - The display object to render this texture on
* @param {Matrix} [matrix] - Optional matrix to apply to the display object before rendering.
* @param {Boolean} [clear] - If true the texture will be cleared before the displayObject is drawn
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 190
*/
/**
* @description This function will draw the display object to the texture.
* @method PIXI.RenderTexture#renderCanvas
* @param {PIXI.DisplayObject} displayObject - The display object to render this texture on
* @param {Matrix} [matrix] - Optional matrix to apply to the display object before rendering.
* @param {Boolean} [clear] - If true the texture will be cleared before the displayObject is drawn
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 239
*/
/**
* @description Will return a HTML Image of the texture
* @method PIXI.RenderTexture#getImage
* @return {Image} 
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 280
*/
/**
* @description Will return a a base64 encoded string of this texture. It works by calling RenderTexture.getCanvas and then running toDataURL on that.
* @method PIXI.RenderTexture#getBase64
* @return {String} A base64 encoded string of the texture.
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 293
*/
/**
* @description Creates a Canvas element, renders this RenderTexture to it and then returns it.
* @method PIXI.RenderTexture#getCanvas
* @return {HTMLCanvasElement} A Canvas element with the texture rendered on.
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\RenderTexture.js
* @sourceline 304
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
* @sourceline 19
*/

/**
* @description Does this Texture have any frame data assigned to it?
* @member PIXI.Texture#noFrame
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 33
*/
/**
* @description The base texture that this texture uses.
* @member PIXI.Texture#baseTexture
* @type {PIXI.BaseTexture}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 52
*/
/**
* @description The frame specifies the region of the base texture that this texture uses
* @member PIXI.Texture#frame
* @type {Rectangle}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 60
*/
/**
* @description The texture trim data.
* @member PIXI.Texture#trim
* @type {Rectangle}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 68
*/
/**
* @description This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.
* @member PIXI.Texture#valid
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 76
*/
/**
* @description This will let a renderer know that a texture has been updated (used mainly for webGL uv updates)
* @member PIXI.Texture#requiresUpdate
* @type {Boolean}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 84
*/
/**
* @description The WebGL UV data cache.
* @member PIXI.Texture#_uvs
* @type {Object}
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 92
*/
/**
* @description The width of the Texture in pixels.
* @member PIXI.Texture#width
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 101
*/
/**
* @description The height of the Texture in pixels.
* @member PIXI.Texture#height
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 109
*/
/**
* @description This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)
* @member PIXI.Texture#crop
* @type {Rectangle}
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 117
*/
/**
* @description Called when the base texture is loaded
* @method PIXI.Texture#onBaseTextureLoaded
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 140
*/
/**
* @description Destroys this texture
* @method PIXI.Texture#destroy
* @param {Boolean} destroyBase - Whether to destroy the base texture as well
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 158
*/
/**
* @description Specifies the region of the baseTexture that this texture will use.
* @method PIXI.Texture#setFrame
* @param {Rectangle} frame - The frame of the texture to set it to
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 171
*/
/**
* @description Updates the internal WebGL UV cache.
* @method PIXI.Texture#_updateUvs
* @access private
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 215
*/
/**
* @description Helper function that creates a Texture object from the given image url.
If the image is not in the texture cache it will be  created and loaded.
* @method PIXI.Texture.fromImage
* @param {String} imageUrl - The image url of the texture
* @param {Boolean} crossorigin - Whether requests should be treated as crossorigin
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @return Texture
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 242
*/
/**
* @description Helper function that returns a Texture objected based on the given frame id.
If the frame id is not in the texture cache an error will be thrown.
* @method PIXI.Texture.fromFrame
* @param {String} frameId - The frame id of the texture
* @return Texture
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 266
*/
/**
* @description Helper function that creates a new a Texture based on the given canvas element.
* @method PIXI.Texture.fromCanvas
* @param {Canvas} canvas - The canvas element source of the texture
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @return Texture
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 282
*/
/**
* @description Adds a texture to the global PIXI.TextureCache. This cache is shared across the whole PIXI object.
* @method PIXI.Texture.addTextureToCache
* @param {PIXI.Texture} texture - The Texture to add to the cache.
* @param {String} id - The id that the texture will be stored against.
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 299
*/
/**
* @description Remove a texture from the global PIXI.TextureCache.
* @method PIXI.Texture.removeTextureFromCache
* @param {String} id - The id of the texture to be removed
* @return {PIXI.Texture} The texture that was removed
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\Texture.js
* @sourceline 312
*/
/**
* @class PIXI.VideoTexture
* @description A texture of a [playing] Video.

See the ["deus" demo](http://www.goodboydigital.com/pixijs/examples/deus/).
* @augments PIXI.BaseTexture
* @param {HTMLVideoElement} source - 
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\VideoTexture.js
* @sourceline 1
*/
/**
* @description Mimic Pixi BaseTexture.from.... method.
* @method PIXI.VideoTexture.baseTextureFromVideo
* @param {HTMLVideoElement} video - 
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @return {PIXI.VideoTexture} 
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\VideoTexture.js
* @sourceline 110
*/
/**
* @description Mimic Pixi BaseTexture.from.... method.
* @method PIXI.VideoTexture.textureFromVideo
* @param {HTMLVideoElement} video - 
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @return {PIXI.Texture} A Texture, but not a VideoTexture.
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\VideoTexture.js
* @sourceline 137
*/
/**
* @description Mimic Pixi BaseTexture.from.... method.
* @method PIXI.VideoTexture.fromUrl
* @param {String} videoSrc - The URL for the video.
* @param {Number} scaleMode - See {{#crossLink "PIXI/scaleModes:property"}}PIXI.scaleModes{{/crossLink}} for possible values
* @return {PIXI.VideoTexture} 
* @sourcefile d:\wamp\www\phaser\src\pixi\textures\VideoTexture.js
* @sourceline 152
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
* @sourceline 57
*/
/**
* @description checks if the given width and height make a power of two texture
* @method PIXI.PIXI#isPowerOfTwo
* @param {Number} width - 
* @param {Number} height - 
* @return {Boolean} 
* @sourcefile d:\wamp\www\phaser\src\pixi\utils\Utils.js
* @sourceline 77
*/



/**
* @member PIXI.PIXI.WEBGL_RENDERER
* @type {Number}
* @access protected
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 21
*/
/**
* @member PIXI.PIXI.CANVAS_RENDERER
* @type {Number}
* @access protected
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 28
*/
/**
* @description Version of pixi that is loaded.
* @member PIXI.PIXI.VERSION
* @type {String}
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 35
*/
/**
* @member PIXI.PIXI.PI_2
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 64
*/
/**
* @member PIXI.PIXI.RAD_TO_DEG
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 70
*/
/**
* @member PIXI.PIXI.DEG_TO_RAD
* @type {Number}
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 76
*/
/**
* @member PIXI.PIXI.RETINA_PREFIX
* @type {String}
* @access protected
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 82
*/
/**
* @description The default render options if none are supplied to
{{#crossLink "WebGLRenderer"}}{{/crossLink}} or {{#crossLink "CanvasRenderer"}}{{/crossLink}}.
* @member PIXI.PIXI.defaultRenderOptions
* @type {Object}
* @sourcefile d:\wamp\www\phaser\src\pixi\Pixi.js
* @sourceline 89
*/