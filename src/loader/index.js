//  Phaser.Loader

module.exports = {

    BaseLoader: require('./BaseLoader'),
    File: require('./File'),
    FileTypesManager: require('./FileTypesManager'),
    LoaderPlugin: require('./Loader'),

    FileTypes: {
        AnimationJSONFile: require('./filetypes/AnimationJSONFile'),
        AtlasJSONFile: require('./filetypes/AtlasJSONFile'),
        AudioFile: require('./filetypes/AudioFile'),
        BinaryFile: require('./filetypes/BinaryFile'),
        BitmapFontFile: require('./filetypes/BitmapFontFile'),
        GLSLFile: require('./filetypes/GLSLFile'),
        HTMLFile: require('./filetypes/HTMLFile'),
        ImageFile: require('./filetypes/ImageFile'),
        JSONFile: require('./filetypes/JSONFile'),
        PluginFile: require('./filetypes/PluginFile'),
        ScriptFile: require('./filetypes/ScriptFile'),
        SpriteSheet: require('./filetypes/SpriteSheet'),
        SVGFile: require('./filetypes/SVGFile'),
        TextFile: require('./filetypes/TextFile'),
        TilemapCSVFile: require('./filetypes/TilemapCSVFile'),
        TilemapJSONFile: require('./filetypes/TilemapJSONFile'),
        UnityAtlasFile: require('./filetypes/UnityAtlasFile'),
        WavefrontFile: require('./filetypes/WavefrontFile'),
        XMLFile: require('./filetypes/XMLFile')
    }

};
