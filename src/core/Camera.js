/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
* @module       Phaser.Camera
*/

/**
*
* A Camera is your view into the game world. It has a position and size and renders only those objects within its field of view.
* The game automatically creates a single Stage sized camera on boot. Move the camera around the world with Phaser.Camera.x/y
*
* @class Camera
* @constructor
* @param {Phaser.Game} game game reference to the currently running game.
* @param {number} id not being used at the moment, will be when Phaser supports multiple camera
* @param {number} x position of the camera on the X axis
* @param {number} y position of the camera on the Y axis
* @param {number} width the width of the view rectangle
* @param {number} height the height of the view rectangle
*/

Phaser.Camera = function (game, id, x, y, width, height) {

    /**
    * A reference to the currently running Game.
    * @property game
    * @public
    * @type {Phaser.Game}
    */
	this.game = game;

    /**
    * A reference to the game world
    * @property world
    * @public
    * @type {Phaser.World}
    */
	this.world = game.world;

    /**
    * reserved for future multiple camera set-ups
    * @property id
    * @public
    * @type {number}
    */
	this.id = 0; 

    /**
    * Camera view.
    * The view into the world we wish to render (by default the game dimensions)
    * The x/y values are in world coordinates, not screen coordinates, the width/height is how many pixels to render
    * Objects outside of this view are not rendered (unless set to ignore the Camera, i.e. UI?)
    * @property view
    * @public
    * @type {Phaser.Rectangle}
    */
    this.view = new Phaser.Rectangle(x, y, width, height);

    /**
    * Used by Sprites to work out Camera culling.
    * @property screenView
    * @public
    * @type {Phaser.Rectangle}
    */
	this.screenView = new Phaser.Rectangle(x, y, width, height);

    /**
    * Sprite moving inside this Rectangle will not cause camera moving.
    * @property deadzone
    * @type {Phaser.Rectangle}
    */
    this.deadzone = null;

    /**
    * Whether this camera is visible or not. (default is true)
    * @property visible
    * @public
    * @default true
    * @type {bool}
    */
    this.visible = true;

    /**
    * Whether this camera is flush with the World Bounds or not.
    * @property atLimit
    * @type {bool}
    */
    this.atLimit = { x: false, y: false };

    /**
    * If the camera is tracking a Sprite, this is a reference to it, otherwise null
    * @property target
    * @public
    * @type {Phaser.Sprite}
    */
    this.target = null;

    /**
    * Edge property
    * @property edge
    * @private
    * @type {number}
    */
    this._edge = 0;
	
};

//	Consts
Phaser.Camera.FOLLOW_LOCKON = 0;
Phaser.Camera.FOLLOW_PLATFORMER = 1;
Phaser.Camera.FOLLOW_TOPDOWN = 2;
Phaser.Camera.FOLLOW_TOPDOWN_TIGHT = 3;

