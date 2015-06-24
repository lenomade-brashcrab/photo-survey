/*global define,$ */
/*jslint browser:true,sloppy:true,nomen:true,unparam:true,plusplus:true */
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
//============================================================================================================================//
define(['diag'], function (diag) {
    var that;
    return {

        // Constants for callback to app
        notificationSignIn: 0,
        notificationSignOut: 1,
        notificationAvatarUpdate: 2,

        //--------------------------------------------------------------------------------------------------------------------//

        _loggedIn: null,
        _user: null,
        _statusCallback: null,
        _currentProvider: null,
        _availabilities: {
            facebook: false,
            googleplus: false,
            twitter: false
        },

        //--------------------------------------------------------------------------------------------------------------------//

        init: function (appConfig, statusCallback) {
            that = this;
            var deferred = $.Deferred();
            var isIE8 = that._createIE8Test();
            that._statusCallback = statusCallback;
            that.appConfig = appConfig;

            //................................................................................................................//

            // Attempt to initialize Facebook if wanted
            var facebookDeferred = $.Deferred();
            setTimeout(function () {
                if (!isIE8 && appConfig.appParams.showFacebook) {
                    // Provide a startup function for when the SDK finishes loading
                    window.fbAsyncInit = function () {
                        FB.Event.subscribe("auth.login", that._updateFacebookUser);
                        FB.Event.subscribe("auth.statusChange", that._updateFacebookUser);
                        FB.Event.subscribe("auth.logout", that._updateFacebookUser);

                        FB.init({
                            appId: that.appConfig.appParams.facebookAppId,
                            cookie: true,  // enable cookies to allow the server to access the session
                            xfbml: false,   // parse social plugins on this page such as Login
                            status: true,  // check login status on every page load
                            version: "v2.3"
                        });

                        // Update UI based on whether or not the user is currently logged in to FB
                        FB.getLoginStatus(that._updateFacebookUser);
                    };

                    // Load the SDK asynchronously; it calls window.fbAsyncInit when done
                    (function (d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0];
                        if (d.getElementById(id)) {
                            return;
                        }
                        js = d.createElement(s);
                        js.id = id;
                        js.src = "//connect.facebook.net/en_US/sdk.js";
                        fjs.parentNode.insertBefore(js, fjs);
                    }(document, "script", "facebook-jssdk"));

                    that._availabilities.facebook = true;
                    facebookDeferred.resolve(true);
                } else {
                    facebookDeferred.resolve(false);
                }
            });

            //................................................................................................................//

            // Attempt to initialize Google+ if wanted
            var googlePlusDeferred = $.Deferred();
            setTimeout(function () {
                if (!isIE8 && appConfig.appParams.showGooglePlus) {
                    // Load the SDK asynchronously; it calls window.ggAsyncInit when done
                    (function () {
                        // Don't have Google+ API scan page for button
                        window.___gcfg = {parsetags: "explicit"};

                        // Modernizr/yepnope for load to get onload event cross-browser
                        Modernizr.load([{
                            load: "https://apis.google.com/js/client:platform.js",
                            complete: function () {
                                gapi.load('auth2', function () {
                                    gapi.client.load('plus', 'v1').then(function () {
                                        that._availabilities.googleplus = true;
                                        googlePlusDeferred.resolve(true);
                                    });
                                });
                            }
                        }]);
                    }());
                } else {
                    googlePlusDeferred.resolve(false);
                }
            });

            //................................................................................................................//

            // Attempt to initialize Twitter if wanted
            var twitterDeferred = $.Deferred();
            setTimeout(function () {
                if (!isIE8 && appConfig.appParams.showTwitter) {
                    that._availabilities.twitter = true;
                    twitterDeferred.resolve(true);
                } else {
                    twitterDeferred.resolve(false);
                }
            });

            //................................................................................................................//

            // Test if we have any initialized providers
            $.when(facebookDeferred, googlePlusDeferred, twitterDeferred)
                .done(function (facebookAvail, googlePlusAvail, twitterAvail) {
                if (facebookAvail || googlePlusAvail || twitterAvail) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });

            return deferred;
        },

        initUI: function (buttonContainer) {

            if (that._availabilities.facebook) {
                $('<div id="facebookSignin" class="socialMediaButton facebookOfficialColor" style="background-image:url(\'images/FB-f-Logo__blue_29.png\')">Facebook</div>').appendTo(buttonContainer);
                $('#facebookSignin').on('click', function () {
                    // Force reauthorization. FB says, "Apps should build their own mechanisms for allowing switching
                    // between different Facebook user accounts using log out functions and should not rely upon
                    // re-authentication for this."  (https://developers.facebook.com/docs/facebook-login/reauthentication),
                    // but doesn't seem to provide a working logout function that clears its cookies if third-party
                    // cookies are blocked.
                    FB.login(function (response) {}, {
                        auth_type: 'reauthenticate'
                    });
                });
            }

            if (that._availabilities.googleplus) {
                $('<div id="googlePlusSignin" class="socialMediaButton googlePlusOfficialColor" style="background-image:url(\'images/gp-29.png\')">Google+</div>').appendTo(buttonContainer);
                $('#googlePlusSignin').on('click', function () {
                    // Google caveat for setting cookiepolicy to "none":
                    // The none value does not set cookies or session storage for the sign-in button
                    // and uses a less efficient fallback mechanism for determining user and session
                    // information. Setting this value to none also prevents gapi.auth.signout from
                    // working for the user and requires you to implement signout appropriately. This
                    // value also can prevent a user who is signed in to multiple Google accounts
                    // (say, work and personal) from being able to select which account to use with
                    // your website.
                    // -- https://developers.google.com/+/web/signin/reference/#button_attr_clientid
                    gapi.auth.signIn({
                        "clientid": that.appConfig.appParams.googleplusClientId,
                        "cookiepolicy": "http://" + document.location.hostname,
                        "callback": that._updateGooglePlusUser
                    });
                });
            }

            if (that._availabilities.twitter) {
                $('<div id="twitterSignin" class="socialMediaButton twitterOfficialColor" style="background-image:url(\'images/Twitter_logo_blue_29.png\')">Twitter</div>').appendTo(buttonContainer);
                $('#twitterSignin').on('click', function () {
                    that._showTwitterLoginWin(false);
                });
            }

        },

        /**
         * Returns the signed-in state.
         * @param {boolean} Logged in or not
         */
        isSignedIn: function () {
            return that._loggedIn;
        },

        /**
         * Returns the currently signed-in user name and service id.
         * @return {JSON} Structure containing "name" and "id" parameters if a user is
         * logged in, an empty structure if a user is not logged in, and null if the
         * service is not available due to browser incompatibility or startup failure
         * @memberOf social#
         */
        getUser: function () {
            return that._user;
        },

        signOut: function () {
            diag.appendWithLF("signOut; believed logged in: " + that.isSignedIn());  //???
            if (that.isSignedIn()) {
                switch (that._currentProvider) {

                    case "facebook":
                        diag.appendWithLF("FB logout");  //???
                        // Log the user out of the app; known FB issue is that cookies are not cleared as promised if
                        // browser set to block third-party cookies
                        FB.logout();
                        break;

                    case "googlePlus":
                        diag.appendWithLF("G+ logout");  //???
                        // Log the user out of the app; known G+ issue that user is not really logged out
                        try {
                            that._disconnectUser(that._user.access_token);
                            gapi.auth.signOut();
                            that._showGooglePlusLogoutWin();
                        } catch (ignore) {
                        }
                        break;

                    case "twitter":
                        diag.appendWithLF("Tw logout");  //???
                        // Update the calling app
                        that._statusCallback(that.notificationSignOut);

                        // Log the user out of the app; known Twitter issue that it does not log the current user out
                        // unless he/she enters a password and then clicks "cancel", and then clicks to return to the
                        // app even though the Twitter display claims that the app continues to have access to the
                        // user's information.
                        that._showTwitterLoginWin(true);
                        break;
                }
            }
            that._currentProvider = "none";
        },

        //--------------------------------------------------------------------------------------------------------------------//

        /**
         * Updates the information held about the signed-in user.
         * @param {object} [response] Service-specific response object
         * @memberOf socialFB#
         * @abstract
         */
        _updateFacebookUser: function (response) {
            // Events & FB.getLoginStatus return an updated authResponse object
            // {
            //     status: 'connected',
            //     authResponse: {
            //         accessToken: '...',
            //         expiresIn:'...',
            //         signedRequest:'...',
            //         userID:'...'
            //     }
            // }

            // that response may not be true; we'll find out for sure when we call FB.api
            that._loggedIn = response && response.status === "connected";
            that._currentProvider = that._loggedIn ? "facebook" : "";

            // If logged in, update info from the account
            that._user = {};
            if (that._loggedIn) {
                FB.api("/me", {fields: "name,id"}, function (apiResponse) {
                    that._loggedIn = apiResponse.name !== undefined;
                    if (that._loggedIn) {
                        that._user = {
                            "name": apiResponse.name,
                            "id": apiResponse.id
                        };
                        // Update the calling app
                        that._statusCallback(that.notificationSignIn);

                        // Update the avatar
                        FB.api("/" + that._user.id + "/picture", function (picResponse) {
                            if (picResponse && !picResponse.error && picResponse.data && !picResponse.data.is_silhouette && picResponse.data.url) {
                                that._user.avatar = picResponse.data.url;
                            }
                            // Update the calling app
                            that._statusCallback(that.notificationAvatarUpdate);
                        });
                    }
                    that._statusCallback(that.notificationAvatarUpdate);
                });

            } else {
                // Update the calling app
                that._statusCallback(that.notificationSignOut);
            }
        },

        //--------------------------------------------------------------------------------------------------------------------//

        /**
         * Updates the information held about the signed-in user.
         * @param {object} [response] Service-specific response object
         * @memberOf socialGP#
         * @abstract
         */
        _updateGooglePlusUser: function (response) {
            that._loggedIn = response && response.status && response.status.signed_in;
            that._currentProvider = that._loggedIn ? "googlePlus" : "";

            // If logged in, update info from the account
            that._user = {};
            if (that._loggedIn) {
                gapi.client.request({
                    "path": "/plus/v1/people/me"
                }).then(function (apiResponse) {
                    that._user = {
                        "name": apiResponse.result.displayName,
                        "id": apiResponse.result.id,
                        "access_token": response.access_token
                    };

                    // Update the calling app
                    that._statusCallback(that.notificationSignIn);

                    // Update the avatar
                    if (apiResponse.result.image && !apiResponse.result.image.isDefault && apiResponse.result.image.url) {
                        that._user.avatar = apiResponse.result.image.url;
                        that._statusCallback(that.notificationAvatarUpdate);
                    }
                }, function (reason) {
                    // Update the calling app
                    that._statusCallback(that.notificationSignOut);
                });

            // Report not-logged-in state
            } else {
                that._statusCallback(that.notificationSignOut);
            }
        },

        // From https://developers.google.com/+/web/signin/disconnect
        _disconnectUser: function(access_token) {
            var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' +
                access_token;

            // Perform an asynchronous GET request.
            $.ajax( {
                type: 'GET',
                url: revokeUrl,
                async: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function(nullResponse) {
                    that._updateGooglePlusUser();
                },
                error: function(e) {
                    that._updateGooglePlusUser();
                }
            });
        },

        _showGooglePlusLogoutWin: function (forceLogin) {
            var baseUrl, left, top, w, h;

            baseUrl = that.appConfig.appParams.googleplusLogoutUrl;
            left = (screen.width / 2) - (w / 2);
            top = (screen.height / 2) - (h / 2);
            w = screen.width / 2;
            h = screen.height / 1.5;

            window.open(baseUrl, "GooglePlus", "scrollbars=yes, resizable=yes, left=" + left + ", top=" + top + ", width=" + w + ", height=" + h, true);
        },

        //--------------------------------------------------------------------------------------------------------------------//

        /**
         * Displays the Twitter login window.
         * <br>N.B.: does not log the current user out unless he/she enters a password and then clicks "cancel",
         * and then clicks to return to the app even though the Twitter display claims that the app continues to have
         * access to the user's information.
         * @param {boolean} [forceLogin] If true, requires a re-login
         */
        _showTwitterLoginWin: function (forceLogin) {
            var baseUrl, package_path, redirect_uri, left, top, w, h;

            baseUrl = that.appConfig.appParams.twitterSigninUrl;
            package_path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
            redirect_uri = encodeURIComponent(location.protocol + '//' + location.host + package_path + that.appConfig.appParams.twitterCallbackUrl);
            left = (screen.width / 2) - (w / 2);
            top = (screen.height / 2) - (h / 2);
            w = screen.width / 2;
            h = screen.height / 1.5;

            baseUrl += '?';
            if (forceLogin) {
                baseUrl += 'force_login=true';
            }
            if (forceLogin && redirect_uri) {
                baseUrl += '&';
            }
            if (redirect_uri) {
                baseUrl += 'redirect_uri=' + redirect_uri;
            }

            window.open(baseUrl, "twoAuth", "scrollbars=yes, resizable=yes, left=" + left + ", top=" + top + ", width=" + w + ", height=" + h, true);
            window.oAuthCallback = function () {
                that._updateTwitterUser();
            };
        },

        /**
         * Updates the information held about the signed-in user.
         * @param {object} [response] Service-specific response object
         * @memberOf socialTW#
         * @abstract
         */
        _updateTwitterUser: function () {
            var query = {
                include_entities: true,
                skip_status: true
            };
            $.ajax({
                url: that.appConfig.appParams.twitterUserUrl,
                data: query,
                dataType: "jsonp",
                timeout: 10000,
                success: function (data, textStatus, jqXHR) {

                    that._loggedIn = data && !data.hasOwnProperty("signedIn") && !data.signedIn;
                    that._currentProvider = that._loggedIn ? "twitter" : "";

                    if (that._loggedIn) {
                        that._user = {
                            "name": data.name,
                            "id": data.id_str
                        };

                        // Update the calling app
                        that._statusCallback(that.notificationSignIn);

                        // Update the avatar
                        if (!data.default_profile_image && data.profile_image_url_https) {
                            that._user.avatar = data.profile_image_url_https;
                            that._statusCallback(that.notificationAvatarUpdate);
                        }
                    } else {
                        that._user = {};

                        // Update the calling app
                        that._statusCallback(that.notificationSignOut);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // handle an error condition
                    that._loggedIn = false;

                    // Update the calling app
                    that._statusCallback(that.notificationSignOut);
                }
            }, "json");
        },

        //--------------------------------------------------------------------------------------------------------------------//

        /**
         * Tests if the browser is IE 8 or lower.
         * @return {boolean} True if the browser is IE 8 or lower
         */
        _createIE8Test: function () {
            return that._isIE(8, "lte");
        },

        /**
         * Detects IE and version number through injected conditional comments (no UA detect, no need for conditional
         * compilation / jscript check).
         * @param {string} [version] IE version
         * @param {string} [comparison] Operator testing multiple versions based on "version"
         * parameter, e.g., 'lte', 'gte', etc.
         * @return {boolean} Result of conditional test; note that since IE stopped supporting conditional comments with
         * IE 10, this routine only works for IE 9 and below; for IE 10 and above, it always returns "false"
         * @author Scott Jehl
         * @see The <a href="https://gist.github.com/scottjehl/357727">detect IE and version number through injected
         * conditional comments.js</a>.
         */
        _isIE: function (version, comparison) {
            var cc      = 'IE',
                b       = document.createElement('B'),
                docElem = document.documentElement,
                isIE;

            if (version) {
                cc += ' ' + version;
                if (comparison) { cc = comparison + ' ' + cc; }
            }

            b.innerHTML = '<!--[if ' + cc + ']><b id="iecctest"></b><![endif]-->';
            docElem.appendChild(b);
            isIE = !!document.getElementById('iecctest');
            docElem.removeChild(b);
            return isIE;
        }

    };
});
