/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var HTML5AudioSoundManager = require('./html5/HTML5AudioSoundManager');
var NoAudioSoundManager = require('./noaudio/NoAudioSoundManager');
var WebAudioSoundManager = require('./webaudio/WebAudioSoundManager');

/**
 * Creates a Web Audio, HTML5 Audio or No Audio Sound Manager based on config and device settings.
 *
 * Be aware of https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
 *
 * @namespace Phaser.Sound.SoundManagerCreator
 * @since 3.0.0
 */
var SoundManagerCreator = {

    /**
     * Determines the most appropriate Sound Manager to use based on the game configuration
     * and the audio capabilities of the current device, then creates and returns an instance
     * of it.
     *
     * If the game config has `audio.noAudio` set to `true`, or if the device supports neither
     * Web Audio nor HTML5 Audio, a `NoAudioSoundManager` is returned, which silently stubs all
     * sound calls. If Web Audio is supported and not explicitly disabled via
     * `audio.disableWebAudio`, a `WebAudioSoundManager` is returned. Otherwise, an
     * `HTML5AudioSoundManager` is returned as a fallback.
     *
     * Be aware of https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
     *
     * @method Phaser.Sound.SoundManagerCreator.create
     * @since 3.0.0
     *
     * @param {Phaser.Game} game - Reference to the current game instance.
     *
     * @return {(Phaser.Sound.HTML5AudioSoundManager|Phaser.Sound.WebAudioSoundManager|Phaser.Sound.NoAudioSoundManager)} The Sound Manager instance that was created.
     */
    create: function (game)
    {
        var audioConfig = game.config.audio;
        var deviceAudio = game.device.audio;

        if (audioConfig.noAudio || (!deviceAudio.webAudio && !deviceAudio.audioData))
        {
            return new NoAudioSoundManager(game);
        }

        if (deviceAudio.webAudio && !audioConfig.disableWebAudio)
        {
            return new WebAudioSoundManager(game);
        }

        return new HTML5AudioSoundManager(game);
    }

};

module.exports = SoundManagerCreator;
