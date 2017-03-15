var Text = require('./Text');
var FactoryContainer = require('../../FactoryContainer');

var TextFactory = {

    KEY: 'text',

    add: function (x, y, text, style)
    {
        return this.state.children.add(new Text(this.state, x, y, text, style));
    },

    make: function (x, y, text, style)
    {
        return new Text(this.state, x, y, text, style);
    }

};

module.exports = FactoryContainer.register(TextFactory);
