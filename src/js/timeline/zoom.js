// Create all of the zoom levels
Mediakron.Timeline.zoom = {};
Mediakron.Timeline.zoom.Levels = [
  
        { 'inc': 1,         'number': 1,          level:0,        scope:'second', tics:1  },
        { 'inc': 2,         'number': 2,          level:1,        scope:'second', tics:2  },
        { 'inc': 5,         'number': 5,          level:2,        scope:'second', tics:3  },
        { 'inc': 10,        'number': 10,         level:3,        scope:'second', tics:5  },
        { 'inc': 20,        'number': 20,         level:4,        scope:'second', tics:8  },
        { 'inc': 30,        'number': 30,         level:5,        scope:'second', tics:10  },

        { 'inc': 60,        'number': 1,          level:6,        scope:'minute', tics:5   },
        { 'inc': 120,       'number': 2,          level:7,        scope:'minute', tics:5   },
        { 'inc': 180,       'number': 3,          level:8,        scope:'minute', tics:5   },
        { 'inc': 240,       'number': 4,          level:9,        scope:'minute', tics:5   },
        { 'inc': 300,       'number': 5,          level:10 ,      scope:'minute', tics:5   },
        { 'inc': 600,       'number': 10,         level:11,       scope:'minute', tics:5  },
        { 'inc': 900,       'number': 15,         level:12,       scope:'minute', tics:5  },
        { 'inc': 1200,      'number': 20,         level:13,       scope:'minute', tics:5  },
        { 'inc': 1800,      'number': 30,         level:14,       scope:'minute', tics:5  },

        { 'inc': 3200,      'number': 1,          level:15,       scope:'hour', tics:5   },
        { 'inc': 6400,      'number': 2,          level:16,       scope:'hour', tics:5   },
        { 'inc': 18000,     'number': 5,          level:17,       scope:'hour', tics:5   },
        { 'inc': 36000,     'number': 10,         level:18,       scope:'hour', tics:5   },
        { 'inc': 43200,     'number': 12,         level:19,       scope:'hour', tics:5   },
        { 'inc': 64800,     'number': 18,         level:20,       scope:'hour', tics:9   },

        { 'inc': 86400,     'number': 1,          level:21,       scope:'day', tics:5   },
        { 'inc': 172800,    'number': 2,          level:0,        scope:'day', tics:8   },
        { 'inc': 259200,    'number': 3,          level:0,        scope:'day', tics:6   },
        { 'inc': 432000,    'number': 5,          level:0,        scope:'day', tics:10   },
        { 'inc': 604800,    'number': 7,          level:0,        scope:'day', tics:14   },
        { 'inc': 864000,    'number': 10,         level:0,        scope:'day', tics:10   },
        { 'inc': 1209600,   'number': 14,         level:0,        scope:'day', tics:14   },
        { 'inc': 1814400,   'number': 21,         level:0,        scope:'day', tics:7   },

        { 'inc': 2592000,    'number': 1,   level:0,        scope:'month', tics:15   },
        { 'inc': 5184000,    'number': 2,   level:0,        scope:'month', tics:10   },
        { 'inc': 7776000,    'number': 3,   level:0,        scope:'month', tics:6   },
        { 'inc': 12960000,   'number': 5,   level:0,        scope:'month', tics:10   },
        { 'inc': 15552000,   'number': 6,   level:0,        scope:'month', tics:6   },
        { 'inc': 20736000,    'number': 8,  level:0,        scope:'month', tics:8   },
        { 'inc': 25920000,    'number': 10, level:0,        scope:'month', tics:10   },

        { 'inc': 31557600,     'number': 1,     level:0,    scope:'month', tics:6    },
        { 'inc': 63115200,     'number': 2,     level:0,    scope:'month', tics:12    },
        { 'inc': 157788000,    'number': 5,     level:0,    scope:'year', tics:5    },
        { 'inc': 473364000,    'number': 10,     level:0,   scope:'year', tics:10    },
        { 'inc': 631152000,    'number': 20,     level:0,   scope:'year', tics:5    },
        { 'inc': 1577880000,   'number': 50,     level:0,   scope:'year', tics:10    },
        { 'inc': 2366820000,   'number': 75,     level:0,   scope:'year', tics:15    },
        { 'inc': 3155760000,   'number': 100,     level:0,  scope:'year', tics:15    },
        { 'inc': 4733640000,   'number': 150,     level:0,  scope:'year', tics:15    },
        { 'inc': 7889400000,   'number': 250,     level:0,  scope:'year', tics:15    },
        { 'inc': 9467280000,   'number': 300,     level:0,  scope:'year', tics:15     },
        { 'inc': 15778800000,  'number': 500,     level:0,  scope:'year', tics:10     },
        { 'inc': 23668200000,  'number': 750,     level:0,  scope:'year', tics:10    },
        { 'inc': 28401840000,  'number': 900,     level:0,  scope:'year', tics:9    },

        { 'inc': 31557600000,     'number': 1,      level:0,    scope:'millenium', tics:10      },
        { 'inc': 63115200000,     'number': 2,      level:0,    scope:'millenium', tics:10      },
        { 'inc': 157788000000,    'number': 5,      level:0,    scope:'millenium', tics:20      },
        { 'inc': 315576000000,    'number': 7,      level:0,    scope:'millenium', tics:10      },
        { 'inc': 473364000000,    'number': 10,     level:0,    scope:'millenium', tics:6     },
        { 'inc': 631152000000,    'number': 20,     level:0,    scope:'millenium', tics:6     },
        { 'inc': 1577880000000,   'number': 50,     level:0,    scope:'millenium', tics:6     },
        { 'inc': 3155760000000,   'number': 100,     level:0,   scope:'millenium', tics:6    },
        { 'inc': 15778800000000,  'number': 500,     level:0,   scope:'millenium', tics:6   },

        { 'inc': 31557600000000,     'number': 1, level:0,      scope:'million', tics:6      },
        { 'inc': 63115200000000,     'number': 2, level:0,      scope:'million', tics:6      },
        { 'inc': 157788000000000,    'number': 5, level:0,      scope:'million', tics:6      },
        { 'inc': 315576000000000,    'number': 7, level:0,      scope:'million', tics:4      },
        { 'inc': 473364000000000,    'number': 10, level:0,     scope:'million', tics:5     },
        { 'inc': 631152000000000,    'number': 20, level:0,     scope:'million', tics:10     },
        { 'inc': 1577880000000000,   'number': 50, level:0,     scope:'million', tics:5     },
        { 'inc': 3155760000000000,   'number': 100, level:0,    scope:'million', tics:8    },
        { 'inc': 15778800000000000,  'number': 500, level:0,    scope:'million', tics:10    },

        { 'inc': 31557600000000000,    'number': 1, level:0,    scope:'billion', tics:15    },
        { 'inc': 63115200000000000,    'number': 2, level:0,    scope:'billion', tics:4    },
        { 'inc': 94672800000000000,    'number': 3, level:0,    scope:'billion', tics:6    },
        { 'inc': 157788000000000000,   'number': 5, level:0,    scope:'billion', tics:10    },
        { 'inc': 315576000000000000,   'number': 10, level:0,   scope:'billion', tics:5   },
        { 'inc': 473364000000000000,   'number': 15, level:0,   scope:'billion', tics:7   }
    ];


