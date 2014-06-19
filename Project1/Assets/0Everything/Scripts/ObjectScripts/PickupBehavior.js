#pragma strict
var healthPack: System.Boolean;
var wepPickup: System.Boolean; //a weapon, which gives you a new wep or takes ammo
var wepAmmoPickup: System.Boolean; //a weapon crate for a weapon
var HPrestore: int;
var wepNumber: int; //1 for pistol, 2 for shotgun, et cetera
var ammoClips: int; //clips of ammo in a box
var player : GameObject;
var healthManager : HPManager;
var wepManager : GameObject;
var playerHP: int;


var	titleOfWep: GUIStyle = new GUIStyle();



function Start () 
{
	
}

function Update () 
{
	if(healthManager != null)
	{
		playerHP = healthManager.health;
	}
}


function OnCollisionEnter( hitObject : Collision )
{
	if(hitObject.gameObject.tag == "CamCollider")
	{
		player = hitObject.gameObject;
		healthManager = player.GetComponent(HPManager);
		wepManager = player.transform.FindChild("Main Camera").FindChild("WeaponManager").gameObject;//GameObject.FindWithTag("WepManager");
		if(healthManager != null)
		{
			playerHP = healthManager.health;
		}
		if(healthPack)
		{
			if(playerHP < 100)
			{
				hitObject.collider.SendMessage("HPRestore", HPrestore, SendMessageOptions.DontRequireReceiver);
	 			Destroy( gameObject );
	 		}
 		}
 		else if(wepPickup)
 		{
 			var wepData = new int[2];
 			wepData[0] = wepNumber;
 			wepData[1] = ammoClips;
 			wepManager.SendMessage("WepPickup", wepData, SendMessageOptions.DontRequireReceiver);
 			Destroy( gameObject );
 		}
 		else if(wepAmmoPickup)
 		{
 			var ammoData = new int[2];
 			ammoData[0] = wepNumber;
 			ammoData[1] = ammoClips;
 			wepManager.SendMessage("AmmoPickup", ammoData, SendMessageOptions.DontRequireReceiver);
 			Destroy( gameObject );
 		}
 	}
}