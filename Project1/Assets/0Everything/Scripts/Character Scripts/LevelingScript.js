 #pragma strict
var level: int = 1;
var xp: int = 0;
var xpNeeded: int = 1000; //xp needed to get to next level
var xpScaling: float = 1.2; //multiplier for the xp amount needed per level.
//Ex: xp needed for lv. 3 = xpScaling*xpNeeded for lv.2 
var labelText: String = "";
var levelStyle: GUIStyle;

var player: GameObject;

var skillPoints: int;

var showSkillsScreen: System.Boolean;

//skill variables

//strength
static var weaponHit: System.Boolean;


//stealth
static var backstabSkill: System.Boolean = false;
static var crouchSpeedModifier: float = 0.5; //normally crouching should be half as fast as walking/running
static var pistolAccuracyModifier: float = 1.0; //goes to 0.75 and 0.5 after upgrades
static var sniperAccuracyModifier: float = 1.0; 
static var crouchSightModifier: float = 1.0; //goes to 0.75 and 0.5 after upgrades
static var silentRun: System.Boolean = false;

private var windowSelected: int = 2; //speed 0, strength 1 or stealth 2
private var SpeedSkills: System.Boolean[];
private var StrengthSkills: System.Boolean[];
private var StealthSkills: System.Boolean[];
var SpeedSkillsText: String[];
var StrengthSkillsText: String[];
var StealthSkillsText: String[];

function Start () 
{
	player = GameObject.FindGameObjectWithTag("CamCollider");
	SpeedSkills = [false,false,false,false,false,false,false,false,false,false];
	StrengthSkills = [false,false,false,false,false,false,false,false,false,false];
	StealthSkills = [false,false,false,false,false,false,false,false,false,false];
}

function OnGUI()
{
	if(Time.timeScale != 0)
	{
		GUI.Label(Rect(400, Screen.height - 60, 200, 30), labelText, levelStyle);
		GUI.Label(Rect(400, Screen.height - 30, 200, 30), "LEVEL " + level + "   XP: " + xp + " Lvl Up at " + xpNeeded, levelStyle);
	}
	if(showSkillsScreen)
	{
		GUI.Label(Rect(300,80,200,20),"You have " + skillPoints + " skill points!");
		if(GUI.Button(Rect(300,100,200,20), "Speed"))
		{
			windowSelected = 0;
		}
		if(GUI.Button(Rect(500,100,200,20), "Strength"))
		{
			windowSelected = 1;
		}
		if(GUI.Button(Rect(700,100,200,20), "Stealth"))
		{
			windowSelected = 2;
		}
		if(windowSelected == 0)
		{
			for(var i = 0; i < 10; i++)
			{
				if(SpeedSkills[i]) //this has been unlocked
				{
					GUI.Box(Rect(500, 150+(i*30), 200,30), SpeedSkillsText[i]);
				}
				else if(i == 0 && !SpeedSkills[i])//if the previous skill is unlocked 
				{ //but this one has not been bought
					//show text for this skill and make it a toggle button
					if(GUI.Button(Rect(500, 150+(i*30), 200,30), SpeedSkillsText[i]) && skillPoints > 0)
					{
						SpeedSkills[i] = true;
						EnableSkill(i, 0);
						skillPoints--;
					}
				}
				else if(i != 0 && SpeedSkills[i-1] && !SpeedSkills[i])
				{
					if(GUI.Button(Rect(500, 150+(i*30), 200,30), SpeedSkillsText[i]) && skillPoints > 0)
					{
						SpeedSkills[i] = true;
						EnableSkill(i, 0);
						skillPoints--;
					}
				}
				else
				{
					GUI.Box(Rect(500, 150+(i*30), 200,30), "???");
				}
			}
		}
		else if(windowSelected == 1)
		{
			for(var u = 0; u < 10; u++)
			{
				if(StrengthSkills[u]) //this has been unlocked
				{
					GUI.Box(Rect(500, 150+(u*30), 200,30), StrengthSkillsText[i]);
				}
				else if(u == 0 && !StrengthSkills[u])//if the previous skill is unlocked 
				{ //but this one has not been bought
					//show text for this skill and make it a toggle button
					if(GUI.Button(Rect(500, 150+(u*30), 200,30), StrengthSkillsText[u]) && skillPoints > 0)
					{
						StrengthSkills[u] = true;
						EnableSkill(u, 1);
						skillPoints--;
					}
				}
				else if(u != 0 && StrengthSkills[u-1] && !StrengthSkills[u])
				{
					if(GUI.Button(Rect(500, 150+(u*30), 200,30), StrengthSkillsText[u]) && skillPoints > 0)
					{
						StrengthSkills[u] = true;
						EnableSkill(u, 1);
						skillPoints--;
					}
				}
				else
				{
					GUI.Box(Rect(500, 150+(u*30), 200,30), "???");
				}
			}
		}
		else if(windowSelected == 2)
		{
			for(var w = 0; w < 10; w++)
			{
				if(StealthSkills[w]) //this has been unlocked
				{
					GUI.Box(Rect(500, 150+(w*30), 200,30), StealthSkillsText[w]);
				}
				else if(w == 0 && !StealthSkills[w])//if the previous skill is unlocked 
				{ //but this one has not been bought
					//show text for this skill and make it a toggle button
					if(GUI.Button(Rect(500, 150+(w*30), 200,30), StealthSkillsText[w]) && skillPoints > 0)
					{
						StealthSkills[w] = true;
						EnableSkill(w, 2);
						skillPoints--;
					}
				}
				else if(w != 0 && StealthSkills[w-1] && !StealthSkills[w])
				{
					if(GUI.Button(Rect(500, 150+(w*30), 200,30), StealthSkillsText[w]) && skillPoints > 0)
					{
						StealthSkills[w] = true;
						EnableSkill(w, 2);
						skillPoints--;
					}
				}
				else
				{
					GUI.Box(Rect(500, 150+(w*30), 200,30), "???");
				}
			}
		}
	}
}

