/***********************************************************
 * 														   *
 * Asset:		 Universal Mobile Joystick			       *
 * Script:		 UMJ_Joystick.cs            		       *
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
    [AddComponentMenu( "UMJ/Joystick" )]
    public class UMJ_Joystick : MonoBehaviour
    {
        // Reading these coordinates get the direction of movement ( Read ONLY )
        public Vector2 JSK_Direction { get; private set; }    // Coordinates for "Statick & Dynamic" JoystickMode
        public Vector2 JSK_TouchpadAxes { get; private set; } // Coordinates for "Tochpad" JoystickMode
        public float JSK_TouchForce { get; private set; }     // TouchForce  for "Statick & Dynamic" JoystickMode
        //


        public enum JoystickModes { Static, Dynamic, Touchpad }
        public JoystickModes JoystickMode = JoystickModes.Static;

        public float OffsetX = 10f;
        public float OffsetY = 10f;

        public float JoystickSize = 4.6f;

        public float BorderSize = 5.85f;

        public float TouchZoneWidth = 20f;
        public float TouchZoneHeight = 16f;
        private float TouchZoneWidthPart = 0f;
        private float TouchZoneHeightPart = 0f;

        private Vector2 TouchZonePosition = Vector2.zero;

        public bool TouchDown = false;
        public int TouchID = -1;

        public string JoystickTextureGOName = null;
        public string JoystickBackgroundGOName = null;
        public string JoystickTouchZoneGOName = null;
        
        public GUITexture Joystick = null;
        public GUITexture JoystickBackground = null;
        public GUITexture JoystickTouchZone = null;

        private Vector2 JSK_DefaultPosition = Vector2.zero;
        private Vector2 JSK_CurrentPosition = Vector2.zero;
        private Vector2 JSK_BorderPosition = Vector2.zero;

        private float JoySize = 0f;
        private float BgrdSize = 0f;

        private Rect myRect = new Rect( 0f, 0f, 0f, 0f );
        private Color32 halfColor = new Color32( 255, 255, 255, 87 );


        // JoystickAwake
        public void JoystickAwake()
        {
            JoystickSetup();

            JoystickTouchZone.enabled = false;

            CalculationSizeAndPosition( Screen.width, false );

            if( JoystickMode != JoystickModes.Static )
            {
                Joystick.enabled = false;
                JoystickBackground.enabled = false;
            }
        }


        // JoystickSetup
        public void JoystickSetup()
        {
            Joystick = transform.FindChild( JoystickTextureGOName ).guiTexture;
            JoystickBackground = transform.FindChild( JoystickBackgroundGOName ).guiTexture;
            JoystickTouchZone = transform.FindChild( JoystickTouchZoneGOName ).guiTexture;            

            Joystick.color = halfColor;
            JoystickBackground.color = halfColor;
            JoystickTouchZone.color = halfColor;
        }


        // CalculationSizeAndPosition
        public void CalculationSizeAndPosition( float ScreenWidth, bool SETUP_MODE )
        {
            if( SETUP_MODE )
            {
                JoystickSetup();

                if( JoystickMode != JoystickModes.Touchpad )
                {
                    Joystick.enabled = true;
                    JoystickBackground.enabled = true;
                }

                if( JoystickMode != JoystickModes.Static ) JoystickTouchZone.enabled = true;
                else JoystickTouchZone.enabled = false;
            }

            JoySize = JoystickSize / 50f * ScreenWidth;
            BgrdSize = JoySize;
            TouchZoneWidthPart = TouchZoneWidth / 50f * ScreenWidth;
            TouchZoneHeightPart = TouchZoneHeight / 50f * ScreenWidth;

            JSK_DefaultPosition.x = ( ( ScreenWidth / 10f ) - ( JoySize / 5f ) ) + ( OffsetX * ScreenWidth / 50f );
            JSK_DefaultPosition.y = ( ( ScreenWidth / 10f ) - ( JoySize / 5f ) ) + ( OffsetY * ScreenWidth / 50f );

            JSK_CurrentPosition = JSK_DefaultPosition;

            TouchZonePosition = JSK_CurrentPosition;

            JoystickTouchZone.pixelInset = UpdateRect( TouchZonePosition, TouchZoneWidthPart, TouchZoneHeightPart );
            Joystick.pixelInset = UpdateRect( JSK_CurrentPosition, JoySize, JoySize );
            JoystickBackground.pixelInset = UpdateRect( JSK_CurrentPosition, BgrdSize, BgrdSize );
        }


        // CheckPosition
        public bool CheckPosition( Vector2 touchPos )
        {
            if( JoystickMode == JoystickModes.Static )
            {
                if( touchPos.x > JSK_DefaultPosition.x
                && touchPos.y > JSK_DefaultPosition.y
                && touchPos.x < JSK_DefaultPosition.x + BgrdSize
                && touchPos.y < JSK_DefaultPosition.y + BgrdSize )
                {
                    return true;
                }
                else return false;
            }
            else
            {
                if( touchPos.x > TouchZonePosition.x
                && touchPos.y > TouchZonePosition.y
                && touchPos.x < TouchZonePosition.x + TouchZoneWidthPart
                && touchPos.y < TouchZonePosition.y + TouchZoneHeightPart )
                {
                    return true;
                }
                else return false;
            }
        }


        // GetDefaultPosition
        public void GetDefaultPosition( Vector2 touchPos )
        {
            if( JoystickMode != JoystickModes.Static )
            {
                if( JoystickMode == JoystickModes.Dynamic )
                {
                    if( !Joystick.enabled ) Joystick.enabled = true;
                    if( !JoystickBackground.enabled ) JoystickBackground.enabled = true;
                }

                JSK_DefaultPosition.x = touchPos.x - JoySize / 2f;
                JSK_DefaultPosition.y = touchPos.y - JoySize / 2f;
            }

            if( JoystickMode != JoystickModes.Touchpad )
            {
                Joystick.pixelInset = UpdateRect( JSK_DefaultPosition, JoySize, JoySize );
                JoystickBackground.pixelInset = UpdateRect( JSK_DefaultPosition, BgrdSize, BgrdSize );
            }            
        }


        // GetCurrentPosition
        public void GetCurrentPosition( Vector2 touchPos )
        {
            JSK_CurrentPosition.x = touchPos.x - JoySize / 2f;
            JSK_CurrentPosition.y = touchPos.y - JoySize / 2f;

            JSK_Direction = JSK_CurrentPosition - JSK_DefaultPosition;

            float currentDistance = Vector2.Distance( JSK_DefaultPosition, JSK_CurrentPosition );


            if( JoystickMode == JoystickModes.Touchpad )
            {
                JSK_TouchForce = currentDistance * 4f;
                JSK_DefaultPosition = JSK_CurrentPosition;
                JSK_TouchpadAxes = JSK_Direction.normalized * JSK_TouchForce / 25f;
            }
            else
            {
                float calculatedBorderSize = ( JoySize * BorderSize ) / 5f;
                bool borderOutput = false;

                JSK_BorderPosition = JSK_DefaultPosition;
                JSK_BorderPosition += JSK_Direction.normalized * calculatedBorderSize;                

                if( currentDistance > calculatedBorderSize ) borderOutput = true;
                else borderOutput = false;

                if( borderOutput ) JSK_CurrentPosition = JSK_BorderPosition;
                Joystick.pixelInset = UpdateRect( JSK_CurrentPosition, JoySize, JoySize );

                if( !borderOutput ) JSK_TouchForce = ( currentDistance / calculatedBorderSize ) * 100f;
                else JSK_TouchForce = 100f;
            }            
        }


        // ResetJoystickPosition
        public void ResetJoystickPosition()
        {
            JSK_CurrentPosition = JSK_DefaultPosition;

            Joystick.pixelInset = UpdateRect( JSK_CurrentPosition, JoySize, JoySize );
            JoystickBackground.pixelInset = UpdateRect( JSK_CurrentPosition, BgrdSize, BgrdSize );

            if( JoystickMode != JoystickModes.Static )
            {
                Joystick.enabled = false;
                JoystickBackground.enabled = false;
            }
            JSK_Direction = Vector2.zero;            
            JSK_TouchpadAxes = Vector2.zero;
            JSK_TouchForce = 0f;
            TouchDown = false;
            TouchID = -1;
        }


        // UpdateRect
        private Rect UpdateRect( Vector2 pos, float width, float height )
        {
            myRect.x = pos.x;
            myRect.y = pos.y;
            myRect.width = width;
            myRect.height = height;
            return myRect;
        }
    }
}