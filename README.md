# hash-map

Hash table based implementation of the Map interface

## Installation

via npm:
``` bash
$ npm install ihash-map
```

## Usage

Full Map API is supported

``` javascript
import HashMap from 'ihash-map';

interface ComparableObject {
  hashCode(): string;
  equals(other: ComparableObject): boolean;
}

class Point implements ComparableObject {
  constructor(public x: number, public y: number) {}
  hashCode() {
    return `${this.x},${this.y}`;
  }
  equals(other: Point) {
    return (
      this === other || (other && this.x === other.x && this.y === other.y)
    );
  }
}

class Area implements ComparableObject {
  constructor(public w: number, public h: number) {}
  hashCode() {
    return `${this.w},${this.h}`;
  }
  equals(other: Area) {
    return (
      this === other || (other && this.w === other.w && this.h === other.h)
    );
  }
}

const map = new HashMap<ComparableObject, unknown>(
  one => one.hashCode(),
  (one, other) => one.equals(other)
);

map.set(new Point(1, 2), 'P(1, 2)');
map.get(new Point(1, 2));
//=> 'P(1, 2)'
map.get(new Area(1, 2));
//=> undefined
```

## License

MIT
