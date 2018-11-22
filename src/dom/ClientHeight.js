/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var ClientHeight = function ()
{
    return Math.max(window.innerHeight, document.documentElement.clientHeight);
};

module.exports = ClientHeight;
