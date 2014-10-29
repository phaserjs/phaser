/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Create a new `Button` object. A Button is a special type of Sprite that is set-up to handle Pointer events automatically.
*
* The four states a Button responds to are:
*
* * 'Over' - when the Pointer moves over the Button. This is also commonly known as 'hover'.
* * 'Out' - when the Pointer that was previously over the Button moves out of it.
* * 'Down' - when the Pointer is pressed down on the Button. I.e. touched on a touch enabled device or clicked with the mouse.
* * 'Up' - when the Pointer that was pressed down on the Button is released again.
*
* A different texture/frame and activation sound can be specified for any of the states.
*
* Frames can be specified as either an integer (the frame ID) or a string (the frame name); the same values that can be used with a Sprite constructor.
*
* @class Phaser.Button
* @constructor
* @extends Phaser.Image
* @param {Phaser.Game} game Current game instance.
* @param {number} [x=0] - X position of the Button.
* @param {number} [y=0] - Y position of the Button.
* @param {string} [key] - The image key (in the Game.Cache) to use as the texture for this Button.
* @param {function} [callback] - The function to call when this Button is pressed.
* @param {object} [callbackContext] - The context in which the callback will be called (usually 'this').
* @param {string|integer} [overFrame] - The frame / frameName when the button is in the Over state.
* @param {string|integer} [outFrame] - The frame / frameName when the button is in the Out state.
* @param {string|integer} [downFrame] - The frame / frameName when the button is in the Down state.
* @param {string|integer} [upFrame] - The frame / frameName when the button is in the Up state.
*/
Phaser.Button = function (game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {

    x = x || 0;
    y = y || 0;
    key = key || null;
    callback = callback || null;
    callbackContext = callbackContext || this;

    Phaser.Image.call(this, game, x, y, key, outFrame);

    /**
    * The Phaser Object Type.
    * @property {number} type
    */
    this.type = Phaser.BUTTON;

    /**
    * The frames for each state - can be integers or strings when set. Indexed by `Button.STATE_*`.
    * @property {Array<string|integer|null>} _stateFrames
    * @private
    */
    this._stateFrames = [null, null, null, null];

    /**
    * The sounds and markers for each state.
    * Indexed by `Button.STATE_* << 1` for the sound and `+1` for the marker; expanded on-demand.
    * @property {object[]} _stateSounds
    * @private
    */
    this._stateSounds = [];

    /**
    * The Signal (or event) dispatched when this Button is in an Over state.
    * @property {Phaser.Signal} onInputOver
    */
    this.onInputOver = new Phaser.Signal();

    /**
    * The Signal (or event) dispatched when this Button is in an Out state.
    * @property {Phaser.Signal} onInputOut
    */
    this.onInputOut = new Phaser.Signal();

    /**
    * The Signal (or event) dispatched when this Button is in an Down state.
    * @property {Phaser.Signal} onInputDown
    */
    this.onInputDown = new Phaser.Signal();

    /**
    * The Signal (or event) dispatched when this Button is in an Up state.
    * @property {Phaser.Signal} onInputUp
    */
    this.onInputUp = new Phaser.Signal();

    /**
    * If true then onOver events (such as onOverSound) will only be triggered if the Pointer object causing them was the Mouse Pointer.
    * The frame will still be changed as applicable.
    * @property {boolean} onOverMouseOnly
    * @default
    */
    this.onOverMouseOnly = false;
    
    /**
    * When true the the texture frame will not be automatically switched on up/down/over/out events.
    * @property {boolean} freezeFrames
    * @default
    */
    this.freezeFrames = false;

    /**
    * When the Button is touched / clicked and then released you can force it to enter a state of "out" instead of "up".
    * @property {boolean} forceOut
    * @default
    */
    this.forceOut = false;

    this.inputEnabled = true;

    this.input.start(0, true);

    this.setFrames(overFrame, outFrame, downFrame, upFrame);

    if (callback !== null)
    {
        this.onInputUp.add(callback, callbackContext);
    }

    //  Redirect the input events to here so we can handle animation updates, etc
    this.events.onInputOver.add(this.onInputOverHandler, this);
    this.events.onInputOut.add(this.onInputOutHandler, this);
    this.events.onInputDown.add(this.onInputDownHandler, this);
    this.events.onInputUp.add(this.onInputUpHandler, this);

    this.events.onRemovedFromWorld.add(this.removedFromWorld, this);

};

Phaser.Button.prototype = Object.create(Phaser.Image.prototype);
Phaser.Button.prototype.constructor = Phaser.Button;

//  State constants, useful to index into small state arrays.
//  (Arranged by "expected likelines" of custom frames/sounds and may change - don't hard-code.)
Phaser.Button.STATE_OVER = 0;
Phaser.Button.STATE_DOWN = 1;
Phaser.Button.STATE_UP = 2;
Phaser.Button.STATE_OUT = 3;

/**
* Clears all of the frames set on this Button.
*
* @method Phaser.Button#clearFrames
*/
Phaser.Button.prototype.clearFrames = function () {

    this.setFrames(null, null, null, null);

};

/**
* Called when this Button is removed from the World.
*
* @method Phaser.Button#removedFromWorld
* @protected
*/
Phaser.Button.prototype.removedFromWorld = function () {

    this.inputEnabled = false;

};

/**
* Set the frame name/ID for the given state.
*
* @method Phaser.Button#setStateFrame
* @private
* @param {integer} state - See `Button.STATE_*`
* @param {number|string} frame - The number or string representing the frame.
* @param {boolean} switchImmediately - Immediately switch to the frame if it was set - and this is true.
*/
Phaser.Button.prototype.setStateFrame = function (state, frame, switchImmediately)
{
    
    if (frame != null) //  Anything but null/undefined
    {
        this._stateFrames[state] = frame;

        if (switchImmediately)
        {
            this.changeStateFrame(frame);
        }
    }
    else
    {
        this._stateFrames[state] = null;
    }

};

/**
* Change the frame to that of the given state, _if_ the state has a frame assigned _and_ if the frames are not currently "frozen".
*
* @method Phaser.Button#changeStateFrame
* @private
* @param {integer} state - See `Button.STATE_*`
* @return {boolean} True only if the frame was assigned a value, possibly the same one it already had.
*/
Phaser.Button.prototype.changeStateFrame = function (state) {

    if (this.freezeFrames)
    {
        return false;
    }

    var frame = this._stateFrames[state];
    if (typeof frame === 'string')
    {
        this.frameName = frame;
        return true;
    }
    else if (typeof frame === 'number')
    {
        this.frame = frame;
        return true;
    }
    else
    {
        return false;
    }

};

/**
* Used to manually set the frames that will be used for the different states of the Button.
*
* Frames can be specified as either an integer (the frame ID) or a string (the frame name); these are the same values that can be used with a Sprite constructor.
*
* @method Phaser.Button#setFrames
* @public
* @param {string|integer} [overFrame] - The frame / frameName when the button is in the Over state.
* @param {string|integer} [outFrame] - The frame / frameName when the button is in the Out state.
* @param {string|integer} [downFrame] - The frame / frameName when the button is in the Down state.
* @param {string|integer} [upFrame] - The frame / frameName when the button is in the Up state.
*/
Phaser.Button.prototype.setFrames = function (overFrame, outFrame, downFrame, upFrame) {

    this.setStateFrame(Phaser.Button.STATE_OVER, overFrame, this.input.pointerOver());
    this.setStateFrame(Phaser.Button.STATE_OUT, outFrame, !this.input.pointerOver());
    this.setStateFrame(Phaser.Button.STATE_DOWN, downFrame, this.input.pointerDown());
    this.setStateFrame(Phaser.Button.STATE_UP, upFrame, this.input.pointerUp());

};

/**
* Set the sound/marker for the given state.
*
* @method Phaser.Button#setStateSound
* @private
* @param {integer} state - See `Button.STATE_*`
* @param {Phaser.Sound|Phaser.AudioSprite} [sound] - Sound.
* @param {string} [marker=null] - Sound marker.
*/
Phaser.Button.prototype.setStateSound = function (state, sound, marker) {

    var soundIndex = state << 1;
    var markerIndex = soundIndex + 1;
    var sounds = this._stateSounds;

    if (sound instanceof Phaser.Sound || sound instanceof Phaser.AudioSprite)
    {
        while (markerIndex > sounds.length) { // Dense null
            sounds.push(null);
        }

        sounds[soundIndex] = sound;
        sounds[markerIndex] = typeof marker === 'string' ? marker : null;
    }
    else if (markerIndex < sounds.length)
    {
        // Only null if set-through
        sounds[soundIndex] = null;
        sounds[markerIndex] = null;
    }

};

/**
* Play the sound for the given state, _if_ the state has a sound assigned.
*
* @method Phaser.Button#playStateSound
* @private
* @param {integer} state - See `Button.STATE_*`
* @return {boolean} True only if a sound was played.
*/
Phaser.Button.prototype.playStateSound = function (state) {

    var soundIndex = state << 1;
    var markerIndex = soundIndex + 1;
    var sounds = this._stateSounds;

    var sound = sounds[soundIndex];
    if (sound)
    {
        var marker = sounds[markerIndex];
        sound.play(marker);
        return true;
    }
    else
    {
        return false;
    }

};

/**
* Sets the sounds to be played whenever this Button is interacted with. Sounds can be either full Sound objects, or markers pointing to a section of a Sound object.
* The most common forms of sounds are 'hover' effects and 'click' effects, which is why the order of the parameters is overSound then downSound.
*
* Call this function with no parameters to reset all sounds on this Button.
*
* @method Phaser.Button#setSounds
* @public
* @param {Phaser.Sound|Phaser.AudioSprite} [overSound] - Over Button Sound.
* @param {string} [overMarker] - Over Button Sound Marker.
* @param {Phaser.Sound|Phaser.AudioSprite} [downSound] - Down Button Sound.
* @param {string} [downMarker] - Down Button Sound Marker.
* @param {Phaser.Sound|Phaser.AudioSprite} [outSound] - Out Button Sound.
* @param {string} [outMarker] - Out Button Sound Marker.
* @param {Phaser.Sound|Phaser.AudioSprite} [upSound] - Up Button Sound.
* @param {string} [upMarker] - Up Button Sound Marker.
*/
Phaser.Button.prototype.setSounds = function (overSound, overMarker, downSound, downMarker, outSound, outMarker, upSound, upMarker) {

    this.setStateSound(Phaser.Button.STATE_OVER, overSound, overMarker);
    this.setStateSound(Phaser.Button.STATE_OUT, outSound, outMarker);
    this.setStateSound(Phaser.Button.STATE_DOWN, downSound, downMarker);
    this.setStateSound(Phaser.Button.STATE_UP, upSound, upMarker);

};

/**
* The Sound to be played when a Pointer moves over this Button.
*
* @method Phaser.Button#setOverSound
* @public
* @param {Phaser.Sound|Phaser.AudioSprite} sound - The Sound that will be played.
* @param {string} [marker] - A Sound Marker that will be used in the playback.
*/
Phaser.Button.prototype.setOverSound = function (sound, marker) {

    this.setStateSound(Phaser.Button.STATE_OVER, sound, marker);

};

/**
* The Sound to be played when a Pointer moves out of this Button.
*
* @method Phaser.Button#setOutSound
* @public
* @param {Phaser.Sound|Phaser.AudioSprite} sound - The Sound that will be played.
* @param {string} [marker] - A Sound Marker that will be used in the playback.
*/
Phaser.Button.prototype.setOutSound = function (sound, marker) {

    this.setStateSound(Phaser.Button.STATE_OUT, sound, marker);

};

/**
* The Sound to be played when a Pointer presses down on this Button.
*
* @method Phaser.Button#setDownSound
* @public
* @param {Phaser.Sound|Phaser.AudioSprite} sound - The Sound that will be played.
* @param {string} [marker] - A Sound Marker that will be used in the playback.
*/
Phaser.Button.prototype.setDownSound = function (sound, marker) {

    this.setStateSound(Phaser.Button.STATE_DOWN, sound, marker);

};

/**
* The Sound to be played when a Pointer has pressed down and is released from this Button.
*
* @method Phaser.Button#setUpSound
* @public
* @param {Phaser.Sound|Phaser.AudioSprite} sound - The Sound that will be played.
* @param {string} [marker] - A Sound Marker that will be used in the playback.
*/
Phaser.Button.prototype.setUpSound = function (sound, marker) {

    this.setStateSound(Phaser.Button.STATE_UP, sound, marker);

};

/**
* Internal function that handles input events.
*
* @method Phaser.Button#onInputOverHandler
* @protected
* @param {Phaser.Button} sprite - The Button that the event occured on.
* @param {Phaser.Pointer} pointer - The Pointer that activated the Button.
*/
Phaser.Button.prototype.onInputOverHandler = function (sprite, pointer) {

    //  If the Pointer was only just released then we don't fire an over event
    if (pointer.justReleased())
    {
        return;
    }

    this.changeStateFrame(Phaser.Button.STATE_OVER);

    if (this.onOverMouseOnly && !pointer.isMouse)
    {
        return;
    }

    this.playStateSound(Phaser.Button.STATE_OVER);

    if (this.onInputOver)
    {
        this.onInputOver.dispatch(this, pointer);
    }

};

/**
* Internal function that handles input events.
*
* @method Phaser.Button#onInputOutHandler
* @protected
* @param {Phaser.Button} sprite - The Button that the event occured on.
* @param {Phaser.Pointer} pointer - The Pointer that activated the Button.
*/
Phaser.Button.prototype.onInputOutHandler = function (sprite, pointer) {

    this.changeStateFrame(Phaser.Button.STATE_OUT);

    this.playStateSound(Phaser.Button.STATE_OUT);

    if (this.onInputOut)
    {
        this.onInputOut.dispatch(this, pointer);
    }
};

/**
* Internal function that handles input events.
*
* @method Phaser.Button#onInputDownHandler
* @protected
* @param {Phaser.Button} sprite - The Button that the event occured on.
* @param {Phaser.Pointer} pointer - The Pointer that activated the Button.
*/
Phaser.Button.prototype.onInputDownHandler = function (sprite, pointer) {

    this.changeStateFrame(Phaser.Button.STATE_DOWN);

    this.playStateSound(Phaser.Button.STATE_DOWN);

    if (this.onInputDown)
    {
        this.onInputDown.dispatch(this, pointer);
    }
};

/**
* Internal function that handles input events.
*
* @method Phaser.Button#onInputUpHandler
* @protected
* @param {Phaser.Button} sprite - The Button that the event occured on.
* @param {Phaser.Pointer} pointer - The Pointer that activated the Button.
*/
Phaser.Button.prototype.onInputUpHandler = function (sprite, pointer, isOver) {

    this.playStateSound(Phaser.Button.STATE_UP);

    //  Input dispatched early, before state change (but after sound)
    if (this.onInputUp)
    {
        this.onInputUp.dispatch(this, pointer, isOver);
    }

    if (this.freezeFrames)
    {
        return;
    }

    if (this.forceOut)
    {
        this.changeStateFrame(Phaser.Button.STATE_OUT);
    }
    else
    {
        var changedUp = this.changeStateFrame(Phaser.Button.STATE_UP);
        if (!changedUp)
        {
            //  No Up frame to show..
            if (isOver)
            {
                this.changeStateFrame(Phaser.Button.STATE_OVER);
            }
            else
            {
                this.changeStateFrame(Phaser.Button.STATE_OUT);
            }
        }
    }

};
