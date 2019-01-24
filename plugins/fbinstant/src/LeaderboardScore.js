/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @typedef {object} LeaderboardScore
 *
 * @property {integer} score - An integer score value.
 * @property {string} scoreFormatted - The score value, formatted with the score format associated with the leaderboard.
 * @property {integer} timestamp - The Unix timestamp of when the leaderboard entry was last updated.
 * @property {integer} rank - The entry's leaderboard ranking.
 * @property {string} data - The developer-specified payload associated with the score, or null if one was not set.
 * @property {string} playerName - The player's localized display name.
 * @property {string} playerPhotoURL -  A url to the player's public profile photo.
 * @property {string} playerID - The game's unique identifier for the player.
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
