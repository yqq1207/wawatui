function sendJquery(url, data, method, traditional, callback){
    $.ajax({
        type: method,
        url: url,
        data: data,
        traditional: traditional,
        success: function(data){
            callback && callback(data);
        }
    })
}

function uploadFile(url, formData, cb) {
	$.ajax({
		url: url,
		type: 'POST',
		data: formData,
		// 告诉jQuery不要去处理发送的数据
		processData: false,
		// 告诉jQuery不要去设置Content-Type请求头
		contentType: false,
//		beforeSend: function() {
//			cb("正在进行，请稍候");
//		},
//		success: function(responseStr) {
//			if(responseStr.status === 0) {
//				cb("成功" + responseStr);
//			} else {
//				cb("失败");
//			}
//		},
//		error: function(responseStr) {
//			cb("error");
//		}
//	});
		}).done(function(res) {
			console.log(res)
			cb('成功')
		}).fail(function(res) {
			cb('失败')
		});
}

function sendData(path, data, method, callback) {
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            callback(JSON.parse(xmlhttp.responseText));
        }
    };
    var params = "http://127.0.0.1:9050/";

    xmlhttp.open(method, params + path, true);
   // xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //xmlhttp.setRequestHeader("Content-type","application/json");
    xmlhttp.send(data);
}