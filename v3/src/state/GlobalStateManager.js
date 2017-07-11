var Components = require('./components/');
var Class = require('../utils/Class');

var GlobalStateManager = new Class({

    initialize:

    function GlobalStateManager (game, stateConfig)
    {
        this.game = game;

        //  Everything kept in here
        this.keys = {};
        this.states = [];

        //  Only active states are kept in here. They are moved here when started, and moved out when not.
        //  All states are stored in the states array, regardless of being active or not.
        this.active = [];

        //  A state pending to be added to the State Manager is stored in here until the manager has time to add it.
        this._pending = [];

        //  An array of states waiting to be started once the game has booted
        this._start = [];

        if (stateConfig)
        {
            if (Array.isArray(stateConfig))
            {
                for (var i = 0; i < stateConfig.length; i++)
                {
                    //  The i === 0 part just starts the first State given
                    this._pending.push({
                        index: i,
                        key: 'default',
                        state: stateConfig[i],
                        autoStart: (i === 0),
                        data: {}
                    });
                }
            }
            else
            {
                this._pending.push({
                    index: 0,
                    key: 'default',
                    state: stateConfig,
                    autoStart: true,
                    data: {}
                });
            }
        }
    },

    add: Components.Add,
    boot: Components.Boot,
    bootState: Components.BootState,
    bringToTop: Components.BringToTop,
    create: Components.Create,
    createStateDisplay: Components.CreateStateDisplay,
    createStateFromFunction: Components.CreateStateFromFunction,
    createStateFromInstance: Components.CreateStateFromInstance,
    createStateFromObject: Components.CreateStateFromObject,
    getActiveState: Components.GetActiveState,
    getActiveStateIndex: Components.GetActiveStateIndex,
    getActiveStateIndexByKey: Components.GetActiveStateIndexByKey,
    getKey: Components.GetKey,
    getState: Components.GetState,
    getStateAt: Components.GetStateAt,
    getStateIndex: Components.GetStateIndex,
    getStateIndexByKey: Components.GetStateIndexByKey,
    isActive: Components.IsActive,
    isSleeping: Components.IsSleeping,
    loadComplete: Components.LoadComplete,
    moveDown: Components.MoveDown,
    moveUp: Components.MoveUp,
    pause: Components.Pause,
    payloadComplete: Components.PayloadComplete,
    resume: Components.Resume,
    sendToBack: Components.SendToBack,
    setupCallbacks: Components.SetupCallbacks,
    sleep: Components.Sleep,
    start: Components.Start,
    stop: Components.Stop,
    swap: Components.Swap,
    swapPosition: Components.SwapPosition,
    wake: Components.Wake

});

module.exports = GlobalStateManager;
