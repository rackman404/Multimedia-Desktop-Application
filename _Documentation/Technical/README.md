

# Building

Until CI/CD Tools are implemented, the following will allow for building:
- Download latest commits from Github repo
- Ensure latest version of discord_rpc_cli.exe is complied and placed within "binary_dependencies" folder 
	- also ensure discord_game_sdk.dll is present in the same folder as it


# Versioning Guidelines

Versioning for this project will follow heavily modified guidelines from the following source: [semvar](https://semver.org)
In general:
- 0.y.z-alpha will denote releases made in this repo before all major intended features are implemented
- 0.y.z-n-unsecure will denote releases made in this repo AND that electron renderer web security has been disabled
- 1.0.0 will denote full initial release
- x.y.z will denote full initial release plus major changes
-

x: Major Version - addition or removal of new major services added to the application
y: Minor Version - addition or removal of a (or many) feature within a major version 
z: Patch - minor bug fixes or changes to a minor version

# Testing

To Test This Application:
- Build application first with npm run build

### E2E (End To End)
- Run Playwright E2E
