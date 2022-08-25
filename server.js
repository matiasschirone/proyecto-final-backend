const { Router } = require('express');
const express = require("express");
const routerProductos = Router();
const routerCarrito = Router();
const { Contenedor } = require("./contenedor");
const { ContenedorCarrito } = require("./contenedorCarrito");
const app = express();


app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


const contenedor = new Contenedor("./productos.json");
const carrito = new ContenedorCarrito("./carrito.json");

const administrador = true;

routerProductos.get('/', async(req, res) => {
    const contenedor = new Contenedor('productos.json');
    let productos = await contenedor.getAll()
    res.send(productos)
} )

routerProductos.get('/:id', async(req, res) => {
    const id = req.params.id
    const contenedor = new Contenedor('productos.json');
    let productoId = await contenedor.getById(id)
    res.send(productoId)
} )

routerProductos.post('/', async(req, res) => {
    if (administrador) {
        const contenedor = new Contenedor('productos.json');
        let producto = await contenedor.save(req.body)
        res.send(producto)
    } else {
        res.send({ error: "No tienes permisos para agregar productos" })
    }
} )

routerProductos.put('/:id', async(req, res) => {
    if (administrador) {
        const contenedor = new Contenedor('productos.json');
        let producto = await contenedor.updateById(req.params.id, req.body)
        res.send(producto)
    } else {
        res.send({ error: "No tienes permisos para actualizar productos" })
    }
} )

routerProductos.delete('/:id', async(req, res) => {
    if (administrador) {
        const contenedor = new Contenedor('productos.json');
        let producto = await contenedor.deleteById(req.params.id)
        res.send(producto)
    } else {
        res.send({ error: "No tienes permisos para eliminar productos" })
    }
} )


routerProductos.get('*', (req, res) => {
    res.send({
        error: -2,
        description: 'Ruta no encontrada'
    })
} )

routerCarrito.post('/', async(req, res) => {
    const objProducto = req.body
    console.log(objProducto)
    const contenedor = new Contenedor('carrito.json');
    let producto = await contenedor.save(objProducto)
    res.send({
        message: 'Producto guardado',
        objProducto
    })
} )

routerCarrito.delete('/:id', async(req, res) => {
    const { id } = req.params
    const contenedor = new Contenedor('carrito.json')
    let producto = await contenedor.deleteById(parseInt(id))
    res.send({
        message: 'Producto eliminado',
        id
    })
} )

routerCarrito.delete('/:id/producto/:id_prod', async(req, res) => {
    const { id, id_prod } = req.params
    const contenedor = new Contenedor('carrito.json')
    let producto = await contenedor.deleteById(parseInt(id), parseInt(id_prod))
    res.send({
        message: 'Producto eliminado',
        id
    })
} )

routerCarrito.get('/:id', async(req, res) => {
    const id = req.params.id
    const contenedor = new Contenedor('carrito.json');
    let productoId = await contenedor.getById(id)
    res.send(productoId)
} )

routerCarrito.get('/:id/productos', async(req, res) => {
    const id = req.params.id
    const contenedor = new Contenedor('carrito.json');
    let productoId = await contenedor.getById(id)
    res.send(productoId)
} )

routerCarrito.get('*', (req, res) => {
    res.send({
        error: -2,
        description: 'Ruta no encontrada'
    })
} )


app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)

const PORT = process.env.PORT || 8080;
app.listen(PORT, err => {
	if (err) throw err;
	console.log(`Server running on port ${PORT}`);
});