<script lang="js">
	import { ActivitySquare } from 'lucide-svelte';
	import { Button } from '$components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '$components/ui/card';
	import { Input } from '$components/ui/input';
	import { Label } from '$components/ui/label';
	import { Alert, AlertDescription, AlertTitle } from '$components/ui/alert';
	import { io } from '$lib/webSocket.js';
	import { Badge } from "$components/ui/badge";
	import { Textarea } from '$components/ui/textarea';
	import { Message } from '$components/ui/message';

	let userName = '';
	let roomName = '';
	let userResult = '';
	let roomResult = '';
	let roomType = 'channel'

	io.emit('test', { message: 'Hello ' });

	function handleUserSubmit() {
		io.emit('create-user', { userName });
		joinServer(userName);
		userResult = `User ${userName} has joined the server`;
	}

	function handleRoomSubmit() {
		io.emit('create-room', { roomName });
		roomResult = `Room ${roomName} has been created`;
	}

	function joinServer(userName) {
		io.emit('join-server', {
			userName
		});
		currentUser = userName;
		alert(`User : ${userName} has joined the server`);
	}

	function joinRoom(roomName, currentUser) {
		currentRoom = roomName;
		roomType = "channel"
		if (currentUser) {
			io.emit('join-room', {
				userName: currentUser,
				roomName
			});
			alert(`User ${currentUser} has joined : ${roomName}`);
		}
	}

	function privateChat(name){
		currentRoom = name
		if (currentUser) {
			roomType = "non_channel"
			alert(`User ${currentUser} can chat with ${name}`);
		}

	}

	io.on('user-joined', (eventBody) => {
		if (Object.hasOwn(messages, currentRoom)) {
			messages[currentRoom].push(eventBody);
			messages[currentRoom] = messages[currentRoom];
		} else {
			messages[currentRoom] = [eventBody];
		}
	});

	io.on('listen-room', (eventBody) => {
		if (Object.hasOwn(messages, currentRoom)) {
			messages[currentRoom].push(eventBody);
			messages[currentRoom] = messages[currentRoom];
		} else {
			messages[currentRoom] = [eventBody];
		}
	});

	io.on('listen-create-user', (eventBody) => {
		users = eventBody.users;
	});

	io.on('listen-create-room', (eventBody) => {
		rooms = eventBody.rooms;
	});

	function publishMessage() {
		io.emit('send-message', {
			type: roomType,
			to: currentRoom,
			userName: currentUser,
			payload: message
		});
		message = ''
	}

	let currentRoom = "";
	let currentUser = 'user1';
	let users = [];
	let rooms = [];
	let messages = {};
	let message = '';
</script>

<main class="flex flex-row m-8 border-2 p-4 h-screen">
	<div class="h-full justify-center flex-col space-y-8 border-r-2 p-8 gap-4 w-1/3">
		<Card class="w-full">
			<CardHeader class="space-y-1">
				<CardTitle class="text-2xl flex justify-center">Register User</CardTitle>
			</CardHeader>
			<CardContent class="grid gap-4">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t" />
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-background px-2 text-muted-foreground"> register user </span>
					</div>
				</div>
				<form on:submit|preventDefault={handleUserSubmit} class="space-y-6">
					<div class="grid gap-2">
						<Label for="name">Name</Label>
						<Input id="name" type="text" placeholder="" bind:value={userName} />
					</div>
					<Button type="submit" class="w-full">Register User</Button>
				</form>
			</CardContent>

			<CardFooter>
				<Alert class="flex justify-center space-y-2 flex-col">
					<AlertTitle>User Registration Status</AlertTitle>
					<AlertDescription class="bg-background text-muted-foreground">
						Result : {userResult}
					</AlertDescription>
				</Alert>
			</CardFooter>
		</Card>

		<Card class="w-full">
			<CardHeader class="space-y-1">
				<CardTitle class="text-2xl flex justify-center">Create Room</CardTitle>
			</CardHeader>
			<CardContent class="grid gap-4">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t" />
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-background px-2 text-muted-foreground"> create room </span>
					</div>
				</div>
				<form on:submit|preventDefault={handleRoomSubmit} class="space-y-6">
					<div class="grid gap-2">
						<Label for="name">Name</Label>
						<Input id="name" type="text" placeholder="" bind:value={roomName} />
					</div>
					<Button type="submit" class="w-full">Create Room</Button>
				</form>
			</CardContent>

			<CardFooter>
				<Alert class="flex justify-center space-y-2 flex-col">
					<AlertTitle>User Registration Status</AlertTitle>
					<AlertDescription class="bg-background text-muted-foreground">
						Result : {userResult}
					</AlertDescription>
				</Alert>
			</CardFooter>
		</Card>
	</div>

	<!-- Message Section-->

	<div class="h-full flex flex-row gap-8 justify-center w-full p-8">
		<div class="h-full flex flex-col space-y-4 w-1/2 justify-center">
			<Card class="h-full flex-auto">
				<CardHeader class="space-y-1">
					<CardTitle class="text-2xl flex justify-center">Rooms</CardTitle>
				</CardHeader>
				<CardContent class="grid gap-3">
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<span class="w-full border-t" />
						</div>
						<div class="relative flex justify-center text-xs uppercase">
							<span class="bg-background px-2 text-muted-foreground"> Active Rooms </span>
						</div>
					</div>
					{#each rooms as room}
						<button
							class="flex items-center space-x-4 space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
							on:click={() => joinRoom(room.name, currentUser)}
						>
							<ActivitySquare class="h-5 w-5" />
							<p class="text-sm text-center font-medium leading-none cursor-pointer p-2">
								{room.name}
							</p>
						</button>
					{/each}
				</CardContent>
			</Card>

			<Card class="h-full flex-auto">
				<CardHeader class="space-y-1">
					<CardTitle class="text-2xl flex justify-center">Users</CardTitle>
				</CardHeader>
				<CardContent class="grid gap-3">
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<span class="w-full border-t" />
						</div>
						<div class="relative flex justify-center text-xs uppercase">
							<span class="bg-background px-2 text-muted-foreground"> Active Users </span>
						</div>
					</div>
					{#each users as user}
						<button
							class={`flex items-center space-x-4 space-y-1 rounded-md p-2 hover:bg-accent hover:text-accent-foreground ${user?.name === currentUser ? "bg-primary-foreground" : ''}`}
							on:click={() => privateChat(user?.name)}
						>
							<ActivitySquare class="h-5 w-5" />
							<p class="text-sm text-center font-medium leading-none cursor-pointer p-2">
								{user.name}
							</p>
						</button>
					{/each}
				</CardContent>
			</Card>
		</div>

		<Card class="w-full overflow-y-auto h-full">
			<CardHeader class="space-y-1">
				<CardTitle class="text-2xl flex justify-center">Chat Window</CardTitle>
			</CardHeader>
			<CardContent class="overflow-auto grid gap-4">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t" />
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-background px-2 text-muted-foreground"> 
							{currentRoom} 
						</span>
					</div>
				</div>
				<div class="border-1 h-[650px] space-y-4">
				{#each messages[currentRoom] || [] as message}
					<Message 
						message={message}
						currentUser={currentUser}
					/>
				{/each}
				</div>
			</CardContent>
			<CardFooter class="my-auto">
				<form
					on:submit|preventDefault={publishMessage}
					class="space-y-6 flex flex-row space-x-4 w-full"
				>
					<Textarea class="" bind:value={message} placeholder="Type your message here." />
					<Button type="submit" class="w-1/6">Send</Button>
				</form>
			</CardFooter>
		</Card>
	</div>
</main>
