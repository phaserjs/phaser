Phaser.Mouse = function (game) {

	this.game = game;
	this.callbackContext = this.game;

	this.mouseDownCallback = null;
	this.mouseMoveCallback = null;
	this.mouseUpCallback = null;

};

Phaser.Mouse.LEFT_BUTTON = 0;
Phaser.Mouse.MIDDLE_BUTTON = 1;
Phaser.Mouse.RIGHT_BUTTON = 2;

Phaser.Mouse.prototype = {

	game: null,

    /**
    * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
    * @type {bool}
    */
	disabled: false,

	/**
    * Starts the event listeners running
    * @method start
    */
    start: function () {

        var _this = this;

        if (this.game.device.android && this.game.device.chrome == false)
        {
            //  Android stock browser fires mouse events even if you preventDefault on the touchStart, so ...
            return;
        }

        this._onMouseDown = function (event) {
            return _this.onMouseDown(event);
        };

        this._onMouseMove = function (event) {
            return _this.onMouseMove(event);
        };

        this._onMouseUp = function (event) {
            return _this.onMouseUp(event);
        };

        this.game.stage.canvas.addEventListener('mousedown', this._onMouseDown, true);
        this.game.stage.canvas.addEventListener('mousemove', this._onMouseMove, true);
        this.game.stage.canvas.addEventListener('mouseup', this._onMouseUp, true);
    },

	/**
    * @param {MouseEvent} event
    */
    onMouseDown: function (event) {

        if (this.mouseDownCallback)
        {
            this.mouseDownCallback.call(this.callbackContext, event);
        }

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        event['identifier'] = 0;

        this.game.input.mousePointer.start(event);

    },

	/**
    * @param {MouseEvent} event
    */
    onMouseMove: function (event) {

        if (this.mouseMoveCallback)
        {
            this.mouseMoveCallback.call(this.callbackContext, event);
        }

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        event['identifier'] = 0;

        this.game.input.mousePointer.move(event);

    },

	/**
    * @param {MouseEvent} event
    */
    onMouseUp: function (event) {

        if (this.mouseUpCallback)
        {
            this.mouseUpCallback.call(this.callbackContext, event);
        }

        if (this.game.input.disabled || this.disabled)
        {
            return;
        }

        event['identifier'] = 0;

        this.game.input.mousePointer.stop(event);

    },

	/**
    * Stop the event listeners
    * @method stop
    */
    stop: function () {

        this.game.stage.canvas.removeEventListener('mousedown', this._onMouseDown);
        this.game.stage.canvas.removeEventListener('mousemove', this._onMouseMove);
        this.game.stage.canvas.removeEventListener('mouseup', this._onMouseUp);

    }

};