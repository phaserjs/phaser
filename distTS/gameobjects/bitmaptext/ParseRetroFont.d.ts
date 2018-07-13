/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var GetValue: any;
/**
 * Parses a Retro Font configuration object so you can pass it to the BitmapText constructor
 * and create a BitmapText object using a fixed-width retro font.
 *
 * @function Phaser.GameObjects.RetroFont.Parse
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - A reference to the Phaser Scene.
 * @param {Phaser.GameObjects.RetroFont.Config} config - The font configuration object.
 *
 * @return {object} A parsed Bitmap Font data entry for the Bitmap Font cache.
 */
declare var ParseRetroFont: (scene: any, config: any) => {
    data: {
        retroFont: boolean;
        font: any;
        size: any;
        lineHeight: any;
        chars: {};
    };
    frame: any;
    texture: any;
};
