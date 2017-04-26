var CONST = require('./const');
var ScaleModes = require('../renderer/ScaleModes');
var GetValue = require('../utils/object/GetValue');

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

            key: GetValue(config, 'key', ''),
            active: GetValue(config, 'active', false),
            visible: GetValue(config, 'visible', true),

            //  Loader payload array

            data: {},

            files: GetValue(config, 'files', false),

            //  -1 means the State Manager will set it to be the Game dimensions

            x: GetValue(config, 'x', 0),
            y: GetValue(config, 'y', 0),
            rotation: GetValue(config, 'rotation', 0),
            width: GetValue(config, 'width', -1),
            height: GetValue(config, 'height', -1),

            //  State Render Settings (applies only to this State)

            scaleMode: GetValue(config, 'scaleMode', ScaleModes.DEFAULT),
            roundPixels: GetValue(config, 'roundPixels', false),

            dirtyRender: GetValue(config, 'dirtyRender', false),
            renderToTexture: GetValue(config, 'renderToTexture', false),

            //  The following only apply if renderToTexture is true

            autoResize: GetValue(config, 'autoResize', false),
            transparent: GetValue(config, 'transparent', false),
            clearBeforeRender: GetValue(config, 'clearBeforeRender', true),
            backgroundColor: GetValue(config, 'backgroundColor', false)

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
