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
import shutil
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

#webp.toJp2(quality=70)
#webp.toJpeg(maxsize=150000)
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
src_root = pathlib.Path("./data/")
list(src_root.glob("*/"))
```

```python
def archive(root_path:str,ext_selector:str,output_path):
    output_p = pathlib.Path(output_path)
    input_p = pathlib.Path(root_path)
    if not output_p.exists():
        output_p.mkdir()
        
    with zipfile.ZipFile(f"{output_path}{ext_selector}.zip","w",compression=zipfile.ZIP_STORED) as new_zip:
        for file in input_p.glob(f"*.{ext_selector}"):

            f = pathlib.Path(file)
            new_zip.write(file,arcname=f.name)

def make_package(input_root_path, output_root):
    p = pathlib.Path(input_root_path)
    package_name = p.name
    output_root_path = output_root + package_name + "/"
    archive(input_root_path,"webp",output_root_path)
    archive(input_root_path,"jpg",output_root_path)
    archive(input_root_path,"jp2",output_root_path)
    webp_o1 = Webp(f"{input_root_path}/o1.webp")
    webp_c1 = Webp(f"{input_root_path}/c1.webp")
    webp_o1.toJpeg(maxsize=10,directory=pathlib.Path(output_root_path))
    webp_c1.toJpeg(maxsize=10,directory=pathlib.Path(output_root_path))
    shutil.copy2(input_root_path/"manifest.json",output_root_path+"manifest.json")

    
src_root = pathlib.Path("./data/")

list(map(
    lambda package_path: make_package(package_path,"./data-packages/"),
    src_root.glob("*/")
))
```

```python
doOperation = pip(
    str,
    webpToJpegs
)

list(
    map(doOperation,all_webp("./data/G-10_shell_webp/"))
)
```

最終的に

# ```
zipped/
    sample_1/
        jpeg.zip/
            o1.jpg
            o2.jpg
            ...
            c1.jpg
            c2.jpg
            ...
        webp.zip/
            o1.webp
            o2.webp
            ...
            c1.webp
            c2.webp
            ...
        j2k.zip/
            o1.j2k
            o2.j2k
            ...
            c1.j2k
            c2.j2k
            ...
        manifest.json
        sumbnail.jpg
# ```

* image uploaderでsample_1.zipをつくる

# ```
sample_1.zip/
    o1.webp
    o2.webp
    ...
    c1.webp
    c2.webp
    ...
    manifest.json
    o1.jpg  * maxsize = 10KB
    c1.jpg  * maxsize = 10KB
# ```

* sample_1.zipを展開する
* 各webpをjpgとj2kに変換する
* 画像フォーマットごとにzipファイルに固める

* /data/ 内の画像ファイルを対象とする.

