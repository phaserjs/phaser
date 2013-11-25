module.exports = Material;

var idCounter = 0;

/**
 * Defines a physics material.
 * @class Material
 * @constructor
 * @param string name
 * @author schteppe
 */
function Material(){
    /**
    * The material identifier
    * @property id
    * @type {Number}
    */
    this.id = idCounter++;
};
