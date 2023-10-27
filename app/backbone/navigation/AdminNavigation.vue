<template>
    <nav  class="navbar navbar-fixed-top navbar-inverse" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <h1 class="sr-only"><a class="navbar-brand" href="/">MediaKron</a></h1>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse navbar-ex1-collapse">
                <ul id="nav" class="nav navbar-nav">
                    <li>
                        <a href="https://mediakron.bu.edu/help/mediakron-basics">About</a>
                    </li>
                     <li>
                        <a href="https://mediakron.bu.edu/help">Support</a>
                    </li>
                    <li>
                        <a href="mailto:mediakron@bu.edu">Contact</a>
                    </li>
                
                    	                    <li>
	                        <a href="/profile/">My Account</a>
	                    </li>
                    	                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Administration <span class="caret"></span></a>
                            <ul class="dropdown-menu" role="menu">
                                <li><a href="/admin/sites/">Sites</a></li>
                                <li><a href="/admin/instituition/">Groups</a></li>
                                <li><a href="/admin/people/">People</a></li>
                            </ul>
                        </li>
						                    	<li><a href="/logout">Logout</a></li>
                                   
                     
               
                </ul>
                
                <a href="http://www.bu.edu" id="bclogo"><img src="/bundles/mediakron/img/bclogo.png" alt="Boston University" /></a>
                
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container -->
    </nav>
</template>

<script>
export default {

}
</script>

<style>

</style>
