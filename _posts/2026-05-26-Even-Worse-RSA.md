---
layout: post
title: "Even Worse RSA"
event: "Daily Alpacahack"
date: 2026-05-26 01:00:00
tags: RSA # pick from: RSA, ECC, AES, Hash, LLL, CRT, XOR, PRNG, DLP, Misc
difficulty: Hard # Easy / Medium / Hard
---

## Handout

> It seems one-p-rsa has been defeated...

**Attachments:** `chal.py`, `output.txt`

---

## Analysis

- The modulus for this encryption is a single prime, so the Euler's Totient Function, `phi = p - 1` is known.
- Now ideally we could find `d` by `d = inverse(e,phi)` but that only works if `gcd(e,phi) = 1` which in this case is not true.
- In this case `gcd(e,phi) = 6`, which means there are 6 possible values of `m` for which `d` exists.
- We simply find the 6 eth roots using Sagemath's `nth_root(e,all=True)` function, then we can check for whichever one decodes to a printable, which will be our flag.

## Script

```python
from Crypto.Util.number import long_to_bytes as l2b
from sage.all import *

p = 8751921425256563367579143227840921849402469143061750238936013324282215699146538047799233649294185141005855739102550788165605861428703197268970229186963997
e = 65538
c = 5947948986109551330433379864390441851954259789762156065124570979131577895849125770689468451948141963015046816934387597958310386264293643862965407787651953

F = GF(p)
c = F(c)
ms = c.nth_root(e, all=True)

for m in ms:
    flag = l2b(int(m)).decode(errors="ignore")
    if flag.isprintable():
        print(flag)
```

## Flag

<div class="flag">Alpaca{sa6em4th_i5_s0_u5efu1^o^}</div>
