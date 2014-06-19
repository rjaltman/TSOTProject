#pragma strict

function Start () {

}

function Update () {

}

// Draw the waypoint pickable gizmo
function OnDrawGizmos () {
    Gizmos.DrawIcon (transform.position, "Waypoint.tif");
}