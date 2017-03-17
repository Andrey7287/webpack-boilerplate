$.fn.scrollUp = function (time) {

	var time = time || 1000;
	$(this).click(time, function(e){

		e.preventDefault();
		$('html, body').animate({
				scrollTop: $('html').offset().top
		}, time);

	});

};
