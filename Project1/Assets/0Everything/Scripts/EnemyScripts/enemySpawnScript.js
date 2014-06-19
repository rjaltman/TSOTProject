#pragma strict
var enemy: GameObject; //the enemy to spawn
var delay: float; //the delay between spawns
var waypoint : Transform[]; //waypoints to set for the spawning bots
var spawning: System.Boolean = true; //whether or not the spawn is spawning

private var nextSpawn: float; //time for next spawn
private var spawn: GameObject; //the spawned enemy

function Start () 
{
	nextSpawn = Time.time + delay;
	SpawnEnemy();
}

function Update () 
{
	if(spawning && Time.time > nextSpawn)
	{
		nextSpawn = Time.time + delay;
		SpawnEnemy();
	}
}

function SpawnEnemy()
{
	spawn = Instantiate(enemy, transform.position, transform.rotation);
	if(waypoint != null)
	spawn.SendMessage("setWaypoints", waypoint);
	
}