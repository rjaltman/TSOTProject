#pragma strict
public var thirdpersoncam: GameObject; 
var net: GameObject;

function Start () {

}

function Update () 
{
	if(Input.GetKeyDown(KeyCode.C))
	{
		if(thirdpersoncam.GetComponent(Camera).enabled == true)
			thirdpersoncam.GetComponent(Camera).enabled = false;
		else
			thirdpersoncam.GetComponent(Camera).enabled = true;
	}
}

	