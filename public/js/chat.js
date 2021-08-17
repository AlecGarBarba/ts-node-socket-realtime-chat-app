const socket = io();

//Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.getElementById("send-location");
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

/////////////////////////////////////sockets
socket.on('welcome', (objectMessage)=>{
    console.log(objectMessage.text);
    const html = Mustache.render(messageTemplate, {message: objectMessage.text});
    $messages.insertAdjacentHTML('beforeend',html);
    
});
socket.on('message', objectMessage =>{
    console.log(objectMessage.text);
    const html = Mustache.render(messageTemplate,{message: objectMessage.text, createdAt: moment(objectMessage.createdAt).format('hh:mm:ss A')});
    $messages.insertAdjacentHTML('beforeend',html);
})

socket.on('location_message', locationObject =>{ 
    const html = Mustache.render(locationTemplate,{locationUrl: locationObject.url, createdAt: moment(locationObject.createdAt).format('hh:mm:ss A')});
    //console.log(html)
    $messages.insertAdjacentHTML('beforeend',html);
});

//////////////Listeners
$messageForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled'); //disables the form;
    const input = event.target.elements.message.value;
    socket.emit('sendMessage', input, (error)=>{
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value ='';
        $messageFormInput.focus();
        if(error){
            return console.log("something went wrong:",error);
        }

        console.log("message delivered");
    });
});

$sendLocationButton.addEventListener('click', ()=>{
    $sendLocationButton.setAttribute('disabled', 'disabled');
    if(!navigator.geolocation){
        $sendLocationButton.removeAttribute('disabled');
        return alert("Geolocation is not supported by your browser");
    }   
    navigator.geolocation.getCurrentPosition((position)=>{ 
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        socket.emit('sendLocation', {latitude, longitude}, (error)=>{
            $sendLocationButton.removeAttribute('disabled');
            if(error){
                return console.log("Error:",error)
            }
            console.log("Your location was shared successfully.")
        })
    })
});