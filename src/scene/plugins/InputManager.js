var Class = require('../../utils/Class');
var SceneInputManager = require('../../input/local/SceneInputManager');

var InputManager = new Class({

    Extends: SceneInputManager,

    initialize:

    function InputManager (scene)
    {
        SceneInputManager.call(this, scene);
    }

});

module.exports = InputManager;
