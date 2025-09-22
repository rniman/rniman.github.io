---
title: 밑바닥부터 시작하는 딥러닝 1 | 오차역전파법 2
date: 2025-09-22 20:44:44 +0900
categories: [Study, Study\DeepLearning]
tags: [AI, Deep Learning, Python, Book Note]
author: "rniman"                            # for single entry
# or
# authors: [<author1_id>, <author2_id>]   # for multiple entries
description: "밑바닥부터 시작하는 딥러닝 1 Chapter 5 정리"
math: true
comments: false # 댓글 기능
---

## 책 정보 📖 

- 책 제목: 밑바닥부터 시작하는 딥러닝 1
- 글쓴이: 사이토 고키
- 옮긴이: 개앞맵시
- 출판사: 한빛미디어
- 발행일: 2025년 01월 24일 
- 챕터: Chapter 5. 오차역전파법

### 책소개
딥러닝 분야 부동의 베스트셀러!
머리로 이해하고 손으로 익히는 가장 쉬운 딥러닝 입문서
이 책은 딥러닝의 핵심 개념을 ‘밑바닥부터’ 구현해보며 기초를 한 걸음씩 탄탄하게 다질 수 있도록 도와주는 친절한 안내서입니다. 라이브러리나 프레임워크에 의존하지 않고 딥러닝의 기본 개념부터 이미지 인식에 활용되는 합성곱 신경망(CNN)까지 딥러닝의 원리를 체계적으로 설명합니다. 또한 복잡한 개념은 계산 그래프를 활용해 시각적으로 전달하여 누구나 쉽게 이해할 수 있습니다. 이 책은 딥러닝에 첫발을 내딛는 입문자는 물론이고 기초를 다시금 다지고 싶은 개발자와 연구자에게도 훌륭한 길잡이가 되어줄 것입니다.

