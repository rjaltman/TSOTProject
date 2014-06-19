#pragma strict
@script RequireComponent(AudioSource) //makes the script only work if the obj has an audio
//source component attached
var waitTime: float;
var playOnWake: System.Boolean; //whether the sound should play right after the waitTime
var playOnTrigger: System.Boolean;
private var played = false; //don't want sounds to repeat do we?
var callNextSound: GameObject; //call a sound to play after this one is activated and done
var nextSoundDelay: float;
private var paused = false;
private var dilatorOn = false;


function Start () 
{
	if(playOnWake)
	{
		yield WaitForSeconds(waitTime);
		audio.Play();
		yield WaitForSeconds(nextSoundDelay);
		callNextSound.active = true;
	}
		
}

function Update () 
{
	/*if(Input.GetKeyDown(KeyCode.Escape) || Input.GetButtonDown("Pause"))
	{
		if(!paused) //pause the game if it isn't already
		{
			paused = true;
			audio.Play();
		}
		else
		{
			audio.Pause();
			paused = false;
		}
	}
	else if(Input.GetKeyDown(KeyCode.Q) || Input.GetButtonDown("Slowmo"))//This is the slow-mo key
	{
		if(!dilatorOn) //pause the game if it isn't already
		{
			dilatorOn = true;
			audio.pitch = 0.5;
		}
		else
		{
			dilatorOn = false;
			audio.pitch = 1;
		}
	}*/
}

function OnTriggerEnter(other: Collider)
{
	if(other.tag == "CamCollider" && playOnTrigger && !played)
	{
		played = true;
		yield WaitForSeconds(waitTime);
		audio.Play();
		yield WaitForSeconds(nextSoundDelay);
		callNextSound.active = true;
	}
}

function OnTriggerExit(other: Collider)
{
}
