jQuery( document ).ready(function( $ ) {
"use strict"
/*-----------------------------------------------------------------------------------*/
/* 	LOADER
/*-----------------------------------------------------------------------------------*/
$("#loader").delay(500).fadeOut("slow");
/*-----------------------------------------------------------------------------------*/
/* 	COUNTER JS
/*-----------------------------------------------------------------------------------*/
$('.counter .timer').countTo();
/*-----------------------------------------------------------------------------------*/
/*		STICKY NAVIGATION
/*-----------------------------------------------------------------------------------*/
$(".sticky").sticky({topSpacing:0});
/*-----------------------------------------------------------------------------------*/
/*  FULL SCREEN
/*-----------------------------------------------------------------------------------*/
$('.full-screen').superslides({});
/*-----------------------------------------------------------------------------------*/
/* 	TEAM SLIDER 
/*-----------------------------------------------------------------------------------*/
$(".team-slider").owlCarousel({ 
	autoplay:false,
	autoplayHoverPause:true,
	singleItem	: true,
	navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
	lazyLoad:true,
	nav: true,
	loop:true,
	margin:30,
	responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        1200:{
            items:3,
        }}
});
/*-----------------------------------------------------------------------------------*/
/* 	SINGLE SLIDE
/*-----------------------------------------------------------------------------------*/
$(".single-slides").owlCarousel({ 
    items : 1,
	autoplay:false,
	autoplayHoverPause:true,
	singleItem	: true,
	navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
	lazyLoad:true,
	nav: true,
	loop: true,
	animateOut: 'fadeOut'	
});
/*-----------------------------------------------------------------------------------*/
/* 	TEAM SLIDER 
/*-----------------------------------------------------------------------------------*/
$(".clients-slider").owlCarousel({ 
	autoplay:false,
	autoplayHoverPause:true,
	singleItem	: true,
	navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
	lazyLoad:true,
	nav: true,
	loop:true,
	margin:30,
	responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1200:{
            items:4,
        }}
});
/*-----------------------------------------------------------------------------------*/
/* 	Slider 3 SEC
/*-----------------------------------------------------------------------------------*/
$(".slider-three-item").owlCarousel({ 
	autoplay:false,
	autoplayHoverPause:true,
	singleItem	: true,
	navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
	lazyLoad:true,
	nav: true,
	loop:true,
	margin:30,
	responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        1200:{
            items:3,
        }}
});
/*-----------------------------------------------------------------------------------
    TESTNMONIALS STYLE 1
/*-----------------------------------------------------------------------------------*/
$('.testi-slide').flexslider({
    animation: "fade",
	controlsContainer: '.flex-container',
	controlNav: "thumbnails"
});
/*-----------------------------------------------------------------------------------
    TESTNMONIALS STYLE 2
/*-----------------------------------------------------------------------------------*/
$('.testi-slide-2').bxSlider({
  mode: 'fade',
  auto: true
});
/*-----------------------------------------------------------------------------------
    Animated progress bars
/*-----------------------------------------------------------------------------------*/
$('.progress-bars').waypoint(function() {
  $('.progress').each(function(){
    $(this).find('.progress-bar').animate({
      width:$(this).attr('data-percent')
     },200);
});},
	{ 
	offset: '100%',
    triggerOnce: true 
});
/*-----------------------------------------------------------------------------------*/
/* 	SLIDER REVOLUTION
/*-----------------------------------------------------------------------------------*/
jQuery('.tp-banner').show().revolution({
	dottedOverlay:"none",
	delay:10000,
	startwidth:1170,
	startheight:700,
	navigationType:"bullet",
	navigationArrows:"solo",
	navigationStyle:"preview4",
	parallax:"mouse",
	parallaxBgFreeze:"on",
	parallaxLevels:[7,4,3,2,5,4,3,2,1,0],												
	keyboardNavigation:"on",						
	shadow:0,
	fullWidth:"on",
	fullScreen:"on",
	shuffle:"off",						
	autoHeight:"off",						
	forceFullWidth:"off",	
	fullScreenOffsetContainer:""	
});
/*-----------------------------------------------------------------------------------*/
/* 	SLIDER REVOLUTION
/*-----------------------------------------------------------------------------------*/
jQuery('.tp-banner-fix').show().revolution({
	dottedOverlay:"none",
	delay:10000,
	startwidth:1170,
	startheight:700,
	navigationType:"bullet",
	navigationArrows:"solo",
	navigationStyle:"preview4",
	parallax:"mouse",
	parallaxBgFreeze:"on",
	parallaxLevels:[7,4,3,2,5,4,3,2,1,0],												
	keyboardNavigation:"on",						
	fullWidth:"off",
	fullScreen:"off"
});
/*-----------------------------------------------------------------------------------*/
/* 	ANIMATION
/*-----------------------------------------------------------------------------------*/
var wow = new WOW({
    boxClass:     'animate',      // animated element css class (default is wow)
    animateClass: 'animated', // animation css class (default is animated)
    offset:       100,          // distance to the element when triggering the animation (default is 0)
    mobile:       false        // trigger animations on mobile devices (true is default)
});
wow.init();
/*-----------------------------------------------------------------------------------*/
/*	ISOTOPE PORTFOLIO
/*-----------------------------------------------------------------------------------*/
var $container = $('.port-wrap .items');
    $container.imagesLoaded(function () {
    $container.isotope({
    itemSelector: '.portfolio-item',
    layoutMode: 'masonry'
});	
});
$('.portfolio-filter li a').on('click', function () {
    $('.portfolio-filter li a').removeClass('active');
    $(this).addClass('active');
    var selector = $(this).attr('data-filter');
    $container.isotope({
      filter: selector
    });
return false;
});
/*-----------------------------------------------------------------------------------*/
/* 		NAVIGATION SMOOTH SCROLL
/*-----------------------------------------------------------------------------------*/
$('.scroll a').bind('click', function(event) {
 var $anchor = $(this);
    $('html, body').stop().animate({
       scrollTop: $($anchor.attr('href')).offset().top
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
});
/*-----------------------------------------------------------------------------------*/
/* 		Active Menu Item on Page Scroll
/*-----------------------------------------------------------------------------------*/
$(window).scroll(function(event) {
		Scroll();
});	
$('.scroll a').click(function() {  
	$('html, body').animate({scrollTop: $(this.hash).offset().top -50}, 1000);
		return false;
});
// User define function
function Scroll() {
var contentTop      =   [];
var contentBottom   =   [];
var winTop      =   $(window).scrollTop();
var rangeTop    =   70;
var rangeBottom =   1000;
$('nav').find('.scroll a').each(function(){
	contentTop.push( $( $(this).attr('href') ).offset().top);
		contentBottom.push( $( $(this).attr('href') ).offset().top + $( $(this).attr('href') ).height() );
})
$.each( contentTop, function(i){
if ( winTop > contentTop[i] - rangeTop ){
	$('nav li.scroll')
	  .removeClass('active')
		.eq(i).addClass('active');			
}}  )};
/*-----------------------------------------------------------------------------------*/
/*	LEFT MENU
/*-----------------------------------------------------------------------------------*/
jQuery(document).ready(function($){
	var $lateral_menu_trigger = $('#cd-menu-trigger'),
		$content_wrapper = $('.cd-main-content'),
		$navigation = $('header');

	//open-close lateral menu clicking on the menu icon
	$lateral_menu_trigger.on('click', function(event){
		event.preventDefault();
		
		$lateral_menu_trigger.toggleClass('is-clicked');
		$navigation.toggleClass('lateral-menu-is-open');
		$content_wrapper.toggleClass('lateral-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			// firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
			$('body').toggleClass('overflow-hidden');
		});
		$('#cd-lateral-nav').toggleClass('lateral-menu-is-open');
		
		//check if transitions are not supported - i.e. in IE9
		if($('html').hasClass('no-csstransitions')) {
			$('body').toggleClass('overflow-hidden');
		}
	});

	//close lateral menu clicking outside the menu itself
	$content_wrapper.on('click', function(event){
		if( !$(event.target).is('#cd-menu-trigger, #cd-menu-trigger span') ) {
			$lateral_menu_trigger.removeClass('is-clicked');
			$navigation.removeClass('lateral-menu-is-open');
			$content_wrapper.removeClass('lateral-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$('body').removeClass('overflow-hidden');
			});
			$('#cd-lateral-nav').removeClass('lateral-menu-is-open');
			//check if transitions are not supported
			if($('html').hasClass('no-csstransitions')) {
				$('body').removeClass('overflow-hidden');
			}}
	});
	//open (or close) submenu items in the lateral menu. Close all the other open submenu items.
	$('.item-has-children').children('a').on('click', function(event){
		event.preventDefault();
		$(this).toggleClass('submenu-open').next('.sub-menu').slideToggle(200).end().parent('.item-has-children').siblings('.item-has-children').children('a').removeClass('submenu-open').next('.sub-menu').slideUp(200);
	});
});
/*-----------------------------------------------------------------------------------*/
/*	Go TO TOP
/*-----------------------------------------------------------------------------------*/
var offset = 300,
	//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
	offset_opacity = 1200,
	//duration of the top scrolling animation (in ms)
	scroll_top_duration = 700,
	//grab the "back to top" link
	$back_to_top = $('.cd-top');