* 출처 : [밑바닥부터 시작하는 딥러닝 1 - 교보문고](https://product.kyobobook.co.kr/detail/S000215599933)

### 주요 내용
- 오차역전파법: 효율적인 기울기 계산의 핵심

계산 그래프와 연쇄법칙의 원리를 이해했다면 이제 실제 신경망의 각 구성 요소를 계층(Layer)으로 구현해보자. 각 계층은 순전파와 역전파를 모두 구현하여 효율적인 기울기 계산을 가능하게 한다.

---

## 단순한 계층 구현하기

### 곱셈 계층(Multiplication Layer)

곱셈 노드의 역전파는 순전파의 입력 신호를 서로 바꾼 값을 곱해서 하류로 보낸다.

```python
class MulLayer:
    def __init__(self):
        self.x = None
        self.y = None

    def forward(self, x, y):
        self.x = x  # 역전파를 위해 순전파 입력 저장
        self.y = y                
        out = x * y
        return out

    def backward(self, dout):
        dx = dout * self.y  # x와 y를 바꾼다
        dy = dout * self.x
        return dx, dy
```

**핵심 포인트:**
- `forward()`: x와 y를 곱한 결과를 반환하며, 입력값을 저장한다
- `backward()`: 상류에서 온 미분(`dout`)에 순전파 때의 값을 서로 바꿔 곱한다
- 곱셈 노드는 **순전파의 입력값이 필요**하므로 반드시 저장해야 한다

### 덧셈 계층(Addition Layer)

덧셈 노드의 역전파는 상류에서 온 미분을 그대로 하류로 전달한다.

```python
class AddLayer:
    def __init__(self):
        pass  # 저장할 값이 없음

    def forward(self, x, y):
        return x + y

    def backward(self, dout):
        dx = dout * 1  # 그대로 전달
        dy = dout * 1  # 그대로 전달
        return dx, dy
```

---

## 활성화 함수 계층 구현하기

### ReLU 계층

ReLU 함수와 그 미분:

$$y = \begin{cases}x & (x > 0) \\0 & (x \leq 0)\end{cases}$$

$$\frac{\partial y}{\partial x} = \begin{cases}1 & (x > 0) \\0 & (x \leq 0)\end{cases}$$

```python
class Relu:
    def __init__(self):
        self.mask = None

    def forward(self, x):
        self.mask = (x <= 0)  # 0 이하인 위치를 True로 표시
        out = x.copy()
        out[self.mask] = 0    # 0 이하인 위치를 0으로 설정
        return out

    def backward(self, dout):
        dout[self.mask] = 0   # 순전파 때 0 이하였던 위치는 0으로
        dx = dout
        return dx
```

**ReLU 역전파의 특징:**
- 순전파에서 x > 0이면 역전파에서 그대로 통과
- 순전파에서 x ≤ 0이면 역전파에서 신호 차단 (0 전달)
- `mask` 배열을 사용하여 효율적인 벡터 연산 수행

### Sigmoid 계층

Sigmoid 함수: $y = \frac{1}{1+\exp(-x)}$

![Sigmoid 계층의 계산 그래프(순전파)](assets/img/Book/Deep-Learning/Sigmoid Forward Propagation.png)
_Sigmoid 계층의 계산 그래프(순전파)_

#### 역전파 과정 분석

![Sigmoid 계층의 계산 그래프](assets/img/Book/Deep-Learning/Sigmoid Forward & Backward Propagation.png)
_Sigmoid 계층의 계산 그래프_

복잡한 계산 그래프를 단계별로 분석하면:

1. **'/' 노드**: $y = \frac{1}{x}$의 미분은 $-\frac{1}{x^2} = -y^2$
2. **'+' 노드**: 상류 값을 그대로 전달
3. **'exp' 노드**: $y = \exp(x)$의 미분은 $\exp(x)$
4. **'×' 노드**: 순전파 입력을 서로 바꿔서 곱함

최종 결과: $\frac{\partial L}{\partial y} y^2 \exp(-x) = \frac{\partial L}{\partial y} y(1-y)$

![Sigmoid 계층의 계산 그래프(간소화 버전)](assets/img/Book/Deep-Learning/Simply Sigmoid Propagation.png)
_Sigmoid 계층의 계산 그래프(간소화 버전)_

```python
class Sigmoid:
    def __init__(self):
        self.out = None

    def forward(self, x):
        out = 1 / (1 + np.exp(-x))
        self.out = out  # 역전파를 위해 출력 저장
        return out

    def backward(self, dout):
        dx = dout * (1.0 - self.out) * self.out  # y(1-y)
        return dx
```

**Sigmoid 역전파의 특징:**
- 복잡한 중간 계산 과정을 간소화할 수 있다
- 순전파의 출력값(`self.out`)만으로 역전파 계산이 가능하다
- `y(1-y)` 형태로 매우 간단하게 표현된다

---

## Affine/Softmax 계층 구현하기

### Affine 계층

신경망의 순전파에서 수행하는 행렬 곱은 기하학에서 **Affine Transformation**이라고 한다.

![Affine 계층의 계산 그래프: 변수가 행렬임에 주의.](assets/img/Book/Deep-Learning/Affine Layer Computatational Graph.png)
_Affine 계층의 계산 그래프: 변수가 행렬임에 주의._

**수식:** $Y = X \cdot W + B$

**역전파 공식:**
- $\frac{\partial L}{\partial X} = \frac{\partial L}{\partial Y} \cdot W^T$
- $\frac{\partial L}{\partial W} = X^T \cdot \frac{\partial L}{\partial Y}$
- $\frac{\partial L}{\partial B} = \frac{\partial L}{\partial Y}$

### 배치용 Affine 계층

```python
class Affine:
    def __init__(self, W, b):
        self.W = W
        self.b = b
        self.x = None
        self.original_x_shape = None
        # 가중치와 편향의 미분
        self.dW = None
        self.db = None

    def forward(self, x):
        # 다차원 입력을 2차원으로 변환
        self.original_x_shape = x.shape
        x = x.reshape(x.shape[0], -1)
        self.x = x

        out = np.dot(self.x, self.W) + self.b
        return out

    def backward(self, dout):
        dx = np.dot(dout, self.W.T)
        self.dW = np.dot(self.x.T, dout)
        self.db = np.sum(dout, axis=0)  # 배치 차원에서 합계
        
        # 원래 입력 형상으로 복원
        dx = dx.reshape(*self.original_x_shape)
        return dx
```

**배치 처리의 핵심:**
- **편향의 역전파**: 각 데이터의 역전파 값이 편향의 원소에 모여야 한다
- `axis=0`으로 배치 차원에서 합계를 구한다
- **형상 변환**: 다차원 입력을 2차원으로 변환 후 원래 형상으로 복원

---

## Softmax-with-Loss 계층

### 추론 vs 학습에서의 Softmax

![image.png](assets/img/Book/Deep-Learning/MNIST Propagation Computatational Graph.png)

**추론 시:**
- Softmax 계층이 불필요하다
- 가장 높은 점수(score)만 알면 되기 때문

**학습 시:**
- Softmax 계층이 필요하다
- 손실 함수 계산을 위해 확률 분포가 필요

### Softmax-with-Loss 계층의 역전파

![간소화한 Softmax-with-Loss 계층의 계산 그래프](assets/img/Book/Deep-Learning/Simply Softmax with Loss Computational Graph.png)
_간소화한 Softmax-with-Loss 계층의 계산 그래프_

**놀라운 결과:**
Softmax 계층의 역전파는 $(y_1 - t_1, y_2 - t_2, y_3 - t_3)$라는 **말끔한** 결과를 낸다.

**의미:**
- $(y_1, y_2, y_3)$: Softmax 계층의 출력
- $(t_1, t_2, t_3)$: 정답 레이블
- **출력과 정답의 차이**가 그대로 역전파된다

### 왜 이렇게 간단할까?

이는 우연이 아니라 **교차 엔트로피 오차**가 그렇게 설계되었기 때문이다. 마찬가지로 회귀에서 항등 함수와 오차제곱합을 사용하는 이유도 같다.

### 구체적인 예시

**예시 1: 큰 오차**
- 정답: (0, 1, 0), 출력: (0.3, 0.2, 0.5)
- 역전파: (0.3, -0.8, 0.5) → 큰 오차 전파

**예시 2: 작은 오차**  
- 정답: (0, 1, 0), 출력: (0.01, 0.99, 0.0)
- 역전파: (0.01, -0.01, 0.0) → 작은 오차 전파

### 구현

```python
class SoftmaxWithLoss:
    def __init__(self):
        self.loss = None  # 손실
        self.y = None     # softmax 출력
        self.t = None     # 정답 레이블
        
    def forward(self, x, t):
        self.t = t
        self.y = softmax(x)
        self.loss = cross_entropy_error(self.y, self.t)
        return self.loss

    def backward(self, dout=1):
        batch_size = self.t.shape[0]
        
        if self.t.size == self.y.size:  # 원-핫 인코딩인 경우
            dx = (self.y - self.t) / batch_size
        else:  # 레이블 형태인 경우
            dx = self.y.copy()
            dx[np.arange(batch_size), self.t] -= 1
            dx = dx / batch_size
        
        return dx
```

---

## 마무리

각 계층의 구현을 통해 오차역전파법의 실제 동작을 이해할 수 있다. 각 계층은 독립적으로 순전파와 역전파를 수행하며, 이들을 조합하여 전체 신경망을 구성한다.

**핵심 포인트:**
- **모듈화**: 각 계층이 독립적으로 구현된다
- **인터페이스 통일**: 모든 계층이 `forward()`와 `backward()` 메서드를 가진다
- **효율성**: 복잡한 계산을 간소화된 형태로 구현한다
- **우아한 설계**: Softmax-with-Loss처럼 수학적으로 아름다운 결과를 보여준다

다음 단계에서는 이러한 계층들을 조합하여 간단한 신경망을 구현하고 예제를 수행해보겠다.
