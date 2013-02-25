(function($){
    $.fn.cloneDivFields = function(options){
        var sourceElement = $('div.'+options.sourceClass).first();
        var targetDiv     = this;
        var counter       = $('#'+options.counterID);
        var cloneTrigger  = $('#'+options.cloneTriggerID);
        var allOrNone     = options.allOrNone;
        
        function getAttrNum(str, pos){
            var arr = str.split('-');
            return arr[pos];
        }

        function getNewAttr(str, newNum){
            arr = str.split('-');
            arr[1] = newNum;
            var out = arr.join('-');
            return out;
        }

        function childRecursive(element, func){
            func(element);
            var children = element.children();
            if (children.length > 0) {
                children.each(function (){
                    childRecursive($(this), func);
                });
            }
        }

        function clearCloneValues(element){
            if (element.attr('value') !== undefined){
                element.val('');                
            }
        }

        function setCloneAttr(element, value){
            if (element.attr('id') !== undefined){
                element.attr('id',getNewAttr(element.attr('id'),value));
            } else {}
            if(element.attr('name') !== undefined){
                element.attr('name',getNewAttr(element.attr('name'),value));
            } else {}
            if (element.attr('for') !== undefined){
                element.attr('for',getNewAttr(element.attr('for'),value));
            } else {}
        }

        function clearStars(element){
            if (element.attr('for') !== undefined){
                element.find('span').html('');
            }
        }
        
        function clearReq(element){
            element.removeAttr('required');
        }

        function markAllRequired(elem){
            var labels = elem.parent().parent().parent().find('label');
            var outerParentDiv = elem.parent().parent().parent();
            var flds = outerParentDiv.find('input, select, textarea');
            var name = elem.attr('name');
            var anyHasVal = false;
            for (var i = flds.length - 1; i >= 0; i--) {
                if ($(flds[i]).val() !== ''){
                    anyHasVal = true;
                }
            };
            if (anyHasVal){
                labels.each(function(){
                    $(this).find('span').html('* ');
                    for (var i = flds.length - 1; i >= 0; i--) {
                    //    $(flds[i]).attr('required','required');
                    };
                });
            } else {
                labels.each(function(){
                    $(this).find('span').html('');
                    for (var i = flds.length - 1; i >= 0; i--) {
                    //   $(flds[i]).removeAttr('required');
                    };
                });
            }    
        }

        cloneTrigger.click(function(){
            counter.val(Number(counter.val()) + 1);
            var newClonable = sourceElement.clone();
            childRecursive(newClonable, 
                function(e){
                    setCloneAttr(e, counter.val());});
            childRecursive(
                newClonable, 
                function(e){
                    clearCloneValues(e);
                }
            );
            if (allOrNone){
                childRecursive(newClonable,
                    function(e){
                        clearStars(e);
                        clearReq(e);
                    }
                );
            }
            newClonable.appendTo(targetDiv);
            
            if (allOrNone){
                var last = targetDiv.find('div.'+options.sourceClass).last();
                last.find('input').keyup(function(){
                    markAllRequired($(this));
                });
                last.find('textarea').keyup(function(){
                    markAllRequired($(this));
                });
            }
        });

        if (allOrNone){
            targetDiv.find('div.'+options.sourceClass+' input').keyup(function(){
                markAllRequired($(this));
            });
            targetDiv.find('div.'+options.sourceClass+' textarea').keyup(function(){
                markAllRequired($(this));
            });
        }


    }
})(jQuery);
