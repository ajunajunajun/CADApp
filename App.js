import { GLView } from 'expo';
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, Button, ScrollView,
   Animated, TouchableOpacity } from 'react-native';
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
      materialFormLeft: new Animated.Value(100), materialFormFlag: true,
      translateFlag: true
    };
    this.materialFormLeftInterpolate = this.state.materialFormLeft.interpolate({
      inputRange: [20,100],
      outputRange: ['20%','100%']
    });
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
        <GLView style={{ flex: 1 ,backgroundColor:'black' }}
          onContextCreate={this._onGLContextCreate}
        />
        <Animated.View style={[styles.materialFormTest,{left: this.materialFormLeftInterpolate}]}>
          <ScrollView style={{flex:1}}>
            {Materials}
          </ScrollView>
        </Animated.View>
        <TouchableOpacity
          style={styles.setMaterialButton}
          onPress={this._MaterialForm}
        />
        <TouchableOpacity
          style={styles.settranslateFlagButton}
          onPress={this._changetranslateFlag}
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

    const floorgeometry = new THREE.BoxGeometry(15, 1, 15);
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

  _setMaterial = i => {
    this.setState({
      materialX:data.block[i].x,
      materialY:data.block[i].y,
      materialZ:data.block[i].z,
      onPressFlag: 'true'
    });

  };
  _MaterialForm = () => {
    if( this.state.materialFormFlag === true ){
      Animated.spring(this.state.materialFormLeft,{
        toValue: 20,
        duration: 100,
      }).start();
      this.setState({materialFormFlag:false});
    } else {
      Animated.timing(this.state.materialFormLeft,{
        toValue: 100,
        duration: 100,
      }).start();
      this.setState({materialFormFlag:true});
    }
  };
  _changetranslateFlag = () => {
    if( this.state.translateFlag === true ){
      this.setState({translateFlag:false});
    } else {
      this.setState({translateFlag:true});
    }
    alert(this.state.translateFlag);
  };
}

const styles = StyleSheet.create({
  setMaterialButton: {
    width: 50,
    height: 50,
    borderRadius:100,
    backgroundColor: 'white',
    position:'absolute',
    bottom:'5%',
    right:30
  },
  settranslateFlagButton: {
    width: 50,
    height: 50,
    borderRadius:100,
    backgroundColor: 'white',
    position:'absolute',
    top:'5%',
    right:30
  },
  materialForm: {
    backgroundColor:'lightgray'
  },
  materialFormTest: {
    position:'absolute',
    backgroundColor:'lightgray',
    width:'100%',
    height:'20%',
    bottom:0,
  },
  materialsText: {
    fontSize:30
  }
});
