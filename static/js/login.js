$(function () {
	$('#login').on('click', function () {
		$('#formlogin').data('bootstrapValidator').validate();
		if (!$('#formlogin').data('bootstrapValidator').isValid()) {
			return;
		}
		$.ajax({
			url: '/user/login',
			type: 'post',
			data: $('#formlogin').serialize(),
			success: function (data) {
				if (data && data.success === 1) {
					if (window.location.href.indexOf('login') > -1) {
						window.location.href = '/';
					} else {
						$('#dismissBtn').click();
						$('.navbar').find('.container').html('<p class="navbar-text navbar-right"><span>' + data.user + '</span><span>&nbsp;|&nbsp;</span><a href="/user/logout" class="navbar-link">退出</a></p>');
					}
				} else if (data && data.error === -1) {
					$('.error_txt').html(data.data);
				}
			},
			error: function (error) {
				console.log(error);
			}
		})
	})
	$('#formlogin').bootstrapValidator({
		message: 'This value is not valid',
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		fields: {
			'user[name]': {
				validators: {
					notEmpty: {
						message: '用户名不能为空'
					}
				}
			},
			'user[password]': {
				validators: {
					notEmpty: {
						message: '密码不能为空'
					}
				}
			}
		}
	});
	$('.bv-hidden-submit').remove();
});