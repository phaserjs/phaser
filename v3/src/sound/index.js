//  Phaser.Sound

module.exports = {

    SoundManagerCreator: require('./SoundManagerCreator'),

    BaseSound: require('./BaseSound'),
    BaseSoundManager: require('./BaseSoundManager'),

    WebAudioSound: require('./webaudio/WebAudioSound'),
    WebAudioSoundManager: require('./webaudio/WebAudioSoundManager'),

    HTML5AudioSoundManager: require('./html5/HTML5AudioSoundManager'),

    SoundEvent: require('./SoundEvent'),
    SoundValueEvent: require('./SoundValueEvent')
};
