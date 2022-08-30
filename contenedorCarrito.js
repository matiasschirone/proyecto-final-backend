const fs = require('fs')
class ContenedorCarrito {
    constructor(ruta){
        this.ruta = ruta       
    }   

    async #readFileFunction(ruta){
        let archivo = await fs.promises.readFile(ruta, 'utf-8' )
        let archivoParseado = await JSON.parse(archivo)
        return archivoParseado
    }
    
    async save(obj){       
        try {             
            let dataArch = await this.#readFileFunction(this.ruta)
            if (dataArch.length) {
                await fs.promises.writeFile(this.ruta, JSON.stringify( [...dataArch, { ...obj, id: dataArch[dataArch.length - 1].id + 1 } ], null, 2))                              
            } else {
                await fs.promises.writeFile(this.ruta, JSON.stringify( [{ ...obj, id: 1 }], null, 2))                
            }            
             console.log(`El archivo tiene el id: ${dataArch[dataArch.length - 1].id + 1}`)
        } catch (error) {
            console.log(error)
        }            
       
    }
   
    async updateById(id, objProducto){ 
        console.log('id', id)
        console.log('objProducto', objProducto)
        try {             
            let dataArch = await this.#readFileFunction(this.ruta) 
            console.log('dataArch', dataArch)
            const objIndex = dataArch.findIndex(prod => prod.id === id)
            console.log('objIndex', objIndex) 
            if (objIndex !== -1) {

                dataArch[objIndex] = {
                    id: id,
                    nombre: objProducto.nombre,
                    precio: objProducto.precio,
                    categoria: objProducto.categoria
                }
                console.log('dataArch',dataArch)
                await fs.promises.writeFile(this.ruta, JSON.stringify( dataArch, null, 2))  
                return {msg: 'actualizado el producto'}                            
            } else {
               
                return {error: 'no existe el producto'}            
            }           
            
        } catch (error) {
            console.log(error)
        }            
       
    }


    async getProductRamdom(){
        try {
            let dataArch = await this.#readFileFunction(this.ruta)
            let random = Math.floor(Math.random() * dataArch.length)
            return dataArch[random]
        } catch (error) {
            console.log(error)
        }
    } 


    async getById(id){
        console.log(id)
        try {
            let dataArch = await this.#readFileFunction(this.ruta)
            console.log(this.ruta)
           // console.log(dataArch)
            let producto = dataArch.find(producto => producto.id == id)
            if (producto) {  
                return producto              
                console.log(producto)
            } else {               
                //console.log('No se encontro el producto')  
            }           
        } catch (error) {
            console.log(error)
        }
    }

	async addProductToCart(idCart, objProduct){
        try{
            let dataArch = await this.#readFileFunction(this.ruta)

            let carrito = dataArch.find(carrito => carrito.id == idCart)
            console.log(carrito)
            if (carrito) {
                carrito.productos.push(objProduct)
                await fs.promises.writeFile(this.ruta, JSON.stringify( dataArch, null, 2))
                return {msg: 'producto agregado al carrito'}    
            } else {
                return {error: 'no existe el carrito'}
            }
        } catch (error) {
            console.log(error)
        }

	}


	async deleteProductFromCart(idCart, idProduct) {
		try {
            let dataArch = await this.#readFileFunction(this.ruta)

            let prodFilter = dataArch.filter(cart => cart.id == idCart)
            console.log("prodFilter", prodFilter)

            if (prodFilter) {
                
                prodFilter[0].productos = prodFilter[0].productos.filter(producto => producto.id != idProduct)
                await fs.promises.writeFile(this.ruta, JSON.stringify(prodFilter, null, 2))
                return {msg: 'producto eliminado'}
            } else {
                return {error: 'no existe el producto'}
            }

            } catch (error) {       
            console.log(error)
        }
    }       


	async getProductsById(id){
		try {
			let dataArch = await this.#readFileFunction(this.ruta)
			let cart = dataArch.find((cart) => cart.id == id)
			if (cart) {
				return cart.productos
			} else {
				return { error: 'No se encontro el carrito' }
			}
		} catch (error) {
			console.log(error)
		}
	}

  
    async getAll(){
        try {            
            let dataArch = await this.#readFileFunction(this.ruta)           
            if (dataArch.length) {                             
                return dataArch
            } else {                
                return null
            }            
        } catch (error) {
            console.log(error)
        }
    }

    async deleteId(id){
        //console.log(id)
        try {
            let dataArch = await this.#readFileFunction(this.ruta)
            //console.log(this.ruta)
            //console.log(dataArch)
            let producto = dataArch.find(producto => producto.id == id)
            
            if (producto) {
                console.log(producto)
                const dataArchParseFiltrado = dataArch.filter(prod => prod.id !== id)   
                await fs.promises.writeFile(this.ruta, JSON.stringify(dataArchParseFiltrado, null, 2), 'utf-8')

                //console.log('Producto eliminado')
            }else{
                console.log('no existe el producto')
            }
        } catch (error) {
            console.log(error)
        }
    }


    async getLength(){
        let dataArch = await this.#readFileFunction(this.ruta)
        return dataArch.length
    }



    async getRandom(){
        let dataArch = await this.#readFileFunction(this.ruta)
        let random = Math.floor(Math.random() * dataArch.length)
        return dataArch[random]
    }


    async deleteAll(){
        await fs.promises.writeFile(this.ruta, JSON.stringify([], null, 2), 'utf-8')
    }
}

module.exports =   { ContenedorCarrito }

