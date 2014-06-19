#pragma strict
var credits: int; //how much money is on the card

function Start () 
{

}

function Update () 
{

}

function OnCollisionEnter( hitObject : Collision )
{
	if(hitObject.gameObject.tag == "CamCollider")
	{
		hitObject.gameObject.SendMessage("addMoney", credits, SendMessageOptions.DontRequireReceiver);
		Destroy(gameObject);
	}
}