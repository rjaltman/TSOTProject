/*
To implement a username system, which is basically the start of everything,
this script has to have a list of all the players.
If it's a server, it updates this list when a new player joins, and tells the
other players that a new player has joined with the certain username. It also
tells the new player the usernames of all the current players.
*/

#pragma strict
var text: String;
var zecollider: GameObject; //drag on the zecollider prefab
var hostData: HostData[];
private var player: GameObject;

private var showConnectGUI = false;
private var showLanGUI = false;
private var showOnlineGUI = false;
private var showCreateGUI = false;
private var showOnlineConnectGUI = false;
private var IP: String = "";
private var serverName: String = "";
var username: String = ""; //this players username
var scrollPosition : Vector2;
private var serverInt: int;

function Start () 
{
    MasterServer.ipAddress = "99.67.193.154";
    MasterServer.port = 23466;
    Network.natFacilitatorIP = "99.67.193.154";
	player = GameObject.FindWithTag("CamCollider");
}

function OnGUI()
{
	//if they create or connect, delete and respawn
	if(GUI.Button(Rect(2,Screen.height - 22,100,20),"Create"))
	{
		showCreateGUI = true;
	}
	if(GUI.Button(Rect(2,Screen.height - 44,100,20),"Connect"))
	{
		//ask for IP and username
		showConnectGUI = true;
		//ConnectToServer();
		
	}
	if(GUI.Button(Rect(104,Screen.height - 22,100,20),"Respawn"))
	{
		Respawn();
	}
	GUI.Label(Rect(2,Screen.height - 88,500,20), text);
	GUI.Label(Rect(2,Screen.height - 66,500,20), "IP: " + IP);
	if(showConnectGUI)
	{
		//two buttons "LAN" "Online"
		if(GUI.Button(Rect(10, Screen.height/2, 100, 20), "LAN"))
		{
			showConnectGUI = false;
			showLanGUI = true;
		}
		else if(GUI.Button(Rect(10, Screen.height/2+20, 100, 20), "Online"))
		{
			showConnectGUI = false;
			showOnlineGUI = true;
		}
		
	}
	if(showCreateGUI)
	{
		serverName = GUI.TextField (Rect (50, Screen.height/2, 180, 20), serverName, 25);
		if(GUI.Button(Rect(50, Screen.height/2 + 20, 100, 20), "Create"))
		{
			showCreateGUI = false;
			CreateServer("default", serverName);
			Destroy(player);
			player = Network.Instantiate(zecollider, transform.position, transform.rotation, 0);
		}
		if(GUI.Button(Rect(150, Screen.height/2 + 20, 100, 20), "Cancel"))
		{
			showCreateGUI = false;
		}
		
	}
	if(showOnlineGUI)
	{
		FetchList();
		scrollPosition = GUI.BeginScrollView (Rect (10,100,400,100),
        scrollPosition, Rect (0, 0, 400, 200));
        if(hostData != null)
        {
	        for (var i : int = 0; i < hostData.Length; i++)
	        {
	        	if(GUI.Button(Rect(0,i*20,400,20), hostData[i].gameName + "    " + hostData[i].ip[i]))
	        	{
	        		serverInt = i;
	        		showOnlineGUI = false;
	        		showOnlineConnectGUI = true;
	        	}
	    	}
    	}
    	else
    	{
    		GUI.Label(Rect(0,20,400,20), "No Online Servers Found");
    	}
        GUI.EndScrollView ();
	}
	if(showOnlineConnectGUI)
	{
		username = GUI.TextField (Rect (80, Screen.height/2 + 10, 180, 20), username, 25);
		GUI.Label(Rect(10, Screen.height/2 + 10, 200, 20), "Username: ");
		if(GUI.Button(Rect(80, Screen.height/2 + 30, 100, 20), "Connect"))
		{
        	Network.Connect(hostData[serverInt]);
        	showOnlineConnectGUI = false;
        }
	}
	if(showLanGUI)
	{
		IP = GUI.TextField (Rect (80, Screen.height/2 - 20, 180, 20), IP, 25);
		GUI.Label(Rect(60, Screen.height/2 - 20, 20, 20), "IP: ");
		username = GUI.TextField (Rect (80, Screen.height/2 + 10, 180, 20), username, 25);
		GUI.Label(Rect(10, Screen.height/2 + 10, 200, 20), "Username: ");
		if(GUI.Button(Rect(80, Screen.height/2 + 30, 100, 20), "Connect"))
		{
			ConnectToServer();
			showConnectGUI = false;
		}
		if(GUI.Button(Rect(180, Screen.height/2 + 30, 100, 20), "Cancel"))
		{
			showConnectGUI = false;
		}
	}
}

function Update () 
{
	if(player == null) //if we died, because of the l33t
	{
		player = Network.Instantiate(zecollider, transform.position, transform.rotation, 0);
	}
}

function Respawn()
{
	Network.Destroy(player);
	player = Network.Instantiate(zecollider, transform.position, transform.rotation, 0);
}

function CreateServer(type: String, name: String)
{
    Network.InitializeServer(32, 25000, !Network.HavePublicAddress); //have it use nat later
    text = "Server Up! IP: " + Network.player.ipAddress;
    IP = Network.player.ipAddress;
    MasterServer.RegisterHost("default", name, "this is a comment, so l33t");
}

function ConnectToServer () 
{
	if(IP != "")
	{
		Network.Connect(IP, 25000);
	}
	else
	{
		Network.Connect("127.0.0.1", 25000);
	}
	//Respawn();
}

function OnPlayerConnected(player: NetworkPlayer) 
{
	text = "A Player Connected!";
}

function OnConnectedToServer() 
{
	text = "Connected!";
	Respawn();
}

function FetchList()
{
	MasterServer.RequestHostList("default");
	if (MasterServer.PollHostList().Length != 0) 
	{
        hostData = MasterServer.PollHostList();
        /*for (var i : int = 0; i < hostData.Length; i++)
        {
        	/Debug.Log("Game name: " + hostData[i].gameName);
    	}*/
    }
}