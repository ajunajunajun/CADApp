import { GLView } from 'expo';
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, Button, ScrollView, Animated, TouchableOpacity } from 'react-native';
import * as THREE from "three";
import ExpoTHREE from 'expo-three';

import data from './src/containers/materiallist.json';

console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onPressFlag: 'false', onPressCount: 0,
      materialX: '', materialY: '',materialZ: '',
      materialFormFlex: new Animated.Value(0), materialFormFlag: true,
    };
  }
  render() {
    var Materials = [];
    for(let i = 0; i < Object.keys(data['block']).length ; i++){
      Materials.push(
        <TouchableOpacity style={{flex:1}}
          onPress={ () => this._setMaterial(i)}
        >
          <Text style={styles.materialsText}>
            id:{data.block[i].id},X:{data.block[i].x},Y:{data.block[i].y},Z:{data.block[i].z}
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor:'black' }}>
        <TouchableOpacity style={{ flex: 1 }}
          onPress={this._setonPressFlag}
        >
          <GLView style={{ flex: 1 }}
            onContextCreate={this._onGLContextCreate}
          />
        </TouchableOpacity>
        <Animated.View style={[styles.materialForm,{flex: this.state.materialFormFlex}]}>
          <ScrollView style={{flex:13}}>
            {Materials}
          </ScrollView>
        </Animated.View>
        <TouchableOpacity
          style={styles.setMaterialButton}
          onPress={this._MaterialForm}
        />

      </View>
    )
  }

  _onGLContextCreate = async (gl) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000
    );
    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 20;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const floorgeometry = new THREE.BoxGeometry(30, 1, 30);
    const floormaterial = new THREE.MeshNormalMaterial({ color: 0x00ff00 });
    const floor = new THREE.Mesh( floorgeometry, floormaterial );
    scene.add(floor);
    floor.position.y = -1;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      if(this.state.onPressFlag === 'true'){
        const geometry = new THREE.BoxGeometry(this.state.materialX, this.state.materialY, this.state.materialZ);
        const material = new THREE.MeshNormalMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh( geometry, material );
        scene.add(mesh);
        this.state.onPressCount += 1;
        mesh.position.y = this.state.onPressCount;
        this.setState({onPressFlag: 'false'});
      }
      gl.endFrameEXP();
    }
    animate();
  };

  _setonPressFlag = () => {
    this.setState({onPressFlag: 'true'});
  };
  _setMaterial = i => {
    alert("changed");
    this.setState({
      materialX:data.block[i].x,
      materialY:data.block[i].y,
      materialZ:data.block[i].z
    });
  };
  _MaterialForm = () => {
    if( this.state.materialFormFlag === true ){
      Animated.timing(this.state.materialFormFlex,{
        toValue: 0.3,
        duration: 100,
      }).start();
      this.setState({materialFormFlag:false});
    } else {
      Animated.timing(this.state.materialFormFlex,{
        toValue: 0,
        duration: 100,
      }).start();
      this.setState({materialFormFlag:true});
    }
  };

}

const styles = StyleSheet.create({
  setMaterialButton: {
    width: 50,
    height: 50,
    borderRadius:100,
    backgroundColor: 'white',
    position:'absolute',
    bottom:50,
    right:30
  },
  materialForm: {
    backgroundColor:'lightgray'
  },
  materialsText: {
    fontSize:30
  }
});
