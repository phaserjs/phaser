/// <reference path="../Game.ts" />
/// <reference path="../math/Vec2.ts" />
/// <reference path="../geom/Rectangle.ts" />
/// <reference path="../animation/AnimationManager.ts" />
/// <reference path="../input/InputHandler.ts" />
/// <reference path="../display/Texture.ts" />
/// <reference path="../gameobjects/TransformManager.ts" />
/// <reference path="../gameobjects/Events.ts" />

/**
* Phaser - UI - Button
*/

module Phaser.UI {

    export class Button extends Sprite {

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
        constructor(game: Game, x?: number = 0, y?: number = 0, key?: string = null, callback? = null, callbackContext? = null, overFrame? = null, outFrame? = null, downFrame? = null) {

            super(game, x, y, key, outFrame);

            this.type = Phaser.Types.BUTTON;

            if (typeof overFrame == 'string')
            {
                this._onOverFrameName = overFrame;
            }
            else
            {
                this._onOverFrameID = overFrame;
            }

            if (typeof outFrame == 'string')
            {
                this._onOutFrameName = outFrame;
                this._onUpFrameName = outFrame;
            }
            else
            {
                this._onOutFrameID = outFrame;
                this._onUpFrameID = outFrame;
            }

            if (typeof downFrame == 'string')
            {
                this._onDownFrameName = downFrame;
            }
            else
            {
                this._onDownFrameID = downFrame;
            }

            //  These are the signals the game will subscribe to
            this.onInputOver = new Phaser.Signal;
            this.onInputOut = new Phaser.Signal;
            this.onInputDown = new Phaser.Signal;
            this.onInputUp = new Phaser.Signal;

            //  Set a default signal for them
            if (callback)
            {
                this.onInputUp.add(callback, callbackContext);
            }

            this.input.start(0, false, true);

            //  Redirect the input events to here so we can handle animation updates, etc
            this.events.onInputOver.add(this.onInputOverHandler, this);
            this.events.onInputOut.add(this.onInputOutHandler, this);
            this.events.onInputDown.add(this.onInputDownHandler, this);
            this.events.onInputUp.add(this.onInputUpHandler, this);

            //  By default we'll position it using screen space, not world space.
            this.transform.scrollFactor.setTo(0, 0);

        }

        private _onOverFrameName = null;
        private _onOutFrameName = null;
        private _onDownFrameName = null;
        private _onUpFrameName = null;
        private _onOverFrameID = null;
        private _onOutFrameID = null;
        private _onDownFrameID = null;
        private _onUpFrameID = null;

        /**
         * Dispatched when a pointer moves over an Input enabled sprite.
         */
        public onInputOver: Phaser.Signal;

        /**
         * Dispatched when a pointer moves out of an Input enabled sprite.
         */
        public onInputOut: Phaser.Signal;

        /**
         * Dispatched when a pointer is pressed down on an Input enabled sprite.
         */
        public onInputDown: Phaser.Signal;

        /**
         * Dispatched when a pointer is released over an Input enabled sprite
         */
        public onInputUp: Phaser.Signal;

        //  TODO
        //public tabIndex: number;
        //public tabEnabled: bool;

        //  ENTER or SPACE can activate this button if it has focus

        private onInputOverHandler(pointer:Phaser.Pointer) {
            
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

        }

        private onInputOutHandler(pointer:Phaser.Pointer) {

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

        }

        private onInputDownHandler(pointer:Phaser.Pointer) {

            //console.log('Button onInputDownHandler: ' + Date.now());

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

        }

        private onInputUpHandler(pointer:Phaser.Pointer) {

            //console.log('Button onInputUpHandler: ' + Date.now());

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

        }

        public set priorityID(value: number) {
            this.input.priorityID = value;
        }

        public get priorityID(): number {
            return this.input.priorityID;
        }

        public set useHandCursor(value: bool) {
            this.input.useHandCursor = value;
        }

        public get useHandCursor(): bool {
            return this.input.useHandCursor;
        }

    }

}