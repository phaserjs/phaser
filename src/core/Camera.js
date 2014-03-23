/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Camera is your view into the game world. It has a position and size and renders only those objects within its field of view.
* The game automatically creates a single Stage sized camera on boot. Move the camera around the world with Phaser.Camera.x/y
*
* @class Phaser.Camera
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {number} id - Not being used at the moment, will be when Phaser supports multiple camera
* @param {number} x - Position of the camera on the X axis
* @param {number} y - Position of the camera on the Y axis
* @param {number} width - The width of the view rectangle
* @param {number} height - The height of the view rectangle
*/
Phaser.Camera = function (game, id, x, y, width, height) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    /**
    * @property {Phaser.World} world - A reference to the game world.
    */
    this.world = game.world;

    /**
    * @property {number} id - Reserved for future multiple camera set-ups.
    * @default
    */
    this.id = 0;

    /**
    * Camera view.
    * The view into the world we wish to render (by default the game dimensions).
    * The x/y values are in world coordinates, not screen coordinates, the width/height is how many pixels to render.
    * Objects outside of this view are not rendered if set to camera cull.
    * @property {Phaser.Rectangle} view
    */
    this.view = new Phaser.Rectangle(x, y, width, height);

    /**
    * @property {Phaser.Rectangle} screenView - Used by Sprites to work out Camera culling.
    */
    this.screenView = new Phaser.Rectangle(x, y, width, height);

    /**
    * The Camera is bound to this Rectangle and cannot move outside of it. By default it is enabled and set to the size of the World.
    * The Rectangle can be located anywhere in the world and updated as often as you like. If you don't wish the Camera to be bound
    * at all then set this to null. The values can be anything and are in World coordinates, with 0,0 being the center of the world.
    * @property {Phaser.Rectangle} bounds - The Rectangle in which the Camera is bounded. Set to null to allow for movement anywhere.
    */
    this.bounds = new Phaser.Rectangle(x, y, width, height);

    /**
    * @property {Phaser.Rectangle} deadzone - Moving inside this Rectangle will not cause camera moving.
    */
    this.deadzone = null;

    /**
    * @property {boolean} visible - Whether this camera is visible or not.
    * @default
    */
    this.visible = true;

    /**
    * @property {boolean} atLimit - Whether this camera is flush with the World Bounds or not.
    */
    this.atLimit = { x: false, y: false };

    /**
    * @property {Phaser.Sprite} target - If the camera is tracking a Sprite, this is a reference to it, otherwise null.
    * @default
    */
    this.target = null;

    /**
    * @property {number} edge - Edge property.
    * @private
    * @default
    */
    this._edge = 0;

    /**
    * @property {PIXI.DisplayObject} displayObject - The display object to which all game objects are added. Set by World.boot
    */
    this.displayObject = null;

    /**
    * @property {Phaser.Point} scale - The scale of the display object to which all game objects are added. Set by World.boot
    */
    this.scale = null;

};

/**
* @constant
* @type {number}
*/
Phaser.Camera.FOLLOW_LOCKON = 0;

/**
* @constant
* @type {number}
*/
Phaser.Camera.FOLLOW_PLATFORMER = 1;

/**
* @constant
* @type {number}
*/
Phaser.Camera.FOLLOW_TOPDOWN = 2;

/**
* @constant
* @type {number}
*/
Phaser.Camera.FOLLOW_TOPDOWN_TIGHT = 3;

