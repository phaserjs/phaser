/**
 * @interface GameEventsEmitter
 * @memberof Phaser.Types.Core
 * @extends Phaser.Events.EventEmitter
 * @since 3.0.0
 */

/**
 * Return the listeners registered for a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#listeners
 * @since 3.0.0
 * 
 * @generic {keyof Phaser.Types.Core.GameEventsMap} K - [event]
 *
 * @param {(string|symbol)} event - The event name.
 *
 * @return {Function[]} The registered listeners.
 */

/**
 * Return the listeners registered for a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#listeners
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 *
 * @return {Function[]} The registered listeners.
 */

/**
 * Return the number of listeners listening to a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#listenerCount
 * @since 3.0.0
 * 
 * @generic {keyof Phaser.Types.Core.GameEventsMap} K - [event]
 *
 * @param {(string|symbol)} event - The event name.
 *
 * @return {number} The number of listeners.
 */

/**
 * Return the number of listeners listening to a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#listenerCount
 * @since 3.0.0
 * 
 * @generic {keyof Phaser.Types.Core.GameEventsMap} K - [event]
 *
 * @param {(string|symbol)} event - The event name.
 *
 * @return {number} The number of listeners.
 */

/**
 * Calls each of the listeners registered for a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#emit
 * @since 3.0.0
 * 
 * @generic {keyof Phaser.Types.Core.GameEventsMap} K - [event]
 * @genericUse {Phaser.Types.Events.EmitArguments<Phaser.Types.Core.GameEventsMap[K]>} - [args]
 *
 * @param {(string|symbol)} event - The event name.
 * @param {...*} [args] - Additional arguments that will be passed to the event handler.
 *
 * @return {boolean} `true` if the event had listeners, else `false`.
 */

/**
 * Calls each of the listeners registered for a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#emit
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 * @param {...*} [args] - Additional arguments that will be passed to the event handler.
 *
 * @return {boolean} `true` if the event had listeners, else `false`.
 */

/**
 * Add a listener for a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#on
 * @since 3.0.0
 * 
 * @generic {keyof Phaser.Types.Core.GameEventsMap} K - [event]
 * @genericUse {Phaser.Types.Core.GameEventsMap[K]} - [fn]
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} fn - The listener function.
 * @param {*} [context=this] - The context to invoke the listener with.
 *
 * @return {this} `this`.
 */

/**
 * Add a listener for a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#on
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} fn - The listener function.
 * @param {*} [context=this] - The context to invoke the listener with.
 *
 * @return {this} `this`.
 */

/**
 * Add a listener for a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#addListener
 * @since 3.0.0
 * 
 * @generic {keyof Phaser.Types.Core.GameEventsMap} K - [event]
 * @genericUse {Phaser.Types.Core.GameEventsMap[K]} - [fn]
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} fn - The listener function.
 * @param {*} [context=this] - The context to invoke the listener with.
 *
 * @return {this} `this`.
 */

/**
 * Add a listener for a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#addListener
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} fn - The listener function.
 * @param {*} [context=this] - The context to invoke the listener with.
 *
 * @return {this} `this`.
 */

/**
 * Add a one-time listener for a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#once
 * @since 3.0.0
 * 
 * @generic {keyof Phaser.Types.Core.GameEventsMap} K - [event]
 * @genericUse {Phaser.Types.Core.GameEventsMap[K]} - [fn]
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} fn - The listener function.
 * @param {*} [context=this] - The context to invoke the listener with.
 *
 * @return {this} `this`.
 */

/**
 * Add a one-time listener for a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#once
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} fn - The listener function.
 * @param {*} [context=this] - The context to invoke the listener with.
 *
 * @return {this} `this`.
 */

/**
 * Remove the listeners of a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#removeListener
 * @since 3.0.0
 * 
 * @generic {keyof Phaser.Types.Core.GameEventsMap} K - [event]
 * @genericUse {Phaser.Types.Core.GameEventsMap[K]} - [fn]
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} [fn] - Only remove the listeners that match this function.
 * @param {*} [context] - Only remove the listeners that have this context.
 * @param {boolean} [once] - Only remove one-time listeners.
 *
 * @return {this} `this`.
 */

/**
 * Remove the listeners of a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#removeListener
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} [fn] - Only remove the listeners that match this function.
 * @param {*} [context] - Only remove the listeners that have this context.
 * @param {boolean} [once] - Only remove one-time listeners.
 *
 * @return {this} `this`.
 */

/**
 * Remove the listeners of a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#off
 * @since 3.0.0
 * 
 * @generic {keyof Phaser.Types.Core.GameEventsMap} K - [event]
 * @genericUse {Phaser.Types.Core.GameEventsMap[K]} - [fn]
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} [fn] - Only remove the listeners that match this function.
 * @param {*} [context] - Only remove the listeners that have this context.
 * @param {boolean} [once] - Only remove one-time listeners.
 *
 * @return {this} `this`.
 */

/**
 * Remove the listeners of a given event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#off
 * @since 3.0.0
 *
 * @param {(string|symbol)} event - The event name.
 * @param {function} [fn] - Only remove the listeners that match this function.
 * @param {*} [context] - Only remove the listeners that have this context.
 * @param {boolean} [once] - Only remove one-time listeners.
 *
 * @return {this} `this`.
 */

/**
 * Remove all listeners, or those of the specified event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#removeAllListeners
 * @since 3.0.0
 * 
 * @generic {keyof Phaser.Types.Core.GameEventsMap} K - [event]
 *
 * @param {(string|symbol)} [event] - The event name.
 *
 * @return {this} `this`.
 */

/**
 * Remove all listeners, or those of the specified event.
 *
 * @method Phaser.Types.Core.GameEventsEmitter#removeAllListeners
 * @since 3.0.0
 *
 * @param {(string|symbol)} [event] - The event name.
 *
 * @return {this} `this`.
 */
