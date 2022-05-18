function showCookiesForTab(tabs) {
    //get the first tab object in the array
    let tab = tabs.pop();
  
    //get all cookies in the domain
    var gettingAllCookies = browser.cookies.getAll({url: null});
    gettingAllCookies.then((cookies) => {
  
      //set the header of the panel
      var activeTabUrl = document.getElementById('header-title');
      var text = document.createTextNode("Cookies at: "+tab.title);
      var cookieList = document.getElementById('cookie-list');
      var cookieStats = document.getElementById('cookie-stats');
      activeTabUrl.appendChild(text);


      var total_cookies = 0;
      var session_cookies = 0;
      var persistent_cookies = 0;
      var first_party_cookies = 0;
      var third_party_cookies = 0;


  
      if (cookies.length > 0) {
        //add an <li> item with the name and value of the cookie to the list
        for (let cookie of cookies) {
          // let li = document.createElement("li");
          // let content = document.createTextNode(
            // "Name: "+cookie.name + 
          // "   | Value: "+ cookie.value + 
          // "   | Domain: "+ cookie.domain + 
          // "   | firstPartyDomain: "+ cookie.firstPartyDomain + 
          // "   | partitionKey: "+ cookie.partitionKey +
          // "   | topLevelSite: "+ cookie.topLevelSite + "   \nPath: "+ cookie.path + 
          // "   | secure: "+ cookie.secure  + 
          // "   | nsession: "+ cookie.session + 
          // "   | storeId: "+ cookie.storeId  + 
          // "   | url: "+ cookie.url +
          // "   | exp : " + cookie.expirationDate);

          // li.appendChild(content);
          // cookieList.appendChild(li);


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

        cookieList.appendChild(content_stats);

      } else {
        let p = document.createElement("p");
        let content = document.createTextNode("No cookies in this tab.");
        let parent = cookieList.parentNode;
  
        p.appendChild(content);
        parent.appendChild(p);
      }
    });
  }
  
  //get active tab to run an callback function.
  //it sends to our callback an array of tab objects
  function getActiveTab() {
    return browser.tabs.query({currentWindow: true, active: true});
  }
  getActiveTab().then(showCookiesForTab);