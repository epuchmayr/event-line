'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Button, Stack } from '@mui/material';

function Box(props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  useFrame((state, delta) => {
    ref.current.rotation.z += delta / 50;
    hovered && (ref.current.rotation.y += delta);
  });

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

export default function Page() {
  return (
    <div className='h-screen'>
      <Stack spacing={2} direction='row'>
        <Link href={'/line/create'}>
          <Button variant='contained'>Create</Button>
        </Link>
        <Link href={'/line/view'}>
          <Button variant='outlined'>View</Button>
        </Link>
      </Stack>

      <Canvas>
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} />
        <mesh position={[0.5, 0.5, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <sphereGeometry />
          <meshToonMaterial transparent />
        </mesh>
        <OrbitControls autoRotate autoRotateSpeed={.066666} />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      </Canvas>
    </div>
  );
}
