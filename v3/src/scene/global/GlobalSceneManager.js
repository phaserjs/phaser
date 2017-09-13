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

    add: require('./inc/Add'),
    boot: require('./inc/Boot'),
    bootScene: require('./inc/BootScene'),
    bringToTop: require('./inc/BringToTop'),
    create: require('./inc/Create'),
    createSceneDisplay: require('./inc/CreateSceneDisplay'),
    createSceneFromFunction: require('./inc/CreateSceneFromFunction'),
    createSceneFromInstance: require('./inc/CreateSceneFromInstance'),
    createSceneFromObject: require('./inc/CreateSceneFromObject'),
    getActiveScene: require('./inc/GetActiveScene'),
    getActiveSceneIndex: require('./inc/GetActiveSceneIndex'),
    getActiveSceneIndexByKey: require('./inc/GetActiveSceneIndexByKey'),
    getKey: require('./inc/GetKey'),
    getScene: require('./inc/GetScene'),
    getSceneAt: require('./inc/GetSceneAt'),
    getSceneIndex: require('./inc/GetSceneIndex'),
    getSceneIndexByKey: require('./inc/GetSceneIndexByKey'),
    isActive: require('./inc/IsActive'),
    isSleeping: require('./inc/IsSleeping'),
    loadComplete: require('./inc/LoadComplete'),
    moveDown: require('./inc/MoveDown'),
    moveUp: require('./inc/MoveUp'),
    pause: require('./inc/Pause'),
    payloadComplete: require('./inc/PayloadComplete'),
    resume: require('./inc/Resume'),
    sendToBack: require('./inc/SendToBack'),
    setupCallbacks: require('./inc/SetupCallbacks'),
    sleep: require('./inc/Sleep'),
    start: require('./inc/Start'),
    stop: require('./inc/Stop'),
    swap: require('./inc/Swap'),
    swapPosition: require('./inc/SwapPosition'),
    wake: require('./inc/Wake')

});

module.exports = GlobalSceneManager;
