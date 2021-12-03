import fs from 'fs'

class Contenedor {

    async save (event) {
        try{
            let data = await fs.promises.readFile('./files/productos.txt', 'utf-8');
            let events = JSON.parse(data);
            let id = events[events.length-1].id+1;
            event = Object.assign({id:id},event)
            events.push(event)
            try{
                await fs.promises.writeFile('./files/productos.txt',JSON.stringify(events,null,2));
                return {status:"succes", message:"producto creado con exito"};
            }catch{
                return {status:"error", message:"No se pudo crear el producto"}
            }
            }catch{
                event = Object.assign({id:1},event)
                try{
                    await fs.promises.writeFile('./files/productos.txt',JSON.stringify([event], null, 2));
                    return {status:"succes", message:"producto creado con exito"}
                }
                catch{
                    return {status:"error", message:"no se pudo crear el producto"}
                }
        }
    }

    async getById(id){
        try{
            let data =  await fs.promises.readFile('./files/productos.txt','utf-8')
            let events = JSON.parse(data);
            let event = events.find(evt=>evt.id===id);
            if(event){
                return {status:"succes", payload:event}
            }else{
                return {status:"error", message:"Evento no encontrado"}
            }
        }catch{
            return {status:"error",message:"No se encontró el evento"}
        }
    }

    async getAll(){
        try{
            let data = await fs.promises.readFile('./files/productos.txt', 'utf-8');
            let events = JSON.parse(data)
            return {status:"succes", payload:events}
        }catch(error){
            return {status:"error",message:"No se encontraron eventos"}
        }
    }

    async deleteAll(id){
        try {
            await fs.promises.unlink('./files/productos.txt', 'utf-8')
            return {status:"succes", message:"Archivo eliminado"}
        } catch (error) {
            throw error;
        }
    }

    async deleteById(id){
        try{
            let data =  await fs.promises.readFile('./files/productos.txt','utf-8')
            let events = JSON.parse(data);
            if(!events.some(event=>event.id===id)) return {status:"error", message:"No hay producto con el id especificado"}
            let event = events.find(v=>v.id===id);
            let aux = events.filter(event=>event.id!==id);
            try{
                await fs.promises.writeFile('./files/productos.txt',JSON.stringify(aux,null,2));
                return {status:"success",message:"Producto eliminado"}
            }catch{
                return {status:"error", message:"No se pudo eliminar el producto"}
            }
        }catch{
            return {status:"error",message:"Falló al eliminar el producto"}
        }
    }

    async updateProducto(id,body){
        try{
            let data = await fs.promises.readFile('./files/productos.txt','utf-8');
            let events = JSON.parse(data);
            if(!events.some(event=>event.id===id)) return {status:"error", message:"No hay ningún producto con el id especificado"}
            let result = events.map(event=>{
                if(event.id===id){
                        body = Object.assign({id:event.id,...body})
                        return body
                }else{
                    return event;
                }
            })
            try{
                await fs.promises.writeFile('./files/productos.txt',JSON.stringify(result,null,2));
                return {status:"success", message:"Producto actualizado"}
            }catch{
                return {status:"error", message:"Error al actualizar el producto"}
            }
        }catch{
            return {status:"error",message:"Fallo al actualizar el producto"}
        }
    }

}

export default Contenedor;