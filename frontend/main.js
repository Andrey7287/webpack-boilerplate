'use strict';

/* Make jQuery available in global */
console.log(`jQuery ${$.fn.jquery} is loaded`);
window.$ = $;
window.jQuery = $;

/* Import project styles and components */
import '../sass/css.scss';
import OnResize from './modules/resize';
import scrollup from './modules/scrollup';

/* Define project components and variables */
var	isMap = $('#map').is('#map'),
		isSlider = $('.slider').is('.slider'),
		mobileView = window.matchMedia("(max-width: 768px)").matches,
		resizeAlign = new OnResize,
		scrollTiming = 0,
		scrollTimingH = 0;

/************************
****** Mobile menu ******
*************************/

$('.c-hamburger').on('click', function(){
	$(this).toggleClass('is-active');
	$('.site-nav').slideToggle();
});

/***********************
******** FOOTER ********
************************/

$(window).on('load', function(){

	setTimeout(function(){
		var footerHeight = $('footer').outerHeight(true);
		$('.content').css('min-height', 'calc(100vh - '+footerHeight+'px)');
	},1);

});

/**********************
********* MAP *********
***********************/

if ( isMap ) {

	require.ensure([], (require) => {
		require('./modules/ymap');
	}, 'map');

}

/***********************
******** SLIDER ********
************************/


if ( isSlider ) {

	require.ensure([], (require) => {
		require('script-loader!slick-carousel/slick/slick.js');
		$('.slider').slick({
			prevArrow: $('.slider-arrow.left'),
			nextArrow: $('.slider-arrow.right'),
			dots: true,
			appendDots: $('.slider-dots')
		});
	}, 'slick');

}

/************************
******* Scroll Up *******
*************************/

$(document).scroll(function(){

	if ( !scrollTiming ) {

		scrollTiming = setTimeout(function(){

			var scroll = $('body').scrollTop() ? $('body').scrollTop() : $('html').scrollTop();
			scroll >= 300 ? $('.scrollup').addClass('act') : $('.scrollup').removeClass('act');
			scrollTiming = 0;

		},300);

	}

});

$('.scrollup').scrollUp();
