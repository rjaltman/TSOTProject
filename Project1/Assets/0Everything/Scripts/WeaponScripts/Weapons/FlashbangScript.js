#pragma strict
var detonateTime: float; //time to wait before explosion
var flash: GameObject;
var Flight: GameObject;
var radius: float;
var visionDuration: float;

function Start () 
{
	yield WaitForSeconds(detonateTime);
	
	//disable vision of nearby bots
	var colliders : Collider[] = Physics.OverlapSphere( transform.position, radius );
 	for( var hit in colliders )
	{
	  	if( hit.tag == "Enemy" )
	  	{
	  		hit.SendMessage("DisableVision", visionDuration);
	  	}
	}
	
	Flight.transform.position = transform.position + Vector3.up * 0.5;
	flash.active = true;
	Flight.active = true;
	yield WaitForSeconds(2);
	Destroy(gameObject);
}