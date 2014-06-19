#pragma strict
/*
The shop is activated when it gets the interact message
*/
var purchase: AudioClip;
var cantPurchase: AudioClip;

var showGUI: System.Boolean = false;
var player: GameObject;
var wepMgr: GameObject;
var currMgr: CurrencyManager;

function Start () 
{
	player = GameObject.FindGameObjectWithTag("CamCollider");
	wepMgr = GameObject.FindGameObjectWithTag("WepManager");
}

function Update () 
{

}

function OnGUI ()
{
	if(showGUI)
	{
		if(GUI.Button(Rect(100,100,200,20), "Full Heal $20"))	
		{
			if(currMgr.getMoney() > 20)
			{
				player.SendMessage("removeMoney", 20); //TAKE MY MONEY
				player.SendMessage("HPRestore", 100); //FOR MY LIFE
				audio.clip = purchase;
				audio.Play();
			}
			else
			{
				audio.clip = cantPurchase;
				audio.Play();
			}
		}
		if(GUI.Button(Rect(100,120,200,20), "Pistol Ammo $50"))
		{			
			if(currMgr.getMoney() > 50)
			{
				player.SendMessage("removeMoney", 50); //TAKE MY MONEY
				var ammoData = new int[2];
	 			ammoData[0] = 1; //the wep number for a pistol is 1
	 			ammoData[1] = 1; //1 clip ammo
	 			audio.clip = purchase;
	 			audio.Play();
	 			wepMgr.SendMessage("AmmoPickup", ammoData, SendMessageOptions.DontRequireReceiver);
	 		}
	 		else
	 		{
	 			audio.clip = cantPurchase;
				audio.Play();
	 		}
		}		
		if(GUI.Button(Rect(150,140,100,20), "Close"))	
		{
			player.SendMessage("Unlock");
			showGUI = false;
		}
	}
}

function Interact()
{
	showGUI = true;
	player.SendMessage("Lock"); //this should lock the camera view, disable movement, and disable the GUI
}