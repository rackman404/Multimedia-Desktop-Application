
# Introduction

### Purpose

The purpose of this document is to practice SRS writing as well as to provide myself a clear requirements specification when developing this application.

### Project Scope

Purpose of this desktop application is to provide a unified application to replace several standalone applications currently in use by me (iTunes, Soul Seek, FFmpeg) as well the option to expand this to other applications.


# Overall Description

### Operating Environment
- Operating system: Windows
- Platform: Electron/Typescript/JavaScript
- Client only system (backend integrated internally with the desktop application)


### Assumption Dependencies
Assume that this is a multi-media system to be used in the following scenarios:
- Playing and categorizing music
- Finding and downloading new music from Soul Seek

# Requirements

### Functional 
- Audio:
	- Must be able to automatically add missing metadata to any audio music file (i.e. thumbnail, lyrics, genre, etc)
	- Soul seek integration with ability to search for new songs and download new songs from within this application
	- Have basic music playing capabilities including: playing music, auto play next song, playlist functionality
- Audio (FFmpeg):
	- Basic functionality for converting between audio formats


### Non-functional
- Security: 
	- Ensure no web vulnerabilities or other vulnerabilities from child processes are a security issue when computer is connected to internet
- Usability:
	- Need only be capable of running on a Windows 10/11 computer
- Maintainability: 
	- Must be able to support test cases
	- Should strictly follow coding and naming conventions


### External Interface
- User Interface:
	- Soul seek
		- Search through a pre-existing account as a proxy
		- Alternative: Find a API for interfacing with Soul Seek 
- Hardware Interface:
	- Windows




