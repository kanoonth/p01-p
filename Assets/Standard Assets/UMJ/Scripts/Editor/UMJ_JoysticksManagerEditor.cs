/***********************************************************
 * 														   *
 * Asset:		 Universal Mobile Joystick			       *
 * Script:		 UMJ_JoysticksManagerEditor.cs		       *
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
using UnityEditor;
using System;

namespace UniversalMobileJoystick.Editors
{
    [CustomEditor( typeof( UMJ_JoysticksManager ) )]
    public class UMJ_JoysticksManagerEditor : Editor
    {
        private UMJ_JoysticksManager myTarget = null;
        private string[] stateNames = { "OFF", "ON" };

        // OnEnable
        public void OnEnable()
        {
            myTarget = ( UMJ_JoysticksManager )target;
        }
        

        // OnInspectorGUI
        public override void OnInspectorGUI()
        {
            ShowParameters();
            if( GUI.changed ) EditorUtility.SetDirty( myTarget );
        }
        

        // ShowParameters
        private void ShowParameters()
        {
            // BEGIN
            GUILayout.BeginVertical( "Box", GUILayout.Width( 303 ) );
            GUILayout.Space( 5 );
            //

            GUILayout.Label( "                        SETUP_MODE", EditorStyles.boldLabel );
            myTarget.DV_SETUP_MODE = Convert.ToBoolean( GUILayout.Toolbar( Convert.ToInt32( myTarget.DV_SETUP_MODE ), stateNames, GUILayout.Height( 20 ) ) );

            GUILayout.Label( "                          Multitouch", EditorStyles.boldLabel );
            myTarget.Multitouch = Convert.ToBoolean( GUILayout.Toolbar( Convert.ToInt32( myTarget.Multitouch ), stateNames, GUILayout.Height( 20 ) ) );

            // END
            GUILayout.Space( 5 );
            GUILayout.EndVertical();
            //

            if( myTarget.DV_SETUP_MODE )
            {
                GUILayout.Space( 7 );

                GUILayout.BeginVertical( "Box", GUILayout.Width( 303 ) );

                JoystickSpawn();

                GUILayout.Space( 5 );
                GUILayout.EndVertical();
            }
        }


        // JoystickSpawn
        private void JoystickSpawn()
        {
            int size = 93;

            GUILayout.BeginVertical( "Box" );
            GUILayout.Label( "                      Joystick Modes", EditorStyles.boldLabel );
            myTarget.JoystickMode = ( UMJ_Joystick.JoystickModes )
                GUILayout.Toolbar( ( int )myTarget.JoystickMode,
                    Enum.GetNames( typeof( UMJ_Joystick.JoystickModes ) ),
                        GUILayout.Height( 20 ) );
            GUILayout.EndVertical();

            GUILayout.Space( 5 );

            GUILayout.BeginVertical( "Box" );
            GUILayout.Label( "                       Joystick Align", EditorStyles.boldLabel );
            myTarget.JoyAlign = ( UMJ_JoysticksManager.JoystickAlign )
                GUILayout.Toolbar( ( int )myTarget.JoyAlign,
                    Enum.GetNames( typeof( UMJ_JoysticksManager.JoystickAlign ) ),
                        GUILayout.Height( 20 ) );
            GUILayout.EndVertical();

            GUILayout.Space( 5 );

            GUILayout.BeginVertical( "Box" );

            GUILayout.BeginHorizontal();
            GUILayout.Label( "      Joystick", GUILayout.Width( size ) );
            GUILayout.Label( "  Background", GUILayout.Width( size ) );
            GUILayout.Label( "   TouchZone", GUILayout.Width( size ) );
            GUILayout.EndHorizontal();
                        
            GUILayout.BeginHorizontal();
            myTarget.Joystick = EditorGUILayout.ObjectField( myTarget.Joystick, typeof( Texture ), false, GUILayout.Width( size ), GUILayout.Height( size ) ) as Texture;
            myTarget.JoystickBackground = EditorGUILayout.ObjectField( myTarget.JoystickBackground, typeof( Texture ), false, GUILayout.Width( size ), GUILayout.Height( size ) ) as Texture;
            myTarget.JoystickTouchZone = EditorGUILayout.ObjectField( myTarget.JoystickTouchZone, typeof( Texture ), false, GUILayout.Width( size ), GUILayout.Height( size ) ) as Texture;
            GUILayout.EndHorizontal();

            GUILayout.EndVertical();

            GUILayout.Space( 15 );


            if( GUILayout.Button( "Add new joystick", GUILayout.Height( 30 ) ) )
            {
                // Error Checker
                if( !myTarget.Joystick || !myTarget.JoystickBackground || !myTarget.JoystickTouchZone )
                {
                    Debug.LogError( "Error! One or more of joystick texture`s is NULL." );
                    return;
                }
                //


                float offsetX = 10f;
                float offsetY = 10f;

                switch( myTarget.JoyAlign )
                {
                    // BLeft
                    case UMJ_JoysticksManager.JoystickAlign.BLeft:

                        if( myTarget.JoystickMode == UMJ_Joystick.JoystickModes.Static )
                        {
                            offsetX = 2f;
                            offsetY = 2f;
                        }
                        else
                        {
                            offsetX = -4f;
                            offsetY = -4f;
                        }

                        break;

                    // BRight
                    case UMJ_JoysticksManager.JoystickAlign.BRight:

                        if( myTarget.JoystickMode == UMJ_Joystick.JoystickModes.Static )
                        {
                            offsetX = 35f;
                            offsetY = 2f;
                        }
                        else
                        {
                            offsetX = 26f;
                            offsetY = -4f;
                        }

                        break;

                    // Center
                    case UMJ_JoysticksManager.JoystickAlign.Center:

                        if( myTarget.JoystickMode == UMJ_Joystick.JoystickModes.Static )
                        {
                            offsetX = 19f;
                            offsetY = 10f;
                        }
                        else
                        {
                            offsetX = 10f;
                            offsetY = 4f;
                        }

                        break;

                    // TLeft
                    case UMJ_JoysticksManager.JoystickAlign.TLeft:

                        if( myTarget.JoystickMode == UMJ_Joystick.JoystickModes.Static )
                        {
                            offsetX = 2f;
                            offsetY = 17f;
                        }
                        else
                        {
                            offsetX = -4f;
                            offsetY = 12f;
                        }

                        break;

                    // TRight
                    case UMJ_JoysticksManager.JoystickAlign.TRight:

                        if( myTarget.JoystickMode == UMJ_Joystick.JoystickModes.Static )
                        {
                            offsetX = 35f;
                            offsetY = 17f;
                        }
                        else
                        {
                            offsetX = 26f;
                            offsetY = 12f;
                        }

                        break;
                }

                byte joystickModeIndex = ( byte )myTarget.JoystickMode;

                UMJ_Editor.CreateJoystick( 
                    Enum.GetName( typeof( UMJ_Joystick.JoystickModes ), joystickModeIndex ), 
                    joystickModeIndex, offsetX, offsetY, 
                    myTarget.Joystick, myTarget.JoystickBackground, myTarget.JoystickTouchZone );
            }
        }
        //
    }
}