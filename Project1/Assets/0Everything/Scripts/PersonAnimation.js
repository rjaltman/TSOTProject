#pragma strict

function Start () 
{
}

function Update () {
	if(	Input.GetKeyDown(KeyCode.Space)	)
	{
		//animation.Play("jump");
	}
	if(Input.GetKeyDown(KeyCode.Q))
	{
		if(Input.GetKey(KeyCode.W))
		{
			animation.Play("run");
			animation["run"].speed = 1 * 1/Time.timeScale;
		}
		else if(Input.GetKey(KeyCode.S))
		{
			animation.Play("run");
			animation["run"].speed = -1 * 1/Time.timeScale;
		}
	}
	if(Time.timeScale == 1)
	{
		
		if(Input.GetKeyDown(KeyCode.W))
		{
			//animation.Play("firststep");
			animation.Play("run");
		}
		else if(Input.GetKeyDown(KeyCode.S))
		{
			animation.Play("run");
		}
		else if (!Input.GetKey(KeyCode.W) && !Input.GetKey(KeyCode.S))
		{
			animation.Stop("run");
			//animation.CrossFade("stand");
		}
	}
	else
	{
		if(Input.GetKeyDown(KeyCode.W))
		{
			//animation.Play("firststep");
			animation.Play("run");
		}
		else if(Input.GetKeyDown(KeyCode.S))
		{
			animation.Play("run");
		}
		else if (!Input.GetKey(KeyCode.W) && !Input.GetKey(KeyCode.S))
		{
			animation.Stop("run");
			//animation.CrossFade("stand");
		}
	}
}