#pragma strict
var showGUI: System.Boolean = false;
//var numSlots: int; //how many slots do you 
var columns: int; //how many columns there are
public var width: int;
public var height: int;
private var firstX: int;
private var firstY: int;
private var lastX: int;

var player: GameObject;

var selGridInt : int = 0;
var selStrings : String[];
private var items: Item[];

function Start () 
{	
	//center the grid by using the width and height
	firstX = (Screen.width - width)/2;
	firstY = (Screen.height - height)/2;
	lastX = firstX + width;
	
	items = new Item[selStrings.Length]; //initialize the item array
	
	for(var temp: String in selStrings)
	{
		temp = "Empty";
	}
}

function OnGUI()
{
	if(showGUI)
	{
		selGridInt = GUI.SelectionGrid (Rect (firstX, firstY, width, height), selGridInt, selStrings, columns);
		GUI.Button(Rect(lastX + 10, firstY, 200, 60), "Use");
		GUI.Button(Rect(lastX + 10, firstY+60, 200, 60), "Drop");
	}
}

function Update () 
{
	if(Input.GetKeyDown(KeyCode.I))
	{
		if(showGUI)
		{
			showGUI = false;
			player.SendMessage("Unlock", SendMessageOptions.DontRequireReceiver);
		}
		else
		{
			showGUI = true;
			player.SendMessage("Lock", SendMessageOptions.DontRequireReceiver);
		}
	}
}

public class Item
{
	var id: int; //the id number
	var name: String; //what's this thing called? I HAVE NO IDEA
	var gameObj: GameObject; //so it can spawn that shit
	
	function Item(id_in: int, namein: String, obj: GameObject)
	{
		id = id_in;
		name = namein;
		gameObj = obj;
	}
}