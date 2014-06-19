#pragma strict

var Target: GameObject;
var opening: System.Boolean;
var closing: System.Boolean;
var dist: float = 0;
var speed: float = 0.1;
var xspeed: float = 0.1;
var yspeed: float = 0.1;
var zspeed: float = 0.1;
var maxdist: float = 1;
function Start () 
{

}

function Update () 
{
	if(opening && dist<maxdist*(1/speed))
	{
		Target.transform.Translate(-xspeed * Time.timeScale,-yspeed * Time.timeScale,-zspeed * Time.timeScale);
		dist += Time.timeScale;
	}
	if(closing && dist>0)
	{
		Target.transform.Translate(xspeed * Time.timeScale,yspeed * Time.timeScale,zspeed * Time.timeScale);
		dist -= Time.timeScale;;
	}
	if(dist == 0)
	{
		opening = false;
		closing = false;
	}
}

function OnTriggerEnter(other: Collider)
{
	if(other.tag == "CamCollider")
	{
		opening = true;
		closing = false;
	}
}

function OnTriggerExit(other: Collider)
{
	if(other.tag == "CamCollider")
	{
		opening = false;
		closing = true;
	}
}