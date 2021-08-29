google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);
//Variables Grafico
var options_stacked = { isStacked: true, height: 300, legend: {position: 'top', maxLines: 3}, vAxis: {minValue: 0}};
var options_histograma = {  title: 'Aplicacion Teorema Central del Limite',
                            legend: { position: 'top' },
                            colors: ['orange','blue'],
                            chartArea: { width: 801 },
                            axisTitlesPosition:'in',
                            bar: { gap: 0.02 },
                            histogram: {
                              bucketSize: 1,
                              maxNumBuckets: 300
                            },
                            animation:{ startup:'true'}
                          };
var options_histograma2 = { title: 'Distribucion de Frecuencias',
                            legend: { position: 'top' },
                            colors: ['green'],
                            chartArea: { width: 801 },
                            axisTitlesPosition:'in',
                            bar: { gap: 0.02 },
                            histogram: {
                                          bucketSize: 1,
                                          maxNumBuckets: 300
                                        }
                          };
var chart ;
var chart2 ;
var data;
var data2;
//Arrays de valores calculados
var listaValores;
var listaNormal;
var distribucionElegida;
var frecuenciasRelativas;
var frecuenciasAbsolutas;
var probabilidadTeorica;
var valores;
var ytcl;
var media = 0;
var varianza = 1;
var miN = 100;

function valida(){
  return false;
}

function sortNumber(a,b) {
    return a - b;
};

function fact(x)
{
  if (x == 0)
  {
    return 1;
  }
    return x * fact(x-1);
};

function trunc (x, posiciones = 0) {
  var s = x.toString()
  var l = s.length
  var decimalLength = s.indexOf('.') + 1
  var numStr = s.substr(0, decimalLength + posiciones)
  return Number(numStr);
};

function generarGraficas (){
  chart = new google.visualization.Histogram(document.getElementById('chart_div'));
  chart2 = new google.visualization.Histogram(document.getElementById('chart_div_2'));
};

function aplicarTCL( x ){
  return ( x - media )/Math.sqrt(varianza);
};

function probBinomial(n,p,x){
  var b1 = fact(n)/(fact(x)*fact(n-x));
  var b2 = Math.pow(p,x);
  var b3 = Math.pow(1-p,n-x);
  return b1*b2*b3;
};

function probPoisson(k,l){
  var p1 = Math.pow(Math.E,-l);
  var p2 = Math.pow(l,k);
  var p3 = fact(k);
  return p1*p2/p3;
};

function generarValorBinomial( n,  p){
  var i = 0;
  var res = 0;
  for( i=0;i < parseInt(n);i++ ){
    if(Math.random() <= parseFloat(p)){
      res++;
    }
  }
  return res;
};

function generarValorPoisson(l){
    var res = 0;
    var i = 0;
    while(  res < l ){
      res += -Math.log(Math.random());
      i++;
    }
    return i;
};

function generarMediaVarianza(){
  media = 0;
  varianza = 0;
  for(i = 0; i<distribucionElegida.length;i++){
    media = media + distribucionElegida[i];
  }
  media = media / distribucionElegida.length;
  for(i = 0; i<distribucionElegida.length;i++){
    varianza = varianza + Math.pow(distribucionElegida[i] - media,2);
  }
  varianza = varianza / ( distribucionElegida.length - 1 );
};

function generarValores(n,p,m){
  var lista = [];
  var distribucion = document.getElementById("distribuciones");
  var i = 0;
  for(i = 0;i<m;i++){
    lista.push(generaValorNormal(0,1));
  }
  listaNormal = lista.sort(sortNumber);
  lista = [];
  listaValores = [];
  i = 0;
  if( distribucion != null && distribucion.value == " Distribucion Binomial " ){
    for(i = 0;i<m;i++){
      lista.push(generarValorBinomial(n,p));
    }
    listaValores.push(["X","Binomial","Normal"]);
  }else{
    for(i = 0;i<m;i++){
      lista.push(generarValorPoisson(p));
    }
    listaValores.push(["X","Poisson","Normal"]);
  }
  distribucionElegida = lista.sort(sortNumber);
  i = 0;
  var res = "";
  for(i = 0;i<m;i++){
    listaValores.push([i,distribucionElegida[i],listaNormal[i]]);
  }
  generarMediaVarianza();
};

