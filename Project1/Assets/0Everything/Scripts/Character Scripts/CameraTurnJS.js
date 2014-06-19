import UnityEngine;
import System.Collections;
	
public var net : GameObject;
enum RotationAxes { MouseXAndY = 0, MouseX = 1, MouseY = 2 };
var axes: RotationAxes = RotationAxes.MouseXAndY;
public var target : GameObject;
private var anim: Animator; //animator component of target

public var invertInt = 1;
public var sensitivityX = 15F;
public var sensitivityY = 15F;

private var minimumX = -360F;
private var maximumX = 360F;
private var rotationX = 0F;
private var offset = 0F;

private var minimumY = -85F;
private var maximumY = 90F;
private var rotationY = 0F;


private var sensXhold: int; //holds the x sensitivity, so it can be rest
private var sensYhold: int; //holds the y sensitivity, so it can be reset

function Start()
{
	anim = target.GetComponent(Animator);
	sensXhold = sensitivityX;
	sensYhold = sensitivityY;
}

function OnGUI () 
{
	if(Time.timeScale == 0)
	{
		//sensitivityX = GUI.HorizontalSlider (new Rect ((Screen.width/2)-100,(Screen.height / 2) + 90, 200, 20), sensitivityX, 1.0f, 20.0f);
		//sensitivityY = sensitivityX;
	}
}

// Update is called once per frame
function Update () 
{
	if(!net.networkView.isMine && (Network.isClient || Network.isServer))
	{
		var cam : Camera = gameObject.GetComponent(Camera);
		cam.enabled = false;
		enabled = false;
	}
	if(Time.timeScale != 0)
	{
		if (axes == RotationAxes.MouseXAndY)
		{
			rotationX = transform.localEulerAngles.y + (Input.GetAxis("Mouse X") + Input.GetAxis("HorizontalL")) * sensitivityX;
			target.transform.localEulerAngles.y = rotationX;
			rotationY += (Input.GetAxis("Mouse Y") + Input.GetAxis("VerticalL") * invertInt) * sensitivityY;
			rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
			rotationY += offset; //used for gun rise
			offset = 0;
			transform.localEulerAngles = new Vector3(-rotationY, rotationX, 0);
		}
		else if (axes == RotationAxes.MouseX)
		{
			transform.Rotate(0, Input.GetAxis("Mouse X") * sensitivityX, 0);
		}
		else
		{
			rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
			rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
			
			transform.localEulerAngles = new Vector3(-rotationY, transform.localEulerAngles.y, 0);
		}
		
		if(Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.D))
		{
			anim.SetBool("moving", true);
		}
		else
		{
			anim.SetBool("moving", false);
		}
								
		if(Input.GetKeyDown(KeyCode.LeftControl))			
		{
			anim.SetBool("crouching", !anim.GetBool("crouching"));
		}
	}
	if(Input.GetButtonDown("Invert"))
	{
		invertInt = invertInt * -1;
	}
}

function setSensitivity(multiplier: float)
{
	sensitivityX = sensitivityX * multiplier;
	sensitivityY = sensitivityY * multiplier;
}

function resetSensitivity()
{
	sensitivityX = sensXhold;
	sensitivityY = sensYhold;	
}

function rotateX(amount: float)
{
	offset = amount;
}


