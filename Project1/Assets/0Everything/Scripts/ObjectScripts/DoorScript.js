#pragma strict
/* The pickupManager will send a message Interact
*
*/
var opening = false;
var closing = false;
var locked = true;
var reverse = false;
var open = false; //starts closed
var speed: float;
var net: GameObject;
private var yrot: float = 0;
var indicator: GameObject; //the lock indicator
var lockedMat: Material;
var unlockedMat: Material;
var light1: Light;
var light2: Light;
var lockCol: Color;
var unlockCol: Color;

function Start () 
{
	if(reverse)
	speed = speed * -1;
	if(locked)
	{
		indicator.renderer.material = lockedMat;
		light1.color = lockCol;
		light2.color = lockCol;
	}
	else
	{
		indicator.renderer.material = unlockedMat;
		light1.color = unlockCol;
		light2.color = unlockCol;
	}
}

function Update () 
{
	if(opening && yrot < 90)
	{
		 transform.Rotate(Vector3.up * Time.deltaTime * speed);
		 yrot += Time.deltaTime * Mathf.Abs(speed); //mathf.abs accounts for reverse (neg. speed)
	}
	else if(closing  && yrot > 0)
	{
		transform.Rotate(Vector3.up * Time.deltaTime * -speed);
		yrot -= Time.deltaTime * Mathf.Abs(speed);
	}
	else if(opening)
	{
		opening = false;
		open = true;
	}
	else if(closing)
	{
		closing = false;
		open = false;
	}
	
}

@RPC
function Interact()
{
	if(!locked)
	{
		if(Network.isServer || Network.isClient)
		{
			if(networkView.isMine)
			{
				networkView.RPC("Interact", RPCMode.All);
			}
		}
		if(!open && !opening) //if closed, open
		{
			opening = true;
			closing = false;
		}
		else if(open && !closing) //if open, close
		{
			closing = true;
			opening = false;
		}
		else if(!open && opening) //if already opening, close!
		{
			opening = false;
			closing = true;
		}
		else if(open && closing) //if already closing, open!
		{	
			closing = false;
			opening = true;
		}
	}
}

function Lock()
{
	locked = true;
	indicator.renderer.material = lockedMat;
	light1.color = lockCol;
	light2.color = lockCol;
}

function Unlock()
{
	locked = false;
	indicator.renderer.material = unlockedMat;
	light1.color = unlockCol;
	light2.color = unlockCol;
}

function Open()
{
	opening = true;
	closing = false;
	yield WaitForSeconds(5); //wait five seconds and then close the door automatically
	closing = true;
	opening = false;
}