#pragma strict

var networkManager : NetworkManager;
var player : GameObject;
var around : Collider2D[];

var attackRange : float;
var walkSpeed : float;

var spawnPosition : Vector2;
//var limitWalkingRange : float;

var blockSizeHeight : float;
var blockSizeWidth : float;

function Start () {
	var mainCamera : GameObject = GameObject.Find("Main Camera");
	networkManager = mainCamera.GetComponent("NetworkManager");

	this.blockSizeHeight = this.networkManager.getBlockHeight();
	this.blockSizeWidth = this.networkManager.getBlockWidth();
	
	spawnPosition = this.transform.position;
	
	attackRange = this.blockSizeWidth;
	walkSpeed = 1f;
}

function Update () {
	var point = new Vector2( this.transform.position.x , this.transform.position.y );
	
	around = Physics2D.OverlapCircleAll( point , this.attackRange , 1 << LayerMask.NameToLayer("Player") , 0, 0);
	// 1 << LayerMask.NameToLayer("Player") is player's layer for ray casting.
	
	if( around.length > 0 ){ //players in range.
		var closestPlayer : Collider2D = getClosestPlayer( around );
		
		if(closestPlayer != null){
			var playerPosition = closestPlayer.transform.position;
			walkTowardPlayer( playerPosition );
		}
	}
}

function walkTowardPlayer( playerPosition : Vector2 ){
	var pos = this.transform.position;
	if( pos.x < playerPosition.x ){
		walk( walkSpeed );
	}
	else{
		walk( -walkSpeed );
	}
}

function walk( speed : float ){
	this.rigidbody2D.velocity.x = speed;
}

function getClosestPlayer( players : Collider2D[] ){
	var numPlayer : int = players.length;
	var availableTarget = checkPlayerInRange( players );
	
	var closestRange = Number.MaxValue;
	var index = -1;
	
	for(var i = 0 ; i < numPlayer ; i++){
		if( availableTarget[i] ){
			var playerPosition = players[i].transform.position;
			var playerDistance = getDistance( playerPosition );
			
			if( playerDistance < closestRange ){
				closestRange = playerDistance;
				index = i;
			}
		}
	}
	if(index == -1) return null;
	return players[index];
}

function checkPlayerInRange( players : Collider2D[] ){
	var numPlayer : int = players.length;
	var availableTarget : Array = [];
	
	for(var i = 0 ; i < numPlayer ; i++){
		if( players[i] != null ){
		
			var distanceFromPlayer = Mathf.Abs( this.transform.position.y - players[i].transform.position.y );
			var isInRange = distanceFromPlayer >= blockSizeHeight * 1.5 ;
			if( isInRange ){
				availableTarget.push( false );
			}
			else{
				availableTarget.push( true );
			}
		}
	}
	
	return availableTarget;
}

function getDistance( p : Vector2 ){
	var pos = this.transform.position;
	var x = pos.x - p.x;
	var y = pos.y - p.y;
	return Mathf.Sqrt(x*x + y*y);
}


function setAttackRange( newRange : float ){
	this.attackRange = newRange;
}

//function setLimitWalkingRange( newRange : float ){
//	this.limitWalkingRange = newRange;
//}