#pragma strict
/*
Variables:
The target (should not be assumed to be player)
Boolean targetIsPlayer (for ease)
Fire rate (the time, in sec between firing)
Rotation speed 
Prefab bullet

Methods

shoot - fires bullet


*/
var lookAtDistance = 15.0;
var forwardDistance: float;
var barrel: GameObject;
var spinSpeed: float;
var distance: float;
var findTarget : Transform; //Target to be aimed at
var ammoPrefab : Transform; //Projectile/Ammo from Turret
private var fireCycle : float; //Tells Unity When to fire
var fireDelay : float; //Fire Delay
var damp: float;
var muzzleFlare: GameObject; //gets turned on and off

function Start()
{
	muzzleFlare.active = false;
}

function Update() 
{
	
	distance = Vector3.Distance(findTarget.transform.position, transform.position);
	
	if(distance < lookAtDistance)
	{
		//Follows target
		var rotate = Quaternion.LookRotation(findTarget.position - transform.position); 
        transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * damp); 
		barrel.transform.localEulerAngles.z += spinSpeed * Time.deltaTime;
		/*var temp: int = barrelItems.length;
		for(var i = 0; i < temp; i++)
		{
			barrelItems[i].transform.localRotation.x += spinSpeed * Time.deltaTime;
		}*/
	}
	
	//Check if Turret can fire
	
	if(Time.time > fireCycle && distance < lookAtDistance)
	{
	
		//Fire
		
		shoot();
		//Update Firing Time
		
		fireCycle = Time.time + fireDelay;
		
	
	}
	
	if(muzzleFlare.active && Time.timeScale == 0.1)
	{
		muzzleFlare.light.intensity -= 10 * Time.deltaTime;
	}

}

//Turret Fires

function shoot()
{
	
	var ammo = Instantiate(ammoPrefab,transform.position + transform.forward * forwardDistance, transform.rotation);
	ammo.rigidbody.AddForce(transform.forward * 500);
	muzzleFlare.active = true;
	muzzleFlare.light.intensity = 1;
		yield WaitForSeconds(0.09);
	muzzleFlare.active = false;

}