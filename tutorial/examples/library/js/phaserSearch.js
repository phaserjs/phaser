var PHASER = PHASER || {};

PHASER.search = (function(){

    /**
     * Generates an integer score from the match details object
     */
    function scoreDocument(match) {

        var score = 0;

        // title percents are usually high if matched, and that's a good test of relevancy so we'll include
        // the percent directly as relevancy points
        score += match.title.percentMatched;

        // body match percentages are likely to be low since the body will contain tons of words usually.
        // we'll weight them a bit higher so this metric isn't totally overshadowed by body match count or title
        // percentages
        score += match.body.percentMatched * 10;

        //full match count in the body will be the base unit
        score += match.body.fullMatches;

        return Math.floor(score);
    }

    /**
     * Counts the number of times each word occurs in the document
     */
    function countMatches(wordMap, terms){
        var count = 0;

        for (var i in wordMap) {
            terms.forEach(function (term) {
                term = term.toLowerCase();
                if (i === term) {
                    count += wordMap[i];
                }
            });
        }

        return count;
    }

    /**
     * Figures out how many words of the word map the query matches. This is useful because large documents that
     * contain many words are not necessarily a better match than a small one with a high density of the query terms.
     *
     * @param wordMap
     * @param terms
     * @returns {float}
     */
    function calculateMatchPercentage(wordMap, terms){
        var totalWords = 0,
            matchedWords = 0,
            percent;

        for (var i in wordMap) {
            totalWords += wordMap[i];
            terms.forEach(function (term) {
                term = term.toLowerCase();
                if (i === term) {
                    matchedWords += wordMap[i];
                }
            });
        }

        percent = (matchedWords / totalWords) * 100;
        return parseFloat(percent.toFixed(2));
    }

    /**
     * Calculates a match object for a single word map and terms array.
     *
     * @param wordMap
     * @param terms
     * @returns {{fullMatches, percentMatched: string}}
     */
    function matchSection(wordMap, terms){
        var match = {
            fullMatches : countMatches(wordMap, terms),
            percentMatched : calculateMatchPercentage(wordMap, terms)
        };

        return match;
    }

    /**
     * Calculates the full match object given a document and search terms
     *
     * @param document
     * @param terms
     * @returns {{body: {fullMatches, percentMatched: string}, title: {fullMatches, percentMatched: string}}}
     */
    function matchDocument(document, terms) {
        return {
            body: matchSection(document.bodyWords, terms),
            title : matchSection(document.titleWords, terms)
        };
    }

    /**
     * Gets template html using a CSS/jQuery selector and replaces variables with their values, using
     * the format {{VARIABLE}}
     *
     * @param selector
     * @param data
     * @returns {*|jQuery}
     */
    function getTemplateHtml(selector, data){
        var html = $(selector).html();

        for(var i in data){
            if(data.hasOwnProperty(i)){
                var regex = new RegExp('{{'+i+'}}', 'g');
                html = html.replace(regex, data[i]);
            }
        }

        return html;
    }


    /**
     * Renders all results into the search results element.
     *
     * @param results
     */
    function renderResults(results){
        var $resultsContainer = $("#search-results");

        $resultsContainer.html("");

        var count = 0;
        $.each(results, function(i, item){
            var fullPath = './view.html?src=src/' + item.path;
            var segments = item.path.split("/");
            var title = segments.pop();
            var path = segments.join('/');

            if(/boot\.json$/.test(title)){
                segments = path.split("/");
                title = segments.pop();
                path = segments.join('/');
                fullPath = 'boot.html?src=src\\' + item.path.replace(/\//g, "\\");
            }

            title = title.replace(/\.(?:json|js)$/, '');

            var html = getTemplateHtml("#result-row-template", {
                title : title,
                path : path,
                fullPath : fullPath,
                score : item.score
            });


            $resultsContainer.append(html);
            count++;
        });

        if(count === 0){
            $resultsContainer.html("<div class='searching'>No Results.</div>");
        }
    }

    /**
     * Loop through all documents, give each a relevancy score, then return the results sorted by
     * relevancy score descending
     *
     * @param query
     */
    function searchDocuments(query){
        var terms = query.split(/[-\[\],:<>+*=;{}'().\s\d/\\]+/);

        var results = [];
        for (var i in index) {
            var match = matchDocument(index[i], terms);
            var score = scoreDocument(match);
            results.push({
                path  : i,
                score : score
            });
        }

        results.sort(function (a, b) {
            var y = a.score;
            var x = b.score;
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });

        results = results.filter(function(item){
            return item.score > 0;
        });

        return results;
    }

    /**
     * Ensures index data is loaded then calls callback
     */
    function ensureIndexDataThen(callback){
        var indexCount = Object.keys(index).length;

        if(indexCount > 0) {
            callback(index);
            return;
        }

        $.getJSON('./documentIndex.json', function(data){
            index = data;
            callback(index);
        });
    }

    /**
     * Fetches document index data if necessary, then performs search
     * @param query
     */
    function startSearching(query){
        var $results = $("#search-results");

        if($.trim(query) === ""){
            $results.hide();
            return;
        }

        $results.html("<div class='searching'>Searching...</div>");
        $results.show();


        ensureIndexDataThen(function(){
            var results = searchDocuments(query);
            renderResults(results);
        });
    }

    /**
     * Starts the search process when the enter key is pressed. We're forgoing search on every keystroke since
     * this pseudo full-text search can be a bit processor intensive.
     */
    function bindSearchInput() {
        $('#search-query').on('keyup', function (event) {
            if (event.which === 13) {
                var query = $(this).val();
                event.preventDefault();
                startSearching(query);
            }
        });
    }

    /**
     * When the user clicks outside of the search bod or results container this hides the search box
     */
    function bindCloseSearchPopup(){

        $("body").on("click", function(event){
            var $searchContainer = $(event.target).closest("div.search"),
                clickedInSearch = $searchContainer.length > 0;

            if(!clickedInSearch){
                $("#search-results").hide();
            }
        });
    }


    return {
        initialize : function(){
            bindSearchInput();
            bindCloseSearchPopup();
        }
    }
}());