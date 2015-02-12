# FileScan

Simple experiment using node to scan a directory for large files.

Checks the file size, and returns a list of any files which exceed this. Also supports width and height of PNG and JPEG files (looking into adding more file-type specific data).

## File limits config

The module takes a config object, which should list all file types, along with any limiting attributes. Current file types supported:

- JPEG
- PNG

Other file types may be listed, but will only have a size attribute. See below for an example configuration (note that MP4 is listed, which only has a size).

``` javascript
{
    "png": {
        "size": 500,
        "width": 1000,
        "height": 1000
    },
    "jpg": {
        "size": 500,
        "width": 1000,
        "height": 1000
    },
    "mp4": {
        "size": 4000
    }
}
```

## Example use

``` javascript
var config = {
    // omitted for brevity
};

FileScan("folder/path", config, function(err, data) {
    if(err) {
        // handle error
    }
    else {
        if(data.length > 0) {
            // process results
        }
    }
});
```
