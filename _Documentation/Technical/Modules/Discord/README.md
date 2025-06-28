
# Overview


# Features
- Show Discord Rich Presence Activity

# Composition

### External Dependencies
- Official Discord C# Game SDK

### Communication
Through File STDIO:
- Line Based
- Accepts 5 values comma separated
- Each value fills in each 5 main attributes in discord's rich presence card
- values are:
	- detail
	- state
	- start time stamp
	- end time stamp
	- large image URL


### Backend (C# .NET Console Application)
- Main class that implements discord's rich presence for this desktop application is packaged into a CLI tool
- It should be forked as a child process by the actual desktop application

### Backend (Main)
- Within Discord service:
	- Will pass information received from other backend services or frontend into the CLI