Phaser.Camera.prototype = {

	/**
    * Tells this camera which sprite to follow.
    * @method follow
    * @param target {Phaser.Sprite} The object you want the camera to track. Set to null to not follow anything.
    * @param [style] {number} Leverage one of the existing "deadzone" presets. If you use a custom deadzone, ignore this parameter and manually specify the deadzone after calling follow().
    */
    follow: function (target, style) {

        if (typeof style === "undefined") { style = Phaser.Camera.FOLLOW_LOCKON; }

        this.target = target;

        var helper;

        switch (style) {

            case Phaser.Camera.FOLLOW_PLATFORMER:
                var w = this.width / 8;
                var h = this.height / 3;
                this.deadzone = new Phaser.Rectangle((this.width - w) / 2, (this.height - h) / 2 - h * 0.25, w, h);
                break;

            case Phaser.Camera.FOLLOW_TOPDOWN:
                helper = Math.max(this.width, this.height) / 4;
                this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                break;

            case Phaser.Camera.FOLLOW_TOPDOWN_TIGHT:
                helper = Math.max(this.width, this.height) / 8;
                this.deadzone = new Phaser.Rectangle((this.width - helper) / 2, (this.height - helper) / 2, helper, helper);
                break;

            case Phaser.Camera.FOLLOW_LOCKON:
            default:
                this.deadzone = null;
                break;
        }

    },

	/**
    * Move the camera focus to a location instantly.
    * @method focusOnXY
    * @param x {number} X position.
    * @param y {number} Y position.
    */
    focusOnXY: function (x, y) {

        this.view.x = Math.round(x - this.view.halfWidth);
        this.view.y = Math.round(y - this.view.halfHeight);

    },

	/**
    * Update focusing and scrolling.
    * @method update
    */
    update: function () {

        //  Add dirty flag

        if (this.target !== null)
        {
            if (this.deadzone)
            {
                this._edge = this.target.x - this.deadzone.x;

                if (this.view.x > this._edge)
                {
                    this.view.x = this._edge;
                }

                this._edge = this.target.x + this.target.width - this.deadzone.x - this.deadzone.width;

                if (this.view.x < this._edge)
                {
                    this.view.x = this._edge;
                }

                this._edge = this.target.y - this.deadzone.y;

                if (this.view.y > this._edge)
                {
                    this.view.y = this._edge;
                }

                this._edge = this.target.y + this.target.height - this.deadzone.y - this.deadzone.height;

                if (this.view.y < this._edge)
                {
                    this.view.y = this._edge;
                }
            }
            else
            {
                this.focusOnXY(this.target.x, this.target.y);
            }
        }

        this.checkWorldBounds();

    },

    /**
    * Method called to ensure the camera doesn't venture outside of the game world
    * @method checkWorldBounds
    */
    checkWorldBounds: function () {

        this.atLimit.x = false;
        this.atLimit.y = false;

        //  Make sure we didn't go outside the cameras worldBounds
        if (this.view.x < this.world.bounds.left)
        {
            this.atLimit.x = true;
            this.view.x = this.world.bounds.left;
        }

        if (this.view.x > this.world.bounds.right - this.width)
        {
            this.atLimit.x = true;
            this.view.x = (this.world.bounds.right - this.width) + 1;
        }

        if (this.view.y < this.world.bounds.top)
        {
            this.atLimit.y = true;
            this.view.y = this.world.bounds.top;
        }

        if (this.view.y > this.world.bounds.bottom - this.height)
        {
            this.atLimit.y = true;
            this.view.y = (this.world.bounds.bottom - this.height) + 1;
        }

        this.view.floor();

    },

    /**
    * A helper function to set both the X and Y properties of the camera at once
    * without having to use game.camera.x and game.camera.y
    * 
    * @method setPosition
    * @param x {number} X position.
    * @param y {number} Y position.
    */
    setPosition: function (x, y) {

        this.view.x = x;
        this.view.y = y;
        this.checkWorldBounds();

    },

    /**
    * Sets the size of the view rectangle given the width and height in parameters
    * 
    * @method setSize
    * @param width {number} the desired width.
    * @param height {number} the desired height.
    */
    setSize: function (width, height) {

        this.view.width = width;
        this.view.height = height;

    }

};

Object.defineProperty(Phaser.Camera.prototype, "x", {

    /**
    * @method x
    * @return {Number} The x position
    */
    get: function () {
        return this.view.x;
    },
    /**
    * @method x
    * @return {Number} Sets the camera's x position and clamp it if it's outside the world bounds
    */
    set: function (value) {
        this.view.x = value;
        this.checkWorldBounds();
    }

});

Object.defineProperty(Phaser.Camera.prototype, "y", {

    /**
    * @method y
    * @return {Number} The y position
    */
    get: function () {
        return this.view.y;
    },

    /**
    * @method y
    * @return {Number} Sets the camera's y position and clamp it if it's outside the world bounds
    */
    set: function (value) {
        this.view.y = value;
        this.checkWorldBounds();
    }

});

Object.defineProperty(Phaser.Camera.prototype, "width", {

    /**
    * @method width
    * @return {Number} The width of the view rectangle, in pixels
    */
    get: function () {
        return this.view.width;
    },

    /**
    * @method width
    * @return {Number} Sets the width of the view rectangle
    */
    set: function (value) {
        this.view.width = value;
    }

});

Object.defineProperty(Phaser.Camera.prototype, "height", {

    /**
    * @method height
    * @return {Number} The height of the view rectangle, in pixels
    */
    get: function () {
        return this.view.height;
    },

    /**
    * @method height
    * @return {Number} Sets the height of the view rectangle
    */
    set: function (value) {
        this.view.height = value;
    }

});
