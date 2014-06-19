#pragma strict
/*
When the gun shoots muzzle flare
*/
var muzzleFlash: GameObject; //should have the light and texture on it
var pos: Transform; //an object for where the muzzle flash should be, such as bullet spawn


function Start () 
{
	muzzleFlash.active = false;
}

function Update () 
{
	if(pos != null)
	muzzleFlash.transform.position = pos.position;
}

function Enable() 
{
	muzzleFlash.active = true;
	Randomize();
	yield WaitForSeconds(0.05);
	muzzleFlash.active = false;
}

function PlayerEnable()
{
	muzzleFlash.active = true;
	Randomize();
	yield WaitForSeconds(0.05 * Time.timeScale);
	muzzleFlash.active = false;
}

function Randomize()
{
	var angle = Random.Range(0,360); //this is the angle for rotation
	muzzleFlash.transform.RotateAround(transform.parent.forward, angle);
}

function SetMuzzle(posIn: Transform) //set the position thing
{
	pos = posIn;
}