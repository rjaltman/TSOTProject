#pragma strict
var objectOn: Transform; //the object the bullethole is on
var wait: int;

function Start () 
{
	if(QualityScript.bulletDecalQuality == 3)
	{
		wait = -1; //NEVER DESTROY IT
	}
	else if(QualityScript.bulletDecalQuality == 2)
	{
		wait = 120; //two minutes
	}
	else if(QualityScript.bulletDecalQuality == 1)
	{
		wait = 30; //destroy in 30 sec
	}
	else if(QualityScript.bulletDecalQuality == 0)
	{
		Destroy(gameObject);
	}
	if(wait != -1)
	TimedDeath();
}

function TimedDeath()
{
	yield WaitForSeconds(wait);
	Destroy(gameObject);
}

function Update () 
{
	
}

function setObj(objIn: Transform)
{
	objectOn = objIn;
	transform.parent = objIn;
}