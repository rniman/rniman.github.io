---
title: 객체 지향 프로그래밍 개인 메모 | 상속과 컴포지션, ECS와 컴포지션
date: 2025-06-02 18:40:20 +0900
categories: [Note, Note\OOP]
tags: [OOP, Inheritance, Composition, ECS, Design Pattern, Note]
author: "rniman"                            # for single entry
# or
# authors: [<author1_id>, <author2_id>]   # for multiple entries
description: "상속과 컴포지션에 관해 정리한 글입니다."
peramlink: /posts/OOP_Inheritance_Composition/

comments: false # 댓글 기능
---

## 상속 (Inheritance) ✅

### 개념  
- 하위 클래스가 상위 클래스의 속성과 메서드를 물려받는 것
- "is-a" 관계

### 예시 (C++)
```cpp
class Animal {
public:
    void Eat() { /* ... */ }
};

class Dog : public Animal {
public:
    void Bark() { /* ... */ }
};
```

### 장점
- 코드 재사용
- 다형성 지원
- 계층 모델링에 유리

### 단점
- 결합도가 높음
- 유연성이 낮음
- 불필요한 기능 상속 가능성

---

## 컴포지션 (Composition) ✅

### 개념  
- 클래스 내부에 다른 클래스를 포함시켜 기능을 구성  
- "has-a" 관계

### 예시 (C++)
```cpp
class Engine {
public:
    void Start() { /* ... */ }
};

class Car {
private:
    Engine engine;
public:
    void StartCar() { engine.Start(); }
};
```

### 장점
- 유연한 구조
- 낮은 결합도
- 부품 조합과 교체 용이

### 단점
- 설계가 조금 복잡할 수 있음
- 코드가 장황해질 수 있음

---

## 선택 기준 요약 ✅

| 상황                      | 추천 방식         |
| ------------------------- | ----------------- |
| 자연스러운 "is-a" 관계    | 상속              |
| 다양한 조합이 필요한 경우 | 컴포지션          |
| 기능 재사용만 원하는 경우 | 컴포지션          |
| 외부 프레임워크 요구      | 상속 (불가피하게) |

---

## 컴포지션 = 부품 조립 방식 ✅

- 마치 레고처럼 객체를 조립한다.
- 예시: 자동차는 엔진과 바퀴를 포함 (`has-a` 관계)

---

## ECS와 컴포지션 ✅

### ECS 구성 요소
- **Entity**: ID만 있는 객체
- **Component**: 데이터 조각
- **System**: 컴포넌트 조합에 동작을 수행

### ECS가 상속보다 컴포지션을 선호하는 이유
- 동적 조합이 가능하다.
- 유연하고 확장성이 있다.
- 캐시 친화적 구조로 성능 최적화가 가능하다.
- 역할 조합이 자유롭고 중복 없이 깔끔하다.

### ECS 예시 (C++ 스타일)
```cpp
struct Position { float x, y; };
struct Velocity { float dx, dy; };
struct Health { float hp; };
struct FlyAbility {};
struct Gun { int ammo; };

// Entity 101 = Player
AddComponent<Position>(101, {0, 0});
AddComponent<Velocity>(101, {1, 0});
AddComponent<Health>(101, {100});
AddComponent<FlyAbility>(101);
AddComponent<Gun>(101, {30});
```

---

## 결론 🔚

> ECS 아키텍처는 상속보다 컴포지션을 중심으로 설계되며, 이 방식이 더 유연하고 유지보수에 강하며 성능에도 유리하다.<br>
> "상속보다는 컴포지션을 선호하라(Favor Composition Over Inheritance)"는 디자인 원칙이 받아들여지고 있다고 한다.
