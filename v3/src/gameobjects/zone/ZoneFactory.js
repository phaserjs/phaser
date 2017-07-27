var Zone = require('./Zone');

var ZoneFactory = function (scene, x, y, width, height)
{
    return new Zone(scene, x, y, width, height);
};

module.exports = ZoneFactory;
