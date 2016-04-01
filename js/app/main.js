/** @license
 | Copyright 2015 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */

define("nls/resources.js",{root:{screenreader:{h1_title:"Photo-based survey",h2_splash:"Social media sign-in",h2_illustration:"Photo gallery",h2_activity:"Survey and profile",h2_additionalInfo:"Additional information"},tooltips:{button_additionalInfo:"Additional information",button_close:"Close additional information panel",flag_important_question:"Please answer this question",button_previous_image:"Previous image",button_next_image:"Next image",button_best_image:"This is the best photo for the property",button_click_if_best_image:"Click if this is the best photo for the property",button_skip:"Skip",button_submit:"Submit survey"},labels:{menuItem_profile:"Profile",menuItem_signout:"Sign out",button_close:"Close",label_surveys_completed:"surveys completed",label_level:"level ${0}",label_remaining_surveys:"${0} surveys left until next level",button_returnToSurvey:"&lt; Back to survey"},signin:{checkingServer:"Checking availability of the server...",unsupported:"This version of Internet Explorer is not supported. Please use Internet Explorer 10 or newer.",needProxy:"This version of Internet Explorer is not supported by our server. Please use Internet Explorer 10 or newer.",signinFetching:"Checking availability of login possibilities...",signinLoginPrompt:"Please sign in to get started",noMoreSurveys:"There are no surveys available at this time; thank you for your participation.",guestLabel:"Guest"}},ar:0,cs:0,da:0,de:1,el:0,es:0,et:0,fi:0,fr:1,he:0,it:0,ja:0,ko:0,lt:0,lv:0,nb:0,nl:0,pl:0,"pt-br":0,"pt-pt":0,ro:0,ru:0,sv:0,th:0,tr:0,vi:0,"zh-cn":0,"zh-hk":0,"zh-tw":0}),define("parseConfigInfo",[],function(){"use strict";var e;return e={parseSurvey:function(t,n){var r=[],i,s,o,u,a;return s=[],o=[],u=[],i=t.split("<div>"),$.each(i,function(e,t){$.merge(s,t.split("<p>"))}),$.each(s,function(e,t){$.merge(o,t.split("<br />"))}),$.each(o,function(e,t){$.merge(u,t.split("<li>"))}),a=[],$.each(u,function(t,n){var r=e.textOnly(n).trim();r.length>0&&a.push(r)}),$.each(a,function(e,t){var i,s,o,u;i=t.split("{"),s=[],$.each(i,function(e,t){var n=t.replace("}","").trim();n.length>0&&s.push(n)}),s.length===3&&(o=s[1],n[o]&&(u={question:s[0],field:o,style:s[2],domain:n[o].domain,important:n[o].important},r.push(u)))}),r},parseAccessConfig:function(t){var n,r,i,s=!1,o,u,a,f,l;a={};if(!t)return;return n=[],r=t.split("</div>"),$.each(r,function(e,t){$.merge(n,t.split("<br />"))}),i=[],$.each(n,function(t,n){var r=e.textOnly(n).trim();r.length>0&&i.push(r)}),o=["0","1","2","3","4","5","surveyor","photo"],u=0,f=[],$.each(i,function(t,n){if(!s)s=n.indexOf("=== Access and use settings ===")>=0;else{l=n.split(":");if(l[0].toLowerCase().indexOf(o[u])>=0){switch(u){case 0:e.extractContribLevel(0,l[1],f);break;case 1:e.extractContribLevel(1,l[1],f);break;case 2:e.extractContribLevel(2,l[1],f);break;case 3:e.extractContribLevel(3,l[1],f);break;case 4:e.extractContribLevel(4,l[1],f);break;case 5:e.extractContribLevel(5,l[1],f),f!==null&&(a.contribLevels=f);break;case 6:a.surveyorNameField=l[1].trim();break;case 7:a.bestPhotoField=l[1].trim()}u+=1;if(u>=o.length)return!1}}}),a},extractContribLevel:function(e,t,n){var r,i;if(n!==null&&t!==null){r=t.split("@");try{i=e===0?0:parseInt(r[1],10),n.push({label:r[0].trim(),minimumSurveysNeeded:i})}catch(s){n=null}}},createSurveyDictionary:function(e){var t={};return $.each(e,function(e,n){n.domain&&n.domain.codedValues&&(t[n.name]={domain:$.map(n.domain.codedValues,function(e){return e.name}).join("|"),important:!n.nullable})}),t},textOnly:function(e){return $("<div>"+e+"</div>").text()},isUsableString:function(e){return typeof e=="string"&&e.length>0}},e}),define("fetchConfigInfo",["parseConfigInfo"],function(e){"use strict";var t;return t={getParamsFromUrl:function(){var e={},t=window.location.search;return t.length>0&&t[0]==="?"&&(t=t.substring(1).split("&"),$.map(t,function(t){var n=t.split("=");e[n[0].toLowerCase()]=n[1]||null})),e},getParamsFromConfigFile:function(e,t){return t||(t=$.Deferred()),$.getJSON(e,function(e){t.resolve(e&&e.values||{})}),t},getParamsFromOnlineApp:function(t,n,r){return r||(r=$.Deferred()),e.isUsableString(n)?$.getJSON(t+n+"/data?f=json&callback=?",function(e){r.resolve(e&&e.values||{})}):r.resolve({}),r},getParamsFromWebmap:function(n,r,i,s){var o={};return o.params=i||$.Deferred(),o.origImageUrl=s||$.Deferred(),e.isUsableString(r)?$.getJSON(n+r+"?f=json&callback=?",function(i){var s={},u,a;if(!i||i.error){o.params.reject(),o.origImageUrl.resolve();return}s.title=i.title,s.splashText=i.snippet,s.helpText=i.description,s=$.extend(s,e.parseAccessConfig(i.licenseInfo)),o.params.resolve(s),u=i.thumbnail,u?(a=u.lastIndexOf("."),a>=0?u=u.substring(0,a)+"_orig"+u.substr(a):u+="_orig",u=n+r+"/info/"+u,t.testURL(u,function(e){o.origImageUrl.resolve(e?u:null)})):o.origImageUrl.resolve()}):(o.params.resolve({}),o.origImageUrl.resolve()),o},getWebmapData:function(n,r,i){return i||(i=$.Deferred()),e.isUsableString(r)?$.getJSON(n+r+"/data?f=json&callback=?",function(e){var n={};e&&e.operationalLayers&&e.operationalLayers.length>0?(n.opLayerParams=e.operationalLayers[0],t.getFeatureSvcData(n.opLayerParams.url).done(function(e){(!e||e.error)&&i.reject(),n.featureSvcParams=e,i.resolve(n)})):i.resolve({})}):i.resolve({}),i},getFeatureSvcData:function(t,n){return n||(n=$.Deferred()),e.isUsableString(t)?$.getJSON(t+"?f=json&callback=?",function(e){e.canBeUpdated=e.capabilities&&e.capabilities.indexOf("Update")>=0,n.resolve(e)}):n.resolve({}),n},testURL:function(e,t){try{$.ajax({type:"HEAD",url:e,success:function(){t(!0)},error:function(){t(!1)}})}catch(n){t(!1)}}},t}),define("prepareAppConfigInfo",["parseConfigInfo","fetchConfigInfo"],function(e,t){"use strict";var n;return n={appParams:{webmap:"",useWebmapOrigImg:!0,title:"",splashText:"",splashBackgroundUrl:"",helpText:"",contribLevels:[],proxyProgram:"",facebookAppId:"",googleplusClientId:"",googleplusLogoutUrl:"",twitterSigninUrl:"",twitterUserUrl:"",twitterCallbackUrl:"",allowGuestSubmissions:!1,thumbnailLimit:"10",surveyorNameField:"",bestPhotoField:"",showFacebook:"false",showGooglePlus:"false",showTwitter:"false"},featureSvcParams:{url:"",id:"",objectIdField:""},survey:[],init:function(){var r,i,s,o,u,a;return n.parametersReady=$.Deferred(),n.surveyReady=$.Deferred(),n.webmapOrigImageUrlReady=$.Deferred(),r=$.Deferred(),i=$.Deferred(),s=null,a=t.getParamsFromConfigFile("js/configuration.json",a),$.when(a).done(function(a){o=n.screenProperties(["webmap","diag","test"],t.getParamsFromUrl()),e.isUsableString(o.webmap)&&(s="url",t.getParamsFromWebmap(a.arcgisUrl,o.webmap,r,n.webmapOrigImageUrlReady),t.getWebmapData(a.arcgisUrl,o.webmap,i)),u=$.Deferred(),t.getParamsFromOnlineApp(a.arcgisUrl,o.appid).done(function(e){s||e&&e.webmap&&(s="online",t.getParamsFromWebmap(a.arcgisUrl,e.webmap,r,n.webmapOrigImageUrlReady),t.getWebmapData(a.arcgisUrl,e.webmap,i)),u.resolve(e)}),$.when(u).done(function(u){s||(a.webmap?(s="file",t.getParamsFromWebmap(a.arcgisUrl,a.webmap,r,n.webmapOrigImageUrlReady),t.getWebmapData(a.arcgisUrl,a.webmap,i)):(n.parametersReady.resolve(!1),n.surveyReady.resolve(!1),n.webmapOrigImageUrlReady.resolve(!1))),r.done(function(e){n.appParams=$.extend(n.appParams,a,e,u,o),n.appParams.showGuest=n.toBoolean(n.appParams.showGuest),n.appParams.showFacebook=n.appParams.facebookAppId!==null&&n.appParams.facebookAppId.length>0,n.appParams.showGooglePlus=n.appParams.googleplusClientId!==null&&n.appParams.googleplusClientId.length>0,n.appParams.showTwitter=n.toBoolean(n.appParams.showTwitter),n.appParams.allowGuestSubmissions=n.toBoolean(n.appParams.allowGuestSubmissions,!1),n.appParams.thumbnailLimit=n.toNumber(n.appParams.thumbnailLimit,-1),n.parametersReady.resolve(!0)}).fail(function(){n.parametersReady.resolve(!1)}),i.done(function(t){var r;t.opLayerParams&&t.opLayerParams.popupInfo&&t.opLayerParams.popupInfo.description&&t.featureSvcParams&&t.featureSvcParams.fields?(n.featureSvcParams.url=t.opLayerParams.url,n.featureSvcParams.id=t.featureSvcParams.id,n.featureSvcParams.objectIdField=t.featureSvcParams.objectIdField,n.featureSvcParams.canBeUpdated=t.featureSvcParams.canBeUpdated,r=e.createSurveyDictionary(t.featureSvcParams.fields),n.survey=e.parseSurvey(t.opLayerParams.popupInfo.description,r),n.surveyReady.resolve()):(n.featureSvcParams={},n.survey={},n.surveyReady.reject())}).fail(function(){n.surveyReady.reject()})})}),{parametersReady:n.parametersReady,surveyReady:n.surveyReady,webmapOrigImageUrlReady:n.webmapOrigImageUrlReady}},screenProperties:function(e,t){var n={};return $.each(e,function(e,r){n[r]=t[r]}),n},toNumber:function(e,t){var n;t===undefined&&(t=0);if(typeof e=="number")return e;if(typeof e=="string")try{n=parseInt(e,10),isNaN(n)&&(n=t)}catch(r){n=t}else n=t;return n},toBoolean:function(e,t){var n;if(e===!0)return!0;if(e===!1)return!1;if(typeof e=="string"){n=e.toLowerCase();if(n==="true")return!0;if(n==="false")return!1}return t===undefined?!0:t}},n}),define("handleUserSignin",["lib/i18n.min!nls/resources.js"],function(e){"use strict";var t;return t={notificationSignIn:0,notificationSignOut:1,notificationAvatarUpdate:2,loggedIn:null,user:null,statusCallback:null,currentProvider:null,availabilities:{guest:!1,facebook:!1,googleplus:!1,twitter:!1},init:function(e,n){var r,i,s,o,u;return r=$.Deferred(),i=t.createIE8Test(),t.statusCallback=n,t.appParams=e,t.availabilities.guest=e.showGuest,s=$.Deferred(),setTimeout(function(){!i&&e.showFacebook?(window.fbAsyncInit=function(){FB.Event.subscribe("auth.login",t.updateFacebookUser),FB.Event.subscribe("auth.statusChange",t.updateFacebookUser),FB.Event.subscribe("auth.logout",t.updateFacebookUser),FB.init({appId:t.appParams.facebookAppId,cookie:!0,xfbml:!1,status:!0,version:"v2.3"}),FB.getLoginStatus(t.updateFacebookUser)},function(e,t,n){var r,i=e.getElementsByTagName(t)[0];if(e.getElementById(n))return;r=e.createElement(t),r.id=n,r.src="//connect.facebook.net/en_US/sdk.js",i.parentNode.insertBefore(r,i)}(document,"script","facebook-jssdk"),t.availabilities.facebook=!0,s.resolve(!0)):s.resolve(!1)}),o=$.Deferred(),setTimeout(function(){!i&&e.showGooglePlus?function(){window.___gcfg={parsetags:"explicit"},Modernizr.load([{load:"https://apis.google.com/js/client:platform.js",complete:function(){gapi.load("auth2",function(){gapi.client.load("plus","v1").then(function(){t.availabilities.googleplus=!0,o.resolve(!0)})})}}])}():o.resolve(!1)}),u=$.Deferred(),setTimeout(function(){!i&&e.showTwitter?(t.availabilities.twitter=!0,u.resolve(!0)):u.resolve(!1)}),$.when(s,o,u).done(function(e,n,i){t.availabilities.guest||e||n||i?r.resolve():r.reject()}),r},initUI:function(n){t.availabilities.guest&&($('<div id="guestSignin" class="socialMediaButton guestOfficialColor"><span class="socialMediaIcon sprites guest-user_29"></span>'+e.signin.guestLabel+"</div>").appendTo(n),$("#guestSignin").on("click",function(){t.loggedIn=!0,t.currentProvider="guest",t.user={name:e.signin.guestLabel,id:"",canSubmit:t.appParams.allowGuestSubmissions},t.statusCallback(t.notificationSignIn)})),t.availabilities.facebook&&($('<div id="facebookSignin" class="socialMediaButton facebookOfficialColor"><span class="socialMediaIcon sprites FB-f-Logo__blue_29"></span>Facebook</div>').appendTo(n),$("#facebookSignin").on("click",function(){FB.login(function(){return null},{auth_type:"reauthenticate"})})),t.availabilities.googleplus&&($('<div id="googlePlusSignin" class="socialMediaButton googlePlusOfficialColor"><span class="socialMediaIcon sprites gp-29"></span>Google+</div>').appendTo(n),$("#googlePlusSignin").on("click",function(){gapi.auth.signIn({clientid:t.appParams.googleplusClientId,cookiepolicy:"http://"+document.location.hostname,callback:t.updateGooglePlusUser})})),t.availabilities.twitter&&($('<div id="twitterSignin" class="socialMediaButton twitterOfficialColor"><span class="socialMediaIcon sprites Twitter_logo_blue_29"></span>Twitter</div>').appendTo(n),$("#twitterSignin").on("click",function(){t.showTwitterLoginWin(!1)}))},isSignedIn:function(){return t.loggedIn},getUser:function(){return t.user},signOut:function(){if(t.isSignedIn())switch(t.currentProvider){case"guest":t.user={},t.statusCallback(t.notificationSignOut);break;case"facebook":FB.logout();break;case"googlePlus":try{t.disconnectUser(t.user.access_token),gapi.auth.signOut(),t.showGooglePlusLogoutWin()}catch(e){}break;case"twitter":t.statusCallback(t.notificationSignOut),t.showTwitterLoginWin(!0)}t.currentProvider="none"},updateFacebookUser:function(e){t.loggedIn=e&&e.status==="connected",t.currentProvider=t.loggedIn?"facebook":"",t.user={},t.loggedIn?FB.api("/me",{fields:"name,id"},function(e){t.loggedIn=e.name!==undefined,t.loggedIn&&(t.user={name:e.name,id:e.id,canSubmit:!0},t.statusCallback(t.notificationSignIn),FB.api("/"+t.user.id+"/picture",function(e){e&&!e.error&&e.data&&!e.data.is_silhouette&&e.data.url&&(t.user.avatar=e.data.url),t.statusCallback(t.notificationAvatarUpdate)})),t.statusCallback(t.notificationAvatarUpdate)}):t.statusCallback(t.notificationSignOut)},updateGooglePlusUser:function(e){t.loggedIn=e&&e.status&&e.status.signed_in,t.currentProvider=t.loggedIn?"googlePlus":"",t.user={},t.loggedIn?gapi.client.request({path:"/plus/v1/people/me"}).then(function(n){t.user={name:n.result.displayName,id:n.result.id,access_token:e.access_token,canSubmit:!0},t.statusCallback(t.notificationSignIn),n.result.image&&!n.result.image.isDefault&&n.result.image.url&&(t.user.avatar=n.result.image.url,t.statusCallback(t.notificationAvatarUpdate))},function(){t.statusCallback(t.notificationSignOut)}):t.statusCallback(t.notificationSignOut)},disconnectUser:function(e){var n="https://accounts.google.com/o/oauth2/revoke?token="+e;$.ajax({type:"GET",url:n,async:!1,contentType:"application/json",dataType:"jsonp",success:function(){t.updateGooglePlusUser()},error:function(){t.updateGooglePlusUser()}})},showGooglePlusLogoutWin:function(){var e,n,r,i,s;e=t.appParams.googleplusLogoutUrl,n=screen.width/2-i/2,r=screen.height/2-s/2,i=screen.width/2,s=screen.height/1.5,window.open(e,"GooglePlus","scrollbars=yes, resizable=yes, left="+n+", top="+r+", width="+i+", height="+s,!0)},showTwitterLoginWin:function(e){var n,r,i,s,o,u,a;n=t.appParams.twitterSigninUrl,r=window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/")),i=encodeURIComponent(location.protocol+"//"+location.host+r+t.appParams.twitterCallbackUrl),s=screen.width/2-u/2,o=screen.height/2-a/2,u=screen.width/2,a=screen.height/1.5,n+="?",e&&(n+="force_login=true",i&&(n+="&")),i&&(n+="redirect_uri="+i),window.open(n,"twoAuth","scrollbars=yes, resizable=yes, left="+s+", top="+o+", width="+u+", height="+a,!0),window.oAuthCallback=function(){t.updateTwitterUser()}},updateTwitterUser:function(){var e={include_entities:!0,skip_status:!0};$.ajax({url:t.appParams.twitterUserUrl,data:e,dataType:"jsonp",timeout:1e4,success:function(e){t.loggedIn=e&&!e.hasOwnProperty("signedIn")&&!e.signedIn,t.currentProvider=t.loggedIn?"twitter":"",t.loggedIn?(t.user={name:e.name,id:e.id_str,canSubmit:!0},t.statusCallback(t.notificationSignIn),!e.default_profile_image&&e.profile_image_url_https&&(t.user.avatar=e.profile_image_url_https,t.statusCallback(t.notificationAvatarUpdate))):(t.user={},t.statusCallback(t.notificationSignOut))},error:function(){t.loggedIn=!1,t.statusCallback(t.notificationSignOut)}},"json")},createIE8Test:function(){return t.isIE(8,"lte")},isIE:function(e,t){var n="IE",r=document.createElement("B"),i=document.documentElement,s;return e&&(n+=" "+e,t&&(n=t+" "+n)),r.innerHTML="<!--[if "+n+']><b id="iecctest"></b><![endif]-->',i.appendChild(r),s=!!document.getElementById("iecctest"),i.removeChild(r),s}},t}),define("diag",[],function(){"use strict";var e=!1,t;return t={init:function(){$("body").append("<button id='diagnosticButton' style='z-index:2000;position:absolute;left:0;top:0;width:32px;height:32px;background-color:transparent' data-toggle='modal' data-target='#diagnosticPanel' class='iconButton'></button><div id='diagnosticPanel' class='modal fade' role='dialog'>  <div class='modal-dialog'>    <div id='diagnosticLog' class='modal-content' style='padding:8px;word-wrap:break-word;'></div>  </div></div>"),$("#diagnosticPanel").modal({show:!1}),e=!0},append:function(t){e&&$("#diagnosticLog").append(t)},appendWithLF:function(e){t.append(e+"<br>")},appendLine:function(){t.append("<hr>")}},t}),define("dataAccess",["diag"],function(e){"use strict";var t;return t={fixedQueryParams:"&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=json&outSR=4326",featureServiceUrl:null,featureServiceLayerId:null,objectIdField:null,validCandidateCondition:null,proxyProgram:null,exclusionList:{},init:function(e,n,r,i,s){t.featureServiceUrl=e,t.featureServiceUrl.lastIndexOf("/")!==t.featureServiceUrl.length-1&&(t.featureServiceUrl+="/"),t.featureServiceLayerId=n,t.objectIdField=r,t.validCandidateCondition=i,t.proxyProgram=s},addItemToExclusionList:function(e){t.exclusionList[e]=!0},isItemInExclusionList:function(e){return t.exclusionList.hasOwnProperty(e)},resetExclusionList:function(){t.exclusionList={}},filterList:function(e){return $.grep(e,function(e){return!t.isItemInExclusionList(e)})},pickFromList:function(e,n){var r=null,i;return e.length>0&&(i=t.filterList(e),i.length>0&&(r=n?i[Math.floor(Math.random()*i.length)]:i[0])),r},getObjectCount:function(e){var n,r;return n=$.Deferred(),r=t.featureServiceUrl+"query?where="+(e||t.validCandidateCondition)+"&objectIds=&returnIdsOnly=false&returnCountOnly=true&outFields="+t.fixedQueryParams+"&callback=?",$.getJSON(r,function(i){t.handleObjectCount(i,n,e)}),n},handleObjectCount:function(t,n,r){(!t||t.error)&&n.reject(-1),e.appendWithLF("surveys "+(r?'for "'+r+'"':"available")+": "+t.count),n.resolve(t.count)},getCandidate:function(e){var n,r;return n=$.Deferred(),r=t.featureServiceUrl+"query?where="+t.validCandidateCondition+"&objectIds=&returnIdsOnly=true&returnCountOnly=false&outFields="+t.fixedQueryParams+"&callback=?",$.getJSON(r,function(i){t.handleCandidates(i,e,n)}),n},handleCandidates:function(e,n,r){var i;if(!e||e.error){r.reject({id:null,obj:null,attachments:[]});return}i=t.pickFromList(e.objectIds,n);if(i===null){r.resolve({id:null,obj:null,attachments:[]});return}t.getCandidateInfo(i,r)},getCandidateInfo:function(e,n){var r,i,s,o;r=$.Deferred(),i=t.featureServiceUrl+"query?objectIds="+e+"&returnIdsOnly=false&returnCountOnly=false&outFields=*"+t.fixedQueryParams+"&callback=?",$.getJSON(i,function(n){t.handleCandidateAttrs(n,r)}),s=$.Deferred(),o=t.featureServiceUrl+e+"/attachments?f=json&callback=?",$.getJSON(o,function(i){t.handleCandidateAttachments(e,i,r,s)}),$.when(r,s).done(function(t,r){n.resolve({id:e,obj:t,attachments:r})})},handleCandidateAttrs:function(e,t){if(!e||e.error||!e.features||e.features.length===0){t.reject();return}t.resolve(e.features[0])},handleCandidateAttachments:function(e,n,r,i){var s=[];if(!n||n.error){i.reject();return}n&&n.attachmentInfos?r.done(function(r){var o=!1;r&&r.attributes&&r.attributes.REVERSE&&(o=t.toBoolean(r.attributes.REVERSE,!1)),o&&n.attachmentInfos.reverse(),$.each(n.attachmentInfos,function(n,r){s.push({id:r.id,url:t.featureServiceUrl+e+"/attachments/"+r.id})}),i.resolve(s)}).fail(function(){i.reject()}):i.resolve(s)},updateCandidate:function(n){var r,i,s;return r=$.Deferred(),s="f=json&id="+t.featureServiceLayerId+"&updates=%5B"+t.stringifyForApplyEdits(n.obj)+"%5D",i=(t.proxyProgram?t.proxyProgram+"?":"")+t.featureServiceUrl+"applyEdits",$.post(i,s,function(i,s){e.append("update obj #"+n.obj.attributes[t.objectIdField]+" result: "),s==="success"&&i&&i.updateResults.length>0?i.updateResults[0].success===!0&&i.updateResults[0].objectId===n.obj.attributes[t.objectIdField]?(e.appendWithLF("OK"),r.resolve()):i.updateResults[0].error?(e.appendWithLF("fail #"+i.updateResults[0].error.code+" ("+i.updateResults[0].error.description+")"),r.reject()):(e.appendWithLF("unspecified fail"),r.reject()):(e.appendWithLF("overall fail: "+s),r.reject())},"json").fail(function(s){e.appendWithLF("update obj #"+n.obj.attributes[t.objectIdField]+" POST fail: "+JSON.stringify(s)+"; failing URL: "+i),r.reject()}),r},stringifyForApplyEdits:function(e){var n=!0,r="";return e===null?r+="null":typeof e=="string"?r+="%22"+e+"%22":typeof e=="object"?(r+="%7B",$.each(e,function(i){e.hasOwnProperty(i)&&(r+=(n?"":"%2C")+i+"%3A"+t.stringifyForApplyEdits(e[i]),n=!1)}),r+="%7D"):r+=e,r},toBoolean:function(e,t){var n;if(e===!0)return!0;if(e===!1)return!1;if(typeof e=="string"){n=e.toLowerCase();if(n==="true"||n==="t"||n==="yes"||n==="y"||n==="1")return!0;if(n==="false"||n==="f"||n==="no"||n==="n"||n==="0")return!1}else if(typeof e=="number")return e!==0;return t===undefined?!0:t}},t}),define("main",["lib/i18n.min!nls/resources.js","prepareAppConfigInfo","handleUserSignin","dataAccess","diag"],function(e,t,n,r,i){"use strict";var s,o=!1,u=!1,a;return s={numPhotos:0,iVisiblePhoto:0,photoSelected:!1,iSelectedPhoto:-1,candidate:null,signedIn:!1,completions:0,overviewMap:{map:null,basemap:"Streets",visible:!1,zoom:16},showIcon:function(e,t){document.getElementById(e).style.display=t?"block":"none"},updateIconToggle:function(e,t,n){s.showIcon(t,e),s.showIcon(n,!e)},completeSetup:function(){var f,l;t.appParams.diag!==undefined&&i.init(),document.title=t.appParams.title,$("#page-title")[0].innerHTML=t.appParams.title,a=$.Deferred(),u?$.getJSON(t.appParams.proxyProgram+"?ping",function(){a.resolve()}).fail(function(){a.reject()}):(t.appParams.proxyProgram=null,a.resolve()),f=n.init(t.appParams,function(e){switch(e){case n.notificationSignIn:s.signedIn||(s.signedIn=!0,$(document).triggerHandler("signedIn:user"));break;case n.notificationSignOut:s.signedIn&&(s.signedIn=!1,$("#contentPage").fadeOut("fast"),$("#signinPage").fadeIn(),$(document).triggerHandler("hide:profile"),$("#profileAvatar").css("display","none"));break;case n.notificationAvatarUpdate:l=n.getUser().avatar,l?($("#profileAvatar").css("backgroundImage","url("+l+")"),$("#profileAvatar").fadeIn("fast")):$("#profileAvatar").css("display","none")}}),$().ready(function(){$("#signinTitle")[0].innerHTML=t.appParams.title,$("#signinParagraph")[0].innerHTML=t.appParams.splashText,t.appParams.useWebmapOrigImg?t.webmapOrigImageUrlReady.then(function(e){e&&(t.appParams.splashBackgroundUrl=e),$("#signinPageBkgd").css("background-image","url("+t.appParams.splashBackgroundUrl+")").fadeIn(2e3)}):$("#signinPageBkgd").css("background-image","url("+t.appParams.splashBackgroundUrl+")").fadeIn(2e3),$("#signinBlock").fadeIn();if(o){$("#signinLoginPrompt")[0].innerHTML=e.signin.unsupported,$("#signinLoginPrompt").fadeIn();return}u&&($("#signinLoginPrompt")[0].innerHTML=e.signin.checkingServer,$("#signinLoginPrompt").fadeIn()),a.done(function(){t.surveyReady.done(function(){r.init(t.featureSvcParams.url,t.featureSvcParams.id,t.featureSvcParams.objectIdField,t.appParams.surveyorNameField+"+is+null+or+"+t.appParams.surveyorNameField+"=''",t.appParams.proxyProgram),r.getObjectCount().done(function(t){t>0?($("#signinLoginPrompt")[0].innerHTML=e.signin.signinFetching,$("#signinLoginPrompt").fadeIn(),f.then(function(){n.initUI($("#socialMediaButtonArea")[0]),$("#signinLoginPrompt").fadeOut("fast",function(){$("#signinLoginPrompt")[0].innerHTML=e.signin.signinLoginPrompt,$("#signinLoginPrompt").fadeIn("fast"),$("#socialMediaButtonArea").fadeIn("fast")})}).fail(function(){$("#signinLoginPrompt").fadeOut("fast",function(){$("#signinLoginPrompt")[0].innerHTML=e.signin.noMoreSurveys,$("#signinLoginPrompt").fadeIn("fast")})})):($("#signinLoginPrompt")[0].innerHTML=e.signin.noMoreSurveys,$("#signinLoginPrompt").fadeIn())}).fail(function(){$("#signinLoginPrompt")[0].innerHTML=e.signin.noMoreSurveys,$("#signinLoginPrompt").fadeIn()})}).fail(function(){$("#signinLoginPrompt")[0].innerHTML=e.signin.noMoreSurveys,$("#signinLoginPrompt").fadeIn()}),t.appParams.helpText.length===0?$("#helpButton").css("display","none"):($("#helpButton")[0].title=e.tooltips.button_additionalInfo,$("#helpTitle")[0].innerHTML=t.appParams.title,$("#helpBody")[0].innerHTML=t.appParams.helpText)}).fail(function(){$("#signinLoginPrompt").fadeOut("fast",function(){$("#signinLoginPrompt")[0].innerHTML=e.signin.needProxy,$("#signinLoginPrompt").fadeIn("fast")})}),t.appParams.includeOverviewMap&&(s.overviewMap.map=L.map("overviewMap"),L.esri.basemapLayer(s.overviewMap.basemap).addTo(s.overviewMap.map),s.overviewMap.visible?$("#overviewMap").css("visibility","visible"):$("#overviewMap").css("visibility","hidden"),s.updateIconToggle(s.overviewMap.visible,"hideOverview","showOverview"),$("#showHideOverview").css("visibility","visible"),$("#showOverview").on("click",function(){$("#overviewMap").css("visibility","visible"),s.overviewMap.visible=!0,s.updateIconToggle(s.overviewMap.visible,"hideOverview","showOverview")}),$("#hideOverview").on("click",function(){$("#overviewMap").css("visibility","hidden"),s.overviewMap.visible=!1,s.updateIconToggle(s.overviewMap.visible,"hideOverview","showOverview")})),$("#previousImageBtn")[0].title=e.tooltips.button_previous_image,$("#nextImageBtn")[0].title=e.tooltips.button_next_image,$("#skipBtn")[0].innerHTML=e.tooltips.button_skip,$("#submitBtn")[0].innerHTML=e.tooltips.button_submit,$("#userProfileSelectionText")[0].innerHTML=e.labels.menuItem_profile,$("#userSignoutSelectionText")[0].innerHTML=e.labels.menuItem_signout,$("#modalCloseBtn1")[0].title=e.tooltips.button_close,$("#modalCloseBtn2")[0].title=e.tooltips.button_close,$("#modalCloseBtn2")[0].innerHTML=e.labels.button_close,$("#surveysCompleted")[0].innerHTML=e.labels.label_surveys_completed,$("#closeProfileBtn")[0].innerHTML=e.labels.button_returnToSurvey})},updatePhotoSelectionDisplay:function(){s.iVisiblePhoto=parseInt($("#carouselSlidesHolder > .item.active")[0].id.substring(1)),$("#leftCarouselCtl").css("display",s.iVisiblePhoto===0?"none":"block"),$("#rightCarouselCtl").css("display",s.iVisiblePhoto===s.numPhotos-1?"none":"block"),t.appParams.bestPhotoField&&(s.photoSelected=s.iVisiblePhoto===s.iSelectedPhoto,s.updateIconToggle(s.photoSelected,"filledHeart","emptyHeart"),$("#hearts").attr("title",s.photoSelected?e.tooltips.button_best_image:e.tooltips.button_click_if_best_image),$("#hearts")[0].style.display="block")},updateCount:function(){$("#score")[0].innerHTML=s.completions,$("#score2")[0].innerHTML=s.completions,$("#profileCount").fadeIn();if(t.appParams.contribLevels.length>0){var n=t.appParams.contribLevels.length-1,r=-1;while(t.appParams.contribLevels[n].minimumSurveysNeeded>s.completions)r=t.appParams.contribLevels[n].minimumSurveysNeeded,n-=1;$("#rankLabel")[0].innerHTML=t.appParams.contribLevels[n].label,$("#level")[0].innerHTML=e.labels.label_level.replace("${0}",n);if(n===0)$("div",".profileRankStars").removeClass("filled-star").addClass("empty-star");else{var i=$("div:eq("+(n-1)+")",".profileRankStars");i.prevAll().andSelf().removeClass("empty-star").addClass("filled-star"),i.nextAll().removeClass("filled-star").addClass("empty-star")}var o=s.completions-t.appParams.contribLevels[n].minimumSurveysNeeded,u=Math.max(0,r-s.completions),a=o+u;if(r>=0&&a>0){var f=170;$("#profileRankBarFill")[0].style.width=f*o/a+"px",$("#profileRankBar").css("display","block"),$("#remainingToNextLevel")[0].innerHTML=e.labels.label_remaining_surveys.replace("${0}",u)}else $("#remainingToNextLevel")[0].innerHTML="",$("#profileRankBar").css("display","none");$("#ranking").fadeIn()}else $("#ranking").css("display","none")},startQuestion:function(t,n,r){var i="<div id='qg"+n+"' class='form-group'>"+"<label for='q"+n+"'>"+r.question+(r.important?"&nbsp;<div class='importantQuestion sprites star' title=\""+e.tooltips.flag_important_question+'"></div>':"")+"</label><br>";return i},createButtonChoice:function(e,t,n,r){var i="<div id='q"+t+"' class='btn-group'>",s=n.domain.split("|");return $.each(s,function(e,t){i+="<button type='button' class='btn' value='"+e+"' "+(r?"disabled":"")+">"+t+"</button>"}),i+="</div>",i},createListChoice:function(e,t,n,r){var i="",s=n.domain.split("|");return $.each(s,function(e,n){i+="<div class='radio'><label><input type='radio' name='q"+t+"' value='"+e+"' "+(r?"disabled":"")+">"+n+"</label></div>"}),i},wrapupQuestion:function(){var e="</div><div class='clearfix'></div>";return e},addQuestion:function(e,t,n,r){var i=s.startQuestion(e,t,n);n.style==="button"?i+=s.createButtonChoice(e,t,n,r):i+=s.createListChoice(e,t,n,r),i+=s.wrapupQuestion(e,t,n),$(e).append(i),n.style==="button"&&$("#q"+t+" button").click(function(e){$(e.currentTarget).addClass("active").siblings().removeClass("active")})},addPhoto:function(e,t,n,r){var i="<div id='c"+t+"' class='item"+(n?" active":"")+"'><img /></div>";$(e).append(i);var s=$("#c"+t+" img")[0];s.src=r,$(s).on("error",function(){s.src="images/noPhoto.png",$(s).css("margin","auto")})},addPhotoIndicator:function(e,t,n,r,i){var s="<li id='indicator-"+t+"' data-target='#"+r+"' data-slide-to='"+t+"'"+(n?" class='active'":"")+"></li>";$(e).append(s),$("#indicator-"+t).css("background-image","url("+i+")")},showMainContent:function(){$("#mainContent").css("visibility","visible"),$("#profileActionBar").css("display","block"),$("#helpBody")[0].innerHTML=t.appParams.helpText},hideMainContent:function(){$("#mainContent").css("visibility","hidden"),$("#profileActionBar").css("display","none"),$("#helpBody")[0].innerHTML=e.signin.noMoreSurveys},testURL:function(e,t){$.ajax({type:"HEAD",url:e,success:function(){t(!0)},error:function(){t(!1)}})}},$("body").hasClass("unsupportedIE")?o=!0:$("body").hasClass("IE9")&&(u=!0),$("#signinPage").fadeIn(),$(".carousel").bcSwipe({threshold:50}),t.init(),t.parametersReady.then(s.completeSetup),$(document).on("signedIn:user",function(){t.surveyReady.then(function(){var e=n.getUser();s.showMainContent(),$("#name")[0].innerHTML=e.name,$("#name2")[0].innerHTML=e.name,r.getObjectCount(t.appParams.surveyorNameField+"='"+e.name+"'").then(function(e){e>=0?(s.completions=e,s.updateCount()):($("#profileCount").css("display","none"),$("#ranking").css("display","none"))}).fail(function(){$("#profileCount").css("display","none"),$("#ranking").css("display","none")}),$("#hearts").css("display","none"),$("#signinPage").fadeOut()}),t.surveyReady.then(function(){$(document).triggerHandler("show:newSurvey")})}),$(document).on("signedOut:user",function(){r.resetExclusionList(),n.signOut()}),$(document).on("show:noSurveys",function(){s.hideMainContent(),$(document).triggerHandler("show:profile"),$("#additionalInfoPanel").modal("show")}),$(document).on("show:newSurvey",function(){var e=!t.featureSvcParams.canBeUpdated||!n.getUser().canSubmit;$("#submitBtn").fadeTo(100,0),$("#surveyContainer").fadeTo(100,0),r.getCandidate(t.appParams.randomizeSelection).then(function(n){var o=t.appParams.thumbnailLimit<0||n.attachments.length<=t.appParams.thumbnailLimit;s.numPhotos=n.attachments.length;if(!n.obj){$(document).triggerHandler("show:noSurveys");return}if(s.numPhotos===0){i.appendWithLF("no photos for property <i>"+JSON.stringify(n.obj.attributes)+"</i>"),n.obj.attributes[t.appParams.surveyorNameField]="no photos",r.updateCandidate(n),$(document).triggerHandler("show:newSurvey");return}i.appendWithLF("showing property <i>"+JSON.stringify(n.obj.attributes)+"</i> with "+s.numPhotos+" photos"),s.candidate=n,s.iSelectedPhoto=-1,t.appParams.includeOverviewMap&&s.overviewMap.map.setView([n.obj.geometry.y,n.obj.geometry.x],s.overviewMap.zoom);var u=$("#carouselSlidesHolder")[0];$(u).children().remove();var a=$("#carouselIndicatorsHolder")[0];$(a).children().remove();var f=Math.floor((s.numPhotos+1)/2)-1;$.each(n.attachments,function(e,t){s.addPhoto(u,e,f===e,t.url),o&&s.addPhotoIndicator(a,e,f===e,"carousel",t.url)}),$("#carousel").trigger("create"),s.updatePhotoSelectionDisplay(),$("#surveyContainer").fadeTo(1e3,e?.75:1),e||$("#submitBtn").fadeTo(1e3,1)}).fail(function(){$(document).triggerHandler("show:noSurveys")});var o=$("#surveyContainer")[0];$(o).children().remove(),$.each(t.survey,function(t,n){s.addQuestion(o,t,n,e)}),$(".btn-group").trigger("create"),$("#contentPage").fadeIn("fast")}),$(document).on("show:profile",function(){$("#survey").fadeOut("fast",function(){$("#profile").fadeIn("fast")})}),$(document).on("hide:profile",function(){$("#profile").fadeOut("fast",function(){$("#survey").fadeIn("fast")})}),$("#userSignoutSelection").on("click",function(){$(document).triggerHandler("signedOut:user")}),$("#userProfileSelection").on("click",function(){$(document).triggerHandler("show:profile")}),$("#closeProfileBtn").on("click",function(){$(document).triggerHandler("hide:profile")}),$("#skipBtn").on("click",function(){r.addItemToExclusionList(s.candidate.id),$(document).triggerHandler("show:newSurvey")}),$("#submitBtn").on("click",function(){var e,o,u=!0,a;e=$("#surveyContainer"),$.each(t.survey,function(t,n){n.style==="button"?o=$("#q"+t+" .active",e).val():o=$("input[name=q"+t+"]:checked",e).val(),o&&(s.candidate.obj.attributes[n.field]=n.domain.split("|")[o]),n.important&&(o?$("#qg"+t).removeClass("flag-error"):($("#qg"+t).addClass("flag-error"),u=!1,a===undefined&&(a=$("#qg"+t)[0])))}),u?(s.candidate.obj.attributes[t.appParams.surveyorNameField]=n.getUser().name,s.iSelectedPhoto>=0&&(s.candidate.obj.attributes[t.appParams.bestPhotoField]=s.candidate.attachments[s.iSelectedPhoto].id),i.appendWithLF("saving survey for property <i>"+JSON.stringify(s.candidate.obj.attributes)+"</i>"),r.updateCandidate(s.candidate).then(function(){s.completions+=1,s.updateCount(),$(document).triggerHandler("show:newSurvey")})):$("#sidebarContent").animate({scrollTop:a.offsetTop-5},500)}),$("#hearts").on("click",function(){s.photoSelected=!s.photoSelected,s.iVisiblePhoto=parseInt($("#carouselSlidesHolder > .item.active")[0].id.substring(1)),s.iSelectedPhoto=s.photoSelected?s.iVisiblePhoto:-1,s.updatePhotoSelectionDisplay()}),$(".btn-group > .btn").click(function(e){$(e.currentTarget).addClass("active").siblings().removeClass("active")}),$("#carousel").on("slide.bs.carousel",function(e){s.iVisiblePhoto===0&&e.direction==="right"||s.iVisiblePhoto===s.numPhotos-1&&e.direction==="left"?e.preventDefault():$("#hearts")[0].style.display="none"}),$("#carousel").on("slid.bs.carousel",function(){s.updatePhotoSelectionDisplay()}),s});