/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var CanvasInterpolation: any;
declare var CanvasPool: any;
declare var CONST: {
    VERSION: string;
    BlendModes: any;
    ScaleModes: any;
    AUTO: number;
    CANVAS: number;
    WEBGL: number;
    HEADLESS: number;
    FOREVER: number;
    NONE: number;
    UP: number;
    DOWN: number;
    LEFT: number;
    RIGHT: number;
};
declare var Features: any;
/**
 * Called automatically by Phaser.Game and responsible for creating the renderer it will use.
 *
 * Relies upon two webpack global flags to be defined: `WEBGL_RENDERER` and `CANVAS_RENDERER` during build time, but not at run-time.
 *
 * @function Phaser.Boot.CreateRenderer
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Phaser.Game instance on which the renderer will be set.
 */
declare var CreateRenderer: (game: any) => void;
