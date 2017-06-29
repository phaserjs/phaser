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

            //  Cameras

            cameras: GetValue(config, 'cameras', null),

            //  State Render Settings (applies only to this State)

            scaleMode: GetValue(config, 'scaleMode', ScaleModes.DEFAULT),
            roundPixels: GetValue(config, 'roundPixels', false),

            dirtyRender: GetValue(config, 'dirtyRender', false),
            renderToTexture: GetValue(config, 'renderToTexture', false),

            //  The following only apply if renderToTexture is true

            autoResize: GetValue(config, 'autoResize', false)

        };
    }

};

module.exports = Settings;
