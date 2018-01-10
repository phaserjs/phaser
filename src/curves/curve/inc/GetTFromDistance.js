//  Given a distance in pixels, get a t to find p.
/**
 * [description]
 *
 * @method Phaser.Curves.Curve#getTFromDistance
 * @since 3.0.0
 *
 * @param {integer} distance - [description]
 * @param {integer} [divisions] - [description]
 *
 * @return {float} [description]
 */
var GetTFromDistance = function (distance, divisions)
{
    if (distance <= 0)
    {
        return 0;
    }

    return this.getUtoTmapping(0, distance, divisions);
};

module.exports = GetTFromDistance;
