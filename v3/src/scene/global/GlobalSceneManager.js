var Components = require('./components/');
var Class = require('../../utils/Class');

var GlobalSceneManager = new Class({

    initialize:

    function GlobalSceneManager (game, sceneConfig)
    {
        this.game = game;

        //  Everything kept in here
        this.keys = {};
        this.scenes = [];

        //  Only active scenes are kept in here. They are moved here when started, and moved out when not.
        //  All scenes are stored in the scenes array, regardless of being active or not.
        this.active = [];

        //  A scene pending to be added to the Scene Manager is stored in here until the manager has time to add it.
        this._pending = [];

        //  An array of scenes waiting to be started once the game has booted
        this._start = [];

        if (sceneConfig)
        {
            if (Array.isArray(sceneConfig))
            {
                for (var i = 0; i < sceneConfig.length; i++)
                {
                    //  The i === 0 part just starts the first Scene given
                    this._pending.push({
                        index: i,
                        key: 'default',
                        scene: sceneConfig[i],
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
                    scene: sceneConfig,
                    autoStart: true,
                    data: {}
                });
            }
        }
    },

    add: Components.Add,
    boot: Components.Boot,
    bootScene: Components.BootScene,
    bringToTop: Components.BringToTop,
    create: Components.Create,
    createSceneDisplay: Components.CreateSceneDisplay,
    createSceneFromFunction: Components.CreateSceneFromFunction,
    createSceneFromInstance: Components.CreateSceneFromInstance,
    createSceneFromObject: Components.CreateSceneFromObject,
    getActiveScene: Components.GetActiveScene,
    getActiveSceneIndex: Components.GetActiveSceneIndex,
    getActiveSceneIndexByKey: Components.GetActiveSceneIndexByKey,
    getKey: Components.GetKey,
    getScene: Components.GetScene,
    getSceneAt: Components.GetSceneAt,
    getSceneIndex: Components.GetSceneIndex,
    getSceneIndexByKey: Components.GetSceneIndexByKey,
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

module.exports = GlobalSceneManager;
