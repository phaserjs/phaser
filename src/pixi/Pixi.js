/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * @module PIXI
 */
var PIXI = PIXI || {};

PIXI.WEBGL_RENDERER = 0;
PIXI.CANVAS_RENDERER = 1;

// useful for testing against if your lib is using pixi.
PIXI.VERSION = "v1.4.4";

// the various blend modes supported by pixi
PIXI.blendModes = {
    NORMAL:0,
    ADD:1,
    MULTIPLY:2,
    SCREEN:3,
    OVERLAY:4,
    DARKEN:5,
    LIGHTEN:6,
    COLOR_DODGE:7,
    COLOR_BURN:8,
    HARD_LIGHT:9,
    SOFT_LIGHT:10,
    DIFFERENCE:11,
    EXCLUSION:12,
    HUE:13,
    SATURATION:14,
    COLOR:15,
    LUMINOSITY:16
};

// the scale modes
PIXI.scaleModes = {
    DEFAULT:0,
    LINEAR:0,
    NEAREST:1
};

//  Canvas specific controls
PIXI.canvas = {

    //  If the Stage is transparent Pixi will use a canvas sized fillRect operation every frame to set the canvas background color.
    //  Setting this to false forces Pixi to update the view.style.backgroundColor instead.
    FILL_RECT: true,

    //  If the Stage is transparent Pixi will use clearRect to clear the canvas unless you set this to false.
    //  You often don't need clearRect if you've got a large background image fully covering your canvas.
    CLEAR_RECT: true,

    //  If true Pixi will round all x/y values for rendering only, stopping pixel interpolation. Handy for crisp pixel art.
    PX_ROUND: false
}

// interaction frequency 
PIXI.INTERACTION_FREQUENCY = 30;
PIXI.AUTO_PREVENT_DEFAULT = true;