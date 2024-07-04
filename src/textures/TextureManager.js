/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CanvasPool = require('../display/canvas/CanvasPool');
var CanvasTexture = require('./CanvasTexture');
var Class = require('../utils/Class');
var Color = require('../display/color/Color');
var CONST = require('../const');
var DynamicTexture = require('./DynamicTexture');
var EventEmitter = require('eventemitter3');
var Events = require('./events');
var Frame = require('./Frame');
var GameEvents = require('../core/events');
var GenerateTexture = require('../create/GenerateTexture');
var GetValue = require('../utils/object/GetValue');
var ImageGameObject = require('../gameobjects/image/Image');
var IsPlainObject = require('../utils/object/IsPlainObject');
var Parser = require('./parsers');
var Rectangle = require('../geom/rectangle/Rectangle');
var Texture = require('./Texture');

/**
 * @callback EachTextureCallback
 *
 * @param {Phaser.Textures.Texture} texture - Each texture in Texture Manager.
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
 */

/**
 * @classdesc
 * When Phaser boots it will create an instance of this Texture Manager class.
 *
 * It is a global manager that handles all textures in your game. You can access it from within
 * a Scene via the `this.textures` property.
 *
 * Its role is as a manager for all textures that your game uses. It can create, update and remove
 * textures globally, as well as parse texture data from external files, such as sprite sheets
 * and texture atlases.
 *
 * Sprites and other texture-based Game Objects get their texture data directly from this class.
 *
 * @class TextureManager
 * @extends Phaser.Events.EventEmitter
 * @memberof Phaser.Textures
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Phaser.Game instance this Texture Manager belongs to.
 */