Phaser.Camera.prototype = {

    /**
    * Tells this camera which sprite to follow.
    * @method Phaser.Camera#follow
    * @param {Phaser.Sprite|Phaser.Image|Phaser.Text} target - The object you want the camera to track. Set to null to not follow anything.
    * @param {number} [style] - Leverage one of the existing "deadzone" presets. If you use a custom deadzone, ignore this parameter and manually specify the deadzone after calling follow().
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
                this.deadzone = null;
                break;

            default:
                this.deadzone = null;
                break;
        }

    },

    /**
    * Move the camera focus on a display object instantly.
    * @method Phaser.Camera#focusOn
    * @param {any} displayObject - The display object to focus the camera on. Must have visible x/y properties.
    */
    focusOn: function (displayObject) {

        this.setPosition(Math.round(displayObject.x - this.view.halfWidth), Math.round(displayObject.y - this.view.halfHeight));

    },

    /**
    * Move the camera focus on a location instantly.
    * @method Phaser.Camera#focusOnXY
    * @param {number} x - X position.
    * @param {number} y - Y position.
    */
    focusOnXY: function (x, y) {

        this.setPosition(Math.round(x - this.view.halfWidth), Math.round(y - this.view.halfHeight));

    },

    /**
    * Update focusing and scrolling.
    * @method Phaser.Camera#update
    */
    update: function () {

        if (this.target)
        {
            this.updateTarget();
        }

        if (this.bounds)
        {
            this.checkBounds();
        }

        this.displayObject.position.x = -this.view.x;
        this.displayObject.position.y = -this.view.y;

    },

    /**
    * Internal method
    * @method Phaser.Camera#updateTarget
    * @private
    */
    updateTarget: function () {

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

    },

    /**
    * Update the Camera bounds to match the game world.
    * @method Phaser.Camera#setBoundsToWorld
    */
    setBoundsToWorld: function () {

        this.bounds.setTo(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height);

    },

    /**
    * Method called to ensure the camera doesn't venture outside of the game world.
    * @method Phaser.Camera#checkWorldBounds
    */
    checkBounds: function () {

        this.atLimit.x = false;
        this.atLimit.y = false;

        //  Make sure we didn't go outside the cameras bounds
        if (this.view.x <= this.bounds.x)
        {
            this.atLimit.x = true;
            this.view.x = this.bounds.x;
        }

        if (this.view.right >= this.bounds.right)
        {
            this.atLimit.x = true;
            this.view.x = this.bounds.right - this.width;
        }

        if (this.view.y <= this.bounds.top)
        {
            this.atLimit.y = true;
            this.view.y = this.bounds.top;
        }

        if (this.view.bottom >= this.bounds.bottom)
        {
            this.atLimit.y = true;
            this.view.y = this.bounds.bottom - this.height;
        }

        this.view.floor();

    },

    /**
    * A helper function to set both the X and Y properties of the camera at once
    * without having to use game.camera.x and game.camera.y.
    *
    * @method Phaser.Camera#setPosition
    * @param {number} x - X position.
    * @param {number} y - Y position.
    */
    setPosition: function (x, y) {

        this.view.x = x;
        this.view.y = y;

        if (this.bounds)
        {
            this.checkBounds();
        }

    },

    /**
    * Sets the size of the view rectangle given the width and height in parameters.
    *
    * @method Phaser.Camera#setSize
    * @param {number} width - The desired width.
    * @param {number} height - The desired height.
    */
    setSize: function (width, height) {

        this.view.width = width;
        this.view.height = height;

    },

    /**
    * Resets the camera back to 0,0 and un-follows any object it may have been tracking.
    *
    * @method Phaser.Camera#reset
    */
    reset: function () {

        this.target = null;
        this.view.x = 0;
        this.view.y = 0;

    }

};

Phaser.Camera.prototype.constructor = Phaser.Camera;

/**
* The Cameras x coordinate. This value is automatically clamped if it falls outside of the World bounds.
* @name Phaser.Camera#x
* @property {number} x - Gets or sets the cameras x position.
*/
Object.defineProperty(Phaser.Camera.prototype, "x", {

    get: function () {
        return this.view.x;
    },

    set: function (value) {

        this.view.x = value;

        if (this.bounds)
        {
            this.checkBounds();
        }
    }

});

/**
* The Cameras y coordinate. This value is automatically clamped if it falls outside of the World bounds.
* @name Phaser.Camera#y
* @property {number} y - Gets or sets the cameras y position.
*/
Object.defineProperty(Phaser.Camera.prototype, "y", {

    get: function () {
        return this.view.y;
    },

    set: function (value) {

        this.view.y = value;

        if (this.bounds)
        {
            this.checkBounds();
        }
    }

});

/**
* The Cameras width. By default this is the same as the Game size and should not be adjusted for now.
* @name Phaser.Camera#width
* @property {number} width - Gets or sets the cameras width.
*/
Object.defineProperty(Phaser.Camera.prototype, "width", {

    get: function () {
        return this.view.width;
    },

    set: function (value) {
        this.view.width = value;
    }

});

/**
* The Cameras height. By default this is the same as the Game size and should not be adjusted for now.
* @name Phaser.Camera#height
* @property {number} height - Gets or sets the cameras height.
*/
Object.defineProperty(Phaser.Camera.prototype, "height", {

    get: function () {
        return this.view.height;
    },

    set: function (value) {
        this.view.height = value;
    }

});
