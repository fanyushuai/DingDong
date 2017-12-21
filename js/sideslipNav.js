var main,menu, mask = mui.createMask(_closeMenu),bodyHeight;

function back() {
	if(showMenu) {
		//菜单处于显示状态，返回键应该先关闭菜单,阻止主窗口执行mui.back逻辑；
		closeMenu();
		return false;
	} else {
		//菜单处于隐藏状态，执行返回时，要先close菜单页面，然后继续执行mui.back逻辑关闭主窗口；
		menu.close('none');
		return true;
	}
}
//plusReady事件后，自动创建menu窗口；
mui.plusReady(function() {
	main = plus.webview.currentWebview();
	bodyHeight = plus.display.resolutionHeight;
	//setTimeout的目的是等待窗体动画结束后，再执行create webview操作，避免资源竞争，导致窗口动画不流畅；
	setTimeout(function() {
		//侧滑菜单默认隐藏，这样可以节省内存；
		menu = mui.preload({
			id: 'menu',
			url: 'menu.html',
			styles: {
				left: 0,
				width: '70%',
				zindex: 9997
			}
		});
	}, 300);

});
/**
 * 显示菜单
 */
function openMenu() {
	//侧滑菜单处于隐藏状态，则立即显示出来；
	//显示完毕后，根据不同动画效果移动窗体；
	menu.show('none', 0, function() {
		menu.setStyle({
			left: '0%',
			transition: {
				duration: 150
			}
		});
	});
	//显示遮罩
	mask.show();
	showMenu = true;
}
/**
 * 关闭侧滑菜单
 */
function closeMenu() {
	_closeMenu();
	//关闭遮罩
	mask.close();
}

/**
 * 关闭侧滑菜单（业务部分）
 */
function _closeMenu() {
	if(showMenu) {
		//关闭遮罩；
		menu.setStyle({
			left: '-70%',
			transition: {
				duration: 150
			}
		});
		//等窗体动画结束后，隐藏菜单webview，节省资源；
		setTimeout(function() {
			menu.hide();
		}, 200);
		//改变标志位
		showMenu = false;
	}
}

//点击左上角图标，打开侧滑菜单；
document.querySelector('.mui-icon-bars').addEventListener('tap', openMenu);
//在android4.4中的swipe事件，需要preventDefault一下，否则触发不正常
//故，在dragleft，dragright中preventDefault
window.addEventListener('dragright', function(e) {
	e.detail.gesture.preventDefault();
});
window.addEventListener('dragleft', function(e) {
	e.detail.gesture.preventDefault();
});
//主界面向右滑动，若菜单未显示，则显示菜单；否则不做任何操作；
window.addEventListener("swiperight", openMenu);
//主界面向左滑动，若菜单已显示，则关闭菜单；否则，不做任何操作；
window.addEventListener("swipeleft", closeMenu);
//menu页面向左滑动，关闭菜单；
window.addEventListener("menu:swipeleft", closeMenu);

//重写mui.menu方法，Android版本menu按键按下可自动打开、关闭侧滑菜单；
mui.menu = function() {
	if(showMenu) {
		closeMenu();
	} else {
		openMenu();
	}
}