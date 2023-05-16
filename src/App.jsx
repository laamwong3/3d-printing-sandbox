import {
  Stats,
  OrbitControls,
  Environment,
  useTexture
} from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import { Mesh, MeshStandardMaterial, Vector3 } from 'three'
import { DecalGeometry } from 'three-stdlib'

const size = new Vector3(0.15, 0.15, 0.15)
const decalMaterial = new MeshStandardMaterial({
  transparent: true,
  depthWrite: false,
  polygonOffset: true,
  polygonOffsetFactor: -1
})

function Model() {
  const shirt = useRef()

  // image and shirt model from drcmda (https://codesandbox.io/u/drcmda)
  // https://codesandbox.io/s/t-shirt-configurator-ioxywi
  decalMaterial.map = useTexture('./img/three2.png')
  const { nodes, materials } = useGLTF('./models/shirt_baked_2-transformed.glb')
  const state = useThree()

  function addDecal(point, face) {
    const m = new Mesh(
      new DecalGeometry(shirt.current, point, face.normal, size),
      decalMaterial
    )
    state.scene.add(m)
  }

  return (
    <group dispose={null}>
      <mesh
        ref={shirt}
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        position={[0.42, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerDown={({ point, face }) => {
          addDecal(point, face)
        }}
      />
    </group>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [0.1, 0.5, 0.45] }}>
      <Environment preset="forest" />
      <Model />
      <OrbitControls target={[0, 0.25, 0]} />
      <Stats />
    </Canvas>
  )
}

useGLTF.preload('/shirt_baked_2-transformed.glb')
