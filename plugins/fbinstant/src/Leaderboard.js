/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../src/utils/Class');
var EventEmitter = require('eventemitter3');
var LeaderboardScore = require('./LeaderboardScore');

/**
 * @classdesc
 * This class represents one single Leaderboard that belongs to a Facebook Instant Game.
 * 
 * You do not need to instantiate this class directly, it will be created when you use the
 * `getLeaderboard()` method of the main plugin.
 *
 * @class Leaderboard
 * @memberOf Phaser.FacebookInstantGamesPlugin
 * @constructor
 * @since 3.13.0
 * 
 * @param {Phaser.FacebookInstantGamesPlugin} plugin - A reference to the Facebook Instant Games Plugin.
 * @param {any} data - An Instant Game leaderboard instance.
 */
var Leaderboard = new Class({

    Extends: EventEmitter,

    initialize:

    function Leaderboard (plugin, data)
    {
        EventEmitter.call(this);

        /**
         * A reference to the Facebook Instant Games Plugin.
         *
         * @name Phaser.FacebookInstantGamesPlugin.Leaderboard#plugin
         * @type {Phaser.FacebookInstantGamesPlugin}
         * @since 3.13.0
         */
        this.plugin = plugin;

        /**
         * An Instant Game leaderboard instance.
         *
         * @name Phaser.FacebookInstantGamesPlugin.Leaderboard#ref
         * @type {any}
         * @since 3.13.0
         */
        this.ref = data;

        /**
         * The name of the leaderboard.
         *
         * @name Phaser.FacebookInstantGamesPlugin.Leaderboard#name
         * @type {string}
         * @since 3.13.0
         */
        this.name = data.getName();

        /**
         * The ID of the context that the leaderboard is associated with, or null if the leaderboard is not tied to a particular context.
         *
         * @name Phaser.FacebookInstantGamesPlugin.Leaderboard#contextID
         * @type {string}
         * @since 3.13.0
         */
        this.contextID = data.getContextID();

        /**
         * The total number of player entries in the leaderboard.
         * This value defaults to zero. Populate it via the `getEntryCount()` method.
         *
         * @name Phaser.FacebookInstantGamesPlugin.Leaderboard#entryCount
         * @type {integer}
         * @since 3.13.0
         */
        this.entryCount = 0;

        /**
         * The players score object.
         * This value defaults to `null`. Populate it via the `getPlayerScore()` method.
         *
         * @name Phaser.FacebookInstantGamesPlugin.Leaderboard#playerScore
         * @type {LeaderboardScore}
         * @since 3.13.0
         */
        this.playerScore = null;

        /**
         * The scores in the Leaderboard from the currently requested range.
         * This value defaults to an empty array. Populate it via the `getScores()` method.
         * The contents of this array are reset each time `getScores()` is called.
         *
         * @name Phaser.FacebookInstantGamesPlugin.Leaderboard#scores
         * @type {LeaderboardScore[]}
         * @since 3.13.0
         */
        this.scores = [];

        this.getEntryCount();
    },

    /**
     * Fetches the total number of player entries in the leaderboard.
     * 
     * The data is requested in an async call, so the result isn't available immediately.
     * 
     * When the call completes this Leaderboard will emit the `getentrycount` event along with the count and name of the Leaderboard.
     *
     * @method Phaser.FacebookInstantGamesPlugin.Leaderboard#getEntryCount
     * @since 3.13.0
     * 
     * @return {this} This Leaderboard instance.
     */
    getEntryCount: function ()
    {
        var _this = this;

        this.ref.getEntryCountAsync().then(function (count)
        {
            _this.entryCount = count;

            _this.emit('getentrycount', count, _this.name);

        }).catch(function (e)
        {
            console.warn(e);
        });

        return this;
    },

    /**
     * Updates the player's score. If the player has an existing score, the old score will only be replaced if the new score is better than it.
     * NOTE: If the leaderboard is associated with a specific context, the game must be in that context to set a score for the player.
     * 
     * The data is requested in an async call, so the result isn't available immediately.
     * 
     * When the call completes this Leaderboard will emit the `setscore` event along with the LeaderboardScore object and the name of the Leaderboard.
     * 
     * If the save fails the event will send `null` as the score value.
     *
     * @method Phaser.FacebookInstantGamesPlugin.Leaderboard#setScore
     * @since 3.13.0
     * 
     * @param {integer} score - The new score for the player. Must be a 64-bit integer number.
     * @param {(string|any)} [data] - Metadata to associate with the stored score. Must be less than 2KB in size. If an object is given it will be passed to `JSON.stringify`.
     * 
     * @return {this} This Leaderboard instance.
     */
    setScore: function (score, data)
    {
        if (data === undefined) { data = ''; }

        if (typeof data === 'object')
        {
            data = JSON.stringify(data);
        }

        var _this = this;

        this.ref.setScoreAsync(score, data).then(function (entry)
        {
            if (entry)
            {
                var score = LeaderboardScore(entry);

                _this.playerScore = score;
    
                _this.emit('setscore', score, _this.name);
            }
            else
            {
                _this.emit('setscore', null, _this.name);
            }

        }).catch(function (e)
        {
            console.warn(e);
        });

        return this;
    },

    /**
     * Gets the players leaderboard entry and stores it in the `playerScore` property.
     * 
     * The data is requested in an async call, so the result isn't available immediately.
     * 
     * When the call completes this Leaderboard will emit the `getplayerscore` event along with the score and the name of the Leaderboard.
     * 
     * If the player has not yet saved a score, the event will send `null` as the score value, and `playerScore` will be set to `null` as well.
     *
     * @method Phaser.FacebookInstantGamesPlugin.Leaderboard#getPlayerScore
     * @since 3.13.0
     * 
     * @return {this} This Leaderboard instance.
     */
    getPlayerScore: function ()
    {
        var _this = this;

        this.ref.getPlayerEntryAsync().then(function (entry)
        {
            if (entry)
            {
                var score = LeaderboardScore(entry);

                _this.playerScore = score;
    
                _this.emit('getplayerscore', score, _this.name);
            }
            else
            {
                _this.emit('getplayerscore', null, _this.name);
            }

        }).catch(function (e)
        {
            console.warn(e);
        });

        return this;
    },

    /**
     * Retrieves a set of leaderboard entries, ordered by score ranking in the leaderboard.
     * 
     * The data is requested in an async call, so the result isn't available immediately.
     * 
     * When the call completes this Leaderboard will emit the `getscores` event along with an array of LeaderboardScore entries and the name of the Leaderboard.
     *
     * @method Phaser.FacebookInstantGamesPlugin.Leaderboard#getScores
     * @since 3.13.0
     * 
     * @param {integer} [count=10] - The number of entries to attempt to fetch from the leaderboard. Currently, up to a maximum of 100 entries may be fetched per query.
     * @param {integer} [offset=0] - The offset from the top of the leaderboard that entries will be fetched from.
     * 
     * @return {this} This Leaderboard instance.
     */
    getScores: function (count, offset)
    {
        if (count === undefined) { count = 10; }
        if (offset === undefined) { offset = 0; }

        var _this = this;

        this.ref.getEntriesAsync(count, offset).then(function (entries)
        {
            _this.scores = [];

            entries.forEach(function (entry)
            {
                _this.scores.push(LeaderboardScore(entry));
            });

            _this.emit('getscores', _this.scores, _this.name);

        }).catch(function (e)
        {
            console.warn(e);
        });

        return this;
    },

    /**
     * Retrieves a set of leaderboard entries, based on the current player's connected players (including the current player), ordered by local rank within the set of connected players.
     * 
     * The data is requested in an async call, so the result isn't available immediately.
     * 
     * When the call completes this Leaderboard will emit the `getconnectedscores` event along with an array of LeaderboardScore entries and the name of the Leaderboard.
     *
     * @method Phaser.FacebookInstantGamesPlugin.Leaderboard#getConnectedScores
     * @since 3.16.0
     * 
     * @param {integer} [count=10] - The number of entries to attempt to fetch from the leaderboard. Currently, up to a maximum of 100 entries may be fetched per query.
     * @param {integer} [offset=0] - The offset from the top of the leaderboard that entries will be fetched from.
     * 
     * @return {this} This Leaderboard instance.
     */
    getConnectedScores: function (count, offset)
    {
        if (count === undefined) { count = 10; }
        if (offset === undefined) { offset = 0; }

        var _this = this;

        this.ref.getConnectedPlayerEntriesAsync().then(function (entries)
        {
            _this.scores = [];

            entries.forEach(function (entry)
            {
                _this.scores.push(LeaderboardScore(entry));
            });

            _this.emit('getconnectedscores', _this.scores, _this.name);

        }).catch(function (e)
        {
            console.warn(e);
        });

        return this;
    }

});

module.exports = Leaderboard;
