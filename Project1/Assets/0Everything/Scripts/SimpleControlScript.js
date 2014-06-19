#pragma strict
// this is a single line comment
/* this is a multi line comment
	it starts with that /* and ends with the */
// to make a variable, say var name: type;
// or say var name; 
// or say var name = value;
//var moveSpeed: int = 0; //Ex. 1, 0, -1
var moveSpeed: float = 0; //Ex. 0, -1.4, 3.145 
var isMoving: System.Boolean = true; //can only be true or false
var lightObject: GameObject; //any game object in Unity


function Start () //this is called once when the object starts
{
	
}

function Update () //this is called every frame
{
	/* if(condition)
	{
		then do stuff
	}	*/
	
	if(Input.GetKeyDown(KeyCode.F))
	{
		if(lightObject.active == false) //a = 2; sets a to be 2. a == 2 asks if a is equal to 2.
		{
			lightObject.active = true;
		}
		else
		{
			lightObject.active = false;
		}
	}
	if(Input.GetKey(KeyCode.W))
	{
		transform.position += transform.forward; //a += b; sets a equal to a + b;
	}
	else if(Input.GetKey(KeyCode.S))
	{
		transform.position -= transform.forward;
	}
	else if(Input.GetKey(KeyCode.D))
	{
	transform.position +=transform.right;
	}
	else if(Input.GetKey (KeyCode.A))
	{
	transform.position -= transform.right;
	}
}