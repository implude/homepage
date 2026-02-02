<script lang="ts">
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';

	gsap.registerPlugin(ScrollTrigger);
	const command = 'cat /etc/implude/philosophy';

	const lines = [
		{
			prompt: 'No magic bullet.',
			description: '우리는 특정 기술에 얽매이지 않습니다. 문제에 맞는 도구를 선택합니다.'
		},
		{
			prompt: 'Code quality first.',
			description: '동작하는 코드보다 좋은 코드를 추구합니다.'
		},
		{
			prompt: 'Ship it.',
			description: 'Docker + Dokploy로 실제 서비스를 배포합니다.'
		}
	];

	let terminalRef: HTMLElement | undefined = $state();
	let commandRef: HTMLElement | undefined = $state();
	let lineRefs: HTMLElement[] = $state([]);

	let commandText = $state('');
	let cursorVisible = $state(true);

	onMount(() => {
		const cursorInterval = setInterval(() => {
			cursorVisible = !cursorVisible;
		}, 530);

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: terminalRef,
				start: 'top 70%',
				toggleActions: 'play none none none'
			}
		});

		tl.to(
			{},
			{
				duration: command.length * 0.04,
				onUpdate: function () {
					const progress = this.progress();
					const chars = Math.floor(progress * command.length);
					commandText = command.slice(0, chars);
				}
			}
		);

		tl.to({}, { duration: 0.3 });

		lineRefs.forEach((ref, i) => {
			if (ref) {
				tl.from(
					ref,
					{
						opacity: 0,
						y: 10,
						duration: 0.5,
						ease: 'power2.out'
					},
					i === 0 ? '>' : '>-0.1'
				);
			}
		});

		return () => {
			clearInterval(cursorInterval);
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	});
</script>

<section id="philosophy" class="philosophy">
	<div class="container">
		<div class="terminal" bind:this={terminalRef}>
			<div class="terminal-header">
				<div class="terminal-buttons">
					<span class="btn-close"></span>
					<span class="btn-minimize"></span>
					<span class="btn-maximize"></span>
				</div>
				<span class="terminal-title">Terminal</span>
				<div class="terminal-spacer"></div>
			</div>

			<div class="terminal-body">
				<div class="terminal-line" bind:this={commandRef}>
					<span class="prompt">$</span>
					<span class="command">{commandText}</span>
					<span class="cursor" class:visible={cursorVisible}>▋</span>
				</div>

				<div class="terminal-output">
					{#each lines as line, i (i)}
						<div class="output-block" bind:this={lineRefs[i]}>
							<div class="output-header">
								<span class="output-arrow">&gt;</span>
								<span class="output-prompt">{line.prompt}</span>
							</div>
							<p class="output-description">{line.description}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	@use '../styles/variables' as *;

	.philosophy {
		min-height: 100vh;
		padding: $space-24 0;
		display: flex;
		align-items: center;
		background: $bg-base;

		@media (max-width: $breakpoint-md - 1px) {
			padding: $space-16 0;
		}
	}

	.container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 $space-6;

		@media (max-width: $breakpoint-md - 1px) {
			padding: 0 $space-4;
		}
	}

	.terminal {
		max-width: 800px;
		margin: 0 auto;
		background: $bg-surface;
		border: 1px solid $border-subtle;
		border-radius: $radius-lg;
		overflow: hidden;
		box-shadow: $shadow-lg;
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
		padding: $space-6;
		font-family: $font-mono;

		@media (max-width: $breakpoint-md - 1px) {
			padding: $space-4;
		}
	}

	.terminal-line {
		display: flex;
		align-items: center;
		gap: $space-2;
		margin-bottom: $space-6;
	}

	.prompt {
		color: $accent;
		font-weight: 600;
	}

	.command {
		color: $text-primary;
	}

	.cursor {
		color: $accent;
		opacity: 0;
		transition: opacity 0.1s;

		&.visible {
			opacity: 1;
		}
	}

	.terminal-output {
		display: flex;
		flex-direction: column;
		gap: $space-6;
	}

	.output-block {
		padding-left: $space-4;
		border-left: 2px solid $border-subtle;
		transition: border-color $duration-normal $ease-out;

		&:hover {
			border-color: $accent;
		}
	}

	.output-header {
		display: flex;
		align-items: center;
		gap: $space-2;
		margin-bottom: $space-2;
	}

	.output-arrow {
		color: $accent;
		font-weight: 600;
	}

	.output-prompt {
		color: $text-primary;
		font-size: $text-lg;
		font-weight: 600;
	}

	.output-description {
		color: $text-secondary;
		font-size: $text-sm;
		line-height: $leading-relaxed;
		margin: 0;
	}
</style>
