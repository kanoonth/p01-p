#pragma strict

// TODO: when hit Obstacle, bullet stick on it. 


var LeftScreenPosition : float;
var RightScreenPosition : float;

function Start () {
	LeftScreenPosition = GetLeftScreenPosition();
	RightScreenPosition = GetRightScreenPosition();
}

function Update () {
	
}

// TODO: 
function GetLeftScreenPosition() {
	return -5;
}

// TODO: 
function GetRightScreenPosition() {
	return 5;
}

function OnCollideRightWorldEdge() {
	transform.position.x = LeftScreenPosition;
}

function OnCollideLeftWorldEdge() {
	transform.position.x = RightScreenPosition;
}

function OnTriggerEnter2D( coll: Collider2D ) {
	if ( coll.gameObject.name == "LeftWall" ) {
		OnCollideLeftWorldEdge();
	}
		
	if ( coll.gameObject.name == "RightWall" ) {
		OnCollideRightWorldEdge();
	}
}

