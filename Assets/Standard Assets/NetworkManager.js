#pragma strict

var playerPrefab : GameObject;
var hostList : HostData[] ;
	
var typeName = "UniqueGameName";
var gameName = "RoomName";

var mainCam : Camera;
var blockPrefab : GameObject;
var enemyPrefab : GameObject;

var topWall : BoxCollider2D;
var bottomWall : BoxCollider2D;
var leftWall : BoxCollider2D;
var rightWall : BoxCollider2D;

var blockSizeHeight : float;
var blockSizeWidth : float;

var map = [
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[1,1,1,0,1,1,1],
		[0,0,0,0,0,0,0],
		[1,1,1,1,1,1,1]
	];
	
var mapPosition : Array = [];

function Start () {
	MasterServer.ipAddress = "158.108.229.217";
}

function Update () {

}

function StartServer() {
	var useNat = !Network.HavePublicAddress();
	Network.InitializeServer(4, 25000, useNat);
	MasterServer.RegisterHost(typeName, gameName);
}

function OnServerInitialized() {
	Debug.Log("Server Initializied");
	InitWall();
	SpawnMap ();
	SpawnPlayer();	
}

function RefreshHostList() {
	MasterServer.RequestHostList(typeName);
}

function OnMasterServerEvent( msEvent : MasterServerEvent) {
	if (msEvent == MasterServerEvent.HostListReceived) {
		hostList = MasterServer.PollHostList ();
	}
}

function JoinServer( hostData : HostData) {
	Network.Connect(hostData);
}

function OnConnectedToServer() {
	Debug.Log("Server Joined");
	InitWall();
	SpawnPlayer();
}

function OnGUI() {
	if (!Network.isClient && !Network.isServer) {
		if (GUI.Button(new Rect(100, 100, 250, 100), "Start Server")) {
			StartServer();
		}
		
		if (GUI.Button(new Rect(100, 250, 250, 100), "Refresh Hosts")) {
			RefreshHostList();
		}
		
		if (hostList != null) {
			for (var i = 0; i < hostList.Length; i++) {
				if (GUI.Button(new Rect(400, 100 + (110 * i), 300, 100), hostList[i].gameName)) {
					JoinServer(hostList[i]);
				}
			}
		}
	}
}

function SpawnPlayer() {
	Network.Instantiate(playerPrefab, new Vector3(0f, 5f, 0f), Quaternion.identity,0);
}

function SpawnMap(){
	InitWall();
	InitBlock();
	SpawnEnemy();
	SpawnEnemy();
	SpawnEnemy();
	SpawnEnemy();
	SpawnEnemy();
	SpawnEnemy();
	SpawnEnemy();
	SpawnEnemy();
}

function getScreenWidth() {
	return Screen.width;
}

function getScreenHeight() {
	return Screen.height;
}

function InitBlock() {
	
	var height = mainCam.ScreenToWorldPoint (new Vector3 ( 0f, Screen.height, 0f)).y * 2;
	var width = mainCam.ScreenToWorldPoint( new Vector3( Screen.width, 0f, 0f )).x  * 2;

	var numBlockX = map.length;
	var numBlockY = map[0].length;
				
	for ( var i = 0f ; i < numBlockX ; i++) {
		for ( var j = 0f ; j < numBlockY ; j++ ) {
			var originX = j * (  (width / numBlockY)) - ( width / numBlockY )*(0.5 * (numBlockY-1));
			var originY = ( numBlockX - i) * (  (height / numBlockX)) - ( height / numBlockX )*(0.5 * (numBlockX+1));
			if ( map[i][j] == 1 ) {	 
				var block : GameObject = Network.Instantiate ( blockPrefab, Vector3( originX, originY, 0 ), Quaternion.identity,0);
				
				block.transform.localScale.x = width / numBlockY;
				block.transform.localScale.y = height / numBlockX;
				
			} else {		
				mapPosition.push( new Array( originX, originY ) );
			}
		}
	}
	
	this.blockSizeHeight = height / numBlockX;
	this.blockSizeWidth = width / numBlockY;
}

function InitWall() {
	topWall.size = new Vector2 (mainCam.ScreenToWorldPoint (new Vector3 (Screen.width * 2f, 0f, 0f)).x, 1f);
	topWall.center = new Vector2 (0f, mainCam.ScreenToWorldPoint (new Vector3 ( 0f, Screen.height, 0f)).y + 0.5f);
	
	bottomWall.size = new Vector2( mainCam.ScreenToWorldPoint( new Vector3( Screen.width * 2f, 0f, 0f ) ).x, 1f );
	bottomWall.center = new Vector2( 0f, mainCam.ScreenToWorldPoint( new Vector3( 0f, 0f, 0f )).y - 0.5f);
	
	leftWall.size = new Vector2( 1f, mainCam.ScreenToWorldPoint(new Vector3( 0f, Screen.height * 2, 0f )).y);
	leftWall.center = new Vector2( mainCam.ScreenToWorldPoint( new Vector3( 0f, 0f, 0f )).x - 0.5f, 0f );
	
	rightWall.size = new Vector2( 1f, mainCam.ScreenToWorldPoint(new Vector3( 0f, Screen.height * 2, 0f )).y);
	rightWall.center = new Vector2( mainCam.ScreenToWorldPoint( new Vector3( Screen.width, 0f, 0f )).x + 0.5f, 0f );
}

function SpawnEnemy() {
	var rand : int =  Random.Range(0, mapPosition.length );
	
	var position : Array = mapPosition[rand];
	
	var originX = position[0];
	var originY = position[1];
	
	var enemy : GameObject = Network.Instantiate ( enemyPrefab, Vector3( originX, originY, 0 ), Quaternion.identity,0);
}

function getBlockHeight(){
	return this.blockSizeHeight;
}

function getBlockWidth(){
	return this.blockSizeWidth;
}

