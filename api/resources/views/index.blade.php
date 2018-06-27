<!DOCTYPE html>
<!--[if lt IE 7]>      
<html class="no-js lt-ie9 lt-ie8 lt-ie7">
   <![endif]-->
   <!--[if IE 7]>         
   <html class="no-js lt-ie9 lt-ie8">
      <![endif]-->
      <!--[if IE 8]>         
      <html class="no-js lt-ie9">
         <![endif]-->
         <!--[if gt IE 8]><!-->
         <html class="no-js">
            <!--<![endif]-->
            <head>
               <meta charset="utf-8">
               <meta http-equiv="X-UA-Compatible" content="IE=edge">
               <title>Release 3.9 Comments test</title>
               <meta name="description" content="">
               <meta name="csrf-token" content="{{ csrf_token() }}">
               <meta property="og:image" content="/bundles/mediakron/img/mklogo-black-padding.jpg"/>
               <meta name="viewport" content="width=device-width, initial-scale=1">
               <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
               <link href="{{ mix('css/app.css') }}" rel="stylesheet">
               
          
            </head>
            <body>
               <!--[if lt IE 7]>
               <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
               <![endif]-->
               <!--[if lt IE 9]>
               <p class="chromeframe">You are using an <strong>outdated</strong> browser. Mediakron will not run well on browsers older than IE9.  Please upgrade</p>
               <![endif]-->
               <noscript>
                 <div style="padding:1em;margin:4em auto;max-width: 700px;text-align: center;">
                   <p><strong>For Mediakron to work, it is necessary to enable JavaScript.</strong></p>
                   <p>Here are the <a style="color:blue" href="http://www.enable-javascript.com/" target="_blank">instructions how to enable JavaScript in your web browser</a>.
                 </div>
               </noscript>
               
               <div id="mediakron">
                   <div id="main-container">
                       
                       <header id="header" role="banner" style="display:none">
                          <div id="navbar">
                                <button type="button" class="mobile-nav-button mobile-nav-close"><span class="mk-icon mk-close"></span></button>
                                <nav id="nav-main" role="navigaton" aria-label="Main Navigation">
                                    <!-- Main Menu will get loaded here -->
                                </nav>
                                <nav id="nav-secondary" role="navigaton" aria-label="Secondary Navigation">                       
                                    <!-- Navbar Right Goes Here -->
                                </nav>
                          </div>
                          <div id="branding">
                                 <button type="button" class="mobile-nav-button"><span class="mk-icon mk-menu"></span></button>
                                <span id="site-logo"></span>

                                <h1 class="page-header"><span id="site-name"><a href="home"></a></span></h1>
                                <span id="institution-logo"></span>
                          </div>
                          <div id="poll"></div>
                      </header> 
                      
                      <div id="wrapper-main">
                           <main role="main">
                             <div id="primary"></div>
                             <div id="secondary"></div>
                          </main>
                      </div>

                      <div id="overlay"></div>
                      <div id="admin"></div>
                  
                  </div> 
                  
                  <section id="settings-context" class="closed settings-pane"></section>
                  
                   <div id="help-context" class="closed help-pane"><div id="help-contents" class="overlay overlay-sidebar"></div>
                     <div class="overlay-bg"></div>
                   </div>
                   
                  <div id="linkbrowser-context" class="closed linkbrowser-pane "><div id="linkbrowser-contents"></div></div>
                
                  <button type="button" class="scroll-arrow btn-no-style scroll-top"><span class="mk-icon mk-arrow-up"></span><span class="sr-only">To Top</span></button>
                  
                  <button type="button" class="fullscreen-nav-toggle"><span class="mk-icon mk-menu"></span></button>
                  
                  <div id="progress-bar" class="site-loader">
                     <div class="progress active">
                        <div class="progress-bar" style="width: 0%"></div>
                     </div>
                     <div id="progress-text"></div>
                  </div>
                  
                  <div id="messages">
                    <div id="message-top"></div>
                    <div id="message-center"></div>
                    <div id="message-left"></div>
                    <div id="message-right"></div>
                    <div id="message-bottom"></div>
                  </div>
                  
                  <div class="js-screen fade-screen"></div>
                  
                  <div id="debug" class="hide">
                    <h2>Mediakron Debugging</h2>
                  </div>

               </div>  

               <script  type='text/javascript' src="{{ mix('js/app.js') }}"></script>
               
                <script>
                  (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
                  function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
                  e=o.createElement(i);r=o.getElementsByTagName(i)[0];
                  e.src='//www.google-analytics.com/analytics.js';
                  r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
                  ga('create','ziggy');ga('send','pageview');
               </script>
            </body>
         </html>