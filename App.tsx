import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  Pressable,
  Image,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ControlPresupuesto from './src/components/ControlPresupuesto';
import Filtro from './src/components/Filtro';
import FormularioGasto from './src/components/FormularioGasto';
import Header from './src/components/Header';
import ListadoGastos from './src/components/ListadoGastos';
import NuevoPresupuesto from './src/components/NuevoPresupuesto';
import { generarID } from './src/helpers';


const App = () => {

    const [ isValidPresupuesto, setIsValidPresupuesto ] = useState(false)
    const [ presupuesto, setPresupuesto ] = useState(0)
    const [ gastos, setGastos ] = useState([])
    const [ modal, setModal ] = useState(false)
    const [ gasto, setGasto ] = useState({})
    const [ filtro, setFiltro ] = useState('')
    const [ gastosFiltrados, setGastosFiltrados ] = useState([])

    useEffect(()=>{
        const obtenerPresupuestoStorage = async() => {
            try {
                const presupuestoStorage = await AsyncStorage.getItem('planificador_presupuesto') ?? 0

                if(presupuestoStorage > 0 ) {
                    setPresupuesto(presupuestoStorage)
                    setIsValidPresupuesto(true)
                }
            } catch (error) {
                console.log(error)
            }
        }
        obtenerPresupuestoStorage()
    }, [])

    useEffect(() => {
        if(isValidPresupuesto) {
            const guardarPresupuestoStorage = async () => {
                try {
                    await AsyncStorage.setItem('planificador_presupuesto', presupuesto)
                } catch (error) {
                    console.log(error)
                }
            }
            guardarPresupuestoStorage()
        }
    }, [isValidPresupuesto])


    useEffect(() => {
        const obtenerGastosStorage = async() => {
            try {
                const gastosStorage = await AsyncStorage.getItem('planificador_gastos') 

                setGastos( gastosStorage ? JSON.parse(gastosStorage) : [])
            } catch (error) {
                console.log(error)
            }
        }
        obtenerGastosStorage()
    }, [])

    useEffect(() => {
      const guardarGastosStorage = async() => {
        try {
            await AsyncStorage.setItem('planificador_gastos', JSON.stringify(gastos))
        } catch (error) {
            console.log(error)
        }
      }
      guardarGastosStorage()
    }, [gastos])



    
    const handleNuevoPresupuesto = (presupuesto) => {
        if(+presupuesto > 0){
            setIsValidPresupuesto(true)
        } else {
            Alert.alert('Error', 'El presupuesto no puede ser 0 o menor', [{text: 'OK'}])
        }
    }

    const handleGasto = gasto => {
        if([gasto.nombre, gasto.categoria, gasto.cantidad].includes('')) {
            Alert.alert(
                'Error',
                'Todos los campos son Obligatorios'
            )
            return
        }

        if(gasto.id){
            const gastosActualizados = gastos.map( gastoState => gastoState.id === gasto.id ? gasto : gastoState )

            setGastos( gastosActualizados )
        } else {
            // Agregar gasto al State
            gasto.id = generarID()
            gasto.fecha = Date.now()
            setGastos([...gastos, gasto])
        }
        setModal(!modal)
    }

    const eliminarGasto = id => {
        Alert.alert(
            'Deseas Eliminar este gasto? ',
            'Un gasto eliminado no podra recuperarse',
            [
                {text: 'No', style: 'cancel'},
                {text: 'Si, Eliminar', onPress: () => {
                    const gastosActualizados = gastos.filter(gastoState => gastoState.id !== id)
                    setGastos(gastosActualizados)
                    setModal(!modal)
                    setGasto({})
                }}
            ]
        )
    }

    const resetearApp = () => {
        Alert.alert(
            'Deseas resetear la app?',
            'Se eliminaran presupuestos y gastos',
            [
                {text: 'No', style: 'cancel'},
                {text: 'Si, Eliminar', onPress: async() => {
                    try {
                        await AsyncStorage.clear()

                        setIsValidPresupuesto(false)
                        setPresupuesto(0)
                        setGastos([])
                    } catch (error) {
                        console.log(error)
                    }
                }}
            ]
        )
    }

    return (
      <View style={styles.contenedor}>
        <ScrollView>
            <View style={styles.header}>
                <Header/>
                { isValidPresupuesto ? (
                    <ControlPresupuesto 
                        presupuesto={presupuesto}
                        gastos={gastos}
                        resetearApp={resetearApp}
                    />
                )
                : (
                    <NuevoPresupuesto
                        presupuesto={presupuesto}
                        setPresupuesto={setPresupuesto}
                        handleNuevoPresupuesto={handleNuevoPresupuesto}
                    />
                )
                }
            </View>

            { isValidPresupuesto && (
                <>
                    <Filtro 
                        filtro={filtro}
                        setFiltro={setFiltro}
                        gastos={gastos}
                        setGastosFiltrados={setGastosFiltrados}
                    />
                    <ListadoGastos 
                        gastos={gastos}
                        setModal={setModal}
                        setGasto={setGasto}
                        filtro={filtro}
                        gastosFiltrados={gastosFiltrados}
                    />
                </>
            )}
        </ScrollView>

        { modal && (
            <Modal 
                animationType='slide'
                visible={modal}
            >
                <FormularioGasto
                    setModal={setModal}
                    handleGasto={handleGasto}
                    gasto={gasto}
                    setGasto={setGasto}
                    eliminarGasto={eliminarGasto}
                />
            </Modal>
        )}

        { isValidPresupuesto && (
        <Pressable
            style={styles.pressable}
            onPress={() => {setModal(!modal)}}
        >
            <Image style={styles.imagen} source={require('./src/img/nuevo-gasto.png')}/>
        </Pressable>)}
      </View>
    )
}

const styles = StyleSheet.create({
    contenedor: {
        color: '#F5F5F5',
        flex: 1,
         
    },
    header: {
        backgroundColor: '#3B82F6',
        minHeight: 400
    },
    pressable: {
        position: 'absolute',
        bottom: 30,
        right: 40,
        width: 60,
        height: 60
    },
    imagen: {
        width: 60,
        height: 60,
    }
});

export default App;
