#pragma strict
var wepMgr: GameObject;

function Start () {

}

function Update () {

}

function OnTriggerEnter(col: Collider)
{
	if(col.tag != "Bullet")	
	wepMgr.SendMessage("TriggerChanged", true);
}

function OnTriggerExit(col: Collider)
{
	if(col.tag != "Bullet")	
	wepMgr.SendMessage("TriggerChanged", false);
}