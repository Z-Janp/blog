
var mditor =  Mditor.fromTextarea(document.getElementById('editor'));
mditor.on('ready',function(){	
	var btn = mditor.toolbar.getItem('image');
	//替换按钮动作
	btn.handler = function(){
		$(".f-upload-pic-modal").modal()
	};
});

$('#pubBtn').on('click', function () {
	$('#article').data('bootstrapValidator').validate();
	if (!$('#article').data('bootstrapValidator').isValid()) {
		return;
	}
	$.ajax({
		url: '/admin/publish',
		cache: true,
		type: 'post',
		data: $('#article').serialize(),
		success: function (data) {
			if (data && data.success === 1) {
				window.location.href = '/article/' + data.id;
			}
			if (data && data.error === -2) {
				$("#loginLink").click();
				$('.error_txt').html(data.data);
			}
		},
		error: function (error) {
			console.log(error);
		}
	})
})
$('#loginLink').on('click', function () {
	$('.error_txt').html('');
})
$('#article').bootstrapValidator({
	message: 'This value is not valid',
	feedbackIcons: {
		valid: 'glyphicon glyphicon-ok',
		invalid: 'glyphicon glyphicon-remove',
		validating: 'glyphicon glyphicon-refresh'
	},
	fields: {
		'article[title]': {
			validators: {
				notEmpty: {
					message: '标题不能为空'
				}
			}
		},
		'article[content]': {
			validators: {
				notEmpty: {
					message: '内容不能为空'
				}
			}
		}
	}
});