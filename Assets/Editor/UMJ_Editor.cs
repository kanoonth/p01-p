/***********************************************************
 * 														   *
 * Asset:		 Universal Mobile Joystick			       *
 * Script:		 UMJ_Editor.cs	                	       *
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
    public class UMJ_Editor : Editor
    {
        // 
        private const string mainGOName = "_UMJmanager";
        private const string menuAbbrev = "GameObject/Create Other";
        private const string nameAbbrev = "UMJ";
        private const string layerName = "Default"; // Create new Layer for Joysticks and change this.

        //
        private static GameObject umgMrObj = null;

        private static GameObject JoyMainGO = null;
        private static GameObject Joystick = null;
        private static GameObject JoystickBackgr = null;
        private static GameObject TouchZone = null;


        // CreateJoysManager 
        [MenuItem( menuAbbrev + "/UMJ Manager" )]
        private static void CreateJoysManager()
        {
            if( GameObject.Find( mainGOName ) && !umgMrObj ) umgMrObj = GameObject.Find( mainGOName );
            if( umgMrObj ) return;

            umgMrObj = new GameObject();
            umgMrObj.name = mainGOName;
            umgMrObj.AddComponent<UMJ_JoysticksManager>();

            UMJ_JoysticksManager joyMangTemp = umgMrObj.GetComponent<UMJ_JoysticksManager>();

            joyMangTemp.Joystick = Resources.LoadAssetAtPath<Texture>( "Assets/" + nameAbbrev + "/Resources/CTRL/Joystick.png" );
            joyMangTemp.JoystickBackground = Resources.LoadAssetAtPath<Texture>( "Assets/" + nameAbbrev + "/Resources/CTRL/JoystickBack.png" );
            joyMangTemp.JoystickTouchZone = Resources.LoadAssetAtPath<Texture>( "Assets/" + nameAbbrev + "/Resources/CTRL/DebugTouchZone.png" );

            umgMrObj.layer = LayerMask.NameToLayer( layerName );
        }

        [MenuItem( menuAbbrev + "/UMJ Manager", true )]
        private static bool ValidateCreateInputManager()
        {
            return !GameObject.Find( mainGOName );
        }


        public static void CreateJoystick( string joyName, byte index, float offsetX = 10f, float offsetY = 10f, Texture joy = null, Texture joyBack = null, Texture joyTouchZone = null )
        {
            if( !umgMrObj ) CreateJoysManager();

            SetupController<UMJ_Joystick>( ref JoyMainGO, umgMrObj.transform, joyName, Vector3.forward, false );

            UMJ_Joystick joyTemp = JoyMainGO.GetComponent<UMJ_Joystick>();

            SetupController<GUITexture>( ref Joystick, JoyMainGO.transform, "Joystick", Vector3.forward, true );
            SetupController<GUITexture>( ref JoystickBackgr, JoyMainGO.transform, "JoystickBackgr", Vector3.zero, true );
            SetupController<GUITexture>( ref TouchZone, JoyMainGO.transform, "TouchZone", Vector3.back, true );

            joyTemp.JoystickTextureGOName = Joystick.name;
            joyTemp.JoystickBackgroundGOName = JoystickBackgr.name;
            joyTemp.JoystickTouchZoneGOName = TouchZone.name;
            joyTemp.JoystickMode = ( UMJ_Joystick.JoystickModes )index;

            joyTemp.OffsetX = offsetX;
            joyTemp.OffsetY = offsetY;

            joyTemp.JoystickSetup();

            joyTemp.Joystick.texture = joy;
            joyTemp.JoystickBackground.texture = joyBack;
            joyTemp.JoystickTouchZone.texture = joyTouchZone;

            joyTemp.JoystickAwake();
        }


        // SetupController<Generic>
        private static void SetupController<TComp>( 
            ref GameObject myGO, Transform myParent, string myName, Vector3 vec, bool child = false ) 
            where TComp : Component
        {
            myGO = new GameObject();
            myGO.transform.localScale = Vector3.zero;
            if( child ) myGO.transform.localPosition = vec;
            else myGO.transform.localScale = vec;            
            myGO.name = nameAbbrev + myName;
            myGO.transform.parent = myParent;
            myGO.AddComponent<TComp>();
            myGO.layer = LayerMask.NameToLayer( layerName );
        }
    }
}