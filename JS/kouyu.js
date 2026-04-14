function updateDateTime() {
	const now = new Date();
            
	// 获取日期和时间组件，padStart() 用于在字符串‌开头‌补全字符的方法。→ padding 衬垫
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
            
	// 获取星期
	const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
	const week = weekDays[now.getDay()];
            
	// 格式化完整日期时间
	const dateOnly = `${year}-${month}-${day}`;
	const timeOnly = `${hours}:${minutes}:${seconds}`;
	
	// 考试时显示的附加文字
	// const ks = '<br><img src="./img/flower.png"  width="300" height="120" >考试进行中...';
	const ks = '<br>🌼🌼🌼 考试进行中...';		
	// 判断考试状态显示
	if (timeOnly>="08:30:00" && timeOnly<"09:00:00") {
		statusDisplay = '第一场👉08:30-09:00'+ ks;
	} else if (timeOnly>="09:00:00" && timeOnly<"09:30:00") {
		statusDisplay = '第二场👉09:00-09:30'+ ks;
	} else if (timeOnly>="09:30:00" && timeOnly<"10:00:00") {
		statusDisplay = '第三场👉09:30-10:00'+ ks;
	} else if (timeOnly>="10:00:00" && timeOnly<"10:30:00") {
		statusDisplay = '第四场👉10:00-10:30'+ ks;
	} else if (timeOnly>="10:30:00" && timeOnly<"11:00:00") {
		statusDisplay = '第五场👉10:30-11:00'+ ks;
	} else if (timeOnly>="11:00:00" && timeOnly<"11:30:00") {
		statusDisplay = '第六场👉11:00-11:30'+ ks;
	} else {
		statusDisplay = '考试等待中...';
	}
			
	// 更新显示
	document.getElementById('week').textContent = week;
	document.getElementById('dateOnly').textContent = dateOnly;
	document.getElementById('timeOnly').textContent = timeOnly;
		//包含 html 标签时，要用 innerHTML ，textContent 为纯文本
	document.getElementById("statusDisplay").innerHTML = statusDisplay;
}

document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
});


        document.addEventListener('DOMContentLoaded', function() {
            const imageContainer = document.getElementById('imageContainer');
            const image = imageContainer.querySelector('img');
            
            // 检查是否支持全屏API
            const docElm = document.documentElement;
            const requestFullscreen = docElm.requestFullscreen || 
                                     docElm.mozRequestFullScreen || 
                                     docElm.webkitRequestFullScreen || 
                                     docElm.msRequestFullscreen;
            
            const exitFullscreen = document.exitFullscreen || 
                                  document.mozCancelFullScreen || 
                                  document.webkitExitFullscreen || 
                                  document.msExitFullscreen;
            
            const fullscreenElement = () => document.fullscreenElement || 
                                           document.mozFullScreenElement || 
                                           document.webkitFullscreenElement || 
                                           document.msFullscreenElement;
            
            // 切换全屏状态
            function toggleFullscreen() {
                if (!fullscreenElement()) {
                    // 进入全屏
                    if (requestFullscreen) {
                        requestFullscreen.call(docElm);
                    }
                } else {
                    // 退出全屏
                    if (exitFullscreen) {
                        exitFullscreen.call(document);
                    }
                }
            }
 
            // 事件监听
            imageContainer.addEventListener('click', toggleFullscreen);
            
            // 监听全屏变化
            document.addEventListener('fullscreenchange', updateStatus);
            document.addEventListener('webkitfullscreenchange', updateStatus);
            document.addEventListener('mozfullscreenchange', updateStatus);
            document.addEventListener('MSFullscreenChange', updateStatus);
            
            // 初始状态
            updateStatus();
        });



