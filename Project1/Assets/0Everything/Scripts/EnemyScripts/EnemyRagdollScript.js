#pragma strict
var showGUI: System.Boolean = false;
var player: GameObject;
var wepMgr: GameObject;
private var credits: int;
private var clips: int; 


function Start () 
{
	player = GameObject.FindGameObjectWithTag("CamCollider");
	wepMgr = GameObject.FindGameObjectWithTag("WepManager");
}

function OnGUI()
{
	if(showGUI) //only show the GUI if the showGUI boolean is active
	{
		//show three items, weapons, credits, and a randomn item (to be implemented later)
		GUI.Label(new Rect(100, 200, 200, 20), "Inventory: E to take all, R to close");
	}
}

function Update () 
{
	if(showGUI) //the script should only do things if the gui is open
	{
		if(Input.GetKeyDown(KeyCode.E)) //take all the items
		{
		}
		else if(Input.GetKeyDown(KeyCode.R))
		{
			showGUI = false;
			player.SendMessage("Unlock");			
		}
	}
}

function Interact() 
{
	showGUI = true;
	player.SendMessage("Lock"); //this should lock the camera view, disable movement, and disable the GUI
}