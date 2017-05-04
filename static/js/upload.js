
//引入Plupload 、qiniu.js后
var domain_qiniu = 'http://odouif6sj.bkt.clouddn.com/';
var uploader = Qiniu.uploader({
    runtimes: 'html5,html4',    //上传模式,依次退化
    browse_button: 'j-open-pic',       //上传选择的点选按钮，**必需**
    uptoken_url: '/admin/createUptoken',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
    // uptoken : 'xozWSPMxkMjIVoHg2JyXq4-7-oJaEADLOKHVR0vU:XDa16MFyPG7FWFqKtYpj9tOkFGc=:eyJzY29wZSI6Impzc2RrIiwiZGVhZGxpbmUiOjE0OTE4Mzk3Mzl9', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
    // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
    // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
    domain: domain_qiniu,   //bucket 域名，下载资源时用到，**必需**
    get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
    container: 'j-upload-container',           //上传区域DOM ID，默认是browser_button的父元素，
    max_file_size: '100mb',           //最大文件体积限制
    // flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
    max_retries: 3,                   //上传失败最大重试次数
    // dragdrop: true,                   //开启可拖曳上传
    // drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
    chunk_size: '4mb',                //分块上传时，每片的体积
    auto_start: false,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
    init: {
        'FilesAdded': function(up, files) {
            // plupload.each(files, function(file) {
            //     // 文件添加进队列后,处理相关的事情
            // });
            // $('table').show();
            // $('#success').hide();
            plupload.each(files, function(file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                // progress.setStatus("等待...");
                progress.bindUploadCancel(up);
            });
        },
        'BeforeUpload': function(up, file) {
            // 每个文件上传前,处理相关的事情
            $(".f-upload-pic-modal").modal('hide');
            $(".f-upload-process-modal").modal()
            var progress = new FileProgress(file, 'fsUploadProgress');
            var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
            if (up.runtime === 'html5' && chunk_size) {
                progress.setChunkProgess(chunk_size);
            }
        },
        'UploadProgress': function(up, file) {
            // 每个文件上传时,处理相关的事情
            var progress = new FileProgress(file, 'fsUploadProgress');
            var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
            progress.setProgress(file.percent + "%", file.speed, chunk_size);
        },
        'FileUploaded': function(up, file, info) {
            // 每个文件上传成功后,处理相关的事情
            // 其中 info 是文件上传成功后，服务端返回的json，形式如
            // {
            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
            //    "key": "gogopher.jpg"
            //  }
            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
            // console.log(up);
            var fileName = JSON.parse(info).key;
            if (file.type.indexOf('image') > -1) {
                mditor.editor.wrapSelectText('![' + fileName + '](' + domain_qiniu + fileName + ')' + mditor.EOL);
            } else {
                mditor.editor.wrapSelectText('[' + fileName + '](' + domain_qiniu + fileName + ')' + mditor.EOL);
            }
            $(".f-upload-process-modal").modal('hide');
            $('#fsUploadProgress').html('');
            // var domain = up.getOption('domain');
            // var res = parseJSON(info);
            // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
        },
        'Error': function(up, err, errTip) {
            //上传出错时,处理相关的事情
            console.log(up);
            console.log(err);
            console.log(errTip);
            alter('上传出错');
        },
        'UploadComplete': function() {
                //队列文件处理完毕后,处理相关的事情
        }
        // 'Key': function(up, file) {
        //     // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
        //     // 该配置必须要在 unique_names: false , save_key: false 时才生效

        //     // var key = "";
        //     // do something with key here
        //     return key
        // }
    }
});

$('#j-upload-pic').on('click', function(){
    let fileUrl = $('.j-file-ipt').val();
    if (fileUrl) {
        mditor.editor.wrapSelectText('![', '](' + fileUrl + ')');
        $(".f-upload-pic-modal").modal('hide');
    } else {
        uploader.start();
    }
});
// domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取

// uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
