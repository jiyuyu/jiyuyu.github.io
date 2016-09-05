function $(id){return document.getElementById(id);}
var tetris={//代表游戏主程序对象
	CSIZE:26,//用来保存每个格子的宽高
	RN:20,//总行数
	CN:10,//总列数
	OFFSET:15,//保存单元格区域距游戏界面的内边距
	
	shape:null,//保存当前正在下落的主角图形
	nextShape:null,//保存下一个备胎图形

	//动画
	INTERVAL:500,//保存每次下落的速度（时间间隔）
	timer:null,//用来保存正在运行的动画的序号

	wall:null,//用来保存所有停止下落的方块的二维数组
	
	score:0,//保存游戏分数
	lines:0,//保存消除的总行数
	level:1,//保存当前游戏难度
	SCORES:[0,10,50,80,200],//保存消除的行数与分数的对应关系
	
	state:1,//保存游戏的状态
	RUNNING:1,//运行状态
	PAUSE:2,//暂停
	GAMEOVER:0,//游戏结束
	levels:[0,0,0,0,0,0,0],//保存游戏等级
	start:function(){//用来启动游戏
		this.state=this.RUNNING;
		
		this.score=0,
		this.lines=0,
		this.level=1,
		
		this.shape=this.randomShape();//随机生成主角图形对象
		this.nextShape=this.randomShape();//随机生成备胎图形对象
		//初始化方块墙
		this.wall=[];
		
		//向wall中添加RN个行，每行初始化为CN个空元素
		for (var i=0;i<this.RN;i++ )
		{
			this.wall.push(new Array(this.CN));
		}
		//console.log(this.wall);
		var me=this;
		document.onkeydown=function(e){
			e=e||window.event;
			//如果按键号是37.就调用左移
			//如果按键号是39，就右移
			//如果案件号是40，就下落一次
			switch (e.keyCode)
			{
				case 37:me.state==me.RUNNING&&me.moveLeft();break;
				case 39:me.state==me.RUNNING&&me.moveRight();break;
				case 40:me.state==me.RUNNING&&me.moveDown();break;
				case 38:me.state==me.RUNNING&&me.rotateR();break;
				case 90:me.state==me.RUNNING&&me.rotateL();break;
				case 83:me.state==me.GAMEOVER&&me.start();break;
				case 67:me.state==me.PAUSE&&me.myContinue();break;
				case 80:me.state==me.RUNNING&&me.pause();break;
				case 81:me.gemeOver();break;
				case 32:me.state==me.RUNNING&&me.fastDown();break;
			}
		};
		
		this.timer=setInterval(this.moveDown.bind(this),this.INTERVAL);//启动游戏下落动画
		this.paint();//重绘一切
		console.log(this.INTERVAL);
		
	},
	fastDown:function(){
		if (this.state==this.RUNNING)
		{
			while(this.canDown())
			{
				this.shape.moveDown();
			}
			this.deleteRowsAndGameover();
			
		}
		this.paint();
	},
	gemeOver:function(){
		this.state=this.GAMEOVER;
		//停止计时器
		clearInterval(this.timer);
		//清空timer
		this.timer=null;
		this.paint();
	},
	myContinue:function(){//从暂停状态恢复运行状态
		this.state=this.RUNNING;
	},
	pause:function(){//暂停游戏
		this.state=this.PAUSE;
		this.paint();
	},
	rotateR:function(){//让主角图形顺时针旋转
		this.shape.rotateR();
		if (!this.canRotate())
		{
			this.shape.rotateL()
		}
		//如果不能旋转，
			//让shape逆时针转回来
	},
	canRotate:function(){
		//遍历主角图形中每个cell
			//将当前cell保存在变量cell中
			//如果cell的r<0或者cell的r>=RN或者cell的c<0或者cell的c>CN
				//返回false
			//否则，如果在wall中和cell相同位置，有格
			//返回false
		//遍历结束
		//返回true
		for (var i=0;i<this.shape.cells.length;i++)
		{
			var cell=this.shape.cells[i];
			if (cell.r<0||cell.r>=this.RN||cell.c<0||cell.c>this.CN)
			{
				return false;
			}else if(cell.r<this.RN&&this.wall[cell.r][cell.c]){
				return false;
			}
		}
		return true;
	},
	
	rotateL:function(){//让主角图形逆时针旋转
		this.shape.rotateL();
		if (!this.canRotate())
		{
			this.shape.rotateR();
		}
		//如果不能旋转，
			//让shape顺时针转回来
	},
	canLeft:function(){
		//遍历shape中每个cell
			//现将当前格保存在变量cell中
			//如果cell的c等于0  或  在cell左侧已经有格
				//返回false
		//遍历结束
		for (var i=0;i<this.shape.cells.length;i++)
		{
			var cell=this.shape.cells[i];
			if (cell.c==0||(this.wall[cell.r][cell.c-1]))
			{
				return false;
			}
		}
		return true;
	},
	moveLeft:function(){
		if (this.canLeft())
		{
			this.shape.moveLeft();
		}
	},
	canRight:function(){
		//遍历shape中每个cell
			//现将当前格保存在变量cell中
			//如果cell的c等于0  或  在cell左侧已经有格
				//返回false
		//遍历结束
		for (var i=0;i<this.shape.cells.length;i++)
		{
			var cell=this.shape.cells[i];
			if (cell.c==this.CN-1||(this.wall[cell.r][cell.c+1]))
			{
				return false;
			}
		}
		return true;
	},
	moveRight:function(){
		if (this.canRight())
		{
			this.shape.moveRight();
		}
	},
	randomShape:function(){//在7种图形中随机生成新图形
		//在0-6之间生成随机整数r
		//如果r=0,返回一个新的O图形对象
		//如果r=1,返回一个新的I图形对象
		//如果r=2,返回一个新的T图形对象
		var r=parseInt(Math.random()*7);
		switch (r)
		{
			case 0:return new O();break;
			case 1:return new I();break;
			case 2:return new T();break;
			case 3:return new S();break;
			case 4:return new Z();break;
			case 5:return new L();break;
			case 6:return new J();
		
		}
	},
	lanIntoWall:function(){//将停止下落的方块保存到wall中相同位置
		//遍历主角图形中每个cell
			//将当前格，保存在变量cell中
			//将cell保存在wall中和cell相同r,c位置
		for (var i=0;i<this.shape.cells.length;i++)
		{
			var cell=this.shape.cells[i];
			this.wall[cell.r][cell.c]=cell;
		}
	},
	deleteRowsAndGameover:function(){
		this.lanIntoWall();//先将shape的格，搬到wall中
		//将nextShape的图形给shape
		//为nextShape生成新图形
		this.deleteRows();//判断并消除行
		if (!this.isGameOver())
		{
			this.shape=this.nextShape;
			this.nextShape=this.randomShape();
		}else{this.gemeOver()};
	},
	moveDown:function(){//将主角图形下落一步，然后重绘一切
		//如果canDown
			//将主角图形下落一次
			//重绘一切
		if (this.state==this.RUNNING)
		{
			if (this.canDown())
			{
				this.shape.moveDown();
			}else{//否则，停止下落后
				this.deleteRowsAndGameover();
				
			}
		}
		this.paint();
	},
	paintState:function(){//根据游戏状态，添加对应图片
		//如果游戏状态不是RUNNING
			//新建一个image对象，
			//如果游戏状态为PAUSE，设置img的src为pause.png
			//  否则设置为game-over.png
		
		if (this.state!=this.RUNNING)
		{
			var img=new Image();
			img.src=this.state==this.PAUSE?"img/pause.png":"img/game-over.png";
			$("pg").appendChild(img);
		}
		
	},
	isGameOver:function(){//检查游戏是否结束
		//遍历备胎图形的每个cell对象
			//将当前cell保存在变量cell中
			//如果wall中存在和cell相同位置的格
				//返回true
		//返回false
		for (var i=0;i<this.nextShape.cells.length;i++)
		{
			var cell=this.nextShape.cells[i];
			if (this.wall[cell.r][cell.c])
			{
				return true;
			}
		}
		return false;
	},
	canLevel:function(){
			this.level++;
			clearInterval(this.timer);
			this.timer=null;
			this.INTERVAL-=60;
			this.timer=setInterval(this.moveDown.bind(this),this.INTERVAL);
	},
	deleteRows:function(){//删除所有满行
		//自底向上遍历wall中每一行，同时声明变量ls=0
			//用isFullRow检查当前行，如果当前行是满行
				//用deteRow删除当前行
				//将ls+1
				//r++  r留在原地
				//如果ls=4的时候，则退出循环
		//遍历结束，返回ls
		for (var r=this.RN-1,ls=0;r>=0;r--)
		{
			if (this.isFullRow(r))
			{
				this.deleteRow(r);
				ls++;
				r++;
				if(ls==4){break;}
			}
		}
		this.lines+=ls;
	    this.score+=this.SCORES[ls];
		/*var i=-1;
		if (this.score>=this.score+100&&this.score<this.max)
		{
				i++;
				for (;i<this.levels.length;i++)
				{
					this.min+=100;
					this.max+=100
					if (this.level[i]==0)
					{
						this.levels[i]=1;
						this.canLevel();
					}
				}
				
		}*/
		
		if (this.levels[0]==0&&this.score>=100&&this.score<200)
		{
					this.levels[0]=1;
					this.canLevel();
				}else if (this.levels[1]==0&&this.score>=200&&this.score<300)
				{
					this.levels[1]=1;
					this.canLevel();
				
				}else if (this.levels[2]==0&&this.score>=300&&this.score<400)
				{
					this.levels[2]=1;
					this.canLevel();
				}else if (this.levels[3]==0&&this.score>=400&&this.score<600)
				{
					this.levels[3]=1;
					this.canLevel();
				}else if (this.levels[4]==0&&this.score>=600&&this.score<1000)
				{
					this.levels[4]=1;
					this.canLevel();
				}else if (this.levels[5]==0&&this.score>=1000)
				{
					this.levels[5]=1;
					this.canLevel();
				}
				console.log(this.INTERVAL);
				
	},
	isFullRow:function(r){//检查当前行是否是满格行
		//如果将wall中r行转为字符串之后  string(),其中能够找到开头的逗号，或连续两个逗号，或者结尾的逗号，就返回false，找不到返回true
		return String(this.wall[r]).search(/^,|,,|,$/)==-1?true:false;
	},
	deleteRow:function(delr){//删除指定行
		//从r行向上遍历wall中的剩余行
			//将r-1赋值给r行
			//遍历r行中的每个cell
				//如果当前cell有效，就将当前cell的r+1
			//遍历完r行的所有cell后
			//将r-1初始化为CN个空元素的数组
			//如果r-2行是空，则退出循环
		for (var r=delr;r>0;r--)
		{
			this.wall[r]=this.wall[r-1];
			for (var c=0;c<this.CN;c++)
			{
				if (this.wall[r][c])
				{
					this.wall[r][c].r++;
				}
			}
			this.wall[r-1]=new Array(this.CN);
			if (this.wall[r-2].join("")=="")
			{
				break;
			}
		}
	},
	canDown:function(){//判断主角图形是否可以继续下落
		//遍历主角图形中每个cell
		//	将当前格保存在变量cell中，
		//	如果cell的r==RN-1
		//		返回false
		//遍历结束  返回true
		for (var i=0;i<this.shape.cells.length;i++)
		{
			var cell=this.shape.cells[i];
			if (cell.r==this.RN-1||(this.wall[cell.r+1][cell.c]))//如果cell到底或者在cell的正下方wall中有相同位置有格
			{
				return false;
			}
		}
		return true;
	},
	paintNext:function(){
		//遍历nextShape中的每个cell
			//将当前cell保存在变量中
			//创建一个Image对象img
			//设置img的src为cell的src
			//设置img的top为(r+1)*CSIZE+OFFSET
			//设置img的left为(r+10)*CSIZE+OFFSET
			//将img追加到frag中
		//遍历结束
		//将frag追加到id为pg的元素下
		var frag=document.createDocumentFragment();
		for (var i=0;i<this.nextShape.cells.length;i++)
		{
			var cell=this.nextShape.cells[i];
			var img=new Image();
			img.src=cell.src;
			img.style.top=this.OFFSET+this.CSIZE*(cell.r+1)+"px";
			//console.log(img.top);
			img.style.left=this.OFFSET+this.CSIZE*(cell.c+10)+"px";
			frag.appendChild(img);
		}
		$("pg").appendChild(frag);
	},
	paintWall:function(){//绘制墙中的所有格子
		//从RN-1开始，向上遍历wall中每个cell  
			//将当前格临时保存在变量cell中
			//如果cell有效
				//创建一个Image对象img
				//设置img的src为cell的src
				//设置img的top为r*CSIZE+OFFSET
				//设置img的left为c*CSIZE+OFFSET
				//将img追加到frag中
		//遍历结束，将frag追加到id为pg的元素下
		
		var frag=document.createDocumentFragment();
		for (var r=this.RN-1;r>=0;r--)
		{
			if (this.wall[r].join(""))
			{
				for (var c=0;c<this.CN;c++)
				{
					var cell=this.wall[r][c];
					if (cell)
					{
						var img=new Image();
						img.src=cell.src;
						img.style.top=this.OFFSET+this.CSIZE*cell.r+"px";
						//console.log(img.top);
						img.style.left=this.OFFSET+this.CSIZE*cell.c+"px";
						frag.appendChild(img);
						//console.log(frag);
					}
				}
			}else{
				break;
			}
		}
		$("pg").appendChild(frag);
	},
	paint:function(){
		//删除所有旧的img元素，/<img(.*?)>/g
		$("pg").innerHTML=$("pg").innerHTML.replace(/<img(.*?)>/g,"");
		//重绘主角图形
		this.paintShape();
		this.paintWall();
		this.paintNext();
		this.paintScore();
		this.paintState();
	},
	paintScore:function(){//重绘分数
		//设置id为score的元素内容为score属性
		$("score").innerHTML=this.score;
		$("lines").innerHTML=this.lines;
		$("level").innerHTML=this.level;
	},
	paintShape:function(){//绘制主角图形
		var frag=document.createDocumentFragment();
		for (var i=0;i<this.shape.cells.length;i++)
		{
			var cell=this.shape.cells[i];
			//console.log(cell);
			var img=new Image();
			img.src=cell.src;
			img.style.top=this.OFFSET+this.CSIZE*cell.r+"px";
			//console.log(img.top);
			img.style.left=this.OFFSET+this.CSIZE*cell.c+"px";
			frag.appendChild(img);
			//console.log("frag");

		}
		//console.log($("pg"));
		$("pg").appendChild(frag);
		//创建文档片段frag
		//遍历主角图形的cells数组中的每个cell对象
			//将当前格子对象，临时保存在变量cell中
			//创建Image元素，img   =   new Image ,保存在变量img中
			//设置img的src,为cell的src;
			//设置img的top,为;px
			//设置img的left ;px
			//将img追加到frag中
		//遍历结束
		//将frag追加到id为pg的元素下
	},
}
window.onload=function(){tetris.start();}