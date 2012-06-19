define(['jquery'], function($) {
	return {
		format: function(that) {
			// makes words in bold/italic/underline
			var s = window.getSelection()
			, string = $('.content').text()
			, newstring = ''
			, tag = $(that).data('textstyle')
			, find = string.substring(s.baseOffset, s.extentOffset);

			if(s.baseOffset == s.extentOffset) return;

			newstring += '<'+ tag +'>';
			newstring += string.substring(s.baseOffset, s.extentOffset);
			newstring += '</'+ tag +'>';
			
			string = $('.content').html();
			string = string.replace(find, newstring);

			return string;
		},
		insertHiperlink: function(that, span) {
			console.log('inserting link', $(that));
			var s = window.getSelection()
				, string = $('.content').text()
				, newstring = ''
				, find = string.substring(s.baseOffset, s.extentOffset);

			if(!$('input', that).length)
				$('<input>').appendTo(that)
					.on('keyup', function(e){
					var code = (e.keyCode ? e.keyCode : e.which);
					if(code == 13) {
						newstring += '<a href="http://'+$(this).val()+'">';
						newstring += find;
						newstring += '</a>';

						string = $('.content').html().replace(find, newstring);

						$(this).remove();
						$('.content').html(string);
						span.html(string);
					}
				});
		}
	};
		
});