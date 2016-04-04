/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
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
* The Input-related events will only be dispatched if the Sprite has had `inputEnabled` set to `true`
* and the Animation-related events only apply to game objects with animations like {@link Phaser.Sprite}.
*
* @class Phaser.Events
* @constructor
* @param {Phaser.Sprite} sprite - A reference to the game object / Sprite that owns this Events object.
*/
Phaser.Events = function (sprite) {

    /**
    * @property {Phaser.Sprite} parent - The Sprite that owns these events.
    */
    this.parent = sprite;

    // The signals are automatically added by the corresponding proxy properties

};

Phaser.Events.prototype = {

    /**
     * Removes all events.
     *
     * @method Phaser.Events#destroy
     */
    destroy: function () {

        this._parent = null;

        if (this._onDestroy)           { this._onDestroy.dispose(); }
        if (this._onAddedToGroup)      { this._onAddedToGroup.dispose(); }
        if (this._onRemovedFromGroup)  { this._onRemovedFromGroup.dispose(); }
        if (this._onRemovedFromWorld)  { this._onRemovedFromWorld.dispose(); }
        if (this._onKilled)            { this._onKilled.dispose(); }
        if (this._onRevived)           { this._onRevived.dispose(); }
        if (this._onEnterBounds)       { this._onEnterBounds.dispose(); }
        if (this._onOutOfBounds)       { this._onOutOfBounds.dispose(); }

        if (this._onInputOver)         { this._onInputOver.dispose(); }
        if (this._onInputOut)          { this._onInputOut.dispose(); }
        if (this._onInputDown)         { this._onInputDown.dispose(); }
        if (this._onInputUp)           { this._onInputUp.dispose(); }
        if (this._onDragStart)         { this._onDragStart.dispose(); }
        if (this._onDragUpdate)        { this._onDragUpdate.dispose(); }
        if (this._onDragStop)          { this._onDragStop.dispose(); }

        if (this._onAnimationStart)    { this._onAnimationStart.dispose(); }
        if (this._onAnimationComplete) { this._onAnimationComplete.dispose(); }
        if (this._onAnimationLoop)     { this._onAnimationLoop.dispose(); }

    },

    // The following properties are sentinels that will be replaced with getters

    /**
    * @property {Phaser.Signal} onAddedToGroup - This signal is dispatched when the parent is added to a new Group.
    */
    onAddedToGroup: null,

    /**
    * @property {Phaser.Signal} onRemovedFromGroup - This signal is dispatched when the parent is removed from a Group.
    */
    onRemovedFromGroup: null,

    /**
    * @property {Phaser.Signal} onRemovedFromWorld - This signal is dispatched if this item or any of its parents are removed from the game world.
    */
    onRemovedFromWorld: null,

    /**
    * @property {Phaser.Signal} onDestroy - This signal is dispatched when the parent is destroyed.
    */
    onDestroy: null,

    /**
    * @property {Phaser.Signal} onKilled - This signal is dispatched when the parent is killed.
    */
    onKilled: null,

    /**
    * @property {Phaser.Signal} onRevived - This signal is dispatched when the parent is revived.
    */
    onRevived: null,

    /**
    * @property {Phaser.Signal} onOutOfBounds - This signal is dispatched when the parent leaves the world bounds (only if Sprite.checkWorldBounds is true).
    */
    onOutOfBounds: null,

    /**
    * @property {Phaser.Signal} onEnterBounds - This signal is dispatched when the parent returns within the world bounds (only if Sprite.checkWorldBounds is true).
    */
    onEnterBounds: null,

    /**
    * @property {Phaser.Signal} onInputOver - This signal is dispatched if the parent is inputEnabled and receives an over event from a Pointer.
    */
    onInputOver: null,

    /**
    * @property {Phaser.Signal} onInputOut - This signal is dispatched if the parent is inputEnabled and receives an out event from a Pointer.
    */
    onInputOut: null,

    /**
    * @property {Phaser.Signal} onInputDown - This signal is dispatched if the parent is inputEnabled and receives a down event from a Pointer.
    */
    onInputDown: null,

    /**
    * @property {Phaser.Signal} onInputUp - This signal is dispatched if the parent is inputEnabled and receives an up event from a Pointer.
    */
    onInputUp: null,

    /**
    * @property {Phaser.Signal} onDragStart - This signal is dispatched if the parent is inputEnabled and receives a drag start event from a Pointer.
    */
    onDragStart: null,

    /**
    * @property {Phaser.Signal} onDragUpdate - This signal is dispatched if the parent is inputEnabled and receives a drag update event from a Pointer.
    */
    onDragUpdate: null,

    /**
    * @property {Phaser.Signal} onDragStop - This signal is dispatched if the parent is inputEnabled and receives a drag stop event from a Pointer.
    */
    onDragStop: null,

    /**
    * @property {Phaser.Signal} onAnimationStart - This signal is dispatched when the parent has an animation that is played.
    */
    onAnimationStart: null,

    /**
    * @property {Phaser.Signal} onAnimationComplete - This signal is dispatched when the parent has an animation that finishes playing.
    */
    onAnimationComplete: null,

    /**
    * @property {Phaser.Signal} onAnimationLoop - This signal is dispatched when the parent has an animation that loops playback.
    */
    onAnimationLoop: null

};

Phaser.Events.prototype.constructor = Phaser.Events;

// Create an auto-create proxy getter and dispatch method for all events.
// The backing property is the same as the event name, prefixed with '_'
// and the dispatch method is the same as the event name postfixed with '$dispatch'.
for (var prop in Phaser.Events.prototype)
{
    if (!Phaser.Events.prototype.hasOwnProperty(prop) ||
        prop.indexOf('on') !== 0 ||
        Phaser.Events.prototype[prop] !== null)
    {
        continue;
    }

    (function (prop, backing) {
        'use strict';

        // The accessor creates a new Signal; and so it should only be used from user-code.
        Object.defineProperty(Phaser.Events.prototype, prop, {
            get: function () {
                return this[backing] || (this[backing] = new Phaser.Signal());
            }
        });

        // The dispatcher will only broadcast on an already-created signal; call this internally.
        Phaser.Events.prototype[prop + '$dispatch'] = function () {
            return this[backing] ? this[backing].dispatch.apply(this[backing], arguments) : null;
        };

    })(prop, '_' + prop);

}
