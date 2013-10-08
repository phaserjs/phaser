$(document).ready(function(){
  $('ul.group-items').each(function(i){
    var liAmount = $(this).children('li').length;
    if ((liAmount/4)>9){
      $(this).addClass('laser10');
    }else if((liAmount/4)>8){
      $(this).addClass('laser9');
    }else if((liAmount/4)>7){
      $(this).addClass('laser8');
    }else if((liAmount/4)>6){
      $(this).addClass('laser7');
    }else if((liAmount/4)>5){
      $(this).addClass('laser6');
    }else if((liAmount/4)>4){
      $(this).addClass('laser5');
    }else if((liAmount/4)>3){
      $(this).addClass('laser4');
    }else if((liAmount/4)>2){
      $(this).addClass('laser3');
    }else if((liAmount/4)>1){
      $(this).addClass('laser2');
    }
    console.log(liAmount/4);
  });
});