documentWidth=window.screen.availWidth;
containerWidth=0.92*documentWidth;
cellSideLength=0.18*documentWidth;
cellGap=0.04*documentWidth;

function getPosTop(i){
	//return (i+1)*15+i*90;
	return (i+1)*cellGap+i*cellSideLength;
}
function getPosLeft(j){
	//return (j+1)*15+j*90;
	return (j+1)*cellGap+j*cellSideLength;
}

function getBackGroundColor(num){
	switch(num){
		case 2:return "#f2b179";break;
        case 4:return "#f59563";break;
        case 8:return "#f67c5f";break;
        case 16:return "#f65e3b";break;
        case 32:return "#edcf72";break;
        case 64:return "#edcc61";break;
        case 128:return "#9c0";break;
        case 256:return "#33b5e5";break;
        case 512:return "#09c";break;
        case 1024:return "#a6c";break;
        case 2048:return "#93c";break;
        default:return "#93c";break;
	}
}
function getColor(num){
	if(num<=4)
		return "#776e65";
	return "white";
}

function noSpace(board){
	for (var i = 0; i < 4; i++) 
		for (var j = 0; j < 4; j++) 
			if (board[i][j]==0)  return false;

	return true;
}
//是否能够向左滑动
function canMoveLeft(board){
	for (var i = 0; i < 4; i++) 
		for (var j = 1; j < 4; j++) {
			//$("#test").append(board[i][j]+" ");
			if (board[i][j]!=0){
				//$("#test").html(i+" "+j+" "+board[i][j-1]);
				if(board[i][j-1]==0||board[i][j-1]==board[i][j])
					return true;
			}
		}

	return false;
}

function canMoveUp(board){
	for (var j = 0; j < 4; j++) 
		for (var i = 1; i <4; i++) {
			//$("#test").append(board[i][j]+" ");
			if (board[i][j]!=0){
				//$("#test").html(i+" "+j+" "+board[i][j-1]);
				if(board[i-1][j]==0||board[i-1][j]==board[i][j])
					return true;
			}
		}

	return false;
}

function canMoveRight(board){
	for (var i = 0; i < 4; i++) 
		for (var j = 2; j >=0; j--) {
			//$("#test").append(board[i][j]+" ");
			if (board[i][j]!=0){
				//$("#test").html(i+" "+j+" "+board[i][j-1]);
				if(board[i][j+1]==0||board[i][j+1]==board[i][j])
					return true;
			}
		}

	return false;
}

function canMoveDown(board){
	for (var j=0; j < 4; j++) 
		for (var i =2; i >=0; i--) {
			//$("#test").append(board[i][j]+" ");
			if (board[i][j]!=0){
				//$("#test").html(i+" "+j+" "+board[i][j-1]);
				if(board[i+1][j]==0||board[i+1][j]==board[i][j])
					return true;
			}
		}

	return false;
}