//hide or show the "back to top" link
$(window).scroll(function(){
	( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
	if( $(this).scrollTop() > offset_opacity ) { 
		$back_to_top.addClass('cd-fade-out');
	}
});
//smooth scroll to top
$back_to_top.on('click', function(event){
	event.preventDefault();
	$('body,html').animate({
		scrollTop: 0 ,
	 	}, scroll_top_duration
);
});
});
/*-----------------------------------------------------------------------------------*/
/*    CONTACT FORM
/*-----------------------------------------------------------------------------------*/
function checkmail(input){
  var pattern1=/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  	if(pattern1.test(input)){ return true; }else{ return false; }}     
    function proceed(){
    	var name = document.getElementById("name");
		var email = document.getElementById("email");
		var company = document.getElementById("company");
		var msg = document.getElementById("message");
		var errors = "";
		if(name.value == ""){ 
		name.className = 'error';
	  	  return false;}    
		  else if(email.value == ""){
		  email.className = 'error';
		  return false;}
		    else if(checkmail(email.value)==false){
		        alert('Please provide a valid email address.');
		        return false;}
		    else if(company.value == ""){
		        company.className = 'error';
		        return false;}
		   else if(msg.value == ""){
		        msg.className = 'error';
		        return false;}
		   else 
		  {
	$.ajax({
		type: "POST",
		url: "php/submit.php",
		data: $("#contact_form").serialize(),
		success: function(msg){
		//alert(msg);
		if(msg){
			$('#contact_form').fadeOut(1000);
			$('#contact_message').fadeIn(1000);
				document.getElementById("contact_message");
			 return true;
		}}
	});
}};






