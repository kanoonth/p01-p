#pragma strict

var spaceButton : KeyCode;
var leftButton : KeyCode;
var rightButton : KeyCode;

var JUMP_SPEED : float = 5.0f;

var isJumpping : boolean = false;

var LeftScreenPosition : float;
var RightScreenPosition : float;

function Start() {
	LeftScreenPosition = GetLeftScreenPosition();
	RightScreenPosition = GetRightScreenPosition();
}

function Update () {

	Move();

}

// TODO: 
function GetLeftScreenPosition() {
	return -5;
}

// TODO: 
function GetRightScreenPosition() {
	return 5;
}

function Move () {
		
	if ( Input.GetKey( leftButton ) ) 
		rigidbody2D.velocity.x = -5;
		
	if ( Input.GetKey( rightButton ) ) 
		rigidbody2D.velocity.x = 5;
		
	if ( Input.GetKey( spaceButton ) && !isJumpping ) {
		rigidbody2D.velocity.y = JUMP_SPEED;
		isJumpping = true;	
	}

}

function OnCollideRightWorldEdge() {
	transform.position.x = LeftScreenPosition;
}

function OnCollideLeftWorldEdge() {
	transform.position.x = RightScreenPosition;
}

function OnCollisionEnter2D(coll: Collision2D) {
	if ( coll.gameObject.tag == "Wall" )
		isJumpping = false;
}

function OnCollisionExit2D(coll: Collision2D) {
	if ( coll.gameObject.tag == "Wall" )
		isJumpping = true;
}

function OnTriggerEnter2D(coll: Collider2D) {
	if ( coll.gameObject.name == "LeftWall" )
		OnCollideLeftWorldEdge();
		
	if ( coll.gameObject.name == "RightWall" )
		OnCollideRightWorldEdge();
}