$(document).click(function (e) {
    if (!$(e.target).closest('.name-header').length)
        $('#account-menu').hide();
});
$(document).ready(function () {

    $('#h-account').click(function () {
        $('#account-menu').toggle();
    });
});