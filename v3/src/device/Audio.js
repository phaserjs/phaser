var Browser = require('./Browser');

var Audio = {

    // @property {boolean} audioData - Are Audio tags available?
    audioData: false,

    // @property {boolean} webAudio - Is the WebAudio API available?
    webAudio: false,

    // @property {boolean} ogg - Can this device play ogg files?
    ogg: false,

    // @property {boolean} opus - Can this device play opus files?
    opus: false,

    // @property {boolean} mp3 - Can this device play mp3 files?
    mp3: false,

    // @property {boolean} wav - Can this device play wav files?
    wav: false,

    // Can this device play m4a files?
    // @property {boolean} m4a - True if this device can play m4a files.
    m4a: false,

    // @property {boolean} webm - Can this device play webm files?
    webm: false,

    // @property {boolean} dolby - Can this device play EC-3 Dolby Digital Plus files?
    dolby: false

};

function init ()
{
    Audio.audioData = !!(window['Audio']);

    // TODO check if AudioContext is actually implemented
    // sometimes browsers have a stub object for AudioContext
    // which will falsely report Web Audio as available
    Audio.webAudio = !!(window['AudioContext'] || window['webkitAudioContext']);

    var audioElement = document.createElement('audio');

    var result = !!audioElement.canPlayType;

    try
    {
        if (result)
        {
            if (audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''))
            {
                Audio.ogg = true;
            }

            if (audioElement.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, '') || audioElement.canPlayType('audio/opus;').replace(/^no$/, ''))
            {
                Audio.opus = true;
            }

            if (audioElement.canPlayType('audio/mpeg;').replace(/^no$/, ''))
            {
                Audio.mp3 = true;
            }

            //  Mimetypes accepted:
            //  developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
            //  bit.ly/iphoneoscodecs
            if (audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''))
            {
                Audio.wav = true;
            }

            if (audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;').replace(/^no$/, ''))
            {
                Audio.m4a = true;
            }

            if (audioElement.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''))
            {
                Audio.webm = true;
            }

            if (audioElement.canPlayType('audio/mp4;codecs="ec-3"') !== '')
            {
                if (Browser.edge)
                {
                    Audio.dolby = true;
                }
                else if (Browser.safari && Browser.safariVersion >= 9)
                {
                    if ((/Mac OS X (\d+)_(\d+)/).test(navigator.userAgent))
                    {
                        var major = parseInt(RegExp.$1, 10);
                        var minor = parseInt(RegExp.$2, 10);

                        if ((major === 10 && minor >= 11) || major > 10)
                        {
                            Audio.dolby = true;
                        }
                    }
                }
            }
        }
    }
    catch (e)
    {
        //  Nothing to do here
    }

    return Audio;
}

module.exports = init();
