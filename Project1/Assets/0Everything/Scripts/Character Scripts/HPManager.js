#pragma strict
var health: int = 100;
var showGUI: System.Boolean;
var hpHeartImp: Texture2D; // The heart symbol seen by the health manager.
var hpHealthLevel: Texture2D; // The health level, represented by a red bar defined in this Texture2D.
var hpHealthLevelBack: Texture2D; // A background panel that does not change so that one can compare current health with health possible.
var wepManager: GameObject;
private var healthBarStyle: GUIStyle;

var damagePercentage: int = 100; //the percentage of damage taken. ex: if this is 50, you take half damage
var multiplier: float = 1;

var net: GameObject; //the thing with the network manager
var multiMan: GameObject; //multiplayer manager
var ragdoll: Transform; //the ragdoll

var dead: System.Boolean = false; //have ya been killed yet

function OnGUI()
{
	if(!GUICamControl.paused && showGUI)
	{
		
		// WOAH WATCH OUT DOGES WE ARE NOT DOING THIS ANYMORE
		//GUI.Label(new Rect(10, 10, 40, 30),hpHeartImp);
		/*GUI.Label(new Rect(55, 10, 100, 32),hpHealthLevelBack);
		GUI.Label(new Rect(55, 10, health, 32),hpHealthLevel);
		*/
		
		GUI.Box(Rect(8, 9, 103, 34), "");
		GUI.Box(Rect(10, 10, health, 32), "", healthBarStyle);
	}
}

function Start () 
{
	if(showGUI)
	{
		healthBarStyle = new GUIStyle();
		healthBarStyle.normal.background = hpHealthLevel;
		//wepManager = GameObject.FindGameObjectWithTag("WepManager");
		multiMan = GameObject.FindGameObjectWithTag("MultiMan");
		multiplier = damagePercentage*0.01;
	}
	else
	{
		multiplier = 1;
	}
}

function Update () 
{
	if(showGUI)
	{
		if(!net.networkView.isMine && (Network.isClient || Network.isServer))
		{
	   		enabled=false;
	   	}
   	}
}

function OnBulletHit(damage: int)
{	
    if(health > 0 && health - (damage * multiplier) <= 0 && !dead)
    {
    	health = 0;
    	Kill();
    }
    else if(health > 0)
    {
    	health -= damage * multiplier;
    }
    else if(health <= 0 && !dead)
    {
    	Kill();
    }
}

function OnMissileHit(damage: int)
{
	if(health > 0 && health - (damage * multiplier) <= 0 && !dead)
    {
    	health = 0;
    	Kill();
    }
    else if(health > 0)
    {
    	health -= damage * multiplier;
    }
    else if(health <= 0 && !dead) 
    {
    	Kill();
    }
}	

function Kill()
{	
	dead = true;
	if(showGUI)
	{
		if(!Network.isClient && !Network.isServer)
		{
			//health = 0;
			Destroy(wepManager);
			Time.timeScale = 1;
			enableRagDoll();
			yield WaitForSeconds(3);
			Application.LoadLevel(Application.loadedLevel);
		}
		else
		{
			Network.Destroy(gameObject);
			//multiMan.SendMessage("Respawn",SendMessageOptions.DontRequireReceiver);
		}
	}
	else
	{	
		if(ragdoll == null)
		{
			Destroy(gameObject);
		}
		else
		{
			var rag = Instantiate(ragdoll, transform.position, transform.rotation);
			
			//line up the ragdoll to the current character, so that it will start out
			//in the same position
			
			var ragdollJoints: Component[] = rag.GetComponentsInChildren(Transform);
			var currentJoints: Component[] = GetComponentsInChildren(Transform);
			
			for(var i = 0; i < ragdollJoints.Length; i++)

			{

			    for(var q = 0; q < currentJoints.Length; q++)

			    {

			        if(currentJoints[q].name.CompareTo(ragdollJoints[i].name) == 0)

			        {

			            ragdollJoints[i].transform.position = currentJoints[q].transform.position;

			            ragdollJoints[i].transform.rotation = currentJoints[q].transform.rotation;

			            break;

			        }

			    }

			}
			Destroy(this.gameObject);
		}
	}
}
			
function HPRestore(restorehp: int)
{
	if(health + restorehp > 100)
	{
		health = 100;
	}
	else
	{
		health += restorehp;
	}
}

function enableRagDoll()
{
	rigidbody.freezeRotation = false;
	rigidbody.useGravity = true;
	var cam = transform.FindChild("Main Camera");
	transform.DetachChildren();
	cam.transform.position.y -= 1;
	//active = false;
}