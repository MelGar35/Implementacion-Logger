import config from '../config/config.js';
import mongoose from "mongoose"


export let Users;
export let Sessions;
export let Products;
export let Carts;
export let Ticket;


switch (config.PERSISTENCE) {
  case 'MONGO':
    console.log('Persistencia en Base de Datos')
    mongoose.set('strictQuery', false)
    mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(() => console.log("La Base de datos esta conectada"))
      .catch((err) => console.error(err))

    const { default: sessionsMongo } = await import('./mongo/sessions.mongo.js') 
    const { default: usersMongo } = await import('./mongo/sessions.mongo.js')
    const { default: productMongo } = await import('./mongo/products.mongo.js')
    const { default: cartMongo } = await import('./mongo/carts.mongo.js')
    const { default: ticketMongo } = await import('./mongo/ticket.mongo.js')

    Sessions = sessionsMongo;
    Users = usersMongo;
    Products = productMongo;
    Carts = cartMongo;
    Ticket = ticketMongo;

    break;

  //No esta desarrollada esta persistencia, pero es por si la necesitamos.
  case 'MEMORY':
    const { default: usersMemory } = await import('./memory/users.memory.js')
    const { default: productMemory } = await import('./memory/products.memory.js')
    const { default: cartMemory } = await import('./memory/carts.memory.js')


    console.log("Persistencia en memoria")
    Users = usersMemory;
    Products = productMemory;
    Carts = cartMemory;

}
