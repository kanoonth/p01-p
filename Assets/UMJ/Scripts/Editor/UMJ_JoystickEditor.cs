/***********************************************************
 * 														   *
 * Asset:		 Universal Mobile Joystick			       *
 * Script:		 UMJ_JoystickEditor.cs      		       *
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
    [CustomEditor( typeof( UMJ_Joystick ) )]
    public class UMJ_JoystickEditor : Editor
    {
        private UMJ_Joystick myTarget = null;


        // OnEnable
        public void OnEnable()
        {
            myTarget = ( UMJ_Joystick )target;
        }
        

        // OnInspectorGUI
        public override void OnInspectorGUI()
        {
            // BEGIN
            GUILayout.BeginVertical( "Box", GUILayout.Width( 300 ) );
            GUILayout.Space( 5 );
            //

            ShowParameters();
            if( GUI.changed ) EditorUtility.SetDirty( myTarget );

            // END
            GUILayout.Space( 5 );
            GUILayout.EndVertical();
            //
        }
        

        // ShowParameters
        private void ShowParameters()
        {
            GUILayout.BeginVertical( "Box" );
            GUILayout.Label( "                      Joystick Modes", EditorStyles.boldLabel );

            myTarget.JoystickMode = ( UMJ_Joystick.JoystickModes )
                GUILayout.Toolbar( ( int )myTarget.JoystickMode,
                    Enum.GetNames( typeof( UMJ_Joystick.JoystickModes ) ),
                        GUILayout.Height( 20 ) );

            GUILayout.EndVertical();

            GUILayout.Space( 5 );
            GUILayout.BeginVertical( "Box" );
            GUILayout.Label( "                         Offset X & Y", EditorStyles.boldLabel );
            myTarget.OffsetX = EditorGUILayout.Slider( "Offset X", myTarget.OffsetX, -50f, 50f );
            myTarget.OffsetY = EditorGUILayout.Slider( "Offset Y", myTarget.OffsetY, -50f, 50f );
            GUILayout.EndVertical();

            if( myTarget.JoystickMode != UMJ_Joystick.JoystickModes.Touchpad )
            {
                GUILayout.Space( 5 );
                GUILayout.BeginVertical( "Box" );
                GUILayout.Label( "                   Joystick & Border Size", EditorStyles.boldLabel );

                myTarget.JoystickSize = EditorGUILayout.Slider( "Joystick Size", myTarget.JoystickSize, 1f, 10f );
                myTarget.BorderSize = EditorGUILayout.Slider( "Border Size", myTarget.BorderSize, 1f, 10f );
                GUILayout.EndVertical();
            }            

            if( myTarget.JoystickMode != UMJ_Joystick.JoystickModes.Static )
            {
                GUILayout.Space( 5 );
                GUILayout.BeginVertical( "Box" );
                GUILayout.Label( "                      TouchZone Size", EditorStyles.boldLabel );

                myTarget.TouchZoneWidth = EditorGUILayout.Slider( "TouchZone Width", myTarget.TouchZoneWidth, 5f, 50f );
                myTarget.TouchZoneHeight = EditorGUILayout.Slider( "TouchZone Height", myTarget.TouchZoneHeight, 5f, 50f );
                GUILayout.EndVertical();
            }


            GUILayout.Space( 5 );
            GUILayout.BeginVertical( "Box" );

            int size = 92;

            GUILayout.BeginHorizontal();
            if( myTarget.JoystickMode != UMJ_Joystick.JoystickModes.Touchpad )
            {
                GUILayout.Label( "      Joystick", GUILayout.Width( size ) );
                GUILayout.Label( "  Background", GUILayout.Width( size ) );
            }
            if( myTarget.JoystickMode != UMJ_Joystick.JoystickModes.Static )
                GUILayout.Label( "   TouchZone", GUILayout.Width( size ) );
            GUILayout.EndHorizontal();

            GUILayout.BeginHorizontal();
            if( myTarget.JoystickMode != UMJ_Joystick.JoystickModes.Touchpad )
            {
                myTarget.Joystick.texture = EditorGUILayout.ObjectField( myTarget.Joystick.texture, typeof( Texture ), false, GUILayout.Width( size ), GUILayout.Height( size ) ) as Texture;
                myTarget.JoystickBackground.texture = EditorGUILayout.ObjectField( myTarget.JoystickBackground.texture, typeof( Texture ), false, GUILayout.Width( size ), GUILayout.Height( size ) ) as Texture;
            }
            if( myTarget.JoystickMode != UMJ_Joystick.JoystickModes.Static )
                myTarget.JoystickTouchZone.texture = EditorGUILayout.ObjectField( myTarget.JoystickTouchZone.texture, typeof( Texture ), false, GUILayout.Width( size ), GUILayout.Height( size ) ) as Texture;
            GUILayout.EndHorizontal();

            GUILayout.EndVertical();

            GUILayout.Space( 5 );
            GUILayout.BeginVertical( "Box" );
            if( myTarget.JoystickMode != UMJ_Joystick.JoystickModes.Touchpad )
            {
                myTarget.JoystickTextureGOName = EditorGUILayout.TextField( "Joystick NameGO", myTarget.JoystickTextureGOName );
                myTarget.JoystickBackgroundGOName = EditorGUILayout.TextField( "Background NameGO", myTarget.JoystickBackgroundGOName );
            }
            if( myTarget.JoystickMode != UMJ_Joystick.JoystickModes.Static )
                myTarget.JoystickTouchZoneGOName = EditorGUILayout.TextField( "TouchZone NameGO", myTarget.JoystickTouchZoneGOName );
            GUILayout.EndVertical();
        }      
    }
}