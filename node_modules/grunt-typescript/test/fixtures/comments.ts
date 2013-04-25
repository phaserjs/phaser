/**
 * Simple 1 module
 */
module Simple1 {
    /**
     * main function
     * @param name your name
     * @returns {string} message
     */
    export function main(name:string = "") {
        return "hello " + name;
    }
}

Simple1.main();