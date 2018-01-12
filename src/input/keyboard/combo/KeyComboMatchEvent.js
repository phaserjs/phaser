var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var KeyComboMatchEvent = new Class({

    Extends: Event,

    initialize:

    function KeyComboMatchEvent (keyCombo, keyboardEvent)
    {
        Event.call(this, 'KEY_COMBO_MATCH_EVENT');

        this.data = keyCombo;
    }

});

module.exports = KeyComboMatchEvent;
