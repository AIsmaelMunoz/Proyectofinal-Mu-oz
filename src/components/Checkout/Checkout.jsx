import { useContext, useState } from "react"
import Form from "./form"
import { CartContext } from "../../context/CartContext"
import { addDoc, collection } from "firebase/firestore"
import db from "../../db/db"

const Checkout = () => {
    const [datosForm, setDatosForm] = useState({
        nombre:"",
        cel:"",
        email:"",
    })

    const [idOrden, setIdOrden] = useState(null)
    const {carrito, totalPrecio, borrarCarrito} = useContext (CartContext)

    const guardarDatosInput = (event)=>{
        setDatosForm( { ...datosForm, [event.target.name]: event.target.value } )
    }

    const enviarOrden = (event)=>{
        event.preventDefault()
        const orden = {
            comprador: {...datosForm},
            productos: [...carrito],
            total: totalPrecio(),

        }

        subirOrden(orden)
    }

    const subirOrden = (orden)=>{
        const ordenesRef = collection(db, "ordenes")
        addDoc(ordenesRef, orden)
            .then((respuesta)=> {
                setIdOrden(respuesta.id)
                borrarCarrito()

        })
    }



  return (
    <div>
        {idOrden ? (
            <div>
                <h2>Orden generada con exito.</h2>
                <p>Numero de orden: {idOrden}</p>
            </div>
        ) : (
            <Form datosForm={datosForm} guardarDatosInput={guardarDatosInput} enviarOrden={enviarOrden} />
        )
        }
    </div>
  )
}
export default Checkout