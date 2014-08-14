#pragma strict

var mapInt = 0;
var mapString = ["MAP1","MAP2","MAP3"];
var playerNameHeight = 15;
function Start () {

}

function Update () {

}

/* Percent Width */
function PercentOfWidth(value: long) {
  return value / 100.0 * Screen.width;
}

/* Percent Height */
function PercentOfHeight(value: long) {
  return value / 100.0 * Screen.height;
}

function CreateRect(x: long, y: long, width: long, height: long) {
  return new Rect(PercentOfWidth(x), PercentOfHeight(y), PercentOfWidth(width), PercentOfHeight(height));
}

function OnGUI() {
	ChooseMap();
	PlayerName(["A","B","C"]);
	Ready();
	Back();
}

function ChooseMap(){
	mapInt = GUI.Toolbar(CreateRect(0,0,90,15),mapInt,mapString);
}

function PlayerName(array:Array){//get the array of player name and create Label
	for(var i=0;i<array.length;i++){
	GUI.Label (CreateRect(20,i*playerNameHeight+20,50,playerNameHeight), array[i]+"");
	}
}

function Ready(){
	if(GUI.Button(CreateRect(50,80,30,18),"READY")){
		Debug.Log("Send something to network");
	}
}
function Back(){
	
	if(GUI.Button(CreateRect(93,0,7,10),"Back")){
		Debug.Log("Back to Lobby");
	}
}
//var textureToDisplay : Texture2D;
//	
//	function OnGUI () {
//		GUI.Label (Rect (10, 40, textureToDisplay.width, textureToDisplay.height),textureToDisplay);
//	}


