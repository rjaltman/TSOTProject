#pragma strict
/* This script either loads the next level when
   the player collides with the object, or just
   when the object starts
*/
var whenColliding: System.Boolean;
var levelString: String;

function Start () 
{
	if(whenColliding == false)
	{
		Application.LoadLevel(levelString);
	}
}

function Update () 
{

}

function OnCollisionEnter( hitObject : Collision )
{
	if(hitObject.gameObject.tag == "CamCollider")
	{
		Application.LoadLevel(levelString);
	}
}