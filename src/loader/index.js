//  Phaser.Loader

module.exports = {

    LoaderPlugin: require('./LoaderPlugin'),
    File: require('./File'),
    FileTypesManager: require('./FileTypesManager'),

    FileTypes: {
        AnimationJSONFile: require('./filetypes/AnimationJSONFile'),
        AtlasJSONFile: require('./filetypes/AtlasJSONFile'),
        AudioFile: require('./filetypes/AudioFile'),
        AudioSprite: require('./filetypes/AudioSprite'),
        BinaryFile: require('./filetypes/BinaryFile'),
        BitmapFontFile: require('./filetypes/BitmapFontFile'),
        GLSLFile: require('./filetypes/GLSLFile'),
        HTMLFile: require('./filetypes/HTMLFile'),
        ImageFile: require('./filetypes/ImageFile'),
        JSONFile: require('./filetypes/JSONFile'),
        MultiAtlas: require('./filetypes/MultiAtlas'),
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
