/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var DOMElement = require('./DOMElement');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new DOM Element Game Object and adds it to the parent DOM Container.
 * 
 * The game must have been configured with the `dom.createContainer` property set to `true` for this to work.
 *
 * Note: This method will only be available if the DOM Element Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#dom
 * @since 3.17.0
 *
 * @param {number} x - The horizontal position of this DOM Element in the world.
 * @param {number} y - The vertical position of this DOM Element in the world.
 * @param {(HTMLElement|string)} [element] - An existing DOM element, or a string. If a string starting with a # it will do a `getElementById` look-up on the string (minus the hash). Without a hash, it represents the type of element to create, i.e. 'div'.
 * @param {(string|any)} [style] - If a string, will be set directly as the elements `style` property value. If a plain object, will be iterated and the values transferred. In both cases the values replacing whatever CSS styles may have been previously set.
 * @param {string} [innerText] - If given, will be set directly as the elements `innerText` property value, replacing whatever was there before.
 *
 * @return {Phaser.GameObjects.DOMElement} The Game Object that was created.
 */
GameObjectFactory.register('dom', function (x, y, element, style, innerText)
{
    return this.displayList.add(new DOMElement(this.scene, x, y, element, style, innerText));
});
