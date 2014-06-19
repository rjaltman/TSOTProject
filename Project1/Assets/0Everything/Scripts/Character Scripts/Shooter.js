#pragma strict
var thecamera: GameObject;
var zecollider: GameObject;
var prefabMissile:Transform;
var prefabSyringe:Transform;
var shootMissile:float;
var isCharacter: boolean;//whether keyboard input matters, or whether this is AI
var wep: int; //the weapon selected
var holdwep: int; //hold for wep when weps are disabled
var weaponstring: String = "knife";
var zoomed = false;

var numberOfWeps: int; //the number of weapons
var ammoToAdd: int[];
var hasWepArray: System.Boolean[];
var holdingItem: System.Boolean = false;

var wepStyle : GUIStyle = new GUIStyle();


public var fadeOutTexture : Texture2D;
public var fadeSpeed = 0.3;
public var pickupPlace: GameObject;

public var trigger = false;

public var sprinting = false;

private var drawDepth = -1000;
 
private var alpha = 1.0; 
 
private var fadeDir = -1;

var clip: int = -1;
var ammo: int = -1;

var ammoOrClipsLeftStyle : GUIStyle = new GUIStyle();
var ammoOrClipsSubstyle : GUIStyle = new GUIStyle();
 
function fadeIn(){
	fadeDir = -1;	
}
 

function fadeOut(){
	fadeDir = 1;	
}
 


function OnGUI()
{
	if(isCharacter)
	{
		alpha += fadeDir * fadeSpeed * Time.deltaTime;	
		alpha = Mathf.Clamp01(alpha);	
	 	
		GUI.color.a = alpha;
	 
		GUI.depth = drawDepth;
	 	if(alpha != 0)
	 	{
			//GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), fadeOutTexture);
		}
		GUI.color.a = 1;
		
		if(wep != -1)
		GUI.Label(new Rect(0, (Screen.height - 100), 300, 30), weaponstring, wepStyle);
		
		
		if(wep!= -1 && ammo != -1)
		{
			//display ammo
			GUI.Label(new Rect(0, (Screen.height)-20, 150, 50),"AMMO",ammoOrClipsSubstyle);
			GUI.Label(new Rect(150, (Screen.height)-20, 150, 50), "CLIPS",ammoOrClipsSubstyle);
			
			GUI.Label(new Rect(0, (Screen.height)-70, 150, 50),""+ammo,ammoOrClipsLeftStyle);
			GUI.Label(new Rect(150, (Screen.height)-70, 150, 50),""+clip,ammoOrClipsLeftStyle);
		}
	
	}
}

//Make this an RPC function
@RPC
function SelectWeapon(index : int) 
{
	if(wep != index)
	{
		wep = index;
		transform.GetChild(wep).gameObject.SendMessage("Swap", SendMessageOptions.DontRequireReceiver);
		transform.GetChild(wep).gameObject.SetActive(false);
	 	for (var i=0;i<transform.childCount;i++)
	  	{
		  	// Activate the selected weapon
			if (i == index)
			{
				transform.GetChild(i).gameObject.SetActive(true);
				transform.GetChild(i).gameObject.SendMessage("Hold", trigger, SendMessageOptions.DontRequireReceiver);
				
			}
			// Deactivate all other weapons
			else
		  	{
		   		transform.GetChild(i).gameObject.SendMessage("Swap", SendMessageOptions.DontRequireReceiver);
		   		transform.GetChild(i).gameObject.SetActive(false);
		  	}
	  	}
	  	if(index != -1)
	  	{
	  		yield WaitForSeconds(0); //let the script startup to receive the ammopickup call
	  		transform.GetChild(index).gameObject.SendMessage("AmmoPickup", ammoToAdd[index], SendMessageOptions.DontRequireReceiver);
  			ammoToAdd[index] = 0;
  		}
  	}
}

function disableWeps()
{
	holdwep = wep;
	wep = -1;
	for (var i=0;i<transform.childCount;i++)
  	{	
	   	transform.GetChild(i).gameObject.SetActive(false);
  	}
}

function enableWeps()
{
	SelectWeapon(holdwep);
}

function WepPickup(array: int[])
{
	if(hasWepArray[array[0]] == false)
	{
		hasWepArray[array[0]] = true;
		SelectWeapon(array[0]);
	}
	else
	{
		AmmoPickup(array);
	}
}

function addWep(num: int)
{
	hasWepArray[num] = true;
}

function addAllWeps()
{
	for(var i: int = 0; i < hasWepArray.Length; i++)
	{
		hasWepArray[i] = true;
	}
}

function Start () 
{


	alpha=1;
	fadeIn();
	if(wep == -1)
	{
		disableWeps();
	}
	if(wep == 0 && hasWepArray[0])
	{
		weaponstring = "KNIFE";
		SelectWeapon(0);
	}
	else if(wep == 1 && hasWepArray[1])
	{
		weaponstring  = "PISTOL";
		SelectWeapon(1);
	}
	else if(wep == 2 && hasWepArray[2])
	{
		weaponstring = "SHOTGUN";
		SelectWeapon(2);
	}
	else if(wep == 3 && hasWepArray[3])
	{
		weaponstring = "ASSAULT RIFLE";
		SelectWeapon(3);
	}
	else if(wep == 4 && hasWepArray[4])//ze machine gun
	{
		weaponstring = "SIPER RIFLE";
		SelectWeapon(4);
	}
}

