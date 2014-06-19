#pragma strict
private var opening: System.Boolean = false;
var yieldtime: int;
var doorspeed: float;

function Start () 
{
	
	opening = true;
}

function Update () 
{
	if(opening)
	{
		if(transform.position.z >= 1.5)
			opening = false;
		transform.Translate(0,0,doorspeed * Time.timeScale);
	}
}