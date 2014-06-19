#pragma strict
var firingClip: AudioClip;
var suppressedFire: AudioClip;

var crosshairMgr: Crosshair;

var shootBullet: int; //the force with which to shoot the missile
var wepManager: Shooter;
var clip = 12; //the number of shots you can take before you have to reload
private var maxClips = 10; //the number of clips you can have not loaded
var prefabBullet : Transform;
var damage: int;
var bulletPlace: GameObject; //the bullet spawn point

var bulletHole: Transform;
var makeHoles: System.Boolean = false;

private var ammoInClip: int; //shots in the current clip
private var clipsLeft: int; //the number of clips left
private var pos: Vector3;
private var reloading = false;

var normDeviation: float;
var sightsDeviation: float;

//zoom variables
private var zoomed = false;
var zoomingIn = false;
var zoomingOut = false;
var speed: float;
private var zoomPos: Vector3;
private var normalPos: Vector3;

private var yOffset: float; //offset from the norm
private var yNorm: float; //the normal y

var net: GameObject;
private var canShoot = true;

var yChange = 0.17;
var suppressor = false;
var compensator = false;

var playerCam: CameraTurnJS;

var ammoOrClipsLeftStyle : GUIStyle = new GUIStyle();
var ammoOrClipsSubstyle : GUIStyle = new GUIStyle();

function Start () 
{
	ammoInClip = clip;
	wepManager.SetAmmo(ammoInClip);
	clipsLeft = 2;
	wepManager.SetClip(clipsLeft);
	pos = transform.localPosition;
	
	//zoom stuff
	zoomPos = transform.localPosition;// - transform.right * 0.4 - transform.forward * 0.3 + transform.up * 0.1;
	zoomPos.x -= 0.2;
	zoomPos.y += 0.18;
	yNorm = zoomPos.y;
	zoomPos.z -= 0.3;
	normalPos = transform.localPosition;	
}

function OnEnable()
{
	wepManager.SendMessage("SetMuzzle", bulletPlace.transform);
	wepManager.SetAmmo(ammoInClip);
	wepManager.SetClip(clipsLeft);
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
		/*GUI.Label(new Rect(0, (Screen.height)-20, 150, 50),"AMMO",ammoOrClipsSubstyle);
		GUI.Label(new Rect(150, (Screen.height)-20, 150, 50), "CLIPS",ammoOrClipsSubstyle);
		
		GUI.Label(new Rect(0, (Screen.height)-70, 150, 50),""+ammoInClip,ammoOrClipsLeftStyle);
		GUI.Label(new Rect(150, (Screen.height)-70, 150, 50),""+clipsLeft,ammoOrClipsLeftStyle);*/
	}
}

