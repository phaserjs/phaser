//  Phaser.GameObjects

var GameObjects = {

    Components: require('./components'),

    BitmapText: require('./bitmaptext/static/BitmapText'),
    Blitter: require('./blitter/Blitter'),
    DynamicBitmapText: require('./bitmaptext/dynamic/DynamicBitmapText'),
    Graphics: require('./graphics/Graphics.js'),
    Group: require('./group/Group'),
    Image: require('./image/Image'),
    ObjectPool: require('./pool/ObjectPool.js'),
    Sprite: require('./sprite/Sprite'),
    StaticTilemap: require('./tilemap/static/StaticTilemap'),
    Text: require('./text/static/Text'),
    Tilemap: require('./tilemap/dynamic/Tilemap'),
    TileSprite: require('./tilesprite/TileSprite'),
    Zone: require('./zone/Zone')

};

if (WEBGL_RENDERER)
{
    GameObjects.EffectLayer = require('./effectlayer/EffectLayer');
    GameObjects.LightLayer = require('./lightlayer/LightLayer');
    GameObjects.Mesh = require('./mesh/Mesh');
    GameObjects.Quad = require('./quad/Quad');
    GameObjects.RenderPass = require('./renderpass/RenderPass.js');
}

module.exports = GameObjects;
