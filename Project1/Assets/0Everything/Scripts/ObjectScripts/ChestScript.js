#pragma strict
/*
Randomly pick an item to be within the chest when the chest is opened
*/
var open: System.Boolean;
var firstOpen: System.Boolean = true; //true if the chest has not been opened yet

function Interact()
{
	if(!open)
	{
	animation.Play("Open");
		if(firstOpen)
		{
			
		}
	}
	else
	{
		animation.Play("Close");
	}
	open = !open;
}

function SpawnItems()
{
}