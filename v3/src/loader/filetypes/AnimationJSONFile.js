var JSONFile = require('./JSONFile.js');

var AnimationJSONFile = function (key, url, path, xhrSettings)
{
    var json = new JSONFile(key, url, path, xhrSettings);

    //  Override the File type
    json.type = 'animationJSON';

    return json;
};

module.exports = AnimationJSONFile;
