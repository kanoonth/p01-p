#pragma strict

var spaceButton : KeyCode;
//var leftButton : KeyCode;
//var rightButton : KeyCode;
var isHeadRight : boolean = false;
var JUMP_SPEED : float = 5.0f;
var isJumpping : boolean = false;
var LeftScreenPosition : float;
var RightScreenPosition : float;
var bulletPrefab : GameObject;
var fireButton : KeyCode;
var shootable : boolean = true;
var ammo : int = 0;
var speed : float = 4f;
var anim : Animator;
var jumpTime : float = 0;
var jumpDelay : float = 4f;
var jumped : boolean;
var jumpCheckBottom : Transform;
var jumpCheckRight : Transform;
var jumpCheckLeft : Transform;

function Start() {
	//Random Head direction. 
	ammo = 3;
	LeftScreenPosition = GetLeftScreenPosition();
	RightScreenPosition = GetRightScreenPosition();
	anim = this.GetComponent( Animator );
}

function Update () {
	if(networkView.isMine){
		Move();
		UseWeapon();
	}
	
	checkGround();
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

	anim.SetFloat( "speed", Mathf.Abs( Input.GetAxisRaw( "Horizontal" ) ) );
	
	if(Input.GetAxisRaw("Horizontal") > 0)
		{
			transform.Translate(Vector3.right * speed * Time.deltaTime); 
			transform.eulerAngles = new Vector2(0, 0); //this sets the rotation of the gameobject
			isHeadRight = true;
		}
		
	if(Input.GetAxisRaw("Horizontal") < 0)
		{
			transform.Translate(Vector3.right * speed * Time.deltaTime);
			transform.eulerAngles = new Vector2(0, 180); //this sets the rotation of the gameobject
			isHeadRight = false;
		}
		/*
	if ( Input.GetKey( leftButton ) ) { 
		rigidbody2D.velocity.x = -5;
		isHeadRight = false;
	}
		
	if ( Input.GetKey( rightButton ) ) {
		rigidbody2D.velocity.x = 5;
		isHeadRight = true;
	}
	*/
	if ( Input.GetKey( spaceButton ) && isJumpping) {
		anim.SetTrigger( "Jump" );
		rigidbody2D.velocity.y = JUMP_SPEED;
		isJumpping = true;	
		jumpTime = jumpDelay;
		jumped = true;
	}
	
	jumpTime -= Time.deltaTime;
	if ( jumpTime <= 0 || isJumpping ) {
		anim.SetTrigger( "Land" );
		jumped = false;
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
}

function checkGround() {
	var onRightWall : boolean = isCollidedToWall( jumpCheckRight.position, "Block" );
	var onLeftWall : boolean = isCollidedToWall( jumpCheckLeft.position, "Block" );
	var onGround : boolean = isCollidedToWall( jumpCheckBottom.position, "Block" );
	var onEnemy : boolean = isCollidedToWall( jumpCheckBottom.position, "Enemy" );
	
	if( onGround || onEnemy){
		isJumpping = ( onGround || onEnemy );
		return;
	}
	
	if( onRightWall ) {
		isJumpping = onRightWall;
		return;
	}
	else if( onLeftWall ) {
		isJumpping = onLeftWall;
		return;
	}
	
	isJumpping = false;
}

function isCollidedToWall( position : Vector2 , layer : String ) {
	return Physics2D.Linecast(transform.position, position, 1 << LayerMask.NameToLayer( layer ) , 0, 0);
}

/*
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
*/

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