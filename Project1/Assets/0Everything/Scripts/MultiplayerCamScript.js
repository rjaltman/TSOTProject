#pragma strict
var net: GameObject;

function Start () 
{
	
}

function Update () 
{
	if(!net.networkView.isMine && (Network.isClient || Network.isServer))
	{
		Debug.Log("Owned by: " + net.networkView.owner);
		gameObject.GetComponent(Camera).enabled = false;
   		enabled=false;
   	}
}
	