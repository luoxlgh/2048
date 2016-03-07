var board=new Array();//存放4x4格子中每个格子的值 是个4x4二维矩阵
var score=0;
var conflicted=new Array();//判断是否已经是加过的数据

var startx=0;
var starty=0;
var endx=0;
var endy=0;

$(function(){
	newgame();
});

function newgame(){
	//设备尺寸
	prepareForMobile();
	//将二维数组初始化为0，并初始化cell显示格局
	initBoard();
	//生成两个随机格子里的随机数
	  generateOneNum();
	  generateOneNum();
}

function prepareForMobile(){
	if(documentWidth>435){
		containerWidth=435;
		cellSideLength=90;
		cellGap=15;
	}

	$("#container").css("width",containerWidth-2*cellGap);
	$("#container").css("height",containerWidth-2*cellGap);
	$("#container").css("padding",cellGap);
	$("#container").css("border-radius",0.02*containerWidth);

	$(".gridCell").css("width",cellSideLength);
	$(".gridCell").css("height",cellSideLength);
	$(".gridCell").css("border-radius",0.02*cellSideLength);

	//$("#footer").append("  documentWidth:"+documentWidth);
}

function initBoard(){
	for (var i = 0; i < 4; i++) {
		board[i]=new Array();
		for (var j = 0; j < 4; j++) {
			board[i][j]=0;
			var curcell=$("#cell-"+i+"-"+j);
			
			curcell.css("top",getPosTop(i));
			curcell.css("left",getPosLeft(j));
		};
	};
	updateBoardView();

	score=0;
}

function updateBoardView(){
	$(".numCell").remove();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$("#container").append("<div class='numCell' id='numCell-"+i+"-"+j+"'></div>");
			var curNumCell=$("#numCell-"+i+"-"+j);

			if(board[i][j]==0){
				curNumCell.css("width","0px");
				curNumCell.css("height","0px");
				// curNumCell.css("top",getPosTop(i)+45);
				// curNumCell.css("left",getPosLeft(j)+45);
				curNumCell.css("top",getPosTop(i)+(cellSideLength/2));
				curNumCell.css("left",getPosLeft(j)+(cellSideLength/2));
			}
			else{
				curNumCell.css("width",cellSideLength);
				curNumCell.css("height",cellSideLength);
				curNumCell.css("top",getPosTop(i));
				curNumCell.css("left",getPosLeft(j));
				//curNumCell.attr("class","numCell");
				curNumCell.css("background-color",getBackGroundColor(board[i][j]));
				curNumCell.css("color",getColor(board[i][j]));
				curNumCell.html(board[i][j]);
			}
		};
	};

	$(".numCell").css("line-height",cellSideLength+"px");
	$(".numCell").css("font-size",0.6*cellSideLength);
	$(".numCell").css("border-radius",0.02*cellSideLength);
}

function generateOneNum(){
	if(!noSpace(board)){
		var x=parseInt(Math.floor(Math.random()*4));
		var y=parseInt(Math.floor(Math.random()*4));
		//times记录随机生成的次数，如果生成了50次仍然没找到空位则指定位置
		var times=0;
		while(board[x][y]!=0&&times<50){
			x=parseInt(Math.floor(Math.random()*4));
			y=parseInt(Math.floor(Math.random()*4));
			++times;
		}
		if(board[x][y]!=0){
			for (var i = 0; i < 4; i++) 
				for (var j = 0; j < 4; j++) 
					if(board[i][j]==0){
						x=i;
						y=j;
					}
		}

		var num=Math.random()>0.4?2:4;
		board[x][y]=num;
		showNumWithAnimation(x,y,num);
		//$("#test").html(x+" "+y+" "+num);
		return true;
	}

	else {return false;} 
}

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37://left
			//$("#test").html("can move");
			if(moveLeft()){
				generateOneNum();
				if(isGameOver()) setTimeout("gameOver()",600);//否则还没显示出来就提示gameOver了
			}
			break;
		case 38://up
			if(moveUp()){
				generateOneNum();
				if(isGameOver()) setTimeout("gameOver()",600);
			}
			break;
		case 39://right
			if(moveRight()){
				generateOneNum();
				if(isGameOver()) setTimeout("gameOver()",600);
			}
			break;
		case 40://down
			if(moveDown()){
				generateOneNum();
				if(isGameOver()) setTimeout("gameOver()",600);
			}
			break;
		default:break;
	}
});

