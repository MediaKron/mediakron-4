        <b-nav-item-dropdown>
            <b-nav-item>MediaKron Support</b-nav-item>
            <b-nav-item href="mailto:mediakron@bc.edu">Email mediakron@bc.edu</b-nav-item>
            <b-nav-item href="/help">Visit Support</b-nav-item>
            <b-nav-item-dropdown text="Help Categories" right>
                <b-nav-item :to="basePath + '/help/mediakron-basics'">About MediaKron</b-nav-item>
                <b-nav-item :to="basePath + '/help/working-with-content'">Working with Content</b-nav-item>
                <b-nav-item :to="basePath + '/help/mediakron-basics'">Administering Your Site</b-nav-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="For content creators" right>
                <b-nav-item :to="basePath + '/help/working-with-content/content-types/stories-overview'">Working with stories</b-nav-item>
                <b-nav-item :to="basePath + '/help/working-with-content/content-types/folder-overview'">Working with folders</b-nav-item>
                <b-nav-item :to="basePath + '/help/working-with-content/content-types/map-overview'">Working with maps</b-nav-item>
                <b-nav-item :to="basePath + '/help/working-with-content/content-types/timeline-overview'">Working with timelines</b-nav-item>
                <b-nav-item :to="basePath + '/help/working-with-content/content-types'">Other content types</b-nav-item>
                <b-nav-item :to="basePath + '/help/working-with-content/revisions'">Recovering previous versions</b-nav-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="For Site Administrators" right>
                <b-nav-item :to="basePath + '/help/site-administration/managing-users'">Adding users or classes to a site</b-nav-item>
                <b-nav-item :to="basePath + '/help/site-administration/hompage-overview'">Customizing the homepage</b-nav-item>
                <b-nav-item :to="basePath + '/help/site-administration/menu-overview'">Adding Menus</b-nav-item>
                <b-nav-item :to="basePath + '/help/site-administration/site-appearance'">Changing site colors/logo</b-nav-item>
                <b-nav-item :to="basePath + '/help/site-administration/mediakron-to-canvas-overview'">Integrating MediaKron with Canvas</b-nav-item>
            </b-nav-item-dropdown>
        </b-nav-item-dropdown>