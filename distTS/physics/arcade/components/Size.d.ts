/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * [description]
 *
 * @name Phaser.Physics.Arcade.Components.Size
 * @since 3.0.0
 */
declare var Size: {
    _sizeComponent: boolean;
    width: number;
    height: number;
    displayWidth: {
        get: () => number;
        set: (value: any) => void;
    };
    displayHeight: {
        get: () => number;
        set: (value: any) => void;
    };
    setSizeToFrame: (frame: any) => any;
    setSize: (width: any, height: any) => any;
    setDisplaySize: (width: any, height: any) => any;
};