function EnableSkill(num: int, section: int) //example, EnableSkill(0, 2) would be backstab
{
	if(section == 0) //speed
	{
		if(num == 0) //sprint
		{
		}
		else if(num == 1) //endurance runner
		{
		}
		else if(num == 2) //high jumps
		{
		}
		else if(num == 3) //fast runner
		{
		}
		else if(num == 4) //sharp shooter
		{
		}
		else if(num == 5) //speed demon
		{
		}
		else if(num == 6) //mad hops
		{
		}
		else if(num == 7) //marathon runner
		{
		}
		else if(num == 8) //painful shooter
		{
		}
		else if(num == 9) //don't stop
		{
		}
	}
	else if(section == 1) //strength
	{
		if(num == 0) //weapon hit
		{
			
		}
		else if(num == 1) //fast hands
		{
		}
		else if(num == 2) //sharp shooter
		{
		}
		else if(num == 3) //steady shot
		{
		}
		else if(num == 4) //meat shield
		{
		}
		else if(num == 5) //stone wall
		{
		}
		else if(num == 6) //sharp shooter
		{
		}
		else if(num == 7) //heav hitter
		{
		}
		else if(num == 8) //fast hands
		{
		}
		else if(num == 9) //health regen
		{
		}
	}
	else if(section == 2)//stealth
	{
		if(num == 0) // backstab
		{
			backstabSkill = true;
		}
		else if(num == 1) //speed sneaking
		{
			crouchSpeedModifier += 0.25;
		}
		else if(num == 2) //perfect pistol
		{
			pistolAccuracyModifier -= 0.25;
		}
		else if(num == 3) //blending in
		{
		}
		else if(num == 4) //sharp sniper
		{
			
		}
		else if(num == 5) // speed sneaking II
		{
			crouchSpeedModifier += 0.25;
		}
		else if(num == 6) //painful pistol
		{
		}
		else if(num == 7) //blending in II
		{
		}
		else if(num == 8) //killer sniper
		{
		}
		else if(num == 9) //silent runner
		{
		}
		
	}
}

function Update () 
{
	if(Time.timeScale != 0) 
	{
		if(Input.GetKeyDown(KeyCode.J))
		{
			if(!showSkillsScreen)
			{
				player.SendMessage("Lock");
			}
			else
			{
				player.SendMessage("Unlock");
			}
			showSkillsScreen = !showSkillsScreen;				
		}
	}
}

function HeadshotKill(hp: int)
{
	xp += hp * 1.5;
	CheckXP();
	labelText = "HEADSHOT! +" + hp * 1.5 + " xp";
	yield WaitForSeconds(1*Time.timeScale);
	labelText = "";
}

function BulletKill(hp: int)
{
	xp += hp;
	CheckXP();
	labelText = "Kill +" + hp + " xp";
	yield WaitForSeconds(1*Time.timeScale);
	labelText = "";
}

function KnifeKill(hp: int)
{
	xp += hp * 1.2;
	CheckXP();
	labelText = "Knife Kill +" + hp * 1.2 + " xp";
	yield WaitForSeconds(1*Time.timeScale);
	labelText = "";
}

function BackstabKill(hp: int)
{
	xp += hp * 2;
	CheckXP();
	labelText = "Backstab! +" + hp * 2 + " xp";
	yield WaitForSeconds(1*Time.timeScale);
	labelText = "";
}

function CheckXP()
{
	if(xp >= xpNeeded)
	{
		xp = xp - xpNeeded;
		xpNeeded = xpNeeded *xpScaling;
		level += 1;
		skillPoints += 1;
	}
}