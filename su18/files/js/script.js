'use strict';

$(document).ready(function() {

	/**
	 * Globals
	 *
	 */
	var body = $('body');
	var section = $('section');
	var footer = $('footer');
	var header = $('header');
	var vw = $(window).width();
	var vh = $(window).height();
	var gallery = $('#gallery');
	var intervalId = false;
	var intervalIdStop = false;
	var intervalIdResume = false;
    window.totalS100 = 0

	//Questo tempo viene usato per il fade in dell'header quando parte il loop
	var fadeHeaderTime = 400

	//Questo tempo viene usato per decidere quando mettere in pausa il loop
	//Viene generare un numero random tra il minimo e il massimo
	var minPauseTimeInLoop = 1000
	var maxPauseTimeInLoop = 1000

    //Questo tempo viene usato per decidere quando mettere in pausa il loop
    //Viene generare un numero random tra il minimo e il massimo
    var minResumeTimeInLoop = 500
    var maxResumeTimeInLoop = 500

	//lista classi da usare nelle immagini
	var positionClasses = ['p-o2v3','p-o2v4','p-o2v5','p-o2v6','p-o3v7','p-o3v3','p-o3v4','p-o3v5','p-o3v6','p-o3v7','p-o4v3','p-o4v4','p-o4v5','p-o4v6','p-o4v7','p-o5v3','p-o5v4','p-o5v5','p-o5v6','p-o5v7','p-o6v3','p-o6v4','p-o6v5','p-o6v6','p-o6v7','p-o7v3','p-o7v4','p-o7v5','p-o7v6','p-o7v7','p-o8v3','p-o8v4','p-o8v5','p-o8v6','p-o8v7']
	var sizeClasses = ['s22','s24','s26','s28','s34','s36','s38','s40','s42','h100','s100']
	var maxS100 = 2
 
	//Varibili utilizzate per attivare o disattivare funzionalita'
	var randomInitialImageActive = true
	var automaticLoopGalleryActive = true
	var randomNextImageActive = true
	var randomImageClassActive = true

	/**
	 * Functions
	 *
	 */

    function galleryNav() {
        var $slides = gallery.children();
		var $slideActive = gallery.children('.active');

		if(randomNextImageActive){

			var filteredGallery = gallery.children().not('.active').not('.used').not('.start')
            var random = Math.floor(Math.random() * filteredGallery.children().length)
			$slideNext = filteredGallery[random]

            if($slideActive.length){
                if($($slideNext).length){
					$slideActive.removeClass('active')
					$($slideNext).addClass('active').addClass('used')
					randomImageClass($slideNext)
                }else{
                    backToNormal()
					$('.active').removeClass('active')
					$('.start').addClass('active')
                }
            }

		}else{

			var $slideNext = gallery.children('.active').next()

			if($slideActive.length){
				if($slideNext.length){
					if ($slideNext.hasClass('start')) {
						$slideActive.removeClass('active');
						randomImageClass($slideNext)
						$slideNext.addClass('active');
						backToNormal()
					} else {
						$slideActive.removeClass('active')
						randomImageClass($slideNext)
						$slideNext.addClass('active')
					}
				}else{
					$slideActive.removeClass('active')
					$slides.first().addClass('active')
                    backToNormal()
				}
			}

		}

    }

	$('ul#gallery li:not(.form)').on('click', function() {
        header.fadeOut(fadeHeaderTime)
        automaticGallery('next')
	});


	// MOMENTO

	$(document).keydown(function(e) {
		// Right
	  if (e.which == 39) {
          automaticGallery('next')
	  }
	});


	// STOP


	// Set aspect ratio
	function aspectRatio() {
		var vw = $(window).width();
		var vh = $(window).height();

		if (vh > vw) {
			body.addClass('portrait').removeClass('landscape');
		} else {
			body.addClass('landscape').removeClass('portrait');
		}
		section.css('height', vh)
        section.css('width', vw)
	}

	//automatic gallery and automatic stop
	function automaticGallery(direction) {
		if(automaticLoopGalleryActive) {
				if (!intervalId) {
                intervalId = setInterval(function () {
                        galleryNav()
                    },
                    170
                )

                var autoStop = Math.floor(Math.random() * maxPauseTimeInLoop) + minPauseTimeInLoop
                var autoResume = Math.floor(Math.random() * minResumeTimeInLoop) + maxResumeTimeInLoop

                intervalIdStop = setTimeout(function () {
                    if (intervalId) {
                        clearInterval(intervalId)
                        intervalId = false

                        intervalIdResume = setTimeout(function () {
                            automaticGallery(direction)
                        }, autoResume)
                    }
                }, autoStop)
            }
        }else{
            galleryNav()
		}
    }

    function backToNormal() {
		if(intervalId){
			clearInterval(intervalId)
			intervalId = false
			intervalIdStop = false
			intervalIdResume = false
			header.fadeIn(fadeHeaderTime)
		}
        $('.used').removeClass('used')
    }


	/**
	 * After load
	 *
	 */

	$(window).load(function() {

		// Preloader
		body.removeClass('loading');

		$('#gallery li').each(function() {
			var path = $(this).attr('data-path');
			var color = $(this).attr('data-color');

			if (path != null) {
				$(this).css({'background-image' : 'url(' + path + ')',});
			}
		});

		// Set aspect ratio
		aspectRatio();

		// Show footer


	});


	$('header h1').click(function() {
	body.toggleClass('footer-active');
    $('header h1').text(function(_,txt) {
        var ret='';

        if ( txt == 'About' ) {
           ret = 'Close';
        }else{
           ret = 'About';
        }
        return ret;
    });
    return false;
});


	// form
	$('.gotoform').on('click',function(){
		gallery.children().each(function(){
			if ($(this).is(".active")) {
				$(this).removeClass('active')
			}
		})
		body.removeClass('footer-active')
		$('li.form').addClass('active')
	})

	//trigger form click non input or button
	$('ul#gallery li.form').on('click', function(e) {
		if(e.target.nodeName.toLowerCase() !== 'input' && e.target.nodeName.toLowerCase() !== 'button' ){
			galleryNav();
		}
	});



	/**
	 * Resize
	 *
	 */

	$(window).on('resize', function () {
		aspectRatio();
	});


	/**
	 * Scroll
	 *
	 */

/*
	$(window).on('scroll', function () {

        automaticGallery('next')

	});

	$(document).on('keydown', function(e) {
		if (e.which == 71) {
			tickerToggle();
		}
	});
*/


    /**
     * RANDOM IMAGE START
     *
     */

    if(randomInitialImageActive){
        var images = gallery.children();
        var slidesCount = images.length;

        var random = Math.floor(Math.random() * slidesCount) + 1

        $('.active').removeClass('active')

        $(images[random])
            .addClass('active')
            .addClass('start')
            .find('img')
            .removeClass()
            .addClass('p-o5v5')
            .addClass('s32')
            .addClass('used')
    }else{
        $('.active').addClass('start').addClass('used')
	}

    /**
     * RANDOM IMAGE CLASSES
     *
     */
    function randomImageClass(element) {
    	if(randomImageClassActive){

    		var randomSize = Math.floor(Math.random() * sizeClasses.length)

			if(window.totalS100 >= maxS100){
                removeA(sizeClasses, 's100');
            }
			var randomSizeClass = sizeClasses[randomSize]
			var randomPositionClass = getPositionClass(randomSizeClass)

    		$(element).find('img')
				.removeClass()
				.addClass(randomSizeClass)
				.addClass(randomPositionClass)
		}
    }

    function getPositionClass(sizeClass) {
		var randomPosition = Math.floor(Math.random() * positionClasses.length)
		var positionClass = positionClasses[randomPosition]

		//exceptions
		if(sizeClass === 's100'){
			console.log('s100')
			window.totalS100 = window.totalS100 + 1
			return 'p-o5v5'
		}
		if(sizeClass === 'h100'){
			var possibleClasses = ['p-o2v5','p-o3v5','p-o4v5','p-o5v5','p-o6v5','p-o7v5']
            randomPosition = Math.floor(Math.random() * possibleClasses.length)
            positionClass = possibleClasses[randomPosition]
		}

		return positionClass
    }

});


	/**
	 * NAME / CONTACT / TEXT
	 *
	 */

	$(document).on('mouseenter', '.angolo1 .portfolio', function(e) {
			if ((!$('body').hasClass('overlay-visible')) && (!(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)))) {
					$(this).hide();
					$('footer .request').css('display', 'inline-block');
			}
	});
	$(document).on('mouseleave', '.angolo1', function(e) {
			if (!(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
					$('footer .request').hide();
					$('footer .portfolio').css('display', 'inline-block');
			}
	});
	
	$(document).on('mouseenter', '.angolo2 .credits', function(e) {
			if ((!$('body').hasClass('overlay-visible')) && (!(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)))) {
					$(this).hide();
					$('footer .favotto').css('display', 'inline-block');
			}
	});
	$(document).on('mouseleave', '.angolo2', function(e) {
			if (!(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
					$('footer .favotto').hide();
					$('footer .credits').css('display', 'inline-block');
			}
	});

	/**
	 * INACTIVTY COLOR
	 *
	 */
	 $(document).ready(function () {
        var idleState = false;
        var idleTimer = null;
        $('*').bind('mousemove click mouseup mousedown keydown keypress keyup submit change mouseenter scroll resize dblclick', function () {
            clearTimeout(idleTimer);
            if (idleState == true) { 
                $("inactive").css('opacity','0');            
            }
            idleState = false;
            idleTimer = setTimeout(function () { 
                $("inactive").css('opacity','100');        
                idleState = true; }, 60000);
        });
        $("body").trigger("mousemove");
    });


     /**
	 * FADE IN ANIMSITION
	 *
	 */
	$(document).ready(function() {
	  $(".animsition").animsition({
	    inClass: 'fade-in',
	    outClass: 'fade-out',
	    inDuration: 300,
	    outDuration: 800,
	    linkElement: '.animsition-link',
	    // e.g. linkElement: 'a:not([target="_blank"]):not([href^="#"])'
	    loading: true,
	    loadingParentElement: 'body', //animsition wrapper element
	    loadingInner: '', // e.g '<img src="loading.svg" />'
	    timeout: false,
	    timeoutCountdown: 5000,
	    onLoadEvent: true,
	    browser: [ 'animation-duration', '-webkit-animation-duration'],
	    // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
	    // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
	    overlay : false,
	    overlayClass : 'animsition-overlay-slide',
	    overlayParentElement : 'body',
	    transition: function(url){ window.location.href = url; }
	  });
	});

     /**
	 * SCROLLING TEXT
	 *
	 */

/*
	$(document).ready(function() {
	    var laido = $('div.laido');
	    console.log(laido);
	    laido.each(function() {
	        var mar = $(this),indent = mar.width();
	        mar.laido = function() {
	            indent--;
	            mar.css('text-indent',indent);
	            if (indent < -1 * mar.children('div.laido-text').width()) {
	                indent = mar.width();
	            }
	        };
	        mar.data('interval',setInterval(mar.laido,100/20));
	    });
	});
*/

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

