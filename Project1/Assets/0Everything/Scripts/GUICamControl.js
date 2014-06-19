import UnityEngine;
import System.Collections;
import System;


	var yvel: float;
	var holdY: float;
	public var wepMgr: GameObject;

	public var myLight : GameObject;
	var cameraA : GameObject;
	public static var paused = false;
	public var timedilation_on = false;
	public var turnnotstrafe = false;
	public var flying = false;
	public var jump = false;
	public var onGround = false;
	
	public var running = true; // this is for auto running
	public var sprinting = false; //this is for the stamina draining sprint
	public var crouched = false;
	public var staminaRegen = false; //whether you're regenning stamina
	public var staminaRegenRate: int = 20;
	public var staminaDrainRate: int = 10;
		
	public var myFont : Font;
	public var pic : Texture ;
	public var moveSpeed: float;
	public var runSpeed: float;
	public var sprintSpeed: float;
	private var speed = moveSpeed;;
	public var gravity = 1;
	public var jumpspeed = 1;
	private var yvelocity = 0;
	private var lightmapint;
	public var titleStyle4 : GUIStyle = new GUIStyle();
	public var levelTitleStyle : GUIStyle = new GUIStyle();
	public var lvlSubtitle : GUIStyle = new GUIStyle();
	var timeSymbol: Texture2D; // The time symbol seen by the time manager.
	var timeLevel: Texture2D; // The time level, represented by a blue bar defined in this Texture2D.
	var timeLevelBack: Texture2D; // A background panel that does not change so that one can compare current time with time possible.
	var pauseBack: Texture2D;
	var fullScreenPauseBack: GUIStyle = new GUIStyle(); 
	var backArrowStyle: GUIStyle = new GUIStyle();
	public var blueTimeBar = new GUIStyle();
	
	var floorCollider: GameObject;
	
	public var slowmotion : float;
	public var levelSecondName = "";
	var timeMod = 1;
	public var dilatorEnergy = 100;
	var refill = false;
	var regening = false; 
	var draining = false;
	
	var stamina: float = 100; //player stamina out of 100
	
	public static var locked: System.Boolean = false;
	
	var pausemain = false;
	var pausedobjectives = false;
	var pausedskills = false;
	var pausedcontrols = false;
	var pausedsettings = false;
	
	// An actually-helpful label, we see that this is what dictates the showing of the first controls page.
	var helpImage1: Texture2D;
	var help1Style: GUIStyle = new GUIStyle();
	help1Style.normal.background = helpImage1;

	// Also an actually-helpful label, we see that this is what dictates the showing of the second controls page.
	var helpImage2: Texture2D;
	var help2Style: GUIStyle = new GUIStyle();
	help2Style.normal.background = helpImage2; 

	var transparentGrayStyle: GUIStyle = new GUIStyle();


	// The code that dictates the texture and GUIStyle of the button that returns one to the main menu.
	var returnToMenu: Texture2D;
	var returnToMenuStyle: GUIStyle = new GUIStyle();
	returnToMenuStyle.normal.background = returnToMenu;
	returnToMenuStyle.font = myFont; 
	returnToMenuStyle.fontSize = 40; 

	// The code that dictates the texture and GUIStyle of the button that takes one to the next page of controls in said menu.
	var nextPage: Texture2D;
	var nextPageStyle: GUIStyle = new GUIStyle();
	nextPageStyle.normal.background = nextPage;
	nextPageStyle.font = myFont; 
	nextPageStyle.fontSize = 40; 

	var ctrlScreenTwo = false;
	var showinghelp = false;
	
	function OnNetworkInstantiate (msg : NetworkMessageInfo) 
	{
		if(!networkView.isMine)
    	 enabled=false;
	}
	
	// Use this for initialization
	function Start () 
	{
	
		if(flying)
		{
			rigidbody.useGravity = false;
			collider.enabled = false;
		}
		
		titleStyle4.font = myFont;
		titleStyle4.fontSize = 28;
		

		
		Screen.showCursor = false;
		paused = false;
		pausemain = false; 
		pausedobjectives = false;
		pausedskills = false;
		pausedcontrols = false;
		pausedsettings = false;
		
		//default time settings
		Time.timeScale = 1;
		Time.fixedDeltaTime = 0.02f;
		
		myLight.GetComponent("Light").light.enabled = false;
		
		speed = moveSpeed;
	}
	
	
	// Update is called once per frame
	function Update () 
	{
			
		/*
		 * Basic cameraA control forward, back, left right		
		*/
		
		var alpha = 0.1;
		var beta = alpha * 20;
		
		
		
		if(Input.GetButtonDown("Pause") && !locked)
		{
			if(!paused) //pause the game if it isn't already
			{
				paused = true;
				pausemain = true;
				Time.timeScale = 0;
				//Time.fixedDeltaTime = 0;
				Screen.showCursor = true;
				Screen.lockCursor = false;
				wepMgr.active = false;
			}
			else //unpause the game if it is paused
			{
				paused = false;
				Screen.showCursor = false;
				Screen.lockCursor = true;
				wepMgr.active = true;
				if(timedilation_on)
				{
					Time.timeScale = slowmotion;
					Time.fixedDeltaTime = slowmotion * 0.02f;
				}
				else
				{
					Time.timeScale = 1;
					Time.fixedDeltaTime = 0.02f;
				}
			}
		}
		if(!paused)
		{
			yvel = rigidbody.velocity.y;
			if(flying)
			{
				dilatorEnergy = 100;
			}
			
			if(rigidbody.velocity.y > -0.5 && rigidbody.velocity.y < 0.5)
			{
				jump = false;
			}
			
			Screen.lockCursor = true;
			if (timedilation_on == true) 
			{
				rigidbody.useGravity = false;
				rigidbody.velocity.y -= 9.81*(1/Time.timeScale)*(1/Time.timeScale)* Time.deltaTime;				
				if (dilatorEnergy > 0) 
				{
					if (draining == false) 
					{
						subtEnergyRate(80);
						draining = true;
						regening = false;
					}
				}
				else 
				{
					timeMod = 1;
					holdY = rigidbody.velocity.y * Time.timeScale;
					Time.timeScale = 1;
					Time.fixedDeltaTime = 0.02f;
					rigidbody.velocity.y = holdY;
					refill = true;
					timedilation_on = false;
					wepMgr.SendMessage("Slowmo", false);
				}
			}
			if (timedilation_on == false) 
			{
				rigidbody.useGravity = true;
					if (dilatorEnergy < 100) 
					{
						if (regening == false) 
						{
							addEnergyRate(5);
							regening = true;
							draining = false;
						}	

					}
				
			}
			if(Input.GetButtonDown("Slowmo"))//This is the slow-mo key
			{
				var slow = slowmotion;
				if(timedilation_on == false)
				{
					timeMod = 1/(slow);
					var vec = new Vector3(0,0,0);
					vec.y = rigidbody.velocity.y;
					rigidbody.velocity = vec;
					Time.timeScale = slow;
					Time.fixedDeltaTime = slow * 0.02f;
					timedilation_on = true;
					wepMgr.SendMessage("Slowmo", true);
				}
				else
				{
					timeMod = 1;
					holdY = rigidbody.velocity.y * Time.timeScale;
					Time.timeScale = 1;
					Time.fixedDeltaTime = 0.02f;
					rigidbody.velocity.y = holdY;
					refill = true;
					timedilation_on = false;
					wepMgr.SendMessage("Slowmo", false);
				}
			}
			
			if(Input.GetKeyDown(KeyCode.CapsLock)) //turn on running
			{
				if(running)
				{
					running = false;
					speed = moveSpeed;
					if(crouched)
					speed = LevelingScript.crouchSpeedModifier * speed;
				}
				else
				{
					running = true;
					speed = runSpeed;
					if(crouched)
					speed = LevelingScript.crouchSpeedModifier * speed;
				}
				
			}
			if(Input.GetButtonDown("Run") || Input.GetKeyDown(KeyCode.LeftShift)) //sprint
			{
				if(!crouched && stamina == 100)
				{
					wepMgr.SendMessage("Sprinting", true, SendMessageOptions.DontRequireReceiver);
					sprinting = true;
					speed = sprintSpeed;
				}
			}
			else if(Input.GetButtonUp("Run") || Input.GetKeyUp(KeyCode.LeftShift))
			{
				wepMgr.SendMessage("Sprinting", false, SendMessageOptions.DontRequireReceiver);
				sprinting = false;
				if(!running)
				speed = moveSpeed;
				else
				speed = runSpeed;
				if(crouched)
				speed = LevelingScript.crouchSpeedModifier * speed;
			}
			
			if(Input.GetButtonDown("Jump") || Input.GetKeyDown(KeyCode.Space))
			{
				if(flying == false && onGround && !jump)
				{
					jump = true;
					rigidbody.velocity.y = jumpspeed * 1/Time.timeScale;
					//rigidbody.AddForce(Vector3.up * jumpspeed, ForceMode.Impulse);
				}
			}
			
			
			//MOVEMENT starts here
			if(onGround)
			{
				rigidbody.velocity.x = 0;
				rigidbody.velocity.z = 0;
			}
			if(Input.GetButton("Forward")  || Input.GetAxis("Vertical") > 0)
			{
				if(flying)
				{
					rigidbody.velocity = cameraA.transform.forward * speed * (1/Time.timeScale);
				}
				else
				{
					if(onGround)
					{
						var vecA : Vector3 = cameraA.transform.forward;
						vecA.y = 0;
						vecA.Normalize(); //sets the vectors size to one while keeping it's direction
						vecA = vecA * speed * timeMod; //multiply the vector by the forward speed
						rigidbody.velocity.x += vecA.x;
						rigidbody.velocity.z += vecA.z;
					}
				}
			}
			else if(Input.GetButton("Backward") || Input.GetAxis("Vertical") < 0)
			{
				if(flying)
				{
					rigidbody.velocity = cameraA.transform.forward * -1 * speed * (1/Time.timeScale);
				}
				else
				{
					if(onGround)
					{
						var vec2 : Vector3 = cameraA.transform.forward;
						vec2.y = 0;
						vec2.Normalize();
						vec2 = vec2 * -1 * speed * timeMod;
						rigidbody.velocity.x += vec2.x;
						rigidbody.velocity.z += vec2.z;
							
					}
				}
			}
			if(Input.GetButton("Left") || Input.GetAxis("Horizontal") < 0)
			{
				if(turnnotstrafe == true)
				{
					cameraA.transform.Rotate(0,-beta,0, Space.World);
				}
				else
				{
					if(onGround)
					{
						var vec3 : Vector3 = cameraA.transform.right;
						vec3.y = 0;
						vec3.Normalize();
						rigidbody.velocity.x += vec3.x * -1 * speed * timeMod;
						rigidbody.velocity.z += vec3.z * -1 * speed * timeMod;
					}
				}
			}
			else if(Input.GetButton("Right") || Input.GetAxis("Horizontal") > 0)
			{
				if(turnnotstrafe == true)
				{
					transform.Rotate(0,beta,0, Space.World);
				}
				else
				{
					if(onGround)
					{						
						var vec4 : Vector3 = cameraA.transform.right;
						vec4.y = 0;
						vec4.Normalize();
						rigidbody.velocity.x += vec4.x * speed * timeMod;
						rigidbody.velocity.z += vec4.z * speed * timeMod;
					}
					
				}
			}
			
			if( Input.GetButtonDown("Flashlight"))
			{
				myLight.GetComponent("Light").light.enabled = !myLight.GetComponent("Light").light.enabled;
			}
			if(Input.GetButtonDown("Crouch"))
			{
				var capsuleCollider = GetComponent(CapsuleCollider) as CapsuleCollider;
					
				if(!crouched)
				{
					//change the speed
					speed = LevelingScript.crouchSpeedModifier * speed;
					capsuleCollider.height -= 1;
					cameraA.transform.localPosition.y -= 0.4;
					transform.position.y -= 0.4;
					floorCollider.transform.position.y += 0.4;
					crouched = true;
				}
				else
				{
					//check if there is space to uncrouch
					var rayhitC: RaycastHit;
					if(Physics.Raycast(transform.position, transform.up, rayhitC))
					{
						if(Vector3.Distance(rayhitC.point, transform.position) > 1)
						{
							//uncrouch
							if(running)
							speed = runSpeed;
							else
							speed = moveSpeed;
							capsuleCollider.height += 1;
							if(Math.Abs(rigidbody.velocity.y) < 0.1)
							{
								transform.position.y += 0.4;
							}
							cameraA.transform.localPosition.y += 0.4;
							floorCollider.transform.position.y -= 0.4;
							crouched = false;
						}
					}
				}
			}
			if(jump == false && rigidbody.velocity.y > 1 && flying == false) //fix time dilator bug
			{ 
				rigidbody.velocity.y = 1;
			}
			if(jump == true && rigidbody.velocity.y > 5 && flying == false)
			{
				rigidbody.velocity.y -= 0.5;
			}
			
			if(sprinting && Math.Abs(rigidbody.velocity.x + rigidbody.velocity.z) > 0)
			{
				staminaRegen = false;
				if(stamina > staminaDrainRate * Time.deltaTime)
				{
					stamina -= staminaDrainRate * Time.deltaTime;
				}
				else
				{
					stamina = 0;
					wepMgr.SendMessage("Sprinting", false, SendMessageOptions.DontRequireReceiver);
					sprinting = false;
					if(!running)
					speed = moveSpeed;
					else
					speed = runSpeed;
				}
			}
			else if(stamina < 100)//regen stamina
			{
				regenStamina();	
				if(staminaRegen)
				{
					if(stamina < 98)
						stamina += Time.deltaTime * staminaRegenRate;
					else
						stamina = 100;
				}				
			}
			
		}// end !paused statement
		
		
	}//end update
	
	
	function OnGUI () 
	{
		GUI.Label(Rect(300,0,200,20), "Time scale " + Time.timeScale);
		
		if(paused && !locked)
		{			
			if(pausemain)
			{
				GUI.Box( Rect( 0, 0, Screen.width, Screen.height), "", fullScreenPauseBack); // Le Background
				
				GUI.Label( Rect( (Screen.width)-366, (Screen.height)-150, 366, 234), "", levelTitleStyle);
				//GUI.Label( Rect( (Screen.width/2)+30, (Screen.height/2) - 20, 300, 100), "Space isolated for objective system integration. To be implemented in further updates (date unknown). As always, thanks for playing!", lvlSubtitle);			
				
				GUI.Box( Rect( 5, 0, 200, Screen.height), "", transparentGrayStyle);
				if (GUI.Button( Rect( 5, (Screen.height) - 350, 369/2, 40),"   Resume", titleStyle4))
				{
					paused = false;
					pausedmain = false;
					Screen.showCursor = false;
					Screen.lockCursor = true;
					if(timedilation_on)
					{
						Time.timeScale = slowmotion;
						Time.fixedDeltaTime = slowmotion * 0.02f;
					}
					else
					{
						Time.timeScale = 1;
						Time.fixedDeltaTime = 0.02f;
					}
				}
				if (GUI.Button(new Rect (5,(Screen.height) - 300,369/2, 40), "   Restart", titleStyle4)) 
				{
					paused = false;
					pausedmain = false;
					Screen.showCursor = false;
					Screen.lockCursor = true;
					if(timedilation_on)
					{
						Time.timeScale = slowmotion;
						Time.fixedDeltaTime = slowmotion * 0.02f;
					}
					else
					{
						Time.timeScale = 1;
						Time.fixedDeltaTime = 0.02f;
					}
					Application.LoadLevel(Application.loadedLevel);
				}
				if (GUI.Button(new Rect( 5, (Screen.height) - 250, 369/2, 40),"   Objectives", titleStyle4))
				{
					pausedobjectives = true; 
					pausedmain = false;
				}
				if (GUI.Button(new Rect( 5, (Screen.height) - 200, 369/2, 40),"   Skills", titleStyle4))
				{
					pausedskills = true;
					pausedmain = false;
				}
				if (GUI.Button(new Rect( 5, (Screen.height) - 150, 369/2, 40),"   Controls", titleStyle4))
				{
					pausedcontrols = true;
					showinghelp = true;
					pausedmain = false;
				}
				if (GUI.Button(new Rect( 5, (Screen.height) - 100, 369/2, 40),"   Settings", titleStyle4))
				{
					pausedsettings = true;
					pausedmain = false;
				}
				if (GUI.Button(new Rect( 5, (Screen.height) - 50, 369/2, 40),"   Exit", titleStyle4))
				{
					Application.Quit();
				}
				/*if (GUI.Button(new Rect ((Screen.width/2)-40,(Screen.height / 2) - 20,80,20), "TOFU")) 
				{
	    			
				}*/
			}
			
			if (pausedobjectives) 
			{
				GUI.Label( Rect( 0, 0, Screen.width, Screen.height), "", fullScreenPauseBack); // Le Background
				GUI.Label( Rect( 50, 10, Screen.width, 36), "Objectives", levelTitleStyle);
				if(GUI.Button( new Rect(5, 10, 40, 36), "", backArrowStyle))
				{
					pausedobjectives = false;
					pausemain = true;
				}
			}
			
			if (pausedskills) 
			{
				GUI.Label( Rect( 0, 0, Screen.width, Screen.height), "", fullScreenPauseBack); // Le Background
				GUI.Label( Rect( 50, 10, Screen.width, 36), "Skills", levelTitleStyle);
				if(GUI.Button( new Rect(5, 10, 40, 36), "", backArrowStyle))
				{
					pausedskills = false;
					pausemain = true;
				}
				
			}
			
			if (pausedsettings) 
			{
				GUI.Label( Rect( 0, 0, Screen.width, Screen.height), "", fullScreenPauseBack); // Le Background
				GUI.Label( Rect( 50, 10, Screen.width, 36), "Settings", levelTitleStyle);
				if(GUI.Button( new Rect(5, 10, 40, 36), "", backArrowStyle)) 
				{
					pausedsettings = false;
					pausemain = true;
				}
			}
			if (pausedcontrols) 
			{
				GUI.Label( Rect( 0, 0, Screen.width, Screen.height), "", fullScreenPauseBack); // Le Background
				GUI.Label( Rect( 50, 10, Screen.width, 36), "Controls", levelTitleStyle);
				if(GUI.Button( new Rect(5, 10, 40, 36), "", backArrowStyle)) 
				{
					pausedcontrols = false;
					pausemain = true;
				}
				
				if(showinghelp) { // The first screen of help shows (page one). 
					GUI.Label ( Rect( ((Screen.width - helpImage1.width)/2), ((Screen.height - helpImage1.height)/2), helpImage1.width, helpImage1.height), "", help1Style);
				}	
			}		
			
		}
		var myStyle = new GUIStyle();
    	myStyle.font = myFont;
		if(!paused)
		{

			GUI.Box(Rect(Screen.width - 426, 10, 400, 32),"");
			
			// GUI.Box(new Rect(55, 40, dilatorEnergy, 32), "" + dilatorEnergy);
			
			
			
			GUI.Box(Rect(Screen.width - 425, 12, dilatorEnergy * 4, 28), "", blueTimeBar);
		}
		if(!paused && timedilation_on)
		{
			var temp = new GUIStyle();
			temp.normal.background = pic;
			GUI.Box(Rect(0, 0, Screen.width, Screen.height), "", temp);
		}
		if(!paused)
		{
			GUI.Label(Rect(200, 0, 250, 20), "Stamina " + stamina);
		}
	}
	
	function addEnergyRate(rate: float) {
        while(timedilation_on == false && dilatorEnergy<100)
        {
        	yield WaitForSeconds(1/rate);
        	dilatorEnergy += 1;
        }
	}
	
	function subtEnergyRate(rate: float) {
        while(timedilation_on == true && dilatorEnergy>0)
        {
        	yield WaitForSeconds(1/rate);
        	dilatorEnergy -= 1;
        }
	}
	
	function regenStamina()
	{ 
		if(staminaRegen == false) //make sure we aren't already regening
		{
			yield WaitForSeconds(3); //wait three seconds before regenning stamina
			staminaRegen = true;
		}
	}
	
	function Lock()
	{
		paused = true;
		locked = true;
		transform.rigidbody.velocity = Vector3(0,0,0); //stop that motion pls
		Time.timeScale = 1;
		Time.fixedDeltaTime = 0.02f;
		Screen.showCursor = true;
		Screen.lockCursor = false;
		wepMgr.SendMessage("disableWeps");
		cameraA.SendMessage("setSensitivity", 0);
	}
	
	function Unlock()
	{
		paused = false;
		locked = false;
		Screen.showCursor = false;
		Screen.lockCursor = true;
		Time.timeScale = 1;
		Time.fixedDeltaTime = 0.02f;
		wepMgr.SendMessage("enableWeps");
		cameraA.SendMessage("resetSensitivity");
	}

	function OnGround(boolIn: System.Boolean)
	{
		onGround = boolIn;
	}
