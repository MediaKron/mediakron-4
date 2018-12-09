<template>
    <table class="table">
        <thead>
            <tr>
                <th @click="applySort('title')" :class="columnClasses('title')">
                    <div>Location
                        <svgicon name="chevron"></svgicon>
                    </div>
                </th>
                <th @click="applySort('status')" :class="columnClasses('status')">
                    <div>Location Status
                        <svgicon name="chevron"></svgicon>
                    </div>
                </th>
                <th @click="applySort('practice_id')" v-if="isAdmin" :class="columnClasses('practice_id')">
                    <div>Practice
                        <svgicon name="chevron"></svgicon>
                    </div>
                </th>
                <th @click="applySort('state')" :class="columnClasses('state')">
                    <div>State
                        <svgicon name="chevron"></svgicon>
                    </div>
                </th>
                <th @click="applySort('updated_at')" :class="columnClasses('updated_at')">
                    <div>Last Updated
                        <svgicon name="chevron"></svgicon>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-if="isEmpty" key="locations-empty-table-row">
                <td colspan="5">
                    <p class="c-table__message u-text-center">No Locations Found</p>
                </td>
            </tr>
            <tr v-else v-for="(location) in locationsList" :key="location.id">
                <td>
                    <router-link :to="{ name: 'edit-location', params: { id: location.id }}">{{ location.title }}</router-link>
                </td>
                <td v-if="isPublished(location.status)"><span class="c-entry__dot c-entry__dot--success"></span>Published</td>
                <td v-else-if="isPending(location.status)"><span class="c-entry__dot c-entry__dot--warning"></span>Pending review</td>
                <td v-else-if="isDeleted(location.status)"><span class="c-entry__dot c-entry__dot--error"></span>Deleted</td>
                <td v-else><span class="c-entry__dot c-entry__dot--neutral"></span>Draft</td>
                <td v-if="isAdmin"><span :title="location.practice.title">{{ location.practice.title }}</span></td>
                <td>{{ location.state }}</td>
                <td>{{ location.updated_at | moment('MMMM Do YYYY') }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    /**
     * This is a simple table component, with column sorting 
     */
    import Row from './Row'
    export default {
        components: {
            Row
        },
        props: {
            header: Array,
            rows: Array
        },
        computed:{
            isEmpty(){
                return this.rows.length === 0;
            }
        }
    }
</script>

<style>
    
</style>
