//添加用户功能
$('#userForm').on('submit', function() {
        var formData = $(this).serialize()
        $.ajax({
                type: 'post',
                url: '/users',
                data: formData,
                success: function() {
                    location.reload()
                },
                error: function() {
                    alert('用户添加失败')
                }

            })
            //阻止表单默认提交行为
        return false
    })
    //当用户选择文件时选择头像
$('#modifyBox').on('change', '#avatar', function() {
    //用户选择的文件
    var formData = new FormData()
        //this.files[0指的是上传后的文件]
    formData.append('avatar', this.files[0])

    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        //告诉ajax方法不要解析请求参数
        processData: false,
        //告诉$.ajax方法不要设置请求参数类型
        contentType: false,
        success: function(response) {

            $('#preview').attr('src', response[0].avatar)
            $('#hiddenAvatar').val(response[0].avatar)

        }
    })
})

$.ajax({
    type: 'get',
    url: '/users',
    success: function(response) {
        var html = template('userTpl', { data: response })
        $('#userBox').html(html);
    }
})

//通过事件委托方式为编辑按钮添加点击事件
$('#userBox').on('click', '.edit', function() {
        //获取被点击用户端id
        var id = $(this).attr('data-id')
            //根据id获取用户的详细信息
        $.ajax({
            type: 'get',
            url: '/users/' + id,
            success: function(response) {
                var html = template('modifyTpl', response)
                $('#modifyBox').html(html)
            }
        })
    })
    //为修改表单添加表单提交事件
$('#modifyBox').on('submit', '#modifyForm', function() {
    //获取用户在表单内输入法内容
    var formData = $(this).serialize()
        //获取需要修改的那个用户的id值
    var id = $(this).attr('data-id')

    //发送请求，修改信息
    $.ajax({
            type: 'put',
            url: '/users/' + id,
            data: formData,
            success: function(response) {
                // 修改用户信息成功 重新加载页面
                location.reload()
            }
        })
        // 阻止表单默认提交
    return false;
})

$('#userBox').on('click', '.delete', function() {
    if (confirm('您真的要删除用户吗')) {
        var id = $(this).attr('data-id')
        $.ajax({
            type: 'delete',
            url: '/users/' + id,
            success: function() {
                location.reload()
            }
        })
    }
})

// 获取全选按钮
var selectAll = $('#selectAll');

var deleteMany = $('#deleteMany')

selectAll.on('change', function() {
    var status = $(this).prop('checked')

    if (status) {
        deleteMany.show()
    } else {
        deleteMany.hide()
    }

    $('#userBox').find('input').prop('checked', status)
})

$('#userBox').on('change', '.userStatus', function() {
    var inputs = $('#userBox').find('input');

    if (inputs.length == inputs.filter(':checked').length) {
        selectAll.prop('checked', true)
    } else {
        selectAll.prop('checked', false)
    }

    if (inputs.filter(':checked').length > 0) {
        deleteMany.show()
    } else {
        deleteMany.hide()
    }

})

deleteMany.on('click', function() {
    var ids = []
    var checkedUser = $('#userBox').find('input').filter(':checked')
    checkedUser.each(function(index, element) {
        ids.push($(element).attr('data-id'))
    })
    if (confirm('您确定要进行批量删除操作吗')) {
        $.ajax({
            type: 'delete',
            url: '/users/' + ids.join('-'),
            success: function() {
                location.reload()
            }
        })
    }
})