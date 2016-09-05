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
		//声明空数组arr
		//r从0开始，到<RN结束
		//c从0开始，
		//
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
	//****对象自己的方法，要用自己的任何属性，必须+this
	//游戏启动的方法
	start:function(){
		//找到id为gridPanel的div
		var div=document.getElementById("gridPanel");
		div.innerHTML=this.getInnerHTML();
		//设置div的内容为getInnerHTML的结果

		//设置div的style的宽为：CN*CSIZE+MARGIN*(CN+1)+"px"
		div.style.width=this.CN*this.CSIZE+this.MARGIN*(this.CN+1)+"px";
		//设置div的style的高为：RN*CSIZE+MARGIN*(RN+1)+"px"
		div.style.height=this.RN*this.CSIZE+this.MARGIN*(this.RN+1)+"px";
		this.state=this.RUNNING;//初始化游戏状态为运行
		//根据RN和CN初始化data二维数组
		//外层循环控制行r，从0开始到RN-1结束，同时初始化data为空数组
		//向data中压入一个空数组[]
		//内层循环控制列c,从0开始到CN-1结束，同时初始化data为空数组
		//   设置r行c列的元素为0
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
		//调用randomNum()方法，生成2个随机数
		this.randomNum();
		this.randomNum();

		this.updateView(); 
		
		var me=this;//留住this

		//为当前网页绑定键盘按下事件
		document.onkeydown=function(){
			//只有在游戏运行时，才响应
			if (this.state==this.RUNNING)
			{
				//this-->document
			//获得按键号
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
		//将data转为String，保存在before中
		var before=String(this.data);
		iterator.call(this);
		//将data转为String，保存在after中
		var after=String(this.data);
		//如果before不等于after
		if(before!=after){
		//	调用randomNum随机生成一个数
			this.randomNum();
			animation.start(function(){
			if(this.isGameOver()){
				this.state=this.GAMEOVER;
				//如果score>top1;
				//将score存入cookie
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
		//调用moveLeftInRow,传入行号r作为参数
		//(遍历结束)
		//将data转为字符串保存在变量after中
		//如果before不等于after
		//调用randomNum生成一个随机数
		//调用updataVIEW更新页面
	},
	moveUpCol:function(c){
		//从0开始遍历data中r中的每个格，到<CN-1结束
		for (var r=0;r<this.RN-1;r++ )
		{
			var nextr=this.getNextInCol(r,c);
			if (nextr==-1){
				break;
			}else if (this.data[r][c]==0)
			{
				this.data[r][c]=this.data[nextr][c];
				//找到rc位置的div,加入要移动的任务
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
		//查找下一个不为0的数的位置nextc
		///如果nextc没找到，就退出循环 
		//否则
		//    如果当前元素是0
		//   就将当前元素设置为nextc位置的元素
		//   将nextc位置设置为0
		//    c--;
		//   否则，如果当前元素等于nextc位置的值，就将当前元素*=2
		//将nextc位置设置为0
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
		//如果nextc位置的元素不等于0
		//    返回nextc
		//(遍历结束)返回-1	
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
		
		//调用moveLeftInRow,传入行号r作为参数
		//(遍历结束)
		//将data转为字符串保存在变量after中
		//如果before不等于after
		//调用randomNum生成一个随机数
		//调用updataVIEW更新页面
		
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
		//查找下一个不为0的数的位置nextc
		///如果nextc没找到，就退出循环 
		//否则
		//    如果当前元素是0
		//   就将当前元素设置为nextc位置的元素
		//   将nextc位置设置为0
		//    c--;
		//   否则，如果当前元素等于nextc位置的值，就将当前元素*=2
		//将nextc位置设置为0
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
		//将data转为String，保存在before中
		//遍历data中每一行
		//调用moveRightInRow
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
		//将data转为字符串保存在变量before中
		//遍历data中每一行
		//调用moveLeftInRow,传入行号r作为参数
		//(遍历结束)
		//将data转为字符串保存在变量after中
		//如果before不等于after
		//调用randomNum生成一个随机数
		//调用updataVIEW更新页面
		this.move(function(){
			for (var r=0;r<this.RN;r++)
			{
				this.moveLeftInRow(r)
			}
		});
		
	},
	moveLeftInRow:function(r){//左移第r行

		//从0开始遍历data中r中的每个格，到<CN-1结束
		//查找下一个不为0的数的位置nextc
		///如果nextc没找到，就退出循环 
		//否则
		//    如果当前元素是0
		//   就将当前元素设置为nextc位置的元素
		//   将nextc位置设置为0
		//    c--;
		//   否则，如果当前元素等于nextc位置的值，就将当前元素*=2
		//将nextc位置设置为0
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
		
		//如果nextc位置的元素不等于0
		//    返回nextc
		//(遍历结束)返回-1
	},
	randomNum:function(){//在随机空白位置生成2或者4
		for (; ; )
		{
			//在0~RN-1之间生成一个随机数r
			var r=parseInt(Math.random()*this.RN);
			//在0~CN-1之间生成一个随机数c
			var c=parseInt(Math.random()*this.CN);
			//如果data中r行c列的值为0
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
				// 随机一个数字，如果<0.5,就设置data的r行c列为2，否则设置为4
			}
			//退出循环
		}
	},
	updateView:function(){//将data中的数据更新到页面
		//遍历data中的每个元素
		for (var r=0;r<this.RN;r++)
		{
			for (var c=0;c<this.CN;c++)
			{
				//找到页面上id为'c'+r+c的div
				var div=document.getElementById("c"+r+c);
				//如果data中r行c列的元素不等于0
				if(this.data[r][c]!=0)
				{
					//  设置div的内容为data中的r行c列的值
					div.innerHTML=this.data[r][c];
					//  设置div的className属性为"cell n"+data中r行c列的值
					div.className="cell n"+this.data[r][c];
				}else{
					//否则
					//设置div的内容为""
					div.innerHTML="";
					//设置div的className为"cell"
					div.className="cell";
				}
			}
			//将游戏的分数显示在界面上
			//找到id为score的span，直接设置其内容为游戏对象的scroe
			document.getElementById("score").innerHTML=this.score;
			//显示最高分
			document.getElementById("top").innerHTML=this.top1;
			//根据游戏状态，修改页面
			//找到id为gameOver的div，
			var div=document.getElementById("gameover");
			if (this.state==this.RUNNING)
			{
				div.style.display="none";
				//隐藏div
			}else{
				div.style.display="block";
				document.getElementById("final").innerHTML=this.score;
				//显示div
				//找到id为final的span，直接设置内容为score
			}

		}
	},
	isGameOver:function(){
		//判断当前游戏是否结束
		//如果当前元素是0，返回false
		//否则，如果c<CN-1,且当前值等于右侧值
		//    返回false
		//否则，如果r<RN-1,且当前值等于下方值
		//    返回false
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