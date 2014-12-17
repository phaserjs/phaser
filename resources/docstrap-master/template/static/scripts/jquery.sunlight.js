/**
 * jQuery plugin for Sunlight http://sunlightjs.com/
 *
 * by Tommy Montgomery http://tmont.com/
 * licensed under WTFPL http://sam.zoy.org/wtfpl/
 */
(function($, window){
	
	$.fn.sunlight = function(options) {
		var highlighter = new window.Sunlight.Highlighter(options);
		this.each(function() {
			highlighter.highlightNode(this);
		});
		
		return this;
	};
	
}(jQuery, this));