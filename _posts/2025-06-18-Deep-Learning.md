---
title: 밑바닥부터 시작하는 딥러닝 1 | NumPy와 Matplotlib 기초 가이드
date: 2025-06-18 20:00:20 +0900
categories: [Study, Study\DeepLearning]
tags: [AI, Deep Learning, Python, Book Note]
author: "rniman"                            # for single entry
# or
# authors: [<author1_id>, <author2_id>]   # for multiple entries
description: "밑바닥부터 시작하는 딥러닝 1 Chapter 1 정리"

comments: false # 댓글 기능
---

## 책 정보 📖 

- 책 제목: 밑바닥부터 시작하는 딥러닝 1
- 글쓴이: 사이토 고키
- 옮긴이: 개앞맵시
- 출판사: 한빛미디어
- 발행일: 2025년 01월 24일 
- 챕터: Chapter 1. 헬로 파이썬

### 책소개
딥러닝 분야 부동의 베스트셀러!
머리로 이해하고 손으로 익히는 가장 쉬운 딥러닝 입문서
이 책은 딥러닝의 핵심 개념을 ‘밑바닥부터’ 구현해보며 기초를 한 걸음씩 탄탄하게 다질 수 있도록 도와주는 친절한 안내서입니다. 라이브러리나 프레임워크에 의존하지 않고 딥러닝의 기본 개념부터 이미지 인식에 활용되는 합성곱 신경망(CNN)까지 딥러닝의 원리를 체계적으로 설명합니다. 또한 복잡한 개념은 계산 그래프를 활용해 시각적으로 전달하여 누구나 쉽게 이해할 수 있습니다. 이 책은 딥러닝에 첫발을 내딛는 입문자는 물론이고 기초를 다시금 다지고 싶은 개발자와 연구자에게도 훌륭한 길잡이가 되어줄 것입니다.

* 출처 : [밑바닥부터 시작하는 딥러닝 1 - 교보문고](https://product.kyobobook.co.kr/detail/S000215599933)

### 주요 내용
- NumPy와 Matplotlib 기초 가이드: 딥러닝을 위한 필수 라이브러리
    
    딥러닝과 데이터 사이언스를 시작하는 개발자라면 반드시 알아야 할 두 가지 파이썬 라이브러리가 있다. 바로 **NumPy**와 **Matplotlib**이다. 이번 포스트에서는 이 두 라이브러리의 기본 사용법과 핵심 기능들을 살펴본다.

---

## NumPy: 수치 계산의 핵심

NumPy(Numerical Python)는 딥러닝 구현에서 배열과 행렬 연산을 편리하게 처리하기 위한 필수 라이브러리다. 고성능의 다차원 배열 객체와 이를 다루는 도구들을 제공한다.

### 배열 생성하기

NumPy의 가장 기본적인 기능은 배열을 생성하는 것이다.

```python
import numpy as np

x = np.array([-3.0, 3.0, 0.1])
print(x)  # [-3.   3.   0.1]
print(type(x))  # <class 'numpy.ndarray'>

```

### 산술 연산: 원소별 계산의 강력함

NumPy 배열의 가장 큰 장점 중 하나는 직관적인 산술 연산이다. 동일한 크기의 배열들은 원소별로 연산이 수행된다.

```python
x = np.array([1.0, 2.0, 3.0])
y = np.array([2.0, 4.0, 6.0])

print(x + y)  # [3. 6. 9.]
print(x - y)  # [-1. -2. -3.]
print(x * y)  # [ 2.  8. 18.]
print(x / y)  # [0.5 0.5 0.5]

```

### 브로드캐스팅: 크기가 다른 배열들의 연산

NumPy의 **브로드캐스팅** 기능을 사용하면 스칼라 값이나 크기가 다른 배열들 간에도 연산이 가능하다.

```python
# 스칼라와 배열의 연산
x = np.array([1.0, 2.0, 3.0])
print(x / 2.0)  # [0.5 1.  1.5]

# 2차원 배열과 1차원 배열의 연산
A = np.array([[1, 2], [3, 4]])
B = np.array([10, 20])
print(A * B)
# [[10 40]
#  [30 80]]

```

### N차원 배열 다루기

NumPy는 다차원 배열을 쉽게 다룰 수 있게 해준다. 1차원 배열을 벡터(Vector), 2차원 배열을 행렬(Matrix), 그리고 이들을 일반화한 것을 텐서(Tensor)라고 한다.

```python
# 2차원 배열 생성
A = np.array([[1, 2], [3, 4]])
print(A)
# [[1 2]
#  [3 4]]

print(A.shape)  # (2, 2)
print(A.dtype)  # dtype('int32')

# 행렬 간 연산
B = np.array([[3, 0], [0, 6]])
print(A + B)
# [[ 4  2]
#  [ 3 10]]

print(A * B)
# [[ 3  0]
#  [ 0 24]]

```

---

## Matplotlib: 데이터 시각화의 강력한 도구

Matplotlib은 파이썬에서 그래프를 그려 데이터를 시각화하기 위한 대표적인 라이브러리다. 과학적 플롯팅부터 간단한 차트까지 다양한 시각화를 지원한다.

### 기본 그래프 그리기

가장 기본적인 sin 함수 그래프를 그려보겠다.

```python
import numpy as np
import matplotlib.pyplot as plt

# 데이터 준비
x = np.arange(0, 6, 0.1)  # 0에서 6까지 0.1 간격으로 생성
y = np.sin(x)

# 그래프 그리기
plt.plot(x, y)
plt.show()

```

![sin 함수 그래프](assets/img/Book/Deep-Learning/sin_graph.png)
_sin 함수 그래프_

### 여러 함수 동시에 그리기

한 그래프에 여러 함수를 표시하고 범례를 추가할 수 있다.

```python
import numpy as np
import matplotlib.pyplot as plt

# 데이터 준비
x = np.arange(0, 6, 0.1)
y1 = np.sin(x)
y2 = np.cos(x)

# 그래프 그리기
plt.plot(x, y1, label="sin")
plt.plot(x, y2, label="cos", linestyle='--')  # cos 함수는 점선으로
plt.xlabel("x")  # x축 레이블
plt.ylabel("y")  # y축 레이블
plt.title('sin & cos')  # 제목
plt.legend()  # 범례 표시
plt.show()

```

![sin 함수와 cos 함수 그래프](assets/img/Book/Deep-Learning/cos_sin_graph.png)
_sin 함수와 cos 함수 그래프_

### 이미지 표시하기

Matplotlib은 수치 그래프뿐만 아니라 이미지도 표시할 수 있다.

```python
import matplotlib.pyplot as plt
from matplotlib.image import imread

# 이미지 읽기 및 표시
img = imread('path/to/your/image.png')
plt.imshow(img)
plt.show()

```

![이미지 표시하기](assets/img/Book/Deep-Learning/matplotlib_image.png)
_이미지 표시하기_

---

## 마무리

NumPy와 Matplotlib은 데이터 사이언스와 딥러닝의 기초가 되는 라이브러리다. NumPy는 효율적인 수치 계산을, Matplotlib은 직관적인 데이터 시각화를 제공한다. 이 두 라이브러리를 잘 활용하면 복잡한 데이터 분석과 머신러닝 프로젝트를 보다 쉽게 구현할 수 있다.
