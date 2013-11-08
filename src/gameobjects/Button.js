/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Create a new `Button` object. A Button is a special type of Sprite that is set-up to handle Pointer events automatically. The four states a Button responds to are:
* 'Over' - when the Pointer moves over the Button. This is also commonly known as 'hover'.
* 'Out' - when the Pointer that was previously over the Button moves out of it.
* 'Down' - when the Pointer is pressed down on the Button. I.e. touched on a touch enabled device or clicked with the mouse.
* 'Up' - when the Pointer that was pressed down on the Button is released again.
* You can set a unique texture frame and Sound for any of these states.
*
* @class Phaser.Button
* @constructor
*
* @param {Phaser.Game} game Current game instance.
* @param {number} [x] - X position of the Button.
* @param {number} [y] - Y position of the Button.
* @param {string} [key] - The image key as defined in the Game.Cache to use as the texture for this Button.
* @param {function} [callback] - The function to call when this Button is pressed.
* @param {object} [callbackContext] - The context in which the callback will be called (usually 'this').
* @param {string|number} [overFrame] - This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [outFrame] - This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [downFrame] - This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
*/
Phaser.Button = function (game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame) {

    x = x || 0;
    y = y || 0;
    key = key || null;
    callback = callback || null;
    callbackContext = callbackContext || this;

	Phaser.Sprite.call(this, game, x, y, key, outFrame);

	/** 
	* @property {number} type - The Phaser Object Type.
	*/
    this.type = Phaser.BUTTON;

	/** 
	* @property {string} _onOverFrameName - Internal variable.
	* @private
	* @default
	*/
    this._onOverFrameName = null;
    
	/** 
	* @property {string} _onOutFrameName - Internal variable.
	* @private
	* @default
	*/
    this._onOutFrameName = null;
    
	/** 
	* @property {string} _onDownFrameName - Internal variable.
	* @private
	* @default
	*/
    this._onDownFrameName = null;
    
	/** 
	* @property {string} _onUpFrameName - Internal variable.
	* @private
	* @default
	*/
    this._onUpFrameName = null;
    
	/** 
	* @property {number} _onOverFrameID - Internal variable.
	* @private
	* @default
	*/
    this._onOverFrameID = null;
    
	/** 
	* @property {number} _onOutFrameID - Internal variable.
	* @private
	* @default
	*/
    this._onOutFrameID = null;
    
	/** 
	* @property {number} _onDownFrameID - Internal variable.
	* @private
	* @default
	*/
    this._onDownFrameID = null;
    
	/** 
	* @property {number} _onUpFrameID - Internal variable.
	* @private
	* @default
	*/
    this._onUpFrameID = null;

    /** 
    * @property {Phaser.Sound} onOverSound - The Sound to be played when this Buttons Over state is activated.
    * @default
    */
    this.onOverSound = null;

    /** 
    * @property {Phaser.Sound} onOutSound - The Sound to be played when this Buttons Out state is activated.
    * @default
    */
    this.onOutSound = null;

    /** 
    * @property {Phaser.Sound} onDownSound - The Sound to be played when this Buttons Down state is activated.
    * @default
    */
    this.onDownSound = null;

    /** 
    * @property {Phaser.Sound} onUpSound - The Sound to be played when this Buttons Up state is activated.
    * @default
    */
    this.onUpSound = null;

    /** 
    * @property {string} onOverSoundMarker - The Sound Marker used in conjunction with the onOverSound.
    * @default
    */
    this.onOverSoundMarker = '';

    /** 
    * @property {string} onOutSoundMarker - The Sound Marker used in conjunction with the onOutSound.
    * @default
    */
    this.onOutSoundMarker = '';

    /** 
    * @property {string} onDownSoundMarker - The Sound Marker used in conjunction with the onDownSound.
    * @default
    */
    this.onDownSoundMarker = '';

    /** 
    * @property {string} onUpSoundMarker - The Sound Marker used in conjunction with the onUpSound.
    * @default
    */
    this.onUpSoundMarker = '';

	/** 
	* @property {Phaser.Signal} onInputOver - The Signal (or event) dispatched when this Button is in an Over state.
	*/
    this.onInputOver = new Phaser.Signal;
    
	/** 
	* @property {Phaser.Signal} onInputOut - The Signal (or event) dispatched when this Button is in an Out state.
	*/
    this.onInputOut = new Phaser.Signal;
    
	/** 
	* @property {Phaser.Signal} onInputDown - The Signal (or event) dispatched when this Button is in an Down state.
	*/
    this.onInputDown = new Phaser.Signal;
    
	/** 
	* @property {Phaser.Signal} onInputUp - The Signal (or event) dispatched when this Button is in an Up state.
	*/
    this.onInputUp = new Phaser.Signal;

    /** 
    * @property {boolean} freezeFrames - When true the Button will cease to change texture frame on all events (over, out, up, down).
    */
    this.freezeFrames = false;

    /**
    * When the Button is clicked you can optionally force the state to "out".
    * @property {boolean} forceOut
    * @default
    */
    this.forceOut = true;

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

Phaser.Button.prototype = Object.create(Phaser.Sprite.prototype);
Phaser.Button.prototype = Phaser.Utils.extend(true, Phaser.Button.prototype, Phaser.Sprite.prototype, PIXI.Sprite.prototype);
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

            if (this.input.pointerDown())
            {
                this.frameName = downFrame;
            }
        }
        else
        {
            this._onDownFrameID = downFrame;

            if (this.input.pointerDown())
            {
                this.frame = downFrame;
            }
        }
    }

};

