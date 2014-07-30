#pragma strict

var bulletPrefab : GameObject;

var fireButton : KeyCode;

var shootable : boolean = true;

function Start () {

}

function Update () {
	
	
	if ( Input.GetKey( fireButton ) && shootable ) {
		shootable = false;
		var bullet : GameObject = Instantiate (bulletPrefab, Vector3(transform.position.x, transform.position.y, transform.position.z), Quaternion.identity);
		bullet.rigidbody2D.velocity.x = 5;
		bullet.rigidbody2D.velocity.y = 3;
		DelayUpdate();
	}
		
}

function DelayUpdate() {
	yield WaitForSeconds(0.4);
	shootable = true;
}