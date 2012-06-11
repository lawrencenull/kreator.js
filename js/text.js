$('button.btn').on('click', function(){ // makes words in bold/italic/underline
	var s = window.getSelection()
	, string = $('.content').text()
	, newstring = ''
	, tag = $(this).data('textstyle')
	, find = string.substring(s.baseOffset, s.extentOffset);

	if(tag === 'a') {
		insertHiperlink();
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

var insertHiperlink = function() {
		
	var s = window.getSelection()
		, string = $('.content').text()
		, newstring = ''
		, find = string.substring(s.baseOffset, s.extentOffset);

	console.log(string, ' looking for ', find)
	console.log(s);

	newstring += '<a href="#">';
	newstring += find;
	newstring += '</a>';

	string = $('.content').html();

	console.log('replace ', find, ' with ', newstring)

	string = string.replace(find, newstring);

	$('.content').html(string);
	$editable.html(string);

}