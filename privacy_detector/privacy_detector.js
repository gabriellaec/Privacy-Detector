// ---------------------------------------------------------------//
// ---------------------- Privacy Detector ---------------------- //
// --------------------------------------------------------------//

var cookieScore = 0;

function showTabInfo(tabs) {
    let tab = tabs.pop();

    var risk_score =0;

// -------------- Cookies -------------- //
    var gettingAllCookies = browser.cookies.getAll({url: tab.url});
    gettingAllCookies.then((cookies) => {
  
      var activeTabUrl = document.getElementById('header-title');
      var text = document.createTextNode(tab.title);
      var cookieStats = document.getElementById('cookie-stats');
      activeTabUrl.appendChild(text);

      var total_cookies = 0;
      var session_cookies = 0;
      var persistent_cookies = 0;
      var first_party_cookies = 0;
      var third_party_cookies = 0;
  
      if (cookies.length > 0) {
        for (let cookie of cookies) {

          if ((tab.url).includes(cookie.domain)){
            first_party_cookies++;
          }else{
            third_party_cookies++;
          }

          if(String(cookie.expirationDate)!=("undefined")){
            persistent_cookies++;
          }else{
            session_cookies++;

          }
          total_cookies++;
        }

        var ul = document.getElementById('cookie-stats');
        var li1 = document.createElement("li");
        var li2= document.createElement("li");
        var li3 = document.createElement("li");
        var li4 = document.createElement("li");
        var li5 = document.createElement("li");

        let content_stats = document.createTextNode("Total Cookies: " + total_cookies + "\n");
        let content_Third = document.createTextNode( "Third Party Cookies: " + third_party_cookies );
        let content_first = document.createTextNode("First Party Cookies: " + first_party_cookies);
        let content_Persistent = document.createTextNode("Persistent Cookies: " + persistent_cookies );
        let content_Session = document.createTextNode("Session Cookies: " + session_cookies);
        
        li1.appendChild(content_stats);
        li2.appendChild(content_first);
        li3.appendChild(content_Third);
        li4.appendChild(content_Persistent);
        li5.appendChild(content_Session);


        ul.appendChild(content_stats);
        ul.appendChild(li2);
        ul.appendChild(li3);
        ul.appendChild(li4);
        ul.appendChild(li5);
        
      } else {
        let content_stats = document.createTextNode("No cookies in this tab!");
        cookieStats.appendChild(content_stats);
      }
      risk_score+=2*persistent_cookies;
      risk_score+=session_cookies;
          
        // -------------- Score -------------- //

        var localStorageNNum = document.getElementById("local-content").childElementCount;

        var sessionStorageNNum = document.getElementById("session-content").childElementCount;

        var externalLinksNum = document.getElementById("external-content".childElementCount);

        var total_score = 0.25*risk_score + 0.15*sessionStorageNNum + 0.3*externalLinksNum + 0.3* localStorageNNum;  // crit??rios mais cr??ticos t??m maior valor

        // Se tiver algum n??mero muito alto, soma no score total
        if (risk_score > 30) total_score +=10;

        if (localStorageNNum > 10) total_score +=10;

        if (total_score > 100)total_score=100;

        
        var g = document.createElement("progress");
        
        g.setAttribute("value", total_score.toString());
        g.setAttribute("max", "100");

        let content = document.createTextNode(total_score.toString()+"   ");
        document.getElementById("Bar").appendChild(content);
        document.getElementById("Bar").appendChild(g);        
    });
  }


