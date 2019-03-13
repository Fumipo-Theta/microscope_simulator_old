---
jupyter:
  jupytext:
    text_representation:
      extension: .md
      format_name: markdown
      format_version: '1.0'
      jupytext_version: 0.8.2
  kernelspec:
    display_name: Javascript (Node.js)
    language: javascript
    name: javascript
  language_info:
    file_extension: .js
    mimetype: application/javascript
    name: javascript
    version: 11.7.0
---

```javascript
function objectFrom(keys_values){
    const o = {}
    keys_values.forEach(kv=>{
        o[kv[0]] = kv[1]
    })
    return o
}
```

```javascript
objectFrom([["x",0],["y",1]])
```

```javascript

```
