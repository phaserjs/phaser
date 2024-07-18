/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Utils = require('../../renderer/webgl/Utils.js');
var SubmitterImageGPULayer = require('../../renderer/webgl/renderNodes/submitter/SubmitterImageGPULayer');
var Components = require('../components');
var GameObject = require('../GameObject');
var EasingEncoding = require('./EasingEncoding');
var ImageGPULayerRender = require('./ImageGPULayerRender');

var getTint = Utils.getTintAppendFloatAlpha;

/**
 * @classdesc
 * An ImageGPULayer GameObject. This is a WebGL only GameObject.
 * It is optimized for rendering very large numbers of quads
 * following simple tween animations.
 * It is suited to complex backgrounds with animation.
 *
 * An ImageGPULayer is a composite object that contains a collection of
 * ImageGPULayerMember objects. It stores the rendering data for these
 * objects in a GPU buffer, and renders them in a single draw call.
 * Because it only updates the GPU buffer when necessary,
 * it is up to 100 times faster than rendering the objects individually.
 * Avoid changing the contents of the ImageGPULayer frequently, as this
 * requires the whole buffer to be updated.
 *
 * The layer can generally perform well with a million small quads.
 * The exact performance will depend on the device and the size of the quads.
 * If the quads are large, the layer will be fill-rate limited.
 * Try to avoid drawing more than a few million pixels per frame.
 *
 * When populating the ImageGPULayer, use `addMember` to add a new member
 * to the top of the layer. You should populate the layer all at once,
 * and leave it unchanged, rather than frequently adding and removing members,
 * because it is expensive to update the buffer.
 *
 * Rather than create a new `ImageGPULayer.Member` object for each `addMember` call,
 * you can reuse the same object. This is more efficient,
 * because creating millions of objects has a major performance cost
 * and may cause garbage collection issues.
 *
 * @class ImageGPULayer
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @webglOnly
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Lighting
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.PostPipeline
 * @extends Phaser.GameObjects.Components.RenderNode
 * @extends Phaser.GameObjects.Components.TextureCrop
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @constructor
 * @since 3.90.0
 * @param {Phaser.Scene} scene - The Scene to which this ImageGPULayer belongs.
 * @param {Phaser.Textures.Texture} texture - The texture that will be used to render the ImageGPULayer.
 * @param {number} size - The maximum number of quads that this ImageGPULayer will hold. This can be increased later if necessary.
 */
