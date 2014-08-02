var playerPrefab : GameObject;
var hostList : HostData[] ;
	
var typeName = "UniqueGameName";
var gameName = "RoomName";

function Start () {
	MasterServer.ipAddress = "158.108.224.89";
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
	SpawnPlayer();
	SpawnMap ();
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

}