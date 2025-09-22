---
title: 밑바닥부터 시작하는 딥러닝 1 | 오차역전파법 3
date: 2025-09-22 23:14:25 +0900
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
- 완전한 오차역전파법 구현: 이론에서 실전까지

계층별 구현을 마쳤다면 이제 이들을 조합하여 완전한 신경망을 구현할 차례다. 오차역전파법을 사용하면 수치 미분보다 훨씬 빠르고 정확하게 기울기를 계산할 수 있다. 실제 동작하는 신경망을 구현하고 검증해보자.

---

## 신경망 학습의 전체 그림

오차역전파법을 적용하기 전에 신경망 학습의 전체 과정을 다시 정리해보자:

### 학습 과정의 5단계

#### 1. 전제
신경망에는 적응 가능한 가중치와 편향이 있고, 이 가중치와 편향을 훈련 데이터에 적응하도록 조정하는 과정을 '학습'이라 한다.

#### 2. 미니배치
훈련 데이터 중 일부를 무작위로 가져온다. 이렇게 선별한 데이터를 미니배치라 하며, 미니배치의 손실 함수 값을 줄이는 것이 목표다.

#### 3. 기울기 산출
미니배치의 손실 함수 값을 줄이기 위해 각 가중치 매개변수의 기울기를 구한다. 기울기는 손실 함수의 값을 가장 작게 하는 방향을 제시한다.

#### 4. 매개변수 갱신
가중치 매개변수를 기울기 방향으로 아주 조금 갱신한다.

#### 5. 반복
1~3단계를 반복한다.

**중요한 점**: 오차역전파법이 등장하는 단계는 '기울기 산출'이다. 오차역전파법을 이용하면 느린 수치 미분과 달리 기울기를 효율적이고 빠르게 구할 수 있다.

---

## 오차역전파법을 적용한 신경망 구현

이전 장에서 구현한 각 계층들을 조합하여 완전한 2층 신경망을 구현한다.

```python
import numpy as np
from collections import OrderedDict

class TwoLayerNet:
    def __init__(self, input_size, hidden_size, output_size, weight_init_std=0.01):
        # 가중치 초기화
        self.params = {}
        self.params['W1'] = weight_init_std * np.random.randn(input_size, hidden_size)
        self.params['b1'] = np.zeros(hidden_size)
        self.params['W2'] = weight_init_std * np.random.randn(hidden_size, output_size) 
        self.params['b2'] = np.zeros(output_size)

        # 계층 생성 (순서가 중요하므로 OrderedDict 사용)
        self.layers = OrderedDict()
        self.layers['Affine1'] = Affine(self.params['W1'], self.params['b1'])
        self.layers['Relu1'] = Relu()
        self.layers['Affine2'] = Affine(self.params['W2'], self.params['b2'])

        self.lastLayer = SoftmaxWithLoss()
        
    def predict(self, x):
        # 순전파: 각 계층을 순서대로 통과
        for layer in self.layers.values():
            x = layer.forward(x)
        return x
        
    def loss(self, x, t):
        y = self.predict(x)
        return self.lastLayer.forward(y, t)
    
    def accuracy(self, x, t):
        y = self.predict(x)
        y = np.argmax(y, axis=1)
        if t.ndim != 1: 
            t = np.argmax(t, axis=1)
        
        accuracy = np.sum(y == t) / float(x.shape[0])
        return accuracy
        
    def numerical_gradient(self, x, t):
        # 수치 미분 방식 (비교용)
        loss_W = lambda W: self.loss(x, t)
        
        grads = {}
        grads['W1'] = numerical_gradient(loss_W, self.params['W1'])
        grads['b1'] = numerical_gradient(loss_W, self.params['b1'])
        grads['W2'] = numerical_gradient(loss_W, self.params['W2'])
        grads['b2'] = numerical_gradient(loss_W, self.params['b2'])
        
        return grads
        
    def gradient(self, x, t):
        # 오차역전파법 방식 (효율적)
        
        # 순전파
        self.loss(x, t)

        # 역전파
        dout = 1
        dout = self.lastLayer.backward(dout)
        
        # 계층을 역순으로 통과
        layers = list(self.layers.values())
        layers.reverse()
        for layer in layers:
            dout = layer.backward(dout)

        # 기울기 저장
        grads = {}
        grads['W1'], grads['b1'] = self.layers['Affine1'].dW, self.layers['Affine1'].db
        grads['W2'], grads['b2'] = self.layers['Affine2'].dW, self.layers['Affine2'].db

        return grads
```

### 구현의 핵심 요소

**1. params - 딕셔너리**
- 신경망의 매개변수(가중치, 편향)를 보관한다

**2. layers - OrderedDict**
- 신경망의 계층을 보관하는 **순서가 있는** 딕셔너리
- 순전파 시 추가한 순서대로 `forward()` 호출
- 역전파 시 `layers.reverse()`로 반대 순서로 `backward()` 호출

**3. lastLayer**
- 신경망의 마지막 계층 (SoftmaxWithLoss)
- 손실 계산과 역전파 시작점 역할

---

