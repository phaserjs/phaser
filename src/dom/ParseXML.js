/**
 * [description]
 *
 * @function Phaser.Dom.ParseXML
 * @since 3.0.0
 *
 * @param {string} data - The XML source stored in a string.
 *
 * @return {any} [description]
 */
var ParseXML = function (data)
{
    var xml = '';

    try
    {
        if (window['DOMParser'])
        {
            var domparser = new DOMParser();
            xml = domparser.parseFromString(data, 'text/xml');
        }
        else
        {
            xml = new ActiveXObject('Microsoft.XMLDOM');
            xml.loadXML(data);
        }
    }
    catch (e)
    {
        xml = null;
    }

    if (!xml || !xml.documentElement || xml.getElementsByTagName('parsererror').length)
    {
        return null;
    }
    else
    {
        return xml;
    }
};

module.exports = ParseXML;
