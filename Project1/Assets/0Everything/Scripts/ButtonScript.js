#pragma strict
var playerPresent = false;
var disableTurret = false;
var turret: TurretScript;
var objectsToDisable: GameObject[];
var objectsToEnable: GameObject[];
var buttonActive = false;
private var turretDist : float;

function Start () 
{

}

function Update () 
{
	if((Input.GetKeyDown(KeyCode.E) || Input.GetButtonDown("Interact")) && !buttonActive && playerPresent)
	{
		if(turret != null)
		{
		turretDist = turret.lookAtDistance;
		turret.lookAtDistance = 0;
		}
		disableObjects();
		enableObjects();
		buttonActive = true;
	}
	else if((Input.GetKeyDown(KeyCode.E) || Input.GetButtonDown("Interact")) && buttonActive && playerPresent)
	{
		if(turret != null)
		{
		turret.lookAtDistance = turretDist;
		}
		disableEnableObjects();
		enableDisableObjects();
		buttonActive = false;
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

function disableObjects()
{
	var temp: int = objectsToDisable.length;
	for(var i = 0; i < temp; i++)
	{
		objectsToDisable[i].active = false;
	}
}

function enableObjects()
{
	var temp: int = objectsToEnable.length;
	for(var i = 0; i < temp; i++)
	{
		objectsToEnable[i].active = true;
	}
}

function enableDisableObjects()
{
	var temp: int = objectsToDisable.length;
	for(var i = 0; i < temp; i++)
	{
		objectsToDisable[i].active = true;
	}
}

function disableEnableObjects()
{
	var temp: int = objectsToEnable.length;
	for(var i = 0; i < temp; i++)
	{
		objectsToEnable[i].active = false;
	}
}