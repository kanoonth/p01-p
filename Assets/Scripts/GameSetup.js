﻿#pragma strict

var mainCam : Camera;
var blockPrefab : GameObject;
var enemyPrefab : GameObject;

var topWall : BoxCollider2D;
var bottomWall : BoxCollider2D;
var leftWall : BoxCollider2D;
var rightWall : BoxCollider2D;

var map = [
		[0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0],
		[1,1,1,0,1,1,1],
		[0,0,0,0,0,0,0],
		[1,1,1,1,1,1,1]
	];
	
var mapPosition : Array = [];

function Start() {

	InitWall();
	
	InitBlock();
	
	SpawnEnemy();

}

// TODO:
function getScreenWidth() {
	return Screen.width;
}

// TODO:
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
				var block : GameObject = Instantiate ( blockPrefab, Vector3( originX, originY, 0 ), Quaternion.identity);
				block.transform.localScale.x = width / numBlockY;
				block.transform.localScale.y = height / numBlockX;
				
			} else {		
				mapPosition.push( new Array( originX, originY ) );
			}
		}
	}
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
	
	var enemy : GameObject = Instantiate ( enemyPrefab, Vector3( originX, originY, 0 ), Quaternion.identity);
}

