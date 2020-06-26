//on load jquery
$(document).ready(function(){

    
    
    if (sessionStorage.getItem("hasCodeRunBefore") === null) {
       
        sessionStorage.setItem("hasCodeRunBefore", true);
        let cart=[];
        sessionStorage.setItem("cart", JSON.stringify(cart));
        
    }else{
       update();
       let array =JSON.parse(sessionStorage.getItem("cart"));
      
       addToCart(array);
       Shipping("Collection");
       TotalNVAT();
      
       
    }
   
    
    
});
//jquery that handles the drop down menu for couriers and checkbox state
$('input[id="Collection"]'). click(function(){
    $(this).prop("checked",true);
    $("#Courier").prop('checked',false);
    $('#accordion > li > div').next().slideToggle(300);
    Shipping("Collection");
    clickedCourier();
});
$('input[id="Courier"]'). click(function(){
    $(this).prop("checked",true);
    $("#Collection").prop('checked',false);
    if(false == $('#accordion > li > div').next().is(':visible')) {
        $('#accordion ul').slideUp(300);
    }
    $('#accordion > li > div').next().slideToggle(300);
    Shipping("Courier");
    clickedCourier();
});

       




//updates the cart icon
function update(){
    let cart = JSON.parse(sessionStorage.getItem("cart"));
    let cartNum=cart.length;
    let cartNav=document.getElementById("cartNav");
    cartNav.innerHTML=`<i class="fa fa-shopping-cart" aria-hidden="true"></i> (${cartNum})`;
}
//this function adds the cart items to the cart page
function generate(Name,Price,Description,Img,amount){
    let div = document.getElementById("cart");
      

    const item =
    `
        <div class="row edit" id =${Name.trim()}>
                    <div class="card edit">
                      <h5 class="card-header">${Name}</h5>
                      <div class="card-body">
                        <h5 class="card-title">R${Price}</h5>
                        <div class="row">
                          <div class="col">
                            <img src="${Img}" class="img-thumbnail"  alt="Backpack" id="back-pack-img">
                          </div>
                          <div class="col">
                            <div class="row">
                                <p class="card-text" style="float:left;">${Description}</p>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <label for="${Name}_label">Amount:</label>
                                    <input type="text" id="${Name}_label" style="width: 10%;" value=${amount}>
                                </div>
                                <div class="col">
                                    <button  class="btn btn-danger edit" onclick="removeItem('${Name.trim()}')">Remove</button>
                                </div>
                         
                            </div>
                            
                          </div>  
                        </div>
                       
                      </div>
                    </div>
                  </div> 
    `
    div.innerHTML+=item;
}
//looping adding the cart items to page/table by loop through each object 
function addToCart(cartArray){
    cartArray.forEach(function(item){
        generate(item.name,item.Price,item.Description,item.img,item.ItemAmmount);
        table(item.name,item.ItemAmmount,item.Price);

    });
}
//adds items to the table
function table(Name,Quantity,UnitP){
    let maindiv=document.getElementById("tableBody");
    
    let id=Name.trim()+"_table";
   
    let total=parseInt(Quantity)*parseInt(UnitP);
    
    const tabled=
    `<tr id=${id}>
        <td>${Name}</td>
        <td>x${Quantity}</td>
        <td>R${UnitP}</td>
        <td>R${total}</td>
        
    </tr>
    `
    maindiv.innerHTML+=tabled;

}

