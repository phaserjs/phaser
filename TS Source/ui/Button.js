var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    /**
    * Phaser - UI - Button
    */
    (function (UI) {
        var Button = (function (_super) {
            __extends(Button, _super);
            /**
            * Create a new <code>Button</code> object.
            *
            * @param game {Phaser.Game} Current game instance.
            * @param [x] {number} X position of the button.
            * @param [y] {number} Y position of the button.
            * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this button.
            * @param [callback] {function} The function to call when this button is pressed
            * @param [callbackContext] {object} The context in which the callback will be called (usually 'this')
            * @param [overFrame] {string|number} This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
            * @param [outFrame] {string|number} This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
            * @param [downFrame] {string|number} This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
            */
            function Button(game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                if (typeof key === "undefined") { key = null; }
                if (typeof callback === "undefined") { callback = null; }
                if (typeof callbackContext === "undefined") { callbackContext = null; }
                if (typeof overFrame === "undefined") { overFrame = null; }
                if (typeof outFrame === "undefined") { outFrame = null; }
                if (typeof downFrame === "undefined") { downFrame = null; }
                        _super.call(this, game, x, y, key, outFrame);
                this._onOverFrameName = null;
                this._onOutFrameName = null;
                this._onDownFrameName = null;
                this._onUpFrameName = null;
                this._onOverFrameID = null;
                this._onOutFrameID = null;
                this._onDownFrameID = null;
                this._onUpFrameID = null;
                this.type = Phaser.Types.BUTTON;
                if(typeof overFrame == 'string') {
                    this._onOverFrameName = overFrame;
                } else {
                    this._onOverFrameID = overFrame;
                }
                if(typeof outFrame == 'string') {
                    this._onOutFrameName = outFrame;
                    this._onUpFrameName = outFrame;
                } else {
                    this._onOutFrameID = outFrame;
                    this._onUpFrameID = outFrame;
                }
                if(typeof downFrame == 'string') {
                    this._onDownFrameName = downFrame;
                } else {
                    this._onDownFrameID = downFrame;
                }
                //  These are the signals the game will subscribe to
                this.onInputOver = new Phaser.Signal();
                this.onInputOut = new Phaser.Signal();
                this.onInputDown = new Phaser.Signal();
                this.onInputUp = new Phaser.Signal();
                //  Set a default signal for them
                if(callback) {
                    this.onInputUp.add(callback, callbackContext);
                }
                this.input.start(0, false, true);
                //  Redirect the input events to here so we can handle animation updates, etc
                this.events.onInputOver.add(this.onInputOverHandler, this);
                this.events.onInputOut.add(this.onInputOutHandler, this);
                this.events.onInputDown.add(this.onInputDownHandler, this);
                this.events.onInputUp.add(this.onInputUpHandler, this);
            }
            Button.prototype.onInputOverHandler = //  TODO
            //public tabIndex: number;
            //public tabEnabled: bool;
            //  ENTER or SPACE can activate this button if it has focus
            function (pointer) {
                if(this._onOverFrameName != null) {
                    this.frameName = this._onOverFrameName;
                } else if(this._onOverFrameID != null) {
                    this.frame = this._onOverFrameID;
                }
                if(this.onInputOver) {
                    this.onInputOver.dispatch(this, pointer);
                }
            };
            Button.prototype.onInputOutHandler = function (pointer) {
                if(this._onOutFrameName != null) {
                    this.frameName = this._onOutFrameName;
                } else if(this._onOutFrameID != null) {
                    this.frame = this._onOutFrameID;
                }
                if(this.onInputOut) {
                    this.onInputOut.dispatch(this, pointer);
                }
            };
            Button.prototype.onInputDownHandler = function (pointer) {
                //console.log('Button onInputDownHandler: ' + Date.now());
                if(this._onDownFrameName != null) {
                    this.frameName = this._onDownFrameName;
                } else if(this._onDownFrameID != null) {
                    this.frame = this._onDownFrameID;
                }
                if(this.onInputDown) {
                    this.onInputDown.dispatch(this, pointer);
                }
            };
            Button.prototype.onInputUpHandler = function (pointer) {
                //console.log('Button onInputUpHandler: ' + Date.now());
                if(this._onUpFrameName != null) {
                    this.frameName = this._onUpFrameName;
                } else if(this._onUpFrameID != null) {
                    this.frame = this._onUpFrameID;
                }
                if(this.onInputUp) {
                    this.onInputUp.dispatch(this, pointer);
                }
            };
            Object.defineProperty(Button.prototype, "priorityID", {
                get: function () {
                    return this.input.priorityID;
                },
                set: function (value) {
                    this.input.priorityID = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Button.prototype, "useHandCursor", {
                get: function () {
                    return this.input.useHandCursor;
                },
                set: function (value) {
                    this.input.useHandCursor = value;
                },
                enumerable: true,
                configurable: true
            });
            return Button;
        })(Phaser.Sprite);
        UI.Button = Button;        
    })(Phaser.UI || (Phaser.UI = {}));
    var UI = Phaser.UI;
})(Phaser || (Phaser = {}));
