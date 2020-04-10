/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Determines the video support of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.video` from within any Scene.
 * 
 * In Phaser 3.20 the properties were renamed to drop the 'Video' suffix.
 * 
 * @typedef {object} Phaser.Device.Video
 * @since 3.0.0
 * 
 * @property {boolean} h264 - Can this device play h264 mp4 video files?
 * @property {boolean} hls - Can this device play hls video files?
 * @property {boolean} mp4 - Can this device play h264 mp4 video files?
 * @property {boolean} ogg - Can this device play ogg video files?
 * @property {boolean} vp9 - Can this device play vp9 video files?
 * @property {boolean} webm - Can this device play webm video files?
 */
var Video = {

    h264: false,
    hls: false,
    mp4: false,
    ogg: false,
    vp9: false,
    webm: false

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
                Video.ogg = true;
            }

            if (videoElement.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ''))
            {
                // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
                Video.h264 = true;
                Video.mp4 = true;
            }

            if (videoElement.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, ''))
            {
                Video.webm = true;
            }

            if (videoElement.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, ''))
            {
                Video.vp9 = true;
            }

            if (videoElement.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/, ''))
            {
                Video.hls = true;
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
