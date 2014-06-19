#pragma strict
//Takes a screenshot when you press F12
var screenshotInt = 0;

function Start () {

}

function Update () 
{
	if(Input.GetKeyDown(KeyCode.F12))
	{
		Application.CaptureScreenshot("Screenshot" + screenshotInt + ".png");
		screenshotInt += 1;
	}
}
