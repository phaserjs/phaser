/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObject.Video.FACTORY_KEY = 'video';

/**
* Create a Video object.
*
* This will return a Phaser.Video object which you can pass to a Sprite to be used as a texture.
*
* @method Phaser.GameObject.Factory#video
* @param {string|null} [key=null] - The key of the video file in the Phaser.Cache that this Video object will play. Set to `null` or leave undefined if you wish to use a webcam as the source. See `startMediaStream` to start webcam capture.
* @param {string|null} [url=null] - If the video hasn't been loaded then you can provide a full URL to the file here (make sure to set key to null)
* @return {Phaser.Video} The newly created Video object.
*/
Phaser.GameObject.Video.FACTORY_ADD = function (key, url)
{
    return new Phaser.GameObject.Video(this.game, key, url);
};

/**
* Create a Video object.
*
* This will return a Phaser.Video object which you can pass to a Sprite to be used as a texture.
*
* @method Phaser.GameObject.Factory#video
* @param {string|null} [key=null] - The key of the video file in the Phaser.Cache that this Video object will play. Set to `null` or leave undefined if you wish to use a webcam as the source. See `startMediaStream` to start webcam capture.
* @param {string|null} [url=null] - If the video hasn't been loaded then you can provide a full URL to the file here (make sure to set key to null)
* @return {Phaser.Video} The newly created Video object.
*/
Phaser.GameObject.Video.FACTORY_MAKE = function (key, url)
{
    return new Phaser.GameObject.Video(this.game, key, url);
};
