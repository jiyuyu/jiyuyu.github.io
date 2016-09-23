var game={
	data:null,//保存RN行CN列的二维数组
	RN:3,//保存总行数
	CN:3,//保存总列数
	score:0,//保存游戏的分数
	top1:0,//保存游戏的历史最高分
	state:1,//用来保存游戏当前状态
	RUNNING:1,//用来定义运行状态，值为1
	GAMEOVER:0,//定义游戏结束状态，值为0
	MARGIN:16,//保存每个格之间的间距
	CSIZE:100,//保存每个格的宽和高

	getTop:function(){//获得cookie中的最高分
		var cookies=document.cookie.split("; ");
		for (var i=0;i<cookies.length;i++)
		{
			var kv=cookies[i].split("=");
			cookies[kv[0]]=kv[1];
		}
		return cookies["top1"]||0;
	},
	setTop:function(){//将当前游戏的分数保存到cookie中
		var now=new Date();
		now.setFullYear(now.getFullYear()+10);
		document.cookie="top1="+this.score+";expires="+now.toGMTString();
	
	},
	getInnerHTML:function(){
		var arr=[];
		for (var r=0;r<this.RN;r++)
		{
			for (var c=0;c<this.CN;c++)
			{
				arr.push(""+r+c);
			}
		}
		//console.log(String(arr));//打桩
		var html='<div id="g'+arr.join('" class="grid"></div><div id="g')+'"class="grid"></div>';
		html+='<div id="c'
		+arr.join('" class="cell"></div><div id="c')+'"class="cell"></div>';
		return html;
		
	},
	//游戏启动的方法
	start:function(){
		var div=document.getElementById("gridPanel");
		div.innerHTML=this.getInnerHTML();
		div.style.width=this.CN*this.CSIZE+this.MARGIN*(this.CN+1)+"px";
		div.style.height=this.RN*this.CSIZE+this.MARGIN*(this.RN+1)+"px";
		this.state=this.RUNNING;//初始化游戏状态为运行
		this.data=[];
		for (var r=0;r<this.RN;r++)
		{
			this.data.push([]);
			for (var c=0;c<this.CN;c++)
			{
				this.data[r][c]=0;
			}
		}
		
		//重置分数
		this.score=0;
		this.top1=this.getTop();
		this.randomNum();
		this.randomNum();

		this.updateView(); 
		
		var me=this;//留住this

		//为当前网页绑定键盘按下事件
		$("body").on("touchstart", function(e) {

    startX = e.originalEvent.changedTouches[0].pageX,
    startY = e.originalEvent.changedTouches[0].pageY;
});
document.body.addEventListener("touchmove",function(e) {
    e.preventDefault();
    moveEndX = e.originalEvent.changedTouches[0].pageX,
    moveEndY = e.originalEvent.changedTouches[0].pageY,
    X = moveEndX - startX,
    Y = moveEndY - startY;
     
    if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {
        me.moveRight();
    }
    else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {
        me.moveLeft();
    }
    else if ( Math.abs(Y) > Math.abs(X) && Y > 0) {
        me.moveDown();
    }
    else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {
        me.moveUp();
    }
   
});

		document.onkeydown=function(){
			//只有在游戏运行时，才响应
			if (this.state==this.RUNNING)
			{
			var e=window.event||arguments[0];
			switch(e.keyCode){
				case 37:me.moveLeft();break;
				case 39:me.moveRight();break;
				case 38:me.moveUp();break;
				case 40:me.moveDown();break;
		
			}
			
			};

		}

		console.log(this.data.join("\n"));
	},
	move:function(iterator){//重构所有移动方法的相同部分
		var before=String(this.data);
		iterator.call(this);
		var after=String(this.data);
		if(before!=after){
			this.randomNum();
			animation.start(function(){
			if(this.isGameOver()){
				this.state=this.GAMEOVER;
				this.score>this.top1&&this.setTop();
			}
		//	调用updateView更新页面
			this.updateView();
			}.bind(this));
		}
	},
	/****************************上移********************/
	moveUp:function(){
		this.move(function(){
			for (var c=0;c<this.CN;c++)
			{
				this.moveUpCol(c);
			}
		});
	},
	moveUpCol:function(c){
		for (var r=0;r<this.RN-1;r++ )
		{
			var nextr=this.getNextInCol(r,c);
			if (nextr==-1){
				break;
			}else if (this.data[r][c]==0)
			{
				this.data[r][c]=this.data[nextr][c];
				animation.addTask(
					document.getElementById("c"+nextr+c),
					nextr,c, r,c
				)
				this.data[nextr][c]=0;
				r--;
			}else if (this.data[r][c]==this.data[nextr][c])
			{
				this.data[r][c]*=2;
				this.score+=this.data[r][c];
				this.data[nextr][c]=0;
			}
		}
	},
	getNextInCol:function(r,c){
		//nextc从c+1开始遍历r行中剩余元素
		for (var nextr=r+1;nextr<this.RN;nextr++)
		{
			//alert(this.data[nextr][c]);
			if (this.data[nextr][c]!=0)
			{
				return nextr;
			}
		}
		return -1;
	},
	/****************************下移********************/
	moveDown:function(){
		//将data转为字符串保存在变量before中
		this.move(function(){
			for (var c=0;c<this.CN;c++)
			{
				this.moveDownCol(c);
			}
		});
		
	},
	moveDownCol:function(c){
		for (var r=this.CN-1;r>0;r--)
		{
			var prevc=this.getPrevInCol(r,c);
			if (prevc==-1)
			{
				break;
			}else if (this.data[r][c]==0)
			{
				this.data[r][c]=this.data[prevc][c];
				animation.addTask(
					document.getElementById("c"+prevc+c),
					prevc,c, r,c
				)
				this.data[prevc][c]=0;
				r++;
			}else if (this.data[r][c]==this.data[prevc][c])
			{
				this.data[r][c]*=2;
				this.score+=this.data[r][c];
				this.data[prevc][c]=0;
			}
		}
	},
	getPrevInCol:function(r,c){
		for (var prevc=r-1;prevc>=0;prevc--)
		{
			if (this.data[prevc][c]!=0)
			{
				return prevc;
			}
		}
		return -1;
	},
	/****************************右移********************/
	moveRight:function(){//右移所有行
		this.move(function(){
			for (var r=0;r<this.RN;r++)
			{
				this.moveRightInRow(r);
			}
		});
		
	},
	moveRightInRow:function(r){
		for (var c=this.CN-1;c>0;c--)
		{
			var prevc=this.getPrevInRow(r,c);
			if(prevc==-1){break;}
			else if (this.data[r][c]==0)
			{
				this.data[r][c]=this.data[r][prevc];
				animation.addTask(
					document.getElementById("c"+r+prevc),
					r,prevc, r,c
				)
				this.data[r][prevc]=0;
				c++;
			}
			else if (this.data[r][c]==this.data[r][prevc])
			{
				this.data[r][c]*=2;
				this.score+=this.data[r][c];
				this.data[r][prevc]=0;
			}
		}
	},
	getPrevInRow:function(r,c){
		for (var prevc=c-1;prevc>=0;prevc--)
		{
			if (this.data[r][prevc]!=0)
			{
				return prevc;
			}
		}
		return -1;
	},
	/****************************左移********************/
	moveLeft:function(){//左移所有行
	
		this.move(function(){
			for (var r=0;r<this.RN;r++)
			{
				this.moveLeftInRow(r)
			}
		});
		
	},
	moveLeftInRow:function(r){//左移第r行

		for (var c=0;c<this.CN-1;c++)
		{
			var nextc=this.getNextInRow(r,c);//找下一个
			if (nextc==-1){break;}
			else if (this.data[r][c]==0)
				{
				this.data[r][c]=this.data[r][nextc];
				animation.addTask(
					document.getElementById("c"+r+nextc),
					r,nextc, r,c
				);
				this.data[r][nextc]=0;
				c--;
			}else if (this.data[r][c]==this.data[r][nextc]){
				this.data[r][c]*=2;
				this.score+=this.data[r][c];
				this.data[r][nextc]=0;
			}
				
		}
	},
	getNextInRow:function(r,c){//查找c之后下一个不为0的位置
		//nextc从c+1开始遍历r行中剩余元素
		for (var nextc=c+1;nextc<this.CN;nextc++)
		{
			if (this.data[r][nextc]!=0)
			{
				return nextc;
			}
		}
		return -1;
	},
	randomNum:function(){//在随机空白位置生成2或者4
		for (; ; )
		{
			var r=parseInt(Math.random()*this.RN);
			var c=parseInt(Math.random()*this.CN);
			if (this.data[r][c]==0)
			{
				var g=Math.random();
				if (g<0.5)
				{
					this.data[r][c]=2;
					break;
				}else{
					this.data[r][c]=4;
					break;
				}
			}
			//退出循环
		}
	},
	updateView:function(){//将data中的数据更新到页面
		for (var r=0;r<this.RN;r++)
		{
			for (var c=0;c<this.CN;c++)
			{
				var div=document.getElementById("c"+r+c);
				if(this.data[r][c]!=0)
				{
					div.innerHTML=this.data[r][c];
					div.className="cell n"+this.data[r][c];
				}else{
					div.innerHTML="";
					div.className="cell";
				}
			}
		
			document.getElementById("score").innerHTML=this.score;
			
			document.getElementById("top").innerHTML=this.top1;
		
			var div=document.getElementById("gameover");
			if (this.state==this.RUNNING)
			{
				div.style.display="none";
			
			}else{
				div.style.display="block";
				document.getElementById("final").innerHTML=this.score;
			
			}

		}
	},
	isGameOver:function(){
	
		for (var r=0;r<this.RN;r++)
		{
			for (var c=0;c<this.CN;c++)
			{
				if (this.data[r][c]==0)
				{
					return false;
				}else if (c<this.CN-1&&this.data[r][c]==this.data[r][c+1])
				{
					return false;
				}else if (r<this.RN-1&&this.data[r][c]==this.data[r+1][c])
				{
					return false;
				}
			}
		}
		return true;
	},
}
//在页面加载后自动启动游戏
window.onload=function(){
	game.start();
}
