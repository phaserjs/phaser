/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Video = require('./Video');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Video Game Object and adds it to the Scene.
 *
 * This Game Object is capable of handling playback of a video file, video stream or media stream.
 *
 * You can optionally 'preload' the video into the Phaser Video Cache:
 *
 * ```javascript
 * preload () {
 *   this.load.video('ripley', 'assets/aliens.mp4');
 * }
 *
 * create () {
 *   this.add.video(400, 300, 'ripley');
 * }
 * ```
 *
 * You don't have to 'preload' the video. You can also play it directly from a URL:
 *
 * ```javascript
 * create () {
 *   this.add.video(400, 300).loadURL('assets/aliens.mp4');
 * }
 * ```
 *
 * To all intents and purposes, a video is a standard Game Object, just like a Sprite. And as such, you can do
 * all the usual things to it, such as scaling, rotating, cropping, tinting, making interactive, giving a
 * physics body, etc.
 *
 * Transparent videos are also possible via the WebM file format. Providing the video file has was encoded with
 * an alpha channel, and providing the browser supports WebM playback (not all of them do), then it will render
 * in-game with full transparency.
 *
 * ### Autoplaying Videos
 *
 * Videos can only autoplay if the browser has been unlocked with an interaction, or satisfies the MEI settings.
 * The policies that control autoplaying are vast and vary between browser. You can, and should, read more about
 * it here: https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
 *
 * If your video doesn't contain any audio, then set the `noAudio` parameter to `true` when the video is _loaded_,
 * and it will often allow the video to play immediately:
 *
 * ```javascript
 * preload () {
 *   this.load.video('pixar', 'nemo.mp4', true);
 * }
 * ```
 *
 * The 3rd parameter in the load call tells Phaser that the video doesn't contain any audio tracks. Video without
 * audio can autoplay without requiring a user interaction. Video with audio cannot do this unless it satisfies
 * the browsers MEI settings. See the MDN Autoplay Guide for further details.
 *
 * Or:
 *
 * ```javascript
 * create () {
 *   this.add.video(400, 300).loadURL('assets/aliens.mp4', true);
 * }
 * ```
 *
 * You can set the `noAudio` parameter to `true` even if the video does contain audio. It will still allow the video
 * to play immediately, but the audio will not start.
 *
 * Note that due to a bug in IE11 you cannot play a video texture to a Sprite in WebGL. For IE11 force Canvas mode.
 *
 * More details about video playback and the supported media formats can be found on MDN:
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement
 * https://developer.mozilla.org/en-US/docs/Web/Media/Formats
 *
 * Note: This method will only be available if the Video Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#video
 * @since 3.20.0
 *
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} [key] - Optional key of the Video this Game Object will play, as stored in the Video Cache.
 *
 * @return {Phaser.GameObjects.Video} The Game Object that was created.
 */
GameObjectFactory.register('video', function (x, y, key)
{
    return this.displayList.add(new Video(this.scene, x, y, key));
});
