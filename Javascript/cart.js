//item object constructor
function Item(Name,Price,Description,ItemAmmount,img){
    this.name=Name;
    this.Price=Price;
    this.Description=Description;
    this.ItemAmmount=ItemAmmount;
    this.img=img;
}
//on load jquery
$(document).ready(function(){

    
    
    if (sessionStorage.getItem("hasCodeRunBefore") === null) {
       
        sessionStorage.setItem("hasCodeRunBefore", true);
        let cart=[];
        sessionStorage.setItem("cart", JSON.stringify(cart));
    }else{
       update();
    }

    //generate("Running shoes","R800","Blue-exersice-Shoes","../images/shoes.jpg");
    
    
});

//this jquery handles the animation of  item moving into cart
$('.btn.btn-info.add').on('click', function () {
    var cart = $('.fa.fa-shopping-cart');
    var imgtodrag = $(this).parent('.card-text').parent('.card-body').parent('.col-md-8-auto').parent('.row.no-gutters.justify-content-center.auto').children('.col-md-4-auto').children('.zoom').find("img").eq(0);
    if (imgtodrag) {
        var imgclone = imgtodrag.clone()
            .offset({
            top: imgtodrag.offset().top,
            left: imgtodrag.offset().left
        })
            .css({
            'opacity': '0.5',
                'position': 'absolute',
                'height': '150px',
                'width': '150px',
                'z-index': '100'
        })
            .appendTo($('body'))
            .animate({
            'top': cart.offset().top + 10,
                'left': cart.offset().left + 10,
                'width': 75,
                'height': 75
        }, 1000, 'easeInOutExpo');
        
        setTimeout(function () {
            cart.effect("shake", {
                times: 2
            }, 200);
        }, 1500);

        imgclone.animate({
            'width': 0,
                'height': 0
        }, function () {
            $(this).detach()
        });
    }
});
//this function handles adding items to the cart
function Add(Name,Price,Description,Ammount,img){
    //get the src from img object
    img=img.src;
    //if the add icon is used then set the Amount to 1
    if(Ammount==0){
        Ammount=1;
    }
    //get the current session cart
    let cart = JSON.parse(sessionStorage.getItem("cart"));
    //if the item does not exsist in cart
    if (cart==""){
        cart =[];
        //construct item object
        let item =new Item(Name,Price,Description,Ammount,img);
        //add to cart array
        cart.push(item);
        //update the cart in sesssionStorage
        sessionStorage.setItem("cart", JSON.stringify(cart));
        //console.log(JSON.parse(sessionStorage.getItem("cart")));
        //update cart icon
        update();
        alert("Item added to cart");
    }else{//if the cart has items already
        //get the item object from cart array by filtering using the name
        let newArray = cart.filter(function(v){
            return v.name==Name;
        });
        
        let total=0;
        //if this item does not exist in cart
        if (newArray.length==0){
            
           total=parseInt(Ammount);
        }else{
            //increase the amount of the item
           total=newArray[0].ItemAmmount+parseInt(Ammount);
        }
        //construct the updated item object
        let item =new Item(Name,Price,Description,total,img);
        //remove the old item object from cart
        newArray = cart.filter(function(v){
            return v.name!==Name;
        });
        //add the new item object
        newArray.push(item);
        //update the session storage
        sessionStorage.setItem("cart", JSON.stringify(newArray));
        console.log(JSON.parse(sessionStorage.getItem("cart")));
        
        alert("Item added to cart");
        update();
        //addToCart(newArray);
    }
    
    
}
//updates how may items are in the cart by getting the array length
function update(){
    let cart = JSON.parse(sessionStorage.getItem("cart"));
    let cartNum=cart.length;
    let cartNav=document.getElementById("cartNav");
    cartNav.innerHTML=`<i class="fa fa-shopping-cart" aria-hidden="true"></i> (${cartNum})`;
}
//this function handles increasing the item counter
function Increase(id){
    let input = document.getElementById(id);
    let number=parseInt(input.value)+1;
    input.value=number;
    
}
//this function decreases the item counter
function Decrease(id){
    let input = document.getElementById(id);
    
    if(input.value=="0"){
        input.value=0;
    }else{
        let number=parseInt(input.value)-1;
        input.value=number;
    }
}
