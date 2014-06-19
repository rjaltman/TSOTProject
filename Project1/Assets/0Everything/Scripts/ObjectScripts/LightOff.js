#pragma strict
var myLight: GameObject;


function Start () 
{
	myLight.GetComponent(Light).enabled = !myLight.GetComponent(Light).enabled;
}

function Update () {

}