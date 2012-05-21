"use strict"

var _currentSlide = { x: 0, y: 0 }
	, $editable;

Reveal.addEventListener( 'slidechanged', function( event ) {
	hideFooter();
	_currentSlide.y = event.indexh
	_currentSlide.x = event.indexv
} )

$('.add-down').on('click', function(){
	var $current = $('.slides>section').eq(_currentSlide.y)

	if($('section', $current).length) {
		$current = $('section', $current).eq(_currentSlide.x)
		$('<section>new level</section>').insertAfter($current);
	} else {
		// section has no height
		var $content = $('<h2>new slide</h2>').on('click', editSection);
		var $newSlide = $('<section></section>').append($content);
		$current.html('<section>' + $current.html() + '</section>').append($newSlide);
	}
	
	Reveal.navigateDown()
})

$('.add-left').on('click', function(){
	var $current = $('.slides>section').eq(_currentSlide.y)
	var $content = $('<p>new slide</p>').on('click', editSection);
	$('<section></section>')
		.append($content)
		.on('click', hideFooter)
		.insertAfter($current);
	Reveal.navigateRight();
})

var hideFooter = function(e){
	$('#footer').css({
		'height' : 210,
		'bottom' : -220
	}).removeClass()

	var edit = document.getElementsByClassName('content')[0];
	console.log(edit);
}

var editSection = function(e){
	
	e.stopPropagation();
	var tagN = this.nodeName.toLowerCase();
		if(tagN === 'section' || tagN === 'div' || tagN === 'img') return;
	$editable = $(this);
	var content = $editable.html();
	
	$('#footer').css({
		'bottom' : 0
	}).children('.content').text('<' + tagN + '>' + content + '</' + tagN + '>');

	$('#footer .content').on('keyup', function(){
		var string = $('.present').text();
		$('#word-count').text(string.split(' ').length);
		$('#char-count').text(string.length);
		$editable.html($(this).text());
	})

}

var moveImgs = function(e){
	if(e.which > 2) return;
	var o = {
		x : e.clientX,
		y : e.clientY,
		which : e.which
	}
	var $that = $(this);
	if(e.which == 1) {
		var left = parseInt($that.css('left')) || 0;
		var top = parseInt($that.css('top')) || 0;
		$(window).on('mousemove', function(e){

			var x = left + e.clientX - o.x
			var y = top + e.clientY - o.y
			$that.css({
				'left' : x,
				'top' : y
			})

		})
	} else {
		var w = parseInt($that.css('width'));
		var h = parseInt($that.css('height'));
		$(window).on('mousemove', function(e){
			var n = {
				x : e.clientX,
				y : e.clientY
			}
			var d = parseInt(Math.sqrt( (o.x - n.x)*(o.x - n.x) + (o.y - n.y)*(o.y - n.y) ));
			if(n.x > o.x || n.y > o.y) d = -d;
			$that.css({
				'width' : w-d
			})
		})
	}
	$(window).on('mouseup', function(){
		$(window).off('mousemove');
	})
}

$('section>img').on('mousedown', moveImgs)

$('section').on('click', hideFooter)
$('section>*').live('click', editSection)

$('section').on('dblclick', function(){
	if(!$('section', $(this)).length) { // if it's a section with no children
		var $that = $('<p></p>');
		$(this).append($that);
		$that.trigger('click');
		$('.content').focus();
	}
})

$('section>*').on('keydown', function(){
	$('.content').text($(this).html());
})

$('.resize').on('mousedown', function(e){

	var resizeFooter = function(e) {
		var nh = $(document).height() - e.clientY;
		$('#footer').css({ 'height' : nh })
	}

	$(window).on('mousemove', function(e){
		resizeFooter(e);
	});

})

$(window).on('mouseup', function(){
	$(window).off('mousemove');
})

document.getElementsByTagName('section')[0].ondrop = function(e) {
	
	e.preventDefault();
	
	var $this = $(this)
	, file = e.dataTransfer.files[0]
	, reader = new FileReader();
	
	reader.onload = function (e) {
		var img = $('<img src="'+e.target.result+'"></img>').on('mousedown', moveImgs)
			.appendTo($this)
			.bind('dragstart', function(e) { e.preventDefault(); });	
	};

	reader.readAsDataURL(file);
}

$('button.btn').on('click', function(){ // makes words in bold/italic/underline
	var s = window.getSelection()
	, string = $('.content').text()
	, newstring = string.substring(0, s.baseOffset)
	, tag = $(this).data('textstyle');
	newstring += '<'+ tag +'>';
	newstring += string.substring(s.baseOffset, s.extentOffset);
	newstring += '</'+ tag +'>';
	newstring += string.substring(s.extentOffset, string.length-1);
	$('.content').text(newstring);
	$editable.html(newstring);
})