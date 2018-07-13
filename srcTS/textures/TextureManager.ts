/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CanvasPool = require('../display/canvas/CanvasPool');
var CanvasTexture = require('./CanvasTexture');
var Class = require('../utils/Class');
var Color = require('../display/color/Color');
var CONST = require('../const');
var EventEmitter = require('eventemitter3');
var GenerateTexture = require('../create/GenerateTexture');
var GetValue = require('../utils/object/GetValue');
var Parser = require('./parsers');
var Texture = require('./Texture');

/**
 * @callback EachTextureCallback
 *
 * @param {Phaser.Textures.Texture} texture - [description]
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
 * @memberOf Phaser.Textures
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - [description]
 */
var TextureManager = new Class({

    Extends: EventEmitter,

    initialize:

    function TextureManager (game)
    {
        EventEmitter.call(this);

        /**
         * [description]
         *
         * @name Phaser.Textures.TextureManager#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = game;

        /**
         * [description]
         *
         * @name Phaser.Textures.TextureManager#name
         * @type {string}
         * @since 3.0.0
         */
        this.name = 'TextureManager';

        /**
         * [description]
         *
         * @name Phaser.Textures.TextureManager#list
         * @type {object}
         * @default {}
         * @since 3.0.0
         */
        this.list = {};

        /**
         * [description]
         *
         * @name Phaser.Textures.TextureManager#_tempCanvas
         * @type {HTMLCanvasElement}
         * @private
         * @since 3.0.0
         */
        this._tempCanvas = CanvasPool.create2D(this, 1, 1);

        /**
         * [description]
         *
         * @name Phaser.Textures.TextureManager#_tempContext
         * @type {CanvasRenderingContext2D}
         * @private
         * @since 3.0.0
         */
        this._tempContext = this._tempCanvas.getContext('2d');

        /**
         * [description]
         *
         * @name Phaser.Textures.TextureManager#_pending
         * @type {integer}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._pending = 0;

        game.events.once('boot', this.boot, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        this._pending = 2;

        this.on('onload', this.updatePending, this);
        this.on('onerror', this.updatePending, this);

        this.addBase64('__DEFAULT', this.game.config.defaultImage);
        this.addBase64('__MISSING', this.game.config.missingImage);

        this.game.events.once('destroy', this.destroy, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#updatePending
     * @since 3.0.0
     */
    updatePending: function ()
    {
        this._pending--;

        if (this._pending === 0)
        {
            this.off('onload');
            this.off('onerror');

            this.game.events.emit('ready');
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
            delete this.list[key.key];

            key.destroy();

            this.emit('removetexture', key.key);
        }

        return this;
    },

    /**
     * Adds a new Texture to the Texture Manager created from the given Base64 encoded data.
     *
     * @method Phaser.Textures.TextureManager#addBase64
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {*} data - The Base64 encoded data.
     */
    addBase64: function (key, data)
    {
        if (this.checkKey(key))
        {
            var _this = this;

            var image = new Image();

            image.onerror = function ()
            {
                _this.emit('onerror', key);
            };

            image.onload = function ()
            {
                var texture = _this.create(key, image);

                Parser.Image(texture, 0);

                _this.emit('addtexture', key, texture);

                _this.emit('onload', key, texture);
            };

            image.src = data;
        }
    },

    /**
     * Adds a new Texture to the Texture Manager created from the given Image element.
     *
     * @method Phaser.Textures.TextureManager#addImage
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {HTMLImageElement} source - The source Image element.
     * @param {HTMLImageElement} [dataSource] - An optional data Image element.
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

            this.emit('addtexture', key, texture);
        }
        
        return texture;
    },

    /**
     * Creates a new Texture using the given config values.
     * Generated textures consist of a Canvas element to which the texture data is drawn.
     * See the Phaser.Create function for the more direct way to create textures.
     *
     * @method Phaser.Textures.TextureManager#generate
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {object} config - [description]
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
     * @param {integer} [width=256]- The width of the Canvas element.
     * @param {integer} [height=256] - The height of the Canvas element.
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
     * Creates a new Canvas Texture object from an existing Canvas element and adds
     * it to this Texture Manager.
     *
     * @method Phaser.Textures.TextureManager#addCanvas
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {HTMLCanvasElement} source - The Canvas element to form the base of the new Texture.
     *
     * @return {?Phaser.Textures.CanvasTexture} The Canvas Texture that was created, or `null` if the key is already in use.
     */
    addCanvas: function (key, source)
    {
        var texture = null;

        if (this.checkKey(key))
        {
            texture = new CanvasTexture(this, key, source, source.width, source.height);

            this.list[key] = texture;

            this.emit('addtexture', key, texture);
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
     * @param {HTMLImageElement} [dataSource] - An optional data Image element.
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
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(HTMLImageElement|HTMLImageElement[])} source - The source Image element/s.
     * @param {(object|object[])} data - The Texture Atlas data/s.
     * @param {HTMLImageElement} [dataSource] - An optional data Image element.
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

            this.emit('addtexture', key, texture);
        }

        return texture;
    },

    /**
     * Adds a Texture Atlas to this Texture Manager.
     * The frame data of the atlas must be stored in an Object within the JSON.
     * This is known as a JSON Hash in software such as Texture Packer.
     *
     * @method Phaser.Textures.TextureManager#addAtlasJSONHash
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {HTMLImageElement} source - The source Image element.
     * @param {object} data - The Texture Atlas data.
     * @param {HTMLImageElement} [dataSource] - An optional data Image element.
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

            this.emit('addtexture', key, texture);
        }

        return texture;
    },

    /**
     * Adds a Texture Atlas to this Texture Manager, where the atlas data is given
     * in the XML format.
     *
     * @method Phaser.Textures.TextureManager#addAtlasXML
     * @since 3.7.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {HTMLImageElement} source - The source Image element.
     * @param {object} data - The Texture Atlas XML data.
     * @param {HTMLImageElement} [dataSource] - An optional data Image element.
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

            this.emit('addtexture', key, texture);
        }

        return texture;
    },

    /**
     * Adds a Unity Texture Atlas to this Texture Manager.
     * The data must be in the form of a Unity YAML file.
     *
     * @method Phaser.Textures.TextureManager#addUnityAtlas
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {HTMLImageElement} source - The source Image element.
     * @param {object} data - The Texture Atlas data.
     * @param {HTMLImageElement} [dataSource] - An optional data Image element.
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

            this.emit('addtexture', key, texture);
        }

        return texture;
    },

    /**
     * @typedef {object} SpriteSheetConfig
     * 
     * @property {integer} frameWidth - The fixed width of each frame.
     * @property {integer} [frameHeight] - The fixed height of each frame. If not set it will use the frameWidth as the height.
     * @property {integer} [startFrame=0] - Skip a number of frames. Useful when there are multiple sprite sheets in one Texture.
     * @property {integer} [endFrame=-1] - The total number of frames to extract from the Sprite Sheet. The default value of -1 means "extract all frames".
     * @property {integer} [margin=0] - If the frames have been drawn with a margin, specify the amount here.
     * @property {integer} [spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
     */

    /**
     * Adds a Sprite Sheet to this Texture Manager.
     *
     * In Phaser terminology a Sprite Sheet is a texture containing different frames, but each frame is the exact
     * same size and cannot be trimmed or rotated.
     *
     * @method Phaser.Textures.TextureManager#addSpriteSheet
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {HTMLImageElement} source - The source Image element.
     * @param {SpriteSheetConfig} config - The configuration object for this Sprite Sheet.
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

            this.emit('addtexture', key, texture);
        }

        return texture;
    },

    /**
     * @typedef {object} SpriteSheetFromAtlasConfig
     * 
     * @property {string} atlas - The key of the Texture Atlas in which this Sprite Sheet can be found.
     * @property {string} frame - The key of the Texture Atlas Frame in which this Sprite Sheet can be found.
     * @property {integer} frameWidth - The fixed width of each frame.
     * @property {integer} [frameHeight] - The fixed height of each frame. If not set it will use the frameWidth as the height.
     * @property {integer} [startFrame=0] - Skip a number of frames. Useful when there are multiple sprite sheets in one Texture.
     * @property {integer} [endFrame=-1] - The total number of frames to extract from the Sprite Sheet. The default value of -1 means "extract all frames".
     * @property {integer} [margin=0] - If the frames have been drawn with a margin, specify the amount here.
     * @property {integer} [spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
     */

    /**
     * Adds a Sprite Sheet to this Texture Manager, where the Sprite Sheet exists as a Frame within a Texture Atlas.
     *
     * In Phaser terminology a Sprite Sheet is a texture containing different frames, but each frame is the exact
     * same size and cannot be trimmed or rotated.
     *
     * @method Phaser.Textures.TextureManager#addSpriteSheetFromAtlas
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {SpriteSheetFromAtlasConfig} config - The configuration object for this Sprite Sheet.
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

            this.emit('addtexture', key, texture);

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
     * @param {integer} width - The width of the Texture.
     * @param {integer} height - The height of the Texture.
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
     * If the key is undefined it will return the `__DEFAULT` Texture.
     * If the key is given, but not found, it will return the `__MISSING` Texture.
     *
     * @method Phaser.Textures.TextureManager#get
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
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
     * @param {(string|integer)} frame - The string or index of the Frame to be cloned.
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
     * @param {(string|integer)} [frame] - The string-based name, or integer based index, of the Frame to get from the Texture.
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
     * @param {integer} x - The x coordinate of the pixel within the Texture.
     * @param {integer} y - The y coordinate of the pixel within the Texture.
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(string|integer)} frame - The string or index of the Frame.
     *
     * @return {?Phaser.Display.Color} A Color object populated with the color values of the requested pixel,
     * or `null` if the coordinates were out of bounds.
     */
    getPixel: function (x, y, key, frame)
    {
        var textureFrame = this.getFrame(key, frame);

        if (textureFrame)
        {
            var source = textureFrame.source.image;

            if (x >= 0 && x <= source.width && y >= 0 && y <= source.height)
            {
                x += textureFrame.cutX;
                y += textureFrame.cutY;

                // if (textureFrame.trimmed)
                // {
                //     x -= this.sprite.texture.trim.x;
                //     y -= this.sprite.texture.trim.y;
                // }

                var context = this._tempContext;

                context.clearRect(0, 0, 1, 1);
                context.drawImage(source, x, y, 1, 1, 0, 0, 1, 1);

                var rgb = context.getImageData(0, 0, 1, 1);

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
     * @param {integer} x - The x coordinate of the pixel within the Texture.
     * @param {integer} y - The y coordinate of the pixel within the Texture.
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(string|integer)} frame - The string or index of the Frame.
     *
     * @return {integer} A value between 0 and 255, or `null` if the coordinates were out of bounds.
     */
    getPixelAlpha: function (x, y, key, frame)
    {
        var textureFrame = this.getFrame(key, frame);

        if (textureFrame)
        {
            var source = textureFrame.source.image;

            if (x >= 0 && x <= source.width && y >= 0 && y <= source.height)
            {
                x += textureFrame.cutX;
                y += textureFrame.cutY;

                var context = this._tempContext;

                context.clearRect(0, 0, 1, 1);
                context.drawImage(source, x, y, 1, 1, 0, 0, 1, 1);

                var rgb = context.getImageData(0, 0, 1, 1);

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
     * @param {Phaser.GameObjects.GameObject} gameObject - [description]
     * @param {string} key - The unique string-based key of the Texture.
     * @param {(string|integer)} frame - The string or index of the Frame.
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
