/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Events component is a collection of events fired by the parent game object.
*
* For example to tell when a Sprite has been added to a new group:
*
* `sprite.events.onAddedToGroup.add(yourFunction, this);`
*
* Where `yourFunction` is the function you want called when this event occurs.
*
* Note that the Input related events only exist if the Sprite has had `inputEnabled` set to `true`.
*
* @class Phaser.Events
* @constructor
* @param {Phaser.Sprite} sprite - A reference to the Sprite that owns this Events object.
*/
Phaser.Events = function (sprite) {

    /**
    * @property {Phaser.Sprite} parent - The Sprite that owns these events.
    */
    this.parent = sprite;

    /**
    * @property {Phaser.Signal} onAddedToGroup - This signal is dispatched when the parent is added to a new Group.
    */
    this.onAddedToGroup = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onRemovedFromGroup - This signal is dispatched when the parent is removed from a Group.
    */
    this.onRemovedFromGroup = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onDestroy - This signal is dispatched when the parent is destoyed.
    */
    this.onDestroy = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onKilled - This signal is dispatched when the parent is killed.
    */
    this.onKilled = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onRevived - This signal is dispatched when the parent is revived.
    */
    this.onRevived = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onOutOfBounds - This signal is dispatched when the parent leaves the world bounds (only if Sprite.checkWorldBounds is true).
    */
    this.onOutOfBounds = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onEnterBounds - This signal is dispatched when the parent returns within the world bounds (only if Sprite.checkWorldBounds is true).
    */
    this.onEnterBounds = new Phaser.Signal();

    /**
    * @property {Phaser.Signal} onInputOver - This signal is dispatched if the parent is inputEnabled and receives an over event from a Pointer.
    * @default null
    */
    this.onInputOver = null;

    /**
    * @property {Phaser.Signal} onInputOut - This signal is dispatched if the parent is inputEnabled and receives an out event from a Pointer.
    * @default null
    */
    this.onInputOut = null;

    /**
    * @property {Phaser.Signal} onInputDown - This signal is dispatched if the parent is inputEnabled and receives a down event from a Pointer.
    * @default null
    */
    this.onInputDown = null;

    /**
    * @property {Phaser.Signal} onInputUp - This signal is dispatched if the parent is inputEnabled and receives an up event from a Pointer.
    * @default null
    */
    this.onInputUp = null;

    /**
    * @property {Phaser.Signal} onDragStart - This signal is dispatched if the parent is inputEnabled and receives a drag start event from a Pointer.
    * @default null
    */
    this.onDragStart = null;

    /**
    * @property {Phaser.Signal} onDragStop - This signal is dispatched if the parent is inputEnabled and receives a drag stop event from a Pointer.
    * @default null
    */
    this.onDragStop = null;

    /**
    * @property {Phaser.Signal} onAnimationStart - This signal is dispatched when the parent has an animation that is played.
    * @default null
    */
    this.onAnimationStart = null;

    /**
    * @property {Phaser.Signal} onAnimationComplete - This signal is dispatched when the parent has an animation that finishes playing.
    * @default null
    */
    this.onAnimationComplete = null;

    /**
    * @property {Phaser.Signal} onAnimationLoop - This signal is dispatched when the parent has an animation that loops playback.
    * @default null
    */
    this.onAnimationLoop = null;

};

Phaser.Events.prototype = {

    /**
     * Removes all events.
     *
     * @method destroy
     */
    destroy: function () {

        this.parent = null;

        this.onDestroy.dispose();
        this.onAddedToGroup.dispose();
        this.onRemovedFromGroup.dispose();
        this.onKilled.dispose();
        this.onRevived.dispose();
        this.onOutOfBounds.dispose();

        if (this.onInputOver)
        {
            this.onInputOver.dispose();
            this.onInputOut.dispose();
            this.onInputDown.dispose();
            this.onInputUp.dispose();
            this.onDragStart.dispose();
            this.onDragStop.dispose();
        }

        if (this.onAnimationStart)
        {
            this.onAnimationStart.dispose();
            this.onAnimationComplete.dispose();
            this.onAnimationLoop.dispose();
        }

    }

};

Phaser.Events.prototype.constructor = Phaser.Events;
