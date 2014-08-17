#pragma strict


var moveJoystick : UniversalMobileJoystick.UMJ_Joystick;
//var shootButton : UMJDemo_Button;
var minTForceToMove : float = 10f;
var mainController : MainCharacterController;
var btnSize = new Rect( 0f, 0f, 0f, 0f );

function Start () {
	var controllerJoystick = GameObject.Find("UMJDynamic");
	moveJoystick = controllerJoystick.GetComponent("UMJ_Joystick");
//	var controllerButton = GameObject.Find("Button");
//	shootButton = controllerButton.GetComponent("UMJDemo_Button");
	mainController = this.GetComponent("MainCharacterController");
	btnSize.x = Screen.width - ( Screen.width / 100f * 30f );
	btnSize.y = Screen.height - ( Screen.height / 100f * 30f );
	btnSize.width = Screen.width / 100f * 18f;
	btnSize.height = btnSize.width / 2f;
}

function Update () {
	if ( networkView.isMine ) {
		CheckLeftJoystick();
		CheckRightJoystick();
	}
}

function CheckLeftJoystick() {
		if ( moveJoystick.JSK_TouchForce > minTForceToMove )  {
			mainController.PlayerMovement( moveJoystick.JSK_Direction.normalized.x ,moveJoystick.JSK_Direction.normalized.y ,moveJoystick.JSK_TouchForce );
		}
}

function CheckRightJoystick() {

}

function OnGUI()
    {
        if( GUI.Button( btnSize, "Jump" ) )
        {
            mainController.Jump();
        }
    }    

