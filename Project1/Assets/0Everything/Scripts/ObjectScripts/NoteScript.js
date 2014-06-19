#pragma strict
var text: String; //the text that the note has
var showGUI: System.Boolean = false;
var player: GameObject;

function Start () 
{
	player = GameObject.FindGameObjectWithTag("CamCollider");
}

function Update () 
{
	if(showGUI)
	{
		if(Input.GetKeyDown(KeyCode.R))
		{
			showGUI = false;
			player.SendMessage("Unlock");
		}
	}
}

function OnGUI() 
{
	if(showGUI)
	{
		GUI.Label(Rect(100,200,500,100), text);
		GUI.Label(Rect(100,300,500,40), "Press R to close message");
	}
}

function Interact()
{
	showGUI = true;
	player.SendMessage("Lock");
}