/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Textures.Parsers
 */

module.exports = {

    Canvas: require('./Canvas'),
    Image: require('./Image'),
    JSONArray: require('./JSONArray'),
    JSONHash: require('./JSONHash'),
    Pyxel: require('./Pyxel'),
    SpriteSheet: require('./SpriteSheet'),
    SpriteSheetFromAtlas: require('./SpriteSheetFromAtlas'),
    StarlingXML: require('./StarlingXML'),
    UnityYAML: require('./UnityYAML')

};
