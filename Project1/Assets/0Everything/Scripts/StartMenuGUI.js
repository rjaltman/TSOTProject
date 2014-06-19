#pragma strict
@script ExecuteInEditMode()
var backdrop : Texture2D; // our backdrop image goes in here.
private var isLoading = false; // if true, we'll display the "Loading..." message
public var myFont: Font;
public var useBackdrop: System.Boolean;
private var	backdropStyle: GUIStyle = new GUIStyle();
backdropStyle.normal.background = backdrop;
var showingHelp: System.Boolean = false;
var helpImage1: Texture2D;
var helpImage2: Texture2D;
var helpPage: int = 1;
private var help1Style: GUIStyle = new GUIStyle();
help1Style.normal.background = helpImage1;
private var help2Style: GUIStyle = new GUIStyle();
help2Style.normal.background = helpImage2;
var titleStyle: GUIStyle = new GUIStyle();
titleStyle.font = myFont;

function OnGUI()
{
	if(useBackdrop)
	{
 		GUI.Label ( Rect( (Screen.width - (Screen.height * 2)) * 0.75, 0, Screen.height * 2, Screen.height), "", backdropStyle); 
	}
	if(!showingHelp)
	{
		GUI.Label ( Rect( (Screen.width/2) - 50, (Screen.height/4), 400, 100), "The Speed Of Time", titleStyle);
		if (GUI.Button( Rect( (Screen.width/2)-70, (Screen.height/2)-40, 140, 40), "Play"))
	  	{
	  		isLoading = true;
	  		Application.LoadLevel("level1"); // load the game level. 
	  	}
	  	if (GUI.Button( Rect( (Screen.width/2)-70, (Screen.height/2)+10, 140, 40), "Help"))
	  	{
	  		showingHelp = true;
	  	}
		if (isLoading)
		{
	  		GUI.Label ( Rect( (Screen.width/2)-110, (Screen.height / 2) - 60, 400, 70), "Loading...", titleStyle); 
		}
	}
	else
	{
		if(helpPage == 1)
		{
			GUI.Label ( Rect( 50, 50, helpImage1.width/1.1, helpImage1.height/1.05), "", help1Style); 
		}
		else
		{
			GUI.Label ( Rect( 50, 50, helpImage2.width/1.05, helpImage2.height/1.05), "", help2Style); 
		}
	}
}
function Start ()
{
	Time.timeScale = 1;
	Time.fixedDeltaTime = 0.2f;
}

function Update () 
{

}