#pragma strict
/*
Should be placed on the ladder trigger

on trigger enter
send message on ladder, or something like that

on trigger exit
send message offladder
*/
var player: GameObject;


function Start () 
{
	player = GameObject.FindWithTag("CamCollider");
}

function Update () 
{

}

function OnTriggerEnter(other: Collider)
{
	other.collider.SendMessage("onLadder", null, SendMessageOptions.DontRequireReceiver);
}

function OnTriggerExit(other: Collider)
{
	other.collider.SendMessage("offLadder", null, SendMessageOptions.DontRequireReceiver);
}

function OnTriggerStay(other: Collider)
{
}