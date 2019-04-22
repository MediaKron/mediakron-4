<template>
        <div class="item-element-source" v-if="isEditing">
            <header>Add Custom Date/Times</header>
                <b-form-group class="">
                    <label for="source">Start Year</label>
                    <b-form-input id="start_year" v-model="editItem.startDateYear" placeholder="2019" ></b-form-input>

                    <label for="citation">Start Month</label>
                    <b-form-select v-model="editItem.startDateMonth" :options="monthOptions" class="mt-3"></b-form-select>

                    <label for="description">Start Day</label>
                    <b-form-input id="start_day" v-model="editItem.startDateDay" placeholder="25" ></b-form-input>

                    <label for="published">End Year</label>
                    <b-form-input id="end_year" v-model="editItem.endDateYear" placeholder="2019" ></b-form-input>

                    <label for="creator">End Month</label>
                    <b-form-select v-model="editItem.endDateMonth" :options="monthOptions" class="mt-3"></b-form-select>

                    <label for="publisher">End Day</label>
                    <b-form-input id="end_day" v-model="editItem.endDateDay" placeholder="25" ></b-form-input>

                    <label for="customStartTime">Start Time</label>
                    <flat-pickr
                            v-model="customStartTime"
                            :config="configTime"
                            class="form-control"
                            placeholder="Select start time"
                            name="customStartTime">
                    </flat-pickr>

                    <label for="customEndTime">End Time</label>
                    <flat-pickr
                            v-model="editItem.customEndTime"
                            :config="configTime"
                            class="form-control"
                            placeholder="Select end time"
                            name="customEndTime">
                    </flat-pickr>
                </b-form-group>

            <b-button @click="isDateCalendar=!isDateCalendar" v-b-toggle.calendarCollapse class="mb-3"> {{ calendarButton }}</b-button>
            <b-form-group class="" id="calendarCollapse">
                <label for="customStartDate">Start Date</label>
                <flat-pickr
                        v-model="customStartDate"
                        :config="configDate"
                        class="form-control"
                        placeholder="Select start date"
                        name="customStartDate">
                </flat-pickr>


                <label for="customEndDate">End Date</label>
                <flat-pickr
                        v-model="editItem.customEndDate"
                        :config="configDate"
                        class="form-control"
                        placeholder="Select end date"
                        name="customEndDate">
                </flat-pickr>

                <pre>Selected date is - {{ customStartDate }}</pre>
            </b-form-group>

        </div>
    <div v-else>
            <h1>Custom Date/Time</h1>
            <h2>{{ customStartDate }}</h2>
            <h2>{{ customStartTime }}</h2>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
        customStartDate: function() {
            return this.StartDate
        }
        ,
        customStartTime: function() {
           return this.StartTime
        },
        calendarButton(){
            if (this.isDateCalendar) {
                return 'Collapse Calendar'
            }
            return 'Add Dates from Calendar'
        },

    },
    data: function () {
        return {
            StartDate: new (Date),
            StartTime: new (Date),
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
            monthOptions: [
                { value: null, text: 'Select a Month' },
                { value: '01', text: 'January' },
                { value: '02', text: 'February' },
                { value: '03', text: 'March' },
                { value: '04', text: 'April' },
                { value: '05', text: 'May' },
                { value: '06', text: 'June' },
                { value: '07', text: 'July' },
                { value: '08', text: 'August' },
                { value: '09', text: 'September' },
                { value: '10', text: 'October' },
                { value: '11', text: 'November' },
                { value: '12', text: 'December' },
            ],

        }

    }
}
</script>