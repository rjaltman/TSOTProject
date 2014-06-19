#pragma strict
/*
when shoot is called, title the cam up a little
*/
var cam: CameraTurnJS;
var rise: float; //how much in degrees, the camera tilts up


function Start () 
{

}

function Update () 
{

}

function Shoot ()
{
	if(cam != null)
	cam.SendMessage("rotateX", rise, SendMessageOptions.DontRequireReceiver);
}