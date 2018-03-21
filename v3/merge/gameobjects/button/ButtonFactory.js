/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.GameObject.Button.FACTORY_KEY = 'button';

/**
* Creates a new Button object.
*
* @method Phaser.GameObject.Factory#button
* @param {number} [x=0] - The x coordinate of the Button. The coordinate is relative to any parent container this button may be in.
* @param {number} [y=0] - The y coordinate of the Button. The coordinate is relative to any parent container this button may be in.
* @param {string} [key] - The image key as defined in the Game.Cache to use as the texture for this button.
* @param {function} [callback] - The function to call when this button is pressed
* @param {object} [callbackContext] - The context in which the callback will be called (usually 'this')
* @param {string|number} [overFrame] - This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [outFrame] - This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [downFrame] - This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [upFrame] - This is the frame or frameName that will be set when this button is in an up state. Give either a number to use a frame ID or a string for a frame name.
* @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
* @return {Phaser.Button} The newly created Button object.
*/
Phaser.GameObject.Button.FACTORY_ADD = function (x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame, group)
{
    if (group === undefined) { group = this.world; }

    return group.add(new Phaser.GameObject.Button(this.game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame));
};

/**
* Creates a new Button object.
*
* @method Phaser.GameObjectCreator#button
* @param {number} [x] X position of the new button object.
* @param {number} [y] Y position of the new button object.
* @param {string} [key] The image key as defined in the Game.Cache to use as the texture for this button.
* @param {function} [callback] The function to call when this button is pressed
* @param {object} [callbackContext] The context in which the callback will be called (usually 'this')
* @param {string|number} [overFrame] This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [outFrame] This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [downFrame] This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
* @param {string|number} [upFrame] This is the frame or frameName that will be set when this button is in an up state. Give either a number to use a frame ID or a string for a frame name.
* @return {Phaser.Button} The newly created button object.
*/
Phaser.GameObject.Button.FACTORY_MAKE = function (x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame)
{
    return new Phaser.GameObject.Button(this.game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
};
