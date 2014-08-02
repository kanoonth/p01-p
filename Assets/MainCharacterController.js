#pragma strict

var spaceButton : KeyCode;
var leftButton : KeyCode;
var rightButton : KeyCode;
var isHeadRight : boolean = false;
var JUMP_SPEED : float = 5.0f;
var isJumpping : boolean = false;
var LeftScreenPosition : float;
var RightScreenPosition : float;
var bulletPrefab : GameObject;
var fireButton : KeyCode;
var shootable : boolean = true;
var ammo : int = 0;

function Start() {
	//Random Head direction. 
	ammo = 3;
	LeftScreenPosition = GetLeftScreenPosition();
	RightScreenPosition = GetRightScreenPosition();
}

function Update () {
	if(networkView.isMine){
		Move();
		UseWeapon();
	}
}

//TODO: 
function GetLeftScreenPosition() {
	return -5;
}

//TODO: 
function GetRightScreenPosition() {
	return 5;
}

function Move () {
		
	if ( Input.GetKey( leftButton ) ) { 
		rigidbody2D.velocity.x = -5;
		isHeadRight = false;
	}
		
	if ( Input.GetKey( rightButton ) ) {
		rigidbody2D.velocity.x = 5;
		isHeadRight = true;
	}
	
	if ( Input.GetKey( spaceButton ) && !isJumpping) {
		rigidbody2D.velocity.y = JUMP_SPEED;
		isJumpping = true;	
	}

}

function UseWeapon(){
	if ( Input.GetKey( fireButton ) && shootable && ammo > 0) {
		ammo -= 1;
		shootable = false;
		var bullet : GameObject;
		
		var boxCollider2D = this.GetComponent(BoxCollider2D);
		
		if ( isHeadRight ) {
			bullet = Network.Instantiate (bulletPrefab, Vector3(transform.position.x + boxCollider2D.size.x, transform.position.y, transform.position.z), Quaternion.identity,0);
			bullet.rigidbody2D.velocity.x = 5;
		} else {
			bullet = Network.Instantiate (bulletPrefab, Vector3(transform.position.x - boxCollider2D.size.x, transform.position.y, transform.position.z), Quaternion.identity,0);
			bullet.rigidbody2D.velocity.x = -5;
		}
		bullet.rigidbody2D.velocity.y = 3;
		DelayUpdate();
	}
}
//TODO:
function Respawn() {

}

function Die() {
	GameObject.Destroy(this);
}

function OnCollideRightWorldEdge() {
	transform.position.x = LeftScreenPosition;
}

function OnCollideLeftWorldEdge() {
	transform.position.x = RightScreenPosition;
}

function PickAmmo( bullet : GameObject ) {
	ammo += 1;
	try{
		Network.Destroy(bullet);
	} catch(err) {
		Debug.Log(err.ToString());
	}
	//GameObject.Destroy( bullet );
}

function OnCollisionEnter2D( coll: Collision2D ) {
	if ( coll.gameObject.tag == "Bullet" ) {
		PickAmmo( coll.gameObject );
	}
	Debug.Log(coll.gameObject.name);
}

function OnCollisionStay2D(coll: Collision2D) {
	if ( coll.gameObject.tag == "Wall" || coll.gameObject.tag == "Block" ) {
		isJumpping = false;
	}
}

function OnCollisionExit2D( coll: Collision2D ) {
	if ( coll.gameObject.tag == "Wall" || coll.gameObject.tag == "Block" ) {
		isJumpping = true;
	}
}

function OnTriggerEnter2D( coll: Collider2D ) {
	if ( coll.gameObject.name == "LeftWall" ) {
		OnCollideLeftWorldEdge();
	}
		
	if ( coll.gameObject.name == "RightWall" ) {
		OnCollideRightWorldEdge();
	}
}

function DelayUpdate() {
	yield WaitForSeconds(0.4);
	shootable = true;
}