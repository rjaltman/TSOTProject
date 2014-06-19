#pragma strict
/*
Let's do this.
Console shenanignans include communicating with basically every script 
Some important things to do

-infinite dilator
-infinite hp 
-flying
*/
var showing = false;

var cam: GameObject;
var player: GameObject;
var wepMgr: Shooter;
private var camCon: CameraTurnJS;
private var playerCon: GUICamControl;
private var shooter: Shooter; //stores shooter

public var console: String = "";

function Start () 
{
	camCon = cam.GetComponent("CameraTurnJS");
	playerCon = player.GetComponent("GUICamControl");
	shooter = wepMgr.GetComponent("Shooter");
}

function OnGUI () 
{
	if(showing)
	{
		console = GUI.TextField(new Rect(100, 100, 300, 20), console, 100);
		if(GUI.Button(new Rect(200, 120, 100, 20), "Close"))
		{
			//reenable camera turn, hide mouse
			Screen.lockCursor = true;
			Screen.showCursor = false;
			showing = !showing;
			
			camCon.enabled = true;
			playerCon.enabled = true;
			shooter.enabled = true;	
		}
		if(GUI.Button(new Rect(100, 120, 100, 20), "Sumbit"))
		{
			Submit(console);
			console = "";
		}
	}
}

function Update ()
{
	if(Input.GetKeyDown(KeyCode.BackQuote))
	{
		if(showing) //hide
		{
			//reenable camera turn, hide mouse
			Screen.lockCursor = true;
			Screen.showCursor = false;
			showing = !showing;
			
			camCon.enabled = true;
			playerCon.enabled = true;
			shooter.enabled = true;	
		}
		else // show
		{
			//disable camera turn, show mouse
			Screen.lockCursor = false;
			Screen.showCursor = true;
			player.rigidbody.velocity = Vector3(0,0,0);
			camCon.enabled = false;
			playerCon.enabled = false;
			shooter.enabled = false;	
			
			showing = !showing;
		}		
	}
}

function Submit(text: String)
{
	if(text.Equals("flying = true"))
	{
		playerCon.flying = true;
		player.rigidbody.useGravity = false;
	}
	else if(text.Equals("flying = false"))
	{
		playerCon.flying = false;
		player.rigidbody.useGravity = true;
	}
	else if(text.Equals("flying"))
	{
		playerCon.flying = !playerCon.flying;
		player.rigidbody.useGravity = !player.rigidbody.useGravity;
	}
	else if(text.Equals("wep add all"))
	{
		shooter.addAllWeps();
	}
	else if(text.StartsWith("wep add "))
	{
		shooter.addWep(int.Parse(text.Substring(7)));
	}
	
}