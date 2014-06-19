#pragma strict
private var recoiling = false;
private var backwards = false;
var recoilDistance: float;
var recoilTime: float;
var constLoc = false; //if true, then loc is not changed
private var loc: Vector3;


function Start () 
{
	loc = transform.localPosition;
}

function Update () 
{
	if(recoiling)
	{
		if(backwards)
		 transform.localPosition = Vector3.Lerp(transform.localPosition, loc + Vector3.forward * -recoilDistance, Time.deltaTime*(recoilDistance/recoilTime) * (1/Time.timeScale));
		 else
		  transform.localPosition = Vector3.Lerp(transform.localPosition, loc + Vector3.forward * recoilDistance, Time.deltaTime*(recoilDistance/recoilTime) * (1/Time.timeScale));
	}
	if(Input.GetMouseButtonDown(0) && !recoiling)
	{
		//Shoot();
	}
}

function Shoot() //triggers recoil
{
	if(!recoiling)
	{
		recoiling = true;
		backwards = true;
		yield WaitForSeconds(recoilTime/2 * Time.timeScale);
		backwards = false;
		yield WaitForSeconds(recoilTime/2 * Time.timeScale);
		recoiling = false;
	}
}

function Swap()
{
	transform.localPosition = loc;
	recoiling = false;
	backwards = true;
}

function UpdateLocation(pos : Vector3)//used for iron sights
{
	loc = pos;
}