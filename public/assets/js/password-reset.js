$('#modifyForm').on('submit', function() {
    var formData = $(this).serialize();
    console.log(formData);

    $.ajax({
        url: '/users/password',
        type: 'put',
        data: formData,
        success: function() {
            location.href = "/admin/login.html"
        }
    })
    return false;
})