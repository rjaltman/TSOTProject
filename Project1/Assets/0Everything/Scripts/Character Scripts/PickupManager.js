#pragma strict
var holdingObject: System.Boolean = false;
public var heldObject: RaycastHit;
public var grav: System.Boolean;
var hitObj: Transform;
var ragdoll : GameObject;

/*
Add target object to child hierarchy 
Disable physics for the target obj.
Thus, as the camera moves the camera
moves, the held object moves
*/ 

/* 
To Do:

-Allow for throwing. When the left mouse button is pressed, throw object
-Fix rigidbody mechanics and collider
*/
function Start () 
{

}

function OnGUI () 
{
	GUI.Label(Rect(Screen.width/2,Screen.height/2, 1, 1),"a");
}

function Update () 
{
	if(holdingObject && heldObject.transform != null)
	{
		var dir: Vector3 = heldObject.transform.position - transform.position;
		dir = Vector3.Normalize(dir);
		var dist = Vector3.Distance(heldObject.transform.position, transform.position);
		if(dist > .1)
		{
			heldObject.transform.LookAt(transform.position);
			heldObject.rigidbody.velocity = heldObject.transform.forward*dist*15*1/Time.timeScale;
			//heldObject.rigidbody.AddForce((heldObject.transform.forward * dir.z + heldObject.transform.up * dir .y + heldObject.transform.right * dir.x)* 100);
		}
		else if(dist < 0.1)
		{
			//heldObject.transform.position = transform.position;
			heldObject.rigidbody.velocity = heldObject.transform.forward * 0;
			heldObject.rigidbody.angularVelocity = Vector3(0,0,0);
		}
	}
	else if(holdingObject && heldObject.transform == null)
	{
		holdingObject = false;
	}
	
	if(Input.GetKeyDown(KeyCode.E) || Input.GetButtonDown("Interact"))//if the e key is pressed
	{
		if(!holdingObject) // if not holding object
		{
			var hit: RaycastHit;
			if(Physics.Raycast(transform.position + transform.forward * -0.5, transform.forward, hit)) //returns a hit object
			{
				if(Vector3.Distance (transform.position, hit.transform.position) < 4)
				{
					hitObj = hit.transform;
					hit.transform.SendMessage("Interact", SendMessageOptions.DontRequireReceiver);
				}
				if(hit.rigidbody != null) //if there is a rigidbody on this object
				{
					if(Vector3.Distance (transform.position, hit.transform.position) < 2
						&& hit.rigidbody.mass <= 10 && hit.transform.tag != "Enemy")//if dist<less than 4 meters
					{
						holdingObject = true;
						heldObject = hit;
						grav = hit.rigidbody.useGravity;
						hit.rigidbody.useGravity = false;
					}
				}
				if(hit.transform.tag == "Enemy")
				{
					ragdoll = hit.transform.gameObject;
					//find the parent of it all
					while(!ragdoll.name.Contains("Ragdoll")) //if it's not it, find it
					{
						ragdoll = ragdoll.transform.parent.gameObject;
					}
					ragdoll.SendMessage("Interact");
				}
			}
		}
		else if(heldObject != null) //let go of object
		{
			//transform.parent.parent.rigidbody.detectCollisions = false;
			//Physics.IgnoreCollision(transform.parent.parent.collider, heldObject.collider, false);
			holdingObject = false;
			heldObject.rigidbody.isKinematic = false;
			heldObject.rigidbody.useGravity = grav;
			heldObject.transform.parent = null;
		}
	}
	else if((Input.GetMouseButtonDown(0)  || Input.GetButtonDown("Fire")) && holdingObject == true && heldObject != null) //if the left mouse button is pressed
	{
		//throw the object, if there is a held object
		holdingObject = false;
		heldObject.rigidbody.isKinematic = false;
		heldObject.rigidbody.useGravity = grav;
		heldObject.transform.parent = null;
		heldObject.rigidbody.AddForce(transform.forward * 500 * 1/Time.timeScale);
	}
	else if(Input.GetMouseButtonDown(1) && holdingObject && heldObject != null)//if the right mouse button is pressed
	{
		//drop the object if there is a held object
		holdingObject = false;
		heldObject.rigidbody.isKinematic = false;
		heldObject.rigidbody.useGravity = grav;
		heldObject.transform.parent = null;
	}
	
}