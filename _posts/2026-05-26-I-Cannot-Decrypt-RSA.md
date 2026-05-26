---
layout: post
title: "I Cannot Decrypt RSA"
event: "Daily Alpacahack"
date: 2026-05-26 02:00:00
tags: RSA # pick from: RSA, ECC, AES, Hash, LLL, CRT, XOR, PRNG, DLP, Misc
difficulty: Medium # Easy / Medium / Hard
---

## Handout

> I implemented an RSA program, but why cannot I revert to the original data after encrypting and decrypting it?

**Attachments:** `chall.py`, `output.txt`

---

## Analysis

- In this challenge, the Totient function is calculated incorrectly as `phi = (p+1) * (q+1)`. This causes the wrong decryption.
- We have 2 equations in 2 variables for `p` and `q` in `phi` and `n`, so we can find `p` and `q` using Sagemath's `solve()` function.
- Now that we have our primes, we can calculate the real `phi`, fake `phi`, real `d`, and the fake `d`.
- Now since we don't have the ciphertext `c` but instead have the incorectly decrypted `m_fake`, we find a relation between `m_fake` and `m_real` to obtain the flag.

$$m_{\text{fake}} = c^{d_{\text{fake}}} = m_{\text{real}}^{e \cdot d_{\text{fake}}} \bmod n$$

$$m_{\text{real}} = m_{\text{fake}}^{(e \cdot d_{\text{fake}})^{-1}} \bmod n$$

## Script

```python
from Crypto.Util.number import bytes_to_long as b2l, long_to_bytes as l2b
from sage.all import *

n = 121171405093237217063227091172111185824248557962241995647996651518028003422004265461446978461128670887791544521942407383833048111248151442041011392122935068929002416630648052784801292541758655639201511448785066170672299107294278226935064116631227052642961885774807709471051084305123234900517439397737934065023
e = 65537
phi = 121171405093237217063227091172111185824248557962241995647996651518028003422004265461446978461128670887791544521942407383833048111248151442041011392122935091315818127868894450561134101711214249383744038537542940920232549769137343118351526052753080295420884439664114630356220739171908973211717355798463354554088
flag = b'N$\x9d_\x982\xb6\xb0b\x1c=K\x05\xd3]\xe2\x14_g8\xfbDTo\x07\xa3\xd6\xf42X\xc7f)\x0c(\x1e\x9ca\xbbL?\xb3\xaah\xe29R\xf8\xad\xa2\x0b\xc5\x0b\xf5\xc7\xfb\x9d\xd9\x98x\xa7C\xd3-\xe8\x18\xa2\x18\x05\xa5"\x86\xd7\xa9\x80\xdbi\xbe\x16\x81k\xce\x8c@>x\x93\x9eG\x1f\x06\x11R\x03\x95/h6\xe3\x1b\xf5\xaed\x99p(\xed]\xd0\xa1%\xe7uKvX\x05lc\x0e\xf1\xd9\xa5\xad\xbc\xb8>C'
m_fake = b2l(flag)

p, q = var("p, q")
eq1 = p * q == n
eq2 = (p + 1) * (q + 1) == phi

solutions = solve([eq1, eq2], p, q)
p, q = solutions[0][0].rhs(), solutions[0][1].rhs()
assert n == p * q

phi_real = (p - 1) * (q - 1)
phi_fake = (p + 1) * (q + 1)

d_real = inverse_mod(e, phi_real)
d_fake = inverse_mod(e, phi_fake)

D = inverse_mod(e * d_fake, phi_real)
m_real = pow(m_fake, D, n)
print(l2b(m_real).decode())
```

## Flag

<div class="flag">Alpaca{atsumare_alpaca_no_mori}</div>
