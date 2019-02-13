---
jupyter:
  jupytext:
    text_representation:
      extension: .md
      format_name: markdown
      format_version: '1.0'
      jupytext_version: 0.8.2
  kernelspec:
    display_name: Python 3
    language: python
    name: python3
  language_info:
    codemirror_mode:
      name: ipython
      version: 3
    file_extension: .py
    mimetype: text/x-python
    name: python
    nbconvert_exporter: python
    pygments_lexer: ipython3
    version: 3.7.0
---

```python
import shutil
from pathlib import Path




```

```python
def get_prefix_of_subdirectory(root_dir,target="*"):
    p = Path(root_dir)
    return p.glob(target)


list(get_prefix_of_subdirectory("./data/2019_0201/","**/*.json"))
```

```python
def zipping(input_dir,output_dir):
    print(input_dir, output_dir)
    shutil.make_archive(output_dir, 'zip', root_dir=input_dir)

def sanitize_prefix(input_dir:str, input_root:str, output_root:str):
    return Path(output_root) / input_dir.name
    
def zip_subfolders(root_dir,output_root_dir):
    
    subfolders = get_prefix_of_subdirectory(root_dir)
    
    list(map(
        lambda input_dir: zipping(input_dir, sanitize_prefix(input_dir, root_dir, output_root_dir)),
        subfolders
    ))
    
    
zip_subfolders("./data/","./zipped/")
```

```python

```
