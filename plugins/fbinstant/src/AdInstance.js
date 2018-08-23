/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var AdInstance = function (instance, video)
{
    return {
        instance: instance,
        placementID: instance.getPlacementID(),
        shown: false,
        video: video
    };
};

module.exports = AdInstance;
