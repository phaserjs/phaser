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
 * [description]
 *
 * @class FacebookInstantGamesPlugin
 * @memberOf Phaser
 * @constructor
 * @since 3.12.0
 */
var Leaderboard = new Class({

    Extends: EventEmitter,

    initialize:

    function Leaderboard (plugin, data)
    {
        EventEmitter.call(this);

        this.plugin = plugin;
        this.ref = data;

        this.name = data.getName();
        this.contextID = data.getContextID();
        this.entryCount = 0;

        this.playerScore = null;
        this.scores = [];

        this.getEntryCount();
    },

    getEntryCount: function ()
    {
        var _this = this;

        this.ref.getEntryCountAsync().then(function (count)
        {
            console.log('entry count', count);

            _this.entryCount = count;

            _this.emit('getentrycount', count, _this.name);

        }).catch(function (e)
        {
            console.warn(e);
        });
    },

    setScore: function (score, data)
    {
        if (data === undefined) { data = ''; }

        var _this = this;

        this.ref.setScoreAsync(score, data).then(function (entry)
        {
            console.log('set score', entry);

            _this.emit('setscore', entry.getScore(), entry.getExtraData(), _this.name);

        }).catch(function (e)
        {
            console.warn(e);
        });
    },

    getPlayerScore: function ()
    {
        var _this = this;

        this.ref.getPlayerEntryAsync().then(function (entry)
        {
            console.log('get player score');

            var score = LeaderboardScore(entry);

            console.log(score);

            _this.playerScore = score;

            _this.emit('getplayerscore', score, _this.name);

        }).catch(function (e)
        {
            console.warn(e);
        });

    },

    getScores: function (count, offset)
    {
        if (count === undefined) { count = 10; }
        if (offset === undefined) { offset = 0; }

        var _this = this;

        this.ref.getEntriesAsync().then(function (entries)
        {
            console.log('get scores', entries);

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

    }

});

module.exports = Leaderboard;
