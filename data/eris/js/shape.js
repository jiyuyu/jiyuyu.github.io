//描述所有格子对象的构造函数，反复创建多个相同结构的时候   需要使用构造函数
function Cell(r,c,src){
	this.r=r;//描述格子所在的行下标
	this.c=c;//描述格子所在的列下标
	this.src=src;//格子使用的图片路径
}
//定义描述旋转状态的构造函数
function State(r0,c0,r1,c1,r2,c2,r3,c3){
	this.r0=r0;
	this.c0=c0;
	this.r1=r1;
	this.c1=c1;
	this.r2=r2;
	this.c2=c2;
	this.r3=r3;
	this.c3=c3;
	
}; 
//描述所有图形的公共属性和方法的父对象
function Shape(cells,src,orgi,states){
	this.cells=cells;//初始化格子数组
	this.orgi=orgi;
	this.states=states;//初始化图形对象的旋转状态
	this.statei=0;//
	//遍历cells中每个格子
	//	设置当前格子的src=src
	for (var i=0;i<cells.length;i++)
	{
		this.cells[i].src=src;
	}
}
//在圆形对象中集中定义所有图形的图片路径
Shape.prototype.IMGS={
	T:"img/T.png",
	I:"img/I.png",
	O:"img/O.png",
	J:"img/J.png",
	S:"img/S.png",
	Z:"img/Z.png",
	L:"img/L.png"
};
//在父类型的原型对象中，添加下移，左移，右移的方法
Shape.prototype.moveDown=function(){//this------>shape
	//遍历当前图形中的每个cell
		//将当前cell的r+1
	for (var i=0;i<this.cells.length;i++)
	{
		this.cells[i].r++;
		//console.log(this.cells[i].r);
	}
};
Shape.prototype.moveLeft=function(){//this------>shape
	//遍历当前图形中的每个cell
		//将当前cell的r+1
	for (var i=0;i<this.cells.length;i++)
	{
		this.cells[i].c--;
		//console.log(this.cells[i].r);
	}
};
Shape.prototype.moveRight=function(){//this------>shape
	//遍历当前图形中的每个cell
		//将当前cell的r+1
	for (var i=0;i<this.cells.length;i++)
	{
		this.cells[i].c++;
		//console.log(this.cells[i].r);
	}
};
Shape.prototype.rotateR=function(){//顺时针旋转一次
	//将当前对象的statei+1
	//如果新的statei>=当前图形对象的states的个数，就将statei改为0
	this.statei++;
	(this.statei>=this.states.length)&&(this.statei=0);
	this.rotate();
};
Shape.prototype.rotate=function(){
	//从当前对象的states数组中获得statei位置的状态对象state
	//(1,0,0,0,-1,0,0,1)
	//从当前对象的cells数组中获得orgi位置的参照格对象orgCell
	//遍历当前对象中的每个cell对象
		//将当前格对象的r修改为：orgCell.r+state对象中的["r"+i]
		//将当前格对象的c修改为：orgCell.c+state对象中的["c"+i]
	var state=this.states[this.statei];
	var orgCell=this.cells[this.orgi];
	for (var i=0;i<this.cells.length;i++)
	{
		this.cells[i].r=orgCell.r+state["r"+i];
		this.cells[i].c=orgCell.c+state["c"+i];
	}
};
Shape.prototype.rotateL=function(){//逆时针旋转一次
	//将当前对象的statei-1
	//如果新的statei<0,就将statei改为states元素个数-1
	this.statei--;
	(this.statei<0)&&(this.statei=this.states.length-1);
	this.rotate(this.statei);
};
//创建T类型的构造函数，同时让T类型继承Shape
function T(){
	Shape.apply(this,[
		[//cells参数：保存四个cell对象
			new Cell(0,3),
			new Cell(0,4),
			new Cell(0,5),
			new Cell(1,4)
		],	
		this.IMGS.T,
		1,
		[
			new State(0,-1,0,0,0,1,1,0),
			new State(-1,0,0,0,1,0,0,-1),
			new State(0,1,0,0,0,-1,-1,0),
			new State(1,0,0,0,-1,0,0,1)
		]
	]);
}
//让子类型的原型对象，继承父类型的原型对象
Object.setPrototypeOf(T.prototype,Shape.prototype);

