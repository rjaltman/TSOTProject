#pragma strict
var player : GameObject;

function Start () 
{
	player = GameObject.FindWithTag("CamCollider");
}

function OnCollisionEnter( hitObject : Collision )
{
	if(hitObject.gameObject == player)
	{	
		hitObject.collider.SendMessage("Kill", SendMessageOptions.DontRequireReceiver);
	}
}

function Update () {

}