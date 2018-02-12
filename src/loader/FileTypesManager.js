/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var types = {};

var FileTypesManager = {

    install: function (loader)
    {
        for (var key in types)
        {
            loader[key] = types[key];
        }
    },

    register: function (key, factoryFunction)
    {
        types[key] = factoryFunction;

        // console.log('FileTypesManager.register', key);
    },

    destroy: function ()
    {
        types = {};
    }

};

module.exports = FileTypesManager;
