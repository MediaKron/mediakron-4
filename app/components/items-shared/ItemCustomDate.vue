<template>
    <div>
        <div class="item-element-source" v-if="isEditing">
            <header>Custom Date/Time</header>
            <b-form-group class="">
                <label for="customStartDate">Srart Date</label>
                <flat-pickr
                        v-model="editItem.customStartDate"
                        :config="configDate"
                        class="form-control"
                        placeholder="Select start date"
                        name="customStartDate">
                </flat-pickr>
                <label for="customStartTime">Start Time</label>
                <flat-pickr
                    v-model="editItem.customStartTime"
                    :config="configTime"
                    class="form-control"
                    placeholder="Select start time"
                    name="customStartTime">
            </flat-pickr>

                <label for="customEndDate">End Date</label>
                <flat-pickr
                        v-model="editItem.customEndDate"
                        :config="configDate"
                        class="form-control"
                        placeholder="Select end date"
                        name="customEndDate">
                </flat-pickr>
                <label for="customEndTime">End Time</label>
                <flat-pickr
                        v-model="editItem.customEndTime"
                        :config="configTime"
                        class="form-control"
                        placeholder="Select end time"
                        name="customEndTime">
                </flat-pickr>
                <pre>Selected date is - {{ customStartDate }}</pre>

            </b-form-group>
        </div>
        <div v-else>
            <h1>Custom Date/Time</h1>
            <h2>{{ customStartDate }}</h2>
            <h2>{{ customStartTime }}</h2>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

export default {
    components: {
        flatPickr
    },

    computed: {
        ...mapGetters('items', [
            'editItem',
            'isEditing',
            'first'
        ]),

    },
    data: function () {
        return {
            customStartDate: new(Date),
            customStartTime: new(Date),
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
            }
        }

    }
}
</script>