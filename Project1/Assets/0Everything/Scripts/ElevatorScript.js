#pragma strict
/*
This script manages elvators.
It should be able to take you down or up to a
certain floor of a building.
It should be able to take you up or down an amount
and then put you into the next scene.
Or, it should be able to go down and open the doors.
(If the scene starts in the lift)
*/
var moveOpen: System.Boolean; //Set this to true if you want the elevator to simply move
//and then open the doors
var moveLevel: System.Boolean; //Set this to true if you want the elevator to move
//and then switch to the next level
var normalLift: System.Boolean; //this lets the elevator go up and down, 
//good for multiplayer
var levelString: String; //the name of the scene to teleport to, as a string

var moveDistance: float; //the amount the elevator should move (in Unity units, meters)
var moveSpeed: float; //the velocity of the elevator in the y-direction.

var doorLeft: GameObject;
var doorRight: GameObject;
var doorSpeed: float;
var doorMoveDistance: float; //the distance the doors should move

private var distMoved: float = 0; //holds the distance the elevator has moved
var doorDist: float = 0; //holds the distance the doors have each moved
var doorsOpening: System.Boolean = false;
var doorsClosing: System.Boolean = false;
var doorsOpen: System.Boolean = false;
private var move = true;
private var loadLevel = false;
var top = false; //if the lift is at the top

function Start () 
{
	if(moveLevel)
	{
		move = false;
	}
	else if(normalLift)
	{
		move = false;
	}
}

function Update () 
{
	if(distMoved < moveDistance && move)
	{
		//if it's at the top, move neg
		if(top)
		transform.position += transform.up * -moveSpeed * Time.deltaTime;
		else
		transform.position += transform.up * moveSpeed * Time.deltaTime;
		distMoved += Mathf.Abs(moveSpeed * Time.deltaTime);
		if(moveLevel)
		loadLevel = true;
	}
	else if(distMoved > moveDistance && move == true)
	{
		distMoved = 0;
		move = false;
		top = !top;
	}
	else if(moveLevel && loadLevel)
	{
		Application.LoadLevel(levelString);
	}
	else if(normalLift && move == false && doorsOpening == false && doorsOpen == false)
	{
		openDoors(0);
	}
	else if(moveOpen && doorsOpen == false)
	{
		openDoors(1);
	}
	else
	{
		move = false;
	}
	
	if(doorsOpening)
	{
		doorLeft.transform.position -= doorLeft.transform.forward * doorSpeed * Time.deltaTime;
		doorRight.transform.position -= doorRight.transform.forward * doorSpeed * Time.deltaTime;
		doorDist += doorSpeed * Time.deltaTime;
		if(doorDist > doorMoveDistance)
		{
			doorsOpening = false;
			doorsOpen = true;
		}
	}
	else if(doorsClosing)
	{
		doorLeft.transform.position += doorLeft.transform.forward * doorSpeed * Time.deltaTime;
		doorRight.transform.position += doorRight.transform.forward * doorSpeed * Time.deltaTime;
		doorDist -= doorSpeed * Time.deltaTime;
		if(doorDist <= 0.01)
		{
			//doorLeft.transform.localPosition.z = 0.65;
			//doorRight.transform.localPosition.z = -0.65; 
			doorsClosing = false;
			doorsOpen = false;
		}
	}
}

function openDoors(waitTime: float)
{
	yield WaitForSeconds(waitTime);
	doorsOpening = true;
	doorsClosing = false;
	//doorsOpen = true;
}

function closeDoors(waitTime: float)
{
	yield WaitForSeconds(waitTime);
	doorsOpening = false;
	doorsClosing = true;
	//doorsOpen = false;
}

function moveLift()
{
	closeDoors(0);
	yield WaitForSeconds(1);
	move = true;
}