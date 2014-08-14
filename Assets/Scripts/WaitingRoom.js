#pragma strict

var mapInt = 0;
var mapString = ["MAP1", "MAP2", "MAP3"];
var playerNameHeight = 15;

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
	PlayerName(["A", "B", "C"]);
	GameStart();
	Back();
}

function ChooseMap(){
	mapInt = GUI.Toolbar(CreateRect(0,0,90,15),mapInt,mapString);
}

function PlayerName( array: Array ) {
	for ( var i = 0; i < array.length ; i++ ) {
		GUI.Label( CreateRect( 20, i * playerNameHeight + 20, 50, playerNameHeight ), array[i] + "" );
	}
}

function GameStart() {
	if ( GUI.Button( CreateRect( 50, 80, 30, 18 ), "Start" ) ) {
		StartGamePlay();
	}
}

@RPC function StartGamePlay() {

	Application.LoadLevel ("GamePlay");

        if ( networkView.isMine ) {
        networkView.RPC( "StartGamePlay", RPCMode.OthersBuffered );
    }
}

function Back(){
	
	if( GUI.Button( CreateRect( 93, 0, 7, 10 ), "Back" ) ) {
		Application.LoadLevel ("LobbyScene");
	}
}
