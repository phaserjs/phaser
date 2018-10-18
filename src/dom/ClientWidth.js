/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var ClientWidth = function ()
{
    return Math.max(window.innerWidth, document.documentElement.clientWidth);
};

module.exports = ClientWidth;
