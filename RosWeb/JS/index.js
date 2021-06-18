let ip = getCookie("connection");
if(ip != "" && ip != "null") 
  $("#status").attr("src", "Imagenes/green.png");

function pairDevice(){
  // Complete code
  //IP completa robot -> 172.18.224.94 || 192.168.1.72
  let ipA = parseInt("172").toString(16); // AC
  let ipB = parseInt("18").toString(16); // 12
  let val = $('#pin').val();
  if(val.length < 4) alert("Pon un pin valido!");
  val = ipA + "." + ipB + "." + val[0] + val[1] + "." + val[2] + val[3]; // ac.12 [e0.5e] - 
  var splitData = val.split(".");
  for (var i = 0; i < splitData.length; i++){
      splitData[i] = parseInt(splitData[i], 16);
  }
  var ip = splitData.join("."); // 172.18.224.94
  console.log(ip);
  connect(ip);
}