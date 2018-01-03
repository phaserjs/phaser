//  Phaser.Sound

module.exports = {

    SoundManagerCreator: require('./SoundManagerCreator'),

    BaseSound: require('./BaseSound'),
    BaseSoundManager: require('./BaseSoundManager'),

    WebAudioSound: require('./webaudio/WebAudioSound'),
    WebAudioSoundManager: require('./webaudio/WebAudioSoundManager'),

    SoundEvent: require('./SoundEvent')
};
