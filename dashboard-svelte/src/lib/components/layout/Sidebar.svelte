<script lang="ts">
	import { page } from '$app/state';

	const NAV = [
		{ href: '/', icon: '🏠', label: 'Home' },
		{ href: '/briefing', icon: '☀️', label: 'Daily Briefing' },
		{ href: '/todo', icon: '✅', label: 'Todo' },
		{ href: '/session', icon: '🗒️', label: 'Session Log' },
		{ href: '/knowledge', icon: '📚', label: 'Knowledge' },
		{ href: '/glossary', icon: '📔', label: 'Glossary' },
		{ href: '/diary', icon: '📖', label: 'Diary' },
		{ href: '/projects', icon: '📁', label: 'Projects' },
		{ href: '/activity', icon: '⚡', label: 'Activity' },
		{ href: '/team', icon: '🧑‍🤝‍🧑', label: 'Team' }
	];
</script>

<aside class="sidebar">
	<div class="logo">
		<img class="logo-avatar" src="/images/Jed.png" alt="Jed" />
		<div class="logo-text">
			<div class="logo-title">Jed's AI OS</div>
			<div class="logo-sub">Personal Command Center</div>
		</div>
	</div>

	<nav>
		<div class="nav-section">Navigation</div>
		{#each NAV as item (item.href)}
			<a
				class="nav-item"
				class:active={page.url.pathname === item.href}
				href={item.href}
			>
				<span class="nav-icon">{item.icon}</span>
				<span>{item.label}</span>
			</a>
		{/each}
	</nav>

	<div class="sidebar-spacer"></div>
	<div class="sidebar-bottom">
		<div class="sidebar-copyright">Jed's AI OS · SvelteKit</div>
	</div>
</aside>
