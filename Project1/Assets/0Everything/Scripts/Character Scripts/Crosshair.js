//This script draws the crosshair
#pragma strict
var crosshairTexture : Texture2D;
var position : Rect;
var x: int;
var y: int;
var showing: System.Boolean = true; 
var dynamic: System.Boolean = false;

function Start()
{

 position = Rect( ( Screen.width - crosshairTexture.width ) / 2, ( Screen.height -
  crosshairTexture.height ) / 2, crosshairTexture.width, crosshairTexture.height);
  showing = true;
}

function OnGUI()
{
	if(showing)
	{
		if(dynamic)
		GUI.DrawTexture( Rect(x - crosshairTexture.width/2, y - crosshairTexture.height/2, crosshairTexture.width, crosshairTexture.height), crosshairTexture );
		else
		GUI.DrawTexture(position, crosshairTexture);
	}
}

function setPosition(pos: Vector3)
{
	var screenPos : Vector3 = camera.WorldToScreenPoint (pos);
	x = screenPos.x;
	y = Screen.height - screenPos.y;
}

function disableCrosshair()
{
	showing = false;
}

function enableCrosshair()
{
	showing = true;
}