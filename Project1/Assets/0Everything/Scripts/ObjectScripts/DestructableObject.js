#pragma strict
var totalHP:int = 10;
var HP:int;


function Start () 
{
	HP = totalHP;
}

function Update () 
{
	if(HP <= 0)
	{
		Destroy( gameObject );
	}
}

function OnBulletHit(damage:int)
{
	HP -= damage;
}

function OnMissileHit(damage:int)
{
	HP -= damage;
}