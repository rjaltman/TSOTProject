#pragma strict
//attach this script to a collider surrounding the light
//then set the light variable to the light to be turned off
var lightObj: GameObject;
var lamp: GameObject;
var offMat: Material;

function Start () 
{

}

function Update () 
{

}

function OnBulletHit(damage: int)
{
	lightObj.light.active = false;
	lamp.renderer.material = offMat;
}

function OnMissileHit(damage: int)
{
	lightObj.light.active = false;
	lamp.renderer.material = offMat;
}