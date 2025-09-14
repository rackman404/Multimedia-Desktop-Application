

See [Official Electron Docs](https://www.electronjs.org/docs/latest/tutorial/ipc) for further information.
# IPC Overview

This application makes use of Electron which is composed of a backend node.js server process as well as a frontend renderer process. In normal circumstances, a typical web application would simply connect with a centrally located server where the node.js process is hosted on using a REST API or some other form of connection to communicate. However, as both frontend and backend is included within this desktop application itself, we must instead use a form of Inter-Process Communication (IPC) instead.

# How This Application Uses IPC

### Typing and Enums

Due to the large amount of methods used to provide information to the frontend from the backend, this application makes use of Types and Enums (**see Src/typesIPC.ts**) for both code readability and maintainability.

This application currently uses 3 main Enums/types for IPC:
- (Enum) ServicesEnum: Contains predefined channels for each backend services
- (Type) IPCServicesMessageInterface: Generic message container object for frontend to backend messages
- (Namespace) IPCMethodAPI: Contains various Enums with backend method names intended to be invoked in the frontend
### Channels

Electron allows for messages to flow through 'channels' which can be used to transmit information to and from specific parts of the backend. At the time of writing (2025-09-07), the channels are defined as follows:

```ts
export enum ServicesEnum {
    settings = 'settings',
    audio = 'audio',
    discord = 'discord',
    ipcExample = 'ipc-example',
}
```

This Enum is then passed to a Const in preload.ts containing various methods exposed to the renderer process for communications. Only the Enum members defined in 'ServicesEnum' can then be used as channels.
### Brokers

In order to rout information to the relevant backend services and components, an overall backend service management class (serviceManager.tsx) is implemented. Within this class, event listeners for the various channels are created. These event listeners will listen for incoming messages from the frontend in their relevant channels before passing it to service specific broker classes who then finally invokes the relevant backend code and optionally returns it

For example:
```ts
IPCCalls(){
	ipcMain.on(ServicesEnum.audio, async (event, arg) => {
	      if (arg != ""){
	        this.audioManager.broker.eventOn(event, arg);
	      }
	
	      else{
	       event.reply(ServicesEnum.audio, console.log("Undefined ipc one way from bus audio"));
	      }
	    });
......
......
}
```

Event listener above would receive messages sent to the 'ServicesEnum.audio' channel, then pass the message to the sub broker class responsible for the audio service.

Summary: 
1. Message is passed from frontend
2. Event Listener in overall Backend Broker/Backend Manager class receives message
3. Backend Broker class passes the message to the relevant Service Broker class
4. Service Broker class invokes relevant Backend service code, then optionally returns it if required.

### Communication Types

We can broadly divide the types of messages and return messages used in this application in the following categories:

- Renderer to Main (One Way)
	* A message is sent to the backend; This message will contain channel information, as well as a 'IPCServicesMessageInterface' object defined 
	- Ex.:
```ts
		 window.electron.ipcRenderer.sendMessage(ServicesEnum.settings , {service: IPCMethodAPI.SettingsOneWayIPC.fullscreen, content: ["false"]});
```
In the following example taken from Settings.tsx, a message is sent to a 'settings' channel defined in the first parameter, sent to a 'fullscreen' API method with a string content of 'false'. The related backend method would then be invoked by intermediary backend broker classes which would then force the application to be windowed. No reply is sent back to the renderer in this case.


- Renderer to Main to Renderer (Two Way)
	- Same as Renderer to Main (One Way) except a return message is sent back to renderer
	- Ex.:
	```ts
	    useEffect(() => {//initial load
	       (async () => {
	            console.log("LOADING MUSIC DATA");
	            
	            const result = await window.electron.ipcRenderer.invoke(ServicesEnum.audio, {service: IPCMethodAPI.AudioTwoWayIPC.getAllMetadataSimple, content: [""]});
	
	            setMetaData(result);        
	            setAllMetaData(result);
		    })();
	    }, []);
	```
In the following example, a message is sent to a 'audio' channel defined in the first parameter , sent to a 'getAllMetadataSimple' API method with no required content data. The related backend method would then be invoked by intermediary backend broker classes which then returns a list of metadata song information.

Note that the method should be awaited as it is asynchronous and we are require the information sent back before the rest of the useEffect hook is invoked

- Main to Renderer (One Way)
	- Unlike the two methods described above, this method requires the main process to send a process to the renderer. As a result, in order to receive messages from renderer, there must be a listener function available in a given renderer component to receive data





