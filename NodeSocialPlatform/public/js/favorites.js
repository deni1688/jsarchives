$(document).ready(function() {
    var addFav = $('.btn-fav');

    addFav.on('click', function() {
        var groupId = $(this).data('group-id');
        var groupName = $(this).data('group-name');

        $.ajax({
            url: '/home',
            type: 'POST',
            data: {
                groupId: groupId,
                groupName: groupName
            },
            success: function() {
                $(this).load();
            }
        });
    });
});