/**
* Sets the sounds to be played whenever this Button is interacted with. Sounds can be either full Sound objects, or markers pointing to a section of a Sound object.
* The most common forms of sounds are 'hover' effects and 'click' effects, which is why the order of the parameters is overSound then downSound.
* Call this function with no parameters at all to reset all sounds on this Button.
*
* @method Phaser.Button.prototype.setSounds
* @param {Phaser.Sound} [overSound] - Over Button Sound.
* @param {string} [overMarker] - Over Button Sound Marker.
* @param {Phaser.Sound} [downSound] - Down Button Sound.
* @param {string} [downMarker] - Down Button Sound Marker.
* @param {Phaser.Sound} [outSound] - Out Button Sound.
* @param {string} [outMarker] - Out Button Sound Marker.
* @param {Phaser.Sound} [upSound] - Up Button Sound.
* @param {string} [upMarker] - Up Button Sound Marker.
*/
Phaser.Button.prototype.setSounds = function (overSound, overMarker, downSound, downMarker, outSound, outMarker, upSound, upMarker) {

    this.setOverSound(overSound, overMarker);
    this.setOutSound(outSound, outMarker);
    this.setUpSound(upSound, upMarker);
    this.setDownSound(downSound, downMarker);

}

/**
* The Sound to be played when a Pointer moves over this Button.
*
* @method Phaser.Button.prototype.setOverSound
* @param {Phaser.Sound} sound - The Sound that will be played.
* @param {string} [marker] - A Sound Marker that will be used in the playback.
*/
Phaser.Button.prototype.setOverSound = function (sound, marker) {

    this.onOverSound = null;
    this.onOverSoundMarker = '';

    if (sound instanceof Phaser.Sound)
    {
        this.onOverSound = sound;
    }

    if (typeof marker === 'string')
    {
        this.onOverSoundMarker = marker;
    }

}

/**
* The Sound to be played when a Pointer moves out of this Button.
*
* @method Phaser.Button.prototype.setOutSound
* @param {Phaser.Sound} sound - The Sound that will be played.
* @param {string} [marker] - A Sound Marker that will be used in the playback.
*/
Phaser.Button.prototype.setOutSound = function (sound, marker) {

    this.onOutSound = null;
    this.onOutSoundMarker = '';

    if (sound instanceof Phaser.Sound)
    {
        this.onOutSound = sound;
    }

    if (typeof marker === 'string')
    {
        this.onOutSoundMarker = marker;
    }

}