var TextureManager = new Class({

    Extends: EventEmitter,

    initialize:

    function TextureManager (game)
    {
        EventEmitter.call(this);

        /**
         * The Game that the Texture Manager belongs to.
         *
         * A game will only ever have one instance of a Texture Manager.
         *
         * @name Phaser.Textures.TextureManager#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = game;

        /**
         * The internal name of this manager.
         *
         * @name Phaser.Textures.TextureManager#name
         * @type {string}
         * @readonly
         * @since 3.0.0
         */
        this.name = 'TextureManager';

        /**
         * This object contains all Textures that belong to this Texture Manager.
         *
         * Textures are identified by string-based keys, which are used as the property
         * within this object. Therefore, you can access any texture directly from this
         * object without any iteration.
         *
         * You should not typically modify this object directly, but instead use the
         * methods provided by the Texture Manager to add and remove entries from it.
         *
         * @name Phaser.Textures.TextureManager#list
         * @type {object}
         * @default {}
         * @since 3.0.0
         */
        this.list = {};

        /**
         * The temporary canvas element used to save the pixel data of an arbitrary texture
         * during the `TextureManager.getPixel` and `getPixelAlpha` methods.
         *
         * @name Phaser.Textures.TextureManager#_tempCanvas
         * @type {HTMLCanvasElement}
         * @private
         * @since 3.0.0
         */
        this._tempCanvas = CanvasPool.create2D(this);

        /**
         * The 2d context of the `_tempCanvas` element.
         *
         * @name Phaser.Textures.TextureManager#_tempContext
         * @type {CanvasRenderingContext2D}
         * @private
         * @since 3.0.0
         */
        this._tempContext = this._tempCanvas.getContext('2d', { willReadFrequently: true });

        /**
         * An internal tracking value used for emitting the 'READY' event after all of
         * the managers in the game have booted.
         *
         * @name Phaser.Textures.TextureManager#_pending
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._pending = 0;

        /**
         * An Image Game Object that belongs to this Texture Manager.
         *
         * Used as a drawing stamp within Dynamic Textures.
         *
         * This is not part of the display list and doesn't render.
         *
         * @name Phaser.Textures.TextureManager#stamp
         * @type {Phaser.GameObjects.Image}
         * @readonly
         * @since 3.60.0
         */
        this.stamp;

        /**
         * The crop Rectangle as used by the Stamp when it needs to crop itself.
         *
         * @name Phaser.Textures.TextureManager#stampCrop
         * @type {Phaser.Geom.Rectangle}
         * @since 3.60.0
         */
        this.stampCrop = new Rectangle();

        /**
         * If this flag is `true` then the Texture Manager will never emit any
         * warnings to the console log that report missing textures.
         *
         * @name Phaser.Textures.TextureManager#silentWarnings
         * @type {boolean}
         * @default false
         * @since 3.60.0
         */
        this.silentWarnings = false;

        game.events.once(GameEvents.BOOT, this.boot, this);
    },

    /**
     * The Boot Handler called by Phaser.Game when it first starts up.
     *
     * @method Phaser.Textures.TextureManager#boot
     * @private
     * @since 3.0.0
     */
    boot: function ()
    {
        this._pending = 3;

        this.on(Events.LOAD, this.updatePending, this);
        this.on(Events.ERROR, this.updatePending, this);

        var config = this.game.config;

        if (config.defaultImage !== null)
        {
            this.addBase64('__DEFAULT', config.defaultImage);
        }

        if (config.missingImage !== null)
        {
            this.addBase64('__MISSING', config.missingImage);
        }
        
        if (config.whiteImage !== null)
        {
            this.addBase64('__WHITE', config.whiteImage);
        }

        if (this.game.renderer && this.game.renderer.gl)
        {
            this.addUint8Array('__NORMAL', new Uint8Array([ 127, 127, 255, 255 ]), 1, 1);
        }

        this.game.events.once(GameEvents.DESTROY, this.destroy, this);

        this.game.events.once(GameEvents.SYSTEM_READY, function (scene)
        {
            this.stamp = new ImageGameObject(scene).setOrigin(0);

        }, this);
    },

    /**
     * After 'onload' or 'onerror' invoked twice, emit 'ready' event.
     *
     * @method Phaser.Textures.TextureManager#updatePending
     * @private
     * @since 3.0.0
     */
    updatePending: function ()
    {
        this._pending--;

        if (this._pending === 0)
        {
            this.off(Events.LOAD);
            this.off(Events.ERROR);

            this.emit(Events.READY);
        }
    },

    /**
     * Checks the given texture key and throws a console.warn if the key is already in use, then returns false.
     *
     * If you wish to avoid the console.warn then use `TextureManager.exists` instead.
     *
     * @method Phaser.Textures.TextureManager#checkKey
     * @since 3.7.0
     *
     * @param {string} key - The texture key to check.
     *
     * @return {boolean} `true` if it's safe to use the texture key, otherwise `false`.
     */
    checkKey: function (key)
    {
        if (!key || typeof key !== 'string' || this.exists(key))
        {
            if (!this.silentWarnings)
            {
                // eslint-disable-next-line no-console
                console.error('Texture key already in use: ' + key);
            }

            return false;
        }

        return true;
    },

    /**
     * Removes a Texture from the Texture Manager and destroys it. This will immediately
     * clear all references to it from the Texture Manager, and if it has one, destroy its
     * WebGLTexture. This will emit a `removetexture` event.
     *
     * Note: If you have any Game Objects still using this texture they will start throwing
     * errors the next time they try to render. Make sure that removing the texture is the final
     * step when clearing down to avoid this.
     *
     * @method Phaser.Textures.TextureManager#remove
     * @fires Phaser.Textures.Events#REMOVE
     * @since 3.7.0
     *
     * @param {(string|Phaser.Textures.Texture)} key - The key of the Texture to remove, or a reference to it.
     *
     * @return {Phaser.Textures.TextureManager} The Texture Manager.
     */
    remove: function (key)
    {
        if (typeof key === 'string')
        {
            if (this.exists(key))
            {
                key = this.get(key);
            }
            else
            {
                if (!this.silentWarnings)
                {
                    console.warn('No texture found matching key: ' + key);
                }

                return this;
            }
        }

        //  By this point key should be a Texture, if not, the following fails anyway
        var textureKey = key.key;

        if (this.list.hasOwnProperty(textureKey))
        {
            key.destroy();

            this.emit(Events.REMOVE, textureKey);
            this.emit(Events.REMOVE_KEY + textureKey);
        }

        return this;
    },

    /**
     * Removes a key from the Texture Manager but does not destroy the Texture that was using the key.
     *
     * @method Phaser.Textures.TextureManager#removeKey
     * @since 3.17.0
     *
     * @param {string} key - The key to remove from the texture list.
     *
     * @return {Phaser.Textures.TextureManager} The Texture Manager.
     */
    removeKey: function (key)
    {
        if (this.list.hasOwnProperty(key))
        {
            delete this.list[key];
        }

        return this;
    },

    /**
     * Adds a new Texture to the Texture Manager created from the given Base64 encoded data.
     *
     * It works by creating an `Image` DOM object, then setting the `src` attribute to
     * the given base64 encoded data. As a result, the process is asynchronous by its nature,
     * so be sure to listen for the events this method dispatches before using the texture.
     *
     * @method Phaser.Textures.TextureManager#addBase64
     * @fires Phaser.Textures.Events#ADD
     * @fires Phaser.Textures.Events#ERROR
     * @fires Phaser.Textures.Events#LOAD
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {*} data - The Base64 encoded data.
     *
     * @return {this} This Texture Manager instance.
     */
    addBase64: function (key, data)
    {
        if (this.checkKey(key))
        {
            var _this = this;

            var image = new Image();

            image.onerror = function ()
            {
                _this.emit(Events.ERROR, key);
            };

            image.onload = function ()
            {
                var texture = _this.create(key, image);

                Parser.Image(texture, 0);

                _this.emit(Events.ADD, key, texture);
                _this.emit(Events.ADD_KEY + key, texture);
                _this.emit(Events.LOAD, key, texture);
            };

            image.src = data;
        }

        return this;
    },

    /**
     * Gets an existing texture frame and converts it into a base64 encoded image and returns the base64 data.
     *
     * You can also provide the image type and encoder options.
     *
     * This will only work with bitmap based texture frames, such as those created from Texture Atlases.
     * It will not work with GL Texture objects, such as Shaders, or Render Textures. For those please
     * see the WebGL Snapshot function instead.
     *
     * @method Phaser.Textures.TextureManager#getBase64
     * @since 3.12.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(string|number)} [frame] - The string-based name, or integer based index, of the Frame to get from the Texture.
     * @param {string} [type='image/png'] - A DOMString indicating the image format. The default format type is image/png.
     * @param {number} [encoderOptions=0.92] - A Number between 0 and 1 indicating the image quality to use for image formats that use lossy compression such as image/jpeg and image/webp. If this argument is anything else, the default value for image quality is used. The default value is 0.92. Other arguments are ignored.
     *
     * @return {string} The base64 encoded data, or an empty string if the texture frame could not be found.
     */
    getBase64: function (key, frame, type, encoderOptions)
    {
        if (type === undefined) { type = 'image/png'; }
        if (encoderOptions === undefined) { encoderOptions = 0.92; }

        var data = '';

        var textureFrame = this.getFrame(key, frame);

        if (textureFrame && (textureFrame.source.isRenderTexture || textureFrame.source.isGLTexture))
        {
            if (!this.silentWarnings)
            {
                console.warn('Cannot getBase64 from WebGL Texture');
            }
        }
        else if (textureFrame)
        {
            var cd = textureFrame.canvasData;

            var canvas = CanvasPool.create2D(this, cd.width, cd.height);
            var ctx = canvas.getContext('2d', { willReadFrequently: true });

            if (cd.width > 0 && cd.height > 0)
            {
                ctx.drawImage(
                    textureFrame.source.image,
                    cd.x,
                    cd.y,
                    cd.width,
                    cd.height,
                    0,
                    0,
                    cd.width,
                    cd.height
                );
            }

            data = canvas.toDataURL(type, encoderOptions);

            CanvasPool.remove(canvas);
        }

        return data;
    },

    /**
     * Adds a new Texture to the Texture Manager created from the given Image element.
     *
     * @method Phaser.Textures.TextureManager#addImage
     * @fires Phaser.Textures.Events#ADD
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {HTMLImageElement} source - The source Image element.
     * @param {HTMLImageElement|HTMLCanvasElement} [dataSource] - An optional data Image element.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    addImage: function (key, source, dataSource)
    {
        var texture = null;

        if (this.checkKey(key))
        {
            texture = this.create(key, source);

            Parser.Image(texture, 0);

            if (dataSource)
            {
                texture.setDataSource(dataSource);
            }

            this.emit(Events.ADD, key, texture);
            this.emit(Events.ADD_KEY + key, texture);
        }

        return texture;
    },

    /**
     * Takes a WebGLTextureWrapper and creates a Phaser Texture from it, which is added to the Texture Manager using the given key.
     *
     * This allows you to then use the Texture as a normal texture for texture based Game Objects like Sprites.
     *
     * This is a WebGL only feature.
     *
     * Prior to Phaser 3.80.0, this method took a bare `WebGLTexture`
     * as the `glTexture` parameter. You must now wrap the `WebGLTexture` in a
     * `WebGLTextureWrapper` instance before passing it to this method.
     *
     * @method Phaser.Textures.TextureManager#addGLTexture
     * @fires Phaser.Textures.Events#ADD
     * @since 3.19.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} glTexture - The source Render Texture.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    addGLTexture: function (key, glTexture)
    {
        var texture = null;

        if (this.checkKey(key))
        {
            var width = glTexture.width;
            var height = glTexture.height;

            texture = this.create(key, glTexture, width, height);

            texture.add('__BASE', 0, 0, 0, width, height);

            this.emit(Events.ADD, key, texture);
            this.emit(Events.ADD_KEY + key, texture);
        }

        return texture;
    },

    /**
     * Adds a Compressed Texture to this Texture Manager.
     *
     * The texture should typically have been loaded via the `CompressedTextureFile` loader,
     * in order to prepare the correct data object this method requires.
     *
     * You can optionally also pass atlas data to this method, in which case a texture atlas
     * will be generated from the given compressed texture, combined with the atlas data.
     *
     * @method Phaser.Textures.TextureManager#addCompressedTexture
     * @fires Phaser.Textures.Events#ADD
     * @since 3.60.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {Phaser.Types.Textures.CompressedTextureData} textureData - The Compressed Texture data object.
     * @param {object} [atlasData] - Optional Texture Atlas data.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    addCompressedTexture: function (key, textureData, atlasData)
    {
        var texture = null;

        if (this.checkKey(key))
        {
            texture = this.create(key, textureData);

            texture.add('__BASE', 0, 0, 0, textureData.width, textureData.height);

            if (atlasData)
            {
                var parse = function (texture, sourceIndex, atlasData)
                {
                    if (Array.isArray(atlasData.textures) || Array.isArray(atlasData.frames))
                    {
                        Parser.JSONArray(texture, sourceIndex, atlasData);
                    }
                    else
                    {
                        Parser.JSONHash(texture, sourceIndex, atlasData);
                    }
                };
                if (Array.isArray(atlasData))
                {
                    for (var i = 0; i < atlasData.length; i++)
                    {
                        parse(texture, i, atlasData[i]);
                    }
                }
                else
                {
                    parse(texture, 0, atlasData);
                }
            }

            this.emit(Events.ADD, key, texture);
            this.emit(Events.ADD_KEY + key, texture);
        }

        return texture;
    },

    /**
     * Adds a Render Texture to the Texture Manager using the given key.
     * This allows you to then use the Render Texture as a normal texture for texture based Game Objects like Sprites.
     *
     * @method Phaser.Textures.TextureManager#addRenderTexture
     * @fires Phaser.Textures.Events#ADD
     * @since 3.12.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {Phaser.GameObjects.RenderTexture} renderTexture - The source Render Texture.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    addRenderTexture: function (key, renderTexture)
    {
        var texture = null;

        if (this.checkKey(key))
        {
            texture = this.create(key, renderTexture);

            texture.add('__BASE', 0, 0, 0, renderTexture.width, renderTexture.height);

            this.emit(Events.ADD, key, texture);
            this.emit(Events.ADD_KEY + key, texture);
        }

        return texture;
    },

    /**
     * Creates a new Texture using the given config values.
     *
     * Generated textures consist of a Canvas element to which the texture data is drawn.
     *
     * Generates a texture based on the given Create configuration object.
     *
     * The texture is drawn using a fixed-size indexed palette of 16 colors, where the hex value in the
     * data cells map to a single color. For example, if the texture config looked like this:
     *
     * ```javascript
     * var star = [
     *   '.....828.....',
     *   '....72227....',
     *   '....82228....',
     *   '...7222227...',
     *   '2222222222222',
     *   '8222222222228',
     *   '.72222222227.',
     *   '..787777787..',
     *   '..877777778..',
     *   '.78778887787.',
     *   '.27887.78872.',
     *   '.787.....787.'
     * ];
     *
     * this.textures.generate('star', { data: star, pixelWidth: 4 });
     * ```
     *
     * Then it would generate a texture that is 52 x 48 pixels in size, because each cell of the data array
     * represents 1 pixel multiplied by the `pixelWidth` value. The cell values, such as `8`, maps to color
     * number 8 in the palette. If a cell contains a period character `.` then it is transparent.
     *
     * The default palette is Arne16, but you can specify your own using the `palette` property.
     *
     * @method Phaser.Textures.TextureManager#generate
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {Phaser.Types.Create.GenerateTextureConfig} config - The configuration object needed to generate the texture.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    generate: function (key, config)
    {
        if (this.checkKey(key))
        {
            var canvas = CanvasPool.create(this, 1, 1);

            config.canvas = canvas;

            GenerateTexture(config);

            return this.addCanvas(key, canvas);
        }
        else
        {
            return null;
        }
    },

    /**
     * Creates a new Texture using a blank Canvas element of the size given.
     *
     * Canvas elements are automatically pooled and calling this method will
     * extract a free canvas from the CanvasPool, or create one if none are available.
     *
     * @method Phaser.Textures.TextureManager#createCanvas
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {number} [width=256] - The width of the Canvas element.
     * @param {number} [height=256] - The height of the Canvas element.
     *
     * @return {?Phaser.Textures.CanvasTexture} The Canvas Texture that was created, or `null` if the key is already in use.
     */
    createCanvas: function (key, width, height)
    {
        if (width === undefined) { width = 256; }
        if (height === undefined) { height = 256; }

        if (this.checkKey(key))
        {
            var canvas = CanvasPool.create(this, width, height, CONST.CANVAS, true);

            return this.addCanvas(key, canvas);
        }

        return null;
    },

    /**
     * Creates a new Canvas Texture object from an existing Canvas element
     * and adds it to this Texture Manager, unless `skipCache` is true.
     *
     * @method Phaser.Textures.TextureManager#addCanvas
     * @fires Phaser.Textures.Events#ADD
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {HTMLCanvasElement} source - The Canvas element to form the base of the new Texture.
     * @param {boolean} [skipCache=false] - Skip adding this Texture into the Cache?
     *
     * @return {?Phaser.Textures.CanvasTexture} The Canvas Texture that was created, or `null` if the key is already in use.
     */
    addCanvas: function (key, source, skipCache)
    {
        if (skipCache === undefined) { skipCache = false; }

        var texture = null;

        if (skipCache)
        {
            texture = new CanvasTexture(this, key, source, source.width, source.height);
        }
        else if (this.checkKey(key))
        {
            texture = new CanvasTexture(this, key, source, source.width, source.height);

            this.list[key] = texture;

            this.emit(Events.ADD, key, texture);
            this.emit(Events.ADD_KEY + key, texture);
        }

        return texture;
    },

    /**
     * Creates a Dynamic Texture instance and adds itself to this Texture Manager.
     *
     * A Dynamic Texture is a special texture that allows you to draw textures, frames and most kind of
     * Game Objects directly to it.
     *
     * You can take many complex objects and draw them to this one texture, which can then be used as the
     * base texture for other Game Objects, such as Sprites. Should you then update this texture, all
     * Game Objects using it will instantly be updated as well, reflecting the changes immediately.
     *
     * It's a powerful way to generate dynamic textures at run-time that are WebGL friendly and don't invoke
     * expensive GPU uploads on each change.
     *
     * See the methods available on the `DynamicTexture` class for more details.
     *
     * Optionally, you can also pass a Dynamic Texture instance to this method to have
     * it added to the Texture Manager.
     *
     * @method Phaser.Textures.TextureManager#addDynamicTexture
     * @fires Phaser.Textures.Events#ADD
     * @since 3.60.0
     *
     * @param {(string|Phaser.Textures.DynamicTexture)} key - The string-based key of this Texture. Must be unique within the Texture Manager. Or, a DynamicTexture instance.
     * @param {number} [width=256] - The width of this Dynamic Texture in pixels. Defaults to 256 x 256. Ignored if an instance is passed as the key.
     * @param {number} [height=256] - The height of this Dynamic Texture in pixels. Defaults to 256 x 256. Ignored if an instance is passed as the key.
     *
     * @return {?Phaser.Textures.DynamicTexture} The Dynamic Texture that was created, or `null` if the key is already in use.
     */
    addDynamicTexture: function (key, width, height)
    {
        var texture = null;

        if (typeof(key) === 'string' && !this.exists(key))
        {
            texture = new DynamicTexture(this, key, width, height);
        }
        else
        {
            texture = key;
            key = texture.key;
        }

        if (this.checkKey(key))
        {
            this.list[key] = texture;

            this.emit(Events.ADD, key, texture);
            this.emit(Events.ADD_KEY + key, texture);
        }
        else
        {
            texture = null;
        }

        return texture;
    },

    /**
     * Adds a Texture Atlas to this Texture Manager.
     *
     * In Phaser terminology, a Texture Atlas is a combination of an atlas image and a JSON data file,
     * such as those exported by applications like Texture Packer.
     *
     * It can accept either JSON Array or JSON Hash formats, as exported by Texture Packer and similar software.
     *
     * As of Phaser 3.60 you can use this method to add a atlas data to an existing Phaser Texture.
     *
     * @method Phaser.Textures.TextureManager#addAtlas
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(HTMLImageElement|HTMLImageElement[]|Phaser.Textures.Texture)} source - The source Image element/s, or a Phaser Texture.
     * @param {(object|object[])} data - The Texture Atlas data/s.
     * @param {HTMLImageElement|HTMLCanvasElement|HTMLImageElement[]|HTMLCanvasElement[]} [dataSource] - An optional data Image element.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    addAtlas: function (key, source, data, dataSource)
    {
        //  New Texture Packer format?
        if (Array.isArray(data.textures) || Array.isArray(data.frames))
        {
            return this.addAtlasJSONArray(key, source, data, dataSource);
        }
        else
        {
            return this.addAtlasJSONHash(key, source, data, dataSource);
        }
    },

    /**
     * Adds a Texture Atlas to this Texture Manager.
     *
     * In Phaser terminology, a Texture Atlas is a combination of an atlas image and a JSON data file,
     * such as those exported by applications like Texture Packer.
     *
     * The frame data of the atlas must be stored in an Array within the JSON.
     *
     * This is known as a JSON Array in software such as Texture Packer.
     *
     * As of Phaser 3.60 you can use this method to add a atlas data to an existing Phaser Texture.
     *
     * @method Phaser.Textures.TextureManager#addAtlasJSONArray
     * @fires Phaser.Textures.Events#ADD
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(HTMLImageElement|HTMLImageElement[]|Phaser.Textures.Texture)} source - The source Image element/s, or a Phaser Texture.
     * @param {(object|object[])} data - The Texture Atlas data/s.
     * @param {HTMLImageElement|HTMLCanvasElement|HTMLImageElement[]|HTMLCanvasElement[]} [dataSource] - An optional data Image element.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    addAtlasJSONArray: function (key, source, data, dataSource)
    {
        var texture = null;

        if (source instanceof Texture)
        {
            key = source.key;
            texture = source;
        }
        else if (this.checkKey(key))
        {
            texture = this.create(key, source);
        }

        if (texture)
        {
            //  Multi-Atlas?
            if (Array.isArray(data))
            {
                var singleAtlasFile = (data.length === 1); // multi-pack with one atlas file for all images

                //  !! Assumes the textures are in the same order in the source array as in the json data !!
                for (var i = 0; i < texture.source.length; i++)
                {
                    var atlasData = singleAtlasFile ? data[0] : data[i];

                    Parser.JSONArray(texture, i, atlasData);
                }
            }
            else
            {
                Parser.JSONArray(texture, 0, data);
            }

            if (dataSource)
            {
                texture.setDataSource(dataSource);
            }

            this.emit(Events.ADD, key, texture);
            this.emit(Events.ADD_KEY + key, texture);
        }

        return texture;
    },

    /**
     * Adds a Texture Atlas to this Texture Manager.
     *
     * In Phaser terminology, a Texture Atlas is a combination of an atlas image and a JSON data file,
     * such as those exported by applications like Texture Packer.
     *
     * The frame data of the atlas must be stored in an Object within the JSON.
     *
     * This is known as a JSON Hash in software such as Texture Packer.
     *
     * As of Phaser 3.60 you can use this method to add a atlas data to an existing Phaser Texture.
     *
     * @method Phaser.Textures.TextureManager#addAtlasJSONHash
     * @fires Phaser.Textures.Events#ADD
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(HTMLImageElement|HTMLImageElement[]|Phaser.Textures.Texture)} source - The source Image element/s, or a Phaser Texture.
     * @param {(object|object[])} data - The Texture Atlas data/s.
     * @param {HTMLImageElement|HTMLCanvasElement|HTMLImageElement[]|HTMLCanvasElement[]} [dataSource] - An optional data Image element.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    addAtlasJSONHash: function (key, source, data, dataSource)
    {
        var texture = null;

        if (source instanceof Texture)
        {
            key = source.key;
            texture = source;
        }
        else if (this.checkKey(key))
        {
            texture = this.create(key, source);
        }

        if (texture)
        {
            if (Array.isArray(data))
            {
                for (var i = 0; i < data.length; i++)
                {
                    Parser.JSONHash(texture, i, data[i]);
                }
            }
            else
            {
                Parser.JSONHash(texture, 0, data);
            }

            if (dataSource)
            {
                texture.setDataSource(dataSource);
            }

            this.emit(Events.ADD, key, texture);
            this.emit(Events.ADD_KEY + key, texture);
        }

        return texture;
    },

    /**
     * Adds a Texture Atlas to this Texture Manager.
     *
     * In Phaser terminology, a Texture Atlas is a combination of an atlas image and a data file,
     * such as those exported by applications like Texture Packer.
     *
     * The frame data of the atlas must be stored in an XML file.
     *
     * As of Phaser 3.60 you can use this method to add a atlas data to an existing Phaser Texture.
     *
     * @method Phaser.Textures.TextureManager#addAtlasXML
     * @fires Phaser.Textures.Events#ADD
     * @since 3.7.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(HTMLImageElement|Phaser.Textures.Texture)} source - The source Image element, or a Phaser Texture.
     * @param {object} data - The Texture Atlas XML data.
     * @param {HTMLImageElement|HTMLCanvasElement|HTMLImageElement[]|HTMLCanvasElement[]} [dataSource] - An optional data Image element.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    addAtlasXML: function (key, source, data, dataSource)
    {
        var texture = null;

        if (source instanceof Texture)
        {
            key = source.key;
            texture = source;
        }
        else if (this.checkKey(key))
        {
            texture = this.create(key, source);
        }

        if (texture)
        {
            Parser.AtlasXML(texture, 0, data);

            if (dataSource)
            {
                texture.setDataSource(dataSource);
            }

            this.emit(Events.ADD, key, texture);
            this.emit(Events.ADD_KEY + key, texture);
        }

        return texture;
    },

    /**
     * Adds a Unity Texture Atlas to this Texture Manager.
     *
     * In Phaser terminology, a Texture Atlas is a combination of an atlas image and a data file,
     * such as those exported by applications like Texture Packer or Unity.
     *
     * The frame data of the atlas must be stored in a Unity YAML file.
     *
     * As of Phaser 3.60 you can use this method to add a atlas data to an existing Phaser Texture.
     *
     * @method Phaser.Textures.TextureManager#addUnityAtlas
     * @fires Phaser.Textures.Events#ADD
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {HTMLImageElement} source - The source Image element.
     * @param {object} data - The Texture Atlas data.
     * @param {HTMLImageElement|HTMLCanvasElement|HTMLImageElement[]|HTMLCanvasElement[]} [dataSource] - An optional data Image element.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    addUnityAtlas: function (key, source, data, dataSource)
    {
        var texture = null;

        if (source instanceof Texture)
        {
            key = source.key;
            texture = source;
        }
        else if (this.checkKey(key))
        {
            texture = this.create(key, source);
        }

        if (texture)
        {
            Parser.UnityYAML(texture, 0, data);

            if (dataSource)
            {
                texture.setDataSource(dataSource);
            }

            this.emit(Events.ADD, key, texture);
            this.emit(Events.ADD_KEY + key, texture);
        }

        return texture;
    },

    /**
     * Adds a Sprite Sheet to this Texture Manager.
     *
     * In Phaser terminology a Sprite Sheet is a texture containing different frames, but each frame is the exact
     * same size and cannot be trimmed or rotated. This is different to a Texture Atlas, created by tools such as
     * Texture Packer, and more akin with the fixed-frame exports you get from apps like Aseprite or old arcade
     * games.
     *
     * As of Phaser 3.60 you can use this method to add a sprite sheet to an existing Phaser Texture.
     *
     * @method Phaser.Textures.TextureManager#addSpriteSheet
     * @fires Phaser.Textures.Events#ADD
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture. Give an empty string if you provide a Phaser Texture as the 2nd argument.
     * @param {(HTMLImageElement|Phaser.Textures.Texture)} source - The source Image element, or a Phaser Texture.
     * @param {Phaser.Types.Textures.SpriteSheetConfig} config - The configuration object for this Sprite Sheet.
     * @param {HTMLImageElement|HTMLCanvasElement} [dataSource] - An optional data Image element.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created or updated, or `null` if the key is already in use.
     */
    addSpriteSheet: function (key, source, config, dataSource)
    {
        var texture = null;

        if (source instanceof Texture)
        {
            key = source.key;
            texture = source;
        }
        else if (this.checkKey(key))
        {
            texture = this.create(key, source);
        }

        if (texture)
        {
            var width = texture.source[0].width;
            var height = texture.source[0].height;

            Parser.SpriteSheet(texture, 0, 0, 0, width, height, config);

            if (dataSource)
            {
                texture.setDataSource(dataSource);
            }

            this.emit(Events.ADD, key, texture);
            this.emit(Events.ADD_KEY + key, texture);
        }

        return texture;
    },

    /**
     * Adds a Sprite Sheet to this Texture Manager, where the Sprite Sheet exists as a Frame within a Texture Atlas.
     *
     * In Phaser terminology a Sprite Sheet is a texture containing different frames, but each frame is the exact
     * same size and cannot be trimmed or rotated.
     *
     * @method Phaser.Textures.TextureManager#addSpriteSheetFromAtlas
     * @fires Phaser.Textures.Events#ADD
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {Phaser.Types.Textures.SpriteSheetFromAtlasConfig} config - The configuration object for this Sprite Sheet.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    addSpriteSheetFromAtlas: function (key, config)
    {
        if (!this.checkKey(key))
        {
            return null;
        }

        var atlasKey = GetValue(config, 'atlas', null);
        var atlasFrame = GetValue(config, 'frame', null);

        if (!atlasKey || !atlasFrame)
        {
            return;
        }

        var atlas = this.get(atlasKey);
        var sheet = atlas.get(atlasFrame);

        if (sheet)
        {
            var source = sheet.source.image;
            if (!source)
            {
                source = sheet.source.glTexture;
            }
            var texture = this.create(key, source);

            if (sheet.trimmed)
            {
                //  If trimmed we need to help the parser adjust
                Parser.SpriteSheetFromAtlas(texture, sheet, config);
            }
            else
            {
                Parser.SpriteSheet(texture, 0, sheet.cutX, sheet.cutY, sheet.cutWidth, sheet.cutHeight, config);
            }

            this.emit(Events.ADD, key, texture);
            this.emit(Events.ADD_KEY + key, texture);

            return texture;
        }
    },

    /**
     * Creates a texture from an array of colour data.
     *
     * This is only available in WebGL mode.
     *
     * If the dimensions provided are powers of two, the resulting texture
     * will be automatically set to wrap by the WebGL Renderer.
     *
     * @method Phaser.Textures.TextureManager#addUint8Array
     * @fires Phaser.Textures.Events#ADD
     * @since 3.80.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {Uint8Array} data - The color data for the texture.
     * @param {number} width - The width of the texture.
     * @param {number} height - The height of the texture.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    addUint8Array: function (key, data, width, height)
    {
        if (
            !this.checkKey(key) ||
            data.length / 4 !== width * height
        )
        {
            return null;
        }

        var texture = this.create(key, data, width, height);

        texture.add('__BASE', 0, 0, 0, width, height);

        this.emit(Events.ADD, key, texture);
        this.emit(Events.ADD_KEY + key, texture);

        return texture;
    },

    /**
     * Creates a new Texture using the given source and dimensions.
     *
     * @method Phaser.Textures.TextureManager#create
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(HTMLImageElement|HTMLCanvasElement|HTMLImageElement[]|HTMLCanvasElement[]|Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper)} source - An array of sources that are used to create the texture. Usually Images, but can also be a Canvas.
     * @param {number} [width] - The width of the Texture. This is optional and automatically derived from the source images.
     * @param {number} [height] - The height of the Texture. This is optional and automatically derived from the source images.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    create: function (key, source, width, height)
    {
        var texture = null;

        if (this.checkKey(key))
        {
            texture = new Texture(this, key, source, width, height);

            this.list[key] = texture;
        }

        return texture;
    },

    /**
     * Checks the given key to see if a Texture using it exists within this Texture Manager.
     *
     * @method Phaser.Textures.TextureManager#exists
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     *
     * @return {boolean} Returns `true` if a Texture matching the given key exists in this Texture Manager.
     */
    exists: function (key)
    {
        return (this.list.hasOwnProperty(key));
    },

    /**
     * Returns a Texture from the Texture Manager that matches the given key.
     *
     * If the key is `undefined` it will return the `__DEFAULT` Texture.
     *
     * If the key is an instance of a Texture, it will return the instance.
     *
     * If the key is an instance of a Frame, it will return the frames parent Texture instance.
     *
     * Finally, if the key is given, but not found, and not a Texture or Frame instance, it will return the `__MISSING` Texture.
     *
     * @method Phaser.Textures.TextureManager#get
     * @since 3.0.0
     *
     * @param {(string|Phaser.Textures.Texture|Phaser.Textures.Frame)} key - The unique string-based key of the Texture, or a Texture, or Frame instance.
     *
     * @return {Phaser.Textures.Texture} The Texture matching the given key.
     */
    get: function (key)
    {
        if (key === undefined) { key = '__DEFAULT'; }

        if (this.list[key])
        {
            return this.list[key];
        }
        else if (key instanceof Texture)
        {
            return key;
        }
        else if (key instanceof Frame)
        {
            return key.texture;
        }
        else
        {
            return this.list['__MISSING'];
        }
    },

    /**
     * Takes a Texture key and Frame name and returns a clone of that Frame if found.
     *
     * @method Phaser.Textures.TextureManager#cloneFrame
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(string|number)} frame - The string or index of the Frame to be cloned.
     *
     * @return {Phaser.Textures.Frame} A Clone of the given Frame.
     */
    cloneFrame: function (key, frame)
    {
        if (this.list[key])
        {
            return this.list[key].get(frame).clone();
        }
    },

    /**
     * Takes a Texture key and Frame name and returns a reference to that Frame, if found.
     *
     * @method Phaser.Textures.TextureManager#getFrame
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(string|number)} [frame] - The string-based name, or integer based index, of the Frame to get from the Texture.
     *
     * @return {Phaser.Textures.Frame} A Texture Frame object.
     */
    getFrame: function (key, frame)
    {
        if (this.list[key])
        {
            return this.list[key].get(frame);
        }
    },

    /**
     * Parses the 'key' parameter and returns a Texture Frame instance.
     *
     * It can accept the following formats:
     *
     * 1) A string
     * 2) An array where the elements are: [ key, [frame] ]
     * 3) An object with the properties: { key, [frame] }
     * 4) A Texture instance - which returns the default frame from the Texture
     * 5) A Frame instance - returns itself
     *
     * @method Phaser.Textures.TextureManager#parseFrame
     * @since 3.60.0
     *
     * @param {(string|array|object|Phaser.Textures.Texture|Phaser.Textures.Frame)} key - The key to be parsed.
     *
     * @return {Phaser.Textures.Frame} A Texture Frame object, if found, or undefined if not.
     */
    parseFrame: function (key)
    {
        if (!key)
        {
            return undefined;
        }
        else if (typeof key === 'string')
        {
            return this.getFrame(key);
        }
        else if (Array.isArray(key) && key.length === 2)
        {
            return this.getFrame(key[0], key[1]);
        }
        else if (IsPlainObject(key))
        {
            return this.getFrame(key.key, key.frame);
        }
        else if (key instanceof Texture)
        {
            return key.get();
        }
        else if (key instanceof Frame)
        {
            return key;
        }
    },

    /**
     * Returns an array with all of the keys of all Textures in this Texture Manager.
     * The output array will exclude the `__DEFAULT`, `__MISSING`, `__WHITE`, and `__NORMAL` keys.
     *
     * @method Phaser.Textures.TextureManager#getTextureKeys
     * @since 3.0.0
     *
     * @return {string[]} An array containing all of the Texture keys stored in this Texture Manager.
     */
    getTextureKeys: function ()
    {
        var output = [];

        for (var key in this.list)
        {
            if (key !== '__DEFAULT' && key !== '__MISSING' && key !== '__WHITE' && key !== '__NORMAL')
            {
                output.push(key);
            }
        }

        return output;
    },

    /**
     * Given a Texture and an `x` and `y` coordinate this method will return a new
     * Color object that has been populated with the color and alpha values of the pixel
     * at that location in the Texture.
     *
     * @method Phaser.Textures.TextureManager#getPixel
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of the pixel within the Texture.
     * @param {number} y - The y coordinate of the pixel within the Texture.
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(string|number)} [frame] - The string or index of the Frame.
     *
     * @return {?Phaser.Display.Color} A Color object populated with the color values of the requested pixel,
     * or `null` if the coordinates were out of bounds.
     */
    getPixel: function (x, y, key, frame)
    {
        var textureFrame = this.getFrame(key, frame);

        if (textureFrame)
        {
            //  Adjust for trim (if not trimmed x and y are just zero)
            x -= textureFrame.x;
            y -= textureFrame.y;

            var data = textureFrame.data.cut;

            x += data.x;
            y += data.y;

            if (x >= data.x && x < data.r && y >= data.y && y < data.b)
            {
                var ctx = this._tempContext;

                ctx.clearRect(0, 0, 1, 1);
                ctx.drawImage(textureFrame.source.image, x, y, 1, 1, 0, 0, 1, 1);

                var rgb = ctx.getImageData(0, 0, 1, 1);

                return new Color(rgb.data[0], rgb.data[1], rgb.data[2], rgb.data[3]);
            }
        }

        return null;
    },

    /**
     * Given a Texture and an `x` and `y` coordinate this method will return a value between 0 and 255
     * corresponding to the alpha value of the pixel at that location in the Texture. If the coordinate
     * is out of bounds it will return null.
     *
     * @method Phaser.Textures.TextureManager#getPixelAlpha
     * @since 3.10.0
     *
     * @param {number} x - The x coordinate of the pixel within the Texture.
     * @param {number} y - The y coordinate of the pixel within the Texture.
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(string|number)} [frame] - The string or index of the Frame.
     *
     * @return {number} A value between 0 and 255, or `null` if the coordinates were out of bounds.
     */
    getPixelAlpha: function (x, y, key, frame)
    {
        var textureFrame = this.getFrame(key, frame);

        if (textureFrame)
        {
            //  Adjust for trim (if not trimmed x and y are just zero)
            x -= textureFrame.x;
            y -= textureFrame.y;

            var data = textureFrame.data.cut;

            x += data.x;
            y += data.y;

            if (x >= data.x && x < data.r && y >= data.y && y < data.b)
            {
                var ctx = this._tempContext;

                ctx.clearRect(0, 0, 1, 1);
                ctx.drawImage(textureFrame.source.image, x, y, 1, 1, 0, 0, 1, 1);

                var rgb = ctx.getImageData(0, 0, 1, 1);

                return rgb.data[3];
            }
        }

        return null;
    },

    /**
     * Sets the given Game Objects `texture` and `frame` properties so that it uses
     * the Texture and Frame specified in the `key` and `frame` arguments to this method.
     *
     * @method Phaser.Textures.TextureManager#setTexture
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object the texture would be set on.
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(string|number)} [frame] - The string or index of the Frame.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object the texture was set on.
     */
    setTexture: function (gameObject, key, frame)
    {
        if (this.list[key])
        {
            gameObject.texture = this.list[key];
            gameObject.frame = gameObject.texture.get(frame);
        }

        return gameObject;
    },

    /**
     * Changes the key being used by a Texture to the new key provided.
     *
     * The old key is removed, allowing it to be re-used.
     *
     * Game Objects are linked to Textures by a reference to the Texture object, so
     * all existing references will be retained.
     *
     * @method Phaser.Textures.TextureManager#renameTexture
     * @since 3.12.0
     *
     * @param {string} currentKey - The current string-based key of the Texture you wish to rename.
     * @param {string} newKey - The new unique string-based key to use for the Texture.
     *
     * @return {boolean} `true` if the Texture key was successfully renamed, otherwise `false`.
     */
    renameTexture: function (currentKey, newKey)
    {
        var texture = this.get(currentKey);

        if (texture && currentKey !== newKey)
        {
            texture.key = newKey;

            this.list[newKey] = texture;

            delete this.list[currentKey];

            return true;
        }

        return false;
    },

    /**
     * Passes all Textures to the given callback.
     *
     * @method Phaser.Textures.TextureManager#each
     * @since 3.0.0
     *
     * @param {EachTextureCallback} callback - The callback function to be sent the Textures.
     * @param {object} scope - The value to use as `this` when executing the callback.
     * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
     */
    each: function (callback, scope)
    {
        var args = [ null ];

        for (var i = 1; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        for (var texture in this.list)
        {
            args[0] = this.list[texture];

            callback.apply(scope, args);
        }
    },

    /**
     * Resets the internal Stamp object, ready for drawing and returns it.
     *
     * @method Phaser.Textures.TextureManager#resetStamp
     * @since 3.60.0
     *
     * @param {number} [alpha=1] - The alpha to use.
     * @param {number} [tint=0xffffff] - WebGL only. The tint color to use.
     *
     * @return {Phaser.GameObjects.Image} A reference to the Stamp Game Object.
     */
    resetStamp: function (alpha, tint)
    {
        if (alpha === undefined) { alpha = 1; }
        if (tint === undefined) { tint = 0xffffff; }

        var stamp = this.stamp;

        stamp.setCrop();
        stamp.setPosition(0);
        stamp.setAngle(0);
        stamp.setScale(1);
        stamp.setAlpha(alpha);
        stamp.setTint(tint);
        stamp.setTexture('__WHITE');

        return stamp;
    },

    /**
     * Destroys the Texture Manager and all Textures stored within it.
     *
     * @method Phaser.Textures.TextureManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        for (var texture in this.list)
        {
            this.list[texture].destroy();
        }

        this.list = {};

        this.stamp.destroy();

        this.game = null;
        this.stamp = null;

        CanvasPool.remove(this._tempCanvas);
    }

});

module.exports = TextureManager;
