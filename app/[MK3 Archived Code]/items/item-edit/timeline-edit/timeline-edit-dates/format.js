Mediakron.Timeline = {};

Mediakron.Timeline.selectWidget =  Mediakron.Extensions.View.extend({
    template: JST['settings.timeline.select.widget'],
    date: {},
    type: false,
    value: false,
    parent: false,
    initialize: function(data){
        this.timeline = Mediakron.Status.CurrentTimeline;
        this.parent = data.parent;
        this.$parent = data.$parent;
        this.date = data.date;
        if(data.map){
          this.timeline = false;
        }
        return this;
    },
    render: function(){
        var type, view = this;
        if(this.timeline){
          type = this.timeline.get('timeline').type;
        }else{
          type = 'traditional';
        }
        this.$el.html(this.template({type:type}));
        this.$parent.append(this.$el);
        if(this.date){
            _.each(this.date,function(data,key){
                if(key.length > 0 && data.length > 0){
                    $("[date='"+key+"']",view.$el).val(data);
                    $('.'+key,view.$el).removeClass('hide');
                    $('.'+key+'-button',view.$el).addClass('active').removeClass('hide');
                }  
            });
        }
        return this;
    },
    getDate: function(){
        var date = {};
        if($(".year input",this.$el).val().length > 0)      date.year   =  $(".year input",this.$el).val();
        if($("[date='month']",this.$el).val().length > 0)   date.month  =  $("[date='month']",this.$el).val();
        if($(".day input",this.$el).val().length > 0)       date.day    =  $(".day input",this.$el).val();
        if($(".hour input",this.$el).val().length > 0)      date.hour   =  $(".hour input",this.$el).val();
        if($(".minute input",this.$el).val().length > 0)    date.minute =  $(".minute input",this.$el).val();
        if($(".second input",this.$el).val().length > 0)    date.second =  $(".second input",this.$el).val();
        if(_.size(date) > 0) return date;
        return [];
    },
    validate:function(check){
        
        var date = this.getDate();

        if(check == 'start'){
            if(_.isEmpty(date)){ 
                $('input',this.$el).css({"border":"1px solid red"});
                Mediakron.message({text:"You must provide a start date, at least", type:'warning','timeout':3000,'dismiss':true, layout: 'center'}); 
                return false;
            }
            if(date.year){
                if(date.year.length > 0){
                    if(isNaN(date.year)){
                        $('input',this.$el).css({"border":"1px solid red"});
                        Mediakron.message({text:"The year must be a number.  It can be negitive or positive, but it must be a number.", type:'warning','timeout':3000,'dismiss':true, layout: 'center'}); 
                        return false;
                    } 
                }
            }
            
        }else if(check == 'end'){
            if(date.year){
                if(date.year.length > 0){
                    if(isNaN(date.year)){
                        $('input',this.$el).css({"border":"1px solid red"});
                        Mediakron.message({text:"The year must be a number.  It can be negitive or positive, but it must be a number.", type:'warning','timeout':3000,'dismiss':true, layout: 'center'}); 
                        return false;
                    } 
                }
            }
        }
        
        return date;
    },
    events: {   
        'change .select-range':         'changeType',
        'blur  .form-control':          'changeValue',
        'blur .month-select':           'changeValue',
        'change .month-select':         'changeValue',
        'click .show-date-options':   'showOptions',
        'click .hide-date-options':   'hideOptions'
    },
    changeType:function(e){
        var val = $(e.currentTarget).val();
        $('.'+val,this.$el).toggleClass('hide').val('');
    },
    showOptions: function(){
        $(".timeline-widget-select",this.$el).removeClass('hide');
        $('.show-date-options',this.$el).addClass('hide');
    },
    hideOptions: function(){
        $(".timeline-widget-select",this.$el).addClass('hide');
        $('.show-date-options').removeClass('hide');
    }
});