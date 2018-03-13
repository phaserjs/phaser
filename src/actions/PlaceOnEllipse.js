/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Actions.PlaceOnEllipse
 * @since 3.0.0
 * 
 * @param {array} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Ellipse} ellipse - [description]
 * @param {number} [startAngle=0] - [description]
 * @param {number} [endAngle=6.28] - [description]
 *
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var PlaceOnEllipse = function (items, ellipse, startAngle, endAngle)
{
    if (startAngle === undefined) { startAngle = 0; }
    if (endAngle === undefined) { endAngle = 6.28; }

    var angle = startAngle;
    var angleStep = (endAngle - startAngle) / items.length;

    var a = ellipse.width / 2;
    var b = ellipse.height / 2;

    for (var i = 0; i < items.length; i++)
    {
        items[i].x = ellipse.x + a * Math.cos(angle);
        items[i].y = ellipse.y + b * Math.sin(angle);

        angle += angleStep;
    }

    return items;
};

module.exports = PlaceOnEllipse;
