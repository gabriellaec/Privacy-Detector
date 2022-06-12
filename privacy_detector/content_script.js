function getExternalConnections(){
    var connections = Array.prototype.map.call(
      document.querySelectorAll("link, img, video, audio, source, script"),
      (tag) => {return tag.href || tag.src;}
    )
    return connections;
  }
function canvasFingerprint(){
  const FP = import('https://openfpcdn.io/fingerprintjs/v3').then(FingerprintJS => FingerprintJS.load())
  FP.then(fp => fp.get()).then(result => {
      if (result.visitorId){
        return result.visitorId;
      }else{
        return null;
      }
    }
  )
}
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.method == "localStorageData"){
        sendResponse({data: Object.entries(localStorage)});
    }
    else if (request.method == "sessionStorageData"){
        sendResponse({data: Object.entries(sessionStorage)});
    }
    else if (request.method == "externalConnectionsData"){
        sendResponse({data: getExternalConnections()});
    }
    else if (request.method == "canvasFingerprintData"){
        sendResponse({data: canvasFingerprint()});
    }
  });