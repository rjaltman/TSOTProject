#pragma strict
var prefabPaintBall:Transform;

function Start () 
{
	InvokeRepeating("Shoot",0, 0.2);
}

function Update () 
{
	
}

function Shoot()
{
	var instancePaintball = Instantiate(prefabPaintBall, transform.position + transform.forward * 0.3, transform.rotation);
	instancePaintball.rigidbody.AddForce((transform.forward * 100)*(1/Time.timeScale));
}