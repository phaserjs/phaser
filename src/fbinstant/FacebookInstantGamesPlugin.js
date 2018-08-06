/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var DataManager = require('../data/DataManager');
var EventEmitter = require('eventemitter3');
var GetValue = require('../utils/object/GetValue');
var LeaderboardScore = require('./LeaderboardScore');

/**
 * @classdesc
 * [description]
 *
 * @class FacebookInstantGamesPlugin
 * @memberOf Phaser
 * @constructor
 * @extends Phaser.Events.EventEmitter
 * @since 3.12.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser.Game instance.
 * @param {FBConfig} config
 */
var FacebookInstantGamesPlugin = new Class({

    Extends: EventEmitter,

    initialize:

    function FacebookInstantGamesPlugin (game, config)
    {
        EventEmitter.call(this);

        /**
         * A reference to the Phaser.Game instance.
         *
         * @name Phaser.Boot.FacebookInstantGamesPlugin#game
         * @type {Phaser.Game}
         * @readOnly
         * @since 3.12.0
         */
        this.game = game;

        this.data = new DataManager(this);

        this.on('setdata', this.setDataHandler, this);
        this.on('changedata', this.changeDataHandler, this);

        this.hasLoaded = false;
        this.dataLocked = false;

        this.apis = [];
        this.entryPoint = '';
        this.entryPointData = null;
        this.contextID = 0;
        this.contextType = '';
        this.locale = '';
        this.platform = '';
        this.version = '';

        this.playerID = '';
        this.playerName = '';
        this.playerPhotoURL = '';
    },

    setDataHandler: function (parent, key, value)
    {
        if (this.dataLocked)
        {
            return;
        }

        console.log('set data:', key, value);

        var data = {};
        data[key] = value;

        var _this = this;

        FBInstant.player.setDataAsync(data).then(function() {
            console.log('sdh saved', data);
            _this.emit('savedata', data);
        });
    },

    changeDataHandler: function (parent, key, value)
    {
        if (this.dataLocked)
        {
            return;
        }

        console.log('change data:', key, value);

        var data = {};
        data[key] = value;

        var _this = this;

        FBInstant.player.setDataAsync(data).then(function() {
            console.log('cdh saved', data);
            _this.emit('savedata', data);
        });
    },

    showLoadProgress: function (scene)
    {
        scene.load.on('progress', function (value) {

            if (!this.hasLoaded)
            {
                console.log(value);
                FBInstant.setLoadingProgress(value * 100);
            }

        }, this);

        scene.load.on('complete', function () {

            this.hasLoaded = true;

            console.log('loaded');

            FBInstant.startGameAsync().then(this.gameStarted.bind(this));
            
        }, this);

        return this;
    },

    gameStarted: function ()
    {
        console.log('FBP gameStarted');
        
        this.apis = FBInstant.getSupportedAPIs();

        this.contextID = FBInstant.context.getID();
        this.contextType = FBInstant.context.getType();
        this.locale = FBInstant.getLocale();
        this.platform = FBInstant.getPlatform();
        this.version = FBInstant.getSDKVersion();

        this.playerID = FBInstant.player.getID();
        this.playerName = FBInstant.player.getName();
        this.playerPhotoURL = FBInstant.player.getPhoto();

        var _this = this;

        FBInstant.onPause(function() {
            _this.emit('pause');
        });

        FBInstant.getEntryPointAsync().then(function (entrypoint) {

            _this.entryPoint = entrypoint;
            _this.entryPointData = FBInstant.getEntryPointData();
            _this.emit('startgame');

        });

        // this.emit('startgame');
    },

    loadPlayerPhoto: function (scene, key)
    {
        console.log('load');

        scene.load.setCORS('anonymous');

        scene.load.image(key, this.playerPhotoURL);

        scene.load.on('complete', function () {

            this.emit('photocomplete', key);

        }, this);

        scene.load.start();

        return this;
    },

    getData: function (keys)
    {
        if (!Array.isArray(keys))
        {
            keys = [ keys ];
        }

        console.log('getdata', keys);

        var _this = this;

        FBInstant.player.getDataAsync(keys).then(function(data) {

            console.log('getdata req', data);

            _this.dataLocked = true;

            for (var key in data)
            {
                _this.data.set(key, data[key]);
            }

            _this.dataLocked = false;

            _this.emit('getdata', data);

        });

        return this;
    },

    saveData: function (data)
    {
        var _this = this;

        FBInstant.player.setDataAsync(data).then(function() {
            console.log('data saved to fb');
            _this.emit('savedata', data);
        });

        return this;
    },

    flushData: function ()
    {
        var _this = this;

        FBInstant.player.flushDataAsync().then(function() {
            console.log('data flushed');
            _this.emit('flushdata');
        });

        return this;
    },

    getStats: function (keys)
    {
        var _this = this;

        FBInstant.player.getStatsAsync(keys).then(function(data) {
            console.log('stats got from fb');
            _this.emit('getstats', data);
        });

        return this;
    },

    saveStats: function (data)
    {
        var output = {};

        for (var key in data)
        {
            if (typeof data[key] === 'number')
            {
                output[key] = data[key];
            }
        }

        var _this = this;

        FBInstant.player.setStatsAsync(output).then(function() {
            console.log('stats saved to fb');
            _this.emit('savestats', output);
        });

        return this;
    },

    incStats: function (data)
    {
        var output = {};

        for (var key in data)
        {
            if (typeof data[key] === 'number')
            {
                output[key] = data[key];
            }
        }

        var _this = this;

        FBInstant.player.incrementStatsAsync(output).then(function(stats) {
            console.log('stats modified');
            _this.emit('incstats', stats);
        });

        return this;
    },

    saveSession: function (data)
    {
        var test = JSON.stringify(data);

        if (test.length <= 1000)
        {
            FBInstant.setSessionData(data);
        }
        else
        {
            console.warn('Session data too long. Max 1000 chars.');
        }

        return this;
    },

    openShare: function (text, key, frame, sessionData)
    {
        return this._share('SHARE', text, key, frame, sessionData);
    },

    openInvite: function (text, key, frame, sessionData)
    {
        return this._share('INVITE', text, key, frame, sessionData);
    },

    openRequest: function (text, key, frame, sessionData)
    {
        return this._share('REQUEST', text, key, frame, sessionData);
    },

    openChallenge: function (text, key, frame, sessionData)
    {
        return this._share('CHALLENGE', text, key, frame, sessionData);
    },

    createShortcut: function ()
    {
        var _this = this;

        FBInstant.canCreateShortcutAsync().then(function(canCreateShortcut) {

            if (canCreateShortcut)
            {
                FBInstant.createShortcutAsync().then(function() {
                    _this.emit('shortcutcreated');
                }).catch(function() {
                    _this.emit('shortcutfailed');
                });
            }

        });
    },

    _share: function (intent, text, key, frame, sessionData)
    {
        if (sessionData === undefined) { sessionData = {}; }

        if (key)
        {
            var imageData = this.game.textures.getBase64(key, frame);
        }

        var payload = {
            intent: intent,
            image: imageData,
            text: text,
            data: sessionData
        };

        // console.log(payload);

        // intent ("INVITE" | "REQUEST" | "CHALLENGE" | "SHARE") Indicates the intent of the share.
        // image string A base64 encoded image to be shared.
        // text string A text message to be shared.
        // data Object? A blob of data to attach to the share. All game sessions launched from the share will be able to access this blob through FBInstant.getEntryPointData().

        var _this = this;

        FBInstant.shareAsync(payload).then(function() {
            _this.emit('resume');
        });

        return this;
    },

    log: function (name, value, params)
    {
        if (params === undefined) { params = {}; }

        if (name.length >= 2 && name.length <= 40)
        {
            FBInstant.logEvent(name, parseFloat(value), params);
        }

        return this;
    },

    getPlayers: function ()
    {
        var _this = this;

        FBInstant.player.getConnectedPlayersAsync().then(function(players) {
            console.log('got player data');
            console.log(players);
            _this.emit('players', players);

            // id: player.getID(),
            // name: player.getName(),
        });

        return this;
    },

    /**
     * Destroys the FacebookInstantGamesPlugin.
     *
     * @method Phaser.Boot.FacebookInstantGamesPlugin#destroy
     * @since 3.12.0
     */
    destroy: function ()
    {
        FBInstant.quit();

        this.game = null;
    }

});

module.exports = FacebookInstantGamesPlugin;
