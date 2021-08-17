const socket = io();

//Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.getElementById("send-location");
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');
//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix:true});

//autoScrolling

const autoscroll = ()=>{
    //NEw message element
    const $newMessage = $messages.lastElementChild;
    //get height of new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
    //visible height
    const visibleHeight = $messages.offsetHeight;
    //height of messages container
    const containerHeight = $messages.scrollHeight;
    //How far have I scrolled
    const scrolledOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrolledOffset){
        //we were at the bottom. Do scroll down
        $messages.scrollTop = $messages.scrollHeight;
    }

}



/////////////////////////////////////sockets
socket.on('welcome', (objectMessage)=>{
    console.log(objectMessage.text);
    const html = Mustache.render(messageTemplate, {username: objectMessage.username , createdAt: moment(objectMessage.createdAt).format('hh:mm:ss A'), message: objectMessage.text});
    $messages.insertAdjacentHTML('beforeend',html);
    
});
socket.on('message', objectMessage =>{
    console.log(objectMessage.text);
    const html = Mustache.render(messageTemplate,{
        username: objectMessage.username ,message: objectMessage.text, createdAt: moment(objectMessage.createdAt).format('hh:mm:ss A')});
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
})

socket.on('location_message', locationObject =>{ 
    const html = Mustache.render(locationTemplate,
        {username:locationObject.username,  locationUrl: locationObject.url, createdAt: moment(locationObject.createdAt).format('hh:mm:ss A')});
    $messages.insertAdjacentHTML('beforeend',html);

    autoscroll();
});

socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room: room,
        users: users
    });  
    document.querySelector('#sidebar').innerHTML = html;
})
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


socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error);
        location.href = '/'
    }
});