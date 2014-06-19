#pragma strict
/*
One keypad can lock and unlock up to two doors
*/
var showGUI:System.Boolean = false;
var locked = true; //the state of the doors
var passcode: String;
var entercode: String;
var player: GameObject;
var door1: GameObject;
var door2: GameObject; 
private var xDisp: int;
private var yDisp: int;
private var width: int = 150;
private var height: int = 220;


function Start () 
{
	player = GameObject.FindGameObjectWithTag("CamCollider");
	xDisp = Screen.width/2 - width/2;
	yDisp = Screen.height/2 - height/2;
}

function Update () 
{
	if(showGUI)
	{
		if(Input.GetKeyDown(KeyCode.Return))
		{
			EnterPass();
		}
		if(Input.GetKeyDown(KeyCode.R) || Input.GetKeyDown(KeyCode.Escape))
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
		GUI.Label(Rect(0+xDisp,-20+yDisp, 100, 20), "Press R to exit");
		GUI.Label(Rect(0+xDisp,0+yDisp,100,20), "" + entercode);
		if(GUI.Button(Rect(0+xDisp,20+yDisp,50,50), "1"))
		{
			entercode = entercode + "1";
		}
		if(GUI.Button(Rect(50+xDisp,20+yDisp,50,50), "2"))
		{
			entercode = entercode + "2";
		}
		if(GUI.Button(Rect(100+xDisp,20+yDisp,50,50), "3"))
		{
			entercode = entercode + "3";
		}
		if(GUI.Button(Rect(0+xDisp,70+yDisp,50,50), "4"))
		{
			entercode = entercode + "4";
		}
		if(GUI.Button(Rect(50+xDisp,70+yDisp,50,50), "5"))
		{
			entercode = entercode + "5";
		}
		if(GUI.Button(Rect(100+xDisp,70+yDisp,50,50), "6"))
		{
			entercode = entercode + "6";
		}
		if(GUI.Button(Rect(0+xDisp,120+yDisp,50,50), "7"))
		{
			entercode = entercode + "7";
		}
		if(GUI.Button(Rect(50+xDisp,120+yDisp,50,50), "8"))
		{
			entercode = entercode + "8";
		}
		if(GUI.Button(Rect(100+xDisp,120+yDisp,50,50), "9"))
		{
			entercode = entercode + "9";
		}
		if(GUI.Button(Rect(0+xDisp,170+yDisp,50,50), "Clr"))
		{
			entercode = "";
		}
		if(GUI.Button(Rect(50+xDisp,170+yDisp,50,50), "0"))
		{
			entercode = entercode + "0";
		}
		if(GUI.Button(Rect(100+xDisp,170+yDisp,50,50), "Ent"))
		{
			EnterPass();
		}
	}
}

function Interact() 
{
	showGUI = true;
	player.SendMessage("Lock");
}

function EnterPass()
{
	if(entercode.Equals(passcode))
	{
		
		if(locked)
		{
			entercode = "UNLOCKED";	
			locked = false;
			if(door1 != null)
			door1.SendMessage("Unlock");
			if(door2 != null)
			door2.SendMessage("Unlock");
			yield WaitForSeconds(0.5);
			entercode = "";
			showGUI = false;
			player.SendMessage("Unlock");
		}
		else
		{
			entercode = "LOCKED";	
			locked = true;
			if(door1 != null)
			door1.SendMessage("Lock");
			if(door2 != null)
			door2.SendMessage("Lock");
			yield WaitForSeconds(0.5);
			entercode = "";
			showGUI = false;
			player.SendMessage("Unlock");
		}
	}
	else
	{
		entercode = "INCORRECT PASSCODE";
		yield WaitForSeconds(1);
		entercode = "";
	}
}