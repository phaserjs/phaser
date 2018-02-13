/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('../const');

/**
 * Called automatically by Phaser.Game and responsible for creating the console.log debug header.
 *
 * You can customize or disable the header via the Game Config object.
 *
 * @function Phaser.Boot.DebugHeader
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Phaser.Game instance which will output this debug header.
 */
var DebugHeader = function (game)
{
    var config = game.config;

    if (config.hideBanner)
    {
        return;
    }

    var renderType = (config.renderType === CONST.CANVAS) ? 'Canvas' : 'WebGL';

    var audioConfig = config.audio;
    var deviceAudio = game.device.audio;

    var audioType;

    if (deviceAudio.webAudio && !(audioConfig && audioConfig.disableWebAudio))
    {
        audioType = 'Web Audio';
    }
    else if ((audioConfig && audioConfig.noAudio) || (!deviceAudio.webAudio && !deviceAudio.audioData))
    {
        audioType = 'No Audio';
    }
    else
    {
        audioType = 'HTML5 Audio';
    }

    if (!game.device.browser.ie)
    {
        var c = '';
        var args = [ c ];

        if (Array.isArray(config.bannerBackgroundColor))
        {
            var lastColor;

            config.bannerBackgroundColor.forEach(function (color)
            {
                c = c.concat('%c ');

                args.push('background: ' + color);

                lastColor = color;

            });

            //  inject the text color
            args[args.length - 1] = 'color: ' + config.bannerTextColor + '; background: ' + lastColor;
        }
        else
        {
            c = c.concat('%c ');

            args.push('color: ' + config.bannerTextColor + '; background: ' + config.bannerBackgroundColor);
        }

        //  URL link background color (always white)
        args.push('background: #fff');

        if (config.gameTitle)
        {
            c = c.concat(config.gameTitle);

            if (config.gameVersion)
            {
                c = c.concat(' v' + config.gameVersion);
            }

            if (!config.hidePhaser)
            {
                c = c.concat(' / ');
            }
        }

        if (!config.hidePhaser)
        {
            c = c.concat('Phaser v' + CONST.VERSION + ' (' + renderType + ' | ' + audioType + ')');
        }

        c = c.concat(' %c ' + config.gameURL);

        //  Inject the new string back into the args array
        args[0] = c;

        console.log.apply(console, args);
    }
    else if (window['console'])
    {
        console.log('Phaser v' + CONST.VERSION + ' / https://phaser.io');
    }
};

module.exports = DebugHeader;