//创建O类型的构造函数，同时让T类型继承Shape
function O(){
	Shape.apply(this,[
		[//cells参数：保存四个cell对象
			new Cell(0,4),
			new Cell(0,5),
			new Cell(1,4),
			new Cell(1,5)
		],	
		this.IMGS.O,
		0,
		[
			new State(0,0,0,1,1,0,1,1)
		]
	]);
}
//让子类型的原型对象，继承父类型的原型对象
Object.setPrototypeOf(O.prototype,Shape.prototype);
//创建I类型的构造函数，同时让T类型继承Shape
function I(){
	Shape.apply(this,[
		[//cells参数：保存四个cell对象
			new Cell(0,3),
			new Cell(0,4),
			new Cell(0,5),
			new Cell(0,6)
		],	
		this.IMGS.I,
		1,
		[
			new State(0,-1,0,0,0,1,0,2),
			new State(-1,0,0,0,1,0,2,0)
		]
	]);
}
//让子类型的原型对象，继承父类型的原型对象
Object.setPrototypeOf(I.prototype,Shape.prototype);
//创建L类型的构造函数，同时让L类型继承Shape
function L(){
	Shape.apply(this,[
		[//cells参数：保存四个cell对象
			new Cell(0,3),
			new Cell(0,4),
			new Cell(0,5),
			new Cell(1,3)
		],	
		this.IMGS.L,
		1,
		[
			new State(0,-1,0,0,0,1,1,-1),
			new State(-1,0,0,0,1,0,-1,-1),
			new State(0,1,0,0,0,-1,-1,1),
			new State(1,0,0,0,-1,0,1,1)
		]
	]);
}
//让子类型的原型对象，继承父类型的原型对象
Object.setPrototypeOf(L.prototype,Shape.prototype);

//创建Z类型的构造函数，同时让Z类型继承Shape
function Z(){
	Shape.apply(this,[
		[//cells参数：保存四个cell对象
			new Cell(0,4),
			new Cell(0,5),
			new Cell(1,5),
			new Cell(1,6),
		],	
		this.IMGS.Z,
		2,
		[
			new State(-1,-1,-1,0,0,0,0,1),
			new State(-1,1,0,1,0,0,1,0)
		]
	]);
}
//让子类型的原型对象，继承父类型的原型对象
Object.setPrototypeOf(Z.prototype,Shape.prototype);

//创建J类型的构造函数，同时让J类型继承Shape
function J(){
	Shape.apply(this,[
		[//cells参数：保存四个cell对象
			new Cell(0,5),
			new Cell(1,5),
			new Cell(2,5),
			new Cell(2,4),
		],	
		this.IMGS.J,
		1,
		[
			new State(-1,0,0,0,1,0,1,-1),
			new State(0,1,0,0,0,-1,-1,-1),
			new State(1,0,0,0,-1,0,-1,1),
			new State(0,-1,0,0,0,1,1,1)
		]
	]);
}
//让子类型的原型对象，继承父类型的原型对象
Object.setPrototypeOf(J.prototype,Shape.prototype);

//创建S类型的构造函数，同时让S类型继承Shape
function S(){
	Shape.apply(this,[
		[//cells参数：保存四个cell对象
			new Cell(0,4),
			new Cell(0,5),
			new Cell(1,3),
			new Cell(1,4),
		],	
		this.IMGS.S,
		3,
		[
			new State(-1,0,-1,1,0,-1,0,0),
			new State(0,1,1,1,-1,0,0,0)
		]
	]);
}
//让子类型的原型对象，继承父类型的原型对象
Object.setPrototypeOf(S.prototype,Shape.prototype);