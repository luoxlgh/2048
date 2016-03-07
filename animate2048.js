function showNumWithAnimation(x,y,num){
	var curcell=$("#numCell-"+x+"-"+y);

	curcell.css("background-color",getBackGroundColor(num));
	curcell.css("color",getColor(num));
	
	curcell.text(num);

	curcell.animate({width:cellSideLength,height:cellSideLength,top:getPosTop( x ),left:getPosLeft( y )},500);
}

function showMoveAnimation(fromI,fromJ,toI,toJ){
	var cell=$("#numCell-"+fromI+"-"+fromJ);
	cell.animate({top:getPosTop(toI),
		left:getPosLeft(toJ)},200);
}