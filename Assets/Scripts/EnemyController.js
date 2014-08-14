#pragma strict

var networkManager : NetworkManager;
var player : GameObject;
var around : Collider2D[];

var attackRange : float;
var rangeFactor : float;
var walkSpeed : float;

var spawnPosition : Vector2;
var limitWalkingRange : float;
var limitWalkingRangeFactor : float;

var blockSizeHeight : float;
var blockSizeWidth : float;

var backToOrigin : boolean;

function Start () {
	var mainCamera : GameObject = GameObject.Find("Main Camera");
	networkManager = mainCamera.GetComponent("NetworkManager");

	this.blockSizeHeight = this.networkManager.getBlockHeight();
	this.blockSizeWidth = this.networkManager.getBlockWidth();
	
	spawnPosition = this.transform.position;
	
	this.rangeFactor = 1f;
	attackRange = this.blockSizeWidth * this.rangeFactor;
	
	this.limitWalkingRangeFactor = 1.5f;
	this.limitWalkingRange = this.blockSizeWidth * this.limitWalkingRangeFactor;
	walkSpeed = 1f;
	
	this.backToOrigin = false;
}

function Update () {
	this.standByForAttackingPlayer();
	
	if( !isInLimitRange() ){
		backToOrigin = true;
	}
	
	if( backToOrigin ){
		var distanceFromOrigin = this.transform.position.x - this.spawnPosition.x;
		if( distanceFromOrigin > 0 ){
			this.walk( -walkSpeed*3 );
		}
		else{
			this.walk( walkSpeed*3 );
		}
	}
	// near the origin
	var isAtOrigin = Mathf.Abs( this.transform.position.x - this.spawnPosition.x ) < 0.3;
	if( isAtOrigin ){
		backToOrigin = false;
	}
}

function standByForAttackingPlayer(){
	var point = new Vector2( this.transform.position.x , this.transform.position.y );
	
	around = Physics2D.OverlapCircleAll( point , this.attackRange , 1 << LayerMask.NameToLayer("Player"), -10, 10 );
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
	Debug.Log("I'm walking...");
	if( isInLimitRange() ){
		if( pos.x < playerPosition.x ){
			walk( walkSpeed );
		}
		else{
			walk( -walkSpeed );
		}
	}
	
}

function walk( speed : float ){
	this.rigidbody2D.velocity.x = speed;
}

function isInLimitRange(){
	var point = new Vector2( this.transform.position.x , this.transform.position.y );
	var rangeX = Mathf.Abs( this.spawnPosition.x - point.x );
	// return true if it's in the limit range.
	
	// Debug.Log( this.spawnPosition.x );
	// Debug.Log( point.x );
	// Debug.Log( this.limitWalkingRange );
	return rangeX <= this.limitWalkingRange ;
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
			// range in yaxis
			var isInRange = distanceFromPlayer >= blockSizeHeight ;
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


function setAttackRangeFactor( newRange : float ){
	this.rangeFactor = newRange;
	// range in x axis
	this.attackRange = this.blockSizeWidth * this.rangeFactor;
}

function setWalkSpeed( speed : float ){
	this.walkSpeed = speed;
}

function setLimitWalkingRangeFactor( newRange : float ){
	this.limitWalkingRangeFactor = newRange;
	// limit range in x axis
	this.limitWalkingRange = this.blockSizeWidth * this.limitWalkingRangeFactor;
}