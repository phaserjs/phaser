{
    //  An Asset Pack is a means to control the loading of assets into Phaser via a JSON file.
    //  Use Phaser.Loader.pack to load your data file.
    //  
    //  The file is split into sections. In this example they are "level1" and "level2".
    //  Sections are a way for you to control the splitting-up of asset loading, so you don't have
    //  to load everything at once.
    //  
    //  The key you use for the sections is entirely up to you and is passed to the Phaser.Loader.pack call.
    //  
    //  Within each section is an Array of objects. Each object corresponds to a single file to be loaded.
    //  The "type" property controls the type of file.
    //  Note that lots of the file properties are optional.
    //  See the Loader API Documentation to find out which ones, as they match the API calls exactly.
    //  
    //  Where a file type has a callback, such as "script", the context in which the callback is run
    //  should be passed to the Phaser.Loader.pack method. See the examples for further details.
    "level1": [
        {
            //   Loads an Image
            "type": "image",
            "key": "ball",
            "url": "assets/sprites/shinyball.png",
            "overwrite": false
        },
        {
            //   Loads a Text File
            "type": "text",
            "key": "readme",
            "url": "assets/sprites/readme.txt",
            "overwrite": false
        },
        {
            //   Loads a JSON File
            "type": "json",
            "key": "levelData",
            "url": "assets/level1.json",
            "overwrite": false
        },
        {
            //   Loads a generic XML document
            "type": "xml",
            "key": "level-01-definitions",
            "url": "assets/data/level-01-definitions.xml",
            "overwrite": false
        },
        {
            //   Loads a JavaScript File with optional callback
            "type": "script",
            "key": "webfonts",
            "url": "http://blah.com/font.js",
            "callback": "parseFontLoader"
        },
        {
            //   Loads a Binary File with optional callback
            "type": "binary",
            "key": "data",
            "url": "assets/test/wibble.bmp",
            "callback": "parseBinary"
        },
        {
            //   Loads a Sprite Sheet File
            "type": "spritesheet",
            "key": "webfonts",
            "url": "assets/sprites/mummy.png",
            "frameWidth": 32,
            "frameHeight": 64,
            "frameMax": 10,
            "margin": 0,
            "spacing": 0
        },
        {
            //   Loads a Video File
            "type": "video",
            "key": "chrome",
            "urls": [ "assets/video/chrome.webm", "assets/video/chrome.m4v" ]
        },
        {
            //   Loads an Audio File
            "type": "audio",
            "key": "boden",
            "urls": ["assets/audio/bodenstaendig_2000_in_rock_4bit.mp3", "assets/audio/bodenstaendig_2000_in_rock_4bit.ogg"],
            "autoDecode": true
        },
        {
            //   Loads an Audiosprite file and its metadata
            "type": "audiosprite",
            "key": "dialog",
            "urls": [ "assets/audiosprites/dialog.m4a", "assets/audiosprites/dialog.oga" ],
            "jsonURL": "assets/audiosprites/dialog.json",
            "jsonData": null,
            "autoDecode": true
        },
        {
            //   Loads a Tilemap File - in this example a CSV file.
            //   The format matches Phaser.Tilemap consts.
            "type": "tilemap",
            "key": "level1",
            "url": "assets/tilemaps/level1.csv",
            "data": null,
            "format": "CSV"
        },
        {
            //   Loads a Tilemap File - in this example a Tiled JSON file.
            //   The format matches Phaser.Tilemap consts.
            "type": "tilemap",
            "key": "level2",
            "url": "assets/tilemaps/level2.json",
            "data": null,
            "format": "TILED_JSON"
        },
        {
            //   Loads a Physics data File - in this example a Lime Corona file.
            //   The format matches Phaser.Loader consts.
            "type": "physics",
            "key": "ship",
            "url": "assets/physics/ship_physics.json",
            "data": null,
            "format": "LIME_CORONA_JSON"
        },
        {
            //   Loads a Bitmap Font File.
            "type": "bitmapFont",
            "key": "desyrel",
            "textureURL": "assets/fonts/bitmapFonts/desyrel.png",
            "atlasURL": "assets/fonts/bitmapFonts/desyrel.xml",
            "atlasData": null,
            "xSpacing": 0,
            "ySpacing": 0
        },
        {
            //   Loads a JSON Array format Texture Atlas.
            "type": "atlasJSONArray",
            "key": "map",
            "textureURL": "assets/sprites/map.png",
            "atlasURL": "assets/sprites/map.json",
            "atlasData": null
        },
        {
            //   Loads a JSON Hash format Texture Atlas.
            "type": "atlasJSONHash",
            "key": "map",
            "textureURL": "assets/sprites/map.png",
            "atlasURL": "assets/sprites/map.json",
            "atlasData": null
        },
        {
            //   Loads a Starling XML format Texture Atlas.
            "type": "atlasXML",
            "key": "map",
            "textureURL": "assets/sprites/map.png",
            "atlasURL": "assets/sprites/map.xml",
            "atlasData": null
        },
        {
            //   Loads a Texture Atlas where you specify the format.
            "type": "atlas",
            "key": "map",
            "textureURL": "assets/sprites/map.png",
            "atlasURL": "assets/sprites/map.json",
            "atlasData": null,
            "format": "TEXTURE_ATLAS_JSON_ARRAY"
        }
    ],
    //  Here's an example of another section within the Asset Pack.
    "level2": [
        {
            "type": "image",
            "key": "ball",
            "url": "assets/sprites/shinyball.png",
            "overwrite": false
        }
    ],
    //  The meta block allows you to define data specific to the Tool / app that created this JSON file.
    //  
    //  generated: Required - String - A Unix Timestamp (or Date.now() from JS) that signifies when this JSON file was created.
    //  version: Required - String - Should be "1.0"
    //  app: Required - String containing the name of the app (or web site) that generated this JSON file.
    //  url: Optional - String containing the URL of the app (or web site) that generated this JSON file.
    //  copyright: Optional - String - A copyright notice.
    //  
    //  You can add as many extra properties as your app requires, only the above are needed / reserved as of 1.0
    "meta": {
        "generated": "1401380327373",
        "version": "1.0",
        "app": "Phaser Asset Packer",
        "url": "http://phaser.io",
        "copyright": "Photon Storm Ltd. 2014"
    }
}
