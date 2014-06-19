#pragma strict
var money: int = 0; //how much money you have
var letsDoTheThing : GUIStyle = new GUIStyle();

function Start () {

}

function Update () {

}

function OnGUI()
{
	if(!GUICamControl.paused) 
	{
		
		// GUI Style so that the Currency actually looks fancy aw yeah
		// Wait no purple prose somebody fix this psuedo-reality
		// Nvm, it's fixed
		GUI.Label(new Rect(10,100,200,20), "$" + money, letsDoTheThing);
		//GUI.Label(new Rect(0,100,200,20), "$" + money);
	
	}
	else if(GUICamControl.paused && GUICamControl.locked)
	{
		GUI.Label(new Rect(10,100,200,20), "$" + money, letsDoTheThing);
	}
}

function addMoney(change: int)
{
	money += change;
}

function removeMoney(change: int)
{
	money -= change;
}

function getMoney() //returns the amount of money the player has
{
	return money;
}