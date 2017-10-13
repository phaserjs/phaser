var MovePathTo = require('../MoveTo');

var MoveTo = function (x, y)
{
    this.add(new MovePathTo(x, y));
};

module.exports = MoveTo;
