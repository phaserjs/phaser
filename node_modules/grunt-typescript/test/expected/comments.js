/**
* Simple 1 module
*/
var Simple1;
(function (Simple1) {
    /**
    * main function
    * @param name your name
    * @returns {string} message
    */
    function main(name) {
        if (typeof name === "undefined") { name = ""; }
        return "hello " + name;
    }
    Simple1.main = main;
})(Simple1 || (Simple1 = {}));
Simple1.main();
