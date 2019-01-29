/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
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

    //  DOM Element Container
    var div = document.createElement('div');

    div.style = [
        'display: block;',
        'width: ' + game.canvas.width + 'px;',
        'height: ' + game.canvas.height + 'px;',
        'padding: 0; margin: 0;',
        'position: absolute;',
        'overflow: hidden;',
        'pointer-events: none;'
    ].join(' ');

    game.domContainer = div;

    AddToDOM(div, config.parent);
};

module.exports = CreateDOMContainer;
