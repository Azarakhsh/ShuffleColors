/*!
 *  Shuffle colors Plugin for JQuery
 *  Version   : 0.1
 *  Date      : 2015-14-06
 *  Licence   : All rights reserved 
 *  Author    : owwwlab (Ehsan Dalvand , Alireza Jahandideh & Azarakhsh Shali)
 *  Contact   : owwwlab@gmail.com
 *  Web site  : http://themeforest.net/user/owwwlab
 */

// Utility
if ( typeof Object.create !== 'function'  ){ // browser dose not support Object.create
    Object.create = function (obj){
        function F(){};
        F.prototype = obj;
        return new F();
    };
};

(function($, window, document, undefined) {

	var ShuffleColors = {
		init: function( elem ){
            var self = this; //store a reference to this
            self.elem = elem;
            self.$elem = $(elem);

            //Check the mode of plugin
		    self.elemText = self.$elem.val();
            //self.tag = self.$elem.prop('tagName');
            self.baseColor = $('input#rgb-base').val();
            self.prepare();
 		},

 		prepare: function(){
            self=this;
            //self.words=self.elemText.split(' '); //splits the phrase into words
            self.createSpectrums();

        },

        createSpectrums: function(){
            self=this;
            self.words = self.elemText.split(' ');
            self.rgbBase = self.baseColor.split(',')

            var plusminus,
                spectrum=[],
                initialrgb=[],
                factor,
                initialFactor = 10;

                initialrgb=self.rgbBase;
                
            for (var i = 0; i < self.words.length; i++) {
                spectrum[i] = [];
                factor = initialFactor;
                x = Math.random()
                if (0.5>x){ 
                    factor = -initialFactor;
                }
                plusminus = (Math.floor( Math.random() * self.words.length )+1)*factor;


                for (var j = 0; j < self.rgbBase.length; j++) {
                    if ( (+initialrgb[j] + plusminus)>= 255 || (+initialrgb[j] + plusminus)<= 0 ) {
                    
                        j=Math.min(j-1,0);//?
                        factor = -factor;
                        plusminus = (Math.floor( Math.random() * self.words.length )+1)*factor;
                    }else{
                        self.rgbBase[j] = +initialrgb[j] + plusminus;
                        spectrum[i][j] = self.rgbBase[j];
                    }

                };
            };
            self.generateResult(spectrum);

        },
        generateResult: function(spectrum){
            self=this;
            //using conditional functions is requiered
            var result='<span class="simple-shuffle" data-rgb="'; //Adding classes is also requiered
                    result= result+ spectrum.join(' ');
                result=result+'">'+ self.elemText +'</span>';
            

            var resultArea = $('.result-area');
            if(resultArea.find('.shuffled').length){
                $('.shuffled').replaceWith(result);
            }else{
                resultArea.append($(result));
            }
            
            self.generatemarkup(self.words, spectrum)        

            $('.simple-shuffle').SimpleShuffle();

        },

        generatemarkup: function(elemWords, spectrum){
            var colorPallet,
                colorPicker = $('.color-picker');
                colorPickerArea = $('.color-picker .container');
                colorPallet = '<div class="container">';
            for (var i = 0; i < elemWords.length; i++) {
                colorPallet = colorPallet +'<div style= color:rgb('+spectrum[i]+')>'+elemWords[i]+' <input type="text" size="6" data-index='+i+' class="rgb picker" value="'+spectrum[i]+'">';
            };
                colorPallet =colorPallet + "</div>";
            if(colorPickerArea.find('div').length){
                colorPickerArea.replaceWith(colorPallet);
            }else{
                colorPicker.append($(colorPallet));
            }

            $('.picker').colpick({
                submit:0,
                colorScheme:'dark',
                onChange:function(hsb,hex,rgb,el,bySetColor) {
                    // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
                    var value = (rgb.r+','+rgb.g+','+rgb.b)
                        index = $(el).data().index;
                    if(!bySetColor){
                        $(el).val(value);
                        if(index != undefined){
                            spectrum[index] = value;
                            self.generateResult(spectrum);
                        }  
                    }
                }
            });

            self.bindUI(spectrum);
        },

          bindUI: function(spectrum){
            $('.color-picker input.rgb').change(function(){
                var $this = $(this),
                index = $this.data().index,
                value = $this.val().split(',');
                spectrum[index] = value;
                for (var i = 0; i < value.length; i++) {
                    spectrum[index][i] = parseInt(value[i]);
                };
            self.generateResult(spectrum);   
            });
        }

	}

	$.fn.ShuffleIt = function() {
        return this.each(function(){
            ShuffleColors.init(this);
        }); 
    };

 $('.shuffle-colors').change(function(){
    $('shuffle-title button#set').text('Re Shuffle!');
 });

 $('.shuffle-title button#set').click(function() {
    $(this).text('Re Shuffle!');
    $('.shuffle-colors').ShuffleIt();
 });

 /************************************************************************************************/
    var AssigneColors = {
        init: function( elem ){
            
            var self = this; //store a reference to this

            self.elem = elem;
            self.$elem = $(elem);
            self.elemText = self.$elem.context.innerText;
            self.tag = self.$elem.prop('tagName');
            self.baseColor = self.$elem.data();
            self.prepare();
        },

        prepare: function(){
            var self = this;
            self.words=self.elemText.split(' '); //splits the phrase into words
            self.spectrums = self.baseColor.rgb.split(' '); 
            self.generateMarkup();
        },

        generateMarkup: function(){
            var self = this,
                result='<'+self.tag+' class="shuffled">';
            for (var i = 0; i < self.words.length; i++) {
                 result=result+'<span style= color:rgb('+self.spectrums[i]+')>'+self.words[i]+' </span>';
             }; 
                result = result + '</'+self.tag+'>';
                self.$elem.replaceWith(result);
        }

    };

    $.fn.SimpleShuffle = function( options ) {
        return this.each(function(){
            AssigneColors.init( this );
        }); 
    };

 $('.simple-shuffle').SimpleShuffle();

 $('.shuffle-title input#color-pallet').change(function() {
    var pickerArea = $('.color-picker'),
        rgbInput = $('#rgb-base'),
        SetButton = $('button#set'),
        textInput = $('.shuffle-colors');
    if(this.checked){
        pickerArea.css('display' , 'block');
        rgbInput.prop('disabled', true);
        textInput.prop('disabled', true);
        SetButton.attr('disabled', true);

    }else{
        pickerArea.css('display' , 'none');
        rgbInput.prop('disabled', false);
        SetButton.attr('disabled', false);
        textInput.prop('disabled', false);
        SetButton.text('Shuffle!');
    }
 });




$('.shuffle-colors').ShuffleIt();
})(jQuery, window, document);