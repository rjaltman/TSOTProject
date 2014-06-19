#pragma strict
var myLight: GameObject;
var delayInSecs: int;
var rotateX: int;
var rotateY: int;
var rotateZ: int;
private var flashing: System.Boolean = true;

function Start () 
{
	myLight.GetComponent(Light).enabled = false;
	yield WaitForSeconds(delayInSecs);
	myLight.GetComponent(Light).enabled = !myLight.GetComponent(Light).enabled;
	flash();
}

function Update () 
{
	if(flashing)
	transform.Rotate(Time.deltaTime*rotateX,Time.deltaTime*rotateY,Time.deltaTime*rotateZ, Space.Self);
}

function flash()
{
}
