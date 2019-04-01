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
from PIL import Image
import pathlib
import zipfile
import re
import sys
import logging
from io import BytesIO
from func_helper import pip

```

```python
logger = logging.getLogger()
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
logger.addHandler(handler)
logger.setLevel(logging.INFO)
```

```python
class Webp:
    def __init__(self,path):
        self.webp = Image.open(path)
        self.path = pathlib.Path(path)
        logger.info("input: "+path)
    
    def get_output_path(self, name=None,directory=None, ext=None):
        output_dir = self.path.parent if directory is None else directory
        output_name = self.path.stem if name is None else name
        output_ext = self.path.suffix if ext is None else ext
        return (output_dir / output_name).as_posix() + "." + re.sub(r"^\.","",output_ext)
    
    def toJp2(self,directory=None,quality=0,**kwargs):
        
        output_path = self.get_output_path(directory=directory,ext="jp2")
        """
        for j in range(18):
            quality = j*5
            img_file = BytesIO()
            self.webp.convert("RGB").save(img_file,'JPEG2000',quality_mode='db', quality_layers=[quality])
            #print (img_file.tell())
            print(img_file.tell())
            if img_file.tell() < 150000:
                break
        """
        try:
            self.webp.convert("RGB").save(output_path,'JPEG2000',quality_mode='rate', quality_layers=[100-quality])
            logger.info("output: "+output_path)
        except(e):
            logger.warn("failed: "+output_path)
            
    def toJpeg(self,directory=None,maxsize=150000,**kwargs):
        output_path = self.get_output_path(directory=directory,ext="jpg")
        
        for j in range(18):
            quality = 90-j*5
            img_file = BytesIO()
            self.webp.save(img_file,'jpeg',quality=quality,optimize=True)
            if img_file.tell() < maxsize:
                break
                
        try:
            self.webp.convert("RGB").save(output_path,'JPEG',quality=quality,**kwargs)
            logger.info("output: "+output_path)
        except(e):
            logger.warn("failed: "+output_path)
```

```python
webp = Webp("./data/G-11_olivine_sand_webp/o1.webp")

webp.toJp2(quality=70)
webp.toJpeg(maxsize=150000)
```

```python
def all_webp(directory):
    d = pathlib.Path(directory)
    return d.glob("**/*.webp")

def webpToJpegs(path):
    webp = Webp(path)
    webp.toJp2(quality=70)
    webp.toJpeg()
    return path


map(str,all_webp("./data"))
```

```python
doOperation = pip(
    str,
    webpToJpegs
)

list(
    map(doOperation,all_webp("./data"))
)
```
