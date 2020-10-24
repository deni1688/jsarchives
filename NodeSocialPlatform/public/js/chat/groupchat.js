$(document).ready(function() {
    var socket = io(); // exposing the global io variable
    var currentGroup = $('#current-group').val(); // active channel name
    var sender = $('#sender').val(); // active channel name
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    socket.on('connect', function() {
        var params = {
            room: currentGroup,
            sender: sender,
        }
        socket.emit('join', params, function() {
            console.log('User joined');
        });
    });

    socket.on('activeUsers', function(users) {
        var ol = $('<ol class="list-group"></ol>');
        users.forEach(user => {
            ol.append('<li class="list-group-item"><span class="status status-online"></span><a href="#" class="member-name" data-toggle="modal" data-target="#request-modal">' + user + '</a></li>')
        });
        $(document).on('click', '.member-name', function() {
            $('#request-name').text($(this).text());
            $('#receiver-name').val($(this).text());
            $('#view-profile-link').attr('href', '/profile/' + $(this).text());
        });
        $('.online-members').html(ol);
        $('.members-count').text('(' + users.length + ')');
    });

    socket.on('groupMessage', function(message) {
        var source = '';
        if ($('#user_id').val() == message.sender_id) {
            source = $('#chat-template-owner').html();
        } else {
            source = $('#chat-template').html();
        }
        var template = Handlebars.compile(source);
        context = {
            text: message.text,
            sender: message.sender,
            time: message.time
        }
        $('.chat-output').append(template(context));

    });

    $('#msgForm').on('submit', function(e) {
        e.preventDefault();
        var now = new Date();
        var time = days[now.getDay()] + ' at ' + now.getHours() + ':' + now.getMinutes();
        var msg = $('#msg').val();
        var id = $('#user_id').val();
        if (msg !== '') {
            socket.emit('groupMessage', {
                text: msg,
                room: currentGroup,
                sender: sender,
                time: time,
                sender_id: id
            }, function() {
                $('#msg').val('');
            });
        }
    });
});