function AmmoPickup(data: int[])
{
	if(wep == data[0])
	{
		transform.GetChild(wep).gameObject.SendMessage("AmmoPickup", data[1]);
	}
	else
	{
		var temp: int = data[1];
		ammoToAdd[data[0]] += temp;
	}
}

function Update () 
{
	var mine = true; 
	if(Network.isServer || Network.isClient)
	{
		mine = networkView.isMine;
	}
	if(Time.timeScale != 0 && isCharacter && mine) //if the game is not paused and this is not an AI
	{
		if(Input.GetButtonDown("Interact"))
		{
			if(holdingItem) //re-enable all the weps
			{
				SelectWeapon(wep);
				holdingItem = false;
			}
			var hit: RaycastHit;
			if(Physics.Raycast(pickupPlace.transform.position + transform.forward * -0.5, transform.forward, hit)) //returns a hit object
			{
				if(hit.rigidbody) //if there is a rigidbody on this object
				{
					if(Vector3.Distance (pickupPlace.transform.position, hit.transform.position) < 4 
						&& hit.rigidbody.mass <= 10 && hit.collider.tag != "Enemy")//if dist<less than 4 meters
					{
						disableWeps();
						holdingItem = true;
					}
				}
			}
		}
		if(Input.GetButtonDown("Fire")) //if the left mouse button is pressed
		{
			if(holdingItem)
			{
				SelectWeapon(wep);
				holdingItem = false;
			}
		}
		
		if(Input.GetKeyDown("0"))
		{
			if(Network.isClient || Network.isServer)
			networkView.RPC("SelectWeapon", RPCMode.All, 0);
			else
			SelectWeapon(0);
			
			wep = 0;
			weaponstring = "KNIFE";
		}
		else if(Input.GetKeyDown("1") && hasWepArray[1])
		{
			if(Network.isClient || Network.isServer)
			networkView.RPC("SelectWeapon", RPCMode.All, 1);
			else
			SelectWeapon(1);
			wep = 1;
			weaponstring = "PISTOL";
		}
		else if(Input.GetKeyDown("2") && hasWepArray[2])
		{
			if(Network.isClient || Network.isServer)
			networkView.RPC("SelectWeapon", RPCMode.All, 2);
			else
			SelectWeapon(2);
			wep = 2;
			weaponstring = "SHOTGUN";
		}
		else if(Input.GetKeyDown("3") && hasWepArray[3])
		{
			if(Network.isClient || Network.isServer)
			networkView.RPC("SelectWeapon", RPCMode.All, 3);
			else
			SelectWeapon(3);
			wep = 3;
			weaponstring = "ASSAULT RIFLE";
		}
		else if(Input.GetKeyDown("4") && hasWepArray[4])
		{
			if(Network.isClient || Network.isServer)
			networkView.RPC("SelectWeapon", RPCMode.All, 4);
			else
			SelectWeapon(4);
			wep = 4;
			weaponstring = "SNIPER RIFLE";
		}
		
		//------------------Code for Zooming Out------------
		/*if (Input.GetAxis("Mouse ScrollWheel") <0)
		{
		   if (thecamera.camera.fieldOfView <= 70)
		   		thecamera.camera.fieldOfView += 20;
		}

		//----------------Code for Zooming In-----------------------
    	if (Input.GetAxis("Mouse ScrollWheel") > 0)
 		{
    		if (thecamera.camera.fieldOfView > 20)
    			thecamera.camera.fieldOfView -= 20;
    	}*/
	}
	
}

function OnPlayerConnected(player: NetworkPlayer) 
{
	networkView.RPC("SelectWeapon", RPCMode.All, wep);
}

function TriggerChanged(bool: System.Boolean) 
{
	//This is for weapons to be disabled and tilt up 
	//when the player is close to a wall
	if(bool) //enter
	{
		trigger = true;
		if(wep != -1)
		transform.GetChild(wep).SendMessage("Hold", true, SendMessageOptions.DontRequireReceiver);	
	}
	else // exit
	{
		trigger = false;
		if(wep != -1)
		transform.GetChild(wep).SendMessage("Hold", false, SendMessageOptions.DontRequireReceiver);	
	}
}

function Sprinting(bool: System.Boolean)
{
	if(bool)
	{
		sprinting = true;
		if(wep != -1)
		transform.GetChild(wep).SendMessage("Sprinting", true, SendMessageOptions.DontRequireReceiver);
	}
	else
	{
		sprinting = false;
		if(wep != -1)
		transform.GetChild(wep).SendMessage("Sprinting", false, SendMessageOptions.DontRequireReceiver);
	}
}

function Shoot() // used by AIs to fire their current weapon
{
	transform.GetChild(wep).SendMessage("Shoot", true, SendMessageOptions.DontRequireReceiver);
}

function Slowmo(bool: System.Boolean) //used to change animation speed when the dilator is enabled or disabled
{
	if(wep != -1)
	transform.GetChild(wep).SendMessage("Slowmo", false,  SendMessageOptions.DontRequireReceiver);	
}

function SetAmmo(inp: int)
{
	ammo = inp;
}

function SetClip(inp: int)
{
	clip = inp;
}