var CanvasPool = require('../display/canvas/CanvasPool');
var Class = require('../utils/Class');
var Color = require('../display/color/Color');
var EventEmitter = require('eventemitter3');
var GenerateTexture = require('../create/GenerateTexture');
var GetValue = require('../utils/object/GetValue');
var Parser = require('./parsers');
var Texture = require('./Texture');

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
 * @extends Phaser.Textures.EventEmitter
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
     * Adds a new Texture to the Texture Manager created from the given Base64 encoded data.
     *
     * @method Phaser.Textures.TextureManager#addBase64
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {any} data - The Base64 encoded data.
     */
    addBase64: function (key, data)
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

            _this.emit('onload', key, texture);
        };

        image.src = data;
    },

    /**
     * Adds a new Texture to the Texture Manager created from the given Image element.
     *
     * @method Phaser.Textures.TextureManager#addImage
     * @since 3.0.0
     *
     * @param {string} key - The unique string-based key of the Texture.
     * @param {Image} source - The source Image element.
     * @param {Image} [dataSource] - An optional data Image element.
     *
     * @return {Phaser.Textures.Texture} The Texture that was created.
     */
    addImage: function (key, source, dataSource)
    {
        var texture = this.create(key, source);
        
        Parser.Image(texture, 0);

        if (dataSource)
        {
            texture.setDataSource(dataSource);
        }

        return texture;
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#generate
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} config - [description]
     *
     * @return {[type]} [description]
     */
    generate: function (key, config)
    {
        var canvas = CanvasPool.create(this, 1, 1);

        config.canvas = canvas;

        GenerateTexture(config);

        return this.addCanvas(key, canvas);
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#createCanvas
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} width - [description]
     * @param {[type]} height - [description]
     *
     * @return {[type]} [description]
     */
    createCanvas: function (key, width, height)
    {
        if (width === undefined) { width = 256; }
        if (height === undefined) { height = 256; }

        var canvas = CanvasPool.create(this, width, height);

        return this.addCanvas(key, canvas);
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#addCanvas
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} source - [description]
     *
     * @return {[type]} [description]
     */
    addCanvas: function (key, source)
    {
        var texture = this.create(key, source);
        
        Parser.Canvas(texture, 0);

        return texture;
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#addAtlas
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} source - [description]
     * @param {[type]} data - [description]
     *
     * @return {[type]} [description]
     */
    addAtlas: function (key, source, data)
    {
        //  Is it a Hash or an Array?

        if (Array.isArray(data.frames))
        {
            return this.addAtlasJSONArray(key, source, data);
        }
        else
        {
            return this.addAtlasJSONHash(key, source, data);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#addAtlasJSONArray
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} source - [description]
     * @param {[type]} data - [description]
     *
     * @return {[type]} [description]
     */
    addAtlasJSONArray: function (key, source, data)
    {
        var texture = this.create(key, source);

        if (Array.isArray(data))
        {
            for (var i = 0; i < data.length; i++)
            {
                Parser.JSONArray(texture, i, data[i]);
            }
        }
        else
        {
            Parser.JSONArray(texture, 0, data);
        }

        return texture;
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#addAtlasJSONHash
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} source - [description]
     * @param {[type]} data - [description]
     *
     * @return {[type]} [description]
     */
    addAtlasJSONHash: function (key, source, data)
    {
        var texture = this.create(key, source);

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

        return texture;
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#addUnityAtlas
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} source - [description]
     * @param {[type]} data - [description]
     *
     * @return {[type]} [description]
     */
    addUnityAtlas: function (key, source, data)
    {
        var texture = this.create(key, source);

        Parser.UnityYAML(texture, 0, data);

        return texture;
    },

    /**
     * [addSpriteSheet description]
     * @param {[type]} key    [description]
     * @param {[type]} source [description]
     * @param {[type]} config [description]
     * @param {number} config.frameWidth - The fixed width of each frame.
     * @param {number} [config.frameHeight] - The fixed height of each frame. If not set it will use the frameWidth as the height.
     * @param {number} [config.startFrame=0] - Skip a number of frames. Useful when there are multiple sprite sheets in one Texture.
     * @param {number} [config.endFrame=-1] - The total number of frames to extract from the Sprite Sheet. The default value of -1 means "extract all frames".
     * @param {number} [config.margin=0] - If the frames have been drawn with a margin, specify the amount here.
     * @param {number} [config.spacing=0] - If the frames have been drawn with spacing between them, specify the amount here.
     */
    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#addSpriteSheet
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} source - [description]
     * @param {[type]} config - [description]
     *
     * @return {[type]} [description]
     */
    addSpriteSheet: function (key, source, config)
    {
        var texture = this.create(key, source);

        var width = texture.source[0].width;
        var height = texture.source[0].height;

        Parser.SpriteSheet(texture, 0, 0, 0, width, height, config);

        return texture;
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#addSpriteSheetFromAtlas
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} config - [description]
     *
     * @return {[type]} [description]
     */
    addSpriteSheetFromAtlas: function (key, config)
    {
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

            return texture;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#addAtlasStarlingXML
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} source - [description]
     * @param {[type]} data - [description]
     *
     * @return {[type]} [description]
     */
    addAtlasStarlingXML: function (key, source, data)
    {
        var texture = this.create(key, source);

        if (Array.isArray(data))
        {
            for (var i = 0; i < data.length; i++)
            {
                Parser.StarlingXML(texture, i, data[i]);
            }
        }
        else
        {
            Parser.StarlingXML(texture, 0, data);
        }

        return texture;
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#addAtlasPyxel
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} source - [description]
     * @param {[type]} data - [description]
     *
     * @return {[type]} [description]
     */
    addAtlasPyxel: function (key, source, data)
    {
        var texture = this.create(key, source);

        if (Array.isArray(data))
        {
            for (var i = 0; i < data.length; i++)
            {
                Parser.Pyxel(texture, i, data[i]);
            }
        }
        else
        {
            Parser.Pyxel(texture, 0, data);
        }

        return texture;
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#create
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} source - [description]
     * @param {[type]} width - [description]
     * @param {[type]} height - [description]
     *
     * @return {[type]} [description]
     */
    create: function (key, source, width, height)
    {
        var texture = new Texture(this, key, source, width, height);

        this.list[key] = texture;

        return texture;
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#exists
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     *
     * @return {[type]} [description]
     */
    exists: function (key)
    {
        return (this.list.hasOwnProperty(key));
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#get
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     *
     * @return {[type]} [description]
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
     * [description]
     *
     * @method Phaser.Textures.TextureManager#cloneFrame
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} frame - [description]
     *
     * @return {[type]} [description]
     */
    cloneFrame: function (key, frame)
    {
        if (this.list[key])
        {
            return this.list[key].get(frame).clone();
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#getFrame
     * @since 3.0.0
     *
     * @param {[type]} key - [description]
     * @param {[type]} frame - [description]
     *
     * @return {[type]} [description]
     */
    getFrame: function (key, frame)
    {
        if (this.list[key])
        {
            return this.list[key].get(frame);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#getTextureKeys
     * @since 3.0.0
     *
     * @return {[type]} [description]
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
     * [description]
     *
     * @method Phaser.Textures.TextureManager#getPixel
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     * @param {[type]} key - [description]
     * @param {[type]} frame - [description]
     *
     * @return {[type]} [description]
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
                    // x -= this.sprite.texture.trim.x;
                    // y -= this.sprite.texture.trim.y;
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
     * [description]
     *
     * @method Phaser.Textures.TextureManager#setTexture
     * @since 3.0.0
     *
     * @param {[type]} gameObject - [description]
     * @param {[type]} key - [description]
     * @param {[type]} frame - [description]
     *
     * @return {[type]} [description]
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
    * @method each
    * @param {function} callback - The function to call.
    * @param {object} [thisArg] - Value to use as `this` when executing callback.
    * @param {...*} [arguments] - Additional arguments that will be passed to the callback, after the child.
    */
    /**
     * [description]
     *
     * @method Phaser.Textures.TextureManager#each
     * @since 3.0.0
     *
     * @param {[type]} callback - [description]
     * @param {[type]} thisArg - [description]
     */
    each: function (callback, thisArg)
    {
        var args = [ null ];

        for (var i = 1; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        for (var texture in this.list)
        {
            args[0] = this.list[texture];

            callback.apply(thisArg, args);
        }
    },

    /**
     * [description]
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
    }

});

module.exports = TextureManager;
