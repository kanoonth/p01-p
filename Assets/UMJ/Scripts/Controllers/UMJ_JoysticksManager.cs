/***********************************************************
 * 														   *
 * Asset:		 Universal Mobile Joystick			       *
 * Script:		 UMJ_JoysticksManager.cs       		       *
 * 														   *
 * Copyright(c): Victor Klepikov						   *
 * Support: 	 ialucard4@gmail.com					   *
 * 														   *
 * mySite:       http://vkdemos.ucoz.org				   *
 * myAssets:     http://bit.ly/VictorKlepikovUnityAssets   *
 * myTwitter:	 http://twitter.com/VictorKlepikov		   *
 * myFacebook:	 http://www.facebook.com/vikle4 		   *
 * 														   *
 ***********************************************************/


using UnityEngine;
using System;

namespace UniversalMobileJoystick
{
    [ExecuteInEditMode]
    [AddComponentMenu( "UMJ/JoysticksManager" )]
    public class UMJ_JoysticksManager : MonoBehaviour
    {
        // Joystic_Parameters Vars	
        public bool DV_SETUP_MODE = false;
        public bool Multitouch = false;
        private UMJ_Joystick[] JoyList = null;


        #if UNITY_EDITOR
        public UMJ_Joystick.JoystickModes JoystickMode = UMJ_Joystick.JoystickModes.Static;

        public enum JoystickAlign { BLeft, BRight, Center, TLeft, TRight }
        public JoystickAlign JoyAlign = JoystickAlign.Center;

        public Texture Joystick = null;
        public Texture JoystickBackground = null;
        public Texture JoystickTouchZone = null;
        #endif


        // Awake
        void Awake()
        {
            DV_SETUP_MODE = false;

            #if UNITY_ANDROID || UNITY_IPHONE || UNITY_BLACKBERRY || UNITY_WP8 || UNITY_METRO || UNITY_WINRT
                Multitouch = true;
            #else
                Multitouch = false;
            #endif

            JoyManagerSetup();
        }


        // JoyManagerSetup
        private void JoyManagerSetup()
        {
            JoyList = gameObject.GetComponentsInChildren<UMJ_Joystick>();
            for( int cnt = 0; cnt < JoyList.Length; cnt++ ) JoyList[ cnt ].JoystickAwake();
        }


        // Update
        void Update()
        {
            if( DV_SETUP_MODE )
            {
                JoyManagerSetup();

                for( int cnt = 0; cnt < JoyList.Length; cnt++ )
                {
                    JoyList[ cnt ].CalculationSizeAndPosition( Screen.width, DV_SETUP_MODE );
                }
            }

            if( Multitouch )
            {
                for( int cnt = 0; cnt < Input.touchCount; cnt++ )
                {
                    for( int dnt = 0; dnt < JoyList.Length; dnt++ )
                    {
                        JoyTouchManagment( Input.GetTouch( cnt ), JoyList[ dnt ] );
                    }
                }
            }
            else
            {
                for( int dnt = 0; dnt < JoyList.Length; dnt++ )
                {
                    JoyMouseManagment( JoyList[ dnt ] );
                }
            }
        }


        // JoyTouchManagment
        private void JoyTouchManagment( Touch touch, UMJ_Joystick Joystick )
        {
            switch( touch.phase )
            {
                case TouchPhase.Began:

                    if( Joystick.CheckPosition( touch.position ) && !Joystick.TouchDown )
                    {
                        Joystick.TouchID = touch.fingerId;
                        Joystick.TouchDown = true;
                        Joystick.GetDefaultPosition( touch.position );
                    }

                    break;

                case TouchPhase.Stationary:
                case TouchPhase.Moved:

                    if( Joystick.TouchID == touch.fingerId && Joystick.TouchDown )
                    {
                        Joystick.GetCurrentPosition( touch.position );
                    }

                    break;

                case TouchPhase.Ended:
                case TouchPhase.Canceled:

                    if( Joystick.TouchID == touch.fingerId )
                    {
                        Joystick.ResetJoystickPosition();
                    }

                    break;
            }
        }


        // JoyMouseManagment
        private void JoyMouseManagment( UMJ_Joystick Joystick )
        {
            if( Joystick.CheckPosition( Input.mousePosition ) && Input.GetMouseButtonDown( 0 ) )
            {
                Joystick.TouchDown = true;
                Joystick.GetDefaultPosition( Input.mousePosition );
            }

            if( Joystick.TouchDown && Input.GetMouseButton( 0 ) ) Joystick.GetCurrentPosition( Input.mousePosition );

            if( Input.GetMouseButtonUp( 0 ) ) Joystick.ResetJoystickPosition();
        }
    }
}
