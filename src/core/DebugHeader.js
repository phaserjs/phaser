/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const');

/**
 * Called automatically by Phaser.Game during initialization to output a styled banner to the browser
 * console. The banner displays the Phaser version number, the active renderer (WebGL, Canvas, or
 * Headless), the audio system in use (Web Audio, HTML5 Audio, or No Audio), and optionally the
 * game title, version, and URL as configured. In browsers that support CSS console styling the
 * banner is rendered with the colors defined in the Game Config; in IE it falls back to a plain
 * text log. The banner is skipped entirely when `config.hideBanner` is `true`.
 *
 * You can customize or disable the header via the Game Config object.
 *
 * @function Phaser.Core.DebugHeader
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

    var renderType = 'WebGL';

    if (config.renderType === CONST.CANVAS)
    {
        renderType = 'Canvas';
    }
    else if (config.renderType === CONST.HEADLESS)
    {
        renderType = 'Headless';
    }

    var audioConfig = config.audio;
    var deviceAudio = game.device.audio;

    var audioType;

    if (deviceAudio.webAudio && !audioConfig.disableWebAudio)
    {
        audioType = 'Web Audio';
    }
    else if (audioConfig.noAudio || (!deviceAudio.webAudio && !deviceAudio.audioData))
    {
        audioType = 'No Audio';
    }
    else
    {
        audioType = 'HTML5 Audio';
    }

    if (!game.device.browser.ie)
    {
        var logoDataURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAARBJREFUeNpi/P//P0OHsPB/BiCoePuWkYFEwALSXJElzMBgLwE2CNkQxgWr/yMr/p8QimlBu5DQ//+8vBBco/ofzAe6imH+qv/53/6jYJAYSA4ZoxoANYTPKhiuCQZwGcJU+e4dqpMmvsDq14krV2MPAxDha2CMKvoXoiE/PBQUDgQD8j82UFae9B9bOIC8B9UD9gIjjIMN7Ns6lWHn4XMoYu62RgxO3tkMjIyMII2MYAOAtmFVhA+ADHf2ycGMRhANjUq8YO+WKWCvgAORIV8CkpDCrzIwsLIymC1qAtuAD4Bsh3sBmqAY3qcGwL2AC4DCpKtzHlgzOLWihwEuzTCN0GhDJHeYC4gByBphACDAAH2dDIxdjr+VAAAAAElFTkSuQmCC';

        var mainStyle = 'color: ' + config.bannerTextColor + ';';

        var bannerBackgroundColor = Array.isArray(config.bannerBackgroundColor)
            ? config.bannerBackgroundColor
            : [ config.bannerBackgroundColor ];

        //  linear-gradient requires at least two color stops, so duplicate if there's only one
        if (bannerBackgroundColor.length === 1)
        {
            bannerBackgroundColor = [ bannerBackgroundColor[0], bannerBackgroundColor[0] ];
        }

        var gradient = 'linear-gradient(to bottom, ' + bannerBackgroundColor.join(', ') + ')';

        mainStyle += ' background-image: url("' + logoDataURI + '"), ' + gradient + ';';
        mainStyle += ' background-repeat: no-repeat;';
        mainStyle += ' background-position: 4px center, 0 0;';

        mainStyle += ' padding: 2px 6px 2px 24px;';

        var c = '%c';
        var args = [ null, mainStyle ];

        //  URL link background color (always transparent to support different browser themes)
        args.push('background: transparent');

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

        c = c.concat('%c ' + config.gameURL);

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
