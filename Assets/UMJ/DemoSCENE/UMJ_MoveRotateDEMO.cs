using UnityEngine;
using System;
using UniversalMobileJoystick;

public class UMJ_MoveRotateDEMO : MonoBehaviour 
{
    public UMJ_Joystick joyStatic = null;
    public UMJ_Joystick joyDynamic = null;
    public UMJ_Joystick joyTouchpad = null;

    [Range( 1f, 10f )]public float MoveSpeed = 4f;

    private Vector3 targetPos = Vector3.zero;
    private Quaternion targetRot = Quaternion.identity;

    public Transform myTransform = null;
    public Transform youTransform = null;
    
    //
    public GUIText joyStaticInfo = null;
    public GUIText joyDynamicInfo = null;
    public GUIText joyTouchpadInfo = null;

    public GUITexture joyDynamicTZ = null;
    public GUITexture joyTouchpadTZ = null;

    private Rect btnSize = new Rect( 0f, 0f, 0f, 0f );


    // Awake
    void Awake()
    {
        float size = 2f;

        float FSize = size / 50f * Screen.width;
        float SizePixelX = Screen.width / 100f;
        float SizePixelY = Screen.height / 100f;
        float SizeTransformX = transform.position.x * 100f;
        float SizeTransformY = transform.position.y * 100f;
        Vector2 CA_Position = new Vector2( SizePixelX * SizeTransformX - FSize / 10f, SizePixelY * SizeTransformY - FSize / 10f );

        joyStaticInfo.pixelOffset = CA_Position;
        joyDynamicInfo.pixelOffset = CA_Position;
        joyTouchpadInfo.pixelOffset = CA_Position;

        int fontSize = ( int )( FSize / 1.4f );

        joyStaticInfo.fontSize = fontSize;
        joyDynamicInfo.fontSize = fontSize;
        joyTouchpadInfo.fontSize = fontSize;

        transform.position = Vector3.zero;

        btnSize.x = Screen.width - ( Screen.width / 100f * 22f );
        btnSize.y = Screen.height - ( Screen.height / 100f * 95f );
        btnSize.width = Screen.width / 100f * 18f;
        btnSize.height = btnSize.width / 2f;
    }


	// Update
	void Update () 
    {
        //
        joyStaticInfo.text = "Static: \nDirNormX: " + joyStatic.JSK_Direction.normalized.x.ToString() +
            " \nDirNormY: " + joyStatic.JSK_Direction.normalized.x.ToString() +
            " \nTouchForce: " + joyStatic.JSK_TouchForce.ToString();

        joyDynamicInfo.text = "Dynamic: \nDirNormX: " + joyDynamic.JSK_Direction.normalized.x.ToString() +
            " \nDirNormY: " + joyDynamic.JSK_Direction.normalized.x.ToString() +
            " \nTouchForce: " + joyDynamic.JSK_TouchForce.ToString();

        joyTouchpadInfo.text = "Touchpad: \nAxesX : " + joyTouchpad.JSK_TouchpadAxes.x.ToString() +
            " \nAxesY : " + joyTouchpad.JSK_TouchpadAxes.x.ToString();



        //
        targetPos = myTransform.position;
        targetPos.x += joyStatic.JSK_Direction.normalized.x;
        targetPos.y += joyStatic.JSK_Direction.normalized.y;
        myTransform.position = Vector3.Lerp( myTransform.position, targetPos, MoveSpeed / 25f * joyStatic.JSK_TouchForce / 100f );

        if( joyDynamic.JSK_TouchForce > 15f )
        {
            if( joyDynamic.JSK_Direction.normalized.x != 0f || joyDynamic.JSK_Direction.normalized.y != 0f )
            {
                targetRot = Quaternion.LookRotation( -joyDynamic.JSK_Direction.normalized, Vector3.forward );
                myTransform.rotation = Quaternion.Lerp( myTransform.rotation, targetRot, joyDynamic.JSK_TouchForce * 5f / 100f );
            }
        }
        else
        {
            if( joyStatic.JSK_Direction.normalized.x != 0f || joyStatic.JSK_Direction.normalized.y != 0f )
            {
                targetRot = Quaternion.LookRotation( -joyStatic.JSK_Direction.normalized, Vector3.forward );
                myTransform.rotation = Quaternion.Lerp( myTransform.rotation, targetRot, joyStatic.JSK_TouchForce * 5f / 100f );
            }
        }


        targetPos = youTransform.position;
        targetPos.x += joyTouchpad.JSK_TouchpadAxes.x;
        targetPos.y += joyTouchpad.JSK_TouchpadAxes.y;
        youTransform.position = Vector3.Lerp( youTransform.position, targetPos, MoveSpeed * Time.smoothDeltaTime );
	}


    // OnGUI
    void OnGUI()
    {
        if( GUI.Button( btnSize, "Touch Zones" ) )
        {
            joyDynamicTZ.enabled = !joyDynamicTZ.enabled;
            joyTouchpadTZ.enabled = !joyTouchpadTZ.enabled;
        }
    }    
}
