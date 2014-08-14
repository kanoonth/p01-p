#pragma strict

var roomList : HostData[];

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
	MasterServer.ipAddress = "127.0.0.1";
	// MasterServer.port = 25054;
	RefreshRoomList();
}

function Update () {

}

function RefreshRoomList() {
	MasterServer.RequestHostList(typeName);
}

function OnMasterServerEvent( msEvent : MasterServerEvent ) {
	if (msEvent == MasterServerEvent.HostListReceived) {
		Log("Room list acquired.");
		roomList = MasterServer.PollHostList ();
	}
}

//////////////////////////////////////////////////////////////

function JoinRoom( hostData : HostData) {
	Network.Connect(hostData);
}

function OnConnectedToServer() {
	Log("Room Joined");
	// InitWall();
	// SpawnPlayer();
}

//////////////////////////////////////////////////////////////

function CreateRoom() {
	// var useNat = !Network.HavePublicAddress();
	// Network.InitializeServer(4, 25000, useNat);
	// MasterServer.RegisterHost(typeName, gameName);
	
	// TODO: Go to scene create room.
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
	
	GUI.Label( CreateRect( 10, 0, 40, 10 ), consoleText );
	
	ShowRoomList();
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

	if ( roomList == null ) {
		Log("No server.");
		return;
	}
	
	if ( roomList.Length == 0 ) {
		Log("No room in server.");
		return;
	}
	
	scrollPosition = GUI.BeginScrollView( CreateRect( 15,15,70,80 ), scrollPosition ,CreateRect( 0, 0, 0, roomList.Length * 10 ) );
 	
    for ( var i = 1; i <= roomList.Length; i++ ) {
    	if ( GUI.Button( CreateRect( 0, ( i - 1 ) * 10, 100, 10 ), roomList[i].gameName) ) {
			JoinRoom( roomList[i] );
		}
    }
	
    //   scrollPosition.y = Mathf.Infinity;
    GUI.EndScrollView ();
}

