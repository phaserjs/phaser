/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject.js');
var SubmitterSpriteGPULayer = require('../../renderer/webgl/renderNodes/submitter/SubmitterSpriteGPULayer.js');
var Utils = require('../../renderer/webgl/Utils.js');
var EasingEncoding = require('./EasingEncoding.js');
var EasingNaming = require('./EasingNaming.js');
var SpriteGPULayerRender = require('./SpriteGPULayerRender.js');

var getTint = Utils.getTintAppendFloatAlpha;

/**
 * @classdesc
 * A SpriteGPULayer GameObject. This is a WebGL only GameObject.
 * It is optimized for rendering very large numbers of quads
 * following simple tween animations.
 * It is suited to complex backgrounds with animation.
 *
 * A SpriteGPULayer is a composite object that contains a collection of
 * Member objects. It stores the rendering data for these
 * objects in a GPU buffer, and renders them in a single draw call.
 * Because it only updates the GPU buffer when necessary,
 * it is up to 100 times faster than rendering the objects individually.
 * Avoid changing the contents of the SpriteGPULayer frequently, as this
 * requires the whole buffer to be updated.
 *
 * The layer can generally perform well with a million small quads.
 * The exact performance will depend on the device and the size of the quads.
 * If the quads are large, the layer will be fill-rate limited.
 * Avoid drawing more than a few million pixels per frame.
 *
 * When populating the SpriteGPULayer, use `addMember` to add a new member
 * to the top of the layer. You should populate the layer all at once,
 * and leave it unchanged, rather than frequently adding and removing members,
 * because it is expensive to update the buffer.
 *
 * Rather than create a new `SpriteGPULayer.Member` object for each `addMember` call,
 * you can reuse the same object. This is more efficient,
 * because creating millions of objects has a major performance cost
 * and may cause garbage collection issues.
 *
 * Notes on textures:
 *
 * This layer gains much of its speed from inflexibility. It can only use one
 * texture, and that texture must be a single image.
 * It cannot use multi-atlas textures.
 *
 * Further, if the texture is not a power of two in size,
 * some texture seaming may occur if you line up sprites exactly.
 * This is because the GPU precision is limited by binary logic,
 * and texture coordinates will only be perfectly accurate for power of two textures.
 * This can be avoided by adding/extruding a pixel of padding around each frame
 * in the texture, or by using a power of two texture.
 *
 * Which should you use?
 *
 * - If you are using pixel art mode or round pixels,
 *   you should aim to use a power of two texture.
 * - If you are using smooth mode, you can use a non-power of two texture,
 *   but you should add padding around each frame to avoid seaming.
 * - If you are using a single image, or none of the frames in the texture
 *   need to tile, it doesn't matter.
 *
 * @class SpriteGPULayer
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @webglOnly
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.ElapseTimer
 * @extends Phaser.GameObjects.Components.Lighting
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.TextureCrop
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Scene} scene - The Scene to which this SpriteGPULayer belongs.
 * @param {Phaser.Textures.Texture} texture - The texture that will be used to render the SpriteGPULayer. This must be sourced from a single image; a multi atlas will not work.
 * @param {number} size - The maximum number of quads that this SpriteGPULayer will hold. This can be increased later if necessary.
 */