//removes items from the table
function removeItem(Name){
    let child =document.getElementById(Name);
    child.remove();
    let cart = JSON.parse(sessionStorage.getItem("cart"));
    let newArray = cart.filter(function(v){
        return v.name!==Name;
    });
    sessionStorage.setItem("cart", JSON.stringify(newArray));
    update();
    let tr = document.getElementById(`${Name.trim()}_table`);
    tr.remove();
    TotalNVAT();
    Discount();


}
//function for calculating the total cost without discount and updates table
function TotalNVAT(){
    let cart =JSON.parse(sessionStorage.getItem("cart"));
    if(cart.length!==0){
        let total=0;
        cart.forEach(function(item){
            total +=parseFloat(item.Price)*parseFloat(item.ItemAmmount);
            

        });

        let VAT=0.15*total;
        
        total=total+VAT;
        const innerTotal=`
        <tr>
            <th scope='col'></th>
            <th scope='col'>VAT 15%</th>
            <th scope='col'>Total =</th>
            <th scope='col' name ='${total}' id='itemsTotal'>R${total}</th>
        </tr>
        `
        let div =document.getElementById("total");
        div.innerHTML=innerTotal;

        let shipping=document.getElementById('shippingCost').innerHTML;
        let newString=shipping.replace('R','');
        
        GrandTotal(total,newString)
    }
}
//calculates the total cost with discount and updates table
function Discount(){
    let code =document.getElementById('promoCode').value;
    let cart =JSON.parse(sessionStorage.getItem("cart"));
    if (code!==""&&cart.length!==0){
        let code1 =["DLR45",0.5];
        let code2 =["HAPPY",0.2];
        
        let message=document.getElementById("message");
        
        if(code==code1[0]||code==code2[0]){
            message.innerHTML="Succesfully added discount";
            message.style="visibility: visible;color:green";
            let total=0;
            
            cart.forEach(function(item){
            total +=parseFloat(item.Price)*parseFloat(item.ItemAmmount);
                
    
            });
            let VAT=0.15*total;
            total=total+VAT;
            let percentage=0;
            let discount=0;
            let randP=0;
            if(code==code1[0]){
                 percentage=code1[1]*100;
                 randP=total*code1[1];
                discount=total-total*code1[1];
                
            }else{
                 percentage=code2[1]*100;
                 randP=total*code2[1];
                 discount=total-total*code2[1];
            }
    
           
            const innerTotal=`
            <tr>
                <th scope='col'>Discount(${percentage}%)= -R${randP}</th>
                <th scope='col'>VAT 15%</th>
                <th scope='col'>Total =</th>
                <th scope='col' name ='${discount}'  id='itemsTotal'>R${discount}</th>
            </tr>
            `
            let div =document.getElementById("total");
            div.innerHTML=innerTotal;
            let shipping=document.getElementById('shippingCost').innerHTML;
            let newString=shipping.replace('R','');
            GrandTotal(discount,newString)
    
    
            
        }else{
            message.innerHTML="Invalid code"
            message.style="visibility: visible;color:red";
            
        }
    }else if(cart.length==0){
        let message=document.getElementById("message");
        message.style="visibility:hidden"
        clickedCourier();
        let div =document.getElementById("total");
            div.remove();
           
    }

    

}
//handles the shipping option and adds to table the cost
function Shipping(id){
    let price="0";
    if(id=="Collection"){
        price= "0";
    }else if (id=="Courier"){
        if(document.getElementById("Postnet").checked){
            price= document.getElementById("Postnet").value;
        }else if(document.getElementById("Courier_Guy").checked){
            price= document.getElementById("Courier_Guy").value;
        }else if(document.getElementById("DHL_Express").checked){
            price= document.getElementById("DHL_Express").value;
        }
    }
    let div =document.getElementById("shippingTable");
    const shipping=
    `
    <tr>
     
                <th scope='col'></th>
                <th scope='col'></th>
                <th scope='col'>Shipping Cost =</th>
                <th scope='col' id ="shippingCost" name="${price}">R${price}</th>
            
    </tr>
    `
    div.innerHTML=shipping;
    
   
    
}
//calculates the grand total and updates table
function GrandTotal(total,shipping){
    let array =JSON.parse(sessionStorage.getItem("cart"));
    if(array.length==0){
        let table = document.getElementById(`grandTable`);
        table.remove();
    }else{
    let grandTotal =parseInt(total)+parseInt(shipping);
    let div =document.getElementById("grandTable");
    const grandT=
    `
    <tr>
     
                <th scope='col'></th>
                <th scope='col'></th>
                <th scope='col'>Grand Total =</th>
                <th scope='col' id ="gtotal">R${grandTotal}</th>
            
    </tr>
    `
    div.innerHTML=grandT;
    
    }    
}
//handles updating grandtotal when a courier is clicked on
function clickedCourier(){
    let itemT= document.getElementById('itemsTotal').innerHTML;
    let newItemStrg=itemT.replace('R','')
    let shipping=document.getElementById('shippingCost').innerHTML;
    let newShippingStrg=shipping.replace('R','');
   
    GrandTotal(newItemStrg,newShippingStrg);
}
//function for confirm button.
function ConfirmOrder(){
    let array =JSON.parse(sessionStorage.getItem("cart"));
    if(array.length!==0){
        let reference=ID();
        alert(`Order Confirmed\nReference Number:${reference}`);
        let message=document.getElementById("confirmMessage");
        message.style="visibility: hidden";
    }else{
        let message=document.getElementById("confirmMessage");
        message.style="visibility: visible";
        message.innerHTML=`Your cart is empty`;
    
    }
    
}
//function for generating reference number
var ID = function () {
    
    return 'D' + Math.random().toString(36).substr(2, 9);
  };