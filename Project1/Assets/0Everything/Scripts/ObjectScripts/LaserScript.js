#pragma strict

function Start () {

}

function Update () 
{
    var lineRenderer : LineRenderer = GetComponent(LineRenderer);
    lineRenderer.useWorldSpace = false;
    lineRenderer.SetVertexCount(2);
    var hit : RaycastHit;
    Physics.Raycast(transform.position,transform.forward,hit);
    if(hit.collider){
    lineRenderer.SetPosition(1,Vector3(0,0,hit.distance));
    }
    else{
        lineRenderer.SetPosition(1,Vector3(0,0,5000));
    }
}