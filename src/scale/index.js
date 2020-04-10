/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Extend = require('../utils/object/Extend');
var CONST = require('./const');

/**
 * @namespace Phaser.Scale
 * 
 * @borrows Phaser.Scale.Center.NO_CENTER as NO_CENTER
 * @borrows Phaser.Scale.Center.CENTER_BOTH as CENTER_BOTH
 * @borrows Phaser.Scale.Center.CENTER_HORIZONTALLY as CENTER_HORIZONTALLY
 * @borrows Phaser.Scale.Center.CENTER_VERTICALLY as CENTER_VERTICALLY
 * 
 * @borrows Phaser.Scale.Orientation.LANDSCAPE as LANDSCAPE
 * @borrows Phaser.Scale.Orientation.PORTRAIT as PORTRAIT
 * 
 * @borrows Phaser.Scale.ScaleModes.NONE as NONE
 * @borrows Phaser.Scale.ScaleModes.WIDTH_CONTROLS_HEIGHT as WIDTH_CONTROLS_HEIGHT
 * @borrows Phaser.Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH as HEIGHT_CONTROLS_WIDTH
 * @borrows Phaser.Scale.ScaleModes.FIT as FIT
 * @borrows Phaser.Scale.ScaleModes.ENVELOP as ENVELOP
 * @borrows Phaser.Scale.ScaleModes.RESIZE as RESIZE
 * 
 * @borrows Phaser.Scale.Zoom.NO_ZOOM as NO_ZOOM
 * @borrows Phaser.Scale.Zoom.ZOOM_2X as ZOOM_2X
 * @borrows Phaser.Scale.Zoom.ZOOM_4X as ZOOM_4X
 * @borrows Phaser.Scale.Zoom.MAX_ZOOM as MAX_ZOOM
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
