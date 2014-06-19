#pragma strict
private var tm : TextMesh;


function Start () 
{
 tm = gameObject.GetComponent(TextMesh);

}

function Update () 
{

}

@RPC
function setUsername(user: String)
{
	tm.text = user;
	networkView.RPC("setUsername", RPCMode.All, user);
}