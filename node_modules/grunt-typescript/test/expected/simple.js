var Simple1;
(function (Simple1) {
    function main() {
        return "hello simple1";
    }
    Simple1.main = main;
})(Simple1 || (Simple1 = {}));
Simple1.main();
