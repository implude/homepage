<script lang="ts">
	import Icon from '@iconify/svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';

	gsap.registerPlugin(ScrollTrigger);

	const stages = [
		{
			icon: 'mdi:git',
			label: 'Git',
			description: 'push'
		},
		{
			icon: 'simple-icons:githubactions',
			label: 'GitHub Actions',
			description: 'lint & test'
		},
		{
			icon: 'simple-icons:docker',
			label: 'Dokploy',
			description: 'build & deploy'
		},
		{
			icon: 'mdi:earth',
			label: 'Live',
			description: 'production'
		}
	];

	let sectionRef: HTMLElement | undefined = $state();
	let pipelineRef: HTMLElement | undefined = $state();
	let stageRefs: HTMLElement[] = $state([]);
	let connectorRefs: HTMLElement[] = $state([]);

	onMount(() => {
		gsap.from('.pipeline-header', {
			scrollTrigger: {
				trigger: sectionRef,
				start: 'top 70%'
			},
			y: 30,
			opacity: 0,
			duration: 0.8,
			ease: 'power3.out'
		});

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: pipelineRef,
				start: 'top 65%',
				toggleActions: 'play none none none'
			}
		});

		stageRefs.forEach((ref, i) => {
			if (ref) {
				tl.from(
					ref,
					{
						scale: 0.5,
						opacity: 0,
						duration: 0.4,
						ease: 'back.out(1.7)'
					},
					i * 0.3
				);

				tl.to(
					ref,
					{
						'--glow-opacity': 1,
						duration: 0.3
					},
					i * 0.3 + 0.2
				);

				if (connectorRefs[i]) {
					tl.from(
						connectorRefs[i],
						{
							scaleX: 0,
							opacity: 0,
							duration: 0.3,
							ease: 'power2.out'
						},
						i * 0.3 + 0.3
					);

					tl.to(
						connectorRefs[i],
						{
							'--flow-position': '100%',
							duration: 0.4,
							ease: 'none'
						},
						i * 0.3 + 0.4
					);
				}
			}
		});

		gsap.from('.log-line', {
			scrollTrigger: {
				trigger: '.pipeline-terminal',
				start: 'top 80%'
			},
			x: -20,
			opacity: 0,
			duration: 0.3,
			stagger: 0.15,
			ease: 'power2.out'
		});

		return () => {
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	});
</script>

