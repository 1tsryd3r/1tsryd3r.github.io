---
layout: post
title: "Missing Peace"
event: "B-Sides"
date: 2026-07-07 02:00:00
tags: [Mod math]
difficulty: Hard
---

## Challenge Description

> P says it wants to become like a share, too. <br>
> NOTE: This is a related challenge to 3-peace.

**Attachments:** `chall.py`, `output.txt`

## Analysis of chall.py
- We can see only 2 differences from the previous challenge `3-peace`, we don't know `P` and we are given 10 outputs instead of 3.

```python3
P = getPrime(512)
coeffs = [flag] + [secrets.randbelow(P - 1) + 1 for _ in range(THRESHOLD - 1)]

# f(x) = c0 + c1 * x + c2 * x^2 mod P
f = lambda x: sum(c * pow(x, i, P) for i, c in enumerate(coeffs)) % P

shares = [(x, f(x)) for x in range(1, SHARES + 1)]
```
- Shares are formatted as `flag + num1*x + num2*x^2 mod p` where x goes from 1 to 10.

## The Exploit
- We can take consecutive differences of the outputs, and get -
```python3
a = f(2) - f(1) = num1 + 3 * num2 mod p
b = f(3) - f(2) = num1 + 5 * num2 mod p
c = f(4) - f(3) = num1 + 7 * num2 mod p
d = f(5) - f(4) = num1 + 9 * num2 mod p
```
- Taking further consecutive differences of these we get -
```python3
A = b - a = 2 * num2 mod p
B = c - b = 2 * num2 mod p
C = d - c = 2 * num2 mod p
```
- Taking one final consecutive difference,
```python3
X = B - A = 0 mod p
Y = C - B = 0 mod p
```
- Since these are both `0 mod p`, we know for certain they contain `p` as one of their multiples. We can take their `gcd` to find `p` and solve the rest of the challenge as the previous one.
- Now that we have `p`, this challenge boils down to `n` equations in 3 variables. So we can choose any 3 equations and solve for `flag`, `num1`, and `num2`.

## Solve Script
```python
from sage.all import *
from Crypto.Util.number import long_to_bytes as l2b

shares = [(1, 1099801621986348392830807594329975896291813011076148975005284096250986474695210123947392521349220128564713963933130229991203760047857301878337712873396571), (2, 7742052424920496277250960186097280955408982026332896213554376160402642817316602781571559066485585089422039835093167527503862744445491186930185370976726284), (3, 4231360580905729408620594673888375751364395688786622488247136311646246981335500708619173868932973402683744044254223965324651093813714303799229063896230322), (4, 6263117917838762031579574159116799710145165355420947026483704430790521013280581169343562695167506548262538031643001337043939704363984102534245884200846891), (5, 5989628521771237023807967091075783118757735347744060214564010577431103889887505531618062661951123786202066077146148745866543127990571858110847285606106888), (6, 3410892392703154385305773469765325977202105665755962052488054751567995611156273795442673769283825116502328180763666191792461364693477570529033268112010313), (7, 6374605444582871238392924845892197998471831987948462153955906893605557200351224592944058900403671279119680062608904571616879862578429964813192378003026269), (8, 7033071763462030460749489668749629469573358635829750905267497063139427634208019291995555172072601534097766002568512988544613173539700315938936068994685653), (9, 5386291349340632052375467938337620390506685609399828306422825260169606912726657892597162584290615881436586000642491442575661297577288623906264341086988465), (10, 1434264202218676013270859654656170761271812908658694357421891484696095035907140394748881137057714321136140056830839933710024234691194888715177194279934705)]

f = [share[1] for share in shares]
a = f[1] - f[0]  # num1 + 3 * num2 mod p
b = f[2] - f[1]  # num1 + 5 * num2 mod p
c = f[3] - f[2]  # num1 + 7 * num2 mod p
d = f[4] - f[3]  # num1 + 9 * num2 mod p

A = b - a  # 2*num2 mod p
B = c - b  # 2*num2 mod p
C = d - c  # 2*num2 mod p

X = B - A  # 0 mod p
Y = C - B  # 0 mod p

p = gcd(X, Y)
print(p)
print(p.bit_length())

# AX = B
A = Matrix(GF(p), [[1, 1, 1], [1, 2, 4], [1, 3, 9]])
B = vector(GF(p), [f[0], f[1], f[2]])
X = A.solve_right(B)

print(l2b(int(X[0])))
```

## Flag

<div class="flag">Alpaca{peaceful_prime}</div>
