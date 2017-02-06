var CONST = require('./const');
var ScaleModes = require('../renderer/ScaleModes');
var GetObjectValue = require('../utils/object/GetObjectValue');

var Settings = {

    create: function (config)
    {
        if (typeof config === 'string')
        {
            config = { key: config };
        }
        else if (config === undefined)
        {
            //  Pass the 'hasOwnProperty' checks
            config = {};
        }

        return {

            status: CONST.PENDING,

            op: CONST.BOOT,

            key: GetObjectValue(config, 'key', ''),
            active: GetObjectValue(config, 'active', false),
            visible: GetObjectValue(config, 'visible', true),
            scaleMode: GetObjectValue(config, 'scaleMode', ScaleModes.DEFAULT),

            //  -1 means the State Manager will set it to be the Game dimensions

            x: GetObjectValue(config, 'x', 0),
            y: GetObjectValue(config, 'y', 0),
            width: GetObjectValue(config, 'width', -1),
            height: GetObjectValue(config, 'height', -1),

            //  Renderer Settings

            clearBeforeRender: GetObjectValue(config, 'clearBeforeRender', true),
            transparent: GetObjectValue(config, 'transparent', false),
            autoResize: GetObjectValue(config, 'autoResize', false),
            roundPixels: GetObjectValue(config, 'roundPixels', false),
            drawToPrimaryCanvas: GetObjectValue(config, 'drawToPrimaryCanvas', false)

        };
    },

    init: function (config, gameConfig)
    {
        if (config.width === -1)
        {
            config.width = gameConfig.width;
        }

        if (config.height === -1)
        {
            config.height = gameConfig.height;
        }
    }

};

module.exports = Settings;