/**
* The Sound to be played when a Pointer clicks on this Button.
*
* @method Phaser.Button.prototype.setUpSound
* @param {Phaser.Sound} sound - The Sound that will be played.
* @param {string} [marker] - A Sound Marker that will be used in the playback.
*/
Phaser.Button.prototype.setUpSound = function (sound, marker) {

    this.onUpSound = null;
    this.onUpSoundMarker = '';

    if (sound instanceof Phaser.Sound)
    {
        this.onUpSound = sound;
    }

    if (typeof marker === 'string')
    {
        this.onUpSoundMarker = marker;
    }

}

/**
* The Sound to be played when a Pointer clicks on this Button.
*
* @method Phaser.Button.prototype.setDownSound
* @param {Phaser.Sound} sound - The Sound that will be played.
* @param {string} [marker] - A Sound Marker that will be used in the playback.
*/
Phaser.Button.prototype.setDownSound = function (sound, marker) {

    this.onDownSound = null;
    this.onDownSoundMarker = '';

    if (sound instanceof Phaser.Sound)
    {
        this.onDownSound = sound;
    }

    if (typeof marker === 'string')
    {
        this.onDownSoundMarker = marker;
    }

}

/**
* Internal function that handles input events.
*
* @protected
* @method Phaser.Button.prototype.onInputOverHandler
* @param {Phaser.Pointer} pointer - The Pointer that activated the Button.
*/
Phaser.Button.prototype.onInputOverHandler = function (pointer) {

    if (this.freezeFrames == false)
    {
        if (this._onOverFrameName != null)
        {
            this.frameName = this._onOverFrameName;
        }
        else if (this._onOverFrameID != null)
        {
            this.frame = this._onOverFrameID;
        }
    }

    if (this.onOverSound)
    {
        this.onOverSound.play(this.onOverSoundMarker);
    }

    if (this.onInputOver)
    {
        this.onInputOver.dispatch(this, pointer);
    }
};

/**
* Internal function that handles input events.
*
* @protected
* @method Phaser.Button.prototype.onInputOverHandler
* @param {Phaser.Pointer} pointer - The Pointer that activated the Button.
*/
Phaser.Button.prototype.onInputOutHandler = function (pointer) {

    if (this.freezeFrames == false)
    {
        if (this._onOutFrameName != null)
        {
            this.frameName = this._onOutFrameName;
        }
        else if (this._onOutFrameID != null)
        {
            this.frame = this._onOutFrameID;
        }
    }

    if (this.onOutSound)
    {
        this.onOutSound.play(this.onOutSoundMarker);
    }

    if (this.onInputOut)
    {
        this.onInputOut.dispatch(this, pointer);
    }
};

/**
* Internal function that handles input events.
*
* @protected
* @method Phaser.Button.prototype.onInputOverHandler
* @param {Phaser.Pointer} pointer - The Pointer that activated the Button.
*/
Phaser.Button.prototype.onInputDownHandler = function (pointer) {

    if (this.freezeFrames == false)
    {
        if (this._onDownFrameName != null)
        {
            this.frameName = this._onDownFrameName;
        }
        else if (this._onDownFrameID != null)
        {
            this.frame = this._onDownFrameID;
        }
    }

    if (this.onDownSound)
    {
        this.onDownSound.play(this.onDownSoundMarker);
    }

    if (this.onInputDown)
    {
        this.onInputDown.dispatch(this, pointer);
    }
};

/**
* Internal function that handles input events.
*
* @protected
* @method Phaser.Button.prototype.onInputOverHandler
* @param {Phaser.Pointer} pointer - The Pointer that activated the Button.
*/
Phaser.Button.prototype.onInputUpHandler = function (pointer) {

    if (this.freezeFrames == false)
    {
        if (this._onUpFrameName != null)
        {
            this.frameName = this._onUpFrameName;
        }
        else if (this._onUpFrameID != null)
        {
            this.frame = this._onUpFrameID;
        }
    }

    if (this.onUpSound)
    {
        this.onUpSound.play(this.onUpSoundMarker);
    }

    if (this.forceOut && this.freezeFrames == false)
    {
        if (this._onOutFrameName != null)
        {
            this.frameName = this._onOutFrameName;
        }
        else if (this._onOutFrameID != null)
        {
            this.frame = this._onOutFrameID;
        }
    }

    if (this.onInputUp)
    {
        this.onInputUp.dispatch(this, pointer);
    }

};
