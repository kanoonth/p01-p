#pragma strict
var width = Screen.width;
var height = Screen.height;

var NumberOfRoom = 0;//Can change to array.length;

var scrollPosition : Vector2 = Vector2.zero;

// button and put it to textmesh
var textMesh:TextMesh;
var button:Texture2D;
//var ListOfRoom : HostData[] = [];

function Start () {
//	ListOfRoom = []
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


function OnGUI(){
	CreateRoom();
	SetOfRoom();
}

function CreateRoom(){
	if(GUI.Button(new Rect(0,0,Screen.width/5,Screen.height/5),"Create Room")){
		NumberOfRoom++;
	}
}

function SetOfRoom(){
	//number of room is array.length
	scrollPosition = GUI.BeginScrollView (CreateRect(15,15,70,80),
    scrollPosition ,CreateRect(0, 0, 0,NumberOfRoom*10));
 
    // Make four buttons - one in each corner. The coordinate system is defined
    // by the last parameter to BeginScrollView.
    for(var i=1;i<=NumberOfRoom;i++){
    	// name is the name of player
    	GUI.Button (CreateRect(0,(i-1)*10,100,10), "Name = "+i);
    }
    // End the scroll view that we began above.
    
    //   scrollPosition.y = Mathf.Infinity;
    GUI.EndScrollView ();
}