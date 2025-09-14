
# Technical Overview

This Desktop application has two distinct components:
- Electron Application: Runs primary services
	- Node.js Backend Process
	- Renderer (Chromium) Frontend Process
- C# Console Application: Runs the discord RPC secondary service

Services are what each distinct part of the application are (Music player/browser, FFmpeg GUI, etc..)
- Backend: Each service typically consists of a backend written in the backend Node process
- Frontend: One or many frontend components can then communicate with said backend process using a IPC bridge
- IPC Bridge: 

Documentation for service specific code and implementation is stored within Technical/Modules/<SERVICE_NAME>

Note that the SRS document stored in Non_Technical/ is the definitive copy of all system features and requirements that this application should meet

# Development

### Building (Release)

---

**Manual Builds:**

<u>Build Electron Application:</u>
- Open a terminal within the repo folder on your local drive (or cd into it)

Build application into a portable exe (with all dependencies included)
```
npm run package
```

Compiled Build will be located in
	- <PROJECT_FOLDER>\release\build\win-unpacked

<u>Build C# Application:</u>
- Open a terminal within the repo folder on your local drive (or cd into it) if not already done so

Enter discord subfolder
```
cd dotnet_discord_rpc
```

Build application into a portable exe (with all dependencies included)
```
dotnet build
```

- Compiled Build will be located in
	- <PROJECT_FOLDER>\dotnet_discord_rpc\bin\Debug\net8.0\win-x64
* Copy files into 
	* <PROJECT_FOLDER>\release\build\win-unpacked\binary_dependencies (create binary_dependencies folder if not already there)
* Program should be able to launch with full functionality at this point

---

<u>Automatic Builds:</u>

Fork this repo and manually trigger the "Build for Release" Github Workflow in the Github Actions Tab

# Versioning Guidelines

Versioning for this project will follow heavily modified guidelines from the following source: [semvar](https://semver.org)
In general:
- 0.y.z-alpha will denote releases made in this repo before all major intended features are implemented
- 0.y.z-n-unsecure will denote releases made in this repo AND that electron renderer web security has been disabled
- 1.0.0 will denote full initial release
- x.y.z will denote full initial release plus major changes

x: Major Version - addition or removal of new major services added to the application
y: Minor Version - addition or removal of a (or many) feature within a major version 
z: Patch - minor bug fixes or changes to a minor version
