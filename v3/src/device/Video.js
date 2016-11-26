var OS = require('./OS');
var Browser = require('./Browser');

var Video = {

    /**
    * @property {boolean} oggVideo - Can this device play ogg video files?
    * @default
    */
    oggVideo: false,

    /**
    * @property {boolean} h264Video - Can this device play h264 mp4 video files?
    * @default
    */
    h264Video: false,

    /**
    * @property {boolean} mp4Video - Can this device play h264 mp4 video files?
    * @default
    */
    mp4Video: false,

    /**
    * @property {boolean} webmVideo - Can this device play webm video files?
    * @default
    */
    webmVideo: false,

    /**
    * @property {boolean} vp9Video - Can this device play vp9 video files?
    * @default
    */
    vp9Video: false,

    /**
    * @property {boolean} hlsVideo - Can this device play hls video files?
    * @default
    */
    hlsVideo: false

};

function init ()
{
    var videoElement = document.createElement('video');
    var result = !!videoElement.canPlayType;

    try
    {
        if (result)
        {
            if (videoElement.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ''))
            {
                Video.oggVideo = true;
            }

            if (videoElement.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ''))
            {
                // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
                Video.h264Video = true;
                Video.mp4Video = true;
            }

            if (videoElement.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, ''))
            {
                Video.webmVideo = true;
            }

            if (videoElement.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, ''))
            {
                Video.vp9Video = true;
            }

            if (videoElement.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/, ''))
            {
                Video.hlsVideo = true;
            }
        }
    }
    catch (e)
    {
        //  Nothing to do
    }

    return Video;
}

module.exports = init();