function moveLeft(){
	if(canMoveLeft(board)){
		//$("#test").html("can moveLeft");
		for (var i = 0; i < 4; i++) {
			var pre=-1;//pre记录这一行的当前元素的上一个有数元素下标
			if(board[i][0]!=0) pre=0;//表示这一行的上一个有数的元素下标是0
			initConflicted(conflicted);
			for (var j = 1; j < 4; j++) {
				if(board[i][j]!=0){
					if(pre==-1){
						showMoveAnimation(i,j,i,0);
						board[i][0]=board[i][j];
						board[i][j]=0;
						//showBoard(board);
						pre=0;
					}
					else {
						if(board[i][pre]==board[i][j]&&conflicted[pre]==0){//和前一个不为空的元素相等，则叠加
							showMoveAnimation(i,j,i,pre);
							board[i][pre]+=board[i][j];
							board[i][j]=0;
							score+=board[i][pre];
							conflicted[pre]=1;
							updateScore(score);
							//showBoard(board);
						}
						else if((++pre)<j){//和前一个不为空的元素不等，则作为pre的下一个元素，并将pre加一
							showMoveAnimation(i,j,i,pre);
							board[i][pre]=board[i][j];
							board[i][j]=0;
							//showBoard(board);
						}
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);//否则for循环执行太快，动画没来得及显示，就执行update了
		return true;
	}
	else { return false;}
}

function moveUp(){
	if(canMoveUp(board)){
		//$("#test").html("can moveUp");
		for (var j = 0; j< 4; j++) {
			var pre=-1;//pre记录这一列的当前元素的方向上的上一个有数元素下标
			if(board[0][j]!=0) pre=0;//表示这一列的上一个有数的元素下标是0
			initConflicted(conflicted);
			for (var i = 1; i < 4; i++) {
				if(board[i][j]!=0){
					if(pre==-1){
						showMoveAnimation(i,j,0,j);
						board[0][j]=board[i][j];
						board[i][j]=0;
						//showBoard(board);
						pre=0;
					}
					else {
						if(board[pre][j]==board[i][j]&&conflicted[pre]==0){//和前一个不为空的元素相等，则叠加
							showMoveAnimation(i,j,pre,j);
							board[pre][j]+=board[i][j];
							board[i][j]=0;
							score+=board[pre][j];
							conflicted[pre]=1;
							updateScore(score);
							//showBoard(board);
						}
						else if((++pre)<i){//和前一个不为空的元素不等，则作为pre的下一个元素，并将pre加一
							showMoveAnimation(i,j,pre,j);
							board[pre][j]=board[i][j];
							board[i][j]=0;
							//showBoard(board);
						}
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);//否则for循环执行太快，动画没来得及显示，就执行update了
		return true;
	}
	else { return false;}
}

function moveRight(){
	if(canMoveRight(board)){
		//$("#test").html("can moveRight");
		for (var i = 0; i < 4; i++) {
			var pre=-1;//pre记录这一行的当前元素的上一个有数元素下标
			if(board[i][3]!=0) pre=3;//表示这一行的上一个有数的元素下标是0
			initConflicted(conflicted);
			for (var j = 2; j >=0; j--) {
				if(board[i][j]!=0){
					if(pre==-1){
						showMoveAnimation(i,j,i,3);
						board[i][3]=board[i][j];
						board[i][j]=0;
						//showBoard(board);
						pre=3;
					}
					else {
						if(board[i][pre]==board[i][j]&&conflicted[pre]==0){//和前一个不为空的元素相等，则叠加
							showMoveAnimation(i,j,i,pre);
							board[i][pre]+=board[i][j];
							board[i][j]=0;
							score+=board[i][pre];
							conflicted[pre]=1;
							updateScore(score);
							//showBoard(board);
						}
						else if((--pre)>j){//和前一个不为空的元素不等，则作为pre的下一个元素，并将pre减一
							showMoveAnimation(i,j,i,pre);
							board[i][pre]=board[i][j];
							board[i][j]=0;
							//showBoard(board);
						}
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);//否则for循环执行太快，动画没来得及显示，就执行update了
		return true;
	}
	else { return false;}
}

function moveDown(){
	if(canMoveDown(board)){
		//$("#test").html("can moveDown");
		for (var j = 0; j < 4; j++) {
			var pre=-1;//pre记录这一行的当前元素的上一个有数元素下标
			if(board[3][j]!=0) pre=3;//表示这一行的上一个有数的元素下标是0
			initConflicted(conflicted);
			for (var i = 2; i >=0; i--) {
				if(board[i][j]!=0){
					if(pre==-1){
						showMoveAnimation(i,j,3,j);
						board[3][j]=board[i][j];
						board[i][j]=0;
						//showBoard(board);
						pre=3;
					}
					else {
						if(board[pre][j]==board[i][j]&&conflicted[pre]==0){//和前一个不为空的元素相等，则叠加
							showMoveAnimation(i,j,pre,j);
							board[pre][j]+=board[i][j];
							board[i][j]=0;
							score+=board[pre][j];
							conflicted[pre]=1;
							updateScore(score);
							//showBoard(board);
						}
						else if((--pre)>i){//和前一个不为空的元素不等，则作为pre的下一个元素，并将pre加一
							showMoveAnimation(i,j,pre,j);
							board[pre][j]=board[i][j];
							board[i][j]=0;
							//showBoard(board);
						}
					}
				}
			}
		}
		setTimeout("updateBoardView()",200);//否则for循环执行太快，动画没来得及显示，就执行update了
		return true;
	}
	else { return false;}
}

function isGameOver(){
	if(noSpace(board)){
		if(canMoveDown(board)||canMoveRight(board)||canMoveUp(board)||canMoveLeft(board))
			return false;
		else return true;
	}
	else return false;
}

document.addEventListener("touchstart",function(event){
	startx=event.touches[0].pageX;
	starty=event.touches[0].pageY;
});

document.addEventListener("touchend",function(event){
	endx=event.changedTouches[0].pageX;
	endy=event.changedTouches[0].pageY;

	var deltax=endx-startx;
	var deltay=endy-starty;
	//$("#footer").html(" endx:"+endx+" endy:"+endy+" startx:"+startx+" starty:"+starty);
	//当滑动幅度到达一定值时才认为是在滑动
	if(Math.abs(deltax)<0.3*documentWidth&&Math.abs(deltay)<0.3*documentWidth){
		//$("#footer").append("小");
		return;
	}
	
	//x
	if(Math.abs(deltax)>=Math.abs(deltay)){
		if(deltax>0){//right
			//$("#footer").append(" right");
			if(moveRight()){
				generateOneNum();
				if(isGameOver()) setTimeout("gameOver()",600);
			}
		}

		else {//move left
			//$("#footer").append(" left");
			if(moveLeft()){
				generateOneNum();
				if(isGameOver()) setTimeout("gameOver()",600);//否则还没显示出来就提示gameOver了
			}
		}	
	}
	//y
	else {
		//$("#footer").append(" down");
		if(deltay>0) {//down
			if(moveDown()){
				generateOneNum();
				if(isGameOver()) setTimeout("gameOver()",600);
			}
		}
		else {//up
			//$("#footer").append(" up");
			if(moveUp()){
				generateOneNum();
				if(isGameOver()) setTimeout("gameOver()",600);
			}
		}
	}
});

function gameOver(){
	alert("Game Over !");
}

function updateScore(score){
	$("#score").html(score);
}

function initConflicted(conflicted){
	for(var i=0;i<4;++i)
		conflicted[i]=0;
}

//用于测试查看borad内容是否有问题
// function showBoard(board){
// 	//$("#test").html(" ");
// 	for (var i = 0; i < 4; i++) 
// 		for (var j = 0; j < 4; j++)
// 			//$("#test").append(board[i][j]+" ");
// }