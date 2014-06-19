#pragma strict
var smoke: GameObject;
var initialWait: float; //the wait before starting smoke
var radius: float;
var visionDuration: float;

function Start () {

}

function Update () {

} 

 function OnCollisionEnter(collision : Collision)
 {
 	yield WaitForSeconds(initialWait);
 	smoke.active = true;
 	//disable vision of nearby bots
	var colliders : Collider[] = Physics.OverlapSphere( transform.position, radius );
 	for( var hit in colliders )
	{
	  	if( hit.tag == "Enemy" )
	  	{
	  		hit.SendMessage("DisableVision", visionDuration);
	  	}
	}
 	
 	//transform.renderer.enabled = false;
 	yield WaitForSeconds(2);
 	smoke.particleEmitter.emit = false;
 	yield WaitForSeconds(10);
 	smoke.active = false;
 	if(Network.isClient || Network.isServer)
 	Destroy (gameObject);
 	else
 	Network.Destroy (gameObject);
 }