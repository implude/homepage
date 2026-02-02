<script lang="ts">
	import Icon from '@iconify/svelte';
	import { T, useTask } from '@threlte/core';
	import { HTML, OrbitControls } from '@threlte/extras';
	import * as THREE from 'three';

	interface TechItem {
		name: string;
		icon: string;
		category: string;
	}

	interface Props {
		items: TechItem[];
	}

	let { items }: Props = $props();

	function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
		const points: THREE.Vector3[] = [];
		const phi = Math.PI * (3 - Math.sqrt(5));

		for (let i = 0; i < count; i++) {
			const y = 1 - (i / (count - 1)) * 2;
			const radiusAtY = Math.sqrt(1 - y * y);
			const theta = phi * i;

			const x = Math.cos(theta) * radiusAtY;
			const z = Math.sin(theta) * radiusAtY;

			points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
		}

		return points;
	}

	const positions = fibonacciSphere(items.length, 4);

	let groupRef: THREE.Group | undefined = $state();
	let time = 0;
	let hoveredIndex: number | null = $state(null);

	let worldPositions: THREE.Vector3[] = $state(positions.map((p) => p.clone()));

	useTask((delta) => {
		if (groupRef) {
			if (hoveredIndex === null) {
				time += delta;
				groupRef.rotation.y = time * 0.1;
			}
			positions.forEach((pos, i) => {
				const worldPos = pos.clone();
				worldPos.applyMatrix4(groupRef!.matrixWorld);
				worldPositions[i] = worldPos;
			});
		}
	});

	const categoryColors: Record<string, string> = {
		Languages: '#3b82f6',
		Frontend: '#f97316',
		Backend: '#22c55e',
		Infrastructure: '#a855f7'
	};

	function createLineGeometry(pos: THREE.Vector3): THREE.BufferGeometry {
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, pos.x, pos.y, pos.z]), 3));
		return geometry;
	}
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50}>
	<OrbitControls enableZoom={false} enablePan={false} autoRotate={false} rotateSpeed={0.5} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.6} />
<T.PointLight position={[10, 10, 10]} intensity={0.8} />

<T.Group bind:ref={groupRef}>
	{#each items as item, i (item.name)}
		{@const pos = positions[i]}
		{@const color = categoryColors[item.category]}
		{@const lineGeometry = createLineGeometry(pos)}

		<T.Line geometry={lineGeometry}>
			<T.LineBasicMaterial {color} transparent opacity={hoveredIndex === i ? 0.5 : 0.1} />
		</T.Line>

		<T.Mesh position={[pos.x, pos.y, pos.z]}>
			<T.SphereGeometry args={[0.15, 16, 16]} />
			<T.MeshStandardMaterial {color} emissive={color} emissiveIntensity={hoveredIndex === i ? 0.8 : 0.3} />
		</T.Mesh>
	{/each}

	<T.Mesh>
		<T.IcosahedronGeometry args={[0.5, 1]} />
		<T.MeshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} wireframe />
	</T.Mesh>
</T.Group>

{#each items as item, i (item.name)}
	{@const color = `--color: ${categoryColors[item.category]}`}
	{@const worldPos = worldPositions[i]}

	<HTML position={[worldPos.x, worldPos.y, worldPos.z]} center sprite>
		<div
			class="tech-label"
			class:hovered={hoveredIndex === i}
			style={color}
			onmouseenter={() => (hoveredIndex = i)}
			onmouseleave={() => (hoveredIndex = null)}>
			<Icon icon={item.icon} width={20} height={20} />
			<span class="label-text">{item.name}</span>
		</div>
	</HTML>
{/each}

<style>
	.tech-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 6px 10px;
		background: rgb(17 17 19 / 70%);
		border: 1px solid rgb(63 63 70 / 50%);
		border-radius: 6px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 12px;
		color: #fafafa;
		white-space: nowrap;
		cursor: pointer;
		transition: all 0.2s ease;
		backdrop-filter: blur(8px);
	}

	.tech-label:hover,
	.tech-label.hovered {
		border-color: var(--color);
		box-shadow: 0 0 15px color-mix(in srgb, var(--color) 40%, transparent);
		transform: scale(1.1);
	}

	.tech-label :global(svg) {
		color: var(--color);
	}

	.label-text {
		color: #a1a1aa;
	}

	.tech-label:hover .label-text,
	.tech-label.hovered .label-text {
		color: #fafafa;
	}
</style>
