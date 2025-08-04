export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyAogEOxxJUc9QIlKlpMqwsBSWQDQcRXWao",
    authDomain: "ameth-e4db7.firebaseapp.com",
    databaseURL: "https://ameth-e4db7-default-rtdb.firebaseio.com",
    projectId: "ameth-e4db7",
    storageBucket: "ameth-e4db7.appspot.com",
    messagingSenderId: "161550792285",
    appId: "1:161550792285:web:4cfe05e265808e8e117fb4",
    measurementId: "G-QL44NWTRM6"
  },
  mercadoPago: {
    // Credenciales de TEST (Sandbox)
    publicKey: 'APP_USR-c2635e81-fad0-44ef-8bce-d91c0f7cb276', // Reemplaza con tu Public Key de TEST
    accessToken: 'APP_USR-7550807410305162-080323-ed9f39fc77bd7c2aa60806ae8803a073-1666138183', // Reemplaza con tu Access Token de TEST
    
    // Para producción, cambia a:
    // publicKey: 'APP_USR-tu-public-key-de-produccion',
    // accessToken: 'APP_USR-tu-access-token-de-produccion',
    
    currency: 'MXN',
    environment: 'production', // Cambiar a 'production' cuando vayas a producción
    notificationUrl: 'https://www.amethdev.pro/webhooks/mercadopago' // URL para recibir notificaciones de pago
  },
  /*
  paypal: {
    clientId: 'AQz254WBtZKYt2WjMnnJEE1RsZR_s1fhHQ-Z6KGLG8n1dApacboNGfErSMvXRT6Ibx743CqUNs2nUM-w',
    currency: 'MXN',
    environment: 'sandbox'
  } */
};