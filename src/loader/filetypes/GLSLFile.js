/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var File = require('../File');
var FileTypesManager = require('../FileTypesManager');
var GetFastValue = require('../../utils/object/GetFastValue');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var Shader = require('../../display/shader/BaseShader');

/**
 * @classdesc
 * A single GLSL File suitable for loading by the Loader.
 *
 * These are created when you use the Phaser.Loader.LoaderPlugin#glsl method and are not typically created directly.
 * 
 * For documentation about what all the arguments and configuration options mean please see Phaser.Loader.LoaderPlugin#glsl.
 *
 * @class GLSLFile
 * @extends Phaser.Loader.File
 * @memberof Phaser.Loader.FileTypes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Loader.LoaderPlugin} loader - A reference to the Loader that is responsible for this file.
 * @param {(string|Phaser.Types.Loader.FileTypes.GLSLFileConfig)} key - The key to use for this file, or a file configuration object.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.txt`, i.e. if `key` was "alien" then the URL will be "alien.txt".
 * @param {string} [shaderType='fragment'] - The type of shader. Either `fragment` for a fragment shader, or `vertex` for a vertex shader. This is ignored if you load a shader bundle.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - Extra XHR Settings specifically for this file.
 */
var GLSLFile = new Class({

    Extends: File,

    initialize:

    function GLSLFile (loader, key, url, shaderType, xhrSettings)
    {
        var extension = 'glsl';

        if (IsPlainObject(key))
        {
            var config = key;

            key = GetFastValue(config, 'key');
            url = GetFastValue(config, 'url');
            shaderType = GetFastValue(config, 'shaderType', 'fragment');
            xhrSettings = GetFastValue(config, 'xhrSettings');
            extension = GetFastValue(config, 'extension', extension);
        }
        else if (shaderType === undefined)
        {
            shaderType = 'fragment';
        }

        var fileConfig = {
            type: 'glsl',
            cache: loader.cacheManager.shader,
            extension: extension,
            responseType: 'text',
            key: key,
            url: url,
            config: {
                shaderType: shaderType
            },
            xhrSettings: xhrSettings
        };

        File.call(this, loader, fileConfig);
    },

    /**
     * Called automatically by Loader.nextFile.
     * This method controls what extra work this File does with its loaded data.
     *
     * @method Phaser.Loader.FileTypes.GLSLFile#onProcess
     * @since 3.7.0
     */
    onProcess: function ()
    {
        this.state = CONST.FILE_PROCESSING;

        this.data = this.xhrLoader.responseText;

        this.onProcessComplete();
    },

    /**
     * Adds this file to its target cache upon successful loading and processing.
     *
     * @method Phaser.Loader.FileTypes.GLSLFile#addToCache
     * @since 3.17.0
     */
    addToCache: function ()
    {
        var data = this.data.split('\n');

        //  Check to see if this is a shader bundle, or raw glsl file.
        var block = this.extractBlock(data, 0);

        if (block)
        {
            while (block)
            {
                var key = this.getShaderName(block.header);
                var shaderType = this.getShaderType(block.header);
                var uniforms = this.getShaderUniforms(block.header);
                var shaderSrc = block.shader;

                if (this.cache.has(key))
                {
                    var shader = this.cache.get(key);

                    if (shaderType === 'fragment')
                    {
                        shader.fragmentSrc = shaderSrc;
                    }
                    else
                    {
                        shader.vertexSrc = shaderSrc;
                    }

                    if (!shader.uniforms)
                    {
                        shader.uniforms = uniforms;
                    }
                }
                else if (shaderType === 'fragment')
                {
                    this.cache.add(key, new Shader(key, shaderSrc, '', uniforms));
                }
                else
                {
                    this.cache.add(key, new Shader(key, '', shaderSrc, uniforms));
                }

                block = this.extractBlock(data, block.offset);
            }
        }
        else if (this.config.shaderType === 'fragment')
        {
            //  Single shader
            this.cache.add(this.key, new Shader(this.key, this.data));
        }
        else
        {
            this.cache.add(this.key, new Shader(this.key, '', this.data));
        }

        this.pendingDestroy();
    },

    /**
     * Returns the name of the shader from the header block.
     *
     * @method Phaser.Loader.FileTypes.GLSLFile#getShaderName
     * @since 3.17.0
     * 
     * @param {string[]} headerSource - The header data.
     * 
     * @return {string} The shader name.
     */
    getShaderName: function (headerSource)
    {
        for (var i = 0; i < headerSource.length; i++)
        {
            var line = headerSource[i].trim();

            if (line.substring(0, 5) === 'name:')
            {
                return line.substring(5).trim();
            }
        }

        return this.key;
    },

    /**
     * Returns the type of the shader from the header block.
     *
     * @method Phaser.Loader.FileTypes.GLSLFile#getShaderType
     * @since 3.17.0
     * 
     * @param {string[]} headerSource - The header data.
     * 
     * @return {string} The shader type. Either 'fragment' or 'vertex'.
     */
    getShaderType: function (headerSource)
    {
        for (var i = 0; i < headerSource.length; i++)
        {
            var line = headerSource[i].trim();

            if (line.substring(0, 5) === 'type:')
            {
                return line.substring(5).trim();
            }
        }

        return this.config.shaderType;
    },

    /**
     * Returns the shader uniforms from the header block.
     *
     * @method Phaser.Loader.FileTypes.GLSLFile#getShaderUniforms
     * @since 3.17.0
     * 
     * @param {string[]} headerSource - The header data.
     * 
     * @return {any} The shader uniforms object.
     */
    getShaderUniforms: function (headerSource)
    {
        var uniforms = {};

        for (var i = 0; i < headerSource.length; i++)
        {
            var line = headerSource[i].trim();

            if (line.substring(0, 8) === 'uniform.')
            {
                var pos = line.indexOf(':');

                if (pos)
                {
                    var key = line.substring(8, pos);

                    try
                    {
                        uniforms[key] = JSON.parse(line.substring(pos + 1));
                    }
                    catch (e)
                    {
                        console.warn('Invalid uniform JSON: ' + key);
                    }
                }
            }
        }

        return uniforms;
    },

    /**
     * Processes the shader file and extracts the relevant data.
     *
     * @method Phaser.Loader.FileTypes.GLSLFile#extractBlock
     * @private
     * @since 3.17.0
     * 
     * @param {string[]} data - The array of shader data to process.
     * @param {integer} offset - The offset to start processing from.
     * 
     * @return {any} The processed shader block, or null.
     */
    extractBlock: function (data, offset)
    {
        var headerStart = -1;
        var headerEnd = -1;
        var blockEnd = -1;
        var headerOpen = false;
        var captureSource = false;
        var headerSource = [];
        var shaderSource = [];

        for (var i = offset; i < data.length; i++)
        {
            var line = data[i].trim();

            if (line === '---')
            {
                if (headerStart === -1)
                {
                    headerStart = i;
                    headerOpen = true;
                }
                else if (headerOpen)
                {
                    headerEnd = i;
                    headerOpen = false;
                    captureSource = true;
                }
                else
                {
                    //  We've hit another --- delimeter, break out
                    captureSource = false;
                    break;
                }
            }
            else if (headerOpen)
            {
                headerSource.push(line);
            }
            else if (captureSource)
            {
                shaderSource.push(line);
                blockEnd = i;
            }
        }

        if (!headerOpen && headerEnd !== -1)
        {
            return { header: headerSource, shader: shaderSource.join('\n'), offset: blockEnd };
        }
        else
        {
            return null;
        }
    }

});

