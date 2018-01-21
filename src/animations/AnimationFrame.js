var Class = require('../utils/Class');

//  Phaser.Animations.AnimationFrame

var AnimationFrame = new Class({

    initialize:

    /**
     * [description]
     *
     * @class AnimationFrame
     * @memberOf Phaser.Animations.AnimationFrame
     * @constructor
     * @since 3.0.0
     *
     * @param {undefined} textureKey - [description]
     * @param {undefined} textureFrame - [description]
     * @param {undefined} index - [description]
     * @param {undefined} frame - [description]
     */
    function AnimationFrame (textureKey, textureFrame, index, frame)
    {
        //  The keys into the Texture Manager of the texture + frame this uses

        /**
         * [description]
         *
         * @property {string} textureKey
         */
        this.textureKey = textureKey;

        /**
         * [description]
         *
         * @property {Phaser.Textures.Frame} textureFrame
         */
        this.textureFrame = textureFrame;

        //  The index of this frame within the Animation.frames array

        /**
         * [description]
         *
         * @property {integer} index
         */
        this.index = index;

        //  Texture Frame

        /**
         * [description]
         *
         * @property {Phaser.Textures.Frame} frame
         */
        this.frame = frame;

        //  Read-only

        /**
         * [description]
         *
         * @property {boolean} isFirst
         * @default false
         */
        this.isFirst = false;

        //  Read-only

        /**
         * [description]
         *
         * @property {boolean} isLast
         * @default false
         */
        this.isLast = false;

        //  The frame that comes before this one in the animation (if any)
        //  Read-only

        /**
         * [description]
         *
         * @property {?[type]} prevFrame
         * @default null
         */
        this.prevFrame = null;

        //  The frame that comes after this one in the animation (if any)
        //  Read-only

        /**
         * [description]
         *
         * @property {?[type]} nextFrame
         * @default null
         */
        this.nextFrame = null;

        //   Additional time (in ms) this frame should appear for - added onto the msPerFrame

        /**
         * [description]
         *
         * @property {number} duration
         * @default 0
         */
        this.duration = 0;

        //   What % through the animation progress is this frame?
        //  Read-only

        /**
         * [description]
         *
         * @property {number} progress
         * @default 0
         */
        this.progress = 0;

        //  Callback if this frame gets displayed

        /**
         * [description]
         *
         * @property {?[type]} onUpdate
         * @default null
         */
        this.onUpdate = null;

        //  When this frame hits, set sprite.visible to this

        /**
         * [description]
         *
         * @property {boolean} setVisible
         * @default false
         */
        this.setVisible = false;

        this.visible = false;
    },

    toJSON: function ()
    {
        return {
            key: this.textureKey,
            frame: this.textureFrame,
            duration: this.duration,
            visible: this.visible
        };
    },

    destroy: function ()
    {
        this.frame = undefined;
        this.onUpdate = undefined;
    }

});

module.exports = AnimationFrame;
