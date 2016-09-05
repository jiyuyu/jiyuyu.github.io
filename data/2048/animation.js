var animation={
	DURATION:200, //总时长
	STEPS:20,//总步数
	interval:0,//每步时间间隔
	CSIZE:100+16,//每移动一格，需要移动的距离
	
	timer:null,//保存当前定时器的序号，专用于停止定时器
	moved:0,//记录本次动画移动的步数

	tasks:[],//记录本次要移动的所有格子

	init:function(){//初始化动画的属性
		this.interval=this.DURATION/this.STEPS;
	},
	//在动画开始前，向数组中加入要移动的格子
	addTask:function(cell,orgR,orgC,tarR,tarC){
		//cell,rStep,cStep
		var rStep=(tarR-orgR)*this.CSIZE/this.STEPS;
		var cStep=(tarC-orgC)*this.CSIZE/this.STEPS;
		this.tasks.push({
			cell:cell,
			rStep:rStep,
			cStep:cStep
		});
	},
	move:function(callback){//遍历cells中每个格子，移动一步
		for(var i=0;i<this.tasks.length;i++){
			var task=this.tasks[i];
			var style=getComputedStyle(task.cell);
			var top=parseFloat(style.top);
			var left=parseFloat(style.left);
			task.cell.style.top=top+task.rStep+"px";
			task.cell.style.left=left+task.cStep+"px";
		}
		this.moved++;
		if(this.moved==this.STEPS){
			for(var i=0;i<this.tasks.length;i++){
				var task=this.tasks[i];
				task.cell.style.left="";
				task.cell.style.top="";
			}
			clearInterval(this.timer);
			this.timer=null;
			this.moved=0;
			this.tasks=[];
			callback();
		}
	},
	start:function(callback){
		this.init();
		this.timer=setInterval(
			this.move.bind(this,callback),this.interval);
	}
}