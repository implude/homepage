<script lang="ts">
	import Icon from '@iconify/svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';

	gsap.registerPlugin(ScrollTrigger);

	const badCode = `function getData() {
  var d = fetch(url).then(r => r.json())
  return d
}`;

	const goodCode = `async function fetchUserData(
  userId: string
): Promise<User> {
  const response = await api.get(\`/users/\${userId}\`)
  return userSchema.parse(response.data)
}`;

	const principles = [
		{
			icon: 'mdi:shield-check',
			title: 'Type Safety',
			description: '런타임 에러보다 컴파일 타임에'
		},
		{
			icon: 'mdi:book-open-page-variant',
			title: 'Readability',
			description: '6개월 후의 나도 읽을 수 있게'
		},
		{
			icon: 'mdi:test-tube',
			title: 'Testing',
			description: '믿을 수 있는 코드'
		},
		{
			icon: 'mdi:account-group',
			title: 'Review Culture',
			description: '혼자 짜는 코드는 없다'
		}
	];

	let sectionRef: HTMLElement | undefined = $state();
	let diffRef: HTMLElement | undefined = $state();
	let principleRefs: HTMLElement[] = $state([]);

	onMount(() => {
		gsap.from('.quality-header', {
			scrollTrigger: {
				trigger: sectionRef,
				start: 'top 70%'
			},
			y: 30,
			opacity: 0,
			duration: 0.8,
			ease: 'power3.out'
		});

		if (diffRef) {
			gsap.from(diffRef, {
				scrollTrigger: {
					trigger: diffRef,
					start: 'top 75%'
				},
				y: 40,
				opacity: 0,
				duration: 0.8,
				ease: 'power2.out'
			});

			gsap.from(diffRef.querySelectorAll('.diff-line'), {
				scrollTrigger: {
					trigger: diffRef,
					start: 'top 75%'
				},
				x: -20,
				opacity: 0,
				duration: 0.4,
				stagger: 0.08,
				delay: 0.3,
				ease: 'power2.out'
			});
		}

		principleRefs.forEach((ref, i) => {
			if (ref) {
				gsap.from(ref, {
					scrollTrigger: {
						trigger: ref,
						start: 'top 85%'
					},
					y: 30,
					opacity: 0,
					duration: 0.5,
					delay: i * 0.1,
					ease: 'power2.out'
				});
			}
		});

		return () => {
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	});
</script>

<section id="quality" class="quality" bind:this={sectionRef}>
	<div class="container">
		<div class="quality-header">
			<h2 class="quality-title">
				<span class="title-bracket">{`{`}</span>
				Code Quality
				<span class="title-bracket">}</span>
			</h2>
			<p class="quality-subtitle">동작하는 코드가 아닌, 좋은 코드를 추구합니다</p>
		</div>

		<div class="diff-container" bind:this={diffRef}>
			<div class="diff-header">
				<Icon icon="mdi:file-document-edit" class="diff-icon" />
				<span class="diff-filename">code_review.diff</span>
			</div>

			<div class="diff-body">
				<div class="diff-section diff-removed">
					<div class="diff-label">
						<Icon icon="mdi:minus-circle" class="label-icon removed" />
						<span>Before</span>
					</div>
					{#each badCode.split('\n') as line, i (line)}
						<div class="diff-line removed">
							<span class="line-number">{i + 1}</span>
							<span class="line-prefix">-</span>
							<code class="line-content">{line}</code>
						</div>
					{/each}
				</div>

				<div class="diff-divider">
					<Icon icon="mdi:arrow-down" class="divider-icon" />
				</div>

				<div class="diff-section diff-added">
					<div class="diff-label">
						<Icon icon="mdi:plus-circle" class="label-icon added" />
						<span>After</span>
					</div>
					{#each goodCode.split('\n') as line, i (line)}
						<div class="diff-line added">
							<span class="line-number">{i + 1}</span>
							<span class="line-prefix">+</span>
							<code class="line-content">{line}</code>
						</div>
					{/each}
				</div>
			</div>

			<div class="diff-footer">
				<Icon icon="mdi:arrow-up" class="footer-icon" />
				<span>이런 변화를 추구합니다</span>
			</div>
		</div>

		<div class="principles-grid">
			{#each principles as principle, i (principle.title)}
				<div class="principle-card" bind:this={principleRefs[i]}>
					<div class="principle-icon-wrapper">
						<Icon icon={principle.icon} class="principle-icon" />
					</div>
					<h3 class="principle-title">{principle.title}</h3>
					<p class="principle-description">{principle.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	@use '../styles/variables' as *;

	.quality {
		min-height: 100vh;
		padding: $space-24 0;
		background: $bg-surface;

		@media (max-width: $breakpoint-md) {
			padding: $space-16 0;
		}
	}

	.quality-header {
		text-align: center;
		margin-bottom: $space-12;
	}

	.quality-title {
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

	.quality-subtitle {
		font-size: $text-lg;
		color: $text-secondary;
	}

	.diff-container {
		max-width: 700px;
		margin: 0 auto $space-12;
		background: $bg-base;
		border: 1px solid $border-subtle;
		border-radius: $radius-lg;
		overflow: hidden;
	}

	.diff-header {
		display: flex;
		align-items: center;
		gap: $space-2;
		padding: $space-3 $space-4;
		background: $bg-elevated;
		border-bottom: 1px solid $border-subtle;
	}

	:global(.diff-icon) {
		width: 16px;
		height: 16px;
		color: $text-muted;
	}

	.diff-filename {
		font-family: $font-mono;
		font-size: $text-sm;
		color: $text-secondary;
	}

	.diff-body {
		padding: $space-4;
	}

	.diff-section {
		margin-bottom: $space-4;

		&:last-of-type {
			margin-bottom: 0;
		}
	}

	.diff-label {
		display: flex;
		align-items: center;
		gap: $space-2;
		margin-bottom: $space-2;
		font-family: $font-mono;
		font-size: $text-xs;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: $text-muted;
	}

	:global(.label-icon) {
		width: 14px;
		height: 14px;
	}

	:global(.label-icon.removed) {
		color: #f87171;
	}

	:global(.label-icon.added) {
		color: #4ade80;
	}

	.diff-line {
		display: flex;
		align-items: flex-start;
		font-family: $font-mono;
		font-size: $text-sm;
		line-height: 1.6;
		padding: $space-1 $space-2;
		border-radius: $radius-sm;
		margin-bottom: 2px;

		&.removed {
			background: rgb(248 113 113 / 10%);

			.line-prefix {
				color: #f87171;
			}

			.line-content {
				color: $text-secondary;
				text-decoration: line-through;
				text-decoration-color: rgb(248 113 113 / 50%);
			}
		}

		&.added {
			background: rgb(74 222 128 / 10%);

			.line-prefix {
				color: #4ade80;
			}

			.line-content {
				color: $text-primary;
			}
		}
	}

	.line-number {
		width: 24px;
		color: $text-muted;
		text-align: right;
		margin-right: $space-2;
		user-select: none;
	}

	.line-prefix {
		width: 16px;
		font-weight: 600;
		user-select: none;
	}

	.line-content {
		flex: 1;
		white-space: pre;
	}

	.diff-divider {
		display: flex;
		justify-content: center;
		padding: $space-2 0;
	}

	:global(.divider-icon) {
		width: 20px;
		height: 20px;
		color: $accent;
		animation: bounce 2s infinite;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(4px);
		}
	}

	.diff-footer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: $space-2;
		padding: $space-3 $space-4;
		background: $bg-elevated;
		border-top: 1px solid $border-subtle;
		font-family: $font-mono;
		font-size: $text-sm;
		color: $text-secondary;
	}

	:global(.footer-icon) {
		width: 16px;
		height: 16px;
		color: $accent;
	}

	.principles-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: $space-6;
		max-width: 900px;
		margin: 0 auto;

		@media (max-width: $breakpoint-lg) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: $breakpoint-sm) {
			grid-template-columns: 1fr;
		}
	}

	.principle-card {
		text-align: center;
		padding: $space-6;
		background: $bg-base;
		border: 1px solid $border-subtle;
		border-radius: $radius-lg;
		transition: all $duration-normal $ease-out;

		&:hover {
			border-color: $accent;
			transform: translateY(-4px);
			box-shadow: 0 8px 24px rgb(0 0 0 / 30%);

			.principle-icon-wrapper {
				background: $accent-muted;
				border-color: $accent;
			}

			:global(.principle-icon) {
				color: $accent;
			}
		}
	}

	.principle-icon-wrapper {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		margin-bottom: $space-4;
		background: $bg-elevated;
		border: 1px solid $border-subtle;
		border-radius: $radius-md;
		transition: all $duration-normal $ease-out;
	}

	:global(.principle-icon) {
		width: 24px;
		height: 24px;
		color: $text-secondary;
		transition: color $duration-normal $ease-out;
	}

	.principle-title {
		font-family: $font-mono;
		font-size: $text-base;
		font-weight: 600;
		color: $text-primary;
		margin-bottom: $space-2;
	}

	.principle-description {
		font-size: $text-sm;
		color: $text-muted;
		margin: 0;
		line-height: $leading-relaxed;
		white-space: nowrap;
	}
</style>