var SpriteGPULayer = new Class({
    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.ElapseTimer,
        Components.Lighting,
        Components.Mask,
        Components.RenderNodes,
        Components.TextureCrop,
        Components.Visible,
        SpriteGPULayerRender
    ],

    initialize: function SpriteGPULayer (scene, texture, size)
    {
        GameObject.call(this, scene, 'SpriteGPULayer');

        /**
         * The number of quad members in the SpriteGPULayer.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#memberCount
         * @type {number}
         * @since 4.0.0
         */
        this.memberCount = 0;

        /**
         * The maximum number of quad members that can be in the SpriteGPULayer.
         * This value is read-only. Change buffer size with `resize`.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#size
         * @type {number}
         * @since 4.0.0
         * @readonly
         */
        this.size = Math.max(size, 0);

        /**
         * Which segments of the buffer require updates.
         * This is a bitfield of 32 segments.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#bufferUpdateSegments
         * @type {number}
         * @since 4.0.0
         */
        this.bufferUpdateSegments = 0;

        /**
         * The size of each segment of the buffer that requires updates.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#bufferUpdateSegmentSize
         * @type {number}
         * @since 4.0.0
         */
        this.bufferUpdateSegmentSize = Math.ceil(this.size / 32);

        /**
         * The gravity used by member animations in 'Gravity' mode.
         * This is the acceleration in pixels per second squared.
         * The default is 1024 pixels per second squared.
         *
         * Any animation can be set to `ease: 'Gravity'` to use this value.
         * Instead of `amplitude`, the animation takes
         * `velocity` (a number of pixels) and
         * `gravityFactor` (0-1) parameters.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#gravity
         * @type {number}
         * @since 4.0.0
         * @default 1024
         */
        this.gravity = 1024;

        /**
         * The animations enabled for the SpriteGPULayer.
         * This is a map of animation names from `this.EASE` to boolean values.
         * Adjust these values with `setAnimationEnabled`.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#_animationsEnabled
         * @type {object}
         * @since 4.0.0
         * @private
         */
        this._animationsEnabled = {};

        var animations = Object.keys(EasingEncoding);
        var animLen = animations.length;
        for (var i = 0; i < animLen; i++)
        {
            this._animationsEnabled[animations[i]] = false;
        }

        /**
         * Strings for valid easing functions that can be assigned to
         * the `ease` property of an SpriteGPULayerMemberAnimation.
         * This is the reverse mapping of `this.EASE_CODES`.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#EASE
         * @type {object}
         * @since 4.0.0
         * @readonly
         */
        this.EASE = EasingEncoding;

        /**
         * Codes for valid easing functions that can be assigned to
         * the `ease` property of an SpriteGPULayerMemberAnimation.
         * This is the reverse mapping of `this.EASE`.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#EASE_CODES
         * @type {object}
         * @since 4.0.0
         * @readonly
         */
        this.EASE_CODES = EasingNaming;

        this.setTexture(texture);
        this.initRenderNodes(new Phaser.Structs.Map());

        /**
         * A texture containing the frame data for the SpriteGPULayer.
         * This is used by the vertex shader.
         *
         * The texture is composed of pixel strides, where each stride
         * is interpreted as 6 16-bit unsigned integers,
         * representing the x, y, width, height, and origin x and y of a frame.
         * The texture will be up to 4096 pixels wide and as tall as necessary.
         *
         * There are two sets of data in the texture: frames and animations.
         * Frames are taken from the `texture`.
         * Animations are defined by calling `setAnimations`,
         * and consist of runs of frames suited to shader animation.
         * Although the texture will be regenerated by `setAnimations`,
         * the frames are stored first, so their indices won't change.
         *
         * If you change the `texture` of this layer, you will need to
         * regenerate this by calling `generateFrameDataTexture`.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#frameDataTexture
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @since 4.0.0
         */
        this.frameDataTexture = null;

        /**
         * A map of frame names to indices in the frame data texture.
         * This is used to convert frame names to indices for the vertex shader.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#frameDataIndices
         * @type {object}
         * @since 4.0.0
         */
        this.frameDataIndices = {};

        /**
         * A map of indices to frame names in the frame data texture.
         * This is used to convert frame indices back to names for debugging.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#frameDataIndicesInv
         * @type {object}
         * @since 4.0.0
         */
        this.frameDataIndicesInv = {};

        /**
         * An ordered list of animations in the frame data texture.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#animationData
         * @type {object[]}
         * @since 4.0.0
         */
        this.animationData = [];

        /**
         * A map of animation names to animation parameters in
         * the frame data texture.
         * This is used to convert animation names to indices and durations
         * for the vertex shader.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#animationDataNames
         * @type {object}
         * @since 4.0.0
         */
        this.animationDataNames = {};

        /**
         * A map of frame indices to animation parameters in
         * the frame data texture.
         * These are the starting frame indices used by the vertex shader.
         * They can be used to map back to names in `animationDataIndices`.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#animationDataIndices
         * @type {object}
         * @since 4.0.0
         */
        this.animationDataIndices = {};

        this.generateFrameDataTexture();

        /**
         * The SubmitterSpriteGPULayer RenderNode for this SpriteGPULayer.
         *
         * This handles rendering the SpriteGPULayer to the GPU.
         * It is created automatically when the SpriteGPULayer is initialized.
         * Most RenderNodes are singletons stored in the RenderNodeManager,
         * but because this one holds very specific data,
         * it is stored in the SpriteGPULayer itself.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#submitterNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.SubmitterSpriteGPULayer}
         * @since 4.0.0
         */
        this.submitterNode = new SubmitterSpriteGPULayer(scene.renderer.renderNodes, {}, this);

        this.defaultRenderNodes['Submitter'] = this.submitterNode;
        this.renderNodeData[this.submitterNode.name] = {};

        this.resize(this.size);

        /**
         * The next member buffer, used to store member data
         * before it is added to the GPU buffer.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#nextMember
         * @type {ArrayBuffer}
         * @since 4.0.0
         */
        this.nextMember = new ArrayBuffer(this.submitterNode.instanceBufferLayout.layout.stride);

        /**
         * A Float32Array view of the next member buffer.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#nextMemberF32
         * @type {Float32Array}
         * @since 4.0.0
         */
        this.nextMemberF32 = new Float32Array(this.nextMember);

        /**
         * A Uint32Array view of the next member buffer.
         * This is used to write 32-bit integer data to the buffer.
         * It is used for color data.
         *
         * @name Phaser.GameObjects.SpriteGPULayer#nextMemberU32
         * @type {Uint32Array}
         * @since 4.0.0
         */
        this.nextMemberU32 = new Uint32Array(this.nextMember);
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
     * Return a list of features to enable in the shader program.
     * This is used when the shader program is compiled.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#getShaderFeatures
     * @since 4.0.0
     * @return {string[]} An array of features to enable in the shader program.
     */
    getShaderFeatures: function ()
    {
        var features = [];

        // Add enabled animations.
        var animations = Object.keys(this._animationsEnabled);
        var animLen = animations.length;
        for (var i = 0; i < animLen; i++)
        {
            if (this._animationsEnabled[animations[i]])
            {
                features.push(animations[i]);
            }
        }

        return features;
    },

    /**
     * Set the animations available to the SpriteGPULayer.
     * This will call `generateFrameDataTexture` to regenerate
     * `frameDataTexture`.
     *
     * Each animation can be either an Animation object, or an object
     * containing a name, duration, and an array of frame names/numbers.
     * If an Animation is used, it will be converted to the object form,
     * discarding any custom individual frame durations
     * and using the animation's duration as default.
     *
     * This is not a Phaser Animation. It is intended to cycle automatically
     * on the GPU without supervision or interaction. It will not emit events,
     * allow you to pause the animation, set number of repeats, etc.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#setAnimations
     * @since 4.0.0
     * @param {Phaser.Animations.Animation[]|Phaser.Types.GameObjects.SpriteGPULayer.SetAnimation[]} animations - An array of animations to set.
     * @returns {this} This SpriteGPULayer object.
     */
    setAnimations: function (animations)
    {
        var animLen = animations.length;

        // Animation frames will start after the texture frames.
        var frameNames = this.texture.getFrameNames(true);
        var index = frameNames.length;

        for (var i = 0; i < animLen; i++)
        {
            var anim = animations[i];
            var data = {};
            if (anim.key)
            {
                // This is a Phaser.Animations.Animation class.
                data.name = anim.key;
                data.duration = anim.duration;
                data.frames = anim.frames;
            }
            else
            {
                data.name = anim.name;
                data.duration = anim.duration;
                data.frames = anim.frames.slice();
            }

            // Add frame indexing data.
            data.index = index;
            data.frameCount = data.frames.length;
            index += data.frameCount;

            // Store animation.
            this.animationData.push(data);
            this.animationDataNames[data.name] = data;
            this.animationDataIndices[data.index] = data;
        }

        this.generateFrameDataTexture();

        return this;
    },

    /**
     * Generate `frameDataTexture` for the SpriteGPULayer.
     * This is used by the vertex shader to access frame data.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#generateFrameDataTexture
     * @since 4.0.0
     */
    generateFrameDataTexture: function ()
    {
        // Get the frame data.
        var texture = this.texture;
        var frames = texture.getFrameNames(true);
        var frameLen = frames.length;

        // Update the frame data indices.
        this.frameDataIndices = {};
        this.frameDataIndicesInv = {};
        for (var i = 0; i < frameLen; i++)
        {
            var frameName = frames[i];
            var frame = texture.get(frameName);
            this.frameDataIndices[frameName] = i;
            this.frameDataIndicesInv[i] = frameName;
        }

        // Append frames from animations.
        var anims = this.animationData;
        var animsLen = anims.length;
        for (i = 0; i < animsLen; i++)
        {
            var anim = this.animationData[i];
            var frameCount = anim.frameCount;
            for (var j = 0; j < frameCount; j++)
            {
                frames.push(anim.frames[j]);
            }
        }

        frameLen = frames.length;
        var valuesPerFrame = 3;
        var pixelCount = frameLen * valuesPerFrame;
        var width = Math.min(pixelCount, 4096);
        var height = Math.ceil(pixelCount / 4096);
        var dataSize = width * height * 4;

        // Generate a Uint8Array with the frame data.
        var data = new ArrayBuffer(dataSize);
        var u16 = new Uint16Array(data);
        var u8 = new Uint8Array(data);
        for (i = 0; i < frameLen; i++)
        {
            var animFrame = frames[i];
            if (typeof animFrame === 'string')
            {
                frame = texture.get(frames[i]);
            }
            else
            {
                // animFrame is an AnimationFrame object.
                frame = animFrame.frame;
            }

            var offset = i * valuesPerFrame * u16.BYTES_PER_ELEMENT;

            // Position
            u16[offset] = frame.cutX;
            u16[offset + 1] = frame.cutY;

            // Size
            u16[offset + 2] = frame.cutWidth;
            u16[offset + 3] = frame.cutHeight;

            // Pivot offset
            // Multiplied by the size to convert to pixels.
            // Offset by 32768 to effectively store as a 16-bit signed integer.
            var pivotX = 0.5;
            var pivotY = 0.5;
            if (frame.customPivot)
            {
                pivotX = frame.pivotX;
                pivotY = frame.pivotY;
            }
            u16[offset + 4] = Math.round((pivotX - 0.5) * frame.cutWidth) + 32768;
            u16[offset + 5] = Math.round((pivotY - 0.5) * frame.cutHeight) + 32768;
        }

        // Create or update a texture with the frame data.
        if (this.frameDataTexture)
        {
            this.frameDataTexture.destroy();
        }
        this.frameDataTexture = this.scene.renderer.createUint8ArrayTexture(u8, width, height, false, false);
    },

    /**
     * Resizes the SpriteGPULayer buffer to a new size.
     * Optionally, clears the buffer.
     *
     * This is an expensive operation, as it requires the whole buffer to be updated.
     * It can take many frames to complete.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#resize
     * @since 4.0.0
     * @param {number} count - The new number of members in the SpriteGPULayer.
     * @param {boolean} [clear=false] - Whether to clear the buffer.
     * @returns {this} This SpriteGPULayer object.
     */
    resize: function (count, clear)
    {
        var layout = this.submitterNode.instanceBufferLayout;
        var buffer = layout.buffer;
        var u8 = buffer.viewU8;
        var targetByteSize = count * layout.layout.stride;

        this.size = count;

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

        this.bufferUpdateSegmentSize = Math.ceil(this.size / 32);
        this.setAllSegmentsNeedUpdate();

        return this;
    },

    /**
     * Sets a segment of the buffer to require an update.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#setSegmentNeedsUpdate
     * @since 4.0.0
     * @param {number} index - The index at which an update occurred, which requires the segment to be updated.
     */
    setSegmentNeedsUpdate: function (index)
    {
        if (
            index < 0 ||
            index >= this.size ||
            this.bufferUpdateSegments === 0xffffffff
        )
        {
            return;
        }
        var segment = Math.floor(index / this.bufferUpdateSegmentSize);
        this.bufferUpdateSegments |= (1 << segment);
    },

    /**
     * Sets all segments of the buffer to require an update.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#setAllSegmentsNeedUpdate
     * @since 4.0.0
     */
    setAllSegmentsNeedUpdate: function ()
    {
        this.bufferUpdateSegments = 0xffffffff;
    },

    /**
     * Clears all segments of the buffer that require an update.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#clearAllSegmentsNeedUpdate
     * @since 4.0.0
     */
    clearAllSegmentsNeedUpdate: function ()
    {
        this.bufferUpdateSegments = 0;
    },

    /**
     * Adds data to the SpriteGPULayer buffer.
     * It is inserted at the end of the buffer.
     *
     * This is mostly used internally by the SpriteGPULayer.
     * It takes raw data as a buffer, which is very efficient,
     * but `addMember` is easier to use.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#addData
     * @since 4.0.0
     * @param {Float32Array} member - The raw data to add to the buffer.
     * @returns {this} This SpriteGPULayer object.
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

        this.setSegmentNeedsUpdate(this.memberCount);
        this.memberCount++;

        return this;
    },

    /**
     * Adds a member to the SpriteGPULayer.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#addMember
     * @since 4.0.0
     * @param {Partial<Phaser.Types.GameObjects.SpriteGPULayer.Member>} [member] - The member to add to the SpriteGPULayer.
     * @returns {this} This SpriteGPULayer object.
     */
    addMember: function (member)
    {
        if (this.memberCount >= this.size)
        {
            return this;
        }

        var f32 = this.nextMemberF32;
        var u32 = this.nextMemberU32;

        if (!member)
        {
            member = {};
        }

        var frame = this.frame;
        if (member.frame !== undefined)
        {
            frame = member.frame.base ? member.frame.base : member.frame;
        }
        if (typeof frame === 'string')
        {
            frame = this.texture.get(frame);

            if (!frame)
            {
                return this;
            }
        }

        var offset = 0;

        this._setAnimatedValue(member.x, offset);
        offset += 4;

        this._setAnimatedValue(member.y, offset);
        offset += 4;

        this._setAnimatedValue(member.rotation, offset);
        offset += 4;

        this._setAnimatedValue(member.scaleX, offset, 1);
        offset += 4;

        this._setAnimatedValue(member.scaleY, offset, 1);
        offset += 4;

        f32[offset++] = member.originX === undefined ? 0.5 : member.originX;
        f32[offset++] = member.originY === undefined ? 0.5 : member.originY;

        f32[offset++] = member.tintFill ? 1 : 0;

        f32[offset++] = member.scrollFactorX === undefined ? 1 : member.scrollFactorX;
        f32[offset++] = member.scrollFactorY === undefined ? 1 : member.scrollFactorY;

        var animation = member.animation;
        if (animation)
        {
            // Use frame animation.
            var animData;
            if (
                (typeof animation === 'string') ||
                (typeof animation === 'number')
            )
            {
                if (typeof animation === 'string')
                {
                    animData = this.animationDataNames[animation];
                }
                else
                {
                    animData = this.animationDataIndices[animation];
                }
                this._setAnimatedValue({
                    base: animData.index,
                    amplitude: animData.frameCount,
                    duration: animData.duration,
                    ease: EasingEncoding.Linear,
                    yoyo: false
                }, offset);
            }
            else
            {
                var base = animation.base;
                if (typeof base === 'string')
                {
                    animData = this.animationDataNames[base];
                }
                else if (typeof base === 'number')
                {
                    animData = this.animationDataIndices[base];
                }
                else
                {
                    // Bad data; fall back to first animation.
                    animData = this.animationData[0];
                }
                this._setAnimatedValue({
                    base: animData.index,
                    amplitude: (typeof animation.amplitude === 'number') ? animation.amplitude : animData.frameCount,
                    duration: animation.duration || animData.duration,
                    delay: animation.delay || 0,
                    ease: animation.ease || EasingEncoding.Linear,
                    yoyo: !!animation.yoyo
                }, offset);
            }
        }
        else
        {
            // Use single frame.
            var frameIndex = this.frameDataIndices[frame.name];
            var memberFrame = member.frame;
            if (memberFrame && memberFrame.base !== undefined)
            {
                this._setAnimatedValue({
                    base: frameIndex,
                    amplitude: memberFrame.amplitude,
                    duration: memberFrame.duration,
                    delay: memberFrame.delay,
                    ease: memberFrame.ease,
                    yoyo: memberFrame.yoyo
                }, offset);
            }
            else
            {
                this._setAnimatedValue(frameIndex, offset);
            }
        }
        offset += 4;

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

        this.addData(this.nextMemberF32);

        return this;
    },

    /**
     * Edits a member of the SpriteGPULayer.
     * This will update the member's data in the GPU buffer.
     * This is an expensive operation, as it requires the whole buffer to be updated.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#editMember
     * @since 4.0.0
     * @param {number} index - The index of the member to edit.
     * @param {Partial<Phaser.Types.GameObjects.SpriteGPULayer.Member>} member - The new member data.
     * @returns {this} This SpriteGPULayer object.
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
        this.memberCount = currentMemberCount;

        return this;
    },

    /**
     * Update a member of the SpriteGPULayer with raw data.
     * This will update the member's data in the GPU buffer.
     *
     * You can supply a mask to control which properties are updated.
     * This can be useful for updating only a subset of properties.
     * Try using `getMemberData` to copy an existing member's data,
     * then modify the data you want to change.
     *
     * The data must be passed in as an Uint32Array.
     * This will preserve data that other TypedArrays would not.
     * As it uses an underlying ArrayBuffer, you can work on the data
     * with any TypedArray view before submitting it.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#patchMember
     * @since 4.0.0
     * @param {number} index - The index of the member to patch.
     * @param {Uint32Array} member - The new member data.
     * @param {number[]} [mask] - The mask to apply to the member data. A value of 1 will update the member data, a value of 0 will keep the existing member data.
     */
    patchMember: function (index, member, mask)
    {
        if (index < 0 || index >= this.memberCount)
        {
            return;
        }

        var layout = this.submitterNode.instanceBufferLayout;
        var buffer = layout.buffer;
        var stride = layout.layout.stride;
        var byteOffset = index * stride;
        var u32 = buffer.viewU32;

        var offset = byteOffset / 4;

        if (mask)
        {
            for (var i = 0; i < member.length; i++)
            {
                if (mask[i])
                {
                    u32[offset + i] = member[i];
                }
            }
        }
        else
        {
            u32.set(member, offset);
        }

        this.setSegmentNeedsUpdate(index);
    },

    /**
     * Returns a member of the SpriteGPULayer.
     *
     * This returns an object copied from the buffer.
     * Editing it will not change anything in the SpriteGPULayer.
     * The object will be functionally identical to the data used to
     * create the buffer, but some values may be different.
     *
     * - Properties that support animation, but have no amplitude or duration or have easing 'None' (0), will be presented as numbers.
     * - Animation easing values will be presented as numbers (the values
     *   in `this.EASE`).
     * - Animation delay values will be normalized to the duration,
     *   e.g. a delay of 150 with a duration of 100 will return 50.
     * - Some rounding may occur due to floating point precision.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#getMember
     * @since 4.0.0
     * @param {number} index - The index of the member to get.
     * @returns {?Phaser.Types.GameObjects.SpriteGPULayer.Member} The member data, or null if the index is out of bounds.
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

        var offset = byteOffset / f32.BYTES_PER_ELEMENT;

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

        member.scrollFactorX = f32[offset++];
        member.scrollFactorY = f32[offset++];

        // Determine frame or animation values.
        var frame = this._getAnimatedValue(offset);
        offset += 4;

        if (typeof frame !== 'number')
        {
            frame = frame.base;
        }

        // Get name from frame index.
        var frameName = this.frameDataIndicesInv[frame];
        if (frameName === undefined)
        {
            // Get name from animation index.
            var animData = this.animationDataIndices[frame];
            if (animData)
            {
                member.animation = animData.name;
            }
        }
        else
        {
            member.frame = frameName;
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
     * Returns the raw data of a member of the SpriteGPULayer.
     * This can be useful as the base of efficient editing operations,
     * including calls to `addData` and `patchMember`,
     * so no data has to be converted.
     *
     * This returns an Uint32Array copied from the buffer.
     * Editing it will not change anything in the SpriteGPULayer.
     * The array will be functionally identical to the data used to
     * create the buffer.
     *
     * By default, the data is copied into `this.nextMember`.
     * You can use the views `this.nextMemberF32` and `this.nextMemberU32`
     * to access the data in different formats.
     * If you provide an `out` parameter, the data will be copied to that array,
     * and you must construct your own views.
     *
     * The primary data view is a 40-element array of 32-bit floats.
     * Some values are grouped to form animations, of the form:
     *
     * - 0: base value
     * - 1: amplitude
     * - 2: duration (if negative, the animation will yoyo)
     * - 3: delay (the integer part is the easing, the decimal part is the delay divided by 2 * duration)
     *
     * The overall structure is thus:
     *
     * - 0-3: x (animation)
     * - 4-7: y (animation)
     * - 8-11: rotation (animation)
     * - 12-15: scaleX (animation)
     * - 16-19: scaleY (animation)
     * - 20: originX
     * - 21: originY
     * - 22: tintFill
     * - 23: scrollFactorX
     * - 24: scrollFactorY
     * - 25-28: frame index (animation)
     * - 29-32: tintBlend (animation)
     * - 33-36: no data
     * - 37-40: alpha (animation)
     *
     * Elements 33-36 are only visible in the Uint32Array view.
     * They store 32-bit RGBA values for the four corners of the tint:
     *
     * - 33: bottom-left
     * - 34: top-left
     * - 35: bottom-right
     * - 36: top-right
     *
     * @method Phaser.GameObjects.SpriteGPULayer#getMemberData
     * @since 4.0.0
     * @param {number} index - The index of the member to get.
     * @param {Uint32Array} [out] - An optional array to copy the data to. If not provided, `this.nextMember` will be populated, and `nextMemberU32` will be returned.
     * @returns {?Uint32Array} The member data, or null if the index is out of bounds.
     */
    getMemberData: function (index, out)
    {
        if (index < 0 || index >= this.memberCount)
        {
            return null;
        }

        var layout = this.submitterNode.instanceBufferLayout;
        var buffer = layout.buffer;
        var stride = layout.layout.stride;
        var byteOffset = index * stride;

        if (!out)
        {
            out = this.nextMemberU32;
        }

        var viewU32 = buffer.viewU32;
        var bytesPerElement = viewU32.BYTES_PER_ELEMENT;

        out.set(viewU32.subarray(byteOffset / bytesPerElement, byteOffset / bytesPerElement + stride / bytesPerElement));

        return out;
    },

    /**
     * Removes a member or a number of members from the SpriteGPULayer.
     * This will update the GPU buffer.
     * This is an expensive operation, as it requires the whole buffer to be updated.
     *
     * The buffer is not resized.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#removeMembers
     * @since 4.0.0
     * @param {number} index - The index of the member to remove.
     * @param {number} [count=1] - The number of members to remove, default 1.
     * @returns {this} This SpriteGPULayer object.
     */
    removeMembers: function (index, count)
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
        var stride = layout.layout.stride;
        var byteOffset = index * stride;
        var byteLength = count * stride;

        var u8 = layout.buffer.viewU8;
        u8.set(u8.subarray(byteOffset + byteLength), byteOffset);

        // Mark segments for update.
        for (var i = index; i < this.memberCount; i += this.bufferUpdateSegmentSize)
        {
            this.setSegmentNeedsUpdate(i);
        }

        // Update layer properties.
        this.memberCount -= count;

        return this;
    },

    /**
     * Sets the values of an animation for a member of this SpriteGPULayer.
     * The values are set on `nextMember`, used to add data.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#_setAnimatedValue
     * @since 4.0.0
     * @private
     * @param {undefined|number|Phaser.Types.GameObjects.SpriteGPULayer.MemberAnimation} value - The value to set.
     * @param {number} index - The offset in `nextMember` to write to.
     * @param {number} [defaultValue=0] - A default value to use if `value` is undefined.
     */
    _setAnimatedValue: function (value, index, defaultValue)
    {
        var f32 = this.nextMemberF32;

        if (defaultValue === undefined)
        {
            defaultValue = 0;
        }

        if (typeof value === 'number')
        {
            f32[index++] = value;
            f32[index++] = 0;
            f32[index++] = 0;
            f32[index] = 0;
        }
        else if (value === undefined)
        {
            f32[index++] = defaultValue;
            f32[index++] = 0;
            f32[index++] = 0;
            f32[index] = 0;
        }
        else
        {
            var base = value.base || 0;
            var ease = value.ease || 0;
            var amplitude = value.amplitude || 0;
            var duration = Math.abs(value.duration || 0);
            var delay = value.delay || 0;
            var yoyo = value.yoyo !== undefined ? value.yoyo : true;

            if (typeof ease === 'string')
            {
                ease = this.EASE[ease] || 0;
            }

            // Enable the chosen animation type.
            var easeString = this.EASE_CODES[ease];
            if (!this._animationsEnabled[easeString])
            {
                this.setAnimationEnabled(easeString, true);
            }

            if (ease === EasingEncoding.Gravity)
            {
                var velocity = value.velocity || 0;
                var gravityFactor = value.gravityFactor || 1;

                if (gravityFactor >= 1)
                {
                    gravityFactor = 0;
                }
                else if (gravityFactor < 0)
                {
                    gravityFactor = 0;
                }

                // Encode values into amplitude.
                amplitude = Math.floor(velocity) + gravityFactor;
            }

            // Normalize delay.
            // We double the range of the delay to allow for yoyo.
            if (duration > 0)
            {
                delay = (delay / duration) % 2;
            }
            else
            {
                delay = 0;
            }
            if (delay < 0)
            {
                delay += 2;
            }
            delay /= 2;

            // Add an integer to encode the type.
            delay += ease;

            // Encode yoyo in the sign of duration, which must be positive.
            if (yoyo)
            {
                duration = -duration;
            }

            f32[index++] = base;
            f32[index++] = amplitude;
            f32[index++] = duration;
            f32[index] = delay;
        }
    },

    /**
     * Return the values of an animation for a member of this SpriteGPULayer
     * in the buffer.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#_getAnimatedValue
     * @since 4.0.0
     * @private
     * @param {number} index - The index where the animation begins in the buffer.
     * @returns {number|Phaser.Types.GameObjects.SpriteGPULayer.MemberAnimation} The animation values.
     */
    _getAnimatedValue: function (index)
    {
        var f32 = this.submitterNode.instanceBufferLayout.buffer.viewF32;

        var base = f32[index++];
        var amplitude = f32[index++];
        var duration = f32[index++];
        var delay = f32[index];
        var ease = Math.floor(delay);

        if (amplitude === 0 || duration === 0 || ease === 0)
        {
            return base;
        }

        var yoyo = duration < 0;
        if (yoyo)
        {
            duration = -duration;
        }

        // Negate ease after duration, so duration has the correct sign.
        delay -= ease;
        delay = (delay * duration * 2) % duration;

        // Check for Gravity mode.
        if (ease === EasingEncoding.Gravity)
        {
            var velocity = Math.floor(amplitude);
            var gravityFactor = amplitude - velocity;
            if (gravityFactor === 0)
            {
                gravityFactor = 1;
            }
            return {
                base: base,
                ease: ease,
                duration: duration,
                delay: delay,
                yoyo: yoyo,
                velocity: velocity,
                gravityFactor: gravityFactor
            };
        }

        return {
            base: base,
            ease: ease,
            amplitude: amplitude,
            duration: duration,
            delay: delay,
            yoyo: yoyo
        };
    },

    /**
     * Set the enabled state of an animation.
     * This will enable or disable the animation in the shader program.
     * This method is called automatically when animations are added,
     * so you should not need to call it manually.
     *
     * Every enabled animation has a cost in the shader program.
     * In particular, low-end devices may be unable to compile a large number
     * of animations, so be careful when enabling many animations.
     *
     * Note that animations are not disabled automatically,
     * even if they are not used by any members.
     * There are probably too many members for this to be efficient.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#setAnimationEnabled
     * @since 4.0.0
     * @param {string} name - The name of the animation to enable or disable.
     * @param {boolean} enabled - Whether to enable or disable the animation.
     * @returns {this} This SpriteGPULayer object
     */
    setAnimationEnabled: function (name, enabled)
    {
        this._animationsEnabled[name] = !!enabled;

        return this;
    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.SpriteGPULayer#preDestroy
     * @protected
     * @since 4.0.0
     */
    preDestroy: function ()
    {
        this.frameDataTexture.destroy();

        // TODO: Destroy the Submitter RenderNode.
    }
});

module.exports = SpriteGPULayer;