## 기울기 검증: 구현의 정확성 확인

오차역전파법이 제대로 구현되었는지 확인하려면 **기울기 확인(Gradient Check)**을 수행해야 한다.

### 기울기 확인의 필요성

- **수치 미분**: 느리지만 구현이 쉽고 거의 확실하게 올바른 결과
- **오차역전파법**: 빠르지만 구현이 복잡하여 버그 가능성 존재
- **해결책**: 두 방법으로 구한 기울기를 비교하여 일치함을 확인

```python
# 데이터 읽기
(x_train, t_train), (x_test, t_test) = load_mnist(normalize=True, one_hot_label=True)

network = TwoLayerNet(input_size=784, hidden_size=50, output_size=10)

# 소량의 데이터로 테스트
x_batch = x_train[:3]
t_batch = t_train[:3]

# 두 방식으로 기울기 계산
grad_numerical = network.numerical_gradient(x_batch, t_batch)
grad_backprop = network.gradient(x_batch, t_batch)

# 각 가중치의 절대 오차의 평균을 구한다
for key in grad_numerical.keys():
    diff = np.average(np.abs(grad_backprop[key] - grad_numerical[key]))
    print(f"{key}: {diff}")
```

### 검증 결과 해석

```
W1: 4.3057892579125414e-10
b1: 2.9001505542469284e-09
W2: 5.623646449127339e-09
b2: 1.4047384122028995e-07
```

**결과 분석:**
- 모든 오차가 매우 작다 (10^-7 ~ 10^-10 수준)
- 이는 오차역전파법이 올바르게 구현되었음을 의미한다
- 완전히 0이 아닌 이유는 수치 미분의 근사 오차 때문이다

---

## 오차역전파법을 사용한 실제 학습

이제 검증된 오차역전파법을 사용하여 실제 학습을 수행해보자.

```python
# 데이터 읽기
(x_train, t_train), (x_test, t_test) = load_mnist(normalize=True, one_hot_label=True)

network = TwoLayerNet(input_size=784, hidden_size=50, output_size=10)

# 하이퍼파라미터
iters_num = 10000
train_size = x_train.shape[0]
batch_size = 100
learning_rate = 0.1

train_loss_list = []
train_acc_list = []
test_acc_list = []

iter_per_epoch = max(train_size / batch_size, 1)

for i in range(iters_num):
    # 미니배치 생성
    batch_mask = np.random.choice(train_size, batch_size)
    x_batch = x_train[batch_mask]
    t_batch = t_train[batch_mask]
    
    # 기울기 계산 (오차역전파법 사용)
    grad = network.gradient(x_batch, t_batch)
    
    # 매개변수 갱신
    for key in ('W1', 'b1', 'W2', 'b2'):
        network.params[key] -= learning_rate * grad[key]
    
    # 학습 경과 기록
    loss = network.loss(x_batch, t_batch)
    train_loss_list.append(loss)
    
    # 1에포크마다 정확도 평가
    if i % iter_per_epoch == 0:
        train_acc = network.accuracy(x_train, t_train)
        test_acc = network.accuracy(x_test, t_test)
        train_acc_list.append(train_acc)
        test_acc_list.append(test_acc)
        print(f"Epoch {i//iter_per_epoch}: Train Acc {train_acc:.4f}, Test Acc {test_acc:.4f}")
```

### 성능 비교

**수치 미분 vs 오차역전파법:**
- 수치 미분: 매개변수 하나당 여러 번의 순전파 필요 → 매우 느림
- 오차역전파법: 순전파 1번 + 역전파 1번 → 매우 빠름

---

## 핵심 개념 정리

### 계산 그래프의 힘

**시각적 이해:**
- 계산 과정을 노드와 에지로 시각화
- 복잡한 계산을 단순한 국소 계산으로 분해

**효율적 미분:**
- 역전파를 통해 모든 변수의 미분을 한 번에 계산
- 연쇄법칙을 자동으로 적용

### 계층화의 장점

**모듈성:**
- 각 계층이 독립적으로 동작
- `forward()`와 `backward()` 인터페이스 통일

**확장성:**
- 새로운 계층을 쉽게 추가 가능
- 깊은 신경망으로 확장 용이

**재사용성:**
- 한 번 구현한 계층을 여러 곳에서 사용 가능

### 구현 검증의 중요성

**기울기 확인:**
- 오차역전파법 구현의 정확성 검증
- 수치 미분과의 비교를 통한 디버깅

**점진적 개발:**
- 각 계층을 독립적으로 테스트
- 전체 네트워크 조립 후 최종 검증

---

## 마무리

오차역전파법은 신경망 학습의 핵심 기술이다. 계산 그래프와 연쇄법칙을 바탕으로 효율적인 기울기 계산을 가능하게 한다.

**핵심 포인트:**
- **계산 그래프**: 복잡한 계산의 시각적 표현과 자동 미분
- **계층화**: 모듈화된 신경망 구조와 인터페이스 통일  
- **효율성**: 수치 미분 대비 압도적인 속도 향상
- **검증**: 기울기 확인을 통한 구현 정확성 보장

