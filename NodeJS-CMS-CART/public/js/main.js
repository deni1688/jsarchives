$(function () {
    if ($('textarea#ta').length) {
        CKEDITOR.replace('ta');
    }

    $('a.confirmDelete').on('click', function () {
        if (!confirm('Confirm delete page?')) return false;
    });
    $('a.confirmClearCart').on('click', function () {
        if (!confirm('Confirm clear shopping cart?')) return false;
    });
    $('a.checkout').on('click', function (e) {
        e.preventDefault();
        $.get('/cart/paypal-checkout', function () {
            $('.pp').submit();
            $('.ajaxbg').fadeIn();
        });
    });
    setTimeout(function () {
        if ($('.alert').length) {
            $('.alert').fadeOut();
        }
    }, 2000);
});