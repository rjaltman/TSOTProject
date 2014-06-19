#pragma strict
var nextFire: float = 0.0f;
var fireDelay : float;
var shootBullet:float;
var damage: int; //damage per bullet
var prefabBullet:Transform;

var bulletPlace: GameObject; //where the bullets spawn

var clip = 24; //the number of shots you can take before you have to reload
private var maxClips = 10; //the number of clips you can have not loaded
private var ammoInClip: int; //shots in the current clip
private var clipsLeft: int; //the number of clips left
private var reloading = false;

//zoom variables
private var zoomed = false;
private var zoomingIn = false;
private var zoomingOut = false;
var speed: float;
private var zoomPos: Vector3;
private var normalPos: Vector3;

var wepManager: Shooter;

private var canShoot = true;


function Start () 
{
	
	ammoInClip = clip;
	wepManager.SetAmmo(ammoInClip);
	clipsLeft = 2;
	wepManager.SetClip(clipsLeft);
	
	//zoom stuff
	zoomPos = transform.localPosition;// - transform.right * 0.4 - transform.forward * 0.3 + transform.up * 0.1;
	zoomPos.x -= 0.2;
	zoomPos.y += 0.1;
	zoomPos.z -= 0.3;
	normalPos = transform.localPosition;	
}

function OnEnable()
{
	wepManager.SendMessage("SetMuzzle", bulletPlace.transform);
}

function AmmoPickup(clipnum: int)
{
	clipsLeft += clipnum;
	wepManager.SetClip(clipsLeft);
}

function OnGUI()
{
	if(wepManager.isCharacter)
	{
		GUI.Label(new Rect(10, 42, 300, 20),"Ammo: " + ammoInClip + "  Clips: " + clipsLeft);
	}
}

function Update () 
{
	if(Input.GetMouseButton(0))
	{
		if(Time.time>nextFire)
		{
			Shoot();
		}
	}
	else if(Input.GetKeyDown(KeyCode.R))
	{
		Reload();
	}
	if(Input.GetMouseButtonDown(1) && !zoomed)//zoom
	{
		zoomed = true;
		zoomingIn = true;
		zoomingOut = false;
	}
	else if(Input.GetMouseButtonDown(1) && zoomed)//unzoom
	{
		zoomed = false;
		zoomingOut = true;
		zoomingIn = false;
	}
	if(zoomingIn)
	{
		transform.localPosition = Vector3.Lerp(transform.localPosition, zoomPos, speed);
		gameObject.GetComponent(RecoilScript).UpdateLocation(zoomPos);
	}
	else if(zoomingOut)
	{	
		transform.localPosition = Vector3.Lerp(transform.localPosition, normalPos, speed);
		gameObject.GetComponent(RecoilScript).UpdateLocation(normalPos);
	}	
}


function Shoot()
{
	if(canShoot)
	{
		if(ammoInClip > 0) //if there's ammo in the clip
		{
			var bulletPos = bulletPlace.transform.position;
			wepManager.SendMessage("Enable");
			gameObject.GetComponent(GunRiseScript).Shoot();
			ammoInClip -= 1;
			wepManager.SetAmmo(ammoInClip);
			/*
			If the dilator is off
			then use raycasts, and apply damage that way
			If the dilator is on
			BULLET
			*/
			
			if(Time.timeScale == 1)
			{
				var hit2: RaycastHit;
				if(Physics.Raycast(bulletPos, transform.forward, hit2)) //returns a hit object
				{
					if(hit2.rigidbody != null)
					{
						hit2.rigidbody.AddForce(transform.forward * shootBullet);
					}
					hit2.collider.SendMessage("OnBulletHit", damage, SendMessageOptions.DontRequireReceiver);
				}
				//var instanceBullet3 = Instantiate(prefabBullet,transform.position + transform.forward * 1.8 + transform.up * -0.2, transform.rotation);
				//instanceBullet3.rigidbody.AddForce((transform.forward * shootBullet)*(1/Time.timeScale));
				nextFire = Time.time+fireDelay;
			}
			else
			{
				var hit3: RaycastHit;
				if(Physics.Raycast(bulletPos, transform.forward, hit3)) //returns a hit object
				{
						var instanceBullet2 = Instantiate(prefabBullet, bulletPos, transform.rotation);
						instanceBullet2.rigidbody.AddForce((transform.forward * shootBullet)*(1/Time.timeScale));
						nextFire = Time.time+fireDelay;
				}	
			}
			
			if(ammoInClip == 0)
			{
				Reload();	
			}
		}
	}	
}

function Reload()
{
//unzoom
	zoomed = false;
	zoomingOut = true;
	zoomingIn = false;
	//end unzoom
	
	if(!reloading)
	{
		reloading = true;
		if(Time.timeScale == 1)
		{
			yield WaitForSeconds(1);
		}
		else
		{
			yield WaitForSeconds(Time.timeScale * 2);
		}
		if(clipsLeft > 0 && ammoInClip < clip)
		{
			clipsLeft -= 1;
			wepManager.SetClip(clipsLeft);
			ammoInClip = clip;
			wepManager.SetAmmo(ammoInClip);
		}
		reloading = false;
	}
}

function Swap() //called when this weapon is being deactivated
{
	reloading = false;
	//unzoom
	zoomed = false;
	zoomingOut = true;
	zoomingIn = false;
	//end unzoom
}

function Hold(bol: System.Boolean)
{
	if(bol)
	{
		canShoot = false;
		transform.localEulerAngles.x = -30;
	}
	else
	{
		transform.localEulerAngles.x = 0;
		canShoot = true;
	}
}