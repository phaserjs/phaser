var Class = require('../../utils/Class');
var BaseSoundManager = require('../BaseSoundManager');
var HTML5AudioSound = require('./HTML5AudioSound');
var HTML5AudioSoundManager = new Class({
    Extends: BaseSoundManager,
    initialize: function HTML5AudioSoundManager(game) {
        /**
         * Flag indicating whether if there are no idle instances of HTML5 Audio tag,
         * for any particular sound, if one of the used tags should be stopped and used
         * for succeeding playback or if succeeding Phaser.Sound.HTML5AudioSound#play
         * call should be ignored.
         *
         * @property {boolean} override
         * @default true
         */
        this.override = true;
        /**
         * Value representing time difference in seconds between calling
         * play method on an audio tag and when it actually starts playing.
         * It is used to achieve more accurate delayed sound playback.
         *
         * You might need to tweak this value to get the desired results
         * since audio play delay varies depending on the browser/platform.
         *
         * @property {number} audioPlayDelay
         * @default 0.1
         */
        this.audioPlayDelay = 0.1;
        /**
         * A value by which we should offset the loop end marker of the looping sound to compensate
         * for lag, caused by changing audio tag position, in order to achieve gapless looping.
         *
         * You might need to tweak this value to get the desired results
         * since loop lag varies depending on the browser/platform.
         *
         * @property {number} loopEndOffset
         * @default 0.05
         */
        this.loopEndOffset = 0.05;
        /**
         * An array for keeping track of all the sounds
         * that were paused when game lost focus.
         *
         * @private
         * @property {Phaser.Sound.HTML5AudioSound[]} onBlurPausedSounds
         * @default []
         */
        this.onBlurPausedSounds = [];
        this.locked = 'ontouchstart' in window;
        /**
         * A queue of all actions performed on sound objects while audio was locked.
         * Once the audio gets unlocked, after an explicit user interaction,
         * all actions will be performed in chronological order.
         *
         * @private
         * @property {{
         *   sound: Phaser.Sound.HTML5AudioSound,
         *   name: string,
         *   value?: any,
         * }[]} lockedActionsQueue
         */
        this.lockedActionsQueue = this.locked ? [] : null;
        /**
         * Property that actually holds the value of global mute
         * for HTML5 Audio sound manager implementation.
         *
         * @private
         * @property {boolean} _mute
         * @default false
         */
        this._mute = false;
        /**
         * Property that actually holds the value of global volume
         * for HTML5 Audio sound manager implementation.
         *
         * @private
         * @property {boolean} _volume
         * @default 1
         */
        this._volume = 1;
        BaseSoundManager.call(this, game);
    },
    add: function (key, config) {
        var sound = new HTML5AudioSound(this, key, config);
        this.sounds.push(sound);
        return sound;
    },
    unlock: function () {
        var _this = this;
        var moved = false;
        var detectMove = function () {
            moved = true;
        };
        var unlock = function () {
            if (moved) {
                moved = false;
                return;
            }
            document.body.removeEventListener('touchend', unlock);
            var allTags = [];
            _this.game.cache.audio.entries.each(function (key, tags) {
                for (var i = 0; i < tags.length; i++) {
                    allTags.push(tags[i]);
                }
                return true;
            });
            var lastTag = allTags[allTags.length - 1];
            lastTag.oncanplaythrough = function () {
                lastTag.oncanplaythrough = null;
                _this.unlocked = true;
            };
            allTags.forEach(function (tag) {
                tag.load();
            });
        };
        this.once('unlocked', function () {
            _this.forEachActiveSound(function (sound) {
                sound.duration = sound.tags[0].duration;
                sound.totalDuration = sound.tags[0].duration;
            });
            _this.lockedActionsQueue.forEach(function (lockedAction) {
                if (lockedAction.sound[lockedAction.prop].apply) {
                    lockedAction.sound[lockedAction.prop].apply(lockedAction.sound, lockedAction.value || []);
                }
                else {
                    lockedAction.sound[lockedAction.prop] = lockedAction.value;
                }
            });
            _this.lockedActionsQueue.length = 0;
            _this.lockedActionsQueue = null;
        });
        document.body.addEventListener('touchmove', detectMove, false);
        document.body.addEventListener('touchend', unlock, false);
    },
    onBlur: function () {
        this.forEachActiveSound(function (sound) {
            if (sound.isPlaying) {
                this.onBlurPausedSounds.push(sound);
                sound.onBlur();
            }
        });
    },
    onFocus: function () {
        this.onBlurPausedSounds.forEach(function (sound) {
            sound.onFocus();
        });
        this.onBlurPausedSounds.length = 0;
    },
    destroy: function () {
        BaseSoundManager.prototype.destroy.call(this);
        this.onBlurPausedSounds.length = 0;
        this.onBlurPausedSounds = null;
    },
    isLocked: function (sound, prop, value) {
        if (this.locked) {
            this.lockedActionsQueue.push({
                sound: sound,
                prop: prop,
                value: value
            });
            return true;
        }
        return false;
    }
});
/**
 * Global mute setting.
 *
 * @name Phaser.Sound.HTML5AudioSoundManager#mute
 * @property {boolean} mute
 */
Object.defineProperty(HTML5AudioSoundManager.prototype, 'mute', {
    get: function () {
        return this._mute;
    },
    set: function (value) {
        this._mute = value;
        this.forEachActiveSound(function (sound) {
            sound.setMute();
        });
        this.emit('mute', this, value);
    }
});
/**
 * Global volume setting.
 *
 * @name Phaser.Sound.HTML5AudioSoundManager#volume
 * @property {number} volume
 */
Object.defineProperty(HTML5AudioSoundManager.prototype, 'volume', {
    get: function () {
        return this._volume;
    },
    set: function (value) {
        this._volume = value;
        this.forEachActiveSound(function (sound) {
            sound.setVolume();
        });
        this.emit('volume', this, value);
    }
});
module.exports = HTML5AudioSoundManager;
