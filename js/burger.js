$('.burger').click(function(event) {
    $('.burger').toggleClass('active');
    $('.nav').toggleClass('active');
    $('body').toggleClass('lock');
});