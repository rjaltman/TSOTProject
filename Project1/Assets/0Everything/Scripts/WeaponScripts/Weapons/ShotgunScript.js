
#pragma strict
var firingClip: AudioClip;
var pumpingClip: AudioClip;

var crosshairMgr: Crosshair;

var prefabBullet: Transform;
var shootBullet: int;

var clip = 2; //the number of shots you can take before you have to reload
private var maxClips = 20; //the number of clips you can have not loaded
private var ammoInClip: int; //shots in the current clip
private var clipsLeft: int; //the number of clips left
private var reloading = false;

var wepManager: Shooter;
var pelletSpawn: GameObject; //where te stuff spawns

var bulletHole: Transform;
var makeHoles: System.Boolean = false;

//zoom variables
private var zoomed = false;
private var zoomingIn = false;
private var zoomingOut = false;
var speed: float;
private var zoomPos: Vector3;
private var normalPos: Vector3;

private var canShoot = true;

var ammoOrClipsLeftStyle : GUIStyle = new GUIStyle();
var ammoOrClipsSubstyle : GUIStyle = new GUIStyle();

function Start () 
{
	ammoInClip = clip;
	wepManager.SetAmmo(ammoInClip);
	clipsLeft = 20;
	wepManager.SetClip(clipsLeft);
	
	zoomPos = transform.localPosition;// - transform.right * 0.4 - transform.forward * 0.3 + transform.up * 0.1;
	zoomPos.x -= 0.2;
	zoomPos.y += 0.1;
	zoomPos.z -= 0.3;
	normalPos = transform.localPosition;	
}

function OnEnable()
{
	wepManager.SendMessage("SetMuzzle", pelletSpawn.transform);
	wepManager.SetAmmo(ammoInClip);
	wepManager.SetClip(clipsLeft);
}

function AmmoPickup(clipnum: int)
{
	clipsLeft += clipnum;
	wepManager.SetClip(clipsLeft);
}

function Update () 
{
	var temp: RaycastHit;
	if(Physics.Raycast(pelletSpawn.transform.position, transform.forward, temp))
	{
		if(crosshairMgr != null)
		crosshairMgr.setPosition(temp.point);
	}
	if(wepManager.isCharacter)
	{
		if(Input.GetMouseButtonDown(0) && Time.timeScale != 0) //shotgun
		{
			Shoot();
		}
		else if(Input.GetKeyDown(KeyCode.R))
		{
			Reload();
		}
		if(Input.GetMouseButtonDown(1) && !zoomed)//zoom
		{
			crosshairMgr.disableCrosshair();
			zoomed = true;
			zoomingIn = true;
			zoomingOut = false;
		}
		else if(Input.GetMouseButtonDown(1) && zoomed)//unzoom
		{
			crosshairMgr.enableCrosshair();
			zoomed = false;
			zoomingOut = true;
			zoomingIn = false;
		}
	}
	if(zoomingIn)
	{
		transform.localPosition = Vector3.Lerp(transform.localPosition, zoomPos, speed);
		gameObject.GetComponent(RecoilScript).UpdateLocation(zoomPos);
		if((transform.localPosition-zoomPos).magnitude < 0.02)
		{
			zoomingIn = false;
			transform.localPosition = zoomPos;
		}
		
	}
	else if(zoomingOut)
	{	
		transform.localPosition = Vector3.Lerp(transform.localPosition, normalPos, speed);
		gameObject.GetComponent(RecoilScript).UpdateLocation(normalPos);
		if((transform.localPosition-normalPos).magnitude < 0.02)
		{
			zoomingOut = false;
			transform.localPosition = normalPos;
		}
	}	
	
}

