$(document).ready(function() {
    var uploadInput = $('#upload-input');
    var fileName = $('#file-name');
    uploadInput.on('change', function() {
        fileName.val(uploadInput[0].files[0].name);
        // if (uploadInput.val() !== '') {
        //     var formData = new FormData();
        //     formData.append('upload', uploadInput[0].files[0]);
        //     $.ajax({
        //         url: '/upload-file',
        //         type: 'POST',
        //         data: formData,
        //         processData: false,
        //         contentType: false,
        //         success: function() {
        //             uploadInput.val('');
        //             fileName.val('');
        //         }
        //     });
        // } else {
        //     alert('You must upload a logo');
        // }
    });
});