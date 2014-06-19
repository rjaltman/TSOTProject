#pragma strict
var inMenu: System.Boolean = false;

var cam: GameObject; //player cam
var player: GameObject; //zecollider
var wepMgr: Shooter;
private var camCon: CameraTurnJS;
private var playerCon: GUICamControl;
private var wepPos: Vector3; //stores the original location of the wep
private var wepRot: Quaternion; //stores the orginal rotation of the wep
private var selectedWep: int = 1;
var wep: GameObject; //stores the currently modified wep
private var shooter: Shooter; //stores shooter

//GUI Stuff
private var optics: Transform;
private var opticsSel: int = 0; //stores the optics unit selected
private var opticsOptions : String[];

private var barrel: Transform;
private var barrelSel: int = 0; //stores the barrel unit selected
private var barrelOptions: String[];

private var underBarrel: Transform;
private var uBarrelSel: int = 0; //stores the underbarrel unit selected;
private var uBarrelOptions: String[];

var RotationSpeed: float;

function Start () 
{
	camCon = cam.GetComponent("CameraTurnJS");
	playerCon = player.GetComponent("GUICamControl");
	shooter = wepMgr.GetComponent("Shooter");
}

function OnGUI()
{
	if(inMenu)
	{
		//replaceable part categories - Optics, barrel
		if(opticsOptions != null)
		{
			GUI.Label(Rect(100,100,500,100),"Optics");
			opticsSel = GUI.SelectionGrid(Rect(100,120,200,100), opticsSel, opticsOptions, 1);
		}
		if(barrelOptions != null)
		{
			GUI.Label(Rect(100,300,500,100),"Barrel");
			barrelSel = GUI.SelectionGrid(Rect(100,320,200,100), barrelSel, barrelOptions, 1);
		}
		if(uBarrelOptions != null)
		{
			GUI.Label(Rect(Screen.width -300,100,500,100),"Under Barrel");
			uBarrelSel = GUI.SelectionGrid(Rect(Screen.width - 300,120,200,100), uBarrelSel, uBarrelOptions, 1);
		}
		
		//toggle1 = GUI.Toggle(Rect(110,120,100,20),toggle1,"Reflex");
	}
}

