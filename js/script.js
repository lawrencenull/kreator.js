//"use strict"

var _currentSlide = { x: 0, y: 0 },
	$editable,
	Kreator = new Kreate();

Reveal.addEventListener( 'slidechanged', function( event ) {
	hideFooter();
	Kreator.setSlideX(event.indexh);
	Kreator.setSlideY(event.indexv);
});

function Kreate () {

	var slideX = 0;
	var slideY = 0;

	var setSlideX = function(x) {
		this.slideX = x;
	};

	var setSlideY = function(y) {
		this.slideY = y;
	};

	var getCurrentSlide = function() {
		var s = $('.slides>section').eq(slideX);
		if(s.length > 1) {
			return s[this.slideY];
		} else {
			return s;
		}
	};

	var getDownSlide = function() {
		var s = $('.slides>section').eq(slideX);
		var c = $('section', s);
		if(!c.length) return 0;
		else {
			return c[this.slideY+1];
		}
	};

	var addSlideRight = function(content) {
		var s = getCurrentSlide();
		$('<section>' + content + '</section>').insertAfter(s);
	};

	var addSlideLeft = function(content) {
		var s = getCurrentSlide();
		$('<section>' + content + '</section>').insertBefore(s);
	};

	var addSlideDown = function(content) {
		var s = getCurrentSlide();
		var p = s.parent();
		if(p.hasClass('slides')) {
			var slides = $('<section></section>')
						.append(s.clone())
						.append('<section>'+content+'</section>');
			s.replaceWith(slides);
		} else {
			alert('with children');
		}
	};

	return {
		setSlideY: setSlideY,
		setSlideX: setSlideX,
		addSlideRight: addSlideRight,
		addSlideLeft: addSlideLeft,
		addSlideDown: addSlideDown
	};

}

$('.add-down').on('click', function(){
	Kreator.addSlideDown('dummy');
	Reveal.navigateDown();
});

$('.add-left').on('click', function(){
	Kreator.addSlideRight('dummy');
	Reveal.navigateRight();
});

var hideFooter = function(e){
	$('#footer').css({
		'height' : 210,
		'bottom' : -220
	}).removeClass();
};

var editSection = function(e){
	e.stopPropagation();
	$editable = $(this);

	var tagN = this.nodeName.toLowerCase(),
		content = $editable.html();

	if(tagN === 'section' || tagN === 'div' || tagN === 'img') return;

	if(content[0] !== '<' && tagN !== 'span')
		$('#footer').css({ 'bottom' : 0 })
			.children('.content').text('<' + tagN + '>' + content + '</' + tagN + '>');
		else
			$('#footer').css({ 'bottom' : 0 })
				.children('.content').text(content);


};

$('#footer .content').on('keyup', function(e){
	var string = $('.present').text();
	
	if(e.keyCode == 13) {
		this.innerHTML = this.innerHTML.replace(/(<div>)?|(<div>)+/gi, '')
						.replace(/<\/div>/gi, '')
						.replace(/&nbsp;/gi, ' <br>');
	}

	$('#word-count').text(string.split(' ').length);
	$('#char-count').text(string.length);
	$editable.html(this.innerHTML);
});

var moveImgs = function(e){
	if(e.which > 2) return;
	var o = {
		x : e.clientX,
		y : e.clientY,
		which : e.which
	};
	var $that = $(this);
	if(e.which == 1) {
		var left = parseInt($that.css('left'), 10) || 0;
		var top = parseInt($that.css('top'), 10) || 0;
		$(window).on('mousemove', function(e){

			var x = left + e.clientX - o.x;
			var y = top + e.clientY - o.y;
			$that.css({
				'left' : x,
				'top' : y
			});

		});
	} else {
		var w = parseInt($that.css('width'), 10);
		var h = parseInt($that.css('height'), 10);
		$(window).on('mousemove', function(e){
			var n = {
				x : e.clientX,
				y : e.clientY
			};
			var d = parseInt(Math.sqrt( (o.x - n.x)*(o.x - n.x) + (o.y - n.y)*(o.y - n.y) ), 10);
			if(n.x > o.x || n.y > o.y) d = -d;
			$that.css({
				'width' : w-d
			});
		});
	}
	$(window).on('mouseup', function(){
		$(window).off('mousemove');
	});
};

$('section').on('click', function(){
	if($(this).parent().hasClass('slides')) { // if it's a section with no children
		var $span = $('<span></span>')
				.on('click', editSection);
		$span.appendTo($(this)).trigger('click'); // append to section and trigger edit
		$('.content').focus();
	}
});

$('section>*').on('click', editSection);


$('.resize').on('mousedown', function(e){

	var resizeFooter = function(e) {
		var nh = $(document).height() - e.clientY;
		$('#footer').css({ 'height' : nh });
	};

	$(window).on('mousemove', function(e){
		resizeFooter(e);
	});

	$(window).on('mouseup', function(){
		$(window).off('mousemove');
	});
});


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

document.getElementsByClassName('close')[0].addEventListener('click', hideFooter, false);