#pragma strict
/*
This script is meant to be placed on a trigger outside the elevator
It signals when someone "calls" the elevator, and opens the doors
*/
var elevator: GameObject;
var playerPresent = false;

function Start () 
{

}

function Update () 
{
	if(Input.GetKeyDown(KeyCode.E) || Input.GetButtonDown("Interact"))
	{
		if(playerPresent)
		elevator.SendMessage("openDoors", 0.1, SendMessageOptions.DontRequireReceiver);
	}
}

function OnTriggerEnter(other: Collider)
{
	if(other.tag == "CamCollider")
	{
		playerPresent = true;
	}
}

function OnTriggerExit(other: Collider)
{
	if(other.tag == "CamCollider")
	{
		playerPresent = false;
	}
}