function generaValorNormal(mu,sig){
  var t = 0;
  var i = 0;
  for(i=0;i<12;i++)
  {
    t += Math.random();
  }
  t = t -6;
  t = t*sig + mu;
  return t;
};

function insertarFilaValoresTabla(row,obj){
  var celda1 = row.insertCell(0);
  var celda2 = row.insertCell(1);
  var celda3 = row.insertCell(2);
  var celda4 = row.insertCell(3);
  celda1.innerHTML = trunc(obj[0],3);
  celda2.innerHTML = trunc(obj[1],3);
  celda3.innerHTML = trunc(obj[2],3);
  celda4.innerHTML = trunc(aplicarTCL(parseInt(obj[1])),3);
};

/*
  Pone el array de valores en la primera tabla id="tabla"
*/
function ponerValoresTabla(){
  var i = 1;
  var tabla = document.getElementById("tabla");
  tabla.insertRow(0).innerHTML ="<thead><tr><th>"+listaValores[0][0]+"</th><th>"+listaValores[0][1]+"</th><th>"+listaValores[0][2]+"</th><th>Ytcl( "+listaValores[0][1]+" )</th></tr></thead>";
  for ( i=1 ; i < listaValores.length ; i++){
     insertarFilaValoresTabla(tabla.insertRow(i),listaValores[i]);
  }
};

function generarFrecuencias(p){
  var i = 1;
  var cont = 1;
  frecuenciasRelativas = [];
  frecuenciasAbsolutas = [];
  probabilidadTeorica = [];
  valores = [];
  var actual = distribucionElegida[0];
  for(i = 1 ; i< distribucionElegida.length;i++){
    if(actual != distribucionElegida[i]){
      valores.push(actual);
      frecuenciasAbsolutas.push(cont);
      frecuenciasRelativas.push(cont/distribucionElegida.length);
      if(document.getElementById("distribuciones").value ==  " Distribucion Binomial " ){
          probabilidadTeorica.push(probBinomial(miN,parseFloat(p),actual));
      }else{
        probabilidadTeorica.push(probPoisson(actual,parseFloat(p)));
      }
      actual = distribucionElegida[i];
      cont = 1;
    }else{
      cont++;
    }
  }
  valores.push(actual);
  frecuenciasAbsolutas.push(cont);
  frecuenciasRelativas.push(cont/distribucionElegida.length);
  if(document.getElementById("distribuciones").value ==  " Distribucion Binomial " ){
      var n = parseInt(document.getElementById("ene").value);
    probabilidadTeorica.push(probBinomial(n,parseFloat(p),actual));
  }else{
    probabilidadTeorica.push(probPoisson(actual,parseFloat(p)));
  }
};

function ponerFilaFrecuencias(fila,i){
  fila.insertCell(0).innerHTML = valores[i];
  fila.insertCell(1).innerHTML = frecuenciasAbsolutas[i];
  fila.insertCell(2).innerHTML = frecuenciasRelativas[i];
  fila.insertCell(3).innerHTML = trunc(probabilidadTeorica[i],3);
};

function ponerFrecuencias(){
  var tabla = document.getElementById("tablaFrecuencias");
  var row = tabla.insertRow(0).innerHTML ="<thead><tr><th>  Xi  </th><th>  fi  </th><th>  hi  </th><th>  Pt  </th></tr></thead>";
  var i = 0;
  for(i = 1 ;i<= valores.length;i++){
    ponerFilaFrecuencias(tabla.insertRow(i),i-1);
  }
};

function generarYTCLvsNormal(){
    var lista = [];
    var i = 0;
    ytcl=[];
    lista.push(["Normal","Ytcl"]);
    for(i=0;i<listaNormal.length;i++){
      ytcl.push(aplicarTCL(distribucionElegida[i]));
      lista.push([listaNormal[i],aplicarTCL(distribucionElegida[i])]);
    }
    return lista;
};

