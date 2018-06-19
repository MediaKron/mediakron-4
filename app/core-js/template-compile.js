_.compile = function(templ) {
    var compiled = this.template(templ);
    compiled.render = function(ctx) {
       console.log(ctx);
       return this(ctx);
    };
    return compiled;
  };