var ImageGPULayer = new Class({
    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Lighting,
        Components.Mask,
        Components.PostPipeline,
        Components.RenderNode,
        Components.TextureCrop,
        Components.Visible,
        ImageGPULayerRender
    ],

    initialize: function ImageGPULayer (scene, texture, size)
    {
        GameObject.call(this, scene, 'ImageGPULayer');

        /**
         * The number of quad members in the ImageGPULayer.
         *
         * @name Phaser.GameObjects.ImageGPULayer#memberCount
         * @type {number}
         * @since 3.90.0
         */
        this.memberCount = 0;

        /**
         * The maximum number of quad members that can be in the ImageGPULayer.
         * This value is read-only. Change buffer size with `resize`.
         *
         * @name Phaser.GameObjects.ImageGPULayer#size
         * @type {number}
         * @since 3.90.0
         * @readonly
         */
        this.size = Math.max(size, 0);

        /**
         * Whether the GPU buffer needs to be updated.
         * The update will occur on the next render.
         *
         * @name Phaser.GameObjects.ImageGPULayer#needsUpdate
         * @type {boolean}
         * @since 3.90.0
         */
        this.needsUpdate = false;

        /**
         * The time elapsed since timer initialization.
         * This drives the animation of the ImageGPULayer.
         *
         * @name Phaser.GameObjects.ImageGPULayer#timeElapsed
         * @type {number}
         * @since 3.90.0
         */
        this.timeElapsed = 0;

        /**
         * Whether the ImageGPULayer is paused.
         *
         * @name Phaser.GameObjects.ImageGPULayer#timePaused
         * @type {boolean}
         * @since 3.90.0
         * @default false
         */
        this.timePaused = false;

        /**
         * Values for valid easing functions that can be assigned to
         * the `ease` property of an ImageGPULayerMemberAnimation.
         *
         * @name Phaser.GameObjects.ImageGPULayer#EASE
         * @type {object}
         * @since 3.90.0
         * @readonly
         */
        this.EASE = EasingEncoding;

        this.setTexture(texture);
        this.initRenderNodes('ImageGPULayer');
        this.initPostPipeline(true);

        /**
         * The SubmitterImageGPULayer RenderNode for this ImageGPULayer.
         *
         * This handles rendering the ImageGPULayer to the GPU.
         * It is created automatically when the ImageGPULayer is initialized.
         * Most RenderNodes are singletons stored in the RenderNodeManager,
         * but because this one holds very specific data,
         * it is stored in the ImageGPULayer itself.
         *
         * @name Phaser.GameObjects.ImageGPULayer#submitterNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.SubmitterImageGPULayer}
         * @since 3.90.0
         */
        this.submitterNode = new SubmitterImageGPULayer(scene.renderer.renderNodes, {}, this);

        this.defaultRenderNodes['Submitter'] = this.submitterNode;
        this.renderNodeData[this.submitterNode.name] = {};

        this.resize(this.size);

        /**
         * A temporary buffer used to store member data before it is added to the GPU buffer.
         *
         * @name Phaser.GameObjects.ImageGPULayer#_tempMember
         * @type {ArrayBuffer}
         * @private
         * @since 3.90.0
         */
        this._tempMember = new ArrayBuffer(this.submitterNode.instanceBufferLayout.layout.stride);

        /**
         * A Float32Array view of the temporary member buffer.
         *
         * @name Phaser.GameObjects.ImageGPULayer#_tempMemberF32
         * @type {Float32Array}
         * @private
         * @since 3.90.0
         */
        this._tempMemberF32 = new Float32Array(this._tempMember);

        /**
         * A Uint32Array view of the temporary member buffer.
         * This is used to write 32-bit integer data to the buffer.
         * It is used for color data.
         *
         * @name Phaser.GameObjects.ImageGPULayer#_tempMemberU32
         * @type {Uint32Array}
         * @private
         * @since 3.90.0
         */
        this._tempMemberU32 = new Uint32Array(this._tempMember);
    },

    //  Overrides Game Object method
    addedToScene: function ()
    {
        this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        this.scene.sys.updateList.remove(this);
    },

    preUpdate: function (time, delta)
    {
        this.updateTimer(time, delta);
    },

    /**
     * Resizes the ImageGPULayer buffer to a new size.
     * Optionally, clears the buffer.
     *
     * @method Phaser.GameObjects.ImageGPULayer#resize
     * @since 3.90.0
     * @param {number} count - The new number of members in the ImageGPULayer.
     * @param {boolean} [clear=false] - Whether to clear the buffer.
     * @returns {this} This ImageGPULayer object.
     */
    resize: function (count, clear)
    {
        var layout = this.submitterNode.instanceBufferLayout;
        var buffer = layout.buffer;
        var u8 = buffer.viewU8;
        var targetByteSize = count * layout.layout.stride;

        this.size = count;
        this.needsUpdate = true;

        buffer.resize(targetByteSize);

        if (clear)
        {
            this.memberCount = 0;
        }
        else
        {
            // Copy data from the old buffer to the new buffer.
            var newBuffer = buffer.viewU8;
            newBuffer.set(u8.subarray(0, Math.min(newBuffer.byteLength, targetByteSize)));
            this.memberCount = Math.min(this.memberCount, count);
        }

        return this;
    },

    /**
     * Adds data to the ImageGPULayer buffer.
     *
     * This is mostly used internally by the ImageGPULayer.
     * It takes raw data as a buffer, which is very efficient,
     * but not easy to use. It is recommended to use the
     * `addMember` method instead.
     *
     * @method Phaser.GameObjects.ImageGPULayer#addData
     * @since 3.90.0
     * @param {Float32Array} member - The raw data to add to the buffer.
     * @returns {this} This ImageGPULayer object.
     */
    addData: function (member)
    {
        if (this.memberCount >= this.size)
        {
            return this;
        }

        var layout = this.submitterNode.instanceBufferLayout;
        var f32 = layout.buffer.viewF32;
        var offset = this.memberCount * layout.layout.stride;

        f32.set(member, offset / f32.BYTES_PER_ELEMENT);

        this.memberCount++;
        this.needsUpdate = true;

        return this;
    },

    /**
     * Adds a member to the ImageGPULayer.
     *
     * @method Phaser.GameObjects.ImageGPULayer#addMember
     * @since 3.90.0
     * @param {Partial<Phaser.Types.GameObjects.ImageGPULayer.Member>} [member] - The member to add to the ImageGPULayer.
     * @returns {this} This ImageGPULayer object.
     */
    addMember: function (member)
    {
        if (this.memberCount >= this.size)
        {
            return this;
        }

        var f32 = this._tempMemberF32;
        var u32 = this._tempMemberU32;

        if (!member)
        {
            member = {};
        }

        var frame = member.frame || this.frame;

        var offset = 0;

        this._setAnimatedValue(member.x, offset);
        offset += 4;

        this._setAnimatedValue(member.y, offset);
        offset += 4;

        this._setAnimatedValue(member.rotation, offset);
        offset += 4;

        this._setAnimatedValue(member.scaleX, offset, 1, frame.width);
        offset += 4;

        this._setAnimatedValue(member.scaleY, offset, 1, frame.height);
        offset += 4;

        f32[offset++] = member.originX || 0.5;
        f32[offset++] = member.originY || 0.5;

        f32[offset++] = member.tintFill ? 1 : 0;

        this._setAnimatedValue(member.scrollFactorX, offset, 1);
        offset += 4;

        this._setAnimatedValue(member.scrollFactorY, offset, 1);
        offset += 4;

        f32[offset++] = frame.u0;
        f32[offset++] = frame.v0;
        f32[offset++] = frame.u1;
        f32[offset++] = frame.v1;

        this._setAnimatedValue(member.tintBlend, offset, 1);
        offset += 4;

        var tintBottomLeft = member.tintBottomLeft === undefined ? 0xffffff : member.tintBottomLeft;
        var tintTopLeft = member.tintTopLeft === undefined ? 0xffffff : member.tintTopLeft;
        var tintBottomRight = member.tintBottomRight === undefined ? 0xffffff : member.tintBottomRight;
        var tintTopRight = member.tintTopRight === undefined ? 0xffffff : member.tintTopRight;

        var alphaBottomLeft = member.alphaBottomLeft === undefined ? 1 : member.alphaBottomLeft;
        var alphaTopLeft = member.alphaTopLeft === undefined ? 1 : member.alphaTopLeft;
        var alphaBottomRight = member.alphaBottomRight === undefined ? 1 : member.alphaBottomRight;
        var alphaTopRight = member.alphaTopRight === undefined ? 1 : member.alphaTopRight;

        u32[offset++] = getTint(
            tintBottomLeft,
            alphaBottomLeft
        );
        u32[offset++] = getTint(
            tintTopLeft,
            alphaTopLeft
        );
        u32[offset++] = getTint(
            tintBottomRight,
            alphaBottomRight
        );
        u32[offset++] = getTint(
            tintTopRight,
            alphaTopRight
        );

        this._setAnimatedValue(member.alpha, offset, 1);
        offset += 4;

        this.addData(this._tempMemberF32);

        return this;
    },

    /**
     * Edits a member of the ImageGPULayer.
     * This will update the member's data in the GPU buffer.
     * This is an expensive operation, as it requires the whole buffer to be updated.
     *
     * @method Phaser.GameObjects.ImageGPULayer#editMember
     * @since 3.90.0
     * @param {number} index - The index of the member to edit.
     * @param {Partial<Phaser.Types.GameObjects.ImageGPULayer.Member>} member - The new member data.
     * @returns {this} This ImageGPULayer object.
     */
    editMember: function (index, member)
    {
        if (index < 0 || index >= this.memberCount)
        {
            return this;
        }

        var currentMemberCount = this.memberCount;
        this.memberCount = index;
        this.addMember(member);
        this.memberCount = currentMemberCount + 1;

        return this;
    },

    /**
     * Returns a member of the ImageGPULayer.
     *
     * This returns an object copied from the buffer.
     * Editing it will not change anything in the ImageGPULayer.
     * The object will be functionally identical to the data used to
     * create the buffer, but some values may be different.
     *
     * - Animation easing values will be presented as numbers (the values
     *   in `this.EASE`).
     * - Animation offset values will be normalized to the duration,
     *   e.g. an offset of 150 with a duration of 100 will return 50.
     * - Some rounding may occur due to floating point precision.
     *
     * @method Phaser.GameObjects.ImageGPULayer#getMember
     * @since 3.90.0
     * @param {number} index - The index of the member to get.
     * @returns {?Phaser.Types.GameObjects.ImageGPULayer.Member} The member data, or null if the index is out of bounds.
     */
    getMember: function (index)
    {
        if (index < 0 || index >= this.memberCount)
        {
            return null;
        }

        var layout = this.submitterNode.instanceBufferLayout;
        var buffer = layout.buffer;
        var stride = layout.layout.stride;
        var byteOffset = index * stride;
        var f32 = buffer.viewF32;
        var u32 = buffer.viewU32;

        var member = {};

        var offset = byteOffset;

        member.x = this._getAnimatedValue(offset);
        offset += 4;

        member.y = this._getAnimatedValue(offset);
        offset += 4;

        member.rotation = this._getAnimatedValue(offset);
        offset += 4;

        member.scaleX = this._getAnimatedValue(offset);
        offset += 4;

        member.scaleY = this._getAnimatedValue(offset);
        offset += 4;

        member.originX = f32[offset++];
        member.originY = f32[offset++];
        member.tintFill = !!f32[offset++];

        member.scrollFactorX = this._getAnimatedValue(offset);
        offset += 4;

        member.scrollFactorY = this._getAnimatedValue(offset);
        offset += 4;

        member.frame = {
            u0: f32[offset++],
            v0: f32[offset++],
            u1: f32[offset++],
            v1: f32[offset++]
        };

        // Use frame data to revert scale values.
        var width = this.texture.source[0].width * (member.frame.u1 - member.frame.u0);
        if (typeof member.scaleX === 'object')
        {
            member.scaleX.base /= width;
            member.scaleX.amplitude /= width;
        }
        else
        {
            member.scaleX /= width;
        }
        var height = this.texture.source[0].height * (member.frame.v1 - member.frame.v0);
        if (typeof member.scaleY === 'object')
        {
            member.scaleY.base /= height;
            member.scaleY.amplitude /= height;
        }
        else
        {
            member.scaleY /= height;
        }

        member.tintBlend = this._getAnimatedValue(offset);
        offset += 4;

        member.tintBottomLeft = u32[offset++];
        member.tintTopLeft = u32[offset++];
        member.tintBottomRight = u32[offset++];
        member.tintTopRight = u32[offset++];
        member.alphaBottomLeft = (member.tintBottomLeft >>> 24) / 255;
        member.alphaTopLeft = (member.tintTopLeft >>> 24) / 255;
        member.alphaBottomRight = (member.tintBottomRight >>> 24) / 255;
        member.alphaTopRight = (member.tintTopRight >>> 24) / 255;
        member.tintBottomLeft &= 0xffffff;
        member.tintTopLeft &= 0xffffff;
        member.tintBottomRight &= 0xffffff;
        member.tintTopRight &= 0xffffff;

        member.alpha = this._getAnimatedValue(offset);
        offset += 4;

        return member;
    },

    /**
     * Removes a member or a number of members from the ImageGPULayer.
     * This will update the GPU buffer.
     * This is an expensive operation, as it requires the whole buffer to be updated.
     *
     * The buffer is not resized.
     *
     * @method Phaser.GameObjects.ImageGPULayer#removeMember
     * @since 3.90.0
     * @param {number} index - The index of the member to remove.
     * @param {number} [count=1] - The number of members to remove, default 1.
     * @returns {this} This ImageGPULayer object.
     */
    removeMember: function (index, count)
    {
        if (index < 0 || index >= this.memberCount)
        {
            return this;
        }
        
        if (count === undefined)
        {
            count = 1;
        }

        count = Math.min(count, this.memberCount - index);

        var layout = this.submitterNode.instanceBufferLayout;
        var buffer = layout.buffer;
        var stride = layout.layout.stride;
        var byteOffset = index * stride;
        var byteLength = count * stride;

        // Create temporary buffer containing a copy of the information
        // which comes after the removed members.
        var u8 = buffer.viewU8;
        var u8After = u8.subarray(byteOffset + byteLength);
        var newU8 = new Uint8Array(u8After.length);
        newU8.set(u8After);

        // Copy the temporary buffer back to the original buffer,
        // overwriting the removed members.
        u8.set(newU8, byteOffset);

        // Update layer properties.
        this.memberCount -= count;
        this.needsUpdate = true;

        return this;
    },

    /**
     * Sets the values of an animation for a member of this ImageGPULayer.
     * The values are set on the temporary buffer, used internally.
     *
     * @method Phaser.GameObjects.ImageGPULayer#_setAnimatedValue
     * @since 3.90.0
     * @private
     * @param {undefined|number|Phaser.Types.GameObjects.ImageGPULayer.MemberAnimation} value - The value to set.
     * @param {number} index - The offset in the temporary buffer to write to.
     * @param {number} [defaultValue=0] - A default value to use if `value` is undefined.
     * @param {factor} [factor=1] - A factor to multiply the base value and amplitude by.
     */
    _setAnimatedValue: function (value, index, defaultValue, factor)
    {
        var f32 = this._tempMemberF32;

        if (defaultValue === undefined)
        {
            defaultValue = 0;
        }

        if (factor === undefined)
        {
            factor = 1;
        }
        
        if (typeof value === 'number')
        {
            f32[index++] = value * factor;
            f32[index++] = 0;
            f32[index++] = 0;
            f32[index++] = 0;
        }
        else if (value === undefined)
        {
            f32[index++] = defaultValue * factor;
            f32[index++] = 0;
            f32[index++] = 0;
            f32[index++] = 0;
        }
        else
        {
            var base = value.base || 0;
            var ease = value.ease || 0;
            var amplitude = value.amplitude || 0;
            var duration = Math.abs(value.duration || 0);
            var offset = value.offset || 0;
            var yoyo = value.yoyo !== undefined ? value.yoyo : true;

            if (typeof ease === 'string')
            {
                ease = this.EASE[ease] || 0;
            }

            // Normalize offset.
            offset = (offset / duration) % 1;
            if (offset < 0)
            {
                offset += 1;
            }

            // Add an integer to encode the type.
            offset += ease;

            // Encode yoyo in the sign of duration, which must be positive.
            if (yoyo)
            {
                duration = -duration;
            }

            f32[index++] = base * factor;
            f32[index++] = amplitude * factor;
            f32[index++] = duration;
            f32[index++] = offset;
        }
    },

    /**
     * Return the values of an animation for a member of this ImageGPULayer
     * in the buffer.
     *
     * @method Phaser.GameObjects.ImageGPULayer#_getAnimatedValue
     * @since 3.90.0
     * @private
     * @param {number} index - The index where the animation begins in the buffer.
     * @returns {number|Phaser.Types.GameObjects.ImageGPULayer.MemberAnimation} The animation values.
     */
    _getAnimatedValue: function (index)
    {
        var f32 = this.submitterNode.instanceBufferLayout.buffer.viewF32;

        var base = f32[index++];
        var amplitude = f32[index++];
        var duration = f32[index++];
        var offset = f32[index++];

        if (duration === 0)
        {
            return base;
        }

        var yoyo = duration < 0;
        if (yoyo)
        {
            duration = -duration;
        }

        // Evaluate ease after duration, so duration has the correct sign.

        var ease = Math.floor(offset);
        offset -= ease;
        offset *= duration;

        return {
            base: base,
            ease: ease,
            amplitude: amplitude,
            duration: duration,
            offset: offset,
            yoyo: yoyo
        };
    },

    /**
     * Pauses or resumes the animation timer for this ImageGPULayer.
     *
     * @method Phaser.GameObjects.ImageGPULayer#setTimerPaused
     * @since 3.90.0
     * @param {boolean} [paused] - Pause state (`true` to pause, `false` to unpause). If not specified, the timer will unpause.
     * @return {this} This ImageGPULayer object.
     */
    setTimerPaused: function (paused)
    {
        this.timePaused = !!paused;

        return this;
    },

    /**
     * Reset the animation timer for this ImageGPULayer.
     *
     * @method Phaser.GameObjects.ImageGPULayer#resetTimer
     * @since 3.90.0
     * @param {number} [ms=0] - The time to reset the timer to.
     * @return {this} This ImageGPULayer object.
     */
    resetTimer: function (ms)
    {
        if (ms === undefined) { ms = 0; }
        this.timeElapsed = ms;

        return this;
    },

    /**
     * Update the timer for this ImageGPULayer.
     * This is called automatically by the preUpdate method.
     * The timer drives the animation of the ImageGPULayer members.
     *
     * Override this method to create more advanced time management,
     * or set it to a NOOP function to disable the timer update.
     * If you want to control animations with a tween or input system,
     * disabling the timer update could be useful.
     *
     * @method Phaser.GameObjects.ImageGPULayer#updateTimer
     * @since 3.90.0
     * @param {number} time - The current time in milliseconds.
     * @param {number} delta - The time since the last update, in milliseconds.
     * @return {this} This ImageGPULayer object.
     */
    updateTimer: function (time, delta)
    {
        if (!this.timePaused)
        {
            this.timeElapsed += delta;
        }

        return this;
    }
});

module.exports = ImageGPULayer;
