#pragma strict
/* The objective manager should manage objectives
and lead you to them 
The first objective to code, go to the test lab

There should be an arraylist of variables`*/
var objectiveStatus : System.Boolean[]; //stores whether objectives are completed
var objectives : String[];
private var showingAlert = false;
private var displayMessage: String;

function OnGUI()
{
	if(showingAlert)
	{
		GUI.Label(new Rect(10, 75, 300, 20),displayMessage);
	}
}

function Start () 
{
	//if(EditorApplication.currentScene == "level1")
	//{
		objectives[0] = "goToTestLab";
		objectiveStatus[0] = false;
		objectives[1] = "completedTests";
		objectiveStatus[1] = false;
	//}
}

function Update () 
{

}

//function addObjective

function completeObjective(name: String, message: String)
{
	if(objectiveStatus[objectiveIndex(name)] == false)
	{
		objectiveStatus[objectiveIndex(name)] = true;
		displayMessage = message;
		showingAlert = true;
		yield WaitForSeconds(2);
		showingAlert = false;
	}
}

function objectiveIndex(nameIn: String)
{
	var temp: int = 0;
	for(var i = 0; i < objectives.Length; i++)
	{
		if(objectives[i] == nameIn)
		{
			temp = i;
		}
	}
	return temp;
}