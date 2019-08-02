export default class HashMap<K, V> implements Map<K, V> {
  private cache: { [code: string]: Array<[K, V]> } = Object.create(null);
  private data = new Set<[K, V]>();
  readonly [Symbol.toStringTag] = 'HashMap';

  constructor(
    public hashCode: (one: K) => string,
    public equals: (one: K, other: K) => boolean
  ) {}

  clear() {
    this.cache = Object.create(null);
    this.data.clear();
  }

  delete(key: K) {
    const code = this.hashCode(key);
    const bucket = this.cache[code] || [];
    const index = bucket.findIndex(([otherKey]) => this.equals(key, otherKey));
    if (index !== -1) {
      const [element] = bucket.splice(index, 1);
      this.data.delete(element);
      return true;
    }
    return false;
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    // tslint:disable-next-line:no-any
    thisArg?: any
  ) {
    for (const [key, value] of this.entries()) {
      callbackfn.apply(thisArg, [value, key, this]);
    }
  }

  get(key: K) {
    const code = this.hashCode(key);
    const bucket = this.cache[code] || [];
    const entry = bucket.find(([otherKey]) => this.equals(key, otherKey));
    return entry && entry[1];
  }

  has(key: K) {
    const code = this.hashCode(key);
    const bucket = this.cache[code] || [];
    return bucket.some(([otherKey]) => this.equals(key, otherKey));
  }

  set(key: K, value: V) {
    const code = this.hashCode(key);
    const bucket = this.cache[code] || (this.cache[code] = []);
    const entry = bucket.find(([otherKey]) => this.equals(key, otherKey));
    if (entry) {
      entry[0] = key;
      entry[1] = value;
    } else {
      const item: [K, V] = [key, value];
      bucket.push(item);
      this.data.add(item);
    }
    return this;
  }

  get size() {
    return this.data.size;
  }

  [Symbol.iterator]() {
    return this.entries();
  }

  entries() {
    return this.createIterator<[K, V]>(item => [item[0], item[1]]);
  }

  keys() {
    return this.createIterator(item => item[0]);
  }

  values() {
    return this.createIterator(item => item[1]);
  }

  private *createIterator<T>(projection: (item: [K, V]) => T) {
    for (const item of this.data) {
      yield projection(item);
    }
  }
}
