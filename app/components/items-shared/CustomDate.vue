<template>
    <div class="item-element-source" v-if="isEditing">
        <b-button v-b-toggle.dateCollapse variant="outline-dark" class="mb-3 text-black w-100 border-dashed text-left">
           <span class="when-opened"><span class="sr-only">Close</span><font-awesome-icon icon="caret-down" /> </span> <span class="when-closed"><span class="sr-only">Open</span><font-awesome-icon icon="caret-down" /> </span> Custom Date
        </b-button>
        <b-collapse id="dateCollapse" >
        <b-input-group prepend="Start">
            <label for="source" class="sr-only">Start Year</label>
            <b-form-input id="start_year" v-model="editItem.startDateYear" placeholder="Year(YYYY)"></b-form-input>
            <label for="citation" class="sr-only">Start Month</label>
            <b-form-select v-model="editItem.startDateMonth" :options="monthOptions"></b-form-select>
            <label for="description" class="sr-only">Start Day</label>
            <b-form-input id="start_day" v-model="editItem.startDateDay" placeholder="Day(DD)"></b-form-input>
            <label for="customStartTime" class="sr-only">Start Time</label>
            <flat-pickr v-model="customStartTime" :config="configTime" class="form-control bg-white" placeholder="Time"
                name="customStartTime">
            </flat-pickr>
        </b-input-group>

        <b-input-group prepend="End  " class="mt-3">
            <label for="published" class="sr-only">End Year</label>
            <b-form-input id="end_year" v-model="editItem.endDateYear" placeholder="Year(YYYY)"></b-form-input>
            <label for="creator" class="sr-only">End Month</label>
            <b-form-select v-model="editItem.endDateMonth" :options="monthOptions"></b-form-select>
            <label for="publisher" class="sr-only">End Day</label>
            <b-form-input id="end_day" v-model="editItem.endDateDay" placeholder="Day(DD)"></b-form-input>
            <label for="customEndTime" class="sr-only">End Time</label>
            <flat-pickr v-model="editItem.customEndTime" :config="configTime" class="form-control bg-white"
                placeholder="Time" name="customEndTime">
            </flat-pickr>
        </b-input-group>
        </b-collapse>

        <!-- <b-button @click="isDateCalendar=!isDateCalendar" v-b-toggle.calendarCollapse class="mb-3"> {{ calendarButton }}
        </b-button>
        <b-form-group class="" id="calendarCollapse">
            <label for="customStartDate">Start Date</label>
            <flat-pickr v-model="customStartDate" :config="configDate" class="form-control"
                placeholder="Select start date" name="customStartDate">
            </flat-pickr>


            <label for="customEndDate">End Date</label>
            <flat-pickr v-model="editItem.customEndDate" :config="configDate" class="form-control"
                placeholder="Select end date" name="customEndDate">
            </flat-pickr>

            <pre>Selected date is - {{ customStartDate }}</pre>
        </b-form-group> -->

    </div>
    <div v-else>
        <h1>Custom Date/Time</h1>
        <h2>{{ customStartDate }}</h2>
        <h2>{{ customStartTime }}</h2>
    </div>
</template>

<script>
    import {
        mapGetters
    } from 'vuex'
    import flatPickr from 'vue-flatpickr-component'
    import 'flatpickr/dist/flatpickr.css'
    import BCollapse from 'bootstrap-vue/src/components/collapse/collapse'

    export default {
        components: {
            flatPickr,
            BCollapse
        },

        computed: {
            ...mapGetters('items', [
                'editItem',
                'isEditing',
                'first'
            ]),
            customStartDate: function () {
                return this.StartDate
            },
            customStartTime: function () {
                return this.StartTime
            },
            calendarButton() {
                if (this.isDateCalendar) {
                    return 'Collapse Calendar'
                }
                return 'Add Dates from Calendar'
            },

        },
        data: function () {
            return {
                StartDate: new(Date),
                StartTime: new(Date),
                monthOptions: null,

                configDate: {
                    wrap: false, // set wrap to true only when using 'input-group'
                    altFormat: 'M	j, Y',
                    altInput: true,
                    dateFormat: 'Y-m-d',
                },
                configTime: {
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i:s",
                    enableSeconds: true,
                },
                isDateCalendar: false,
                monthOptions: [{
                        value: null,
                        text: 'Select a Month'
                    },
                    {
                        value: '01',
                        text: 'January'
                    },
                    {
                        value: '02',
                        text: 'February'
                    },
                    {
                        value: '03',
                        text: 'March'
                    },
                    {
                        value: '04',
                        text: 'April'
                    },
                    {
                        value: '05',
                        text: 'May'
                    },
                    {
                        value: '06',
                        text: 'June'
                    },
                    {
                        value: '07',
                        text: 'July'
                    },
                    {
                        value: '08',
                        text: 'August'
                    },
                    {
                        value: '09',
                        text: 'September'
                    },
                    {
                        value: '10',
                        text: 'October'
                    },
                    {
                        value: '11',
                        text: 'November'
                    },
                    {
                        value: '12',
                        text: 'December'
                    },
                ],

            }

        }
    }
</script>