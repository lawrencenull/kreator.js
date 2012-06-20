define(['text', 'jquery'], function(textStyle, $){

	var Kreator = (function (options) {

		var slideX = 0, // to keep track of the current slide we're on
			slideY = 0, // to keep track of the current slide we're on
			$ = options.jquery,
			Reveal = options.reveal,
			dummyText = $('<span contentEditable>new span</span>'), // this is the generic span in which gets added to the section you edit this to insert content
			$span,
			hljs = options.hljs;

		var init = function() {

			options.right = $('<div data-direction="right">+</div>')
					.addClass('add-slide add-right')
					.on('click', function(){
						Kreator.addSlideRight();
						Reveal.navigateRight();
					});
			
			options.down = $('<div data-direction="bottom">+</div>')
					.addClass('add-slide add-down')
					.on('click', function(){
						Kreator.addSlideDown();
						Reveal.navigateDown();
					});

			$('body').append(options.right)
				.append(options.down);

			Reveal.addEventListener( 'slidechanged', function( event ) {
				Kreator.setSlideX(event.indexh);
				Kreator.setSlideY(event.indexv);
			});

			$('section').on('click', function(){
				dummyText.clone()
					.on('click', Kreator.editSpan)
					.appendTo(Kreator.getCurrentSlide())
					.focus();
			});

			$('.btn-group a').on('click', function(){
				var tag = $(this).data('textstyle');
				var string = '';
				if(['b', 'i'].indexOf(tag)>=0) {
					string = textStyle.format(tag, $span);
					$span.html(string);
					$('a.enabled')
						.removeClass('enabled').addClass('disabled')
						.attr('data-title', 'select words');
				} else if(['li', 'blockquote'].indexOf(tag)>=0) {
					string = textStyle.paragraph(tag, $span);
					$span.html(string);
				} else if(['left', 'center', 'right'].indexOf(tag)>=0) {
					string = textStyle.align(tag, $span);
					$span.html(string);
				} else if(tag === 'a') {
					textStyle.insertHiperlink(this, $span);
				}

			});

			$(window).on('mouseup', function(){
				var selection = (window.getSelection()).toString();
				if(!selection.length) return;
				else {
					$('a.disabled')
						.removeClass('disabled').addClass('enabled')
						.attr('data-title', 'make bold');
				}
			});

			$('#select-dimensions').on('change', function(){
				var tag = $(this).val(),
					string = textStyle.paragraph(tag, $span);
				if(string) $span.html(string);
			});

			$(window).on('paste', function(e){
				setTimeout(function(){formatText($span);}, 100);
			});

			$('#remove').on('click', function(){
				$span.remove();
			});

			$('#move-up').on('click', function(){
				if($span) {
					var prev = $span.prev('span');
					if(prev.length) {
						$span.insertBefore(prev);
					}
				}
			});

			$('#move-down').on('click', function(){
				if($span) {
					var next = $span.next('span');
					if(next.length) {
						$span.insertAfter(next);
					}
				}
			});

		};

		var formatText = function($s) {
			// a quick example of paste-code-and-automatically-format-it
			$s.html($s.html().replace(/(<([^>]+)>)/ig,""));
			var result = hljs.highlightAuto($s.html());
			if(result.keyword_count > 2) {
				$s.replaceWith('<pre contentEditable><code>'+result.value+'</code></pre>');
			}
		};

		var addContentToSlide = function() {
			dummyText.clone()
				.on('click', editSpan)
				.appendTo(Kreator.getCurrentSlide());
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

		var addSlideRight = function() {
			var c = dummyText.clone().on('click', editSpan),
				s = this.getCurrentSlide();

			// if the current slide is the last slide on the X axis we append to the parent
			if($('.slides>section').length == slideX+1) {
				var section = $('<section/>')
							.on('click', addContentToSlide)
							.append(c);
				$('.slides').append(section);
			} else {
				// else we just append after the current element
				$('<section/>')
					.on('click', addContentToSlide)
					.append(c).insertAfter(s);
			}
		};

		var addSlideDown = function() {

			var s = this.getCurrentSlide();
			var d = dummyText.clone().on('click', editSpan);

			if(s.parent().hasClass('slides')) {
				var c = $('<section/>').append(s.html());
				var ns = $('<section/>').append(d);

				s.html('').append(c).append(ns);
			} else {
				$('<section/>').append(d).insertAfter(s);
			}
			d.trigger('click');
		};

		var editSpan = function(e) {
			console.log('editing');
			e.stopPropagation();
			$span = $(this);
		};

		return {
			addSlideDown: addSlideDown,
			addSlideRight: addSlideRight,
			editSpan: editSpan,
			setSlideX: setSlideX,
			setSlideY: setSlideY,
			getCurrentSlide: getCurrentSlide,
			init: init
		};
	})({
		jquery: $,
		reveal: Reveal,
		hljs: hljs
	});

	return Kreator;
});