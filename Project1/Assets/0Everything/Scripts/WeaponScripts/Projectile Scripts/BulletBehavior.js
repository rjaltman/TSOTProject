#pragma strict
var hitObj: GameObject;
var bulletHole: Transform;
var trail: GameObject; //the time dilator trail
var normTrail: GameObject; //the trial to show normally
var damage: int = 10;
var hit = false; //stores whether the bullet has hit something, in which case
//it should never be shown
var bulletHoles: System.Boolean = false;

function Start () 
{
	if(Time.timeScale == 1)
	{
		if(normTrail != null)
		normTrail.active = true;
		trail.active = false;
		renderer.enabled = false;
	}
	else
	{
		if(normTrail != null)
		normTrail.active = false;
		trail.active = true;
	}
}

function Update () 
{
	if(Time.timeScale == 1)
	{
		trail.active = false;
		if(normTrail != null)
		normTrail.active = true;
		renderer.enabled = false;
	}
	else
	{
		trail.active = true;
		if(normTrail != null)
		normTrail.active = false;
		if(!hit)
		renderer.enabled = true;
	}
}

function OnCollisionEnter( collision : Collision )
{
	if(!hit)
	{
		hit = true;
		hitObj = collision.collider.gameObject;
		collision.collider.SendMessage("OnBulletHit", damage, SendMessageOptions.DontRequireReceiver);
	 	collider.active = false; //this solves a bug where if you shot someone on spawn,
	 	// they would die again because the bullet was still there
	 	rigidbody.isKinematic = true;
		renderer.enabled = false;
		
		
		if(bulletHoles && hitObj.tag != "CamCollider" && collision.collider.isTrigger == false)
		{
			var rHit: RaycastHit;
			if(Physics.Raycast(transform.position - transform.forward, transform.forward, rHit)) //returns a hit object
			{
				var bullethole: Transform = Instantiate(bulletHole, rHit.point+(rHit.normal * 0.01), Quaternion.LookRotation(rHit.normal));
				bullethole.SendMessage("setObj", hitObj.transform);
			}
		}
		yield WaitForSeconds(2);
		Destroy( gameObject );
	}
}
