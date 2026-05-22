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

	const sheetDbUrl = 'https://sheetdb.io/api/v1/0xqjgsptesq9b';
	const whatsappNumber = '573208516476';

	function validateContactForm(formData) {
		const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{3,80}$/;
		const phonePattern = /^[0-9+\s()\-]{7,20}$/;
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const detailPattern = /^[^<>]{10,1000}$/;

		if (!namePattern.test(formData.nombre.trim())) {
			return 'Ingrese un nombre válido (solo letras y espacios).';
		}

		const digits = formData.telefono.replace(/\D/g, '');
		if (!phonePattern.test(formData.telefono.trim()) || digits.length < 7 || digits.length > 15) {
			return 'Ingrese un número de teléfono válido.';
		}

		if (!emailPattern.test(formData.correo.trim())) {
			return 'Ingrese un correo electrónico válido.';
		}

		if (!formData.interes) {
			return 'Seleccione un área de interés.';
		}

		if (!detailPattern.test(formData.detalle.trim())) {
			return 'El mensaje debe tener entre 10 y 1000 caracteres y no puede contener etiquetas HTML.';
		}

		if (!formData.habeas) {
			return 'Debe aceptar el tratamiento de datos con Habeas Data para continuar.';
		}

		return '';
	}

	function getFieldValue(id) {
		const element = document.getElementById(id);
		return element ? element.value.trim() : '';
	}

	function getCheckboxValue(id) {
		const element = document.getElementById(id);
		return element ? element.checked : false;
	}

	function getInterestText() {
		const select = document.getElementById('interes');
		if (!select) return '';
		return select.options[select.selectedIndex]?.text || '';
	}

	function buildWhatsappText(formData) {
		const interesLabel = formData.interesLabel || formData.interes;
		return `Hola, mi nombre es ${formData.nombre.trim()}.
Teléfono: ${formData.telefono.trim()}.
Correo: ${formData.correo.trim()}.
Interés: ${interesLabel}.
Mensaje: ${formData.detalle.trim()}`;
	}

	$('#contact-form').on('submit', function (event) {
		event.preventDefault();

		const formData = {
			nombre: getFieldValue('nombre'),
			telefono: getFieldValue('telefono'),
			correo: getFieldValue('correo'),
			interes: getFieldValue('interes'),
			interesLabel: getInterestText(),
			detalle: getFieldValue('detalle'),
			habeas: getCheckboxValue('habeas')
		};

		const errorMessage = validateContactForm(formData);
		if (errorMessage) {
			swal('Error', errorMessage, 'error');
			return;
		}

		const payload = {
			data: [{
				Nombre: formData.nombre.trim(),
				Telefono: formData.telefono.trim(),
				Correo: formData.correo.trim(),
				Interes: formData.interes,
				Mensaje: formData.detalle.trim(),
				Habeas: formData.habeas === true
			}]
		};

		fetch(sheetDbUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('No se pudo enviar el formulario. Intente de nuevo.');
				}
				return response.json();
			})
			.then(() => {
				const whatsappText = encodeURIComponent(buildWhatsappText(formData));
				swal({
					title: 'Enviado',
					text: 'Tu mensaje se guardó correctamente. Serás redirigido a WhatsApp.',
					icon: 'success',
					timer: 2200,
					buttons: false
				}).then(() => {
					window.location.href = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;
				});
			})
			.catch(error => {
				console.error('Error de envío:', error);
				swal('Error', error.message || 'Ocurrió un error al enviar el formulario. Por favor intente nuevamente.', 'error');
			});
	});
});