/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Scene Transition Wake Event.
 * 
 * This event is dispatched by the Target Scene of a transition, only if that Scene was asleep before
 * the transition began. If the Scene was not asleep the [TRANSITION_START]{Phaser.Scenes.Events#TRANSITION_START} event is dispatched instead.
 * 
 * Listen to it from a Scene using `this.scene.events.on('transitionwake', listener)`.
 * 
 * The Scene Transition event flow is as follows:
 * 
 * 1) [TRANSITION_OUT]{Phaser.Scenes.Events#TRANSITION_OUT} - the Scene that started the transition will emit this event.
 * 2) [TRANSITION_INIT]{Phaser.Scenes.Events#TRANSITION_INIT} - the Target Scene will emit this event if it has an `init` method.
 * 3a) [TRANSITION_START]{Phaser.Scenes.Events#TRANSITION_START} - the Target Scene will emit this event after its `create` method is called, OR ...
 * 3b) [TRANSITION_WAKE]{Phaser.Scenes.Events#TRANSITION_WAKE} - the Target Scene will emit this event if it was asleep and has been woken-up to be transitioned to.
 * 4) [TRANSITION_COMPLETE]{Phaser.Scenes.Events#TRANSITION_COMPLETE} - the Target Scene will emit this event when the transition finishes.
 * 
 * @event Phaser.Scenes.Events#TRANSITION_WAKE
 * 
 * @param {Phaser.Scene} from - A reference to the Scene that is being transitioned from.
 * @param {number} duration - The duration of the transition in ms.
 */
module.exports = 'transitionwake';