function Shoot()
{
	if(canShoot)
	{
		if(ammoInClip > 0) //if there's ammo in the clip
		{
			if(wepManager.isCharacter)
				wepManager.SendMessage("PlayerEnable");
			else
				wepManager.SendMessage("Enable"); //enable muzzle flash
			ammoInClip -= 1;
			wepManager.SetAmmo(ammoInClip);
			gameObject.GetComponent(RecoilScript).Shoot();
			gameObject.GetComponent(GunRiseScript).Shoot();
			audio.clip = firingClip;
			audio.Play();
			//Let's create a spread system.
			//First spawn a number of pellets
			//These MUST not be bullets, so change that later
			var pelletpos = pelletSpawn.transform.position;
			var bulletsToSpawn = 16;
			
			
			var bulletList: Transform[] = new Transform[bulletsToSpawn];
			for(var i = 0; i < bulletsToSpawn; i++)
			{
				var randomX : float = Random.Range(-0.1,0.1);
		    	var randomY : float = Random.Range(-0.1,0.1);
		    	var dir = transform.TransformDirection(randomX,randomY,1);
		    	
		    	if(Time.timeScale == 1 || (wepManager.isCharacter))
		    	{
			    	var hit: RaycastHit;
					if(Physics.Raycast(transform.parent.position, dir, hit)) //returns a hit object
					{
						if(hit.rigidbody != null)
						{
							hit.rigidbody.AddForce(dir * shootBullet);
						}
						hit.collider.SendMessage("OnBulletHit", 10, SendMessageOptions.DontRequireReceiver);
						if(makeHoles && hit.transform.tag != "Enemy" && hit.transform.tag != "CamCollider")
						{
							var bullethole: Transform = Instantiate(bulletHole, hit.point+(hit.normal * 0.01), Quaternion.LookRotation(hit.normal));
							bullethole.SendMessage("setObj", hit.transform);
						}
			    	}
		    	}
		    	else if(wepManager.isCharacter == false) //only do slowmo if it's a bot
		    	{
			    	var instancePellet: Transform;
					if(Network.isClient || Network.isServer)
					{
						instancePellet = Network.Instantiate(prefabBullet, pelletpos, transform.rotation, 0);
					}
					else
					{
						instancePellet = Instantiate(prefabBullet, pelletpos, transform.rotation);
					}
					//bulletList.push(instancePellet);
					bulletList[i] = instancePellet;
					instancePellet.collider.isTrigger = true;
					instancePellet.rigidbody.AddForce((dir * shootBullet)*(1/Time.timeScale));
				}
				//instancePellet.collider.isTrigger = false;
			}
			
			if(Time.timeScale != 1 && wepManager.isCharacter == false)
			{
				yield WaitForSeconds(0.03);
				for(var y = 0; y < bulletList.length; y++)
				{
					bulletList[y].collider.isTrigger = false;
				}
			}
			if(ammoInClip == 0)	
			{
				Reload();
			}
			else
			{
				canShoot = false; //prevent from firing
				if(wepManager.isCharacter)
				yield WaitForSeconds(0.5 * Time.timeScale);
				else
				yield WaitForSeconds(0.5);
				transform.FindChild("shotgun").animation.Play("Pumping");
				
				if(wepManager.isCharacter)
				{
					transform.GetChild(0).animation["Pumping"].speed = 1/Time.timeScale;
					yield WaitForSeconds(0.25 * Time.timeScale); //wait till the sound should be played
					audio.clip = pumpingClip;
					audio.Play();
					yield WaitForSeconds(1 * Time.timeScale);
					
				}
				else
				{
					yield WaitForSeconds(1);
				}
				canShoot = true;
			}
		}
		else if(Time.timeScale!= 0 && ammoInClip == 0 && !reloading)
		{
			Reload();
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
		if(clipsLeft > 0 && ammoInClip < clip)
		{
			transform.GetChild(0).animation.Play("Reloading");
			
			if(wepManager.isCharacter)
			{
				transform.GetChild(0).animation["Reloading"].speed = 1/Time.timeScale;
				
				if(Time.timeScale == 1)
				{
					yield WaitForSeconds(1);
					
				}
				else
				{
					yield WaitForSeconds(1 * Time.timeScale);
				}
			}
			else
			{
				yield WaitForSeconds(1);
			}
			clipsLeft -= 1;
			wepManager.SetClip(clipsLeft);
			ammoInClip = clip;
			wepManager.SetAmmo(ammoInClip);
		}
		reloading = false;
		crosshairMgr.enableCrosshair();
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

function Slowmo()
{
	transform.GetChild(0).animation["Reloading"].speed = 1/Time.timeScale;
	transform.GetChild(0).animation["Pumping"].speed = 1/Time.timeScale;
}
