<script lang="ts">
	import Icon from '@iconify/svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount, tick } from 'svelte';

	import type { Generation } from '../types/members.ts';

	gsap.registerPlugin(ScrollTrigger);

	interface Props {
		generations: Generation[];
	}

	let { generations }: Props = $props();

	const roleColors: Record<string, string> = {
		동아리장: '#f59e0b',
		부동아리장: '#3b82f6'
	};

	let activeGen = $state(0);
	let carouselRef: HTMLElement | undefined = $state();
	let sectionRef: HTMLElement | undefined = $state();
	let autoplayTimer: ReturnType<typeof setInterval> | undefined;
	let isHovered = $state(false);
	let currentIndex = $state(0);

	const AUTOPLAY_INTERVAL = 3000;

	$effect(() => {
		activeGen = 0;
		currentIndex = 0;
		scrollToIndex(0);
	});

	function getInitials(name: string): string {
		return name.slice(0, 1);
	}

	function getRoleColor(role: string): string {
		return roleColors[role] ?? '#a1a1aa';
	}

	function scrollToIndex(index: number) {
		if (!carouselRef) return;
		const cards = carouselRef.querySelectorAll('.member-card');
		if (!cards[index]) return;

		const card = cards[index] as HTMLElement;
		const trackRect = carouselRef.getBoundingClientRect();
		const cardRect = card.getBoundingClientRect();

		const scrollOffset = carouselRef.scrollLeft + cardRect.left - trackRect.left - (trackRect.width - cardRect.width) / 2;

		carouselRef.scrollTo({ left: scrollOffset, behavior: 'smooth' });
	}

	function next() {
		const members = generations[activeGen].members;
		currentIndex = (currentIndex + 1) % members.length;
		scrollToIndex(currentIndex);
		resetAutoplay();
	}

	function prev() {
		const members = generations[activeGen].members;
		currentIndex = (currentIndex - 1 + members.length) % members.length;
		scrollToIndex(currentIndex);
		resetAutoplay();
	}

	function goTo(index: number) {
		currentIndex = index;
		scrollToIndex(index);
		resetAutoplay();
	}

	function startAutoplay() {
		stopAutoplay();
		autoplayTimer = setInterval(() => {
			if (!isHovered) {
				const members = generations[activeGen].members;
				currentIndex = (currentIndex + 1) % members.length;
				scrollToIndex(currentIndex);
			}
		}, AUTOPLAY_INTERVAL);
	}

	function stopAutoplay() {
		if (autoplayTimer) {
			clearInterval(autoplayTimer);
			autoplayTimer = undefined;
		}
	}

	function resetAutoplay() {
		stopAutoplay();
		startAutoplay();
	}

	async function handleTabSwitch(index: number) {
		activeGen = index;
		currentIndex = 0;

		await tick();

		if (carouselRef) {
			gsap.killTweensOf(carouselRef.querySelectorAll('.member-card'));

			gsap.from(carouselRef.querySelectorAll('.member-card'), {
				y: 20,
				opacity: 0,
				duration: 0.4,
				stagger: 0.08,
				ease: 'power2.out',
				clearProps: 'all'
			});
		}

		scrollToIndex(0);
		resetAutoplay();
	}

	onMount(() => {
		gsap.from('.members-header', {
			scrollTrigger: {
				trigger: sectionRef,
				start: 'top 70%'
			},
			y: 30,
			opacity: 0,
			duration: 0.8,
			ease: 'power3.out'
		});

		gsap.from('.members-terminal', {
			scrollTrigger: {
				trigger: sectionRef,
				start: 'top 60%'
			},
			y: 40,
			opacity: 0,
			duration: 0.8,
			delay: 0.2,
			ease: 'power2.out'
		});

		gsap.from('.carousel-wrapper', {
			scrollTrigger: {
				trigger: sectionRef,
				start: 'top 50%'
			},
			y: 40,
			opacity: 0,
			duration: 0.8,
			delay: 0.4,
			ease: 'power2.out'
		});

		startAutoplay();

		return () => {
			stopAutoplay();
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	});
</script>

<section id="members" class="members" bind:this={sectionRef}>
	<div class="container">
		<div class="members-header">
			<h2 class="members-title">
				<span class="title-bracket">[</span>
				Members
				<span class="title-bracket">]</span>
			</h2>
			<p class="members-subtitle">함께 만들어가는 사람들</p>
		</div>

		<div class="members-terminal">
			<div class="terminal-header">
				<div class="terminal-buttons">
					<span class="btn-close"></span>
					<span class="btn-minimize"></span>
					<span class="btn-maximize"></span>
				</div>
				<div class="terminal-tabs">
					{#each generations as gen, i (gen.label)}
						<button class="terminal-tab" class:active={activeGen === i} onclick={() => handleTabSwitch(i)}>
							<span class="tab-prompt">~</span>
							<span class="tab-label">{gen.label}</span>
							<span class="tab-year">{gen.year}</span>
						</button>
					{/each}
				</div>
				<div class="terminal-spacer"></div>
			</div>

			<div class="terminal-body">
				<div class="terminal-info">
					<span class="info-prompt">$</span>
					<span class="info-command">ls members/{generations[activeGen].label}/</span>
					<span class="info-count">— {generations[activeGen].members.length}명</span>
				</div>
			</div>
		</div>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="carousel-wrapper" onmouseenter={() => (isHovered = true)} onmouseleave={() => (isHovered = false)}>
			<button class="carousel-btn carousel-btn-prev" onclick={prev}>
				<Icon icon="mdi:chevron-left" width={24} height={24} />
			</button>

			<div class="carousel-track" bind:this={carouselRef}>
				{#each generations[activeGen].members as member, i (member.name)}
					<div class="member-card" class:active={currentIndex === i}>
						<div class="card-image">
							{#if member.image}
								<img
									src={member.image}
									alt={member.name}
									class="avatar-img"
									loading="lazy"
									onerror={(e) => {
										const target = e.currentTarget as HTMLImageElement;
										target.style.display = 'none';
										const fallback = target.nextElementSibling as HTMLElement;
										if (fallback) fallback.style.display = 'flex';
									}} />
								<div class="avatar-fallback" style="display: none;">
									<span class="avatar-initial">{getInitials(member.name)}</span>
								</div>
							{:else}
								<div class="avatar-fallback">
									<span class="avatar-initial">{getInitials(member.name)}</span>
								</div>
							{/if}
							<div class="card-glow"></div>
						</div>

						<div class="card-body">
							<span
								class="card-role"
								style="--role-color: {getRoleColor(member.role)};">
								{member.role}
							</span>
							<h3 class="card-name">{member.name}</h3>
							<p class="card-description">{member.description}</p>
						</div>

						<div class="card-index">
							<span class="index-number">{String(i).padStart(2, '0')}</span>
						</div>
					</div>
				{/each}
			</div>

			<button class="carousel-btn carousel-btn-next" onclick={next}>
				<Icon icon="mdi:chevron-right" width={24} height={24} />
			</button>
		</div>

		<div class="carousel-indicators">
			{#each { length: generations[activeGen].members.length }, i}
				<button class="indicator" class:active={currentIndex === i} onclick={() => goTo(i)}> </button>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	@use '../styles/variables' as *;
	@use '../styles/mixins' as *;

	.members {
		min-height: 100vh;
		padding: $space-24 0;
		background: $bg-surface;

		@media (max-width: $breakpoint-md) {
			padding: $space-16 0;
		}
	}

	.members-header {
		text-align: center;
		margin-bottom: $space-8;
	}

	.members-title {
		font-family: $font-mono;
		font-size: $text-4xl;
		font-weight: 700;
		margin-bottom: $space-4;

		@media (max-width: $breakpoint-md) {
			font-size: $text-3xl;
		}
	}

	.title-bracket {
		color: $accent;
		opacity: 0.7;
	}

	.members-subtitle {
		font-size: $text-lg;
		color: $text-secondary;
	}

	.members-terminal {
		max-width: 700px;
		margin: 0 auto $space-10;
		background: $bg-base;
		border: 1px solid $border-subtle;
		border-radius: $radius-lg;
		overflow: hidden;
	}

	.terminal-header {
		display: flex;
		align-items: center;
		background: $bg-elevated;
		border-bottom: 1px solid $border-subtle;
	}

	.terminal-buttons {
		display: flex;
		gap: $space-2;
		padding: $space-3 $space-4;

		span {
			width: 12px;
			height: 12px;
			border-radius: 50%;
		}
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

	.terminal-tabs {
		display: flex;
		gap: 0;
		flex: 1;
	}

	.terminal-tab {
		display: flex;
		align-items: center;
		gap: $space-2;
		padding: $space-3 $space-5;
		font-family: $font-mono;
		font-size: $text-sm;
		color: $text-muted;
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		cursor: pointer;
		transition: all $duration-normal $ease-out;
		position: relative;

		&:hover {
			color: $text-secondary;
			background: rgb(255 255 255 / 3%);
		}

		&.active {
			color: $text-primary;
			background: $bg-base;
			border-bottom-color: $accent;

			.tab-prompt {
				color: $accent;
			}
		}
	}

	.tab-prompt {
		color: $text-muted;
		font-weight: 600;
	}

	.tab-label {
		font-weight: 600;
	}

	.tab-year {
		font-size: $text-xs;
		color: $text-muted;
		opacity: 0.6;
	}

	.terminal-spacer {
		flex: 1;
	}

	.terminal-body {
		padding: $space-3 $space-4;
	}

	.terminal-info {
		display: flex;
		align-items: center;
		gap: $space-2;
		font-family: $font-mono;
		font-size: $text-sm;
	}

	.info-prompt {
		color: $accent;
		font-weight: 600;
	}

	.info-command {
		color: $text-primary;
	}

	.info-count {
		color: $text-muted;
		margin-left: $space-2;
	}

	.carousel-wrapper {
		position: relative;
		max-width: 1000px;
		margin: 0 auto;
		padding: 0 $space-12;

		@media (max-width: $breakpoint-md) {
			padding: 0 $space-8;
		}
	}

	.carousel-track {
		display: flex;
		gap: $space-6;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		scrollbar-width: none;
		padding: $space-4 $space-2;

		&::-webkit-scrollbar {
			display: none;
		}

		@media (max-width: $breakpoint-sm) {
			gap: $space-4;
		}
	}

	.carousel-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: $bg-elevated;
		border: 1px solid $border-subtle;
		border-radius: $radius-md;
		color: $text-secondary;
		cursor: pointer;
		transition: all $duration-normal $ease-out;

		&:hover {
			background: $bg-hover;
			border-color: $accent;
			color: $accent;
			box-shadow: $shadow-glow;
		}

		@media (max-width: $breakpoint-sm) {
			width: 32px;
			height: 32px;
		}
	}

	.carousel-btn-prev {
		left: 0;
	}

	.carousel-btn-next {
		right: 0;
	}

	.member-card {
		flex: 0 0 220px;
		scroll-snap-align: center;
		background: $bg-base;
		border: 1px solid $border-subtle;
		border-radius: $radius-lg;
		overflow: hidden;
		transition: all $duration-normal $ease-out;
		position: relative;

		&:hover,
		&.active {
			border-color: rgb(59 130 246 / 40%);
			transform: translateY(-4px);
			box-shadow:
					0 8px 32px rgb(0 0 0 / 40%),
					0 0 20px rgb(59 130 246 / 10%);
		}

		@media (max-width: $breakpoint-sm) {
			flex: 0 0 180px;
		}
	}

	.card-image {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 180px;
		background: $bg-elevated;
		overflow: hidden;

		@media (max-width: $breakpoint-sm) {
			height: 150px;
		}
	}

	.avatar-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar-fallback {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		background: $accent-muted;
		border: 2px solid rgb(59 130 246 / 30%);
		border-radius: 50%;
	}

	.avatar-initial {
		font-family: $font-mono;
		font-size: $text-2xl;
		font-weight: 700;
		color: $accent;
	}

	.card-glow {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 60px;
		background: linear-gradient(to top, $bg-base, transparent);
		pointer-events: none;
	}

	.card-body {
		padding: $space-4;
	}

	.card-role {
		display: inline-block;
		font-family: $font-mono;
		font-size: $text-xs;
		font-weight: 600;
		color: var(--role-color);
		background: color-mix(in srgb, var(--role-color) 12%, transparent);
		padding: 2px $space-2;
		border-radius: $radius-sm;
		margin-bottom: $space-2;
		letter-spacing: 0.02em;
	}

	.card-name {
		font-family: $font-sans;
		font-size: $text-base;
		font-weight: 600;
		color: $text-primary;
		margin-bottom: $space-1;
	}

	.card-description {
		font-family: $font-mono;
		font-size: $text-xs;
		color: $text-muted;
		line-height: $leading-relaxed;
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.card-index {
		position: absolute;
		top: $space-3;
		right: $space-3;
		pointer-events: none;
	}

	.index-number {
		font-family: $font-mono;
		font-size: $text-xs;
		color: $text-muted;
		opacity: 0.4;
	}

	.carousel-indicators {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: $space-2;
		margin-top: $space-6;
	}

	.indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: $border-subtle;
		border: none;
		cursor: pointer;
		transition: all $duration-normal $ease-out;
		padding: 0;

		&:hover {
			background: $text-muted;
		}

		&.active {
			background: $accent;
			width: 24px;
			border-radius: 4px;
			box-shadow: 0 0 8px $accent-glow;
		}
	}
</style>
