$(document).ready(function () {
	$('#btn-conoce').click(function () {
		$('#nuestro-equipo .cards').toggleClass('active');
	});

	$('.servicios-carousel').owlCarousel({
		loop: false,
		margin: 20,
		dots: true,
		nav: false,
		autoplay: false,
		autoplayHoverPause: true,
		responsive: {
			0: { items: 1 },
			576: { items: 1 },
			768: { items: 2 },
			992: { items: 3 },
			1200: { items: 4 }
		}
	});

	$('.burger-button').click(function () {
		$('.nav-wrapper').toggleClass('nav-open');
		$(this).toggleClass('open');
	});

	$('.nav-links a').click(function () {
		if ($('.nav-wrapper').hasClass('nav-open')) {
			$('.nav-wrapper').removeClass('nav-open');
			$('.burger-button').removeClass('open');
		}
	});
});