Phaser.Key = function (game, keycode) {

	this.game = game;

	/**
	*
	* @property isDown
	* @type Boolean
	**/
	this.isDown = false;

	/**
	*
	* @property isUp
	* @type Boolean
	**/
	this.isUp = false;

	/**
	*
	* @property altKey
	* @type Boolean
	**/
	this.altKey = false;

	/**
	*
	* @property ctrlKey
	* @type Boolean
	**/
	this.ctrlKey = false;

	/**
	*
	* @property shiftKey
	* @type Boolean
	**/
	this.shiftKey = false;

	/**
	*
	* @property timeDown
	* @type Number
	**/
	this.timeDown = 0;

	/**
	*
	* @property duration
	* @type Number
	**/
	this.duration = 0;

	/**
	*
	* @property timeUp
	* @type Number
	**/
	this.timeUp = 0;

	/**
	*
	* @property repeats
	* @type Number
	**/
	this.repeats = 0;

	this.keyCode = keycode;

    this.onDown = new Phaser.Signal();
    this.onUp = new Phaser.Signal();
	
};

Phaser.Key.prototype = {

	/**
    *
    * @method update
    * @param {KeyboardEvent} event.
    * @return {}
    */
    processKeyDown: function (event) {

        this.altKey = event.altKey;
        this.ctrlKey = event.ctrlKey;
        this.shiftKey = event.shiftKey;

        if (this.isDown)
        {
            //  Key was already held down, this must be a repeat rate based event
            this.duration = event.timeStamp - this.timeDown;
            this.repeats++;
        }
        else
        {
            this.isDown = true;
            this.isUp = false;
            this.timeDown = event.timeStamp;
            this.duration = 0;
            this.repeats = 0;

            this.onDown.dispatch(this);
        }

    },

    processKeyUp: function (event) {

        this.isDown = false;
        this.isUp = true;
        this.timeUp = event.timeStamp;

        this.onUp.dispatch(this);

    },

	/**
    * @param {Number} [duration]
    * @return {bool}
    */
    justPressed: function (duration) {

        if (typeof duration === "undefined") { duration = 250; }

        return (this.isDown && this.duration < duration);

    },

	/**
    * @param {Number} [duration]
    * @return {bool}
    */
    justReleased: function (duration) {

        if (typeof duration === "undefined") { duration = 250; }

        return (this.isDown == false && (this.game.time.now - this.timeUp < duration));

    }

};