Mediakron.Timeline.zoom.Months = {
    0:{
        'label':'January',
        'number':1,
        'days': 31,
        'seconds':2678400
    },
    1:{
        'label':'Febuary',
        'number':2,
        'days': 28,
        'seconds':2419200
    },
    2:{
        'label':'March',
        'number':3,
        'days': 31,
        'seconds':2678400
    },
    3:{
        'label':'April',
        'number':4,
        'days': 30,
        'seconds':2592000
    },
    4:{
        'label':'May',
        'number':1,
        'days': 31,
        'seconds':2678400
    },
    5:{
        'label':'June',
        'number':6,
        'days': 30,
        'seconds':2592000
    },
    6:{
        'label':'July',
        'number':7,
        'days': 31,
        'seconds':2678400
    },
    7:{
        'label':'August',
        'number':8,
        'days': 31,
        'seconds':2678400
    },
    8:{
        'label':'Septemeber',
        'number':9,
        'days': 31,
        'seconds':2678400
    },
    9:{
        'label':'October',
        'number':10,
        'days': 31,
        'seconds':2678400
    },
    10:{
        'label':'November',
        'number':11,
        'days': 30,
        'seconds':2592000
    },
    11:{
        'label':'December',
        'number':12,
        'days': 31,
        'seconds':2678400
    }
};


Mediakron.Timeline.zoom.Conversions = { // these are not going to be used for actual placement, just for setting the rough stage
    second: {
        previous: false,
        next: 'minute',
        minute: 60,
        label:'Seconds'
    },
    minute: {
        previous: 'second',
        next: 'hour',
        second: 60,
        hour: 60,
        label:'Minutes'
    },
    hour: {
        previous: 'minute',
        minute: 60,
        next: 'day',
        day: 24,
        label:'Hours'
    },
    day: {
        previous: 'hour',
        hour: 24,
        next: 'month',
        month: 30,
        label:'Days'
    },
    month: {
        previous: 'day',
        day: 30,
        next: 'year',
        year: 30,
        label:'Months'
    },
    year: {
        previous: 'month',
        month: 12,
        next: 'millenium',
        millenium: 1000,
        label:'Years'
    },
    millenium: {
        previous: 'year',
        year: 1000,
        next: 'million',
        million: 1000,
        label:'Thousands of Years'
    },
    million: {
        previous: 'millenium',
        millenium: 1000,
        next: 'month',
        billion: 1000,
        label:'Millions of Years'
    },
    billion: {
        previous: 'million',
        million: 1000,
        next: false,
        label:'Billions of Years'
    }
};

Mediakron.Timeline.findMonth = [
{
    label: "Dec.",
    days: "31"
}, {
    label: "Jan.",
    days: "31"
}, {
    label: "Feb.",
    days: "28"
}, {
    label: "March",
    days: "31"
}, {
    label: "April",
    days: "30"
}, {
    label: "May",
    days: "31"
}, {
    label: "June",
    days: "30"
}, {
    label: "July",
    days: "31"
}, {
    label: "August",
    days: "31"
}, {
    label: "Sept.",
    days: "30"
}, {
    label: "Oct.",
    days: "31"
}, {
    label: "Nov.",
    days: "30"
}, {
    label: "Dec.",
    days: "31"
}];