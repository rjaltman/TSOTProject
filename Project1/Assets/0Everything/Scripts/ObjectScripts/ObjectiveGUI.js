#pragma strict
var tex: Texture2D;
var cam: GameObject;
private var x: int;
private var y: int;

function Start () 
{
	cam = GameObject.FindGameObjectWithTag("Player");
}

function Update () 
{

}

function OnGUI()
{
	var screenPos : Vector3 = cam.camera.WorldToScreenPoint (transform.position);
	x = screenPos.x;
	y = Screen.height - screenPos.y;
	if(screenPos.z > 0)
	{
	GUI.DrawTexture(Rect(x - tex.width/2, y - tex.height/2, tex.width, tex.height), tex);
	}
	
}