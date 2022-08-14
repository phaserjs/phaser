/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ImageCollection = require('../../ImageCollection');

var ParseImageCollection = function (set)
{
    var collection = new ImageCollection(set.name, set.firstgid, set.tilewidth, set.tileheight, set.margin, set.spacing, set.properties);

    var t, tile;
    var maxId = 0;

    for (t = 0; t < set.tiles.length; t++)
    {
        tile = set.tiles[t];

        var image = tile.image;
        var tileId = parseInt(tile.id, 10);
        var gid = set.firstgid + tileId;
        collection.addImage(gid, image);

        maxId = Math.max(tileId, maxId);
    }

    collection.maxId = maxId;
    return collection;

};

module.exports = ParseImageCollection;
