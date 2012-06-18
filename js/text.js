$('button.btn').on('click', function(){ // makes words in bold/italic/underline
	var s = window.getSelection()
	, string = $('.content').text()
	, newstring = ''
	, tag = $(this).data('textstyle')
	, find = string.substring(s.baseOffset, s.extentOffset);

	if(s.baseOffset == s.extentOffset) return;

	if(tag === 'a') {
		insertHiperlink($(this));
		return;
	}

	newstring += '<'+ tag +'>';
	newstring += string.substring(s.baseOffset, s.extentOffset);
	newstring += '</'+ tag +'>';
	
	string = $('.content').html();
	string = string.replace(find, newstring);

	$('.content').html(string);
	$editable.html(string);
});

var insertHiperlink = function(that) {
		
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

				$('.content').html(string);
				$editable.html(string);
				$(this).remove();
			}
		});
};