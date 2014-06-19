#pragma strict
var explosion: GameObject;
var grenade: GameObject; //disable this object to make it invisible
var detonateTime: float; //the time till the grenade explodes

function Start () 
{
	//wait some time, then activate the explosion object, and disable the renderer and enable the explosion
	yield WaitForSeconds(detonateTime);
	rigidbody.isKinematic = true; //freeze the grenade
	grenade.active = false; //make it invisible
	explosion.active = true; //and que the explosion
}