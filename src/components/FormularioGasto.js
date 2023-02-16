import React, { useState, useEffect } from 'react'
import { Text, View, TextInput, StyleSheet, Pressable } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import globalStyles from '../styles'

const FormularioGasto = ({setModal, handleGasto, setGasto, gasto, eliminarGasto}) => {

    const [nombre, setNombre] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [categoria, setCategoria] = useState('')
    const [ id, setId ] = useState('')
    const [ fecha, setFecha ] = useState('')
    
    useEffect(() => {
        if(gasto?.nombre){
            setNombre(gasto.nombre)
            setCantidad(gasto.cantidad)
            setCategoria(gasto.categoria)
            setId(gasto.id)
            setFecha(gasto.fecha)
        } 
    }, [gasto])
    

  return (
    <View style={styles.contenedor}>
        <View style={styles.contenedorBotones}>
            <Pressable 
                style={[styles.btn, styles.btnCancelar]}
                onLongPress={()=>{
                        setModal(false)
                        setGasto({})
                }}
            >
                <Text style={styles.btnTexto}> Cancelar</Text>
            </Pressable>

            {!!id && (
                <Pressable 
                    style={[styles.btn, styles.btnEliminar]}
                    onLongPress={() => eliminarGasto(id)}
                >
                    <Text style={styles.btnTexto}> Eliminar</Text>
                </Pressable>
            )}

        </View>

        <View style={styles.formulario}>
            <Text style={styles.titulo}>{gasto?.nombre ? 'Editar Gasto' : 'Nuevo Gasto'}</Text>
            <View style={styles.campo}>
                <Text style={styles.label}>Nombre Gasto</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='Nombre del Gasto. EJ: Comida'
                    value={nombre}
                    onChangeText={setNombre}
                />
            </View>

            <View style={styles.campo}>
                <Text style={styles.label}>Cantidad Gasto</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='Cantidad del Gasto. EJ: 50'
                    keyboardType='numeric'
                    value={cantidad}
                    onChangeText={setCantidad}
                />
            </View>

            <View style={styles.campo}>
                <Text style={styles.label}>Categoria Gasto</Text>
                <Picker
                    selectedValue={categoria}
                    onValueChange={(value)=> {setCategoria(value)}}
                >
                    <Picker.Item label='--Seleccione--' value=''/>
                    <Picker.Item label='Ahorro' value='ahorro'/>
                    <Picker.Item label='Comida' value='comida'/>
                    <Picker.Item label='Casa' value='casa'/>
                    <Picker.Item label='Gastos Varios' value='gastos'/>
                    <Picker.Item label='Ocio' value='ocio'/>
                    <Picker.Item label='Salud' value='salud'/>
                    <Picker.Item label='Suscripciones' value='suscripciones'/>
                </Picker> 
            </View>
            <Pressable 
                onPress={() => handleGasto({nombre, cantidad, categoria, id, fecha})}
                style={styles.submitBtn}
            >
                <Text style={styles.submitBtnTexto}>
                    {gasto?.nombre ? 'Guardar Cambios' : 'Agregar Gasto'}
                </Text>
            </Pressable>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: '#1E40AF',
        flex: 1
    },
    contenedorBotones: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btn: {
        padding: 10,
        marginTop: 20,
        marginHorizontal: 10,
        borderRadius: 10,
        flex: 1
    },
    btnEliminar: {
        backgroundColor: 'red'
    },
    btnCancelar: {
        backgroundColor: '#DB2777',
        
    },
    btnTexto: {
        textAlign: 'center',
        textTransform: 'uppercase',
        color: '#FFF',
        fontWeight: 'bold'
    },
    formulario: {
        ...globalStyles.contenedor
    },
    titulo: {
        textAlign: 'center',
        fontSize: 28,
        marginBottom: 30,
        color: '#64748B'
    },
    campo: {
        marginVertical: 10
    },
    label: {
        color: '#64748B',
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'uppercase'
    },
    input: {
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 10,
        marginTop: 10
    },
    submitBtn: {
        backgroundColor: '#3B82F6',
        padding: 6,
        marginTop: 20
    },
    submitBtnTexto: {
        textAlign: 'center',
        color: '#FFF',
        fontWeight: 700,
        textTransform: 'uppercase'
    }
})

export default FormularioGasto