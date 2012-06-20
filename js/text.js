define(['jquery'], function($) {
	return {
		// wrap the selected text in apropriate tags // makes words in bold/italic/underline
		format: function(tag, span) {
			var s = window.getSelection()
			, newstring = ''
			, find = s.toString(); // get the selection

			if(s.baseOffset == s.extentOffset) return; // if nothing is selected

			newstring += '<'+ tag +'>' + find + '</'+ tag +'>'; // wrap in apropriate tag
			
			var string = span.html();
			return string.replace(find, newstring); // replace the old word with the wrapped word
		},
		insertHiperlink: function(that, span) {
			var s = window.getSelection()
				, newstring = ''
				, find = s.toString();

			if(!$('input', that).length)
				$('<input type="text">').appendTo(that)
					.on('keyup', function(e){
					var code = (e.keyCode ? e.keyCode : e.which);
					if(code == 13) {
						
						newstring += '<a href="http://'+$(this).val()+'">';
						newstring += find;
						newstring += '</a>';
						
						var string = span.html().replace(find, newstring);

						$(this).remove();
						span.html(string);
					}
				}).focus();
		},
		// wrap the span in various tags
		paragraph: function(tag, span) {
			return '<' +tag + '>' + span.html() + '</' + tag + '>';
		},
		// align the text
		align: function(tag, span) {
			var align = $('.alignment', span);
			if(align.length) { // if a class to align the element exists
				if(tag === 'center') { // if we want to center just remove the outer div
					return align.html();
				} else { // just replace the class
					align.removeClass();
					align.addClass('alignment pull-' + tag);
					return span.html();
				}
			// no previous alignment so just add the apropriate class
			} else return '<div class="alignment pull-' +tag + '">' + span.html() + '</div>';
		}
	};
		
});