<section id="deploy" class="deploy" bind:this={sectionRef}>
	<div class="container">
		<div class="pipeline-header">
			<h2 class="pipeline-title">
				<span class="title-symbol">$</span> Deploy Pipeline
			</h2>
			<p class="pipeline-subtitle">코드부터 프로덕션까지, 자동화된 배포</p>
		</div>

		<div class="pipeline-wrapper" bind:this={pipelineRef}>
			<div class="pipeline">
				{#each stages as stage, i (stage.label)}
					<div class="stage" bind:this={stageRefs[i]}>
						<div class="stage-icon-wrapper">
							<Icon icon={stage.icon} class="stage-icon" />
						</div>
						<span class="stage-label">{stage.label}</span>
						<span class="stage-description">{stage.description}</span>
					</div>

					{#if i < stages.length - 1}
						<div class="connector" bind:this={connectorRefs[i]}>
							<div class="connector-line"></div>
							<div class="connector-flow"></div>
							<Icon icon="mdi:chevron-right" class="connector-arrow" />
						</div>
					{/if}
				{/each}
			</div>
		</div>

		<div class="pipeline-terminal">
			<div class="terminal-header">
				<div class="terminal-buttons">
					<span class="btn-close"></span>
					<span class="btn-minimize"></span>
					<span class="btn-maximize"></span>
				</div>
				<span class="terminal-title">deploy.log</span>
				<div class="terminal-spacer"></div>
			</div>

			<div class="terminal-body">
				<div class="log-line">
					<span class="log-time">[00:01]</span>
					<span class="log-status success">✓</span>
					<span class="log-message">Pushed to main branch</span>
				</div>
				<div class="log-line">
					<span class="log-time">[00:02]</span>
					<span class="log-status success">✓</span>
					<span class="log-message">GitHub Actions triggered</span>
				</div>
				<div class="log-line">
					<span class="log-time">[00:04]</span>
					<span class="log-status success">✓</span>
					<span class="log-message">ESLint passed, no warnings</span>
				</div>
				<div class="log-line">
					<span class="log-time">[00:08]</span>
					<span class="log-status success">✓</span>
					<span class="log-message">All tests passed (42 specs)</span>
				</div>
				<div class="log-line">
					<span class="log-time">[00:10]</span>
					<span class="log-status success">✓</span>
					<span class="log-message">Dokploy webhook received</span>
				</div>
				<div class="log-line">
					<span class="log-time">[00:25]</span>
					<span class="log-status success">✓</span>
					<span class="log-message">Docker image built & deployed</span>
				</div>
				<div class="log-line">
					<span class="log-time">[00:26]</span>
					<span class="log-status live">●</span>
					<span class="log-message">Live at <span class="log-url">https://implude.kr</span></span>
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	@use '../styles/variables' as *;

	.deploy {
		min-height: 100vh;
		padding: $space-24 0;
		background: $bg-base;

		@media (max-width: $breakpoint-md) {
			padding: $space-16 0;
		}
	}

	.pipeline-header {
		text-align: center;
		margin-bottom: $space-16;
	}

	.pipeline-title {
		font-family: $font-mono;
		font-size: $text-4xl;
		font-weight: 700;
		margin-bottom: $space-4;

		@media (max-width: $breakpoint-md) {
			font-size: $text-3xl;
		}
	}

	.title-symbol {
		color: $accent;
	}

	.pipeline-subtitle {
		font-size: $text-lg;
		color: $text-secondary;
	}

	.pipeline-wrapper {
		margin-bottom: $space-12;
		overflow-x: auto;
		padding: $space-4 0;

		&::-webkit-scrollbar {
			height: 4px;
		}

		&::-webkit-scrollbar-track {
			background: $bg-elevated;
			border-radius: 2px;
		}

		&::-webkit-scrollbar-thumb {
			background: $border-default;
			border-radius: 2px;
		}
	}

	.pipeline {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		min-width: max-content;
		padding: $space-8 $space-4;

		@media (max-width: $breakpoint-md) {
			justify-content: flex-start;
		}
	}

	.stage {
		--glow-opacity: 0;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $space-2;
		position: relative;
	}

	.stage-icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 72px;
		height: 72px;
		background: $bg-surface;
		border: 2px solid $border-subtle;
		border-radius: $radius-lg;
		position: relative;
		transition: all $duration-normal $ease-out;

		&::after {
			content: '';
			position: absolute;
			inset: -4px;
			border-radius: calc($radius-lg + 4px);
			background: $accent;
			opacity: var(--glow-opacity);
			filter: blur(12px);
			z-index: -1;
			transition: opacity $duration-normal $ease-out;
		}

		.stage:hover & {
			border-color: $accent;
			transform: translateY(-4px);

			&::after {
				opacity: 0.4;
			}
		}
	}

	:global(.stage-icon) {
		width: 32px;
		height: 32px;
		color: $text-secondary;
		transition: color $duration-normal $ease-out;

		.stage:hover & {
			color: $accent;
		}
	}

	.stage-label {
		font-family: $font-mono;
		font-size: $text-sm;
		font-weight: 600;
		color: $text-primary;
	}

	.stage-description {
		font-family: $font-mono;
		font-size: $text-xs;
		color: $text-muted;
	}

	.connector {
		display: flex;
		align-items: center;
		width: 80px;
		height: 2px;
		position: relative;
		margin: 0 $space-2 40px;

		@media (max-width: $breakpoint-md) {
			width: 50px;
		}
	}

	.connector-line {
		position: absolute;
		inset: 0;
		background: $border-subtle;
		border-radius: 1px;
	}

	.connector-flow {
		--flow-position: 0%;

		position: absolute;
		top: 0;
		left: 0;
		width: 30%;
		height: 100%;
		background: linear-gradient(90deg, transparent, $accent, transparent);
		border-radius: 1px;
		transform: translateX(var(--flow-position));
		opacity: 0.8;
	}

	:global(.connector-arrow) {
		position: absolute;
		right: -4px;
		width: 16px;
		height: 16px;
		color: $accent;
	}

	.pipeline-terminal {
		max-width: 600px;
		margin: 0 auto;
		background: $bg-surface;
		border: 1px solid $border-subtle;
		border-radius: $radius-lg;
		overflow: hidden;
	}

	.terminal-header {
		display: flex;
		align-items: center;
		padding: $space-3 $space-4;
		background: $bg-elevated;
		border-bottom: 1px solid $border-subtle;
	}

	.terminal-buttons {
		display: flex;
		gap: $space-2;
	}

	.terminal-buttons span {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.btn-close {
		background: #ff5f57;
	}

	.btn-minimize {
		background: #ffbd2e;
	}

	.btn-maximize {
		background: #28ca41;
	}

	.terminal-title {
		flex: 1;
		text-align: center;
		font-family: $font-mono;
		font-size: $text-sm;
		color: $text-muted;
	}

	.terminal-spacer {
		width: 52px;
	}

	.terminal-body {
		padding: $space-4;
		font-family: $font-mono;
		font-size: $text-sm;
	}

	.log-line {
		display: flex;
		align-items: center;
		gap: $space-3;
		padding: $space-2 0;
		border-bottom: 1px solid $border-subtle;

		&:last-child {
			border-bottom: none;
		}
	}

	.log-time {
		color: $text-muted;
		font-size: $text-xs;
	}

	.log-status {
		font-size: $text-sm;

		&.success {
			color: #4ade80;
		}

		&.live {
			color: #4ade80;
			animation: pulse 2s infinite;
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}

		50% {
			opacity: 0.4;
		}
	}

	.log-message {
		color: $text-secondary;
		flex: 1;
	}

	.log-url {
		color: $accent;
		text-decoration: underline;
		text-underline-offset: 2px;
	}
</style>
