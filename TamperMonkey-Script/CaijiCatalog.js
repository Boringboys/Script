// ==UserScript==
// @name         caijiCatalog
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  菜鸡小目录，扫描H标签，并生成一个目录，通过向目标H标签插入唯一属性值使用JS导航，很粗糙
// @author       Boringboys
// @match        https://blog.csdn.net/*
// @match        https://www.zhihu.com/*
// @icon         https://www.boringboys.top/images/mylogo.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log('AuwavesTest 正在执行...\n作者：Boringboys');

    let firstElement = document.body.firstChild
    // console.log('第一个元素', firstElement);

    function addElementBefore (newElementid, newElementName, currentElement) {
        // 创建一个新的 div 元素
        let newElement = document.createElement(newElementName);
        newElement.setAttribute('id', newElementid);
        document.body.insertBefore(newElement, currentElement);
        return newElement;
    }

    function addElementInto (newElementid, newElementName, parentElement) {
        let newElement = document.createElement(newElementName);
        newElement.setAttribute('id', newElementid);
        parentElement.appendChild(newElement);
        return newElement;
    }

    var miniButtonElement = addElementBefore('mini_button', 'div', firstElement)
    var miniButtonInnerElement = addElementInto('mini_button_inner', 'div', miniButtonElement)

    var miniBoxElement = addElementBefore('mini_box', 'div', firstElement)
    var miniListElement = addElementInto('mini_list', 'div', miniBoxElement)

    miniBoxElement.style.setProperty('width','500px');
    miniBoxElement.style.setProperty('background','rgba(55, 55, 55, 0.8)');
    miniBoxElement.style.setProperty('position','fixed');
    miniBoxElement.style.setProperty('top','10%');
    miniBoxElement.style.setProperty('right','-500px');
    miniBoxElement.style.setProperty('border-radius','10px');
    miniBoxElement.style.setProperty('opacity','0');
    miniBoxElement.style.setProperty('z-index','9999')

    miniButtonElement.style.setProperty('background','rgba(255, 255, 255, 0.8)');
    miniButtonElement.style.setProperty('width','30px');
    miniButtonElement.style.setProperty('display','inline-block');
    miniButtonElement.style.setProperty('position','fixed');
    miniButtonElement.style.setProperty('right','40px');
    miniButtonElement.style.setProperty('opacity','0.8');
    miniButtonElement.style.setProperty('top','64px');
    miniButtonElement.style.setProperty('height','30px');
    miniButtonElement.style.setProperty('border-radius','50%');
    miniButtonElement.style.setProperty('border-style','solid');
    miniButtonElement.style.setProperty('border-color','rgb(55, 55, 55)');
    miniButtonElement.style.setProperty('border-width','3px');
    miniButtonElement.style.setProperty('z-index','9999')

    miniButtonInnerElement.style.setProperty('background','rgba(255, 255, 255, 0.8)');
    miniButtonInnerElement.style.setProperty('opacity','0.8');

    miniListElement.style.setProperty('background','rgba(55, 55, 55, 0)');
    miniListElement.style.setProperty('position','relative');
    miniListElement.style.setProperty('top','2%');
    miniListElement.style.setProperty('height','96%');
    miniListElement.style.setProperty('left','10px');
    miniListElement.style.setProperty('width','480px');
    miniListElement.style.setProperty('padding-top','20px');
    miniListElement.style.setProperty('padding-bottom','20px');



    // 找到下一个h标签
    function next_h(node){
        var n = node.nextElementSibling;
        while(n !== null){
            if(n.nodeName.length === 2 && n.nodeName.toLowerCase()[0] === "h"){
                break;
            }
            else{
                n = n.nextElementSibling;
            }
        }
        return n; // null或<h?>
    }
    function get_indentattion(n){
        let indentation = "&nbsp&nbsp&nbsp";
        let r = "";
        for (var i=0;i<n-1;i++){
            r += indentation;
        }
        return r + "&nbsp&nbsp";
    }

    // 扫描目录输出目录信息
    function output_TOC(t, html){
        var line = "";
        if(t.nodeName.length === 2 && t.nodeName.toLowerCase()[0] === "h"){
            let miniListIndex = crypto.randomUUID();
            let tagName = t.nodeName;
            t.setAttribute('mini_list_index', miniListIndex);
            line = get_indentattion(Number(t.nodeName[1])) + "<a href=\"javascript:document.querySelector(`" + tagName + "[mini_list_index='" + miniListIndex + "']`).scrollIntoView()\" class=\"a_list\" style=\"text-decoration: none;color: rgb(197, 194, 194)\">" + t.textContent.replaceAll(" ", "") + "</a><br>\n";
            html += line;
        }

        for (let node of t.childNodes) {
            html = output_TOC(node, html)
        }

        return html;
    }

    // 将已知的目录信息进行提取，设置到右侧导航栏
    function set_TOC(m){
        var html = ""; //待会的sidebar内容
        html = output_TOC(m, html);

        var sdbar = document.getElementById("mini_list"); // 侧边栏
        if(sdbar === null){
            setTimeout(() => {
                set_TOC(m); // 递归调用自我
            }, 1000);
        }
        else{
            sdbar.innerHTML = html;
        }
    }

    window.onload=init;
	function init() {
		var box=document.getElementById('mini_box');
        var btn=document.getElementById('mini_button');

        //var abc=document.getElementsByClassName("post-content")[0];///////将文章第一个标签填写在main处
        var abc=document.body; ///////将文章第一个标签填写在main处
        var speed=20;//速度
        var timer,timer2;
        //鼠标点击事件
        btn.onclick=function(){
            clearInterval(timer2);//清除定时器
            timer2=setInterval(moveLeft,50);
            btn.style.display="none";
        };

        //鼠标在按钮上方，按钮出现
        btn.onmousemove=function(){
            clearInterval(timer);
            timer=setInterval(btn_display,50);
        }

        //鼠标离开按钮上方
        btn.onmouseleave=function(){
            clearInterval(timer);
            timer=setInterval(un_btn_display,50);
        }


        //鼠标离开弹窗
        box.onmouseleave=function(){
            clearInterval(timer2);
            timer2=setInterval(moveRight,50);
            btn.style.display="inline-block";
        };

        //按钮加深
        function btn_display(){
            var arl=btn.style.opacity;
            miniButtonElement.style.setProperty('background','rgba(55, 55, 55, 0.8)');
            if(arl>=1){
                clearInterval(timer);
            }else{
                btn.style.opacity=Number(arl)+0.01;
            }
            btn.style.setProperty('border-color','rgb(200, 200, 200)');
        }

        //按钮复原
        function un_btn_display(){
            var arl=btn.style.opacity;
            miniButtonElement.style.setProperty('background','rgba(255, 255, 255, 0.8)');
            if(arl<=0.8){
                clearInterval(timer);
            }else{
                btn.style.opacity=Number(arl)-0.01;
            }
            btn.style.setProperty('border-color','rgb(55, 55, 55)');
        }

        //向左移动
        function moveLeft(){
            var r=document.documentElement.clientWidth-box.offsetLeft;//右边距
            var arl=box.style.opacity;
            if(r>=520){
                clearInterval(timer2);
            }else{
                box.style.right=r-500+speed+'px';
                box.style.opacity=Number(arl)+0.1;
            }
        }

        //滑块移动
        function moveRight(){
            var r=document.documentElement.clientWidth-box.offsetLeft;//边距
            var arl=box.style.opacity;
            if(r<=0){
                clearInterval(timer2);//停止
            }else{
                box.style.right=r-500-speed+'px';	//移动
                box.style.opacity=Number(arl)-0.1;
            }

        }
        var timer1 = setTimeout(set_TOC(abc),2000); //timer1->1 (当前是第一个定时器)
        //set_TOC(abc);//如果文章是异步加载，须让此函数在文章加载后执行
	}
})();
