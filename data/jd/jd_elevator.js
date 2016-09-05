//$可直接用
//window.onload=function(){} 会覆盖jd_index.js中的
//解决
window.addEventListener('load',function(){
	elevator.init();
});
//定义全局函数getElementTop,获取任意元素距页面顶部的总距离
function getElementTop(elem){
	var elemTop=elem.offsetTop;
	elem=elem.offsetParent;
	while (elem!=null)
	{
		elemTop+=elem.offsetTop;
		elem=elem.offsetParent;
	}
	return elemTop;
}
var elevator={
	FLOORHEIGHT:0,//保存每层楼的高度：楼层高度+楼间距
	UPLEVEL:0,
	DOWNLEVEL:0,
	
	init:function(){
		//获得id为f1的div的计算后的样式，保存在style中
		//设置FLOORHEIGHT为height+marginBottom
		var style=getComputedStyle($('#f1'));
		this.FLOORHEIGHT=parseFloat(style.height)+parseFloat(style.marginBottom)
		this.UPLEVEL=(innerHeight-this.FLOORHEIGHT)/2;
		this.DOWNLEVEL=this.UPLEVEL+this.FLOORHEIGHT;
		//为网页绑定滚动事件
		window.addEventListener('scroll',this.scroll.bind(this));
		//为id为elevator下的ul绑定onmouseover
		$('#elevator>ul').addEventListener('mouseover',this.liToggle);
		//为id为elevator下的ul绑定onmouseout事件作为liSate
		$('#elevator>ul').addEventListener('mouseout',this.liState);
		$('#elevator').addEventListener('click',this.scrollPage.bind(this))

	},
	scrollPage:function(e){//负责将页面滚动到指定位置
		e=e||window.event;//获得时间对象
		var target=e.srcElement||e.target;
		//获得当前target对应的序号
		if (target.nodeName=="A")
		{
			var i=parseInt(target.previousElementSibling.innerHTML);
			//获得span
			var span=$('#f'+i+">header>span");
			var elemTop=getElementTop(span);
			window.scrollTo(0,elemTop-this.UPLEVEL);
		}
	},
	liToggle:function(e){//当鼠标进入一个li时，切换当前li的a
		//获得target
		//如果target是a
		e=e||window.event;
		var target=e.srcElement||e.target;
		
			target.nodeName=="A"&&(target=target.parentNode);
			if (target.nodeName=="LI")
			{
				target.$('a:first-child').style.display="none";
				target.$('.etitle').style.display="block";
			}
			
	},
	scroll:function(){//在页面滚动时,触发楼层亮灯的检测
		//找到所有.floor下的header下的直接子元素span，保存在spans中
		var spans=$(".floor>header>span");
		//遍历span下的每个span
		for (var i=0;i<spans.length;i++)
		{
			//获取当前span距离页面顶部的top值保存在变量elemTop中
			
			var elemTop=getElementTop(spans[i]);
			//获得scollTop
			var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;

			//如果当前页面滚动的scrollTop>elemTop-(innerHeight-FLOORHEIGHT)/2
				//清除当前span的class
			//否则如果当前页面滚动的scrollTop>elemTop-(innerHeight-FLOORHEIGHT)/2-FLOORHEIGHT
				//设置span的class为hover
			if (scrollTop>elemTop-this.UPLEVEL){
				spans[i].className="";
			}else if (scrollTop>elemTop-this.DOWNLEVEL){
				spans[i].className="hover";
			}else{
				spans[i].className="";
			}
		}//遍历结束
		//查找floor下header下的span中class为hover的
		var hoverSpan=$(".floor>header>span.hover");
		//如果hover有效
			//让id为elevator的div显示出来
		//否则 让id为elevator的div隐藏
		$('#elevator').style.display=hoverSpan!=null?"block":"none";
		this.liState();
	},
	liState:function(){
		var spans=$(".floor>header>span");
		var lis=$('#elevator li')
		for (var i=0;i<spans.length;i++)
		{
			if(spans[i].className=="hover"){
				lis[i].$("a:first-child").style.display="none";
				lis[i].$("a:first-child+a").style.display="block";
			}else{
				lis[i].$("a:first-child").style.display="block";
				lis[i].$("a:first-child+a").style.display="none";
			}
		}
	},
}