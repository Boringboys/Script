// ==UserScript==
// @name         AutoZoomRemoveHorizontalScroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  当存在水平滚动条时自动缩放页面到适合窗口宽度
// @author       Boringboys
// @match        https://blog.csdn.net/*
// @icon         https://www.boringboys.top/images/mylogo.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log('AutoZoomRemoveHorizontalScroll 正在执行...\n作者：Boringboys');

    detectAndChangeZoom()

    function detectAndChangeZoom(){
        console.log('检测默认尺寸是否合适...');
        // 先清除zoom设定
        document.body.style.zoom = '';
        // 检测在页面默认尺寸下是否有水平滚动条
        if (document.documentElement.clientWidth / document.body.scrollWidth != 1){
            // 如果默认的尺寸有滚动条就自动缩放页面到合适的宽度
            let newZoom = document.documentElement.clientWidth / document.body.scrollWidth;
            document.body.style.zoom = newZoom;
            console.log('默认尺寸不太妙，已缩放页面到合适尺寸：', newZoom);
        }
        else
        {
            console.log('默认尺寸不错，不用咱来缩放了。。。');
        }

    }

    var eventTimeOut;
    window.addEventListener('resize', function(){
        // 使用延时防止缩放代码被频繁执行
        if (eventTimeOut) {clearTimeout(eventTimeOut)}
        eventTimeOut = setTimeout(function(){
            console.log('页面大小已改变');
            detectAndChangeZoom();
        }, 500);
    });
})();