function generarDistribucionFrecuencias(){
    var i = 0;
    var lista = [];
    for (i = 0; i< listaValores.length;i++){
      lista.push([listaValores[i][1]]);
    }
    return lista;
  };

  function ponerMediaVarianzaYTCL(){
    var media2 = 0;
    var varianza2 = 0;
    for(i = 0; i<ytcl.length;i++){
      media2 = media2 + ytcl[i];
    }
    media2 = media2 / ytcl.length;
    for(i = 0; i<ytcl.length;i++){
      varianza2 = varianza2 + Math.pow(ytcl[i] - media2,2);
    }
    varianza2 = varianza2 / ( ytcl.length - 1 );
    document.getElementById("mediay").innerHTML=" media_ytcl =  " + media2;
    document.getElementById("varianzay").innerHTML=" S2_ytcl =  " +varianza2;
  };

  function drawChart() {
    ponerNPyM(100,0.4,1000);
    borrarTablas();
    generarGraficas();//GRaficas Inicializa
    generarValores(parseInt(100),parseFloat(0.4),1000);
    ponerValoresTabla();
    generarFrecuencias(0.4);
    ponerFrecuencias();
    ponerMediaVarianza();
    data = new google.visualization.arrayToDataTable(generarYTCLvsNormal());
    data2 = new google.visualization.arrayToDataTable(generarDistribucionFrecuencias());
    ponerMediaVarianzaYTCL();
    chart.draw(data , options_histograma);
    chart2.draw(data2 , options_histograma2);
    return false;
  };

  function esBinomial(){
    return document.getElementById("distribuciones").value ==  " Distribucion Binomial ";
  };

  function nuevoCaso(){
    borrarTablas();
    chart.clearChart();
    chart2.clearChart();
    var text = "";
    var n = parseInt(document.getElementById("ene").value);
    var p = parseFloat(document.getElementById("prob").value);
    var m = parseFloat(document.getElementById("tamm").value);
    text = comprobarValores(n,p,m,text);
    if(text != ""){
      document.getElementById("errores1").innerHTML = text;
      return null;
    }
    miN = parseInt(n);
    generarValores(n,p,m);
    ponerValoresTabla();
    generarFrecuencias(p);
    ponerFrecuencias();
    ponerMediaVarianza();
    data = new google.visualization.arrayToDataTable(generarYTCLvsNormal());
    data2 = new google.visualization.arrayToDataTable(generarDistribucionFrecuencias());
    ponerMediaVarianzaYTCL();
    chart.draw(data , options_histograma);
    chart2.draw(data2 , options_histograma2);
    return false;
  };

  function ponerMediaVarianza(){
    document.getElementById("media").innerHTML = " media =  " + media;
    document.getElementById("varianza").innerHTML = " S2 = " + trunc(varianza,4);
  };

  function validateDecimal(valor) {
    var RE = /^[0-9]+([\.][0-9]+)?$/;
    if (RE.test(valor)) {
      return valor<1&&valor>0;
    } else {
      return false;
    }
  };

  function comprobarValores(n,p,m,text){
    if(!Number.isInteger(m)|| m < 0){
      text = "El tamaño muestral no es valido .";
    }
    if(esBinomial() && !validateDecimal(p)){
      text = "La probabiliad p, no es un numero decimal, entre ( 0 , 1 ).\n"
    }
    if(!esBinomial() && !Number.isInteger(p)){
      text = "Landa l no es un entero.\n";
    }

    if(text != null){
      return text;
    }
    if(esBinomial() && n < 1){
      text = text + "El numero de repeticiones del experimento tiene que ser mayor que uno. n > 1.\n";
    }
    if(!esBinomial() && p<1){
      text = text + "Landa l tiene que ser mayor que uno. l > 1.\n";
    }
    if (m < 1){
      text = text+"El tamaño muestral tiene que ser mayor que uno. m > 1.\n";
    }
    return text;
  };

  function borrarTablas()
  {
    document.getElementById("tabla").innerHTML= "";
    document.getElementById("tablaFrecuencias").innerHTML= "";
    document.getElementById("probIntt").innerHTML = "";
    document.getElementById("probInt").innerHTML = "";
    document.getElementById("varianza").innerHTML = "";
    document.getElementById("media").innerHTML = "";
    document.getElementById("error").innerHTML = "";
    document.getElementById("varianzay").innerHTML = "";
    document.getElementById("mediay").innerHTML = "";
    document.getElementById("errores1").innerHTML = "";
    document.getElementById("errores2").innerHTML = "";
    listaValores = null;
    listaNormal = null;
    distribucionElegida = null;
    frecuenciasRelativas = null;
    frecuenciasAbsolutas = null;
    probabilidadTeorica = null;
    ytcl = null;
    valores= null;
  };
  function ponerNPyM(n,p,m){
    document.getElementById("ene").value = n;
    document.getElementById("prob").value = p;
    document.getElementById("tamm").value = m;
  };
  function hideLlanda()
  {
    var distribucion = document.getElementById("distribuciones");
    if(distribucion != null && distribucion.value == " Distribucion Binomial "  )
    {
      document.getElementById("ene").style.display = "block";
      document.getElementById("labelene").style.display = "block";
      document.getElementById("etqP").innerHTML = 'p=';
    }else if ( distribucion != null ){
      document.getElementById("ene").style.display = "none";
      document.getElementById("labelene").style.display = "none";
      document.getElementById("etqP").innerHTML = 'l=';
    }
  };

  function generarIntervalo()
  {
    var a = document.getElementById("a").value;
    var b = document.getElementById("b").value;
    var i = 0;
    var pt = 0;
    var ph = 0;
    while ( i < valores.length && a != valores[i] )
    {
      i++;
    }
    var j = i.valueOf();
    while( j < valores.length && b !=  valores[j] )
    {
      j++;
    }
    if(j == valores.length || i == valores.length){

      document.getElementById("errores2").innerHTML = "a y b tienen que pertenecer a {"+valores.toString()+"}";
      return false;
    }else{
      document.getElementById("errores2").innerHTML = "";
    }
    if( document.getElementById("intervalos").value == "(a,b)" )
    {
        var k = i+1;
        for( k = i+1; k<j; k++)
        {
          ph = ph + frecuenciasRelativas[k] ;
          pt = pt + probabilidadTeorica[k];
        }
        document.getElementById("probInt").innerHTML ='P( (a,b) )=' + trunc(ph,4).toString();
        document.getElementById("probIntt").innerHTML ='Pt( (a,b) )='+trunc(pt,4).toString();
        document.getElementById("error").innerHTML ='Error( (a,b) )='+trunc(Math.abs(pt-ph),4);
    }else if (document.getElementById("intervalos").value == "[a,b)"){
      var k = i;
      for( k = i; k<j; k++)
      {
        ph = ph + frecuenciasRelativas[k] ;
        pt = pt + probabilidadTeorica[k];
      }
      document.getElementById("probInt").innerHTML ='P( [a,b) )=' + trunc(ph,4).toString();
      document.getElementById("probIntt").innerHTML ='Pt( [a,b) )='+trunc(pt,4).toString();
      document.getElementById("error").innerHTML ='Error( [a,b) )='+trunc(Math.abs(pt-ph),4);
    }else if (document.getElementById("intervalos").value == "(a,b]"){
      var k = i+1;
      for( k = i+1; k<j+1; k++)
      {
        ph = ph + frecuenciasRelativas[k] ;
        pt = pt + probabilidadTeorica[k];
      }
      document.getElementById("probInt").innerHTML ='P( (a,b] )=' + trunc(ph,4).toString();
      document.getElementById("probIntt").innerHTML ='Pt( (a,b] )='+trunc(pt,4).toString();
      document.getElementById("error").innerHTML ='Error( (a,b] )='+trunc(Math.abs(pt-ph),4);
    }else{
      var k = i;
      for( k = i; k<j+1; k++)
      {
        ph = ph + frecuenciasRelativas[k] ;
        pt = pt + probabilidadTeorica[k];
      }
      document.getElementById("probInt").innerHTML ='P( [a,b] )=' + trunc(ph,4).toString();
      document.getElementById("probIntt").innerHTML ='Pt( [a,b] )='+trunc(pt,4).toString();
      document.getElementById("error").innerHTML ='Error( [a,b] )='+trunc(Math.abs(pt-ph),4);
    }
    return false;
  };
