#pragma strict
var takedownPoss = false; // if this is true, you are right behind someone, and can do a backstab
var hit: RaycastHit;
var hitobj: GameObject;
var net: GameObject;
var cam: GameObject;
var wepMgr: Shooter;


function Start () 
{
	transform.GetChild(0).animation.Play("knifeRest");
}

function Update () 
{
	if(!net.networkView.isMine && (Network.isClient || Network.isServer))
	{
   		enabled=false;
   	}
	if(Input.GetMouseButtonDown(0) && wepMgr.isCharacter)
	{
		Shoot();
	}
}

function canTakedown(bool: System.Boolean) 
{
	takedownPoss = bool;
}

function Shoot() //just standard weapon stuff, so AI's can use
{
	//deal damage to anyone right in front of you (within 1 m)
		
		if(Physics.Raycast(cam.transform.position, cam.transform.forward, hit)) //returns a hit object
		{
			hitobj = hit.collider.gameObject;
			if(Vector3.Distance(hit.transform.position, cam.transform.position) <= 3)
			{
				var camForward = cam.transform.forward;
				camForward.y = 0;
				if(Vector3.Dot(hit.collider.transform.forward, camForward) > 0.5 && LevelingScript.backstabSkill) //BACKSTAB
				{
					hit.collider.gameObject.SendMessage("OnKnifeHit", 150);
					hit.collider.gameObject.rigidbody.isKinematic = true;
					transform.GetChild(0).animation.Play("stab");
				}
				else
				{
					hit.collider.gameObject.SendMessage("OnKnifeHit", 60);
					hit.collider.gameObject.rigidbody.useGravity = false;
					transform.GetChild(0).animation.Play("slash");
				}
			}
			else
			{
				transform.GetChild(0).animation.Play("slash");
			}
		}
} 