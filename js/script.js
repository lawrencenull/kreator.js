define(['text', 'jquery'], function(textStyle, $){
	
	var Kreator = (function (options) {

		var slideX = 0,
			slideY = 0,
			$ = options.jquery,
			Reveal = options.reveal,
			dummyText = $('<span>new slide</span>'),
			$span;

		var init = function() {

			options.right = $('<div data-direction="right"></div>')
					.addClass('add-slide add-right')
					.text('+');
			
			options.down = $('<div data-direction="bottom"></div>')
					.addClass('add-slide add-down')
					.text('+');

			$('body').append(options.right)
				.append(options.down);

			options.down.on('click', function(){
				Kreator.addSlideDown('dummy');
				Reveal.navigateDown();
			});

			options.right.on('click', function(){
				Kreator.addSlideRight('dummy');
				Reveal.navigateRight();
			});

			Reveal.addEventListener( 'slidechanged', function( event ) {
				Kreator.hideFooter();
				Kreator.setSlideX(event.indexh);
				Kreator.setSlideY(event.indexv);
			});

			$('section').on('click', function(){
				var s = Kreator.getCurrentSlide();
				var span = $('<span/>').on('click', Kreator.editSection);
				s.append(span);
				span.trigger('click');
			});

			$('section>*').on('click', Kreator.editSection);

			$('#footer .content').on('keyup', function(e){
				var string = $('.present').text();
				
				if(e.keyCode == 13) {
					this.innerHTML = this.innerHTML.replace(/<div>/gi, '')
									.replace(/<\/div>/gi, '')
									.replace(/&nbsp;/gi, ' <br>');
				}

				$('#word-count').text(string.split(' ').length);
				$('#char-count').text(string.length);
				$span.html(this.innerHTML);
			});

			$('.btn').on('click', function(){
				var tag = $(this).data('textstyle');
				if(tag === 'a')
					textStyle.insertHiperlink(this, $span);	
				else {
					var string = textStyle.format(this);
					$('.content').html(string);
					updateSectionContent();
				}
			});

			$('button.close').on('click', this.hideFooter);

		};

		var addContentToSlide = function() {
			var s = this.getCurrentSlide();
			var span = $('<span/>').on('click', this.editSection);
			s.append(span);
			span.trigger('click');
		};
		

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
			var c = dummyText.clone().on('click', this.editSection),
				s = this.getCurrentSlide();

			// if the current slide is the last slide on the X axis we append to the parent
			if($('.slides>section').length == slideX+1) {
				var section = $('<section/>')
							.on('click', function(){
								var span = $('<span/>').on('click', this.editSection);
								s.append(span);
								span.trigger('click');
							})
							.append(c);
				$('.slides').append(section);
			} else {
				// else we just append after the current element
				$('<section/>')
					.on('click', function(){console.log('add span 2')})
					.append(c)
					.insertAfter(s);
			}
		};

		var addSlideLeft = function(content) {
			dummyText.on('click', this.editSection);
			var s = this.getCurrentSlide();
			$('<section/>')
				.append(dummyText.clone())
				.insertBefore(s);
		};

		var addSlideDown = function(content) {

			var s = this.getCurrentSlide();
			var d = dummyText.clone().on('click', this.editSection);

			if(s.parent().hasClass('slides')) {
				var c = $('<section/>').append(s.html());
				var ns = $('<section/>').append(d);

				s.html('').append(c).append(ns);
			} else {
				$('<section/>').append(d).insertAfter(s);
			}

		};

		var editSection = function(e){
			e.stopPropagation();
			var tagN = this.nodeName.toLowerCase()
				, content = '';

			$span = $(this);

			if(tagN !== 'span') content = '<' + tagN + '>' + $(this).html() + '</' + tagN + '>';
			else content = $(this).html();
			$('#footer').css({'bottom':0})
				.children('.content')
				.html(content);
		};

		var updateSectionContent = function() {
			$span.html($('.content').html());
		};

		var hideFooter = function(e){
			$('#footer').css({
				'height' : 210,
				'bottom' : -220
			}).removeClass();
		};

		return {
			addSlideDown: addSlideDown,
			addSlideRight: addSlideRight,
			addSlideLeft: addSlideLeft,
			editSection: editSection,
			setSlideX: setSlideX,
			setSlideY: setSlideY,
			getCurrentSlide: getCurrentSlide,
			hideFooter: hideFooter,
			init: init
		};
	})({
		jquery: $,
		reveal: Reveal
	});

	return Kreator;
});

// var moveImgs = function(e){
// 	if(e.which > 2) return;
// 	var o = {
// 		x : e.clientX,
// 		y : e.clientY,
// 		which : e.which
// 	};
// 	var $that = $(this);
// 	if(e.which == 1) {
// 		var left = parseInt($that.css('left'), 10) || 0;
// 		var top = parseInt($that.css('top'), 10) || 0;
// 		$(window).on('mousemove', function(e){

// 			var x = left + e.clientX - o.x;
// 			var y = top + e.clientY - o.y;
// 			$that.css({
// 				'left' : x,
// 				'top' : y
// 			});

// 		});
// 	} else {
// 		var w = parseInt($that.css('width'), 10);
// 		var h = parseInt($that.css('height'), 10);
// 		$(window).on('mousemove', function(e){
// 			var n = {
// 				x : e.clientX,
// 				y : e.clientY
// 			};
// 			var d = parseInt(Math.sqrt( (o.x - n.x)*(o.x - n.x) + (o.y - n.y)*(o.y - n.y) ), 10);
// 			if(n.x > o.x || n.y > o.y) d = -d;
// 			$that.css({
// 				'width' : w-d
// 			});
// 		});
// 	}
// 	$(window).on('mouseup', function(){
// 		$(window).off('mousemove');
// 	});
// };

// $('section>*').on('click', Kreator.editSection);


// $('.resize').on('mousedown', function(e){

// 	var resizeFooter = function(e) {
// 		var nh = $(document).height() - e.clientY;
// 		$('#footer').css({ 'height' : nh });
// 	};

// 	$(window).on('mousemove', function(e){
// 		resizeFooter(e);
// 	});

// 	$(window).on('mouseup', function(){
// 		$(window).off('mousemove');
// 	});
// });


// document.getElementsByTagName('section')[0].ondrop = function(e) {
	
// 	e.preventDefault();
	
// 	var $this = $(this)
// 	, file = e.dataTransfer.files[0]
// 	, reader = new FileReader();
	
// 	reader.onload = function (e) {
// 		var img = $('<img/>')
// 			.attr('src', e.target.result)
// 			.on('mousedown', moveImgs)
// 			.appendTo($this)
// 			.bind('dragstart', function(e) { e.preventDefault(); });
// 	};

// 	reader.readAsDataURL(file);
// }

// document.getElementsByClassName('close')[0].addEventListener('click', hideFooter, false);