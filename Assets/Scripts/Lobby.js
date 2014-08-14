#pragma strict

var rooms : HostData[];
var updateRoomListGUI = false;
var typeName = "Mode01";
var gameName = "Untitled";

var consoleText = "";

var width = Screen.width;
var height = Screen.height;

var scrollPosition : Vector2 = Vector2.zero;

var textMesh : TextMesh;
var button : Texture2D;

function Log( text ) {
	 consoleText = text;
}

function Start () {
	MasterServer.ipAddress = "171.6.210.69";
	MasterServer.port = 25054;
	RefreshRoomList();
}

function Update () {

}

function RefreshRoomList() {
	MasterServer.RequestHostList(typeName);
	Log("Acquiring Room List");
}

function OnMasterServerEvent( msEvent : MasterServerEvent ) {
	if (msEvent == MasterServerEvent.HostListReceived) {
		Log("Room List Acquired");
		rooms = MasterServer.PollHostList();
		updateRoomListGUI = true;
	}
}

//////////////////////////////////////////////////////////////

function JoinRoom( hostData : HostData) {
	Network.Connect(hostData);
}

function OnConnectedToServer() {
	Log("Room Joined");
	Application.LoadLevel ("WaitingRoomScene");
	// InitWall();
	// SpawnPlayer();
}

//////////////////////////////////////////////////////////////

function CreateRoom() {
	 var useNat = !Network.HavePublicAddress();
	 Network.InitializeServer(4, 25000, useNat);
	 MasterServer.RegisterHost(typeName, gameName);
	
	Application.LoadLevel ("WaitingRoomScene");
}

function OnServerInitialized() {
	Debug.Log("Room Created");
	//InitWall();
	//SpawnMap ();
	//SpawnPlayer();	
}

////////////////////////// GUI PART //////////////////////////

function OnGUI(){

	// CreateRoom();
	
	if ( GUI.Button( CreateRect( 80, 0, 20, 10 ), "Find Room" ) ) {
		RefreshRoomList();
	}
	
	if ( GUI.Button( CreateRect( 60, 0, 20, 10 ), "Create Room" ) ) {
		CreateRoom();
	}
	
	ShowRoomList();
	
	GUI.Label( CreateRect( 10, 0, 40, 10 ), consoleText );
	
}

/* Percent Width */
function PercentOfWidth(value: long) {
  return value / 100.0 * Screen.width;
}

/* Percent Height */
function PercentOfHeight(value: long) {
  return value / 100.0 * Screen.height;
}

function CreateRect(x : long, y : long, width : long, height : long) {
  return new Rect( PercentOfWidth( x ), PercentOfHeight( y ), PercentOfWidth( width ), PercentOfHeight( height ) );
}

function ShowRoomList() {

	if ( updateRoomListGUI ) {
		
		updateRoomListGUI = false;
		
		if ( rooms.Length == 0 ) {
			
			Log("No Room Available");
		
		} else {
		
			Log( rooms.Length + " Rooms available.");	    
	  	}  
    }
    
    if ( rooms == null ) {
    	return;
    } 
    
    scrollPosition = GUI.BeginScrollView( CreateRect( 10, 20, 80, 80 ), scrollPosition ,CreateRect( 0, 0, 0, rooms.Length * 10 ) );
	for ( var i = 0; i < rooms.Length; i++ ) {
			   
	if ( GUI.Button( CreateRect( 0, i * 10, 80, 10 ), rooms[i].gameName ) ) {
			JoinRoom( rooms[i] );
		}
	}

	GUI.EndScrollView ();
	
}

