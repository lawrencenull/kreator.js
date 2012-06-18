//"use strict"

var Kreator = (function(options) {

	var slideX = 0,
		slideY = 0,
		$ = options.$,
		dummyText = $('<span>new slide</span>'),
		Reveal = options.Reveal,
		count = 1;

	var addContentToSlide = function() {
		$(this).html('');
		console.log('adding content');
		console.log($(this));
		if($(this).parent().hasClass('slides')) { // if it's a section with no children
			var $span = $('<span/>')
					.on('click', Kreator.editSection);
			$span.appendTo($(this)).trigger('click'); // append to section and trigger edit
			$('.content').focus();
		}
	};
	
	Reveal.addEventListener( 'slidechanged', function( event ) {
		hideFooter();
		Kreator.setSlideX(event.indexh);
		Kreator.setSlideY(event.indexv);
	});

	options.down.on('click', function(){
		Kreator.addSlideDown('dummy');
		Reveal.navigateDown();
	});

	options.right.on('click', function(){
		Kreator.addSlideRight('dummy');
		Reveal.navigateRight();
	});

	var setSlideX = function(x) {
		slideX = x;
	};

	var setSlideY = function(y) {
		slideY = y;
	};

	var getCurrentSlide = function() {
		var s = $('.present');
		if(!s.hasClass('stack')) {
			if(s.length > 1) {
				return s.eq(slideX);
			} else {
				return s;
			}
		}
		else {
			return $('section', s).eq(slideY);
		}
	};

	var getDownSlide = function() {
		var s = $('.slides>section').eq(slideX),
			c = $('section', s);
		if(!c.length) return 0;
		else {
			return c[this.slideY+1];
		}
	};

	var addSlideRight = function(content) {
		var c = dummyText.clone().html('<h2>' + (++count) + '</h2>').on('click', editSection),
			s = this.getCurrentSlide();

		// if the current slide is the last slide on the X axis we append to the parent
		if($('.slides>section').length == slideX+1) {
			var section = $('<section/>').append(c);
			$('.slides').append(section);
		} else {
			// else we just append after the current element
			$('<section/>')
				.append(c)
				.insertAfter(s);
		}
	};

	var addSlideLeft = function(content) {
		dummyText.on('click', editSection);
		var s = this.getCurrentSlide();
		$('<section/>')
			.append(dummyText.clone())
			.insertBefore(s);
	};

	var addSlideDown = function(content) {

		var s = this.getCurrentSlide();
		dummyText.on('click', editSection);

		if(s.parent().hasClass('slides')) {
			var c = $('<section/>').append(s.html());
			var ns = $('<section/>').append(dummyText.clone());

			s.html('').append(c).append(ns);
		} else {
			$('<section/>').text('new slide').insertAfter(s);
		}

	};

	var editSection = function(e){
		e.stopPropagation();
		console.log('edit section', $(this));
		//if($('section', $(this).parent()).length) return; // weird bug this needs fixing !
		if(!$(this).parent().hasClass('present')) return;
		$editable = $(this);

		var tagN = this.nodeName.toLowerCase(),
			content = $editable.html();

		if(['div', 'img'].indexOf(tagN) >= 0) return;

		if(content[0] !== '<' && tagN !== 'span')
			$('#footer').css({ 'bottom' : 0 })
				.children('.content')
				.html('<' + tagN + '>' + content + '</' + tagN + '>');
			else
				$('#footer').css({ 'bottom' : 0 })
					.children('.content')
					.html(content);
	};

	return {
		addSlideDown: addSlideDown,
		addSlideRight: addSlideRight,
		addSlideLeft: addSlideLeft,
		editSection: editSection,
		setSlideX: setSlideX,
		setSlideY: setSlideY,
		getCurrentSlide: getCurrentSlide
	};
}({
	Reveal: Reveal,
	down: $('.add-down'),
	right: $('.add-right'),
	$: $
}));

var $editable;

var hideFooter = function(e){
	$('#footer').css({
		'height' : 210,
		'bottom' : -220
	}).removeClass();
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
	var s = Kreator.getCurrentSlide();
	var span = $('<span/>').on('click', Kreator.editSection);
	s.append(span);
	span.trigger('click');
})

$('section>*').on('click', Kreator.editSection);


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
		var img = $('<img/>')
			.attr('src', e.target.result)
			.on('mousedown', moveImgs)
			.appendTo($this)
			.bind('dragstart', function(e) { e.preventDefault(); });
	};

	reader.readAsDataURL(file);
}

document.getElementsByClassName('close')[0].addEventListener('click', hideFooter, false);