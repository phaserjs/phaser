/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var AddToDOM = require('../dom/AddToDOM');

var CreateDOMContainer = function (game)
{
    var config = game.config;

    if (!config.parent || !config.domCreateContainer)
    {
        return;
    }

    var width = game.canvas.width;
    var height = game.canvas.height;

    var z = (config.domBehindCanvas) ? 1 : 3;

    //  DOM Element Container
    var div = document.createElement('div');

    div.style = 'width: ' + width + 'px; height: ' + height + 'px; padding: 0; margin: 0; position: absolute; overflow: hidden; pointer-events: none; z-index: ' + z;

    // game.canvas.style.position = 'absolute';
    // game.canvas.style.zIndex = '2';
    // game.canvas.parentElement.style.position = 'relative';

    game.domContainer = div;

    AddToDOM(div, config.parent);
};

module.exports = CreateDOMContainer;
