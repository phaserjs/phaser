/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.Input is the Input Manager for all types of Input across Phaser, including mouse, keyboard, touch and MSPointer.
* The Input manager is updated automatically by the core game loop.
*
* @class Phaser.Input
* @constructor
* @param {Phaser.Game} game - Current game instance.
*/
Phaser.State.Input = function (state)
{
    /**
    * @property {Phaser.State} state - A reference to the State that owns this system.
    */
    this.state = state;

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = state.game;

    /**
    * @property {Phaser.Input} manager - A reference to the global Input Manager.
    */
    this.manager = this.game.input;

    /**
    * An array of callbacks that will be fired every time the activePointer receives a move event from the DOM.
    * To add a callback to this array please use `Input.addMoveCallback`.
    * @property {array} moveCallbacks
    * @protected
    */
    this.moveCallbacks = [];

    /**
    * @property {function} customCandidateHandler - See Input.setInteractiveCandidateHandler.
    * @private
    */
    this.customCandidateHandler = null;

    /**
    * @property {object} customCandidateHandlerContext - See Input.setInteractiveCandidateHandler.
    * @private
    */
    this.customCandidateHandlerContext = null;

    /**
    * The most recently active Pointer object.
    * 
    * When you've limited max pointers to 1 this will accurately be either the first finger touched or mouse.
    * 
    * @property {Phaser.Pointer} activePointer
    */
    this.activePointer = null;

    /**
    * The mouse has its own unique Phaser.Pointer object which you can use if making a desktop specific game.
    * 
    * @property {Pointer} mousePointer
    */
    this.mousePointer = null;

    /**
    * The Mouse Input manager.
    * 
    * You should not usually access this manager directly, but instead use Input.mousePointer or Input.activePointer 
    * which normalizes all the input values for you, regardless of browser.
    * 
    * @property {Phaser.Mouse} mouse
    */
    this.mouse = null;

    /**
    * The Keyboard Input manager.
    * 
    * @property {Phaser.Keyboard} keyboard
    */
    this.keyboard = null;

    /**
    * The Touch Input manager.
    * 
    * You should not usually access this manager directly, but instead use Input.activePointer 
    * which normalizes all the input values for you, regardless of browser.
    * 
    * @property {Phaser.Touch} touch
    */
    this.touch = null;

    /**
    * The MSPointer Input manager.
    * 
    * You should not usually access this manager directly, but instead use Input.activePointer 
    * which normalizes all the input values for you, regardless of browser.
    * 
    * @property {Phaser.MSPointer} mspointer
    */
    this.mspointer = null;

    /**
    * The Gamepad Input manager.
    * 
    * @property {Phaser.Gamepad} gamepad
    */
    this.gamepad = null;

    /**
    * A Signal that is dispatched each time a pointer is pressed down.
    * @property {Phaser.Signal} onDown
    */
    this.onDown = null;

    /**
    * A Signal that is dispatched each time a pointer is released.
    * @property {Phaser.Signal} onUp
    */
    this.onUp = null;

    /**
    * A Signal that is dispatched each time a pointer is tapped.
    * @property {Phaser.Signal} onTap
    */
    this.onTap = null;

    /**
    * A Signal that is dispatched each time a pointer is held down.
    * @property {Phaser.Signal} onHold
    */
    this.onHold = null;

    /**
    * You can tell all Pointers to ignore any Game Object with a `priorityID` lower than this value.
    * This is useful when stacking UI layers. Set to zero to disable.
    * @property {number} minPriorityID
    * @default
    */
    this.minPriorityID = 0;

    /**
    * A list of interactive objects. The InputHandler components add and remove themselves from this list.
    * @property {Phaser.ArraySet} interactiveItems
    */
    this.interactiveItems = new Phaser.ArraySet();

};

Phaser.State.Input.prototype.constructor = Phaser.State.Input;

Phaser.State.Input.prototype = {

    init: function ()
    {
        this.activePointer = this.manager.activePointer;
        this.mousePointer = this.manager.mousePointer;

        this.mouse = this.manager.mouse;
        this.keyboard = this.manager.keyboard;
        this.touch = this.manager.touch;
        this.mspointer = this.manager.mspointer;
        this.gamepad = this.manager.gamepad;

        this.onDown = this.manager.onDown;
        this.onUp = this.manager.onUp;
        this.onTap = this.manager.onTap;
        this.onHold = this.manager.onHold;
    },

    /**
    * Adds a callback that is fired every time `Pointer.processInteractiveObjects` is called.
    * The purpose of `processInteractiveObjects` is to work out which Game Object the Pointer is going to
    * interact with. It works by polling all of the valid game objects, and then slowly discounting those
    * that don't meet the criteria (i.e. they aren't under the Pointer, are disabled, invisible, etc).
    *
    * Eventually a short-list of 'candidates' is created. These are all of the Game Objects which are valid
    * for input and overlap with the Pointer. If you need fine-grained control over which of the items is
    * selected then you can use this callback to do so.
    *
    * The callback will be sent 3 parameters:
    * 
    * 1) A reference to the Phaser.Pointer object that is processing the Items.
    * 2) An array containing all potential interactive candidates. This is an array of `InputHandler` objects, not Sprites.
    * 3) The current 'favorite' candidate, based on its priorityID and position in the display list.
    *
    * Your callback MUST return one of the candidates sent to it.
    * 
    * @method Phaser.Input#setInteractiveCandidateHandler
    * @param {function} callback - The callback that will be called each time `Pointer.processInteractiveObjects` is called. Set to `null` to disable.
    * @param {object} context - The context in which the callback will be called.
    */
    setInteractiveCandidateHandler: function (callback, context)
    {
        this.customCandidateHandler = callback;
        this.customCandidateHandlerContext = context;
    },

    /**
    * Adds a callback that is fired every time the activePointer receives a DOM move event such as a mousemove or touchmove.
    *
    * The callback will be sent 4 parameters:
    * 
    * A reference to the Phaser.Pointer object that moved,
    * The x position of the pointer,
    * The y position,
    * A boolean indicating if the movement was the result of a 'click' event (such as a mouse click or touch down).
    * 
    * It will be called every time the activePointer moves, which in a multi-touch game can be a lot of times, so this is best
    * to only use if you've limited input to a single pointer (i.e. mouse or touch).
    * 
    * The callback is added to the Phaser.Input.moveCallbacks array and should be removed with Phaser.Input.deleteMoveCallback.
    * 
    * @method Phaser.Input#addMoveCallback
    * @param {function} callback - The callback that will be called each time the activePointer receives a DOM move event.
    * @param {object} context - The context in which the callback will be called.
    */
    addMoveCallback: function (callback, context)
    {
        this.moveCallbacks.push({ callback: callback, context: context });
    },

    /**
    * Removes the callback from the Phaser.Input.moveCallbacks array.
    * 
    * @method Phaser.Input#deleteMoveCallback
    * @param {function} callback - The callback to be removed.
    * @param {object} context - The context in which the callback exists.
    */
    deleteMoveCallback: function (callback, context)
    {
        var i = this.moveCallbacks.length;

        while (i--)
        {
            if (this.moveCallbacks[i].callback === callback && this.moveCallbacks[i].context === context)
            {
                this.moveCallbacks.splice(i, 1);
                return;
            }
        }
    }


};

