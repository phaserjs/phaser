/**
 * Sunlight line number/line highlighting plugin
 *
 * This creates the line number gutter in addition to creating the line highlighting
 * overlay (if applicable). It is bundled in sunlight-min.js.
 *
 * Options:
 * 	- lineNumbers: true/false/"automatic" (default is "automatic")
 * 	- lineNumberStart: <number> (line number to start from, default is 1)
 *	- lineHighlight: <array> (array of line numbers to highlight)
 */
(function(sunlight, document, undefined){
	if (sunlight === undefined) {
		throw "Include sunlight.js before including plugin files";
	}
	
	function getLineCount(node) {
		//browsers don't render the last trailing newline, so we make sure that the line numbers reflect that
		//by disregarding the last trailing newline
		
		//get the last text node
		var lastTextNode = function getLastNode(node) {
			if (!node.lastChild) {
				return null;
			}
			
			if (node.lastChild.nodeType === 3) {
				return node.lastChild;
			}
			
			return getLastNode(node.lastChild);
		}(node) || { lastChild: "" };
		
		return node.innerHTML.replace(/[^\n]/g, "").length - /\n$/.test(lastTextNode.nodeValue);
	}
	
	sunlight.bind("afterHighlightNode", function(context) {
		var lineContainer,
			lineCount,
			lineHighlightOverlay,
			currentLineOverlay,
			lineHighlightingEnabled,
			i,
			eol,
			link,
			name;
		
		if (!this.options.lineNumbers) {
			return;
		}
		
		if (this.options.lineNumbers === "automatic" && sunlight.util.getComputedStyle(context.node, "display") !== "block") {
			//if it's not a block level element or the lineNumbers option is not set to "automatic"
			return;
		}
		
		lineContainer = document.createElement("pre");
		lineCount = getLineCount(context.node);
		
		lineHighlightingEnabled = this.options.lineHighlight.length > 0;
		if (lineHighlightingEnabled) {
			lineHighlightOverlay = document.createElement("div");
			lineHighlightOverlay.className = this.options.classPrefix + "line-highlight-overlay";
		}
		
		lineContainer.className = this.options.classPrefix + "line-number-margin";

		eol = document.createTextNode(sunlight.util.eol)
		for (i = this.options.lineNumberStart; i <= this.options.lineNumberStart + lineCount; i++) {
			link = document.createElement("a");
			name = (context.node.id ? context.node.id : this.options.classPrefix + context.count) + "-line-" + i;
			
			link.setAttribute("name", name);
			link.setAttribute("href", "#" + name);
			
			link.appendChild(document.createTextNode(i));
			lineContainer.appendChild(link);
			lineContainer.appendChild(eol.cloneNode(false));
			
			if (lineHighlightingEnabled) {
				currentLineOverlay = document.createElement("div");
				if (sunlight.util.contains(this.options.lineHighlight, i)) {
					currentLineOverlay.className = this.options.classPrefix + "line-highlight-active";
				}
				lineHighlightOverlay.appendChild(currentLineOverlay);
			}
		}

		context.codeContainer.insertBefore(lineContainer, context.codeContainer.firstChild);
		
		if (lineHighlightingEnabled) {
			context.codeContainer.appendChild(lineHighlightOverlay);
		}
		
		//enable the border on the code container
		context.codeContainer.style.borderWidth = "1px";
		context.codeContainer.style.borderStyle = "solid";
	});
	
	sunlight.globalOptions.lineNumbers = "automatic";
	sunlight.globalOptions.lineNumberStart = 1;
	sunlight.globalOptions.lineHighlight = [];
	
}(this["Sunlight"], document));