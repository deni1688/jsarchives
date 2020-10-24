$(document).ready(function() {
    var socket = io();
    socket.on('connect', function() {
        var name = $('#user-data').data('user-name');
        var img = $('#user-data').data('user-img');
        var room = 'Global Room';
        socket.emit('globalroom', {
            room: room,
            name: name,
            img: img
        });
    });
    socket.on('globalclients', function(clients) {
        var friends = [];
        var friendsOnline = [];
        var name = $('#user-data').data('user-name').toLowerCase().replace(/\s/g, '-');
        var names = $('#friends').text().replace(/\s/g, '').split('@').filter(function(item) {
            return item != "";
        });
        var ol = $('<ol class="list-group"></ol>');
        names.map(function(friend) {
            return friends.push('@' + friend);
        });
        for (var i = 0; i < clients.length; i++) {
            if (friends.indexOf(clients[i].name) > -1) {
                friendsOnline.push(clients[i]);
                ol.append('<li class="list-group-item"><span class="status status-online"></span><a href="/chat/' + clients[i].name.toLowerCase().replace(/\s/g, '-') + '.' + name + '">' + clients[i].name + '</a></li>');
            }
        }
        $('#friends-online').html(ol);
        $('.friends-count').html('(' + friendsOnline.length + ')');
    });
});