#pragma strict
var Target: GameObject;
public var isOpen: System.Boolean = true; //stores whether the object is open
var playerPresent: System.Boolean = false;

function Start () 
{
	
}

function Update () 
{
	if(Input.GetKeyDown(KeyCode.E))
	{
		if(playerPresent)
		{
			if(isOpen == true)
			{
				isOpen = false;
				Target.animation["open"].speed = -1;
				Target.animation.Play("open"); //close
				
			}
			else
			{
				isOpen = true;
				Target.animation.Play("open");
				Target.animation["open"].speed = 1; //actually open
				
			}
		}
	}
}

function OnTriggerEnter(other: Collider)
{
	if(other.CompareTag("CamCollider"))
	{
		playerPresent = true;	
	}
}

function OnTriggerExit(other: Collider)
{
	if(other.CompareTag("CamCollider"))
	{
		playerPresent = false;	
	}
}