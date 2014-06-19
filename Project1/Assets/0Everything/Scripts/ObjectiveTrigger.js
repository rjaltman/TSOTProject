#pragma strict
var objectiveName: String;
var objectiveHandler: ObjectiveManager;
var createObjective: System.Boolean;
var completeObjective: System.Boolean;
var completeMessage: String;
private var player: GameObject;
var disableObjects: GameObject[];

function Start () 
{
	player = GameObject.FindGameObjectWithTag("CamCollider");
}

function Update () 
{

}

function OnTriggerEnter(other: Collider)
{
	if(other.tag == "CamCollider")
	{
		if(completeObjective)
		{
			disableAllObjects();
			objectiveHandler.completeObjective(objectiveName, completeMessage);
		}
	}
}

function disableAllObjects()
{
	var temp: int = disableObjects.length;
	for(var i = 0; i < temp; i++)
	{
		disableObjects[i].active = false;
	}
}

function OnTriggerExit(other: Collider)
{
	if(other.tag == "CamCollider")
	{
	
	}
}