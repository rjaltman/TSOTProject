#pragma strict
//the first enemy
var bot: GameObject;
var anim: Animator;
var player: GameObject;
var controller: GUICamControl;
var wepMgr: Shooter;


var patrolling = true; //determines whether the bot follows the waypoints
var idling = false; //if the AI 
var playerFound = false; //if the AI has located the player
var waypoint : Transform[];
static var speed : float = 2;
static var runSpeed : float = 5;
private var currentWaypoint : int = 0;

var vision: System.Boolean = true;

var targetDir: Vector3;
var forward: Vector3;
var dist : float;
var angle : float;
var turnSpeed: float;

var shooting = false;

var defaultwep : int = 1;

function Start () 
{
	if((Network.isServer || Network.isClient) && !networkView.isMine)
    	 enabled=false;
	
	anim = bot.GetComponent(Animator);
	player = GameObject.FindGameObjectWithTag("CamCollider");
	controller = player.GetComponent(GUICamControl);

	wepMgr.SelectWeapon(defaultwep);
	
	if (waypoint.length == 0)
	{
		patrolling = false;
		idling = true;
	}
	
	forward = transform.forward;
	
	
}

function Update () 
{
	targetDir = player.transform.position - transform.position; //targt direction to move
	dist = Vector3.Distance(bot.transform.position, player.transform.position);
	angle = Vector3.Angle(targetDir, forward);
	var hit: RaycastHit;
	
	if (angle < 30.0 && dist < 60)
	{
		if(Physics.Raycast(transform.position, targetDir, hit))
		{
			if(hit.collider.gameObject.tag == "CamCollider")
			{
				//found player
				playerFound = true;
			}
		}
		
	}
	
	
	if(!playerFound)
	{
		if(dist < 20 && controller.sprinting)	//if the player is running
		{
			if(Physics.Raycast(transform.position, targetDir, hit))
			{
				if(hit.collider.gameObject.tag == "CamCollider")
				{
					//found player
					playerFound = true;
				}
			}
		}
		else if(dist <10 && !controller.crouched) //if the player is walking
		{
			if(Physics.Raycast(transform.position, targetDir, hit))
			{
				if(hit.collider.gameObject.tag == "CamCollider")
				{
					//found player
					playerFound = true;
				}
			}
		}
	}
	
	if(playerFound)
	{
		if(!shooting)
		{
			Shooting();
			patrolling = false;
		}
		if(dist > 5)// && Vector3.Angle(Vector3(0, targetDir.y, 0), transform.forward) < 45) //prevents the bots from going underneath you
		{
			anim.SetBool("Running", true);
			var vel : Vector3 = transform.forward;
			vel.y = 0;
			rigidbody.velocity = vel * runSpeed;
		}
		var rotate = Quaternion.LookRotation(player.transform.position - transform.position); 
        transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * turnSpeed); 
		//transform.LookAt(player.transform);
		transform.localEulerAngles.x = 0;
	}
	
	
	if(patrolling)
    {
    	//if the AI is on patrol
    	if(currentWaypoint < waypoint.length)
    	{
	    	var target : Vector3 = waypoint[currentWaypoint].position;
	        var moveDirection : Vector3 = target - transform.position;
	        var velocity = rigidbody.velocity;
	        transform.LookAt(waypoint[currentWaypoint].transform);
	 
	        if(moveDirection.magnitude < 1)
	        {
	            currentWaypoint++;
	        }
	        else
	        {
	            velocity = moveDirection.normalized*speed;
	        }
	        rigidbody.velocity.x = velocity.x;
	        rigidbody.velocity.z = velocity.z;
        }
        else if(currentWaypoint == waypoint.Length)
    	{
    		currentWaypoint = 0;
    	}
    }
   	else if(idling)
    {
    	
    }
    
   
}

function Shooting()
{
	shooting = true;
	while(shooting)
	{
		wepMgr.transform.LookAt(player.transform.position);
		wepMgr.transform.localEulerAngles.y = 0;
		//wepMgr.transform.rotation.x = Quaternion.LookRotation(player.transform.position-transform.position).x;
		var hit: RaycastHit;
		if(Physics.Raycast(wepMgr.transform.position, wepMgr.transform.forward, hit))
		{
			if(hit.collider.gameObject.tag == "CamCollider" && vision) //if they are aimed at the player and are not blinded
			{
				wepMgr.Shoot();
			}
		}
		yield WaitForSeconds(0.2);
	}
}

function setWaypoints(waypoints: Transform[])
{
	waypoint = waypoints;
	patrolling = true;
}

function DisableVision(duration: int)
{
	//prevents the bots from shooting for a short time
	//used by smoke bombs and flashbangs
	vision = false;
	yield WaitForSeconds(duration);
	vision = true;
}