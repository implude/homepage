<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';

	const count = 200;
	const spread = 15;

	const particleGeometry = new THREE.BufferGeometry();
	const positions = new Float32Array(count * 3);

	for (let i = 0; i < count; i++) {
		positions[i * 3] = (Math.random() - 0.5) * spread;
		positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
		positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
	}

	particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

	const lineGeometry = new THREE.BufferGeometry();
	const linePositionsArray: number[] = [];
	const threshold = 2.5;

	for (let i = 0; i < count; i++) {
		for (let j = i + 1; j < count; j++) {
			const dx = positions[i * 3] - positions[j * 3];
			const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
			const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
			const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

			if (dist < threshold) {
				linePositionsArray.push(
					positions[i * 3],
					positions[i * 3 + 1],
					positions[i * 3 + 2],
					positions[j * 3],
					positions[j * 3 + 1],
					positions[j * 3 + 2]
				);
			}
		}
	}

	lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositionsArray), 3));

	const pointsMaterial = new THREE.PointsMaterial({
		size: 0.08,
		color: 0x3b82f6,
		transparent: true,
		opacity: 0.9,
		sizeAttenuation: true
	});

	const lineMaterial = new THREE.LineBasicMaterial({
		color: 0x3b82f6,
		transparent: true,
		opacity: 0.2
	});

	let groupRef: THREE.Group | undefined = $state();
	let time = 0;

	useTask((delta) => {
		if (groupRef) {
			time += delta * 0.1;
			groupRef.rotation.y = time * 0.2;
			groupRef.rotation.x = Math.sin(time * 0.3) * 0.1;
		}
	});
</script>

<T.Group bind:ref={groupRef}>
	<T.Points geometry={particleGeometry} material={pointsMaterial} />
	<T.LineSegments geometry={lineGeometry} material={lineMaterial} />
</T.Group>
