import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Header = () => {
  return (
    <View> 
        <Text style={styles.texto}>Planificador de Gastos</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#3B82F6'
    },
    texto: {
        textAlign: 'center',
        fontSize: 30,
        color: "#FFF",
        textTransform: 'uppercase',
        fontWeight: 'bold',
        paddingTop: 20
    },
});

export default Header