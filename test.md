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
var getRotation = (cx, cy, x1, y1, x2, y2, unticlockwise = true) => {
        const getBias = (x, y) => {
            if (0 <= x && 0 <= y) {
                // 第一
                return 0
            } else if (x < 0 && 0 <= y) {
                // 第二
                return Math.PI
            } else if (x < 0 && y < 0) {
                // 第三
                return Math.PI
            } else {
                // 第四
                return Math.PI * 2
            }
        }
        
        const warp = (x1,y1,x2,y2,unticlockwise=true) => {
            if (! unticlockwise) {
                if ((y1 >= 0) && (y2 < 0)){
                    return - Math.PI * 2
                }else{
                    return 0
                }
            }else{
                return 0
            }
        }

        theta1 = getBias(x1 - cx, y1 - cy) + (x1 !== cx
            ? Math.atan((y1 - cy) / (x1 - cx))
            : Math.sign(y1 - cx) * Math.PI * 0.5)
        theta2 = getBias(x2 - cx, y2 - cy) + (x2 !== cx
            ? Math.atan((y2 - cy) / (x2 - cx))
            : Math.sign(y2 - cy) * Math.PI * 0.5)

        return (theta2 - theta1) +  warp(x1-cx,y1-cy,x2-cx,y2-cy,unticlockwise)
    }

var toDegree = (radian) => radian / Math.PI * 180


var radiunBetween = (cx,cy) => (_x1,_y1,_x2,_y2) => {
    x1 = _x1-cx
    x2 = _x2-cx
    y1 = _y1-cy
    y2 = _y2-cy
    
    cos = (x1*x2+y1*y2)/Math.sqrt((x1*x1+y1*y1)*(x2*x2+y2*y2))
    return Math.sign(x1*y2-x2*y1) * Math.acos(cos)
}

var isUnticlockwise = (cx,cy) => (x,y,dx,dy) => {
    return radiunBetween(cx,cy)(x,y,x+dx,y+dy) > 0
}
```

```javascript
toDegree(radiunBetween(0,0)(1,-0.1,1,0.1))
```

```javascript
toDegree(radiunBetween(0,0)(-1,0.1,-1,-0.1))
```

```javascript
toDegree(radiunBetween(0,0)(1,0,-1,-0.1))
```

```javascript
isUnticlockwise(0,0)(1,-0.1,0,0.2)
```

```javascript
toDegree(getRotation(0,0,-1,1,0,-1,false))
```

```javascript
assert(toDegree(getRotation(0,0,1,0,1,1)) === 45 )
assert(toDegree(getRotation(0,0,1,0,0,1)) === 90 )
assert(toDegree(getRotation(0,0,1,0,-1,1)) === 135 )
assert(toDegree(getRotation(0,0,1,0,-1,0)) === 180)
assert(toDegree(getRotation(0,0,1,0,-1,-1)) === 225 )
assert(toDegree(getRotation(0,0,1,0,0,-1)) === 270 )
assert(toDegree(getRotation(0,0,1,0,1,-1)) === 315 )


assert(toDegree(getRotation(0,0,1,1,-1,1)) === 90 )
assert(toDegree(getRotation(0,0,1,1,1,-1)) === 270 )
assert(toDegree(getRotation(0,0,1,1,1,-1,false)) === -90 )
assert(toDegree(getRotation(0,0,-1,1,-1,-1)) === 90 )
assert(toDegree(getRotation(0,0,-1,1,-1,-1,false)) === -270 )
```

```javascript
var stepBy = step => degree => Math.floor(degree/step)

    
var cycleBy = unit => val => {
    cycle_count = Math.floor(val/unit)
    //console.log(cycle_count)
    //console.log(unit,val)
    return val < 0 
    ? val + unit
    : (unit <= val)
        ? val - unit * cycle_count
        : val
}

var mirrorby = (center) => val => val > center ? 2*center-val:val



var getAlpha = degree => {
    nth = cycleby(360/15)(stepby(15)(degree))
    console.log(degree,nth*15)
    return 1 - (degree - 15 * nth)/(15)
}

var isInverse = degree => (180 <= degree)


console.log(getAlpha(350))
```

```javascript
d = 80
console.log(mirrorby((180/15)/2)(cycleby(180/15)(stepby(15)(d))))
console.log(mirrorby((180/15)/2)(cycleby(180/15)(stepby(15)(d+15))))
```

```javascript
isInverse(190)
```

```javascript
0   15   30   45   60   75   90
180 165  150  135  120  105  
    195  210  225  240  255  270
360 345  330  315  300  285

0   15   30   45   60   75   90   105   120   135   150   165   180

```

```javascript

rotate_degree_step = 15
cycle_rotate_degree = 180
image_number = cycle_rotate_degree / rotate_degree_step + 1
total_step = (image_number-1) *2
mirror_at = image_number-1

var getImageNumber = cycle_rotate_degree > 90 
    ? degree => cycleBy(image_number-1)(
        stepBy(rotate_degree_step)(degree)
    )
    : degree => mirrorby(mirror_at)(
        cycleBy(total_step)(
            stepBy(rotate_degree_step)(degree)
        )
    )

degree = 30
console.log(getImageNumber(degree))
console.log(getImageNumber(degree+90))
console.log(getImageNumber(degree+180))
```

##### 
