/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @classdesc
 * [description]
 *
 * @class FacebookInstantGamesPlugin
 * @memberOf Phaser
 * @constructor
 * @since 3.12.0
 */
var LeaderboardScore = new Class({

    initialize:

    function LeaderboardScore ()
    {
        this.value;
        this.valueFormatted;
        this.timestamp;
        this.rank;
        this.data;
    }

});

module.exports = LeaderboardScore;
