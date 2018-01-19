var AudioFile = require('./AudioFile.js');
var CONST = require('../const');
var FileTypesManager = require('../FileTypesManager');
var JSONFile = require('./JSONFile.js');

//  Phaser.Loader.FileTypes.AudioSprite

FileTypesManager.register('audioSprite', function (key, urls, json, config, audioXhrSettings, jsonXhrSettings)
{
    var audioFile = AudioFile.create(this, key, urls, config, audioXhrSettings);

    if (audioFile)
    {
        var jsonFile;

        if (typeof json === 'string')
        {
            jsonFile = new JSONFile(key, json, this.path, jsonXhrSettings);

            this.addFile(jsonFile);
        }
        else
        {
            jsonFile = {
                type: 'json',
                key: key,
                data: json,
                state: CONST.FILE_WAITING_LINKFILE
            };
        }

        //  Link them together
        audioFile.linkFile = jsonFile;
        jsonFile.linkFile = audioFile;

        //  Set the type
        audioFile.linkType = 'audioSprite';
        jsonFile.linkType = 'audioSprite';

        this.addFile(audioFile);
    }

    return this;
});
