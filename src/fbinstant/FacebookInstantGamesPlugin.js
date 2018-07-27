/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var DataManager = require('../data/DataManager');
var EventEmitter = require('eventemitter3');
var GetValue = require('../utils/object/GetValue');

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

        scene.load.start();

        return this;
    },

    gameStarted: function ()
    {
        console.log('gameStarted');

        this.playerID = FBInstant.player.getID();
        this.playerName = FBInstant.player.getName();
        this.playerPhotoURL = FBInstant.player.getPhoto();

        this.emit('startgame');
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
        FBInstant.player.setDataAsync(data).then(function() {
            console.log('data saved to fb');
            this.emit('savedata', data);
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
        this.game = null;
    }

});

module.exports = FacebookInstantGamesPlugin;
