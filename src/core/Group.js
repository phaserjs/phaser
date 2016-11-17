/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Group is a container for {@link DisplayObject display objects} including {@link Phaser.Sprite Sprites} and {@link Phaser.Image Images}.
*
* Groups form the logical tree structure of the display/scene graph where local transformations are applied to children.
* For instance, all children are also moved/rotated/scaled when the group is moved/rotated/scaled.
*
* In addition, Groups provides support for fast pooling and object recycling.
*
* Groups are also display objects and can be nested as children within other Groups.
*
* @class Phaser.Group
* @extends PIXI.DisplayObjectContainer
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {DisplayObject|null} [parent=(game world)] - The parent Group (or other {@link DisplayObject}) that this group will be added to.
*     If undefined/unspecified the Group will be added to the {@link Phaser.Game#world Game World}; if null the Group will not be added to any parent.
* @param {string} [name='group'] - A name for this group. Not used internally but useful for debugging.
* @param {boolean} [addToStage=false] - If true this group will be added directly to the Game.Stage instead of Game.World.
* @param {boolean} [enableBody=false] - If true all Sprites created with {@link #create} or {@link #createMulitple} will have a physics body created on them. Change the body type with {@link #physicsBodyType}.
* @param {integer} [physicsBodyType=0] - The physics body type to use when physics bodies are automatically added. See {@link #physicsBodyType} for values.
*/
Phaser.Group = function (game, parent, name, addToStage, enableBody, physicsBodyType) {

    if (addToStage === undefined) { addToStage = false; }
    if (enableBody === undefined) { enableBody = false; }
    if (physicsBodyType === undefined) { physicsBodyType = Phaser.Physics.ARCADE; }

    /**
    * A reference to the currently running Game.
    * @property {Phaser.Game} game
    * @protected
    */
    this.game = game;

    if (parent === undefined)
    {
        parent = game.world;
    }

    /**
    * A name for this group. Not used internally but useful for debugging.
    * @property {string} name
    */
    this.name = name || 'group';

    /**
    * The z-depth value of this object within its parent container/Group - the World is a Group as well.
    * This value must be unique for each child in a Group.
    * @property {integer} z
    * @readOnly
    */
    this.z = 0;

    PIXI.DisplayObjectContainer.call(this);

    if (addToStage)
    {
        this.game.stage.addChild(this);
        this.z = this.game.stage.children.length;
    }
    else
    {
        if (parent)
        {
            parent.addChild(this);
            this.z = parent.children.length;
        }
    }

    /**
    * Internal Phaser Type value.
    * @property {integer} type
    * @protected
    */
    this.type = Phaser.GROUP;

    /**
    * @property {number} physicsType - The const physics body type of this object.
    * @readonly
    */
    this.physicsType = Phaser.GROUP;

    /**
    * The alive property is useful for Groups that are children of other Groups and need to be included/excluded in checks like forEachAlive.
    * @property {boolean} alive
    * @default
    */
    this.alive = true;

    /**
    * If exists is true the group is updated, otherwise it is skipped.
    * @property {boolean} exists
    * @default
    */
    this.exists = true;

    /**
    * A group with `ignoreDestroy` set to `true` ignores all calls to its `destroy` method.
    * @property {boolean} ignoreDestroy
    * @default
    */
    this.ignoreDestroy = false;

    /**
    * A Group is that has `pendingDestroy` set to `true` is flagged to have its destroy method
    * called on the next logic update.
    * You can set it directly to flag the Group to be destroyed on its next update.
    *
    * This is extremely useful if you wish to destroy a Group from within one of its own callbacks
    * or a callback of one of its children.
    *
    * @property {boolean} pendingDestroy
    */
    this.pendingDestroy = false;

    /**
    * The type of objects that will be created when using {@link #create} or {@link #createMultiple}.
    *
    * Any object may be used but it should extend either Sprite or Image and accept the same constructor arguments:
    * when a new object is created it is passed the following parameters to its constructor: `(game, x, y, key, frame)`.
    *
    * @property {object} classType
    * @default {@link Phaser.GameObject.Sprite}
    */
    this.classType = Phaser.GameObject.Sprite;

    /**
    * The current display object that the group cursor is pointing to, if any. (Can be set manually.)
    *
    * The cursor is a way to iterate through the children in a Group using {@link #next} and {@link #previous}.
    * @property {?DisplayObject} cursor
    */
    this.cursor = null;

    /**
    * A Group with `inputEnableChildren` set to `true` will automatically call `inputEnabled = true` 
    * on any children _added_ to, or _created by_, this Group.
    * 
    * If there are children already in the Group at the time you set this property, they are not changed.
    * 
    * @property {boolean} inputEnableChildren
    * @default
    */
    this.inputEnableChildren = false;

    /**
    * This Signal is dispatched whenever a child of this Group emits an onInputDown signal as a result
    * of having been interacted with by a Pointer. You can bind functions to this Signal instead of to
    * every child Sprite.
    * 
    * This Signal is sent 2 arguments: A reference to the Sprite that triggered the signal, and
    * a reference to the Pointer that caused it.
    * 
    * @property {Phaser.Signal} onChildInputDown
    */
    this.onChildInputDown = new Phaser.Signal();

    /**
    * This Signal is dispatched whenever a child of this Group emits an onInputUp signal as a result
    * of having been interacted with by a Pointer. You can bind functions to this Signal instead of to
    * every child Sprite.
    * 
    * This Signal is sent 3 arguments: A reference to the Sprite that triggered the signal, 
    * a reference to the Pointer that caused it, and a boolean value `isOver` that tells you if the Pointer
    * is still over the Sprite or not.
    * 
    * @property {Phaser.Signal} onChildInputUp
    */
    this.onChildInputUp = new Phaser.Signal();

    /**
    * This Signal is dispatched whenever a child of this Group emits an onInputOver signal as a result
    * of having been interacted with by a Pointer. You can bind functions to this Signal instead of to
    * every child Sprite.
    * 
    * This Signal is sent 2 arguments: A reference to the Sprite that triggered the signal, and
    * a reference to the Pointer that caused it.
    * 
    * @property {Phaser.Signal} onChildInputOver
    */
    this.onChildInputOver = new Phaser.Signal();

    /**
    * This Signal is dispatched whenever a child of this Group emits an onInputOut signal as a result
    * of having been interacted with by a Pointer. You can bind functions to this Signal instead of to
    * every child Sprite.
    * 
    * This Signal is sent 2 arguments: A reference to the Sprite that triggered the signal, and
    * a reference to the Pointer that caused it.
    * 
    * @property {Phaser.Signal} onChildInputOut
    */
    this.onChildInputOut = new Phaser.Signal();

    /**
    * If true all Sprites created by, or added to this group, will have a physics body enabled on them.
    *
    * If there are children already in the Group at the time you set this property, they are not changed.
    *
    * The default body type is controlled with {@link #physicsBodyType}.
    * @property {boolean} enableBody
    */
    this.enableBody = enableBody;

    /**
    * If true when a physics body is created (via {@link #enableBody}) it will create a physics debug object as well.
    *
    * This only works for P2 bodies.
    * @property {boolean} enableBodyDebug
    * @default
    */
    this.enableBodyDebug = false;

    /**
    * If {@link #enableBody} is true this is the type of physics body that is created on new Sprites.
    *
    * The valid values are {@link Phaser.Physics.ARCADE}, {@link Phaser.Physics.P2JS}, {@link Phaser.Physics.NINJA}, etc.
    * @property {integer} physicsBodyType
    */
    this.physicsBodyType = physicsBodyType;

    /**
    * If this Group contains Arcade Physics Sprites you can set a custom sort direction via this property.
    *
    * It should be set to one of the Phaser.Physics.Arcade sort direction constants: 
    * 
    * Phaser.Physics.Arcade.SORT_NONE
    * Phaser.Physics.Arcade.LEFT_RIGHT
    * Phaser.Physics.Arcade.RIGHT_LEFT
    * Phaser.Physics.Arcade.TOP_BOTTOM
    * Phaser.Physics.Arcade.BOTTOM_TOP
    *
    * If set to `null` the Group will use whatever Phaser.Physics.Arcade.sortDirection is set to. This is the default behavior.
    * 
    * @property {integer} physicsSortDirection
    * @default
    */
    this.physicsSortDirection = null;

    /**
    * This signal is dispatched when the group is destroyed.
    * @property {Phaser.Signal} onDestroy
    */
    this.onDestroy = new Phaser.Signal();

    /**
    * @property {integer} cursorIndex - The current index of the Group cursor. Advance it with Group.next.
    * @readOnly
    */
    this.cursorIndex = 0;

    /**
    * A Group that is fixed to the camera uses its x/y coordinates as offsets from the top left of the camera. These are stored in Group.cameraOffset.
    * 
    * Note that the cameraOffset values are in addition to any parent in the display list.
    * So if this Group was in a Group that has x: 200, then this will be added to the cameraOffset.x
    * 
    * @property {boolean} fixedToCamera
    */
    this.fixedToCamera = false;

    /**
    * If this object is {@link #fixedToCamera} then this stores the x/y position offset relative to the top-left of the camera view.
    * If the parent of this Group is also `fixedToCamera` then the offset here is in addition to that and should typically be disabled.
    * @property {Phaser.Point} cameraOffset
    */
    this.cameraOffset = new Phaser.Point();

    /**
    * The hash array is an array belonging to this Group into which you can add any of its children via Group.addToHash and Group.removeFromHash.
    * 
    * Only children of this Group can be added to and removed from the hash.
    * 
    * This hash is used automatically by Phaser Arcade Physics in order to perform non z-index based destructive sorting.
    * However if you don't use Arcade Physics, or this isn't a physics enabled Group, then you can use the hash to perform your own
    * sorting and filtering of Group children without touching their z-index (and therefore display draw order)
    * 
    * @property {array} hash
    */
    this.hash = [];

    /**
    * The property on which children are sorted.
    * @property {string} _sortProperty
    * @private
    */
    this._sortProperty = 'z';

};

Phaser.Group.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
Phaser.Group.prototype.constructor = Phaser.Group;

/**
* A returnType value, as specified in {@link #iterate} eg.
* @constant
* @type {integer}
*/
Phaser.Group.RETURN_NONE = 0;

/**
* A returnType value, as specified in {@link #iterate} eg.
* @constant
* @type {integer}
*/
Phaser.Group.RETURN_TOTAL = 1;

/**
* A returnType value, as specified in {@link #iterate} eg.
* @constant
* @type {integer}
*/
Phaser.Group.RETURN_CHILD = 2;

/**
* A returnType value, as specified in {@link #iterate} eg.
* @constant
* @type {integer}
*/
Phaser.Group.RETURN_ALL = 3;

/**
* A sort ordering value, as specified in {@link #sort} eg.
* @constant
* @type {integer}
*/
Phaser.Group.SORT_ASCENDING = -1;

/**
* A sort ordering value, as specified in {@link #sort} eg.
* @constant
* @type {integer}
*/
Phaser.Group.SORT_DESCENDING = 1;

/**
* Adds an existing object as the top child in this group.
*
* The child is automatically added to the top of the group, and is displayed above every previous child.
*
* Or if the _optional_ index is specified, the child is added at the location specified by the index value, 
* this allows you to control child ordering.
*
* If the child was already in this Group, it is simply returned, and nothing else happens to it.
*
* If `Group.enableBody` is set, then a physics body will be created on the object, so long as one does not already exist.
*
* If `Group.inputEnableChildren` is set, then an Input Handler will be created on the object, so long as one does not already exist.
*
* Use {@link #addAt} to control where a child is added. Use {@link #create} to create and add a new child.
*
* @method Phaser.Group#add
* @param {DisplayObject} child - The display object to add as a child.
* @param {boolean} [silent=false] - If true the child will not dispatch the `onAddedToGroup` event.
* @param {integer} [index] - The index within the group to insert the child to. Where 0 is the bottom of the Group.
* @return {DisplayObject} The child that was added to the group.
*/
Phaser.Group.prototype.add = function (child, silent, index) {

    if (silent === undefined) { silent = false; }

    if (child.parent === this)
    {
        return child;
    }

    if (child.body && child.parent && child.parent.hash)
    {
        child.parent.removeFromHash(child);
    }

    if (index === undefined)
    {
        child.z = this.children.length;

        this.addChild(child);
    }
    else
    {
        this.addChildAt(child, index);

        this.updateZ();
    }

    if (this.enableBody && child.hasOwnProperty('body') && child.body === null)
    {
        this.game.physics.enable(child, this.physicsBodyType);
    }
    else if (child.body)
    {
        this.addToHash(child);
    }

    if (this.inputEnableChildren && (!child.input || child.inputEnabled))
    {
        child.inputEnabled = true;
    }

    if (!silent && child.events)
    {
        child.events.onAddedToGroup$dispatch(child, this);
    }

    if (this.cursor === null)
    {
        this.cursor = child;
    }

    return child;

};

/**
* Adds an existing object to this group.
*
* The child is added to the group at the location specified by the index value, this allows you to control child ordering.
* 
* If `Group.enableBody` is set, then a physics body will be created on the object, so long as one does not already exist.
*
* If `Group.inputEnableChildren` is set, then an Input Handler will be created on the object, so long as one does not already exist.
*
* @method Phaser.Group#addAt
* @param {DisplayObject} child - The display object to add as a child.
* @param {integer} [index=0] - The index within the group to insert the child to.
* @param {boolean} [silent=false] - If true the child will not dispatch the `onAddedToGroup` event.
* @return {DisplayObject} The child that was added to the group.
*/
Phaser.Group.prototype.addAt = function (child, index, silent) {

    return this.add(child, silent, index);

};

/**
* Adds a child of this Group into the hash array.
* This call will return false if the child is not a child of this Group, or is already in the hash.
*
* @method Phaser.Group#addToHash
* @param {DisplayObject} child - The display object to add to this Groups hash. Must be a member of this Group already and not present in the hash.
* @return {boolean} True if the child was successfully added to the hash, otherwise false.
*/
Phaser.Group.prototype.addToHash = function (child) {

    if (child.parent === this)
    {
        var index = this.hash.indexOf(child);

        if (index === -1)
        {
            this.hash.push(child);
            return true;
        }
    }

    return false;

};

/**
* Removes a child of this Group from the hash array.
* This call will return false if the child is not in the hash.
*
* @method Phaser.Group#removeFromHash
* @param {DisplayObject} child - The display object to remove from this Groups hash. Must be a member of this Group and in the hash.
* @return {boolean} True if the child was successfully removed from the hash, otherwise false.
*/
Phaser.Group.prototype.removeFromHash = function (child) {

    if (child)
    {
        var index = this.hash.indexOf(child);

        if (index !== -1)
        {
            this.hash.splice(index, 1);
            return true;
        }
    }

    return false;

};

/**
* Adds an array of existing Display Objects to this Group.
*
* The Display Objects are automatically added to the top of this Group, and will render on-top of everything already in this Group.
*
* As well as an array you can also pass another Group as the first argument. In this case all of the children from that
* Group will be removed from it and added into this Group.
* 
* If `Group.enableBody` is set, then a physics body will be created on the objects, so long as one does not already exist.
*
* If `Group.inputEnableChildren` is set, then an Input Handler will be created on the objects, so long as one does not already exist.
*
* @method Phaser.Group#addMultiple
* @param {DisplayObject[]|Phaser.Group} children - An array of display objects or a Phaser.Group. If a Group is given then *all* children will be moved from it.
* @param {boolean} [silent=false] - If true the children will not dispatch the `onAddedToGroup` event.
* @return {DisplayObject[]|Phaser.Group} The array of children or Group of children that were added to this Group.
*/
Phaser.Group.prototype.addMultiple = function (children, silent) {

    if (children instanceof Phaser.Group)
    {
        children.moveAll(this, silent);
    }
    else if (Array.isArray(children))
    {
        for (var i = 0; i < children.length; i++)
        {
            this.add(children[i], silent);
        }
    }

    return children;

};

/**
* Returns the child found at the given index within this group.
*
* @method Phaser.Group#getAt
* @param {integer} index - The index to return the child from.
* @return {DisplayObject|integer} The child that was found at the given index, or -1 for an invalid index.
*/
Phaser.Group.prototype.getAt = function (index) {

    if (index < 0 || index >= this.children.length)
    {
        return -1;
    }
    else
    {
        return this.getChildAt(index);
    }

};

/**
* Creates a new Phaser.Sprite object and adds it to the top of this group.
*
* Use {@link #classType} to change the type of object created.
* 
* The child is automatically added to the top of the group, and is displayed above every previous child.
*
* Or if the _optional_ index is specified, the child is added at the location specified by the index value, 
* this allows you to control child ordering.
* 
* If `Group.enableBody` is set, then a physics body will be created on the object, so long as one does not already exist.
*
* If `Group.inputEnableChildren` is set, then an Input Handler will be created on the object, so long as one does not already exist.
*
* @method Phaser.Group#create
* @param {number} x - The x coordinate to display the newly created Sprite at. The value is in relation to the group.x point.
* @param {number} y - The y coordinate to display the newly created Sprite at. The value is in relation to the group.y point.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} [key] - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache Image entry, or an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
* @param {string|number} [frame] - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
* @param {boolean} [exists=true] - The default exists state of the Sprite.
* @param {integer} [index] - The index within the group to insert the child to. Where 0 is the bottom of the Group.
* @return {DisplayObject} The child that was created: will be a {@link Phaser.Sprite} unless {@link #classType} has been changed.
*/
Phaser.Group.prototype.create = function (x, y, key, frame, exists, index) {

    if (exists === undefined) { exists = true; }

    var child = new this.classType(this.game, x, y, key, frame);

    child.exists = exists;
    child.visible = exists;
    child.alive = exists;

    return this.add(child, false, index);

};

/**
* Creates multiple Phaser.Sprite objects and adds them to the top of this Group.
* 
* This method is useful if you need to quickly generate a pool of sprites, such as bullets.
*
* Use {@link #classType} to change the type of object created.
*
* You can provide an array as the `key` and / or `frame` arguments. When you do this
* it will create `quantity` Sprites for every key (and frame) in the arrays.
* 
* For example:
* 
* `createMultiple(25, ['ball', 'carrot'])`
*
* In the above code there are 2 keys (ball and carrot) which means that 50 sprites will be
* created in total, 25 of each. You can also have the `frame` as an array:
*
* `createMultiple(5, 'bricks', [0, 1, 2, 3])`
*
* In the above there is one key (bricks), which is a sprite sheet. The frames array tells
* this method to use frames 0, 1, 2 and 3. So in total it will create 20 sprites, because
* the quantity was set to 5, so that is 5 brick sprites of frame 0, 5 brick sprites with
* frame 1, and so on.
*
* If you set both the key and frame arguments to be arrays then understand it will create
* a total quantity of sprites equal to the size of both arrays times each other. I.e.:
*
* `createMultiple(20, ['diamonds', 'balls'], [0, 1, 2])`
*
* The above will create 20 'diamonds' of frame 0, 20 with frame 1 and 20 with frame 2.
* It will then create 20 'balls' of frame 0, 20 with frame 1 and 20 with frame 2.
* In total it will have created 120 sprites.
*
* By default the Sprites will have their `exists` property set to `false`, and they will be 
* positioned at 0x0, relative to the `Group.x / y` values.
* 
* If `Group.enableBody` is set, then a physics body will be created on the objects, so long as one does not already exist.
*
* If `Group.inputEnableChildren` is set, then an Input Handler will be created on the objects, so long as one does not already exist.
*
* @method Phaser.Group#createMultiple
* @param {integer} quantity - The number of Sprites to create.
* @param {string|array} key - The Cache key of the image that the Sprites will use. Or an Array of keys. See the description for details on how the quantity applies when arrays are used.
* @param {integer|string|array} [frame=0] - If the Sprite image contains multiple frames you can specify which one to use here. Or an Array of frames. See the description for details on how the quantity applies when arrays are used.
* @param {boolean} [exists=false] - The default exists state of the Sprite.
* @return {array} An array containing all of the Sprites that were created.
*/
Phaser.Group.prototype.createMultiple = function (quantity, key, frame, exists) {

    if (frame === undefined) { frame = 0; }
    if (exists === undefined) { exists = false; }

    if (!Array.isArray(key))
    {
        key = [ key ];
    }

    if (!Array.isArray(frame))
    {
        frame = [ frame ];
    }

    var _this = this;
    var children = [];

    key.forEach(function(singleKey) {

        frame.forEach(function(singleFrame) {

            for (var i = 0; i < quantity; i++)
            {
                children.push(_this.create(0, 0, singleKey, singleFrame, exists));
            }

        });

    });

    return children;

};

/**
* Internal method that re-applies all of the children's Z values.
*
* This must be called whenever children ordering is altered so that their `z` indices are correctly updated.
*
* @method Phaser.Group#updateZ
* @protected
*/
Phaser.Group.prototype.updateZ = function () {

    var i = this.children.length;

    while (i--)
    {
        this.children[i].z = i;
    }

};

/**
* This method iterates through all children in the Group (regardless if they are visible or exist)
* and then changes their position so they are arranged in a Grid formation. Children must have
* the `alignTo` method in order to be positioned by this call. All default Phaser Game Objects have
* this.
*
* The grid dimensions are determined by the first four arguments. The `width` and `height` arguments
* relate to the width and height of the grid respectively.
*
* For example if the Group had 100 children in it:
*
* `Group.align(10, 10, 32, 32)`
*
* This will align all of the children into a grid formation of 10x10, using 32 pixels per
* grid cell. If you want a wider grid, you could do:
* 
* `Group.align(25, 4, 32, 32)`
*
* This will align the children into a grid of 25x4, again using 32 pixels per grid cell.
*
* You can choose to set _either_ the `width` or `height` value to -1. Doing so tells the method
* to keep on aligning children until there are no children left. For example if this Group had
* 48 children in it, the following:
*
* `Group.align(-1, 8, 32, 32)`
*
* ... will align the children so that there are 8 children vertically (the second argument), 
* and each row will contain 6 sprites, except the last one, which will contain 5 (totaling 48)
*
* You can also do:
* 
* `Group.align(10, -1, 32, 32)`
*
* In this case it will create a grid 10 wide, and as tall as it needs to be in order to fit
* all of the children in.
*
* The `position` property allows you to control where in each grid cell the child is positioned.
* This is a constant and can be one of `Phaser.TOP_LEFT` (default), `Phaser.TOP_CENTER`, 
* `Phaser.TOP_RIGHT`, `Phaser.LEFT_CENTER`, `Phaser.CENTER`, `Phaser.RIGHT_CENTER`, 
* `Phaser.BOTTOM_LEFT`, `Phaser.BOTTOM_CENTER` or `Phaser.BOTTOM_RIGHT`.
*
* The final argument; `offset` lets you start the alignment from a specific child index.
*
* @method Phaser.Group#align
* @param {integer} width - The width of the grid in items (not pixels). Set to -1 for a dynamic width. If -1 then you must set an explicit height value.
* @param {integer} height - The height of the grid in items (not pixels). Set to -1 for a dynamic height. If -1 then you must set an explicit width value.
* @param {integer} cellWidth - The width of each grid cell, in pixels.
* @param {integer} cellHeight - The height of each grid cell, in pixels.
* @param {integer} [position] - The position constant. One of `Phaser.TOP_LEFT` (default), `Phaser.TOP_CENTER`, `Phaser.TOP_RIGHT`, `Phaser.LEFT_CENTER`, `Phaser.CENTER`, `Phaser.RIGHT_CENTER`, `Phaser.BOTTOM_LEFT`, `Phaser.BOTTOM_CENTER` or `Phaser.BOTTOM_RIGHT`.
* @param {integer} [offset=0] - Optional index to start the alignment from. Defaults to zero, the first child in the Group, but can be set to any valid child index value.
* @return {boolean} True if the Group children were aligned, otherwise false.
*/
Phaser.Group.prototype.align = function (width, height, cellWidth, cellHeight, position, offset) {

    if (position === undefined) { position = Phaser.TOP_LEFT; }
    if (offset === undefined) { offset = 0; }

    if (this.children.length === 0 || offset > this.children.length || (width === -1 && height === -1))
    {
        return false;
    }

    var r = new Phaser.Rectangle(0, 0, cellWidth, cellHeight);
    var w = (width * cellWidth);
    var h = (height * cellHeight);

    for (var i = offset; i < this.children.length; i++)
    {
        var child = this.children[i];

        if (child['alignIn'])
        {
            child.alignIn(r, position);
        }
        else
        {
            continue;
        }

        if (width === -1)
        {
            //  We keep laying them out horizontally until we've done them all
            r.y += cellHeight;

            if (r.y === h)
            {
                r.x += cellWidth;
                r.y = 0;
            }
        }
        else if (height === -1)
        {
            //  We keep laying them out vertically until we've done them all
            r.x += cellWidth;

            if (r.x === w)
            {
                r.x = 0;
                r.y += cellHeight;
            }
        }
        else
        {
            //  We keep laying them out until we hit the column limit
            r.x += cellWidth;

            if (r.x === w)
            {
                r.x = 0;
                r.y += cellHeight;

                if (r.y === h)
                {
                    //  We've hit the column limit, so return, even if there are children left
                    return true;
                }
            }
        }
    }

    return true;

};

/**
* Sets the group cursor to the first child in the group.
*
* If the optional index parameter is given it sets the cursor to the object at that index instead.
*
* @method Phaser.Group#resetCursor
* @param {integer} [index=0] - Set the cursor to point to a specific index.
* @return {any} The child the cursor now points to.
*/
Phaser.Group.prototype.resetCursor = function (index) {

    if (index === undefined) { index = 0; }

    if (index > this.children.length - 1)
    {
        index = 0;
    }

    if (this.cursor)
    {
        this.cursorIndex = index;
        this.cursor = this.children[this.cursorIndex];
        return this.cursor;
    }

};

/**
* Advances the group cursor to the next (higher) object in the group.
*
* If the cursor is at the end of the group (top child) it is moved the start of the group (bottom child).
*
* @method Phaser.Group#next
* @return {any} The child the cursor now points to.
*/
Phaser.Group.prototype.next = function () {

    if (this.cursor)
    {
        //  Wrap the cursor?
        if (this.cursorIndex >= this.children.length - 1)
        {
            this.cursorIndex = 0;
        }
        else
        {
            this.cursorIndex++;
        }

        this.cursor = this.children[this.cursorIndex];

        return this.cursor;
    }

};

/**
* Moves the group cursor to the previous (lower) child in the group.
*
* If the cursor is at the start of the group (bottom child) it is moved to the end (top child).
*
* @method Phaser.Group#previous
* @return {any} The child the cursor now points to.
*/
Phaser.Group.prototype.previous = function () {

    if (this.cursor)
    {
        //  Wrap the cursor?
        if (this.cursorIndex === 0)
        {
            this.cursorIndex = this.children.length - 1;
        }
        else
        {
            this.cursorIndex--;
        }

        this.cursor = this.children[this.cursorIndex];

        return this.cursor;
    }

};

/**
* Swaps the position of two children in this group.
*
* Both children must be in this group, a child cannot be swapped with itself, and unparented children cannot be swapped.
*
* @method Phaser.Group#swap
* @param {any} child1 - The first child to swap.
* @param {any} child2 - The second child to swap.
*/
Phaser.Group.prototype.swap = function (child1, child2) {

    this.swapChildren(child1, child2);
    this.updateZ();

};

/**
* Brings the given child to the top of this group so it renders above all other children.
*
* @method Phaser.Group#bringToTop
* @param {any} child - The child to bring to the top of this group.
* @return {any} The child that was moved.
*/
Phaser.Group.prototype.bringToTop = function (child) {

    if (child.parent === this && this.getIndex(child) < this.children.length)
    {
        this.remove(child, false, true);
        this.add(child, true);
    }

    return child;

};

/**
* Sends the given child to the bottom of this group so it renders below all other children.
*
* @method Phaser.Group#sendToBack
* @param {any} child - The child to send to the bottom of this group.
* @return {any} The child that was moved.
*/
Phaser.Group.prototype.sendToBack = function (child) {

    if (child.parent === this && this.getIndex(child) > 0)
    {
        this.remove(child, false, true);
        this.addAt(child, 0, true);
    }

    return child;

};

/**
* Moves the given child up one place in this group unless it's already at the top.
*
* @method Phaser.Group#moveUp
* @param {any} child - The child to move up in the group.
* @return {any} The child that was moved.
*/
Phaser.Group.prototype.moveUp = function (child) {

    if (child.parent === this && this.getIndex(child) < this.children.length - 1)
    {
        var a = this.getIndex(child);
        var b = this.getAt(a + 1);

        if (b)
        {
            this.swap(child, b);
        }
    }

    return child;

};

/**
* Moves the given child down one place in this group unless it's already at the bottom.
*
* @method Phaser.Group#moveDown
* @param {any} child - The child to move down in the group.
* @return {any} The child that was moved.
*/
Phaser.Group.prototype.moveDown = function (child) {

    if (child.parent === this && this.getIndex(child) > 0)
    {
        var a = this.getIndex(child);
        var b = this.getAt(a - 1);

        if (b)
        {
            this.swap(child, b);
        }
    }

    return child;

};

/**
* Positions the child found at the given index within this group to the given x and y coordinates.
*
* @method Phaser.Group#xy
* @param {integer} index - The index of the child in the group to set the position of.
* @param {number} x - The new x position of the child.
* @param {number} y - The new y position of the child.
*/
Phaser.Group.prototype.xy = function (index, x, y) {

    if (index < 0 || index > this.children.length)
    {
        return -1;
    }
    else
    {
        this.getChildAt(index).x = x;
        this.getChildAt(index).y = y;
    }

};

/**
* Reverses all children in this group.
*
* This operation applies only to immediate children and does not propagate to subgroups.
*
* @method Phaser.Group#reverse
*/
Phaser.Group.prototype.reverse = function () {

    this.children.reverse();
    this.updateZ();

};

/**
* Get the index position of the given child in this group, which should match the child's `z` property.
*
* @method Phaser.Group#getIndex
* @param {any} child - The child to get the index for.
* @return {integer} The index of the child or -1 if it's not a member of this group.
*/
Phaser.Group.prototype.getIndex = function (child) {

    return this.children.indexOf(child);

};

/**
* Searches the Group for the first instance of a child with the `name`
* property matching the given argument. Should more than one child have
* the same name only the first instance is returned.
*
* @method Phaser.Group#getByName
* @param {string} name - The name to search for.
* @return {any} The first child with a matching name, or null if none were found.
*/
Phaser.Group.prototype.getByName = function (name) {

    for (var i = 0; i < this.children.length; i++)
    {
        if (this.children[i].name === name)
        {
            return this.children[i];
        }
    }

    return null;

};

/**
* Replaces a child of this Group with the given newChild. The newChild cannot be a member of this Group.
*
* If `Group.enableBody` is set, then a physics body will be created on the object, so long as one does not already exist.
*
* If `Group.inputEnableChildren` is set, then an Input Handler will be created on the object, so long as one does not already exist.
*
* @method Phaser.Group#replace
* @param {any} oldChild - The child in this group that will be replaced.
* @param {any} newChild - The child to be inserted into this group.
* @return {any} Returns the oldChild that was replaced within this group.
*/
Phaser.Group.prototype.replace = function (oldChild, newChild) {

    var index = this.getIndex(oldChild);

    if (index !== -1)
    {
        if (newChild.parent)
        {
            if (newChild.parent instanceof Phaser.Group)
            {
                newChild.parent.remove(newChild);
            }
            else
            {
                newChild.parent.removeChild(newChild);
            }
        }

        this.remove(oldChild);

        this.addAt(newChild, index);

        return oldChild;
    }

};

/**
* Checks if the child has the given property.
*
* Will scan up to 4 levels deep only.
*
* @method Phaser.Group#hasProperty
* @param {any} child - The child to check for the existence of the property on.
* @param {string[]} key - An array of strings that make up the property.
* @return {boolean} True if the child has the property, otherwise false.
*/
Phaser.Group.prototype.hasProperty = function (child, key) {

    var len = key.length;

    if (len === 1 && key[0] in child)
    {
        return true;
    }
    else if (len === 2 && key[0] in child && key[1] in child[key[0]])
    {
        return true;
    }
    else if (len === 3 && key[0] in child && key[1] in child[key[0]] && key[2] in child[key[0]][key[1]])
    {
        return true;
    }
    else if (len === 4 && key[0] in child && key[1] in child[key[0]] && key[2] in child[key[0]][key[1]] && key[3] in child[key[0]][key[1]][key[2]])
    {
        return true;
    }

    return false;

};

/**
* Sets a property to the given value on the child. The operation parameter controls how the value is set.
*
* The operations are:
* - 0: set the existing value to the given value; if force is `true` a new property will be created if needed
* - 1: will add the given value to the value already present.
* - 2: will subtract the given value from the value already present.
* - 3: will multiply the value already present by the given value.
* - 4: will divide the value already present by the given value.
*
* @method Phaser.Group#setProperty
* @param {any} child - The child to set the property value on.
* @param {array} key - An array of strings that make up the property that will be set.
* @param {any} value - The value that will be set.
* @param {integer} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
* @param {boolean} [force=false] - If `force` is true then the property will be set on the child regardless if it already exists or not. If false and the property doesn't exist, nothing will be set.
* @return {boolean} True if the property was set, false if not.
*/
Phaser.Group.prototype.setProperty = function (child, key, value, operation, force) {

    if (force === undefined) { force = false; }

    operation = operation || 0;

    //  As ugly as this approach looks, and although it's limited to a depth of only 4, it's much faster than a for loop or object iteration.

    //  0 = Equals
    //  1 = Add
    //  2 = Subtract
    //  3 = Multiply
    //  4 = Divide

    //  We can't force a property in and the child doesn't have it, so abort.
    //  Equally we can't add, subtract, multiply or divide a property value if it doesn't exist, so abort in those cases too.
    if (!this.hasProperty(child, key) && (!force || operation > 0))
    {
        return false;
    }

    var len = key.length;

    if (len === 1)
    {
        if (operation === 0) { child[key[0]] = value; }
        else if (operation === 1) { child[key[0]] += value; }
        else if (operation === 2) { child[key[0]] -= value; }
        else if (operation === 3) { child[key[0]] *= value; }
        else if (operation === 4) { child[key[0]] /= value; }
    }
    else if (len === 2)
    {
        if (operation === 0) { child[key[0]][key[1]] = value; }
        else if (operation === 1) { child[key[0]][key[1]] += value; }
        else if (operation === 2) { child[key[0]][key[1]] -= value; }
        else if (operation === 3) { child[key[0]][key[1]] *= value; }
        else if (operation === 4) { child[key[0]][key[1]] /= value; }
    }
    else if (len === 3)
    {
        if (operation === 0) { child[key[0]][key[1]][key[2]] = value; }
        else if (operation === 1) { child[key[0]][key[1]][key[2]] += value; }
        else if (operation === 2) { child[key[0]][key[1]][key[2]] -= value; }
        else if (operation === 3) { child[key[0]][key[1]][key[2]] *= value; }
        else if (operation === 4) { child[key[0]][key[1]][key[2]] /= value; }
    }
    else if (len === 4)
    {
        if (operation === 0) { child[key[0]][key[1]][key[2]][key[3]] = value; }
        else if (operation === 1) { child[key[0]][key[1]][key[2]][key[3]] += value; }
        else if (operation === 2) { child[key[0]][key[1]][key[2]][key[3]] -= value; }
        else if (operation === 3) { child[key[0]][key[1]][key[2]][key[3]] *= value; }
        else if (operation === 4) { child[key[0]][key[1]][key[2]][key[3]] /= value; }
    }

    return true;

};

/**
* Checks a property for the given value on the child.
*
* @method Phaser.Group#checkProperty
* @param {any} child - The child to check the property value on.
* @param {array} key - An array of strings that make up the property that will be set.
* @param {any} value - The value that will be checked.
* @param {boolean} [force=false] - If `force` is true then the property will be checked on the child regardless if it already exists or not. If true and the property doesn't exist, false will be returned.
* @return {boolean} True if the property was was equal to value, false if not.
*/
Phaser.Group.prototype.checkProperty = function (child, key, value, force) {

    if (force === undefined) { force = false; }

    //  We can't force a property in and the child doesn't have it, so abort.
    if (!Phaser.Utils.getProperty(child, key) && force)
    {
        return false;
    }

    if (Phaser.Utils.getProperty(child, key) !== value)
    {
        return false;
    }

    return true;

};

/**
* Quickly set a property on a single child of this group to a new value.
*
* The operation parameter controls how the new value is assigned to the property, from simple replacement to addition and multiplication.
*
* @method Phaser.Group#set
* @param {Phaser.Sprite} child - The child to set the property on.
* @param {string} key - The property, as a string, to be set. For example: 'body.velocity.x'
* @param {any} value - The value that will be set.
* @param {boolean} [checkAlive=false] - If set then the child will only be updated if alive=true.
* @param {boolean} [checkVisible=false] - If set then the child will only be updated if visible=true.
* @param {integer} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
* @param {boolean} [force=false] - If `force` is true then the property will be set on the child regardless if it already exists or not. If false and the property doesn't exist, nothing will be set.
* @return {boolean} True if the property was set, false if not.
*/
Phaser.Group.prototype.set = function (child, key, value, checkAlive, checkVisible, operation, force) {

    if (force === undefined) { force = false; }

    key = key.split('.');

    if (checkAlive === undefined) { checkAlive = false; }
    if (checkVisible === undefined) { checkVisible = false; }

    if ((checkAlive === false || (checkAlive && child.alive)) && (checkVisible === false || (checkVisible && child.visible)))
    {
        return this.setProperty(child, key, value, operation, force);
    }

};

/**
* Quickly set the same property across all children of this group to a new value.
*
* This call doesn't descend down children, so if you have a Group inside of this group, the property will be set on the group but not its children.
* If you need that ability please see `Group.setAllChildren`.
*
* The operation parameter controls how the new value is assigned to the property, from simple replacement to addition and multiplication.
*
* @method Phaser.Group#setAll
* @param {string} key - The property, as a string, to be set. For example: 'body.velocity.x'
* @param {any} value - The value that will be set.
* @param {boolean} [checkAlive=false] - If set then only children with alive=true will be updated. This includes any Groups that are children.
* @param {boolean} [checkVisible=false] - If set then only children with visible=true will be updated. This includes any Groups that are children.
* @param {integer} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
* @param {boolean} [force=false] - If `force` is true then the property will be set on the child regardless if it already exists or not. If false and the property doesn't exist, nothing will be set.
*/
Phaser.Group.prototype.setAll = function (key, value, checkAlive, checkVisible, operation, force) {

    if (checkAlive === undefined) { checkAlive = false; }
    if (checkVisible === undefined) { checkVisible = false; }
    if (force === undefined) { force = false; }

    key = key.split('.');
    operation = operation || 0;

    for (var i = 0; i < this.children.length; i++)
    {
        if ((!checkAlive || (checkAlive && this.children[i].alive)) && (!checkVisible || (checkVisible && this.children[i].visible)))
        {
            this.setProperty(this.children[i], key, value, operation, force);
        }
    }

};

/**
* Quickly set the same property across all children of this group, and any child Groups, to a new value.
*
* If this group contains other Groups then the same property is set across their children as well, iterating down until it reaches the bottom.
* Unlike with `setAll` the property is NOT set on child Groups itself.
*
* The operation parameter controls how the new value is assigned to the property, from simple replacement to addition and multiplication.
*
* @method Phaser.Group#setAllChildren
* @param {string} key - The property, as a string, to be set. For example: 'body.velocity.x'
* @param {any} value - The value that will be set.
* @param {boolean} [checkAlive=false] - If set then only children with alive=true will be updated. This includes any Groups that are children.
* @param {boolean} [checkVisible=false] - If set then only children with visible=true will be updated. This includes any Groups that are children.
* @param {integer} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
* @param {boolean} [force=false] - If `force` is true then the property will be set on the child regardless if it already exists or not. If false and the property doesn't exist, nothing will be set.
*/
Phaser.Group.prototype.setAllChildren = function (key, value, checkAlive, checkVisible, operation, force) {

    if (checkAlive === undefined) { checkAlive = false; }
    if (checkVisible === undefined) { checkVisible = false; }
    if (force === undefined) { force = false; }

    operation = operation || 0;

    for (var i = 0; i < this.children.length; i++)
    {
        if ((!checkAlive || (checkAlive && this.children[i].alive)) && (!checkVisible || (checkVisible && this.children[i].visible)))
        {
            if (this.children[i] instanceof Phaser.Group)
            {
                this.children[i].setAllChildren(key, value, checkAlive, checkVisible, operation, force);
            }
            else
            {
                this.setProperty(this.children[i], key.split('.'), value, operation, force);
            }
        }
    }

};

/**
* Quickly check that the same property across all children of this group is equal to the given value.
*
* This call doesn't descend down children, so if you have a Group inside of this group, the property will be checked on the group but not its children.
*
* @method Phaser.Group#checkAll
* @param {string} key - The property, as a string, to be set. For example: 'body.velocity.x'
* @param {any} value - The value that will be checked.
* @param {boolean} [checkAlive=false] - If set then only children with alive=true will be checked. This includes any Groups that are children.
* @param {boolean} [checkVisible=false] - If set then only children with visible=true will be checked. This includes any Groups that are children.
* @param {boolean} [force=false] - If `force` is true then the property will be checked on the child regardless if it already exists or not. If true and the property doesn't exist, false will be returned.
*/
Phaser.Group.prototype.checkAll = function (key, value, checkAlive, checkVisible, force) {

    if (checkAlive === undefined) { checkAlive = false; }
    if (checkVisible === undefined) { checkVisible = false; }
    if (force === undefined) { force = false; }

    for (var i = 0; i < this.children.length; i++)
    {
        if ((!checkAlive || (checkAlive && this.children[i].alive)) && (!checkVisible || (checkVisible && this.children[i].visible)))
        {
            if (!this.checkProperty(this.children[i], key, value, force))
            {
                return false;
            }
        }
    }

    return true;

};

/**
* Adds the amount to the given property on all children in this group.
*
* `Group.addAll('x', 10)` will add 10 to the child.x value for each child.
*
* @method Phaser.Group#addAll
* @param {string} property - The property to increment, for example 'body.velocity.x' or 'angle'.
* @param {number} amount - The amount to increment the property by. If child.x = 10 then addAll('x', 40) would make child.x = 50.
* @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
* @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
*/
Phaser.Group.prototype.addAll = function (property, amount, checkAlive, checkVisible) {

    this.setAll(property, amount, checkAlive, checkVisible, 1);

};

/**
* Subtracts the amount from the given property on all children in this group.
*
* `Group.subAll('x', 10)` will minus 10 from the child.x value for each child.
*
* @method Phaser.Group#subAll
* @param {string} property - The property to decrement, for example 'body.velocity.x' or 'angle'.
* @param {number} amount - The amount to subtract from the property. If child.x = 50 then subAll('x', 40) would make child.x = 10.
* @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
* @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
*/
Phaser.Group.prototype.subAll = function (property, amount, checkAlive, checkVisible) {

    this.setAll(property, amount, checkAlive, checkVisible, 2);

};

/**
* Multiplies the given property by the amount on all children in this group.
*
* `Group.multiplyAll('x', 2)` will x2 the child.x value for each child.
*
* @method Phaser.Group#multiplyAll
* @param {string} property - The property to multiply, for example 'body.velocity.x' or 'angle'.
* @param {number} amount - The amount to multiply the property by. If child.x = 10 then multiplyAll('x', 2) would make child.x = 20.
* @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
* @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
*/
Phaser.Group.prototype.multiplyAll = function (property, amount, checkAlive, checkVisible) {

    this.setAll(property, amount, checkAlive, checkVisible, 3);

};

/**
* Divides the given property by the amount on all children in this group.
*
* `Group.divideAll('x', 2)` will half the child.x value for each child.
*
* @method Phaser.Group#divideAll
* @param {string} property - The property to divide, for example 'body.velocity.x' or 'angle'.
* @param {number} amount - The amount to divide the property by. If child.x = 100 then divideAll('x', 2) would make child.x = 50.
* @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
* @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
*/
Phaser.Group.prototype.divideAll = function (property, amount, checkAlive, checkVisible) {

    this.setAll(property, amount, checkAlive, checkVisible, 4);

};

/**
* Calls a function, specified by name, on all children in the group who exist (or do not exist).
*
* After the existsValue parameter you can add as many parameters as you like, which will all be passed to the child callback.
*
* @method Phaser.Group#callAllExists
* @param {string} callback - Name of the function on the children to call.
* @param {boolean} existsValue - Only children with exists=existsValue will be called.
* @param {...any} parameter - Additional parameters that will be passed to the callback.
*/
Phaser.Group.prototype.callAllExists = function (callback, existsValue) {

    var args;

    if (arguments.length > 2)
    {
        args = [];

        for (var i = 2; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }
    }

    for (var i = 0; i < this.children.length; i++)
    {
        if (this.children[i].exists === existsValue && this.children[i][callback])
        {
            this.children[i][callback].apply(this.children[i], args);
        }
    }

};

/**
* Returns a reference to a function that exists on a child of the group based on the given callback array.
*
* @method Phaser.Group#callbackFromArray
* @param {object} child - The object to inspect.
* @param {array} callback - The array of function names.
* @param {integer} length - The size of the array (pre-calculated in callAll).
* @protected
*/
Phaser.Group.prototype.callbackFromArray = function (child, callback, length) {

    //  Kinda looks like a Christmas tree

    if (length === 1)
    {
        if (child[callback[0]])
        {
            return child[callback[0]];
        }
    }
    else if (length === 2)
    {
        if (child[callback[0]][callback[1]])
        {
            return child[callback[0]][callback[1]];
        }
    }
    else if (length === 3)
    {
        if (child[callback[0]][callback[1]][callback[2]])
        {
            return child[callback[0]][callback[1]][callback[2]];
        }
    }
    else if (length === 4)
    {
        if (child[callback[0]][callback[1]][callback[2]][callback[3]])
        {
            return child[callback[0]][callback[1]][callback[2]][callback[3]];
        }
    }
    else if (child[callback])
    {
        return child[callback];
    }

    return false;

};

/**
* Calls a function, specified by name, on all on children.
*
* The function is called for all children regardless if they are dead or alive (see callAllExists for different options).
* After the method parameter and context you can add as many extra parameters as you like, which will all be passed to the child.
*
* @method Phaser.Group#callAll
* @param {string} method - Name of the function on the child to call. Deep property lookup is supported.
* @param {string} [context=null] - A string containing the context under which the method will be executed. Set to null to default to the child.
* @param {...any} args - Additional parameters that will be passed to the method.
*/
Phaser.Group.prototype.callAll = function (method, context) {

    if (method === undefined)
    {
        return;
    }

    //  Extract the method into an array
    method = method.split('.');

    var methodLength = method.length;

    if (context === undefined || context === null || context === '')
    {
        context = null;
    }
    else
    {
        //  Extract the context into an array
        if (typeof context === 'string')
        {
            context = context.split('.');
            var contextLength = context.length;
        }
    }

    var args;

    if (arguments.length > 2)
    {
        args = [];

        for (var i = 2; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }
    }

    var callback = null;
    var callbackContext = null;

    for (var i = 0; i < this.children.length; i++)
    {
        callback = this.callbackFromArray(this.children[i], method, methodLength);

        if (context && callback)
        {
            callbackContext = this.callbackFromArray(this.children[i], context, contextLength);

            if (callback)
            {
                callback.apply(callbackContext, args);
            }
        }
        else if (callback)
        {
            callback.apply(this.children[i], args);
        }
    }

};

/**
* The core preUpdate - as called by World.
* @method Phaser.Group#preUpdate
* @protected
*/
Phaser.Group.prototype.preUpdate = function () {

    if (this.pendingDestroy)
    {
        this.destroy();
        return false;
    }

    if (!this.exists || !this.parent.exists)
    {
        this.renderOrderID = -1;
        return false;
    }

    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i].preUpdate();
    }

    return true;

};

/**
* The core update - as called by World.
* @method Phaser.Group#update
* @protected
*/
Phaser.Group.prototype.update = function () {

    //  Goes in reverse, because it's highly likely the child will destroy itself in `update`
    var i = this.children.length;

    while (i--)
    {
        this.children[i].update();
    }

};

/**
* The core postUpdate - as called by World.
* @method Phaser.Group#postUpdate
* @protected
*/
Phaser.Group.prototype.postUpdate = function () {

    //  Fixed to Camera?
    if (this.fixedToCamera)
    {
        this.x = (this.game.camera.view.x + this.cameraOffset.x) / this.game.camera.scale.x;
        this.y = (this.game.camera.view.y + this.cameraOffset.y) / this.game.camera.scale.y;
    }

    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i].postUpdate();
    }

};

