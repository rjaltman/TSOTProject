#pragma strict
var explosionTime = 4.0;
var explosionRadius = 5.0;
var explosionPower = 2000.0;

function Start () 
{
	//Destroy the explosion in x seconds,
 	//this will give the particle system and audio enough time to finish playing
 	Destroy( gameObject, explosionTime );
 	//Find all nearby colliders
 	var colliders : Collider[] = Physics.OverlapSphere( transform.position, 
  	explosionRadius );
 	//Apply a force to all surrounding rigid bodies.
 	for( var hit in colliders )
	{
	  	if( hit.rigidbody && Time.timeScale != 0 )
	  	{
	  		if(hit.rigidbody.tag != "Bullet")
	  		{
		   		hit.rigidbody.AddExplosionForce( explosionPower, transform.position, explosionRadius );
		    	var dist: float = Vector3.Distance(transform.position, hit.transform.position);
		   		hit.SendMessage("OnMissileHit", 500/(dist*dist), SendMessageOptions.DontRequireReceiver);
	   		}
	  	}
	}
 	//If we have a particle emitter attached, emit particles for .5 seconds
 	if( particleEmitter )
  	{
  		particleEmitter.emit = true;
  		yield WaitForSeconds(0.5);
  		particleEmitter.emit = false;
  	}

}

function Update () {

}