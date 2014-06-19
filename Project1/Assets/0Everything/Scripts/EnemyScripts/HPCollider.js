#pragma strict
//this script should be put on objects that take collisions and damage, but do not have an hp manager
//examples would be a head, limbs etc.
var dmgMultiplyer: float; //if this is 2.0, all damage to this obj is doubled (ex. head)
var hpmanager: HPManager2; //the thing with the manager

function Start () {
	if(dmgMultiplyer == 0)
	dmgMultiplyer = 1;
}

function Update () {

}

function OnBulletHit(damage: int)
{	
    hpmanager.OnHeadshotHit(damage * dmgMultiplyer);
}

function OnMissileHit(damage: int)
{
	hpmanager.OnMissileHit(damage * dmgMultiplyer);
}	