function Update () 
{
	if(Input.GetMouseButton(0) && inMenu)
	 wep.transform.RotateAround(wep.transform.position, cam.transform.up, Input.GetAxis("Mouse X") * RotationSpeed * Time.deltaTime); 
	 //Rotate(0, (Input.GetAxis("Mouse X") * RotationSpeed * Time.deltaTime), 0, Space.World);

	if(Input.GetButtonUp("WepCust"))
	{
		if(!inMenu && Mathf.Abs(player.rigidbody.velocity.y) < 0.1) //make sure the player isn't falling
		{
			//enter wep customization 
			
			//find the current weapon
			selectedWep = shooter.wep;
			
			if(selectedWep != -1) //make sure the player has a wep out
			{
				//unlock cursor
				Screen.lockCursor = false;
				Screen.showCursor = true;
				
				//unzoom the gun if it's zoomed, stop reload, that stuff
				wep = wepMgr.transform.GetChild(selectedWep).gameObject;
				wep.SendMessage("Swap");
				
				//disable camera look, disable movement, and bring the guns to center screen
				player.rigidbody.velocity = Vector3(0,0,0);
				camCon.enabled = false;
				playerCon.enabled = false;
				shooter.enabled = false;
				
			
				//select the weapon and set wep to the weapon
				SelectWeapon(selectedWep);
				
				
				//disable all scripts on the target weapon, which includes the 
				//weapon script, recoil script, and anything else on the weapon
				var scripts : Component[] = wep.GetComponents(MonoBehaviour);
		       	for (var script: Component in scripts) 
		       	{
		       		var temp = script as MonoBehaviour;
		        	temp.enabled = false;
		       	}
		       	
		       	//set the old positions, so we can reset the position and rotation
				wepPos = wep.transform.localPosition;
				wepRot = wep.transform.localRotation;
				
				//now align the chosen weapon in the right place
				wep.transform.localPosition.z = 1.5;
				wep.transform.localPosition.x = 0.1;
				wep.transform.localPosition.y = -0.2;
				wep.transform.localEulerAngles.y = -50;
				wep.transform.localEulerAngles.x = -20;
				
				//find barrel and optics, the root of the optics and barrels stuff
				var children: Component[] = wep.GetComponentsInChildren(Transform);
				//reset from any old weapon
				optics = null;
				barrel = null;
				underBarrel = null;
				for (var child: Component in children)
				{
					var childTrans = child as Transform;
					if(child.name.Equals("Optics"))
					{
						optics = child;
						
					}
					else if(child.name.Equals("Barrel"))
					{
						barrel = child;
					}
					else if(child.name.Equals("UnderBarrel"))
					{
						underBarrel = child;
					}
				}
				
				//replace _ with spaces and set all the options
				if(optics == null)
				{
					opticsOptions = null;
				}
				else
				{
					opticsOptions = new String[optics.transform.childCount];
					for(var i = 0; i < optics.transform.childCount; i++)
					{
						opticsOptions[i] = optics.transform.GetChild(i).name.Replace('_',' ');
						if(optics.transform.GetChild(i).active == true)
						{
							opticsSel = i;
						}
					}
				}
				if(barrel == null)
				{
					barrelOptions = null;
				}
				else
				{
					barrelOptions = new String[barrel.transform.childCount];
					for(var q = 0; q < barrel.transform.childCount; q++)
					{
						barrelOptions[q] = barrel.transform.GetChild(q).name.Replace('_',' ');
						if(barrel.transform.GetChild(q).active == true)
						{
							barrelSel = q;
						}
					}
				}
				
				if(underBarrel == null)
				{
					uBarrelOptions = null;
				}
				else
				{
					uBarrelOptions = new String[underBarrel.transform.childCount];
					for(var u = 0; u < underBarrel.transform.childCount; u++)
					{
						uBarrelOptions[u] = underBarrel.transform.GetChild(u).name.Replace('_',' ');
						if(underBarrel.transform.GetChild(u).active == true)
						{
							uBarrelSel = u;
						}
					}
				}
				
				//menu loaded
				inMenu = true;
			}
		}
		else
		{
			//exit wep customization
			
			//lock cursor
			Screen.lockCursor = true;
			Screen.showCursor = false;
			//put the wep back to its old place
			wep.transform.localPosition = wepPos;
			wep.transform.localRotation = wepRot;
			//set the pistol properties
			if(selectedWep == 1)
			{
				if(barrelOptions[barrelSel].Equals("Compensator"))
				{
					wep.SendMessage("UsingCompensator");
				}
				else if(barrelOptions[barrelSel].Equals("Silencer"))
				{
					wep.SendMessage("UsingSuppressor");
				}
				else
				{
					wep.SendMessage("NoBarrel");
				}
				
				if(opticsOptions[opticsSel].Equals("Reflex Sight"))
				{
					wep.SendMessage("UsingReflexSight");
				}
				else
				{
					wep.SendMessage("IronSight");
				}
			}
			
			//enable all those scripts we disabled
			var scripts2 : Component[] = wep.GetComponents(MonoBehaviour);
	       	for (var script2: Component in scripts2) 
	       	{
	       		var temp2 = script2 as MonoBehaviour;
	        	temp2.enabled = true;
	       	}
			//enable camera look and movement
			camCon.enabled = true;
			playerCon.enabled = true;
			shooter.enabled = true;
			//menu exited
			inMenu = false;
		}
	}
	
	
	if(inMenu)
	{
		//select the chosen optics device
		SelectChild(optics, opticsSel);
		//select the chosen barrel device
		SelectChild(barrel, barrelSel);
		//select the chosed underbarrel
		SelectChild(underBarrel, uBarrelSel);
	}
}

function SelectWeapon(index : int) 
{
 	for (var i=0;i<wepMgr.transform.childCount;i++)
  	{
	  	// Activate the selected weapon
		if (i == index)
		{
			wepMgr.transform.GetChild(i).gameObject.SetActive(true);
		}
		// Deactivate all other weapons
		else
	  	{
	   		wepMgr.transform.GetChild(i).gameObject.SetActive(false);
	  	}
  	}
}

function SelectChild(parentIn: Transform, num: int) //select a numbered child of a parent, and deactivate the rest
{
	for (var i = 0; i < parentIn.childCount; i++)
  	{
	  	// Activate the selected object
		if (i == num)
		{
			parentIn.transform.GetChild(i).gameObject.SetActive(true);
		}
		// Deactivate all other objects
		else
	  	{
	   		parentIn.transform.GetChild(i).gameObject.SetActive(false);
	  	}
  	}
}
