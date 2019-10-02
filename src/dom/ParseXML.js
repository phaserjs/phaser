/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes the given data string and parses it as XML.
 * First tries to use the window.DOMParser and reverts to the Microsoft.XMLDOM if that fails.
 * The parsed XML object is returned, or `null` if there was an error while parsing the data.
 *
 * @function Phaser.DOM.ParseXML
 * @since 3.0.0
 *
 * @param {string} data - The XML source stored in a string.
 *
 * @return {?(DOMParser|ActiveXObject)} The parsed XML data, or `null` if the data could not be parsed.
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
