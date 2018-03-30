/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Cameras.Controls
 */

module.exports = {

    /**
     * This alias will be removed in a future version.
     * Use `FixedKeyControl` instead.
     * 
     * @deprecated
     * @name Phaser.Cameras.Controls.Fixed
     */
    Fixed: require('./FixedKeyControl'),

    FixedKeyControl: require('./FixedKeyControl'),

    /**
     * This alias will be removed in a future version.
     * Use `SmoothedKeyControl` instead.
     * 
     * @deprecated
     * @name Phaser.Cameras.Controls.Smoothed
     */
    Smoothed: require('./SmoothedKeyControl'),

    SmoothedKeyControl: require('./SmoothedKeyControl')

};
