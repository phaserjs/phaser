/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Extend = require('../utils/object/Extend');
var CONST = require('./const');

/**
 * @namespace Phaser.Scale
 * 
 * @borrows Phaser.Scale.Center.NO_CENTER as Phaser.Scale.NO_CENTER
 * @borrows Phaser.Scale.Center.CENTER_BOTH as Phaser.Scale.CENTER_BOTH
 * @borrows Phaser.Scale.Center.CENTER_HORIZONTALLY as Phaser.Scale.CENTER_HORIZONTALLY
 * @borrows Phaser.Scale.Center.CENTER_VERTICALLY as Phaser.Scale.CENTER_VERTICALLY
 * 
 * @borrows Phaser.Scale.Orientation.LANDSCAPE as Phaser.Scale.LANDSCAPE
 * @borrows Phaser.Scale.Orientation.PORTRAIT as Phaser.Scale.PORTRAIT
 * 
 * @borrows Phaser.Scale.ScaleModes.NONE as Phaser.Scale.NONE
 * @borrows Phaser.Scale.ScaleModes.WIDTH_CONTROLS_HEIGHT as Phaser.Scale.WIDTH_CONTROLS_HEIGHT
 * @borrows Phaser.Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH as Phaser.Scale.HEIGHT_CONTROLS_WIDTH
 * @borrows Phaser.Scale.ScaleModes.FIT as Phaser.Scale.FIT
 * @borrows Phaser.Scale.ScaleModes.ENVELOP as Phaser.Scale.ENVELOP
 * @borrows Phaser.Scale.ScaleModes.RESIZE as Phaser.Scale.RESIZE
 * 
 * @borrows Phaser.Scale.Zoom.NO_ZOOM as Phaser.Scale.NO_ZOOM
 * @borrows Phaser.Scale.Zoom.ZOOM_2X as Phaser.Scale.ZOOM_2X
 * @borrows Phaser.Scale.Zoom.ZOOM_4X as Phaser.Scale.ZOOM_4X
 * @borrows Phaser.Scale.Zoom.MAX_ZOOM as Phaser.Scale.MAX_ZOOM
 */

var Scale = {

    Center: require('./const/CENTER_CONST'),
    Events: require('./events'),
    Orientation: require('./const/ORIENTATION_CONST'),
    ScaleManager: require('./ScaleManager'),
    ScaleModes: require('./const/SCALE_MODE_CONST'),
    Zoom: require('./const/ZOOM_CONST')

};

Scale = Extend(false, Scale, CONST.CENTER);
Scale = Extend(false, Scale, CONST.ORIENTATION);
Scale = Extend(false, Scale, CONST.SCALE_MODE);
Scale = Extend(false, Scale, CONST.ZOOM);

module.exports = Scale;
