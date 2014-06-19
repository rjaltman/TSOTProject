#pragma strict
var target: GameObject; //the effected object
var cam: Camera; //the main camera. If the main camera is enabled, we'll use layer 5

function Start () 
{	
}

function Update () 
{
	
	if(!cam.camera.enabled)
	{
		target.layer = 0;
	}

}