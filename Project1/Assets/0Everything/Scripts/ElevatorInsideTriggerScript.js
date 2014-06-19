#pragma strict
/*
This script is meant to be placed on a trigger inside the elevator
It signals when someone wants the elevator to move
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
		elevator.SendMessage("moveLift", SendMessageOptions.DontRequireReceiver);
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