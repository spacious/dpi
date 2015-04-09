---
title: Documentation Overview
index_button:
    title: View Docs
template: page.html

---

## Documentation Overview

Below is a summary of the currently available documentation and how to use it.

#### More content

How about a code block or two?

##### Javascript:

```js
    var parser = document.createElement('a');
    parser.href = "http://example.com:3000/pathname/?search=test#hash";
    parser.protocol; // => "http:"
    parser.hostname; // => "example.com"
    parser.port;     // => "3000"
    parser.pathname; // => "/pathname/"
    parser.search;   // => "?search=test"
    parser.hash;     // => "#hash"
    parser.host;     // => "example.com:3000"
```

##### Swift:

```swift

    var randomNumbers = [42, 12, 88, 62, 63, 56, 1, 77, 88, 97, 97, 20, 45, 91, 62, 2, 15, 31, 59, 5]

    func partition(v: Int[], left: Int, right: Int) -> Int {
        var i = left
        for j in (left + 1)..(right + 1) {
            if v[j] < v[left] {
                i += 1
                (v[i], v[j]) = (v[j], v[i])
            }
        }
        (v[i], v[left]) = (v[left], v[i])
        return i
    }

    func quicksort(v: Int[], left: Int, right: Int) {
        if right > left {
            let pivotIndex = partition(v, left, right)
            quicksort(v, left, pivotIndex - 1)
            quicksort(v, pivotIndex + 1, right)
        }
    }

    quicksort(randomNumbers, 0, randomNumbers.count-1)
```