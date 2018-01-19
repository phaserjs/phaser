var BaseLoader = require('./BaseLoader');
var Class = require('../utils/Class');
var FileTypesManager = require('./FileTypesManager');
var PluginManager = require('../plugins/PluginManager');

var Loader = new Class({

    Extends: BaseLoader,

    initialize:

    function Loader (scene)
    {
        BaseLoader.call(this, scene);

        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        this._multilist = {};

        //  Inject the available filetypes into the Loader
        FileTypesManager.install(this);
    },

    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    loadArray: function (files)
    {
        if (Array.isArray(files))
        {
            for (var i = 0; i < files.length; i++)
            {
                this.file(files[i]);
            }
        }

        return (this.list.size > 0);
    },

    file: function (file)
    {
        var entry;

        switch (file.type)
        {
            case 'spritesheet':
                entry = this.spritesheet(file.key, file.url, file.config, file.xhrSettings);
                break;

            case 'atlas':
                entry = this.atlas(file.key, file.textureURL, file.atlasURL, file.textureXhrSettings, file.atlasXhrSettings);
                break;

            case 'bitmapFont':
                entry = this.bitmapFont(file.key, file.textureURL, file.xmlURL, file.textureXhrSettings, file.xmlXhrSettings);
                break;

            case 'multiatlas':
                entry = this.multiatlas(file.key, file.textureURLs, file.atlasURLs, file.textureXhrSettings, file.atlasXhrSettings);
                break;

            case 'audioSprite':
                entry = this.audioSprite(file.key, file.urls, file.json, file.config, file.audioXhrSettings, file.jsonXhrSettings);
                break;

            //  image, json, xml, binary, text, glsl, svg, obj
            default:
                entry = this[file.type](file.key, file.url, file.xhrSettings);
                break;
        }

        return entry;
    },

    shutdown: function ()
    {
        //  TODO
    }

});

PluginManager.register('Loader', Loader, 'load');

module.exports = Loader;
