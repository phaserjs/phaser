/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CanvasPool = require('../display/canvas/CanvasPool');
var CanvasTexture = require('./CanvasTexture');
var Class = require('../utils/Class');
var Color = require('../display/color/Color');
var CONST = require('../const');
var EventEmitter = require('eventemitter3');
var Events = require('./events');
var GameEvents = require('../core/events');
var GenerateTexture = require('../create/GenerateTexture');
var GetValue = require('../utils/object/GetValue');
var Parser = require('./parsers');
var Texture = require('./Texture');

/**
 * @callback EachTextureCallback
 *
 * @param {Phaser.Textures.Texture} texture - Each texture in Texture Manager.
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
 */

/**
 * @classdesc
 * Textures are managed by the global TextureManager. This is a singleton class that is
 * responsible for creating and delivering Textures and their corresponding Frames to Game Objects.
 *
 * Sprites and other Game Objects get the texture data they need from the TextureManager.
 *
 * Access it via `scene.textures`.
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
         * The Game that this TextureManager belongs to.
         *
         * @name Phaser.Textures.TextureManager#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = game;

        /**
         * The name of this manager.
         *
         * @name Phaser.Textures.TextureManager#name
         * @type {string}
         * @since 3.0.0
         */
        this.name = 'TextureManager';

        /**
         * An object that has all of textures that Texture Manager creates.
         * Textures are assigned to keys so we can access to any texture that this object has directly by key value without iteration.
         *
         * @name Phaser.Textures.TextureManager#list
         * @type {object}
         * @default {}
         * @since 3.0.0
         */
        this.list = {};

        /**
         * The temporary canvas element to save an pixel data of an arbitrary texture in getPixel() and getPixelAlpha() method.
         *
         * @name Phaser.Textures.TextureManager#_tempCanvas
         * @type {HTMLCanvasElement}
         * @private
         * @since 3.0.0
         */
        this._tempCanvas = CanvasPool.create2D(this, 1, 1);

        /**
         * The context of the temporary canvas element made to save an pixel data in getPixel() and getPixelAlpha() method.
         *
         * @name Phaser.Textures.TextureManager#_tempContext
         * @type {CanvasRenderingContext2D}
         * @private
         * @since 3.0.0
         */
        this._tempContext = this._tempCanvas.getContext('2d');

        /**
         * An counting value used for emitting 'ready' event after all of managers in game is loaded.
         *
         * @name Phaser.Textures.TextureManager#_pending
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._pending = 0;

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

        this.addBase64('__DEFAULT', config.defaultImage);
        this.addBase64('__MISSING', config.missingImage);
        this.addBase64('__WHITE', config.whiteImage);

        this.game.events.once(GameEvents.DESTROY, this.destroy, this);
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
        if (this.exists(key))
        {
            // eslint-disable-next-line no-console
            console.error('Texture key already in use: ' + key);

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
                console.warn('No texture found matching key: ' + key);
                return this;
            }
        }

        //  By this point key should be a Texture, if not, the following fails anyway
        if (this.list.hasOwnProperty(key.key))
        {
            key.destroy();

            this.emit(Events.REMOVE, key.key);
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
            console.warn('Cannot getBase64 from WebGL Texture');
        }
        else if (textureFrame)
        {
            var cd = textureFrame.canvasData;

            var canvas = CanvasPool.create2D(this, cd.width, cd.height);
            var ctx = canvas.getContext('2d');

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
        }

        return texture;
    },

    /**
     * Takes a WebGL Texture and creates a Phaser Texture from it, which is added to the Texture Manager using the given key.
     *
     * This allows you to then use the Texture as a normal texture for texture based Game Objects like Sprites.
     *
     * If the `width` and `height` arguments are omitted, but the WebGL Texture was created by Phaser's WebGL Renderer
     * and has `glTexture.width` and `glTexture.height` properties, these values will be used instead.
     *
     * This is a WebGL only feature.
     *
     * @method Phaser.Textures.TextureManager#addGLTexture
     * @fires Phaser.Textures.Events#ADD
     * @since 3.19.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {WebGLTexture} glTexture - The source Render Texture.
     * @param {number} [width] - The new width of the Texture. Read from `glTexture.width` if omitted.
     * @param {number} [height] - The new height of the Texture. Read from `glTexture.height` if omitted.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    addGLTexture: function (key, glTexture, width, height)
    {
        var texture = null;

        if (this.checkKey(key))
        {
            if (width === undefined) { width = glTexture.width; }
            if (height === undefined) { height = glTexture.height; }

            texture = this.create(key, glTexture, width, height);

            texture.add('__BASE', 0, 0, 0, width, height);

            this.emit(Events.ADD, key, texture);
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
                if (Array.isArray(atlasData))
                {
                    for (var i = 0; i < atlasData.length; i++)
                    {
                        Parser.JSONHash(texture, i, atlasData[i]);
                    }
                }
                else
                {
                    Parser.JSONHash(texture, 0, atlasData);
                }
            }

            this.emit(Events.ADD, key, texture);
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
        }

        return texture;
    },

    /**
     * Adds a new Texture Atlas to this Texture Manager.
     * It can accept either JSON Array or JSON Hash formats, as exported by Texture Packer and similar software.
     *
     * @method Phaser.Textures.TextureManager#addAtlas
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {HTMLImageElement} source - The source Image element.
     * @param {object} data - The Texture Atlas data.
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
     * The frame data of the atlas must be stored in an Array within the JSON.
     * This is known as a JSON Array in software such as Texture Packer.
     *
     * @method Phaser.Textures.TextureManager#addAtlasJSONArray
     * @fires Phaser.Textures.Events#ADD
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(HTMLImageElement|HTMLImageElement[])} source - The source Image element/s.
     * @param {(object|object[])} data - The Texture Atlas data/s.
     * @param {HTMLImageElement|HTMLCanvasElement|HTMLImageElement[]|HTMLCanvasElement[]} [dataSource] - An optional data Image element.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    addAtlasJSONArray: function (key, source, data, dataSource)
    {
        var texture = null;

        if (this.checkKey(key))
        {
            texture = this.create(key, source);

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
        }

        return texture;
    },

    /**
     * Adds a Texture Atlas to this Texture Manager.
     * The frame data of the atlas must be stored in an Object within the JSON.
     * This is known as a JSON Hash in software such as Texture Packer.
     *
     * @method Phaser.Textures.TextureManager#addAtlasJSONHash
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
    addAtlasJSONHash: function (key, source, data, dataSource)
    {
        var texture = null;

        if (this.checkKey(key))
        {
            texture = this.create(key, source);

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
        }

        return texture;
    },

    /**
     * Adds a Texture Atlas to this Texture Manager, where the atlas data is given
     * in the XML format.
     *
     * @method Phaser.Textures.TextureManager#addAtlasXML
     * @fires Phaser.Textures.Events#ADD
     * @since 3.7.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {HTMLImageElement} source - The source Image element.
     * @param {object} data - The Texture Atlas XML data.
     * @param {HTMLImageElement|HTMLCanvasElement|HTMLImageElement[]|HTMLCanvasElement[]} [dataSource] - An optional data Image element.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    addAtlasXML: function (key, source, data, dataSource)
    {
        var texture = null;

        if (this.checkKey(key))
        {
            texture = this.create(key, source);

            Parser.AtlasXML(texture, 0, data);

            if (dataSource)
            {
                texture.setDataSource(dataSource);
            }

            this.emit(Events.ADD, key, texture);
        }

        return texture;
    },

    /**
     * Adds a Unity Texture Atlas to this Texture Manager.
     * The data must be in the form of a Unity YAML file.
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

        if (this.checkKey(key))
        {
            texture = this.create(key, source);

            Parser.UnityYAML(texture, 0, data);

            if (dataSource)
            {
                texture.setDataSource(dataSource);
            }

            this.emit(Events.ADD, key, texture);
        }

        return texture;
    },

    /**
     * Adds a Sprite Sheet to this Texture Manager.
     *
     * In Phaser terminology a Sprite Sheet is a texture containing different frames, but each frame is the exact
     * same size and cannot be trimmed or rotated.
     *
     * @method Phaser.Textures.TextureManager#addSpriteSheet
     * @fires Phaser.Textures.Events#ADD
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {HTMLImageElement} source - The source Image element.
     * @param {Phaser.Types.Textures.SpriteSheetConfig} config - The configuration object for this Sprite Sheet.
     *
     * @return {?Phaser.Textures.Texture} The Texture that was created, or `null` if the key is already in use.
     */
    addSpriteSheet: function (key, source, config)
    {
        var texture = null;

        if (this.checkKey(key))
        {
            texture = this.create(key, source);

            var width = texture.source[0].width;
            var height = texture.source[0].height;

            Parser.SpriteSheet(texture, 0, 0, 0, width, height, config);

            this.emit(Events.ADD, key, texture);
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
            var texture = this.create(key, sheet.source.image);

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

            return texture;
        }
    },

    /**
     * Creates a new Texture using the given source and dimensions.
     *
     * @method Phaser.Textures.TextureManager#create
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {HTMLImageElement} source - The source Image element.
     * @param {number} width - The width of the Texture.
     * @param {number} height - The height of the Texture.
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
     * If the key is an instance of a Texture, it will return the key directly.
     *
     * Finally. if the key is given, but not found and not a Texture instance, it will return the `__MISSING` Texture.
     *
     * @method Phaser.Textures.TextureManager#get
     * @since 3.0.0
     *
     * @param {(string|Phaser.Textures.Texture)} key - The unique string-based key of the Texture, or a Texture instance.
     *
     * @return {Phaser.Textures.Texture} The Texture that was created.
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
     * Returns an array with all of the keys of all Textures in this Texture Manager.
     * The output array will exclude the `__DEFAULT` and `__MISSING` keys.
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
            if (key !== '__DEFAULT' && key !== '__MISSING')
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

        this.game = null;

        CanvasPool.remove(this._tempCanvas);
    }

});

module.exports = TextureManager;
