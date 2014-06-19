#pragma strict
var playerPresent = false;

function Start () {

}

function Update () {

}

function OnTriggerEnter(other: Collider)
{
	if(other.tag == "CamCollider")
	{
		playerPresent = true;
		other.collider.SendMessage("canTakedown", playerPresent);
		other.collider.networkView.RPC("canTakedown", RPCMode.All, playerPresent);
	}
}

function OnTriggerExit(other: Collider)
{
	if(other.tag == "CamCollider")
	{
		playerPresent = false;
		other.collider.SendMessage("canTakedown", playerPresent);
		other.collider.networkView.RPC("canTakedown", RPCMode.All, playerPresent);
	}
}
