/**
 * Sunlight documentation link plugin
 *
 * This plugin generates hyperlinks to language documentation for certain tokens
 * (e.g. links to php.net for functions).
 *
 * Supported languages:
 *	- PHP (functions and language constructs)
 *	- Ruby (functions)
 *	- Python (functions)
 *	- Perl (functions)
 *	- Lua (functions)
 *
 * Options:
 * 	- enableDocLinks: true/false (default is false)
 */
(function(sunlight, document, undefined){
	if (sunlight === undefined) {
		throw "Include sunlight.js before including plugin files";
	}
	
	var supportedLanguages = {
		php: {
			"function": function(word) { return "http://php.net/" + word; },
			languageConstruct: function(word) { return "http://php.net/" + word; }
		},
		
		ruby: {
			"function": function(word) {
				return "http://www.ruby-doc.org/docs/ruby-doc-bundle/Manual/man-1.4/function.html#" 
					+ word.replace(/!/g, "_bang").replace(/\?/g, "_p");
			}
		},
		
		python: {
			"function": function(word) {
				return "http://docs.python.org/py3k/library/functions.html#" + word;
			}
		},
		
		perl: {
			"function": function(word) { return "http://perldoc.perl.org/functions/" + word + ".html"; }
		},
		
		lua: {
			"function": function(word) { return "http://www.lua.org/manual/5.1/manual.html#pdf-" + word; }
		}
	};
	
	function createLink(transformUrl) {
		return function(context) {
			var link = document.createElement("a");
			link.className = context.options.classPrefix + context.tokens[context.index].name;
			link.setAttribute("href", transformUrl(context.tokens[context.index].value));
			link.appendChild(context.createTextNode(context.tokens[context.index]));
			context.addNode(link);
		};
	}
	
	sunlight.bind("beforeAnalyze", function(context) {
		if (!this.options.enableDocLinks) {
			return;
		}
		
		context.analyzerContext.getAnalyzer = function() {
			var language = supportedLanguages[this.language.name],
				analyzer,
				tokenName;
			
			if (!language) {
				return;
			}
			
			analyzer = sunlight.util.clone(context.analyzerContext.language.analyzer);
			
			for (tokenName in language) {
				if (!language.hasOwnProperty(tokenName)) {
					continue;
				}
				
				analyzer["handle_" + tokenName] = createLink(language[tokenName]);
			}
			
			return analyzer;
		};
		
	});
	
	sunlight.globalOptions.enableDocLinks = false;
	
}(this["Sunlight"], document));