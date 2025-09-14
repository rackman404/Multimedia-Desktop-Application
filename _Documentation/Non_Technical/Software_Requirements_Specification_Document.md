


 <h1 align="center">Software Requirements Specification</h1>
 <h2 align="center">for</h2>
<h1 align="center">Multimedia Desktop Application</h1>
 <h3 align="center">For Version 1.0</h3>
<h3 align="center">2025-09-13</h3>



---


# Revision History

| Reason For Change | Date | Version |
| ----------------- | ---- | ------- |
| N/A               | N/A  | N/A     |

# 1. Introduction <a name="Introduction"></a>

### 1.1 Purpose

This SRS document describes the projected features and requirements for V1.0 of the Multimedia Desktop Application software. It may alter during the development of the software. This document should be used as the primary guide and reference point on implementing each individual function and service within the software described. 

### 1.2 Product Scope

The primary focus of this application is to provide a comprehensive music player while also providing support for a planned workflow of (Music Download -> Automatic Metadata Tagging -> Music Folder placement -> Manual Playlist Adding) amongst other secondary features. It also seeks to demonstrate personal knowledge from a variety of software development courses at TMU.

### 1.3 Acronyms and Definitions

| Acronyms |            Definitions            |
| -------- | :-------------------------------: |
| API      | Application Programming Interface |
| RPC      |       Remote Procedure Call       |
| SDK      |     Software Development Kit      |
| GUI      |     Graphical User Interface      |
| IPC      |    Inter Process Communication    |

### 1.4 Intended Audience and Reading Suggestions 

While the primary audience is myself, anyone interested in forking, contributing, or reading the source code of this application should read this document if time permits.
### 1.5 References
- Github Link: https://github.com/rackman404/Multimedia-Desktop-Application

# 2. Overall Description<a name="overalldescription"></a>

### 2.1 Product Perspective
This software should provide a unified application to both streamline the music downloading process as well as provide an aesthetically pleasing media viewing experience for music and comic books with other options to expand this to other possible use cases.
### 2.2 Product Function

Further details provided in section 4 (Functional Requirements)
-  Provide a automated workflow for: Downloading music -> Automatic Metadata Tagging -> Manual Playlist Additions
- Provide the ability to play music with features that match modern music player applications
- Provide the ability to read comics with features that match modern comic reader application
### 2.3 Operating Environment
All Devices with Windows 10 or 11 Installed.

### 2.4 Design and Implementation Constraints
* CO-1: Each "Feature" should have it's own backend "service" with independent RPC communication channels for interfacing with the frontend or even each other.
* CO-2: .NET and C# are to be used for implementing Discord's Rich Presence system via the Discord C# SDK.
* CO-3: Electron and Typescript/JavaScript are to be used for implementing the primary GUI and accompanying backend services.
* CO-4: Any IDE is fine for development however VSCode is preferred.

### 2.5 User Documentation
Any end users are expected to read the README.md file in the root git repository folder for detailed instructions on installation and usage. Documentation pertaining to Electron itself should be solved using their specific help manuals and documentation. Documentation pertaining to this software itself can be found within the "Documentation" folder.

Contributors are expected to read documentation within the same "Documentation" folder this SRS document is contained in.

### 2.6 Assumptions and Dependencies
There should be no dependencies as the program is assumed to be packaged with all required binary dependencies and other requirements when software builds are released.

# 3. Interface Requirements

### 3.1 Software Interfaces
- Internal Software Interface:
	- IPC: To be used to communicate between frontend and backend processes within the Electron application proper.
- External Software Interface:
	- HTTP Requests: Should be used when communicating with external third party software services.
	- RPC: RPC calls may be invoked to communicate with external software programs if required
	- File Streams: Any child processes of the Electron application should be communicated with using file streams.

