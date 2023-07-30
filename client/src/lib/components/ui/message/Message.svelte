<script lang="ts">
	import { Badge } from '../badge';
    import dayjs from 'dayjs';
	export let message = {
		message: '',
		sender: '',
		sentAt: null
	};
	export let currentUser = '';
	let style = {
		position: 'justify-start mb-2',
        variant:'default'
	};
	if (message?.sender && message.sender != currentUser) {
		style.position = 'justify-end';
        style.variant = 'outline'
	}
</script>

<div class={`flex ${style.position}`}>
	<div class="flex flex-col space-y-1">
		<Badge class={`flex w-full justify-center`} variant= {style.variant}>
			{message.message}
		</Badge>
		{#if message?.sender && message?.sentAt}
			<div class="flex justify-center text-xs">
				<span class="bg-background px-2 text-muted-foreground">{message?.sender}</span>
				<span class="bg-background px-2 text-muted-foreground">{dayjs(message?.sentAt).format('MMM D,h:mm A')}</span>
			</div>

		{/if}
	</div>
</div>
