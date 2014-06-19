#pragma strict
var explosion : GameObject;
var smokeTrail: GameObject;
private var damage:int = 100;
private var instanceTrail: GameObject;
var trail: GameObject;
var hasTrail: System.Boolean = false;

function Start () 
{
	if(Time.timeScale == 1)
	{
		trail.active = false;
	}
	else
	{
		trail.active = true;
	}
	yield WaitForSeconds(0.1);
	hasTrail = true;
	instanceTrail = Instantiate(smokeTrail, transform.position - transform.forward*1, transform.rotation);

}

function Update () 
{
	if(Input.GetKeyDown(KeyCode.Q) && Time.timeScale != 0)
	{
		if(Time.timeScale == 1)
		{
			trail.active = false;
		}
		else
		{
			trail.active = true;
		}
	}
	if(hasTrail && instanceTrail != null)
	instanceTrail.transform.position = transform.position - transform.forward*1;
	if(renderer.enabled == false && instanceTrail != null)
	Destroy(instanceTrail); 
}


function OnCollisionEnter( collision : Collision )
{
 collider.isTrigger = true;
 var contact : ContactPoint = collision.contacts[0];
 collision.collider.SendMessage("OnMissileHit", damage, SendMessageOptions.DontRequireReceiver);
 var rotation = Quaternion.FromToRotation( Vector3.up, contact.normal );
 var instantiatedExplosion : GameObject = Instantiate(explosion, contact.point, rotation );
 //Destroy(instanceTrail);
 rigidbody.isKinematic = true;
 renderer.enabled = false;
 
 if(Network.isClient || Network.isServer)
 {
 	yield WaitForSeconds(2);
 	Network.Destroy(gameObject);
 }
 else
 {
 	Destroy(gameObject,2);
 }
}

function OnMissileHit(damage: int)
{
 var instantiatedExplosion : GameObject = Instantiate(explosion, transform.position, transform.rotation );
 Destroy(instanceTrail);
 //Destroy( gameObject );
 rigidbody.isKinematic = true;
 renderer.enabled = false;
 collider.isTrigger = true;
 if(Network.isClient || Network.isServer)
 {
 	yield WaitForSeconds(2);
 	Network.Destroy(gameObject);
 }
 else
 {
 	Destroy(gameObject,2);
 }
}

function OnBulletHit(damage: int)
{
 var instantiatedExplosion : GameObject = Instantiate(explosion, transform.position, transform.rotation );
 Destroy(instanceTrail);
 //Destroy( gameObject );
 rigidbody.isKinematic = true;
 renderer.enabled = false;
 collider.isTrigger = true;
 if(Network.isClient || Network.isServer)
 {
 	yield WaitForSeconds(2);
 	Network.Destroy(gameObject);
 }
 else
 {
 	Destroy(gameObject,2);
 }
}