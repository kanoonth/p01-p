#pragma strict

function Start () {

}

function Update () {

}

/* Percent Width */
function PercentOfWidth(value: long) {
  return value / 100.0 * Screen.width;
}

/* Percent Height */
function PercentOfHeight(value: long) {
  return value / 100.0 * Screen.height;
}

function CreateRect(x: long, y: long, width: long, height: long) {
  return new Rect(PercentOfWidth(x), PercentOfHeight(y), PercentOfWidth(width), PercentOfHeight(height));
}

function OnGUI() {
  GUI.Button(CreateRect(0, 0, 70, 70), "Create Room");
  GUI.Button(CreateRect(70, 0, 30, 70), "Friend List");
  GUI.Button(CreateRect(0, 70, 100, 30), "Chat");
}

