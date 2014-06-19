#pragma strict
var onGround: System.Boolean;
var intersects: int;
var temp: System.Boolean;
//the floorcollider must ignore pickups or other objects that will move, as they interfere with floor detection

function OnTriggerEnter()
{
	onGround = true;
	intersects++;
	transform.parent.SendMessage("OnGround", true);
}

function OnTriggerExit()
{
	onGround = false;
	intersects--;
	if(intersects == 0)
	transform.parent.SendMessage("OnGround", false);
}

function Update()
{
	if(temp)
	transform.parent.SendMessage("OnGround", true);
	else
	transform.parent.SendMessage("OnGround", false);
	temp = false;	
}

function OnTriggerStay()
{
	temp = true;
	
}