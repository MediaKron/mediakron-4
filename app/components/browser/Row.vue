<template>
	<div class="item-card">
	
		<div class="item-card--thumbnail medium">
			<image :src="image" :title="item.title" :alt="item.caption" />
	
			<div v-if="access('can administer site')" class="bulk-check">
				<input class="bulk-action" type="checkbox" name="bulk-action" value="<%= item.get('uri') %>" />
				<label class="bulk-actions-select sr-only" for="bulk-action">Select</label>
			</div>
	
			<div class="item-type">
				<span class="sr-only">Type:</span> {{ item.type }}
			</div>
		</div>
	
		<div class="item-card--content">
	
			<header class="item-card--title">
				<h4>
					<link :href="link" />
				</h4>
	
				<div class="item-card--changes">
					<div class="created-by"><strong>Created: </strong>{{ item.created }} by {{ item.creator }} </div>
					<div class="last-changed"><strong>Updated:</strong> {{ item.updated }}
						<span v-if="editor"> by {{ item.editor }} </span>
					</div>
				</div>
			</header>
	
			<div class="item-card--actions">
	
				<div v-if="canEdit" class="item-card--options">
	
					<button type="button" class="open-modal actions-button btn btn-default btn-xs">
					<span class="mk-icon mk-ellipsis"></span>
					<span class="button-inner-text">Options</span>
				</button>
	
					<ul class="modal-content modal-up" data-visually-hidden="true">
						<li class="modal-title">
							<span class="mk-icon mk-ellipsis"></span> Options
						</li>
	
						<li class="close-modal">
							<button class="btn btn-sm btn-default" aria-label="Close">
	      					<span class="mk-icon mk-close"></span>
	      					<span class="button-text sr-only"> Close</span> 
	      				</button>
						</li>
	
						<li class="modal-item horizontal">
							<link :href="editLink" />
						</li>
	
						<li v-if="canDestroy" class="modal-item horizontal">
							<link :href="item.deleteLink()" />
						</li>
	
						<li v-if="canUnpublish" class="modal-item horizontal">
							<link v-if="item.published" :href="item.unpublishUrl" />
							<link v-if="!item.published" :href="item.publishUrl" />
						</li>
	
						<li v-if="canDuplicate" class="modal-item horizontal">
							<link :href="item.duplicateLink" />
						</li>
	
						<li v-if="canArchive" class="modal-item horizontal">
							<link v-if="item.archived" :href="item.restoreLink" />
							<link v-if="!item.archived" :href="item.archiveLink" />
						</li>
	
						<li v-if="canLock" class="modal-item horizontal">
							<link v-if="item.locked" :href="item.unlockLink" />
							<link v-if="!item.locked" :href="item.lockLink" />
						</li>
	
						<li v-if="canTransmit" class="modal-item horizontal">
							<link :href="item.transmitLink" />
						</li>
					</ul>
				</div>
	
				<div v-if="hasCollection" class="view-in-collection">
					<button type="button" class="open-modal btn btn-default btn-xs">
						<span class="button-inner-text">
							<span class="mk-icon mk-view"></span>
							View in
						</span>
					</button>
	
					<ul class="modal-content modal-up" data-visually-hidden="true">
						<li class="modal-title">
							<span class="mk-icon mk-view"></span> View In
						</li>
						<li class="close-modal">
							<button class="btn btn-sm btn-default" aria-label="Close">
							<span class="mk-icon mk-close"></span>
							<span class="button-text sr-only"> Close</span> 
						</button>
						</li>
	
						<li v-if="slideshowItems.length > 0" v-for="item in slideshowItems" v-bind:key="item.id" class="modal-item horizontal">
							<span class="mk-icon mk-slideshow"></span> {{ getContextLinkTo(item.id) }}
						</li>
	
						<li v-if="folderItems.length > 0" v-for="item in folderItems" v-bind:key="item.id" class="modal-item horizontal">
							<span class="mk-icon mk-folder"></span> {{ getContextLinkTo(item.id) }}
						</li>
	
						<li v-if="storyItems.length > 0" v-for="item in storyItems" v-bind:key="item.id" class="modal-item horizontal">
							<span class="mk-icon mk-story"></span> {{ getContextLinkTo(item.id) }}
						</li>
	
						<li v-if="narrativeItems.length > 0" v-for="item in narrativeItems" v-bind:key="item.id" class="modal-item horizontal">
							<span class="mk-icon mk-narrative"></span> {{ getContextLinkTo(item.id) }}
						</li>
	
						<li v-if="narrativeItems.length > 0" v-for="item in narrativeItems" v-bind:key="item.id" class="modal-item horizontal">
							<span class="mk-icon mk-narrative"></span> {{ getContextLinkTo(item.id) }}
						</li>
	
						<li v-if="progressionItems.length > 0" v-for="item in progressionItems" v-bind:key="item.id" class="modal-item horizontal">
							<span class="mk-icon mk-progression"></span> {{ getContextLinkTo(item.id) }}
						</li>
	
						<li v-if="mapItems.length > 0" v-for="item in mapItems" v-bind:key="item.id" class="modal-item horizontal">
							<span class="mk-icon mk-marker"></span> {{ getContextLinkTo(item.id) }}
						</li>
	
						<li v-if="citationsItems.length > 0" v-for="item in citationsItems" v-bind:key="item.id" class="modal-item horizontal">
							<span class="mk-icon mk-asterisk"></span> {{ getContextLinkTo(item.id) }}
						</li>
	
						<li v-if="timelineItems.length > 0" v-for="item in timelineItems" v-bind:key="item.id" class="modal-item horizontal">
							<span class="mk-icon mk-timeline"></span> {{ getContextLinkTo(item.id) }}
						</li>
					</ul>
				</div>
			</div>
	
			<div class="item-card--status">
				<ul>
					<li v-if="!item.published"><span class="unpublished"><span class="mk-icon mk-unpublish"></span> Unpublished</span>
					</li>
	
					<li v-if="!item.locked && canEdit"><span class="locked"><span class="mk-icon mk-lock"></span> Locked</span>
					</li>
	
					<li v-if="item.new"><span class="updates-new"><span class="mk-icon mk-updates"></span> New</span>
					</li>
	
					<li v-if="!item.new && item.updated"><span class="updates-changed"><span class="mk-icon mk-updates"></span> Updated</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapActions, mapState, mapGetters } from 'vuex';
	import { imageSizeMixin } from '@/components/mixins/image-size';

	export default {
		mixins: [imageSizeMixin],
		prop: {
			item: Object
		},
		data() {
			return {
				parents: ['topics', 'tags', 'maps', 'timelines', 'comparisons'],
				test: false
			}
		},
		computed: {
			image(){
				return this.imageSquareSmall(this.item.image);
			},
			hasCollection(){
				// Does this item have any collections
			},
			slideshowItems(){

			},
			...mapGetters('profile', [
				'access',
				'canEdit',
				'canPublish',
				'canUnpublish',

				'canDestroy',
				'canTransmit'
			])
		}
	}
</script>

<style>
	
</style>
