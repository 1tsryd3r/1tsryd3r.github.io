---
layout: post
title: "Bespoke Padding"
tags: [Cryptography, RSA, Math]
difficulty: Medium
---

## Challenge Description

> Been cooking up my own padding scheme, now my encrypted flag is different everytime!

---

## TL;DR
The challenge implements a custom padding scheme where the ciphertext is calculated as $ct = (a \cdot m + b)^e \bmod n$. Because we are able to request the ciphertext multiple times and the underlying message remains the same, we can apply the Franklin-Reiter Related Message Attack to extract the flag.

## Analysis

- We can see from the provided code that the public exponent is $e = 11$.
- The main focus of the challenge is on the custom padding function:

```python3
def pad(self, flag):
  m = bytes_to_long(flag)
  a = random.randint(2, self.N)
  b = random.randint(2, self.N)
  return (a, b), a*m+b
```

- In this scheme, $a$ and $b$ are random integers smaller than $N$.
- We are given the values $a$, $b$, $e$, and $N$.
- The resulting ciphertext evaluates to $ct = (a \cdot m + b)^e \bmod n$.

## The Exploit

- Since we are able to request the ciphertext multiple times while the message (flag) remains identical every time, we can perform a standard Franklin-Reiter Related Message Attack.
- To perform this attack, we define two polynomial equations.
- Because both of these functions share the exact same root ($m$), they will also share a common polynomial factor of $(x - m)$.
- By taking the greatest common divisor (GCD) of the two equations, we can successfully extract the plaintext $m$.
- We define the two polynomial functions as follows:
  $f_1 = (a_1 \cdot x + b_1)^{11} - c_1$
  $f_2 = (a_2 \cdot x + b_2)^{11} - c_2$

## Solve script

```python3
from pwn import *
from Crypto.Util.number import long_to_bytes as l2b

r = remote('socket.cryptohack.org', '13386')

r.recvline()
r.sendline(b'{"option":"get_flag"}')
data1 = eval(r.recvline().decode())
r.sendline(b'{"option":"get_flag"}')
data2 = eval(r.recvline().decode())

N = int(data1["modulus"])
a1, b1, c1 = int(data1["padding"][0]), int(data1["padding"][1]), int(data1["encrypted_flag"])
a2, b2, c2 = int(data2["padding"][0]), int(data2["padding"][1]), int(data2["encrypted_flag"])

P.<x> = PolynomialRing(Zmod(N))

f1 = (a1*x + b1)**11 - c1
f2 = (a2*x + b2)**11 - c2

def poly_gcd(f, g):
    while g:
        f, g = g, f % g
    return f.monic()

gcd = poly_gcd(f1,f2)
m = -gcd.coefficients()[0] # gcd returns 1 * x^1 - m * x^0, the 0th index returns -m
print(l2b(int(m)))
```

## Flag

<div class="flag">crypto{linear_padding_isnt_padding}</div>

