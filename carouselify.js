(function($){
  $.fn.carouselify = function(options){
    var Carouselify = function(element, options){
      this.addLeftLink = function(){
        return $('<span class="icon arrow-left notext navigation-link left disabled">Left</a>').appendTo(element);
      }

      this.addRightLink = function(){
        return $('<span class="icon arrow-right notext navigation-link right disabled">Right</a>').appendTo(element);
      }

      var element       = $(element),
          itemWrapper   = $('>ul', element),
          items         = $('>*', itemWrapper),
          obj           = this,
          active        = 1,
          thumbnails,
          leftLink,
          rightLink,
          slideTimer,
          resizeTimer;

      var options = $.extend({
        speed: 500,
        thumbnails: false,
        initVisible: 1,
        navigationArrows: true,
        autoRotate: false,
        rotationSpeed: 5000,
        infiniteScroll: false,
        stopOnHover: false
      }, options || {});

      var isFirstSlide = function(){
        return active <= 1;
      }

      var isLastSlide = function(){
        return active >= items.length;
      }

      this.advanceLeft = function(){
        if(options.infiniteScroll){
          if(isFirstSlide()){
            obj.advanceTo(active = items.length);
          } else {
            obj.advanceTo(--active);
          }
        } else {
          obj.advanceTo('left');
        }
      }

      this.advanceRight = function(){
        if(options.infiniteScroll){
          if(isLastSlide()){
            obj.advanceTo(active = 1);
          } else {
            obj.advanceTo(++active);
          }
        } else {
          obj.advanceTo('right');
        }
      }

      this.advanceTo = function(index){
        switch (index){
          case 'left':
            itemWrapper.stop().animate({scrollLeft: itemWrapper.scrollLeft() - items.first().outerWidth() }, options.speed, function(){
              obj.setArrowVisibility();
            });
            break;
          case 'right':
            itemWrapper.stop().animate({scrollLeft: itemWrapper.scrollLeft() + items.first().outerWidth() }, options.speed, function(){
              obj.setArrowVisibility();
            });
            break;
          default:
            itemWrapper.stop().animate({scrollLeft: items.first().outerWidth() * (index - 1) }, options.speed);
        }
        obj.setActive(active = index);
      }

      this.setActive = function(number){
        if(options.thumbnails){
          thumbnails.each(function(index){
            index == number - 1 ? $(this).addClass('active') : $(this).removeClass('active');
          });
        }
      }

      this.addThumbnails = function(){
        var thumbs = ['<ul class="thumbnails">'];
        items.each(function(index){
          thumbs.push('<li><img src="' + $('.thumbnail', $(this)).attr('src') + '"/></li>');
        });

        thumbs.push('</ul>');

        $(options.thumbnails, element).append(thumbs.join('')).children();

        thumbs = $('.thumbnails li', element);

        return thumbs;
      }

      this.startRotation = function(){
        slideTimer = setInterval(function () {
          obj.advanceRight();
        }, options.rotationSpeed);
      }

      this.stopRotation = function(){
        clearInterval(slideTimer);
      }

      this.setArrowVisibility = function(){
        if( (itemWrapper.scrollLeft() < 5) && (!options.infiniteScroll) ){
          leftLink.addClass('disabled'); 
        } else {
          leftLink.removeClass('disabled');
        }

        if( ((itemWrapper.scrollLeft() + itemWrapper.outerWidth() >= items.first().outerWidth() * items.length) || (itemWrapper.outerWidth() > items.first().outerWidth() * items.length)) && (!options.infiniteScroll) ){
          rightLink.addClass('disabled'); 
        } else {
          rightLink.removeClass('disabled');
        }        
        
      };

      var init = function(){
        if(options.thumbnails){
          thumbnails = obj.addThumbnails();
          thumbnails.click(function(e){
            e.preventDefault();
            obj.stopRotation();
            obj.advanceTo(thumbnails.index($(this)) + 1);
          });

          $(window).resize(function(){
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
              obj.advanceTo(active);
            }, 100);
          });
        }

        if(options.navigationArrows){
          leftLink  = obj.addLeftLink();
          rightLink = obj.addRightLink();
          obj.setArrowVisibility();
          leftLink.click(function(){
            obj.stopRotation();
            obj.advanceLeft();
          });

          rightLink.click(function(){
            obj.stopRotation();
            obj.advanceRight();
          });
        }

        obj.advanceTo(options.initVisible);

        if(options.autoRotate){
          obj.startRotation();
        }

        if(options.stopOnHover){
          element.hover(function(){
            obj.stopRotation();
          }, function(){
            obj.startRotation();
          });
        }

      }();
    }

    return this.each(function(){
      var element = $(this);

      if(element.data('carouselify')) return ;

      var carouselify = new Carouselify(this, options);

      element.data('carouselify', carouselify);
    });
  }
})(jQuery);
