#pragma strict
var colorStart : Color;
var colorEnd : Color;
var duration : float = 1.0;

function Update () 
{
    var lerp : float = Mathf.PingPong (Time.time, duration) / duration;
    renderer.material.color = Color.Lerp (colorStart, colorEnd, lerp);
}