/**
 * Adds a GLSL file, or array of GLSL files, to the current load queue.
 * In Phaser 3 GLSL files are just plain Text files at the current moment in time.
 *
 * You can call this method from within your Scene's `preload`, along with any other files you wish to load:
 * 
 * ```javascript
 * function preload ()
 * {
 *     this.load.glsl('plasma', 'shaders/Plasma.glsl');
 * }
 * ```
 *
 * The file is **not** loaded right away. It is added to a queue ready to be loaded either when the loader starts,
 * or if it's already running, when the next free load slot becomes available. This happens automatically if you
 * are calling this from within the Scene's `preload` method, or a related callback. Because the file is queued
 * it means you cannot use the file immediately after calling this method, but must wait for the file to complete.
 * The typical flow for a Phaser Scene is that you load assets in the Scene's `preload` method and then when the
 * Scene's `create` method is called you are guaranteed that all of those assets are ready for use and have been
 * loaded.
 * 
 * The key must be a unique String. It is used to add the file to the global Shader Cache upon a successful load.
 * The key should be unique both in terms of files being loaded and files already present in the Shader Cache.
 * Loading a file using a key that is already taken will result in a warning. If you wish to replace an existing file
 * then remove it from the Shader Cache first, before loading a new one.
 *
 * Instead of passing arguments you can pass a configuration object, such as:
 * 
 * ```javascript
 * this.load.glsl({
 *     key: 'plasma',
 *     shaderType: 'fragment',
 *     url: 'shaders/Plasma.glsl'
 * });
 * ```
 *
 * See the documentation for `Phaser.Types.Loader.FileTypes.GLSLFileConfig` for more details.
 *
 * Once the file has finished loading you can access it from its Cache using its key:
 * 
 * ```javascript
 * this.load.glsl('plasma', 'shaders/Plasma.glsl');
 * // and later in your game ...
 * var data = this.cache.shader.get('plasma');
 * ```
 *
 * If you have specified a prefix in the loader, via `Loader.setPrefix` then this value will be prepended to this files
 * key. For example, if the prefix was `FX.` and the key was `Plasma` the final key will be `FX.Plasma` and
 * this is what you would use to retrieve the text from the Shader Cache.
 *
 * The URL can be relative or absolute. If the URL is relative the `Loader.baseURL` and `Loader.path` values will be prepended to it.
 *
 * If the URL isn't specified the Loader will take the key and create a filename from that. For example if the key is "plasma"
 * and no URL is given then the Loader will set the URL to be "plasma.glsl". It will always add `.glsl` as the extension, although
 * this can be overridden if using an object instead of method arguments. If you do not desire this action then provide a URL.
 *
 * Note: The ability to load this type of file will only be available if the GLSL File type has been built into Phaser.
 * It is available in the default build but can be excluded from custom builds.
 *
 * @method Phaser.Loader.LoaderPlugin#glsl
 * @fires Phaser.Loader.LoaderPlugin#addFileEvent
 * @since 3.0.0
 *
 * @param {(string|Phaser.Types.Loader.FileTypes.GLSLFileConfig|Phaser.Types.Loader.FileTypes.GLSLFileConfig[])} key - The key to use for this file, or a file configuration object, or array of them.
 * @param {string} [url] - The absolute or relative URL to load this file from. If undefined or `null` it will be set to `<key>.glsl`, i.e. if `key` was "alien" then the URL will be "alien.glsl".
 * @param {string} [shaderType='fragment'] - The type of shader. Either `fragment` for a fragment shader, or `vertex` for a vertex shader. This is ignored if you load a shader bundle.
 * @param {Phaser.Types.Loader.XHRSettingsObject} [xhrSettings] - An XHR Settings configuration object. Used in replacement of the Loaders default XHR Settings.
 *
 * @return {Phaser.Loader.LoaderPlugin} The Loader instance.
 */
FileTypesManager.register('glsl', function (key, url, shaderType, xhrSettings)
{
    if (Array.isArray(key))
    {
        for (var i = 0; i < key.length; i++)
        {
            //  If it's an array it has to be an array of Objects, so we get everything out of the 'key' object
            this.addFile(new GLSLFile(this, key[i]));
        }
    }
    else
    {
        this.addFile(new GLSLFile(this, key, url, shaderType, xhrSettings));
    }

    return this;
});

module.exports = GLSLFile;