function Update () 
{
	if(Time.timeScale != 0)
	{
		zoomPos.y = yNorm + yOffset;
		var temp: RaycastHit;
		/*if(Physics.Raycast(transform.parent.position, transform.forward, temp))
		{
			if(crosshairMgr != null)
			crosshairMgr.setPosition(temp.point);
		}*/
		//crosshair is no longer dynamic since bullets are shot from center screen
		
		
	   	if(wepManager.isCharacter)
	   	{
	   		if(!net.networkView.isMine && (Network.isClient || Network.isServer)) //only matters if it's a player
			{
		   		enabled=false;
		   	}
			if((Input.GetMouseButtonDown(0)  || Input.GetButtonDown("Fire")) && Time.timeScale != 0 && !zoomingIn && !zoomingOut) //if the left mouse button is pressed
			{
				Shoot();
			}
			else if(Input.GetKeyDown(KeyCode.R))
			{
				Reload();
			}
			if(Input.GetMouseButtonDown(1) && !zoomed && !reloading)//zoom if not reloading
			{
				crosshairMgr.disableCrosshair();
				if(wepManager.isCharacter)
				playerCam.setSensitivity(0.5);
				zoomed = true;
				zoomingIn = true;
				zoomingOut = false;
			}
			else if(Input.GetMouseButtonDown(1) && zoomed && !reloading)//unzoom if not reloading
			{
				crosshairMgr.enableCrosshair();
				if(wepManager.isCharacter)
				playerCam.resetSensitivity();
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
}



function Shoot()
{
	if(canShoot)
	{
		if(ammoInClip > 0 && !reloading) //if there's ammo in the clip
		{
			if(!suppressor)
			{
				audio.clip = firingClip;
				if(wepManager.isCharacter)
				wepManager.SendMessage("PlayerEnable");
				else
				wepManager.SendMessage("Enable"); //enable muzzle flash
				
			}
			if(suppressor)
			{
				audio.clip = suppressedFire;
			}
			audio.Play();
			gameObject.GetComponent(RecoilScript).Shoot();
			if(!compensator)
			gameObject.GetComponent(GunRiseScript).Shoot();
			zoomingIn = false;
			zoomingOut = false;
			
			ammoInClip -= 1;
			wepManager.SetAmmo(ammoInClip);
			
			var bulletpos = bulletPlace.transform.position;
			transform.GetChild(0).animation.Play("Fire");
			if(wepManager.isCharacter)
				transform.GetChild(0).animation["Fire"].speed = 1/Time.timeScale;
			
			if(Time.timeScale == 1 || wepManager.isCharacter)
			{
				var hit: RaycastHit;
				var deviation: float;
				if(zoomed)
				deviation = sightsDeviation;
				else
				deviation = normDeviation;
				
				var randomX : float = Random.Range(-deviation, deviation);
		    	var randomY : float = Random.Range(-deviation, deviation);
		    	var dir = transform.TransformDirection(randomX,randomY,1);
		    	
				if(Physics.Raycast(transform.parent.position, dir, hit)) //returns a hit object
				{
					if(hit.rigidbody != null)
					{
						hit.rigidbody.AddForce(transform.forward * shootBullet);
					}
					hit.collider.SendMessage("OnBulletHit", damage, SendMessageOptions.DontRequireReceiver);
					if(makeHoles && hit.transform.tag != "Enemy" && hit.transform.tag != "CamCollider")
					{
						var bullethole: Transform = Instantiate(bulletHole, hit.point+(hit.normal * 0.01), Quaternion.LookRotation(hit.normal));
						bullethole.SendMessage("setObj", hit.transform);
					}
					/*instanceBullet2.rigidbody.AddForce((transform.forward * shootBullet * 10)*(1/Time.timeScale));	
					instanceBullet2.collider.isTrigger = true;
					yield WaitForSeconds(0.1);	
					instanceBullet2.collider.isTrigger = false;*/
					
				}
			}
			else
			{
				var instanceBullet: Transform;
				if(Network.isClient || Network.isServer)
				{
					instanceBullet = Network.Instantiate(prefabBullet, bulletpos, transform.rotation, 0);
				}
				else
				{
					instanceBullet = Instantiate(prefabBullet, bulletpos, transform.rotation);
				}
				instanceBullet.rigidbody.AddForce((transform.forward * shootBullet)*(1/Time.timeScale));
				instanceBullet.collider.isTrigger = true;
				yield WaitForSeconds(0.1);	
				instanceBullet.collider.isTrigger = false;
			}
			if(ammoInClip == 0)
			{
				Reload();
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
	if(wepManager.isCharacter)
			playerCam.resetSensitivity();
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
					yield WaitForSeconds(1.67);
					
				}
				else
				{
					yield WaitForSeconds(1.67 * Time.timeScale);
				}
			}
			else
			{
				yield WaitForSeconds(1.67);
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
	if(wepManager.isCharacter)
			playerCam.resetSensitivity();
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

function UsingCompensator() //call if compensator is being used
{
	compensator = true;
	suppressor = false;
}

function UsingSuppressor() //call if silencer is being used
{
	suppressor = true;
	compensator = false;
}

function NoBarrel() //call if no barrel attachment
{
	suppressor = false;
	compensator = false;
}

function UsingReflexSight()
{
	suppressor = false;
	compensator = false;
	yOffset = -0.024;
}

function IronSight()
{
	yOffset = 0;
}

function Slowmo(bool: System.Boolean)
{
	transform.GetChild(0).animation["Reloading"].speed = 1/Time.timeScale;
	transform.GetChild(0).animation["Fire"].speed = 1/Time.timeScale;
}