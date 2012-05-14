"use strict"

var _currentSlide = {
	x: 0,
	y: 0
	}
	, $editable
	;

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
		'height' : 180,
		'bottom' : -180
	}).removeClass();
	if($editable && $editable.children()[0]) {
		$editable.replaceWith($editable.children()[0]);
	}
}

var editSection = function(e){
	
	e.stopPropagation();
	var tagName = this.nodeName.toLowerCase();
		if(tagName === 'section' || tagName === 'div') return;
	$editable = $(this);
	var content = $(this).html();
	
	$('#footer').css({
		'bottom' : 0
	}).children('.content').text('<' + tagName + '>' + content + '</' + tagName + '>');

	$('#footer .content').on('keyup', function(){
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
	console.log(e.which);
	if(e.which == 1) {
		var left = parseInt($that.css('left')) || 0;
		var top = parseInt($that.css('top')) || 0;
		$(window).on('mousemove', function(e){
			var newpos = {
				x : e.clientX,
				y : e.clientY
			}
			var x = left + newpos.x - o.x
			var y = top + newpos.y - o.y
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
			
			var diag = Math.sqrt(w*w + h*h);
			var p = d*100/diag;
			$that.css({
				'width' : w/p,
				'height' : h/p
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
	var $that = $('<p></p>');
	$(this).append($that);
	$that.trigger('click');
	$('.content').focus();
})

$('.resize').on('mousedown', function(e){

	var resizeFooter = function(e) {
		var nh = $(document).height() - e.clientY;
		if(nh>0) {
			$('#footer').css({
				'height' : nh
			})
				if(nh > 250) {
					$('#footer').addClass('large');
				}
				if(nh > 350) {
					$('#footer').removeClass('large').addClass('larger');
				}
		} 
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
	, reader = new FileReader()
	;
	
	reader.onload = function (event) {
		var img = $('<img></img>').on('mousedown', moveImgs)
			.attr('dragable', true)
			.attr('src', event.target.result)
			.appendTo($this)
			.bind('dragstart', function(event) { event.preventDefault(); });

		// var div = $('<div class="img"></div>').css({
		// 			width: parseInt(img.css('width')),
		// 			height: parseInt(img.css('height'))
		// 		})
		// 	.appendTo($this);
		// img.detach().appendTo(div).show()
		// 	
	};

	reader.readAsDataURL(file);

}