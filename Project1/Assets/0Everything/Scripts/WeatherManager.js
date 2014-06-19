#pragma strict
/*
The weather manager simulates effects of weather,
including wind and snow, with realistic wind

*/
var snowEmmitor: ParticleSystem;
var rainEmmitor: ParticleSystem;
var rainDensity: int;
var snowDensity: int;

function Start () 
{
	snowEmmitor.particleSystem.emissionRate = snowDensity;
	snowEmmitor.particleSystem.startSpeed = 10;
	rainEmmitor.particleSystem.enableEmission = false;
}

function Update ()
{

}