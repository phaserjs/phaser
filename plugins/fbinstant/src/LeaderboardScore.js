/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var LeaderboardScore = function (entry)
{
    return {
        score: entry.getScore(),
        scoreFormatted: entry.getFormattedScore(),
        timestamp: entry.getTimestamp(),
        rank: entry.getRank(),
        data: entry.getExtraData(),
        playerName: entry.getPlayer().getName(),
        playerPhotoURL: entry.getPlayer().getPhoto(),
        playerID: entry.getPlayer().getID()
    };
};

module.exports = LeaderboardScore;
