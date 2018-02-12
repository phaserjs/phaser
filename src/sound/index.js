/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Sound
 */

module.exports = {

    SoundManagerCreator: require('./SoundManagerCreator'),

    BaseSound: require('./BaseSound'),
    BaseSoundManager: require('./BaseSoundManager'),

    WebAudioSound: require('./webaudio/WebAudioSound'),
    WebAudioSoundManager: require('./webaudio/WebAudioSoundManager'),

    HTML5AudioSound: require('./html5/HTML5AudioSound'),
    HTML5AudioSoundManager: require('./html5/HTML5AudioSoundManager'),

    NoAudioSound: require('./noaudio/NoAudioSound'),
    NoAudioSoundManager: require('./noaudio/NoAudioSoundManager')

};
