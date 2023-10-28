[← Back](../README.md)

# Virtual Drive

> Related document: [Storage](../storage/README.md)

The virtual drive is a virtual file and directory system. The root directory is a virtual folder and the access point for all interactions with the virtual drive.

## Table of Contents

- [Virtual Root](./virtual-root/README.md)
- [Virtual File](./virtual-file/README.md)
- [Virtual Folder](./virtual-folder/README.md)

## Examples

### Component interacting with virtual drive

```js
// components/applications/example/Example.jsx

export function Example() {
	const virtualRoot = useVirtualRoot();
	const [currentDirectory, setCurrentDirectory] = useState(virtualRoot.navigate("~"));

	currentDirectory.createFile("example", "txt", (file) => {
		file.setContent("Foo bar.");
	});
}
```