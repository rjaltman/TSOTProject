#pragma strict
/*
This script moves a door forward and backwards constantly.
There is no delay between the forward and backward motion.

It also kills the player if the door is touched while closing

Note that it moves forward and backward
*/
var opening: System.Boolean;
var closing: System.Boolean;
var moving: System.Boolean = true;
var moveDistance: int = 2;
var moveSpeed: float = 1;
var dist: float = 0;
var player : GameObject;

function Start () 
{
	player = GameObject.FindWithTag("CamCollider");
	opening = true;
}

function Move()
{
	if(opening && dist < moveDistance)
	{
		rigidbody.velocity = transform.forward * moveSpeed;
		//transform.position += transform.forward * moveSpeed * Time.deltaTime;
		dist += moveSpeed * Time.deltaTime;
		//dist += moveSpeed;
	}
	else if(opening)
	{
		opening = false;
		closing = true;
	}
	else if(closing && dist > 0)
	{
		rigidbody.velocity = transform.forward * -moveSpeed;
		//transform.position -= transform.forward * moveSpeed * Time.deltaTime;
		dist -= moveSpeed  * Time.deltaTime;
		//dist -= moveSpeed;
	} 
	else if(closing)
	{
		closing = false;
		opening = true;
	}
}

function Update () 
{
	Move();
}

function OnCollisionEnter( hitObject : Collision )
{
	if(hitObject.gameObject == player && closing)
	{	
		hitObject.collider.SendMessage("Kill", SendMessageOptions.DontRequireReceiver);
	}
}
