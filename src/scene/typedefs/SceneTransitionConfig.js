/**
 * @typedef {object} Phaser.Types.Scenes.SceneTransitionConfig
 * @since 3.5.0
 *
 * @property {string} target - The Scene key to transition to.
 * @property {integer} [duration=1000] - The duration, in ms, for the transition to last.
 * @property {boolean} [sleep=false] - Will the Scene responsible for the transition be sent to sleep on completion (`true`), or stopped? (`false`)
 * @property {boolean} [remove=false] - Will the Scene responsible for the transition be removed from the Scene Manager after the transition completes?
 * @property {boolean} [allowInput=false] - Will the Scenes Input system be able to process events while it is transitioning in or out?
 * @property {boolean} [moveAbove] - Move the target Scene to be above this one before the transition starts.
 * @property {boolean} [moveBelow] - Move the target Scene to be below this one before the transition starts.
 * @property {function} [onUpdate] - This callback is invoked every frame for the duration of the transition.
 * @property {any} [onUpdateScope] - The context in which the callback is invoked.
 * @property {any} [data] - An object containing any data you wish to be passed to the target scene's init / create methods (if sleep is false) or to the target scene's wake event callback (if sleep is true).
 */
