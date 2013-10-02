/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.Button
*/


/**
* Create a new <code>Button</code> object.
* @class Phaser.Button
* @constructor
*
* @param {Phaser.Game} game Current game instance.
* @param {number} [x] X position of the button.
* @param {number} [y] Y position of the button.
* @param {string} [key] The image key as defined in the Game.Cache to use as the texture for this button.
* @param {function} [callback] The function to call when this button is pressed
* @param {object} [callbackContext] The context in which the callback will be called (usually 'this')
* @param {string|number} [overFrame] This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [outFrame] This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [downFrame] This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
*/
Phaser.Button = function (game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame) {

    x = x || 0;
    y = y || 0;
    key = key || null;
    callback = callback || null;
    callbackContext = callbackContext || this;

	Phaser.Sprite.call(this, game, x, y, key, outFrame);

	/** 
	* @property {Description} type - Description.
	*/
    this.type = Phaser.BUTTON;

	/** 
	* @property {Description} _onOverFrameName - Description.
	* @private
	* @default
	*/
    this._onOverFrameName = null;
    
	/** 
	* @property {Description} _onOutFrameName - Description.
	* @private
	* @default
	*/
    this._onOutFrameName = null;
    
	/** 
	* @property {Description} _onDownFrameName - Description.
	* @private
	* @default
	*/
    this._onDownFrameName = null;
    
	/** 
	* @property {Description} _onUpFrameName - Description.
	* @private
	* @default
	*/
    this._onUpFrameName = null;
    
	/** 
	* @property {Description} _onOverFrameID - Description.
	* @private
	* @default
	*/
    this._onOverFrameID = null;
    
	/** 
	* @property {Description} _onOutFrameID - Description.
	* @private
	* @default
	*/
    this._onOutFrameID = null;
    
	/** 
	* @property {Description} _onDownFrameID - Description.
	* @private
	* @default
	*/
    this._onDownFrameID = null;
    
	/** 
	* @property {Description} _onUpFrameID - Description.
	* @private
	* @default
	*/
    this._onUpFrameID = null;

    //  These are the signals the game will subscribe to
	/** 
	* @property {Phaser.Signal} onInputOver - Description.
	*/
    this.onInputOver = new Phaser.Signal;
    
	/** 
	* @property {Phaser.Signal} onInputOut - Description.
	*/
    this.onInputOut = new Phaser.Signal;
    
	/** 
	* @property {Phaser.Signal} onInputDown - Description.
	*/
    this.onInputDown = new Phaser.Signal;
    
	/** 
	* @property {Phaser.Signal} onInputUp - Description.
	*/
    this.onInputUp = new Phaser.Signal;

    this.setFrames(overFrame, outFrame, downFrame);

    if (callback !== null)
    {
        this.onInputUp.add(callback, callbackContext);
    }

    this.input.start(0, true);

    //  Redirect the input events to here so we can handle animation updates, etc
    this.events.onInputOver.add(this.onInputOverHandler, this);
    this.events.onInputOut.add(this.onInputOutHandler, this);
    this.events.onInputDown.add(this.onInputDownHandler, this);
    this.events.onInputUp.add(this.onInputUpHandler, this);

};

Phaser.Button.prototype = Phaser.Utils.extend(true, Phaser.Sprite.prototype, PIXI.Sprite.prototype);
Phaser.Button.prototype.constructor = Phaser.Button;

/**
* Used to manually set the frames that will be used for the different states of the button
* exactly like setting them in the constructor.
*
* @method Phaser.Button.prototype.setFrames
* @param {string|number} [overFrame] - This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [outFrame] - This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [downFrame] - This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
*/
Phaser.Button.prototype.setFrames = function (overFrame, outFrame, downFrame) {

    if (overFrame !== null)
    {
        if (typeof overFrame === 'string')
        {
            this._onOverFrameName = overFrame;
            
            if (this.input.pointerOver())
            {
                this.frameName = overFrame;
            }
        }
        else
        {
            this._onOverFrameID = overFrame;

            if (this.input.pointerOver())
            {
                this.frame = overFrame;
            }
        }
    }

    if (outFrame !== null)
    {
        if (typeof outFrame === 'string')
        {
            this._onOutFrameName = outFrame;
            this._onUpFrameName = outFrame;

            if (this.input.pointerOver() == false)
            {
                this.frameName = outFrame;
            }
        }
        else
        {
            this._onOutFrameID = outFrame;
            this._onUpFrameID = outFrame;

            if (this.input.pointerOver() == false)
            {
                this.frame = outFrame;
            }
        }
    }

    if (downFrame !== null)
    {
        if (typeof downFrame === 'string')
        {
            this._onDownFrameName = downFrame;

            if (this.input.pointerOver())
            {
                this.frameName = downFrame;
            }
        }
        else
        {
            this._onDownFrameID = downFrame;

            if (this.input.pointerOver())
            {
                this.frame = downFrame;
            }
        }
    }

};

/**
* Description.
*
* @method Phaser.Button.prototype.onInputOverHandler
* @param {Description} pointer - Description.
*/
Phaser.Button.prototype.onInputOverHandler = function (pointer) {

    if (this._onOverFrameName != null)
    {
        this.frameName = this._onOverFrameName;
    }
    else if (this._onOverFrameID != null)
    {
        this.frame = this._onOverFrameID;
    }

    if (this.onInputOver)
    {
        this.onInputOver.dispatch(this, pointer);
    }
};

/**
* Description.
*
* @method Phaser.Button.prototype.onInputOutHandler
* @param {Description} pointer - Description.
*/
Phaser.Button.prototype.onInputOutHandler = function (pointer) {

    if (this._onOutFrameName != null)
    {
        this.frameName = this._onOutFrameName;
    }
    else if (this._onOutFrameID != null)
    {
        this.frame = this._onOutFrameID;
    }

    if (this.onInputOut)
    {
        this.onInputOut.dispatch(this, pointer);
    }
};

/**
* Description.
*
* @method Phaser.Button.prototype.onInputDownHandler
* @param {Description} pointer - Description.
*/
Phaser.Button.prototype.onInputDownHandler = function (pointer) {

    if (this._onDownFrameName != null)
    {
        this.frameName = this._onDownFrameName;
    }
    else if (this._onDownFrameID != null)
    {
        this.frame = this._onDownFrameID;
    }

    if (this.onInputDown)
    {
        this.onInputDown.dispatch(this, pointer);
    }
};

/**
* Description.
*
* @method Phaser.Button.prototype.onInputUpHandler
* @param {Description} pointer - Description.
*/
Phaser.Button.prototype.onInputUpHandler = function (pointer) {

    if (this._onUpFrameName != null)
    {
        this.frameName = this._onUpFrameName;
    }
    else if (this._onUpFrameID != null)
    {
        this.frame = this._onUpFrameID;
    }

    if (this.onInputUp)
    {
        this.onInputUp.dispatch(this, pointer);
    }
};