// ------------------- Storage ----------------------- //
async function localStorageInfo(tabs){

    let tab = tabs.pop();
    var storageSize = 0;
    const response = await browser.tabs.sendMessage(tab.id, {method: "localStorageData"})
    if (response.data.length > 0) {
      var ul = document.getElementById('local-content');
      for (let item of response.data) {
        if (item != undefined) {
          storageSize++;
          var li = document.createElement("li");
          let storage_data = document.createTextNode(item[0]);   
          li.appendChild(storage_data);
          ul.appendChild(li);
        }

      }
      var ul = document.getElementById('local-stats');
      let storage_count = document.createTextNode("Local Storage size: " + storageSize + "\n");  
      ul.appendChild(storage_count); 
    }else{
      var ul = document.getElementById('local-content');
      var li = document.createElement("li");
      let storage_data = document.createTextNode("Local Storage not detected");  
      li.appendChild(storage_data);
      ul.appendChild(li); 
    }
  }


  async function sessionStorageInfo(tabs){

    let tab = tabs.pop();
    var storageSize = 0;
    const response = await browser.tabs.sendMessage(tab.id, {method: "sessionStorageData"})
    if (response.data.length > 0) {
      var ul = document.getElementById('session-content');
      for (let item of response.data) {
        if (item != undefined) {
          storageSize++;
          var li = document.createElement("li");
          let storage_data = document.createTextNode(item[0]);   
          li.appendChild(storage_data);
          ul.appendChild(li);
        }
      }
      var ul = document.getElementById('session-stats');
      let storage_count = document.createTextNode("Session Storage size: " + storageSize + "\n");  
      ul.appendChild(storage_count); 
    }else{
      var ul = document.getElementById('session-content');
      var li = document.createElement("li");
      let storage_data = document.createTextNode("Session Storage not detected");  
      li.appendChild(storage_data);
      ul.appendChild(li); 
    }

  }



   // ------------------- External Connections ----------------------- //

  async function externalConnectionsInfo(tabs){

    let tab = tabs.pop();
    var numConnections = 0; 
    const response = await browser.tabs.sendMessage(tab.id, {method: "externalConnectionsData"})
 
    if (response.data.length > 0) {
      var ul = document.getElementById('external-content');
      for (let item of response.data) {
        if (item != undefined && item !== null && item.length >0 ) {
          numConnections++;
          var li = document.createElement("li");
          let data = document.createTextNode(item);
          li.appendChild(data);
          ul.appendChild(li);}
        }
      var ul = document.getElementById('external-stats');
      let countConnections = document.createTextNode("External Connections found: " + numConnections + "\n");
      ul.appendChild(countConnections);
    }else{
      var ul = document.getElementById('external-stats');
      ul.innerHTML = "No external connections was found";
    }
  }

  // ------------------- Canvas Fingerprint ----------------------- //

  async function canvasFingerprintInfo(tabs){
    let tab = tabs.pop();
    const response = await browser.tabs.sendMessage(tab.id, {method: "canvasFingerprintData"})
    if (response.data) {
      let ul = document.getElementById('fingerprint-stats');
      ul.innerHTML = "Canvas fingerprinting DETECTED";
      let li = document.getElementById('fingerprint-content');
      li.innerHTML = response.data;
    }else{
      var ul = document.getElementById('fingerprint-stats');
      ul.innerHTML = "Canvas fingerprinting not detected"; 
    }
    
}

// --------------------- SSL LABS SCORE ------------------ //
  function httpGet(theUrl)
  {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
      xmlHttp.send( null );
      return xmlHttp.responseText;
  }

  async function getSSL(tabs){
    let tab = tabs.pop()
    const Url =  String('https://api.ssllabs.com/api/v2/analyze/?host=' + tab.url + '&all=on');

    var response = httpGet(Url)
    var grade = JSON.parse(response).endpoints[0].grade;

    if (String(grade).length <=2){  // se tiver encontrado alguma nota
      var ul = document.getElementById('ssl-labs');
      let ssl_rating = document.createTextNode("SSL Rating: " + grade + "\n");  
      ul.appendChild(ssl_rating); 
      if (grade.includes("A")){
        ul.style.backgroundColor = "green";
      }
      else if (grade.includes("B")){
        ul.style.backgroundColor = "gold";
      }
      else{
        ul.style.backgroundColor = "red";
      }
    
    }

  }


// --------------------- CSP Header ------------------ //
  async function getCert(tabs){
    let tab = tabs.pop()
    fetch(tab.url)
    .then(resp => {
      const csp = resp.headers.get('Content-Security-Policy');
      
      if (csp != null){
        var ul = document.getElementById('cert');
        var li = document.createElement("li");
        let storage_data = document.createTextNode("Content Security Policy is Active");
        let description = document.createTextNode("Helps prevent XSS attacks");    
        li.appendChild(description);
        ul.appendChild(storage_data); 

        var ul = document.getElementById('cert-details');
        ul.appendChild(li); 
      }else{
        var ul = document.getElementById('cert');
        var li = document.createElement("li");
        let storage_data = document.createTextNode("Content Security Policy not detected");
        let description = document.createTextNode("Website may be vulnerable to XSS attacks");    
        li.appendChild(description);
        ul.appendChild(storage_data); 
        var ul = document.getElementById('cert-details');
        ul.appendChild(li); 
      }
    });
     
  }
  
// --------------------- Function Calls ------------------ //

  function getActiveTab() {
    return browser.tabs.query({currentWindow: true, active: true});
  }

  getActiveTab().then(localStorageInfo)
  getActiveTab().then(sessionStorageInfo)
  getActiveTab().then(externalConnectionsInfo)
  getActiveTab().then(canvasFingerprintInfo)
  getActiveTab().then(getSSL)
  getActiveTab().then(getCert)
  getActiveTab().then(showTabInfo)


  

// Refer??ncias
// Cookies: 
// https://github.com/mdn/webextensions-examples/blob/master/list-cookies/cookies.js
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/sendMessage
// https://stackoverflow.com/questions/52817893/unable-to-receive-message-on-tab-from-background-script
// https://www.geeksforgeeks.org/how-to-set-get-the-value-of-progress-bar-using-javascript/
