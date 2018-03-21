/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Events component is a collection of events fired by the parent Game Object.
* 
* Phaser uses what are known as 'Signals' for all event handling. All of the events in
* this class are signals you can subscribe to, much in the same way you'd "listen" for
* an event.
*
* For example to tell when a Sprite has been added to a new group, you can bind a function
* to the `onAddedToGroup` signal:
*
* `sprite.events.onAddedToGroup.add(yourFunction, this);`
*
* Where `yourFunction` is the function you want called when this event occurs.
* 
* For more details about how signals work please see the Phaser.Signal class.
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
    * This signal is dispatched when this Game Object is added to a new Group.
    * It is sent two arguments:
    * {any} The Game Object that was added to the Group.
    * {Phaser.Group} The Group it was added to.
    * @property {Phaser.Signal} onAddedToGroup
    */
    onAddedToGroup: null,

    /**
    * This signal is dispatched when the Game Object is removed from a Group.
    * It is sent two arguments:
    * {any} The Game Object that was removed from the Group.
    * {Phaser.Group} The Group it was removed from.
    * @property {Phaser.Signal} onRemovedFromGroup
    */
    onRemovedFromGroup: null,

    /**
    * This Signal is never used internally by Phaser and is now deprecated.
    * @deprecated
    * @property {Phaser.Signal} onRemovedFromWorld
    */
    onRemovedFromWorld: null,

    /**
    * This signal is dispatched when the Game Object is destroyed.
    * This happens when `Sprite.destroy()` is called, or `Group.destroy()` with `destroyChildren` set to true.
    * It is sent one argument:
    * {any} The Game Object that was destroyed.
    * @property {Phaser.Signal} onDestroy
    */
    onDestroy: null,

    /**
    * This signal is dispatched when the Game Object is killed.
    * This happens when `Sprite.kill()` is called.
    * Please understand the difference between `kill` and `destroy` by looking at their respective methods.
    * It is sent one argument:
    * {any} The Game Object that was killed.
    * @property {Phaser.Signal} onKilled
    */
    onKilled: null,

    /**
    * This signal is dispatched when the Game Object is revived from a previously killed state.
    * This happens when `Sprite.revive()` is called.
    * It is sent one argument:
    * {any} The Game Object that was revived.
    * @property {Phaser.Signal} onRevived
    */
    onRevived: null,

    /**
    * This signal is dispatched when the Game Object leaves the Phaser.World bounds.
    * This signal is only if `Sprite.checkWorldBounds` is set to `true`.
    * It is sent one argument:
    * {any} The Game Object that left the World bounds.
    * @property {Phaser.Signal} onOutOfBounds
    */
    onOutOfBounds: null,

    /**
    * This signal is dispatched when the Game Object returns within the Phaser.World bounds, having previously been outside of them.
    * This signal is only if `Sprite.checkWorldBounds` is set to `true`.
    * It is sent one argument:
    * {any} The Game Object that entered the World bounds.
    * @property {Phaser.Signal} onEnterBounds
    */
    onEnterBounds: null,

    /**
    * This signal is dispatched if the Game Object has `inputEnabled` set to `true`, 
    * and receives an over event from a Phaser.Pointer.
    * It is sent two arguments:
    * {any} The Game Object that received the event.
    * {Phaser.Pointer} The Phaser.Pointer object that caused the event.
    * @property {Phaser.Signal} onInputOver
    */
    onInputOver: null,

    /**
    * This signal is dispatched if the Game Object has `inputEnabled` set to `true`, 
    * and receives an out event from a Phaser.Pointer, which was previously over it.
    * It is sent two arguments:
    * {any} The Game Object that received the event.
    * {Phaser.Pointer} The Phaser.Pointer object that caused the event.
    * @property {Phaser.Signal} onInputOut
    */
    onInputOut: null,

    /**
    * This signal is dispatched if the Game Object has `inputEnabled` set to `true`, 
    * and receives a down event from a Phaser.Pointer. This effectively means the Pointer has been
    * pressed down (but not yet released) on the Game Object.
    * It is sent two arguments:
    * {any} The Game Object that received the event.
    * {Phaser.Pointer} The Phaser.Pointer object that caused the event.
    * @property {Phaser.Signal} onInputDown
    */
    onInputDown: null,

    /**
    * This signal is dispatched if the Game Object has `inputEnabled` set to `true`, 
    * and receives an up event from a Phaser.Pointer. This effectively means the Pointer had been
    * pressed down, and was then released on the Game Object.
    * It is sent three arguments:
    * {any} The Game Object that received the event.
    * {Phaser.Pointer} The Phaser.Pointer object that caused the event.
    * {boolean} isOver - Is the Pointer still over the Game Object?
    * @property {Phaser.Signal} onInputUp
    */
    onInputUp: null,

    /**
    * This signal is dispatched if the Game Object has been `inputEnabled` and `enableDrag` has been set.
    * It is sent when a Phaser.Pointer starts to drag the Game Object, taking into consideration the various
    * drag limitations that may be set.
    * It is sent four arguments:
    * {any} The Game Object that received the event.
    * {Phaser.Pointer} The Phaser.Pointer object that caused the event.
    * {number} The x coordinate that the drag started from.
    * {number} The y coordinate that the drag started from.
    * @property {Phaser.Signal} onDragStart
    */
    onDragStart: null,

    /**
    * This signal is dispatched if the Game Object has been `inputEnabled` and `enableDrag` has been set.
    * It is sent when a Phaser.Pointer is actively dragging the Game Object.
    * Be warned: This is a high volume Signal. Be careful what you bind to it.
    * It is sent six arguments:
    * {any} The Game Object that received the event.
    * {Phaser.Pointer} The Phaser.Pointer object that caused the event.
    * {number} The new x coordinate of the Game Object.
    * {number} The new y coordinate of the Game Object.
    * {Phaser.Point} A Point object that contains the point the Game Object was snapped to, if `snapOnDrag` has been enabled.
    * {boolean} The `fromStart` boolean, indicates if this is the first update immediately after the drag has started.
    * @property {Phaser.Signal} onDragUpdate
    */
    onDragUpdate: null,

    /**
    * This signal is dispatched if the Game Object has been `inputEnabled` and `enableDrag` has been set.
    * It is sent when a Phaser.Pointer stops dragging the Game Object.
    * It is sent two arguments:
    * {any} The Game Object that received the event.
    * {Phaser.Pointer} The Phaser.Pointer object that caused the event.
    * @property {Phaser.Signal} onDragStop
    */
    onDragStop: null,

    /**
    * This signal is dispatched if the Game Object has the AnimationManager component, 
    * and an Animation has been played.
    * You can also listen to `Animation.onStart` rather than via the Game Objects events.
    * It is sent two arguments:
    * {any} The Game Object that received the event.
    * {Phaser.Animation} The Phaser.Animation that was started.
    * @property {Phaser.Signal} onAnimationStart
    */
    onAnimationStart: null,

    /**
    * This signal is dispatched if the Game Object has the AnimationManager component, 
    * and an Animation has been stopped (via `animation.stop()` and the `dispatchComplete` argument has been set.
    * You can also listen to `Animation.onComplete` rather than via the Game Objects events.
    * It is sent two arguments:
    * {any} The Game Object that received the event.
    * {Phaser.Animation} The Phaser.Animation that was stopped.
    * @property {Phaser.Signal} onAnimationComplete
    */
    onAnimationComplete: null,

    /**
    * This signal is dispatched if the Game Object has the AnimationManager component, 
    * and an Animation has looped playback.
    * You can also listen to `Animation.onLoop` rather than via the Game Objects events.
    * It is sent two arguments:
    * {any} The Game Object that received the event.
    * {Phaser.Animation} The Phaser.Animation that looped.
    * @property {Phaser.Signal} onAnimationLoop
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