### 3.2 Hardware Interfaces
- TBD, No direct hardware interfaces are used in this software at this time (however new functional requirements may change this. (i.e. physical audio visualizer).

# 4. Functional Requirements <a name="systemfeatures"></a>

### 4.1 Music Player
- 4.1.1 Description and Priority:
	- (High Priority) Means to play music files stored locally with the ability to sort and categorize said music files
- 4.1.2 Stimulus/Response Sequences:
		TBD
- 4.1.3 Functional Requirements:
	- REQ-1: Audio playback
		- Must be able to playback MP3 and FLAC. Other files are optional
	- REQ-2: Synced lyric support
		- Optional Translation of live lyrics through additional translation service APIs
		- Live lyrics can be offset to account for possible song length mismatch
	- REQ-3: Unsynced Raw Lyric support via embedded music file metadata
	- REQ-4: Capability to display information about music (artist name, album, etc..) 
		- Either through embedded metadata OR online APIs
	- REQ-5: User audio controls during a song's playback
		- Direct Controls: Seek, (enable/disable) Loop, and Volume
	- REQ-6: Retrieve music files stored locally in a specified folder and display then in a table format
		- Optionally: allow user to change specified folder location
	- REQ-7: Adding music files to a playlist
	- REQ-8: Audio Visualizer, TBD
	- REQ-9: Store user specific metadata (play count, playlist data, etc..) locally, using SQLite

### 4.2 FFmpeg and Metadata Utilities
- 4.2.1 Description and Priority:
	- (Medium Priority) Capability to alter characteristics and properties of a audio file as well as metadata if applicable. 
- 4.2.2 Stimulus/Response Sequences:
		TBD
- 4.2.3 Functional Requirements:
		TBD

### 4.3 Discord Rich Presence
- 4.3.1 Description and Priority:
	- (Low Priority) Optional rich presence if logged into Discord on same device as this software.
- 4.3.2 Stimulus/Response Sequences:
		TBD
- 4.3.3 Functional Requirements:
		TBD

### 4.4 Video Player
	TBD

### 4.5 Comic Reader
- 4.5.1 Description and Priority:
	- (Low Priority) Read locally stored comic books or manga in any CBR (or similar) formatted files.
- 4.5.2 Stimulus/Response Sequences:
		TBD
- 4.5.3 Functional Requirements:
		TBD


### 4.5 Settings Manager
- 4.4.1 Description and Priority:
	- (Medium Priority) Service that handles all electron based interactions.  
- 4.4.2 Stimulus/Response Sequences:
		TBD
- 4.4.3 Functional Requirements:
		TBD


# 5. Non-functional Requirements

- Performance:
	- Should not exceed 500mb in normal memory usage
	- Should be capable of running on a computer with a Intel Core i5-7500 CPU at minimum with no noticeable performance issues
- Security and Safety: 
	- Ensure no web vulnerabilities or other vulnerabilities from child processes are a security issue when computer is connected to internet.
	- There should be minimal use of external node packages used within this software to minimize security issues.
	- Frontend should never be able to access anything on the host computer (Possible security concern), all assets or files should be served by the backend.
- Usability:
	- Need only be capable of running on a Windows 10/11 computer
	- Need only support 1920x1080 (16:9 aspect ratio)
- Maintainability: 
	- N/A
- Scalability:
	- N/A, application as well as all services are run locally. Therefore no requirement to scale application deployment,


# Appendix AB: SRS Writing References

SRS References:
- [SRS Template](https://web.cs.dal.ca/~hawkey/3130/srs_template-ieee.doc)
- [SRS Example](https://wdfw.wa.gov/sites/default/files/publications/00799/wdfw00799.pdf)
- [SRS Example (ite)](https://www.ite.org/ITEORG/assets/File/Standards/Task3-2_1_CVPFS-System_Requirements_Specifications_Release_1_0.pdf)
- [SRS Example (5ei)](https://2020-5ei-team6-trentin.readthedocs.io/en/latest/process/srs/)


# Appendix B: Analysis Models

- Refer to Draw.io files within Documentation/Technical root directory to see top level Deployment, Data Flow, and other Diagrams. 
