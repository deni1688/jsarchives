$(document).ready(function() {
    var socket = io();
    var currentGroup = $('#current-group').val(); // active channel name
    var sender = $('#sender').val(); // active channel name
    socket.on('connect', function() {
        var params = {
            sender: sender
        };

        socket.emit('joinRequest', params, function() {
            console.log('Joined')
        })
    });
    socket.on('newFriendRequest', function(friend) {
        $('#reload').load(location.href + ' #reload');
        $(document).on('click', '.cancel-request', cancelRequest);
        $(document).on('click', '.accept-request', acceptRequest);
    });

    $('#add-friend').on('submit', function(e) {
        e.preventDefault();
        var receiverName = $('#receiver-name').val();
        $.ajax({
            url: '/group/' + currentGroup,
            type: 'POST',
            data: {
                receiverName: receiverName
            },
            success: function() {
                socket.emit('friendRequest', {
                    receiver: receiverName,
                    sender: sender
                }, function() {
                    console.log('Request sent')
                });
            }
        });
    });
    $(document).on('click', '.cancel-request', cancelRequest);
    $(document).on('click', '.accept-request', acceptRequest);

    function acceptRequest() {
        var senderId = $(this).attr('data-senderId');
        var senderName = $(this).attr('data-senderName');
        $.ajax({
            url: '/group/' + currentGroup,
            type: 'POST',
            data: {
                senderId: senderId,
                senderName: senderName
            },
            success: function() {
                $('#' + senderId).remove();
            }
        })
        $('#reload').load(location.href + ' #reload');
    }

    function cancelRequest() {
        var senderId = $(this).attr('data-senderId');
        $.ajax({
            url: '/group/' + currentGroup,
            type: 'POST',
            data: {
                cancelId: senderId,
            },
            success: function() {
                $('#' + senderId).remove();
            }
        })
        $('#reload').load(location.href + ' #reload');
    }
});