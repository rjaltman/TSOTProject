#pragma strict
var thecamera: GameObject;
var wepManager: Shooter;
var shootMissile: int; //the force with which to shoot the missile
var clip = 1; //the number of shots you can take before you have to reload
private var maxClips = 200; //the number of clips you can have not loaded
var prefabMissile : Transform;
private var ammoInClip: int; //shots in the current clip
private var clipsLeft: int; //the number of clips left
private var pos: Vector3;
var reloading = false;
var net: GameObject;

//zoom variables
private var zoomed = false;
private var zoomingIn = false;
private var zoomingOut = false;
var speed: float;
private var zoomPos: Vector3;
private var normalPos: Vector3;

private var canShoot = true;

function Start () 
{
	ammoInClip = clip;
	clipsLeft = maxClips;
	pos = transform.parent.localPosition;
	
	zoomPos = transform.localPosition;// - transform.right * 0.4 - transform.forward * 0.3 + transform.up * 0.1;
	zoomPos.x -= 0.2;
	zoomPos.y += 0.1;
	zoomPos.z -= 0.3;
	normalPos = transform.localPosition;
}

function OnGUI()
{
	if(wepManager.isCharacter)
	GUI.Label(new Rect(10, 42, 300, 20),"Ammo: " + ammoInClip + "  Clips: " + clipsLeft);
}

function Update () 
{
	if(net != null)
	{
		if(!net.networkView.isMine && (Network.isClient || Network.isServer))
		{
	   		enabled=false;
	   	}
   	}
	if(Input.GetMouseButtonDown(0)  || Input.GetButtonDown("Fire")) //if the left mouse button is pressed
	{
		if(ammoInClip > 0 && Time.timeScale != 0) //if there's ammo in the clip
		{
			Shoot();
		}
		else if(Time.timeScale!= 0 && ammoInClip == 0)
		{
			Reload();
		}
	}
	if(Time.timeScale!= 0 && ammoInClip == 0 && !reloading)
	{
		Reload();
	}
	if(Input.GetKeyDown(KeyCode.R))
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
	if(canShoot && ammoInClip > 0)
	{
		gameObject.GetComponent(RecoilScript).Shoot();
		ammoInClip -= 1; //subtract one from the ammo in the clip
		var missilepos = transform.position;
		var instanceMissile: Transform;
		if(Network.isClient || Network.isServer)
		{
			instanceMissile = Network.Instantiate(prefabMissile, missilepos + transform.forward * 1.3, transform.rotation, 0);
		}
		else
		{ 
			instanceMissile = Instantiate(prefabMissile, missilepos + transform.forward * 1.3, transform.rotation);
		}
		instanceMissile.rigidbody.AddForce((transform.forward * shootMissile)*(1/Time.timeScale));
		
		//Physics.IgnoreCollision( instanceMissile.collider,thecamera.transform.root.collider );
		
		transform.parent.localPosition = pos;
		if(ammoInClip == 0)
		{
			Reload();
		}
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
		else if(wepManager.isCharacter)
		{
			yield WaitForSeconds(Time.timeScale * 2);
		}
		else
		{
			yield WaitForSeconds(1);
		}
		if(clipsLeft > 0 && ammoInClip < clip)
		{
			clipsLeft -= 1;
			ammoInClip = clip;
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