<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { T } from '@threlte/core';
	import gsap from 'gsap';
	import { onMount } from 'svelte';

	import ParticleField from './three/ParticleField.svelte';

	let headline: HTMLElement | undefined = $state();
	let scrollIndicator: HTMLElement | undefined = $state();
	let mounted = $state(false);

	const tagline = 'We write code that matters.';
	let displayedTagline = $state('');

	onMount(() => {
		mounted = true;

		const tl = gsap.timeline({ delay: 0.5 });

		if (headline) {
			tl.from(headline, {
				y: 30,
				opacity: 0,
				duration: 0.8,
				ease: 'power3.out'
			});
		}

		const typeObj = { progress: 0 };
		tl.to(
			typeObj,
			{
				progress: 1,
				duration: tagline.length * 0.05,
				onUpdate: () => {
					const chars = Math.floor(typeObj.progress * tagline.length);
					displayedTagline = tagline.slice(0, chars);
				}
			},
			'-=0.3'
		);

		if (scrollIndicator) {
			tl.from(
				scrollIndicator,
				{
					y: -20,
					opacity: 0,
					duration: 0.6,
					ease: 'power2.out'
				},
				'-=0.2'
			);

			gsap.to(scrollIndicator, {
				y: 8,
				repeat: -1,
				yoyo: true,
				duration: 1.2,
				ease: 'power1.inOut'
			});
		}
	});
</script>

<section class="hero">
	<div class="hero-bg">
		{#if mounted}
			<Canvas>
				<T.PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
				<T.AmbientLight intensity={0.5} />
				<ParticleField />
			</Canvas>
		{/if}
	</div>

	<div class="hero-content">
		<h1 bind:this={headline} class="hero-title">
			<span class="title-bracket">&lt;</span>IMPLUDE<span class="title-bracket">/&gt;</span>
		</h1>

		<p class="hero-tagline">
			<span class="tagline-text">{displayedTagline}</span>
			<span class="cursor">_</span>
		</p>

		<div class="hero-meta">
			<span class="meta-item">
				<span class="meta-label">stack:</span> agnostic
			</span>
			<span class="meta-divider">//</span>
			<span class="meta-item">
				<span class="meta-label">focus:</span> quality
			</span>
			<span class="meta-divider">//</span>
			<span class="meta-item">
				<span class="meta-label">deploy:</span> docker
			</span>
		</div>
	</div>

	<div bind:this={scrollIndicator} class="scroll-indicator">
		<span class="scroll-text">scroll</span>
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<path d="M10 4L10 16M10 16L5 11M10 16L15 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</div>
</section>

<style lang="scss">
	@use '../styles/variables' as *;
	@use '../styles/mixins' as *;

	.hero {
		position: relative;
		height: 100vh;
		min-height: 600px;

		@include flex-center;

		flex-direction: column;
		overflow: hidden;
	}

	.hero-bg {
		position: absolute;
		inset: 0;
		z-index: 0;
		opacity: 0.7;

		:global(canvas) {
			width: 100% !important;
			height: 100% !important;
		}
	}

	.hero-content {
		position: relative;
		z-index: 1;
		text-align: center;
		padding: $space-6;
	}

	.hero-title {
		font-family: $font-mono;
		font-size: clamp(3rem, 10vw, 6rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		margin-bottom: $space-6;
	}

	.title-bracket {
		color: $accent;
		opacity: 0.7;
	}

	.hero-tagline {
		font-family: $font-mono;
		font-size: clamp(1.125rem, 3vw, 1.5rem);
		color: $text-secondary;
		margin-bottom: $space-8;
		min-height: 1.5em;
	}

	.tagline-text {
		color: $text-primary;
	}

	.cursor {
		color: $accent;
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}

		51%,
		100% {
			opacity: 0;
		}
	}

	.hero-meta {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: $space-4;
		font-family: $font-mono;
		font-size: $text-sm;
		color: $text-muted;
		flex-wrap: wrap;

		@include respond-below($breakpoint-md) {
			flex-direction: column;
			gap: $space-2;

			.meta-divider {
				display: none;
			}
		}
	}

	.meta-label {
		color: $text-secondary;
	}

	.meta-divider {
		color: $border-default;
	}

	.scroll-indicator {
		position: absolute;
		bottom: $space-8;
		left: 50%;
		transform: translateX(-50%);

		@include flex-center;

		flex-direction: column;
		gap: $space-2;
		color: $text-muted;
		font-family: $font-mono;
		font-size: $text-xs;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.scroll-text {
		opacity: 0.6;
	}
</style>
