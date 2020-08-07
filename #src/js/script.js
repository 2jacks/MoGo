@@include('burger.js')
$(window).on('scroll', function () {
    if ($(window).scrollTop() > 70) {
        $('.header').addClass('fixed');
    }
    else {
        $('header').removeClass('fixed');
    }
});





$('.wedo__header').on('click', function () {
    $(this).parent().siblings().find('p').slideUp(300);
    $(this).parent().siblings().find('header').removeClass('active');
    $(this).toggleClass('active').next().slideToggle(300);
    let curCollapse = String($(this).parent().index());
    $("img[data-img = '${curCollapse}']".replace('${curCollapse}', curCollapse)).addClass('on-top').siblings().removeClass('on-top');
});







//Page Nav
$('.nav__item').on('click', function () {
    let anchor = $(this).attr('href');
    let headerHeight = $('.header').height();
    $('html, body').animate({
        scrollTop: $(anchor).offset().top - headerHeight
    }, 600);
    $('.burger').toggleClass('active');
    $('.nav').toggleClass('active');
    if ($('.burger').css('display') == 'block') {
        $('body').toggleClass('lock');
    }
});
$('.logo').on('click', function () {
    $('html, body').animate({
        scrollTop: 0
    }, 600);
});

//Sliders
$('.first-reviews__slider').slick({
    arrows: true,

});

$('.second-reviews__slider').slick({
    arrows: true,

});


//Map
$('.map__banner').on('click',function () {
    $(this).toggleClass('active-map');
    $('.map').toggleClass('active-map');

});