/**
* Find children matching a certain predicate.
*
* For example:
*
*     var healthyList = Group.filter(function(child, index, children) {
*         return child.health > 10 ? true : false;
*     }, true);
*     healthyList.callAll('attack');
*
* Note: Currently this will skip any children which are Groups themselves.
*
* @method Phaser.Group#filter
* @param {function} predicate - The function that each child will be evaluated against. Each child of the group will be passed to it as its first parameter, the index as the second, and the entire child array as the third
* @param {boolean} [checkExists=false] - If true, only existing can be selected; otherwise all children can be selected and will be passed to the predicate.
* @return {Phaser.ArraySet} Returns an array list containing all the children that the predicate returned true for
*/
Phaser.Group.prototype.filter = function (predicate, checkExists) {

    var index = -1;
    var length = this.children.length;
    var results = [];

    while (++index < length)
    {
        var child = this.children[index];

        if (!checkExists || (checkExists && child.exists))
        {
            if (predicate(child, index, this.children))
            {
                results.push(child);
            }
        }
    }

    return new Phaser.ArraySet(results);

};

/**
* Call a function on each child in this group.
*
* Additional arguments for the callback can be specified after the `checkExists` parameter. For example,
*
*     Group.forEach(awardBonusGold, this, true, 100, 500)
*
* would invoke `awardBonusGold` function with the parameters `(child, 100, 500)`.
*
* Note: This check will skip any children which are Groups themselves.
*
* @method Phaser.Group#forEach
* @param {function} callback - The function that will be called for each applicable child. The child will be passed as the first argument.
* @param {object} callbackContext - The context in which the function should be called (usually 'this').
* @param {boolean} [checkExists=false] - If set only children matching for which `exists` is true will be passed to the callback, otherwise all children will be passed.
* @param {...any} [args=(none)] - Additional arguments to pass to the callback function, after the child item.
*/
Phaser.Group.prototype.forEach = function (callback, callbackContext, checkExists) {

    if (checkExists === undefined) { checkExists = false; }

    if (arguments.length <= 3)
    {
        for (var i = 0; i < this.children.length; i++)
        {
            if (!checkExists || (checkExists && this.children[i].exists))
            {
                callback.call(callbackContext, this.children[i]);
            }
        }
    }
    else
    {
        // Assigning to arguments properties causes Extreme Deoptimization in Chrome, FF, and IE.
        // Using an array and pushing each element (not a slice!) is _significantly_ faster.
        var args = [null];

        for (var i = 3; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        for (var i = 0; i < this.children.length; i++)
        {
            if (!checkExists || (checkExists && this.children[i].exists))
            {
                args[0] = this.children[i];
                callback.apply(callbackContext, args);
            }
        }
    }

};

/**
* Call a function on each existing child in this group.
*
* See {@link Phaser.Group#forEach forEach} for details.
*
* @method Phaser.Group#forEachExists
* @param {function} callback - The function that will be called for each applicable child. The child will be passed as the first argument.
* @param {object} callbackContext - The context in which the function should be called (usually 'this').
* @param {...any} [args=(none)] - Additional arguments to pass to the callback function, after the child item.
*/
Phaser.Group.prototype.forEachExists = function (callback, callbackContext) {

    var args;

    if (arguments.length > 2)
    {
        args = [null];

        for (var i = 2; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }
    }

    this.iterate('exists', true, Phaser.Group.RETURN_TOTAL, callback, callbackContext, args);

};

/**
* Call a function on each alive child in this group.
*
* See {@link Phaser.Group#forEach forEach} for details.
*
* @method Phaser.Group#forEachAlive
* @param {function} callback - The function that will be called for each applicable child. The child will be passed as the first argument.
* @param {object} callbackContext - The context in which the function should be called (usually 'this').
* @param {...any} [args=(none)] - Additional arguments to pass to the callback function, after the child item.
*/
Phaser.Group.prototype.forEachAlive = function (callback, callbackContext) {

    var args;

    if (arguments.length > 2)
    {
        args = [null];

        for (var i = 2; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }
    }

    this.iterate('alive', true, Phaser.Group.RETURN_TOTAL, callback, callbackContext, args);

};

/**
* Call a function on each dead child in this group.
*
* See {@link Phaser.Group#forEach forEach} for details.
*
* @method Phaser.Group#forEachDead
* @param {function} callback - The function that will be called for each applicable child. The child will be passed as the first argument.
* @param {object} callbackContext - The context in which the function should be called (usually 'this').
* @param {...any} [args=(none)] - Additional arguments to pass to the callback function, after the child item.
*/
Phaser.Group.prototype.forEachDead = function (callback, callbackContext) {

    var args;

    if (arguments.length > 2)
    {
        args = [null];

        for (var i = 2; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }
    }

    this.iterate('alive', false, Phaser.Group.RETURN_TOTAL, callback, callbackContext, args);

};

/**
* Sort the children in the group according to a particular key and ordering.
*
* Call this function to sort the group according to a particular key value and order.
* 
* For example to depth sort Sprites for Zelda-style game you might call `group.sort('y', Phaser.Group.SORT_ASCENDING)` at the bottom of your `State.update()`.
*
* Internally this uses a standard JavaScript Array sort, so everything that applies there also applies here, including
* alphabetical sorting, mixing strings and numbers, and Unicode sorting. See MDN for more details.
*
* @method Phaser.Group#sort
* @param {string} [key='z'] - The name of the property to sort on. Defaults to the objects z-depth value.
* @param {integer} [order=Phaser.Group.SORT_ASCENDING] - Order ascending ({@link Phaser.Group.SORT_ASCENDING SORT_ASCENDING}) or descending ({@link Phaser.Group.SORT_DESCENDING SORT_DESCENDING}).
*/
Phaser.Group.prototype.sort = function (key, order) {

    if (this.children.length < 2)
    {
        //  Nothing to swap
        return;
    }

    if (key === undefined) { key = 'z'; }
    if (order === undefined) { order = Phaser.Group.SORT_ASCENDING; }

    this._sortProperty = key;

    if (order === Phaser.Group.SORT_ASCENDING)
    {
        this.children.sort(this.ascendingSortHandler.bind(this));
    }
    else
    {
        this.children.sort(this.descendingSortHandler.bind(this));
    }

    this.updateZ();

};

/**
* Sort the children in the group according to custom sort function.
*
* The `sortHandler` is provided the two parameters: the two children involved in the comparison (a and b).
* It should return -1 if `a > b`, 1 if `a < b` or 0 if `a === b`.
*
* @method Phaser.Group#customSort
* @param {function} sortHandler - The custom sort function.
* @param {object} [context=undefined] - The context in which the sortHandler is called.
*/
Phaser.Group.prototype.customSort = function (sortHandler, context) {

    if (this.children.length < 2)
    {
        //  Nothing to swap
        return;
    }

    this.children.sort(sortHandler.bind(context));

    this.updateZ();

};

/**
* An internal helper function for the sort process.
*
* @method Phaser.Group#ascendingSortHandler
* @protected
* @param {object} a - The first object being sorted.
* @param {object} b - The second object being sorted.
*/
Phaser.Group.prototype.ascendingSortHandler = function (a, b) {

    if (a[this._sortProperty] < b[this._sortProperty])
    {
        return -1;
    }
    else if (a[this._sortProperty] > b[this._sortProperty])
    {
        return 1;
    }
    else
    {
        if (a.z < b.z)
        {
            return -1;
        }
        else
        {
            return 1;
        }
    }

};

/**
* An internal helper function for the sort process.
*
* @method Phaser.Group#descendingSortHandler
* @protected
* @param {object} a - The first object being sorted.
* @param {object} b - The second object being sorted.
*/
Phaser.Group.prototype.descendingSortHandler = function (a, b) {

    if (a[this._sortProperty] < b[this._sortProperty])
    {
        return 1;
    }
    else if (a[this._sortProperty] > b[this._sortProperty])
    {
        return -1;
    }
    else
    {
        return 0;
    }

};

/**
* Iterates over the children of the group performing one of several actions for matched children.
*
* A child is considered a match when it has a property, named `key`, whose value is equal to `value`
* according to a strict equality comparison.
*
* The result depends on the `returnType`:
*
* - {@link Phaser.Group.RETURN_TOTAL RETURN_TOTAL}:
*     The callback, if any, is applied to all matching children. The number of matched children is returned.
* - {@link Phaser.Group.RETURN_NONE RETURN_NONE}:
*     The callback, if any, is applied to all matching children. No value is returned.
* - {@link Phaser.Group.RETURN_CHILD RETURN_CHILD}:
*     The callback, if any, is applied to the *first* matching child and the *first* matched child is returned.
*     If there is no matching child then null is returned.
*
* If `args` is specified it must be an array. The matched child will be assigned to the first
* element and the entire array will be applied to the callback function.
*
* @method Phaser.Group#iterate
* @param {string} key - The child property to check, i.e. 'exists', 'alive', 'health'
* @param {any} value - A child matches if `child[key] === value` is true.
* @param {integer} returnType - How to iterate the children and what to return.
* @param {function} [callback=null] - Optional function that will be called on each matching child. The matched child is supplied as the first argument.
* @param {object} [callbackContext] - The context in which the function should be called (usually 'this').
* @param {any[]} [args=(none)] - The arguments supplied to to the callback; the first array index (argument) will be replaced with the matched child.
* @return {any} Returns either an integer (for RETURN_TOTAL), the first matched child (for RETURN_CHILD), or null.
*/
Phaser.Group.prototype.iterate = function (key, value, returnType, callback, callbackContext, args) {

    if (this.children.length === 0)
    {
        if (returnType === Phaser.Group.RETURN_TOTAL)
        {
            return 0;
        }
        else if (returnType === Phaser.Group.RETURN_ALL)
        {
            return [];
        }
    }

    var total = 0;

    if (returnType === Phaser.Group.RETURN_ALL)
    {
        var output = [];
    }

    for (var i = 0; i < this.children.length; i++)
    {
        if (this.children[i][key] === value)
        {
            total++;

            if (callback)
            {
                if (args)
                {
                    args[0] = this.children[i];
                    callback.apply(callbackContext, args);
                }
                else
                {
                    callback.call(callbackContext, this.children[i]);
                }
            }

            if (returnType === Phaser.Group.RETURN_CHILD)
            {
                return this.children[i];
            }
            else if (returnType === Phaser.Group.RETURN_ALL)
            {
                output.push(this.children[i]);
            }
        }
    }

    if (returnType === Phaser.Group.RETURN_TOTAL)
    {
        return total;
    }
    else if (returnType === Phaser.Group.RETURN_ALL)
    {
        return output;
    }
    else
    {
        //  RETURN_CHILD or RETURN_NONE
        return null;
    }

};

/**
* Get the first display object that exists, or doesn't exist.
* 
* You can use the optional argument `createIfNull` to create a new Game Object if none matching your exists argument were found in this Group.
*
* It works by calling `Group.create` passing it the parameters given to this method, and returning the new child.
*
* If a child *was* found , `createIfNull` is `false` and you provided the additional arguments then the child
* will be reset and/or have a new texture loaded on it. This is handled by `Group.resetChild`.
*
* @method Phaser.Group#getFirstExists
* @param {boolean} [exists=true] - If true, find the first existing child; otherwise find the first non-existing child.
* @param {boolean} [createIfNull=false] - If `true` and no alive children are found a new one is created.
* @param {number} [x] - The x coordinate to reset the child to. The value is in relation to the group.x point.
* @param {number} [y] - The y coordinate to reset the child to. The value is in relation to the group.y point.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} [key] - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache Image entry, or an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
* @param {string|number} [frame] - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
* @return {DisplayObject} The first child, or `null` if none found and `createIfNull` was false.
*/
Phaser.Group.prototype.getFirstExists = function (exists, createIfNull, x, y, key, frame) {

    if (createIfNull === undefined) { createIfNull = false; }

    if (typeof exists !== 'boolean')
    {
        exists = true;
    }

    var child = this.iterate('exists', exists, Phaser.Group.RETURN_CHILD);

    return (child === null && createIfNull) ? this.create(x, y, key, frame) : this.resetChild(child, x, y, key, frame);

};

/**
* Get the first child that is alive (`child.alive === true`).
*
* This is handy for choosing a squad leader, etc.
*
* You can use the optional argument `createIfNull` to create a new Game Object if no alive ones were found in this Group.
*
* It works by calling `Group.create` passing it the parameters given to this method, and returning the new child.
*
* If a child *was* found , `createIfNull` is `false` and you provided the additional arguments then the child
* will be reset and/or have a new texture loaded on it. This is handled by `Group.resetChild`.
*
* @method Phaser.Group#getFirstAlive
* @param {boolean} [createIfNull=false] - If `true` and no alive children are found a new one is created.
* @param {number} [x] - The x coordinate to reset the child to. The value is in relation to the group.x point.
* @param {number} [y] - The y coordinate to reset the child to. The value is in relation to the group.y point.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} [key] - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache Image entry, or an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
* @param {string|number} [frame] - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
* @return {DisplayObject} The alive dead child, or `null` if none found and `createIfNull` was false.
*/
Phaser.Group.prototype.getFirstAlive = function (createIfNull, x, y, key, frame) {

    if (createIfNull === undefined) { createIfNull = false; }

    var child = this.iterate('alive', true, Phaser.Group.RETURN_CHILD);

    return (child === null && createIfNull) ? this.create(x, y, key, frame) : this.resetChild(child, x, y, key, frame);

};

/**
* Get the first child that is dead (`child.alive === false`).
*
* This is handy for checking if everything has been wiped out and adding to the pool as needed.
*
* You can use the optional argument `createIfNull` to create a new Game Object if no dead ones were found in this Group.
*
* It works by calling `Group.create` passing it the parameters given to this method, and returning the new child.
*
* If a child *was* found , `createIfNull` is `false` and you provided the additional arguments then the child
* will be reset and/or have a new texture loaded on it. This is handled by `Group.resetChild`.
*
* @method Phaser.Group#getFirstDead
* @param {boolean} [createIfNull=false] - If `true` and no dead children are found a new one is created.
* @param {number} [x] - The x coordinate to reset the child to. The value is in relation to the group.x point.
* @param {number} [y] - The y coordinate to reset the child to. The value is in relation to the group.y point.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} [key] - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache Image entry, or an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
* @param {string|number} [frame] - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
* @return {DisplayObject} The first dead child, or `null` if none found and `createIfNull` was false.
*/
Phaser.Group.prototype.getFirstDead = function (createIfNull, x, y, key, frame) {

    if (createIfNull === undefined) { createIfNull = false; }

    var child = this.iterate('alive', false, Phaser.Group.RETURN_CHILD);

    return (child === null && createIfNull) ? this.create(x, y, key, frame) : this.resetChild(child, x, y, key, frame);

};

/**
* Takes a child and if the `x` and `y` arguments are given it calls `child.reset(x, y)` on it.
*
* If the `key` and optionally the `frame` arguments are given, it calls `child.loadTexture(key, frame)` on it.
*
* The two operations are separate. For example if you just wish to load a new texture then pass `null` as the x and y values.
*
* @method Phaser.Group#resetChild
* @param {DisplayObject} child - The child to reset and/or load the texture on.
* @param {number} [x] - The x coordinate to reset the child to. The value is in relation to the group.x point.
* @param {number} [y] - The y coordinate to reset the child to. The value is in relation to the group.y point.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} [key] - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache Image entry, or an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
* @param {string|number} [frame] - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
* @return {DisplayObject} The child that was reset: usually a {@link Phaser.Sprite}.
*/
Phaser.Group.prototype.resetChild = function (child, x, y, key, frame) {

    if (child === null)
    {
        return null;
    }

    if (x === undefined) { x = null; }
    if (y === undefined) { y = null; }

    if (x !== null && y !== null)
    {
        child.reset(x, y);
    }

    if (key !== undefined)
    {
        child.loadTexture(key, frame);
    }

    return child;

};

/**
* Return the child at the top of this group.
*
* The top child is the child displayed (rendered) above every other child.
*
* @method Phaser.Group#getTop
* @return {any} The child at the top of the Group.
*/
Phaser.Group.prototype.getTop = function () {

    if (this.children.length > 0)
    {
        return this.children[this.children.length - 1];
    }

};

/**
* Returns the child at the bottom of this group.
*
* The bottom child the child being displayed (rendered) below every other child.
*
* @method Phaser.Group#getBottom
* @return {any} The child at the bottom of the Group.
*/
Phaser.Group.prototype.getBottom = function () {

    if (this.children.length > 0)
    {
        return this.children[0];
    }

};

/**
* Get the closest child to given Object, with optional callback to filter children.
*
* This can be a Sprite, Group, Image or any object with public x and y properties.
*
* 'close' is determined by the distance from the objects `x` and `y` properties compared to the childs `x` and `y` properties.
*
* You can use the optional `callback` argument to apply your own filter to the distance checks.
* If the child is closer then the previous child, it will be sent to `callback` as the first argument,
* with the distance as the second. The callback should return `true` if it passes your 
* filtering criteria, otherwise it should return `false`.
*
* @method Phaser.Group#getClosestTo
* @param {any} object - The object used to determine the distance. This can be a Sprite, Group, Image or any object with public x and y properties.
* @param {function} [callback] - The function that each child will be evaluated against. Each child of the group will be passed to it as its first parameter, with the distance as the second. It should return `true` if the child passes the matching criteria.
* @param {object} [callbackContext] - The context in which the function should be called (usually 'this').
* @return {any} The child closest to given object, or `null` if no child was found.
*/
Phaser.Group.prototype.getClosestTo = function (object, callback, callbackContext) {

    var distance = Number.MAX_VALUE;
    var tempDistance = 0;
    var result = null;

    for (var i = 0; i < this.children.length; i++)
    {
        var child = this.children[i];

        if (child.exists)
        {
            tempDistance = Math.abs(Phaser.Point.distance(object, child));

            if (tempDistance < distance && (!callback || callback.call(callbackContext, child, tempDistance)))
            {
                distance = tempDistance;
                result = child;
            }
        }
    }

    return result;

};

/**
* Get the child furthest away from the given Object, with optional callback to filter children.
*
* This can be a Sprite, Group, Image or any object with public x and y properties.
*
* 'furthest away' is determined by the distance from the objects `x` and `y` properties compared to the childs `x` and `y` properties.
*
* You can use the optional `callback` argument to apply your own filter to the distance checks.
* If the child is closer then the previous child, it will be sent to `callback` as the first argument,
* with the distance as the second. The callback should return `true` if it passes your 
* filtering criteria, otherwise it should return `false`.
*
* @method Phaser.Group#getFurthestFrom
* @param {any} object - The object used to determine the distance. This can be a Sprite, Group, Image or any object with public x and y properties.
* @param {function} [callback] - The function that each child will be evaluated against. Each child of the group will be passed to it as its first parameter, with the distance as the second. It should return `true` if the child passes the matching criteria.
* @param {object} [callbackContext] - The context in which the function should be called (usually 'this').
* @return {any} The child furthest from the given object, or `null` if no child was found.
*/
Phaser.Group.prototype.getFurthestFrom = function (object, callback, callbackContext) {

    var distance = 0;
    var tempDistance = 0;
    var result = null;

    for (var i = 0; i < this.children.length; i++)
    {
        var child = this.children[i];

        if (child.exists)
        {
            tempDistance = Math.abs(Phaser.Point.distance(object, child));

            if (tempDistance > distance && (!callback || callback.call(callbackContext, child, tempDistance)))
            {
                distance = tempDistance;
                result = child;
            }
        }
    }

    return result;

};

/**
* Get the number of living children in this group.
*
* @method Phaser.Group#countLiving
* @return {integer} The number of children flagged as alive.
*/
Phaser.Group.prototype.countLiving = function () {

    return this.iterate('alive', true, Phaser.Group.RETURN_TOTAL);

};

/**
* Get the number of dead children in this group.
*
* @method Phaser.Group#countDead
* @return {integer} The number of children flagged as dead.
*/
Phaser.Group.prototype.countDead = function () {

    return this.iterate('alive', false, Phaser.Group.RETURN_TOTAL);

};

/**
* Returns a random child from the group.
*
* @method Phaser.Group#getRandom
* @param {integer} [startIndex=0] - Offset from the front of the group (lowest child).
* @param {integer} [length=(to top)] - Restriction on the number of values you want to randomly select from.
* @return {any} A random child of this Group.
*/
Phaser.Group.prototype.getRandom = function (startIndex, length) {

    if (startIndex === undefined) { startIndex = 0; }
    if (length === undefined) { length = this.children.length; }

    if (length === 0)
    {
        return null;
    }

    return Phaser.ArrayUtils.getRandomItem(this.children, startIndex, length);

};

/**
* Returns a random child from the Group that has `exists` set to `true`.
*
* Optionally you can specify a start and end index. For example if this Group had 100 children,
* and you set `startIndex` to 0 and `endIndex` to 50, it would return a random child from only
* the first 50 children in the Group.
*
* @method Phaser.Group#getRandomExists
* @param {integer} [startIndex=0] - The first child index to start the search from.
* @param {integer} [endIndex] - The last child index to search up to.
* @return {any} A random child of this Group that exists.
*/
Phaser.Group.prototype.getRandomExists = function (startIndex, endIndex) {

    var list = this.getAll('exists', true, startIndex, endIndex);

    return this.game.rnd.pick(list);

};

/**
* Returns all children in this Group.
*
* You can optionally specify a matching criteria using the `property` and `value` arguments.
*
* For example: `getAll('exists', true)` would return only children that have their exists property set.
*
* Optionally you can specify a start and end index. For example if this Group had 100 children,
* and you set `startIndex` to 0 and `endIndex` to 50, it would return matches from only
* the first 50 children in the Group.
*
* @method Phaser.Group#getAll
* @param {string} [property] - An optional property to test against the value argument.
* @param {any} [value] - If property is set then Child.property must strictly equal this value to be included in the results.
* @param {integer} [startIndex=0] - The first child index to start the search from.
* @param {integer} [endIndex] - The last child index to search up until.
* @return {any} A random existing child of this Group.
*/
Phaser.Group.prototype.getAll = function (property, value, startIndex, endIndex) {

    if (startIndex === undefined) { startIndex = 0; }
    if (endIndex === undefined) { endIndex = this.children.length; }

    var output = [];

    for (var i = startIndex; i < endIndex; i++)
    {
        var child = this.children[i];

        if (property && child[property] === value)
        {
            output.push(child);
        }
    }

    return output;

};

/**
* Removes the given child from this group.
*
* This will dispatch an `onRemovedFromGroup` event from the child (if it has one), and optionally destroy the child.
*
* If the group cursor was referring to the removed child it is updated to refer to the next child.
*
* @method Phaser.Group#remove
* @param {any} child - The child to remove.
* @param {boolean} [destroy=false] - If true `destroy` will be invoked on the removed child.
* @param {boolean} [silent=false] - If true the the child will not dispatch the `onRemovedFromGroup` event.
* @return {boolean} true if the child was removed from this group, otherwise false.
*/
Phaser.Group.prototype.remove = function (child, destroy, silent) {

    if (destroy === undefined) { destroy = false; }
    if (silent === undefined) { silent = false; }

    if (this.children.length === 0 || this.children.indexOf(child) === -1)
    {
        return false;
    }

    if (!silent && child.events && !child.destroyPhase)
    {
        child.events.onRemovedFromGroup$dispatch(child, this);
    }

    var removed = this.removeChild(child);

    this.removeFromHash(child);

    this.updateZ();

    if (this.cursor === child)
    {
        this.next();
    }

    if (destroy && removed)
    {
        removed.destroy(true);
    }

    return true;

};

/**
* Moves all children from this Group to the Group given.
*
* @method Phaser.Group#moveAll
* @param {Phaser.Group} group - The new Group to which the children will be moved to.
* @param {boolean} [silent=false] - If true the children will not dispatch the `onAddedToGroup` event for the new Group.
* @return {Phaser.Group} The Group to which all the children were moved.
*/
Phaser.Group.prototype.moveAll = function (group, silent) {

    if (silent === undefined) { silent = false; }

    if (this.children.length > 0 && group instanceof Phaser.Group)
    {
        do
        {
            group.add(this.children[0], silent);
        }
        while (this.children.length > 0);

        this.hash = [];

        this.cursor = null;
    }

    return group;

};

/**
* Removes all children from this Group, but does not remove the group from its parent.
*
* The children can be optionally destroyed as they are removed.
* 
* You can also optionally also destroy the BaseTexture the Child is using. Be careful if you've
* more than one Game Object sharing the same BaseTexture.
*
* @method Phaser.Group#removeAll
* @param {boolean} [destroy=false] - If true `destroy` will be invoked on each removed child.
* @param {boolean} [silent=false] - If true the children will not dispatch their `onRemovedFromGroup` events.
* @param {boolean} [destroyTexture=false] - If true, and if the `destroy` argument is also true, the BaseTexture belonging to the Child is also destroyed. Note that if another Game Object is sharing the same BaseTexture it will invalidate it.
*/
Phaser.Group.prototype.removeAll = function (destroy, silent, destroyTexture) {

    if (destroy === undefined) { destroy = false; }
    if (silent === undefined) { silent = false; }
    if (destroyTexture === undefined) { destroyTexture = false; }

    if (this.children.length === 0)
    {
        return;
    }

    do
    {
        if (!silent && this.children[0].events)
        {
            this.children[0].events.onRemovedFromGroup$dispatch(this.children[0], this);
        }

        var removed = this.removeChild(this.children[0]);

        this.removeFromHash(removed);

        if (destroy && removed)
        {
            removed.destroy(true, destroyTexture);
        }
    }
    while (this.children.length > 0);

    this.hash = [];

    this.cursor = null;

};

/**
* Removes all children from this group whose index falls between the given startIndex and endIndex values.
*
* @method Phaser.Group#removeBetween
* @param {integer} startIndex - The index to start removing children from.
* @param {integer} [endIndex] - The index to stop removing children at. Must be higher than startIndex. If undefined this method will remove all children between startIndex and the end of the group.
* @param {boolean} [destroy=false] - If true `destroy` will be invoked on each removed child.
* @param {boolean} [silent=false] - If true the children will not dispatch their `onRemovedFromGroup` events.
*/
Phaser.Group.prototype.removeBetween = function (startIndex, endIndex, destroy, silent) {

    if (endIndex === undefined) { endIndex = this.children.length - 1; }
    if (destroy === undefined) { destroy = false; }
    if (silent === undefined) { silent = false; }

    if (this.children.length === 0)
    {
        return;
    }

    if (startIndex > endIndex || startIndex < 0 || endIndex > this.children.length)
    {
        return false;
    }

    var i = endIndex;

    while (i >= startIndex)
    {
        if (!silent && this.children[i].events)
        {
            this.children[i].events.onRemovedFromGroup$dispatch(this.children[i], this);
        }

        var removed = this.removeChild(this.children[i]);

        this.removeFromHash(removed);

        if (destroy && removed)
        {
            removed.destroy(true);
        }

        if (this.cursor === this.children[i])
        {
            this.cursor = null;
        }

        i--;
    }

    this.updateZ();

};

/**
* Destroys this group.
*
* Removes all children, then removes this group from its parent and nulls references.
*
* @method Phaser.Group#destroy
* @param {boolean} [destroyChildren=true] - If true `destroy` will be invoked on each removed child.
* @param {boolean} [soft=false] - A 'soft destroy' (set to true) doesn't remove this group from its parent or null the game reference. Set to false and it does.
*/
Phaser.Group.prototype.destroy = function (destroyChildren, soft) {

    if (this.game === null || this.ignoreDestroy) { return; }

    if (destroyChildren === undefined) { destroyChildren = true; }
    if (soft === undefined) { soft = false; }

    this.onDestroy.dispatch(this, destroyChildren, soft);

    this.removeAll(destroyChildren);

    this.cursor = null;
    this.filters = null;
    this.pendingDestroy = false;

    if (!soft)
    {
        if (this.parent)
        {
            this.parent.removeChild(this);
        }

        this.game = null;
        this.exists = false;
    }

};

/**
* Total number of existing children in the group.
*
* @name Phaser.Group#total
* @property {integer} total
* @readonly
*/
Object.defineProperty(Phaser.Group.prototype, "total", {

    get: function () {

        return this.iterate('exists', true, Phaser.Group.RETURN_TOTAL);

    }

});

/**
* Total number of children in this group, regardless of exists/alive status.
*
* @name Phaser.Group#length
* @property {integer} length 
* @readonly
*/
Object.defineProperty(Phaser.Group.prototype, "length", {

    get: function () {

        return this.children.length;

    }

});

/**
* The angle of rotation of the group container, in degrees.
*
* This adjusts the group itself by modifying its local rotation transform.
*
* This has no impact on the rotation/angle properties of the children, but it will update their worldTransform
* and on-screen orientation and position.
*
* @name Phaser.Group#angle
* @property {number} angle
*/
Object.defineProperty(Phaser.Group.prototype, "angle", {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

/**
* The center x coordinate of this Group.
*
* It is derived by calling `getBounds`, calculating the Groups dimensions based on its
* visible children.
* 
* @name Phaser.Group#centerX
* @property {number} centerX
*/
Object.defineProperty(Phaser.Group.prototype, "centerX", {

    get: function () {

        return this.getBounds(this.parent).centerX;

    },

    set: function (value) {

        var r = this.getBounds(this.parent);
        var offset = this.x - r.x;

        this.x = (value + offset) - r.halfWidth;

    }

});

/**
* The center y coordinate of this Group.
*
* It is derived by calling `getBounds`, calculating the Groups dimensions based on its
* visible children.
* 
* @name Phaser.Group#centerY
* @property {number} centerY
*/
Object.defineProperty(Phaser.Group.prototype, "centerY", {

    get: function () {

        return this.getBounds(this.parent).centerY;

    },

    set: function (value) {

        var r = this.getBounds(this.parent);
        var offset = this.y - r.y;

        this.y = (value + offset) - r.halfHeight;

    }

});

/**
* The left coordinate of this Group.
*
* It is derived by calling `getBounds`, calculating the Groups dimensions based on its
* visible children.
* 
* @name Phaser.Group#left
* @property {number} left
*/
Object.defineProperty(Phaser.Group.prototype, "left", {

    get: function () {

        return this.getBounds(this.parent).left;

    },

    set: function (value) {

        var r = this.getBounds(this.parent);
        var offset = this.x - r.x;

        this.x = value + offset;

    }

});

/**
* The right coordinate of this Group.
*
* It is derived by calling `getBounds`, calculating the Groups dimensions based on its
* visible children.
*
* @name Phaser.Group#right
* @property {number} right
*/
Object.defineProperty(Phaser.Group.prototype, "right", {

    get: function () {

        return this.getBounds(this.parent).right;

    },

    set: function (value) {

        var r = this.getBounds(this.parent);
        var offset = this.x - r.x;

        this.x = (value + offset) - r.width;

    }

});

/**
* The top coordinate of this Group.
*
* It is derived by calling `getBounds`, calculating the Groups dimensions based on its
* visible children.
*
* @name Phaser.Group#top
* @property {number} top
*/
Object.defineProperty(Phaser.Group.prototype, "top", {

    get: function () {

        return this.getBounds(this.parent).top;

    },

    set: function (value) {

        var r = this.getBounds(this.parent);
        var offset = this.y - r.y;

        this.y = (value + offset);

    }

});

/**
* The bottom coordinate of this Group.
*
* It is derived by calling `getBounds`, calculating the Groups dimensions based on its
* visible children.
* 
* @name Phaser.Group#bottom
* @property {number} bottom
*/
Object.defineProperty(Phaser.Group.prototype, "bottom", {

    get: function () {

        return this.getBounds(this.parent).bottom;

    },

    set: function (value) {

        var r = this.getBounds(this.parent);
        var offset = this.y - r.y;

        this.y = (value + offset) - r.height;

    }

});

/**
* Aligns this Group within another Game Object, or Rectangle, known as the
* 'container', to one of 9 possible positions.
*
* The container must be a Game Object, or Phaser.Rectangle object. This can include properties
* such as `World.bounds` or `Camera.view`, for aligning Groups within the world 
* and camera bounds. Or it can include other Sprites, Images, Text objects, BitmapText,
* TileSprites or Buttons.
*
* Please note that aligning a Group to another Game Object does **not** make it a child of
* the container. It simply modifies its position coordinates so it aligns with it.
* 
* The position constants you can use are:
* 
* `Phaser.TOP_LEFT`, `Phaser.TOP_CENTER`, `Phaser.TOP_RIGHT`, `Phaser.LEFT_CENTER`, 
* `Phaser.CENTER`, `Phaser.RIGHT_CENTER`, `Phaser.BOTTOM_LEFT`, 
* `Phaser.BOTTOM_CENTER` and `Phaser.BOTTOM_RIGHT`.
*
* Groups are placed in such a way that their _bounds_ align with the
* container, taking into consideration rotation and scale of its children.
* This allows you to neatly align Groups, irrespective of their position value.
*
* The optional `offsetX` and `offsetY` arguments allow you to apply extra spacing to the final
* aligned position of the Group. For example:
*
* `group.alignIn(background, Phaser.BOTTOM_RIGHT, -20, -20)`
*
* Would align the `group` to the bottom-right, but moved 20 pixels in from the corner.
* Think of the offsets as applying an adjustment to the containers bounds before the alignment takes place.
* So providing a negative offset will 'shrink' the container bounds by that amount, and providing a positive
* one expands it.
*
* @method Phaser.Group#alignIn
* @param {Phaser.Rectangle|Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapText|Phaser.Button|Phaser.Graphics|Phaser.TileSprite} container - The Game Object or Rectangle with which to align this Group to. Can also include properties such as `World.bounds` or `Camera.view`.
* @param {integer} [position] - The position constant. One of `Phaser.TOP_LEFT` (default), `Phaser.TOP_CENTER`, `Phaser.TOP_RIGHT`, `Phaser.LEFT_CENTER`, `Phaser.CENTER`, `Phaser.RIGHT_CENTER`, `Phaser.BOTTOM_LEFT`, `Phaser.BOTTOM_CENTER` or `Phaser.BOTTOM_RIGHT`.
* @param {integer} [offsetX=0] - A horizontal adjustment of the Containers bounds, applied to the aligned position of the Game Object. Use a negative value to shrink the bounds, positive to increase it.
* @param {integer} [offsetY=0] - A vertical adjustment of the Containers bounds, applied to the aligned position of the Game Object. Use a negative value to shrink the bounds, positive to increase it.
* @return {Phaser.Group} This Group.
*/

//  This function is set at the bottom of src/gameobjects/components/Bounds.js

/**
* Aligns this Group to the side of another Game Object, or Rectangle, known as the
* 'parent', in one of 11 possible positions.
*
* The parent must be a Game Object, or Phaser.Rectangle object. This can include properties
* such as `World.bounds` or `Camera.view`, for aligning Groups within the world 
* and camera bounds. Or it can include other Sprites, Images, Text objects, BitmapText,
* TileSprites or Buttons.
*
* Please note that aligning a Group to another Game Object does **not** make it a child of
* the parent. It simply modifies its position coordinates so it aligns with it.
* 
* The position constants you can use are:
* 
* `Phaser.TOP_LEFT` (default), `Phaser.TOP_CENTER`, `Phaser.TOP_RIGHT`, `Phaser.LEFT_TOP`, 
* `Phaser.LEFT_CENTER`, `Phaser.LEFT_BOTTOM`, `Phaser.RIGHT_TOP`, `Phaser.RIGHT_CENTER`, 
* `Phaser.RIGHT_BOTTOM`, `Phaser.BOTTOM_LEFT`, `Phaser.BOTTOM_CENTER` 
* and `Phaser.BOTTOM_RIGHT`.
*
* Groups are placed in such a way that their _bounds_ align with the
* parent, taking into consideration rotation and scale of the children.
* This allows you to neatly align Groups, irrespective of their position value.
*
* The optional `offsetX` and `offsetY` arguments allow you to apply extra spacing to the final
* aligned position of the Group. For example:
*
* `group.alignTo(background, Phaser.BOTTOM_RIGHT, -20, -20)`
*
* Would align the `group` to the bottom-right, but moved 20 pixels in from the corner.
* Think of the offsets as applying an adjustment to the parents bounds before the alignment takes place.
* So providing a negative offset will 'shrink' the parent bounds by that amount, and providing a positive
* one expands it.
*
* @method Phaser.Group#alignTo
* @param {Phaser.Rectangle|Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapText|Phaser.Button|Phaser.Graphics|Phaser.TileSprite} parent - The Game Object or Rectangle with which to align this Group to. Can also include properties such as `World.bounds` or `Camera.view`.
* @param {integer} [position] - The position constant. One of `Phaser.TOP_LEFT`, `Phaser.TOP_CENTER`, `Phaser.TOP_RIGHT`, `Phaser.LEFT_TOP`, `Phaser.LEFT_CENTER`, `Phaser.LEFT_BOTTOM`, `Phaser.RIGHT_TOP`, `Phaser.RIGHT_CENTER`, `Phaser.RIGHT_BOTTOM`, `Phaser.BOTTOM_LEFT`, `Phaser.BOTTOM_CENTER` or `Phaser.BOTTOM_RIGHT`.
* @param {integer} [offsetX=0] - A horizontal adjustment of the Containers bounds, applied to the aligned position of the Game Object. Use a negative value to shrink the bounds, positive to increase it.
* @param {integer} [offsetY=0] - A vertical adjustment of the Containers bounds, applied to the aligned position of the Game Object. Use a negative value to shrink the bounds, positive to increase it.
* @return {Phaser.Group} This Group.
*/

//  This function is set at the bottom of src/gameobjects/components/Bounds.js

/**
* A display object is any object that can be rendered in the Phaser/pixi.js scene graph.
*
* This includes {@link Phaser.Group} (groups are display objects!),
* {@link Phaser.Sprite}, {@link Phaser.Button}, {@link Phaser.Text}
* as well as {@link PIXI.DisplayObject} and all derived types.
*
* @typedef {object} DisplayObject
*/
// Documentation stub for linking.

/**
* The x coordinate of the group container.
*
* You can adjust the group container itself by modifying its coordinates.
* This will have no impact on the x/y coordinates of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#x
* @property {number} x
*/

/**
* The y coordinate of the group container.
*
* You can adjust the group container itself by modifying its coordinates.
* This will have no impact on the x/y coordinates of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#y
* @property {number} y
*/

/**
* The angle of rotation of the group container, in radians.
*
* This will adjust the group container itself by modifying its rotation.
* This will have no impact on the rotation value of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#rotation
* @property {number} rotation
*/

/**
* The visible state of the group. Non-visible Groups and all of their children are not rendered.
*
* @name Phaser.Group#visible
* @property {boolean} visible
*/

/**
* The alpha value of the group container.
*
* @name Phaser.Group#alpha
* @property {number} alpha
*/
