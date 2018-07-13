/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Rectangle: any;
/**
 * Returns the bounds of the Circle object.
 *
 * @function Phaser.Geom.Circle.GetBounds
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {Phaser.Geom.Circle} circle - The Circle to get the bounds from.
 * @param {(Phaser.Geom.Rectangle|object)} [out] - A Rectangle, or rectangle-like object, to store the circle bounds in. If not given a new Rectangle will be created.
 *
 * @return {(Phaser.Geom.Rectangle|object)} The Rectangle object containing the Circles bounds.
 */
declare var GetBounds: {
    getCenter: (output: any) => any;
    getTopLeft: (output: any, includeParent: any) => any;
    getTopRight: (output: any, includeParent: any) => any;
    getBottomLeft: (output: any, includeParent: any) => any;
    getBottomRight: (output: any, includeParent: any) => any;
    getBounds: (output: any) => any;
};
