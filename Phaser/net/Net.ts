/// <reference path="../_definitions.ts" />

/**
* Phaser - Net
*
* 
*/

module Phaser {

    export class Net {

        /**
         * Net constructor
         */
        constructor(game: Phaser.Game) {

            this.game = game;

        }

        /**
         * Local reference to the current Phaser.Game.
         */
        public game: Phaser.Game;

        /**
         * Compares the given domain name against the hostname of the browser containing the game.
         * If the domain name is found it returns true.
         * You can specify a part of a domain, for example 'google' would match 'google.com', 'google.co.uk', etc.
         * Do not include 'http://' at the start.
         */
        public checkDomainName(domain: string): bool {
            return window.location.hostname.indexOf(domain) !== -1;
        }

        /**
         * Updates a value on the Query String and returns it in full.
         * If the value doesn't already exist it is set.
         * If the value exists it is replaced with the new value given. If you don't provide a new value it is removed from the query string.
         * Optionally you can redirect to the new url, or just return it as a string.
         */
        public updateQueryString(key: string, value: string, redirect:bool = false, url: string = ''):string {

            if (url == '')
            {
                url = window.location.href;
            }

            var output: string = '';

            var re:RegExp = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");

            if (re.test(url))
            {
                if (typeof value !== 'undefined' && value !== null)
                {
                    output = url.replace(re, '$1' + key + "=" + value + '$2$3');
                }
                else
                {
                    output = url.replace(re, '$1$3').replace(/(&|\?)$/, '');
                }
            }
            else
            {
                if (typeof value !== 'undefined' && value !== null)
                {
                    var separator = url.indexOf('?') !== -1 ? '&' : '?';
                    var hash = url.split('#');

                    url = hash[0] + separator + key + '=' + value;

                    if (hash[1])
                    {
                        url += '#' + hash[1];
                    }

                    output = url;
                }
                else
                {
                    output = url;
                }
            }

            if (redirect)
            {
                window.location.href = output;
            }
            else
            {
                return output;
            }

        }

        /**
         * Returns the Query String as an object.
         * If you specify a parameter it will return just the value of that parameter, should it exist.
         */
        public getQueryString(parameter: string = '') {

            var output = {};
            var keyValues = location.search.substring(1).split('&');

            for (var i in keyValues)
            {
                var key = keyValues[i].split('=');

                if (key.length > 1)
                {
                    if (parameter && parameter == this.decodeURI(key[0]))
                    {
                        return this.decodeURI(key[1]);
                    }
                    else
                    {
                        output[this.decodeURI(key[0])] = this.decodeURI(key[1]);
                    }
                }
            }

            return output;

        }

        private decodeURI(value: string): string {
            return decodeURIComponent(value.replace(/\+/g, " "));
        }


    }

}
