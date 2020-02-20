


function agiloader (options) {

  var reqfilesbefore = [];
  var bytesAll = Number (options ['scriptSize']);
  var reqfileBytesLoaded = [];
  var preboxin = document.getElementById("preload-box-in");

  var loadedBefore = 0;

  setTimeout( function () {
    preboxin.style.display = "block";
  },3000);

  document.getElementById('preload-box').innerHTML += '<div id="hidden-preload" style="display:none;"><div>';

  if ( typeof options['filesbefore'] === 'object' ) {

    var i = options['filesbefore'].length;
    while ( i > 0 ) {
      i--;
      bytesAll += options['filesbefore'][i]['size'];
    }
    i = options['filesbefore'].length;
    while (i > 0) {
      i--;
      reqfilesbefore[i] = new XMLHttpRequest();
      reqfilesbefore[i].agiindex = i;
      reqfilesbefore[i].addEventListener("load", function () {
        document.getElementById('hidden-preload').innerHTML += '<img alt="" src="'+options['filesbefore'][loadedBefore]['url']+'">';
        loadedBefore++;
      });
      reqfilesbefore[i].open("GET", options['filesbefore'][i]['url']);
      reqfilesbefore[i].send();

      reqfilesbefore[i].addEventListener("progress", function(event) {
        if (event.loaded > 0)  {
          reqfileBytesLoaded[ event.currentTarget.agiindex ] = ((event.loaded / bytesAll) * 100).toFixed();
          calcLoaded(options, reqfileBytesLoaded, 0);
        }
      }, false);
    }

  }

  var lbsint = setInterval(function () {

    if (loadedBefore === options['filesbefore'].length) {
      clearInterval(lbsint);
      loadscript(options, reqfileBytesLoaded, bytesAll);
    }

  },100);

}




function calcLoaded (options, reqfileBytesLoaded, scritptBytesLoaded ) {

  var size = Number(scritptBytesLoaded);
  var i = options['filesbefore'].length;
  var loaded = 0;
  while (i > 0) {
    i--;
    loaded = reqfileBytesLoaded[i];
    if (loaded !== undefined) {
      size += Number(loaded);
    }

  }
  document.getElementById('preload-box-percent').innerText = size + "%";
  return size;

}



function loadscript(options, reqfileBytesLoaded, bytesAll) {

  var req = new XMLHttpRequest();
  var reqfiles = [];
  if ( typeof options['files'] === 'object' ) {

    var i = options['files'].length;
    while (i > 0) {
      i--;
      reqfiles[i] = new XMLHttpRequest();
      reqfiles[i].addEventListener("load", function (event) {});
      reqfiles[i].open("GET", options['files'][i].url);
      reqfiles[i].send();
    }
  }

  req.open("GET", options['script']);
  req.send();

  req.addEventListener("progress", function(event) {
    if (event.loaded > 0) {
      scriptBytesLoaded = ((event.loaded / bytesAll) * 100).toFixed();
      calcLoaded(options, reqfileBytesLoaded, scriptBytesLoaded);
    }
  }, false);

  req.addEventListener("load", function(event) {
    var prebox = document.getElementById("preload-box");
    var e = event.target;
    var s = document.createElement("script");
    s.innerHTML = e.responseText;
    document.documentElement.appendChild(s);
    setTimeout(function () {
      prebox.style.display = "none";
    },50);
    s.addEventListener("load", function() {
      console.info('loaded 2');
    });
  }, false);

}






