#pragma strict
var zoomed = false;
var zoomingIn = false;
var zoomingOut = false;
var speed: float;
private var zoomPos: Vector3;
private var normalPos: Vector3;
var cam: GameObject;
var net: GameObject;
var prefabBullet: Transform;
var shootBullet: int;
var bulletPlace: GameObject;
var hitObj: GameObject;

var playerCam: CameraTurnJS;

var clip = 4; //the number of shots you can take before you have to reload
private var maxClips = 20; //the number of clips you can have not loaded
private var ammoInClip: int; //shots in the current clip
private var clipsLeft: int; //the number of clips left
private var reloading = false;

var wepManager: Shooter;

function Start () 
{	
	ammoInClip = clip;
	wepManager.SetAmmo(ammoInClip);
	clipsLeft = 2;
	wepManager.SetClip(clipsLeft);
	cam.camera.enabled = false;
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
	if(!net.networkView.isMine && (Network.isClient || Network.isServer))
	{
   		enabled=false;
   	}
   	if(Time.timeScale != 0)
   	{
	   	if(Input.GetMouseButtonDown(0))
	   	{
	   		Shoot();
	   	}
	else if(Input.GetKeyDown(KeyCode.R))
	{
		Reload();
	}
		if(Input.GetMouseButtonDown(1) && !zoomed)//zoom
		{
			playerCam.setSensitivity(0.25);
			swapCam(true);
			zoomed = true;
			zoomingIn = true;
			zoomingOut = false;
		}
		else if(Input.GetMouseButtonDown(1) && zoomed)//unzoom
		{
			playerCam.resetSensitivity();
			swapCam(false);
			zoomed = false;
			zoomingOut = true;
			zoomingIn = false;
		}
		if(zoomingIn)
		{
			transform.localPosition = Vector3.Lerp(transform.localPosition, zoomPos, speed);
		}
		else if(zoomingOut)
		{	
			transform.localPosition = Vector3.Lerp(transform.localPosition, normalPos, speed);
		}
	}
}

function swapCam(bool: System.Boolean)
{
	if(bool)
	{
		yield WaitForSeconds(0.45 * Time.timeScale);
		if(zoomed)
		cam.camera.enabled = true;
	}
	else
	{
		cam.camera.enabled = false;
	}
}

function Shoot()
{
	var bulletpos = bulletPlace.transform.position;
	if(ammoInClip > 0) //if there's ammo in the clip
	{
		wepManager.SendMessage("Enable");
	
		ammoInClip -= 1;
		wepManager.SetAmmo(ammoInClip);
		
		gameObject.GetComponent(RecoilScript).Shoot();
		
		if(Time.timeScale == 1)
		{
			var hit: RaycastHit;
			
			if(Physics.Raycast(bulletpos, transform.forward, hit)) //returns a hit object
			{	
				hitObj = hit.collider.gameObject;
				if(hit.rigidbody != null)
				{
					hit.rigidbody.AddForce(transform.forward * shootBullet);
				}
				hit.collider.SendMessage("OnBulletHit", 100, SendMessageOptions.DontRequireReceiver);
			}
			
		}
		else
		{
			var instanceBullet: Transform;
			if(Network.isClient || Network.isServer)
			{
				instanceBullet = Network.Instantiate(prefabBullet, bulletpos + transform.forward * 0.5, transform.rotation, 0);
			}
			else
			{
				instanceBullet = Instantiate(prefabBullet, bulletpos + transform.forward * 0.5, transform.rotation);
			}
			Physics.IgnoreCollision(instanceBullet.collider, net.collider);
			instanceBullet.rigidbody.AddForce((transform.forward * shootBullet)*(1/Time.timeScale));
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

function Reload()
{
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
}