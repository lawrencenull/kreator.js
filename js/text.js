$('button.btn').on('click', function(){ // makes words in bold/italic/underline
	var s = window.getSelection()
	, string = $('.content').text()
	, newstring = string.substring(0, s.baseOffset)
	, tag = $(this).data('textstyle');
	if(tag === 'a') {
		insertHiperlink();
		return;
	}
	newstring += '<'+ tag +'>';
	newstring += string.substring(s.baseOffset, s.extentOffset);
	newstring += '</'+ tag +'>';
	newstring += string.substring(s.extentOffset, string.length-1);
	$('.content').text(newstring);
	$editable.html(newstring);
})

var insertHiperlink = function() {
		
	var s = window.getSelection()
		, string = $('.content').text()
		, newstring = string.substring(0, s.baseOffset)

	newstring += '<a href="#">';
	newstring += string.substring(s.baseOffset, s.extentOffset);
	newstring += '</a>';
	newstring += string.substring(s.extentOffset, string.length-1);
	$('.content').text(newstring);
	$editable.html(newstring);

}