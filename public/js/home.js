import '@babel/polyfill';
import { showAlert } from './alerts';

export class App {
    #map;
    #mapZoomLevel = 15;
    #mapMarker;
    #formPopup;
    #socket = new WebSocket('ws://127.0.0.1:3000');
    #msg ='Ex.: -I\'m going to the gym! 💪 🏋🏽 ';
    #time;
    #type;

    constructor() {
        this._getPosition();
    }

    _getPosition() {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),
                () => showAlert('error','Please provide access to your geolocation'));
    }

    _loadMap(position) {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];

        this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        this._renderMarker({ latlng: { lat: latitude, lng: longitude }} );
        // this.#map.on('dblclick', this._renderMarker.bind(this));
        this.#map.on('click', () => {
            console.log(this.#mapZoomLevel)
        });
    }

    // _renderMarker(mapE){
    //     const { lat, lng } = mapE.latlng;
    //     if (this.#mapMarker) this.#map.removeLayer(this.#mapMarker);
    //     if (this.#formPopup) this.#formPopup.remove();
    //
    //     this.#time = new Date().toLocaleString();
    //
    //     this.#mapMarker = L.marker([lat, lng], {
    //         draggable: true
    //     }).addTo(this.#map).bindPopup(L.popup({
    //         closeButton: false,
    //         closeOnClick: false,
    //         autoClose: false,
    //         content: `<form class="popup-form" autocomplete="off">
    //                     ${getHtml(msg, type, time)}
    //                     <div class="field-group">
    //                         <input class="user-input" maxlength="250" type="text" id="user-input">
    //                         <input class="submit" type="submit" value="Post">
    //                     <div>
    //                  </form>`
    //     })).openPopup()
    //
    //     this.#formPopup = document.querySelector('.popup-form');
    //     const userInput = document.querySelector('.user-input');
    //
    //     this.#formPopup.addEventListener('submit', e => {
    //             e.preventDefault();
    //             if (!userInput.value) return;
    //             this.#msg = userInput.value;
    //             this.#time = new Date().toLocaleString();
    //             this.#type = 'user';
    //             const outcomingMsg = `${msg}|${time}|${[lat, lng]}`;
    //             this.#socket.send(outcomingMsg); //отправляем сообщение
    //             this.#formPopup.querySelector('.popup-message').innerHTML = `<p class="sub-title">${msg}<br>${time}</p>`
    //             userInput.value = '';
    //     })
    // }
    //
    //
    // _receiveMsg() {
    //     this.#socket.onmessage = event => { //примнимаем сообщение
    //         const arr = JSON.parse(event.data).data;
    //         let newData = '';
    //         arr.forEach(el => newData += String.fromCharCode(el))
    //
    //         const [latitude, longitude] = newData.split('|')[2].split(',');
    //
    //         this._showForm({latlng: {lat: latitude, lng: longitude}});
    //     };
    // }
}

