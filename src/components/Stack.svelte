<script lang="ts">
	import { Canvas } from '@threlte/core';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';

	import TechSphere from './three/TechSphere.svelte';

	gsap.registerPlugin(ScrollTrigger);

	const allItems = [
		// Languages
		{ name: 'TypeScript', icon: 'simple-icons:typescript', category: 'Languages' },
		{ name: 'Python', icon: 'simple-icons:python', category: 'Languages' },
		{ name: 'Rust', icon: 'simple-icons:rust', category: 'Languages' },
		{ name: 'Go', icon: 'simple-icons:go', category: 'Languages' },
		{ name: 'Kotlin', icon: 'simple-icons:kotlin', category: 'Languages' },
		// Frontend
		{ name: 'Svelte', icon: 'simple-icons:svelte', category: 'Frontend' },
		{ name: 'Astro', icon: 'simple-icons:astro', category: 'Frontend' },
		{ name: 'React', icon: 'simple-icons:react', category: 'Frontend' },
		// Backend
		{ name: 'Axum', icon: 'simple-icons:rust', category: 'Backend' },
		{ name: 'Actix', icon: 'simple-icons:actix', category: 'Backend' },
		{ name: 'Ktor', icon: 'simple-icons:ktor', category: 'Backend' },
		{ name: 'NestJS', icon: 'simple-icons:nestjs', category: 'Backend' },
		{ name: 'FastAPI', icon: 'simple-icons:fastapi', category: 'Backend' },
		// Infrastructure
		{ name: 'Docker', icon: 'simple-icons:docker', category: 'Infrastructure' },
		{ name: 'Dokploy', icon: 'simple-icons:docker', category: 'Infrastructure' },
		{ name: 'MongoDB', icon: 'simple-icons:mongodb', category: 'Infrastructure' },
		{ name: 'PostgreSQL', icon: 'simple-icons:postgresql', category: 'Infrastructure' },
		{ name: 'Redis', icon: 'simple-icons:redis', category: 'Infrastructure' }
	];

	let sectionRef: HTMLElement | undefined = $state();
	let mounted = $state(false);

	onMount(() => {
		mounted = true;

		gsap.from('.stack-header', {
			scrollTrigger: {
				trigger: sectionRef,
				start: 'top 70%'
			},
			y: 30,
			opacity: 0,
			duration: 0.8,
			ease: 'power3.out'
		});

		gsap.from('.stack-canvas', {
			scrollTrigger: {
				trigger: sectionRef,
				start: 'top 60%'
			},
			scale: 0.8,
			opacity: 0,
			duration: 1,
			ease: 'power3.out'
		});

		return () => {
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	});
</script>

<section id="stack" class="stack" bind:this={sectionRef}>
	<div class="container">
		<div class="stack-header">
			<h2 class="stack-title">
				<span class="title-comment">// </span>Stack Agnostic
			</h2>
			<p class="stack-subtitle">
				우리가 쓰는 게 아니라, 우리가 <em>쓸 수 있는</em> 것들
			</p>
		</div>

		<div class="stack-canvas">
			{#if mounted}
				<Canvas>
					<TechSphere items={allItems} />
				</Canvas>
			{/if}
		</div>

		<p class="stack-footnote">
			<span class="footnote-icon">*</span>
			이 목록은 고정되지 않습니다. 필요하면 배웁니다.
		</p>
	</div>
</section>

<style lang="scss">
	@use '../styles/variables' as *;

	.stack {
		min-height: 100vh;
		padding: $space-24 0;
		background: $bg-base;

		@media (max-width: $breakpoint-md) {
			padding: $space-16 0;
		}
	}

	.stack-header {
		text-align: center;
		margin-bottom: $space-8;
	}

	.stack-title {
		font-family: $font-mono;
		font-size: $text-4xl;
		font-weight: 700;
		margin-bottom: $space-4;

		@media (max-width: $breakpoint-md) {
			font-size: $text-3xl;
		}
	}

	.title-comment {
		color: $text-muted;
	}

	.stack-subtitle {
		font-size: $text-lg;
		color: $text-secondary;

		em {
			color: $accent;
			font-style: normal;
			font-weight: 500;
		}
	}

	.stack-canvas {
		width: 100%;
		height: 500px;
		margin: 0 auto;

		@media (max-width: $breakpoint-md) {
			height: 400px;
		}
	}

	.stack-footnote {
		text-align: center;
		margin-top: $space-8;
		font-family: $font-mono;
		font-size: $text-sm;
		color: $text-muted;
	}

	.footnote-icon {
		color: $accent;
		margin-right: $space-1;
	}
</style>
