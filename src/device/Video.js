/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetFastValue = require('../utils/object/GetFastValue');

/**
 * Determines the video support of the browser running this Phaser Game instance.
 *
 * These values are read-only and populated during the boot sequence of the game.
 *
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
 * @property {boolean} m4v - Can this device play m4v (typically mp4) video files?
 * @property {boolean} ogg - Can this device play ogg video files?
 * @property {boolean} vp9 - Can this device play vp9 video files?
 * @property {boolean} webm - Can this device play webm video files?
 * @property {function} getVideoURL - Returns the first video URL that can be played by this browser.
 */
var Video = {

    h264: false,
    hls: false,
    mp4: false,
    m4v: false,
    ogg: false,
    vp9: false,
    webm: false,
    hasRequestVideoFrame: false

};

function init ()
{
    if (typeof importScripts === 'function')
    {
        return Video;
    }

    var videoElement = document.createElement('video');
    var result = !!videoElement.canPlayType;
    var no = /^no$/;

    try
    {
        if (result)
        {
            if (videoElement.canPlayType('video/ogg; codecs="theora"').replace(no, ''))
            {
                Video.ogg = true;
            }

            if (videoElement.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(no, ''))
            {
                // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
                Video.h264 = true;
                Video.mp4 = true;
            }

            if (videoElement.canPlayType('video/x-m4v').replace(no, ''))
            {
                Video.m4v = true;
            }

            if (videoElement.canPlayType('video/webm; codecs="vp8, vorbis"').replace(no, ''))
            {
                Video.webm = true;
            }

            if (videoElement.canPlayType('video/webm; codecs="vp9"').replace(no, ''))
            {
                Video.vp9 = true;
            }

            if (videoElement.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(no, ''))
            {
                Video.hls = true;
            }
        }
    }
    catch (e)
    {
        //  Nothing to do
    }

    if (videoElement.parentNode)
    {
        videoElement.parentNode.removeChild(videoElement);
    }

    Video.getVideoURL = function (urls)
    {
        if (!Array.isArray(urls))
        {
            urls = [ urls ];
        }

        for (var i = 0; i < urls.length; i++)
        {
            var url = GetFastValue(urls[i], 'url', urls[i]);

            if (url.indexOf('blob:') === 0)
            {
                return {
                    url: url,
                    type: ''
                };
            }

            var videoType;

            if (url.indexOf('data:') === 0)
            {
                videoType = url.split(',')[0].match(/\/(.*?);/);
            }
            else
            {
                videoType = url.match(/\.([a-zA-Z0-9]+)($|\?)/);
            }

            videoType = GetFastValue(urls[i], 'type', (videoType) ? videoType[1] : '').toLowerCase();

            if (Video[videoType])
            {
                return {
                    url: url,
                    type: videoType
                };
            }
        }

        return null;
    };

    return Video;
}

module.exports = init();
