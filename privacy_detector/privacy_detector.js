// ---------------------------------------------------------------//
// ---------------------- Privacy Detector ---------------------- //
// --------------------------------------------------------------//


requests = [];

function logURL(tab) {
  // console.log(tab.url);
  // count +=1;
  // console.log(count);
  requests.push(tab.url);
  // return requests;
}

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
      risk_score+=2*session_cookies;

          
        // -------------- Score -------------- //
        var g = document.createElement("progress");
        g.setAttribute("value", risk_score.toString());
        g.setAttribute("max", "100");

        let content = document.createTextNode(risk_score.toString()+"   ");
        document.getElementById("Bar").appendChild(content);
        document.getElementById("Bar").appendChild(g);

// ---------------------------------------------------------- //
      var count = 0;
      var gettingRequests = browser.webRequest.onBeforeRequest.addListener(
          logURL,
          {urls: ["<all_urls>"]}
        );
        console.log(requests);


    }); 
    console.log(requests);
    
// ----------------------------------------------------------------------


  }


 function externalConnections(tabs) {
  let tab = tabs.pop();
  var urls = [];
  console.log(JSON.stringify(document.querySelectorAll("div")));
  for(var i = document.links.length; i --> 0;)
    if(document.links[i].hostname === location.hostname){
        urls.push(document.links[i].href);
        console.log(document.links[i].href);
    }
 }



 

 function isSiteOnline(url,callback) {
  // try to load favicon
  var timer = setTimeout(function(){
      // timeout after 5 seconds
      callback(false);
  },5000)

  var img = document.createElement("img");
  img.onload = function() {
      clearTimeout(timer);
      callback(true);
  }

  img.onerror = function() {
      clearTimeout(timer);
      callback(false);
  }

  img.src = url+"/favicon.ico";
}

function check(tabs){
  tab=tabs.pop();
  isSiteOnline(tab.url,function(found){
    if(found) {
        console.log("oi");
    }
    else {
      console.log("oi");
    }
})
}

 
async function localStorageInfo(tabs){

    let tab = tabs.pop();
    var storageSize = 0;
    console.log("id: "+JSON.stringify(tab.id))
    const response = await browser.tabs.sendMessage(tab.id, {method: "localStorageData"})
    if (response.data.length > 0) {
      var ul = document.getElementById('local-content');
      for (let item of response.data) {
        if (item != undefined) {
          console.log (item);
          storageSize++;
          var li = document.createElement("li");
          let storage_data = document.createTextNode(item);   
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

    console.log(storageSize)

  }


  async function sessionStorageInfo(tabs){

    let tab = tabs.pop();
    var storageSize = 0;
    console.log("id: "+JSON.stringify(tab.id))
    const response = await browser.tabs.sendMessage(tab.id, {method: "sessionStorageData"})
    if (response.data.length > 0) {
      var ul = document.getElementById('session-content');
      for (let item of response.data) {
        if (item != undefined) {
          console.log (item);
          storageSize++;
          var li = document.createElement("li");
          let storage_data = document.createTextNode(item);   
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

    console.log(storageSize)

  }



  
  async function externalConnections(tabs){

    let tab = tabs.pop();
    var storageSize = 0;
    console.log("id: "+JSON.stringify(tab.id))
    const response = await browser.tabs.sendMessage(tab.id, {method: "thirdPartyDomains"})
    if (response.data.length > 0) {
      var ul = document.getElementById('external-content');
      for (let item of response.data) {
        if (item != undefined) {
          console.log (item);
          storageSize++;
          var li = document.createElement("li");
          let storage_data = document.createTextNode(item);   
          li.appendChild(storage_data);
          ul.appendChild(li);
        }
      }
      var ul = document.getElementById('external-stats');
      let storage_count = document.createTextNode("Session Storage size: " + storageSize + "\n");  
      ul.appendChild(storage_count); 
    }else{
      var ul = document.getElementById('external-content');
      var li = document.createElement("li");
      let storage_data = document.createTextNode("External Connections not detected");  
      li.appendChild(storage_data);
      ul.appendChild(li); 
    }

    console.log(storageSize)

  }








// https://www.geeksforgeeks.org/how-to-set-get-the-value-of-progress-bar-using-javascript/
 function setScoreBar(risk_score) {
  
  var g = document.createElement("progress");
  g.setAttribute("value", risk_score.toString());
  g.setAttribute("max", "100");
  
  let content = document.createTextNode(risk_score.toString()+"   ");
  document.getElementById("Bar").appendChild(content);
  document.getElementById("Bar").appendChild(g);
} 
  
  function getActiveTab() {
    return browser.tabs.query({currentWindow: true, active: true});
  }

  getActiveTab().then(showTabInfo)
  getActiveTab().then(localStorageInfo)
  getActiveTab().then(sessionStorageInfo)
  getActiveTab().then(externalConnections)
  


// Referências
// Cookies: 
// https://github.com/mdn/webextensions-examples/blob/master/list-cookies/cookies.js
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/sendMessage
// https://stackoverflow.com/questions/52817893/unable-to-receive-message-on-tab-from-background-script