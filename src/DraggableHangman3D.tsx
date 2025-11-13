/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  RigidBodyProps
} from '@react-three/rapier';
import * as THREE from 'three';

interface DraggableHangman3DProps {
  numberOfGuesses: number;
  isWinner?: boolean;
}

export default function DraggableHangman3D({ numberOfGuesses, isWinner = false }: DraggableHangman3DProps) {
  return (
    <div className="draggable-hangman-wrapper">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), 0)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Physics gravity={[0, -20, 0]} timeStep={1 / 60}>
          <HangmanFigure numberOfGuesses={numberOfGuesses} isWinner={isWinner} />
          <Gallows />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Gallows() {
  return (
    <group position={[0, 0, 0]}>
      {/* Base */}
      <RigidBody type="fixed">
        <CuboidCollider args={[2, 0.1, 0.5]} />
        <mesh position={[0, -3, 0]}>
          <boxGeometry args={[4, 0.2, 1]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </RigidBody>
      
      {/* Vertical pole */}
      <RigidBody type="fixed">
        <CuboidCollider args={[0.1, 2.5, 0.1]} />
        <mesh position={[-1.5, -0.5, 0]}>
          <boxGeometry args={[0.2, 5, 0.2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </RigidBody>
      
      {/* Horizontal beam */}
      <RigidBody type="fixed">
        <CuboidCollider args={[1, 0.1, 0.1]} />
        <mesh position={[-0.5, 1.9, 0]}>
          <boxGeometry args={[2, 0.2, 0.2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </RigidBody>
      
      {/* Noose attachment point */}
      <RigidBody type="fixed" position={[0.4, 1.8, 0]}>
        <BallCollider args={[0.05]} />
      </RigidBody>
    </group>
  );
}

interface HangmanFigureProps {
  numberOfGuesses: number;
  isWinner: boolean;
}

function HangmanFigure({ numberOfGuesses, isWinner }: HangmanFigureProps) {
  const head = useRef<any>(null);
  const body = useRef<any>(null);
  const leftArm = useRef<any>(null);
  const rightArm = useRef<any>(null);
  const leftLeg = useRef<any>(null);
  const rightLeg = useRef<any>(null);
  const noosePoint = useRef<any>(null);

  const [dragged, setDragged] = useState<false | THREE.Vector3>(false);
  const [hovered, setHovered] = useState(false);

  const vec = new THREE.Vector3();
  const dir = new THREE.Vector3();

  // Rope joint from noose to head (if head exists)
  useRopeJoint(noosePoint, head, [[0, 0, 0], [0, 0.3, 0], 0.5]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state) => {
    if (dragged && typeof dragged !== 'boolean' && head.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      
      // Wake up all body parts
      [head, body, leftArm, rightArm, leftLeg, rightLeg].forEach(ref => {
        if (ref.current) ref.current.wakeUp();
      });
      
      head.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }
  });

  const segmentProps = {
    type: 'dynamic' as RigidBodyProps['type'],
    canSleep: true,
    colliders: false,
    angularDamping: 2,
    linearDamping: 2
  };

  const winnerColor = isWinner ? "#00ff00" : "#ff6b6b";
  const bodyColor = "#ffdbac";

  return (
    <group>
      {/* Noose attachment point */}
      <RigidBody ref={noosePoint} type="fixed" position={[0.4, 1.8, 0]}>
        <BallCollider args={[0.05]} />
      </RigidBody>

      {/* Head - appears first */}
      {numberOfGuesses >= 1 && (
        <RigidBody
          ref={head}
          {...segmentProps}
          position={[0.4, 1, 0]}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <BallCollider args={[0.3]} />
          <mesh
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              setDragged(false);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              setDragged(new THREE.Vector3().copy(e.point).sub(vec.copy(head.current.translation())));
            }}
          >
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial color={isWinner ? winnerColor : bodyColor} />
          </mesh>
          
          {/* Eyes */}
          <mesh position={[-0.1, 0.1, 0.25]}>
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[0.1, 0.1, 0.25]}>
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial color="black" />
          </mesh>
          
          {/* Mouth */}
          <mesh position={[0, -0.1, 0.25]} rotation={[0, 0, isWinner ? Math.PI : 0]}>
            <ringGeometry args={[0.05, 0.08, 16, 1, 0, Math.PI]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </RigidBody>
      )}

      {/* Body - appears second */}
      {numberOfGuesses >= 2 && (
        <RigidBody ref={body} {...segmentProps} position={[0.4, 0.2, 0]}>
          <CuboidCollider args={[0.15, 0.4, 0.1]} />
          <mesh>
            <boxGeometry args={[0.3, 0.8, 0.2]} />
            <meshStandardMaterial color={isWinner ? winnerColor : bodyColor} />
          </mesh>
        </RigidBody>
      )}

      {/* Right Arm - appears third */}
      {numberOfGuesses >= 3 && (
        <RigidBody ref={rightArm} {...segmentProps} position={[0.8, 0.4, 0]}>
          <CuboidCollider args={[0.2, 0.05, 0.05]} />
          <mesh>
            <boxGeometry args={[0.4, 0.1, 0.1]} />
            <meshStandardMaterial color={isWinner ? winnerColor : bodyColor} />
          </mesh>
        </RigidBody>
      )}

      {/* Left Arm - appears fourth */}
      {numberOfGuesses >= 4 && (
        <RigidBody ref={leftArm} {...segmentProps} position={[0, 0.4, 0]}>
          <CuboidCollider args={[0.2, 0.05, 0.05]} />
          <mesh>
            <boxGeometry args={[0.4, 0.1, 0.1]} />
            <meshStandardMaterial color={isWinner ? winnerColor : bodyColor} />
          </mesh>
        </RigidBody>
      )}

      {/* Right Leg - appears fifth */}
      {numberOfGuesses >= 5 && (
        <RigidBody ref={rightLeg} {...segmentProps} position={[0.6, -0.4, 0]}>
          <CuboidCollider args={[0.05, 0.2, 0.05]} />
          <mesh>
            <boxGeometry args={[0.1, 0.4, 0.1]} />
            <meshStandardMaterial color={isWinner ? winnerColor : bodyColor} />
          </mesh>
        </RigidBody>
      )}

      {/* Left Leg - appears sixth */}
      {numberOfGuesses >= 6 && (
        <RigidBody ref={leftLeg} {...segmentProps} position={[0.2, -0.4, 0]}>
          <CuboidCollider args={[0.05, 0.2, 0.05]} />
          <mesh>
            <boxGeometry args={[0.1, 0.4, 0.1]} />
            <meshStandardMaterial color={isWinner ? winnerColor : bodyColor} />
          </mesh>
        </RigidBody>
      )}
    </group>
  );
}
