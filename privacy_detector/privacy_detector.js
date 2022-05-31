// ------------------------------------------------------//
// ---------------------- Cookies ---------------------- //
// ------------------------------------------------------//
// https://github.com/mdn/webextensions-examples/blob/master/list-cookies/cookies.js

function showCookiesForTab(tabs) {
    let tab = tabs.pop();
  
    var gettingAllCookies = browser.cookies.getAll({});
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

        let content_stats = document.createTextNode(
          "Total Cookies: " + total_cookies +
          " | First Party Cookies: " + first_party_cookies +
          " | Third Party Cookies: " + third_party_cookies +
          " | Persistent Cookies: " + persistent_cookies +
          " | Session Cookies: " + session_cookies

        );

        cookieStats.appendChild(content_stats);

      } else {
        let p = document.createElement("p");
        let content = document.createTextNode("No cookies in this tab.");
        let parent = cookieList.parentNode;
  
        p.appendChild(content);
        parent.appendChild(p);
      }
    });
  }


  function html5Storage(tabs) {
    let tab = tabs.pop();
    var storage = document.getElementById('html5');

  //   for (var a in localStorage) {
  //     console.log(a, ' = ', localStorage[a]);
  //  }

   var localStorage = window.content.localStorage;

    // var keys = Object.keys(localStorage);
    // console.log(String(keys));

    // var i = keys.length;
    // console.log(String(i));

    // while ( i-- ) {

      
    //   console.log(localStorage.getItem( String(keys[i]) ));
      
    //   let li = document.createElement("li");
    //   let content = document.createTextNode(
    //     String(localStorage.getItem(String(keys[i])))
    //   );
    //   li.appendChild(content);
    //   storage.appendChild(li);
    // }

    // print(i);

    function onGot(item) {
      console.log(item.valueOf());
    }
    
    function onError(error) {
      console.log(`Error: ${error}`);
    }
    
    let gettingItem = browser.storage.local.get();
    gettingItem.then(onGot, onError);
    console.log(tab.method);
    console.log(JSON.stringify(browser.storage.local.get()));
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
  
  function getActiveTab() {
    return browser.tabs.query({currentWindow: true, active: true});
  }
  getActiveTab().then(showCookiesForTab)
  getActiveTab().then(html5Storage);


