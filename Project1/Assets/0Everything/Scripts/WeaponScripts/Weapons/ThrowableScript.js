#pragma strict
var smokeBombPrefab: Transform;
var grenadePrefab: Transform;
var flashBangPrefab: Transform;

var gLeft: int; //grenades you have
var fLeft: int; //flash bangs you have
var sLeft: int; //smoke bombs you have
var net: GameObject;

var forceMult: int; //determines throw strength


var selected: int; //0 is grenade, 1 is flashbang, 2 is smoke bomb

var wepManager: Shooter;

function Start () 
{
	gLeft = 50;
	fLeft = 50;
	sLeft = 50;
}

function AmmoPickup(clipnum: int)
{
	
}

function OnGUI()
{
	if(wepManager.isCharacter)
	{
		GUI.Label(new Rect(10, 52, 300, 20),"Smoke " + sLeft + "   Grenades " + gLeft + "   Flashbangs " + fLeft);
		GUI.Label(new Rect(10, 72, 300, 20), "Selected: " + selected);
	}
}

function Update () 
{
	if(!net.networkView.isMine && (Network.isClient || Network.isServer))
	{
		Debug.Log("Owned by: " + net.networkView.owner);
		gameObject.GetComponent(Camera).enabled = false;
   		enabled=false;
   	} 
	if(Input.GetKeyDown(KeyCode.G) || Input.GetMouseButtonDown(2)) //if G or middle mouse is pressed 
	{
		if(selected == 0)
		{
			throwGrenade();
		}
		else if(selected == 1)
		{
			throwFlashBang();
		}
		else if(selected == 2)
		{
			throwSmokeBomb();
		}
	}
	if (Input.GetAxis("Mouse ScrollWheel") > 0) 
	{
		if(selected == 2)
		selected = 0;
		else
		selected += 1;
	}
	else if(Input.GetAxis("Mouse ScrollWheel") < 0)
	{
		if(selected == 0)
		selected = 2;
		else
		selected -= 1;
	}
}

function Swap()
{

}

function throwGrenade()
{
	if(gLeft > 0)
	{
		gLeft -= 1;
		var grenade: Transform;
		if(Network.isClient || Network.isServer)
		{
			grenade = Network.Instantiate(grenadePrefab, transform.position + transform.parent.transform.forward * 0.5, transform.rotation, 0);
		}
		else
		{	
			grenade = Instantiate(grenadePrefab, transform.position + transform.parent.transform.forward * 0.5, transform.rotation);
		}
		grenade.rigidbody.AddForce((transform.parent.transform.forward * forceMult)*(1/Time.timeScale));
	}
}

function throwFlashBang()
{
	if(fLeft > 0)
	{
		fLeft -= 1;
		var flashBang: Transform;
		if(Network.isClient || Network.isServer)
		{
			flashBang = Network.Instantiate(flashBangPrefab, transform.position + transform.parent.transform.forward * 0.5, transform.rotation, 0);
		}
		else
		{	
			flashBang = Instantiate(flashBangPrefab, transform.position + transform.parent.transform.forward * 0.5, transform.rotation);
		}
		flashBang.rigidbody.AddForce((transform.parent.transform.forward * forceMult)*(1/Time.timeScale));
	}
}

function throwSmokeBomb()
{
	if(sLeft > 0)
	{
		sLeft -= 1;
		var smokeBomb: Transform;
		if(Network.isClient || Network.isServer)
		{
			smokeBomb = Network.Instantiate(smokeBombPrefab, transform.position + transform.parent.transform.forward * 0.5, transform.rotation, 0);
		}
		else
		{	
			smokeBomb = Instantiate(smokeBombPrefab, transform.position + transform.parent.transform.forward * 0.5, transform.rotation);
		}
		smokeBomb.rigidbody.AddForce((transform.parent.transform.forward * forceMult)*(1/Time.timeScale));
	}
}


