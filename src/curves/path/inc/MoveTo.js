var MovePathTo = require('../MoveTo');

/**
 * [description]
 *
 * @method Phaser.Curves.Path#moveTo
 * @since 3.0.0
 *
 * @param {number} x - [description]
 * @param {number} y - [description]
 *
 * @return {Phaser.Curves.Path} [description]
 */
var MoveTo = function (x, y)
{
    return this.add(new MovePathTo(x, y));
};

module.exports = MoveTo;
