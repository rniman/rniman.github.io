---
title: Unity 2D | TopDownShooter 01
date: 2025-09-24 23:42:22 +0900
categories: [Project, Project\Unity]
tags: [Unity, C-sharp, 2D, Project History]
author: "rniman"                            # for single entry
# or
# authors: [<author1_id>, <author2_id>]   # for multiple entries
description: "Unity 2D TopDownShooter 개발 기록 - 1편"
math: true
comments: false # 댓글 기능
---

Unity 학습을 위한 2D 슈팅 게임 개발 개인 프로젝트의 첫 번째 개발 기록이다. 프로젝트 초기 설정부터 기본 게임 플레이 구현까지의 과정을 정리했다.

---

## 프로젝트 개요

**프로젝트명:** TopDownShooter  
**목적:** Unity 2D 게임 개발 학습  
**장르:** 탑다운 뷰 슈팅 게임

---

## 개발 환경 설정

### Unity 설정

**Unity 버전:** 6000.0.57f1  
**프로젝트 템플릿:** Universal 2D

초기 Unity 설정에서 버전 관리를 위한 필수 설정을 진행했다.

**Editor 설정 변경:**
- **Edit → Projects Settings → Editor**
  - Version Control: `Visible Meta Files`
  - Asset Serialization: `Force Text`

> 이 설정은 Git과 같은 버전 관리 시스템과의 호환성을 높이고, 협업 시 충돌을 방지하는 데 도움이 된다.
{: .prompt-tip }

### Git 저장소 초기화

```bash
# Git 초기화
git init

# Git LFS 설치 (대용량 파일 관리)
git lfs install

# .gitignore 및 .gitattributes 파일 생성
# Unity 프로젝트에 맞는 설정 적용

# 첫 커밋 및 원격 저장소 연결
git add .
git commit -m "Initial commit"
git remote add origin [repository-url]
git push -u origin main
```

---

## 게임 오브젝트 구성

### Player 오브젝트 설정

플레이어 캐릭터의 기본 구조를 설계했다.

**Player (부모 오브젝트)**
- **Rigidbody 2D:** Gravity Scale = 0 (2D 평면에서 중력 무시)
- **CircleCollider2D:** 충돌 감지용
- **PlayerController:** 플레이어 조작 스크립트

**Sprite (자식 오브젝트)**
- **Sprite Renderer:** 시각적 표현 담당
- 실제 캐릭터 이미지 표시

> 부모-자식 구조로 분리한 이유는 로직과 시각적 요소를 분리하여 관리하기 위함이다. 이렇게 하면 회전, 애니메이션 등을 독립적으로 처리할 수 있다.
{: .prompt-info }

### FirePoint 설정

총알 발사 지점을 위한 빈 오브젝트다.

- **위치:** Player의 자식으로 배치
- **Position:** (0, 1, 0) - 플레이어 위쪽에 위치
- **역할:** 총알 생성 시작점 역할

### Bullet 프리팹

총알 오브젝트를 재사용 가능한 프리팹으로 제작했다.

**구성 요소:**
- **Rigidbody 2D:** 물리적 이동 처리
- **CircleCollider2D:** 충돌 감지
- **Sprite Renderer:** 총알 시각화
- **BulletController:** 총알 동작 스크립트

---

## 핵심 개발 내용

### Header 속성 활용

Unity Inspector에서 변수들을 그룹화하여 가독성을 높였다.

```csharp
public class PlayerController : MonoBehaviour
{
    [Header("Movement Settings")]
    public float moveSpeed = 5f;
    
    [Header("Shooting Settings")]
    public GameObject bulletPrefab;
    public Transform firePoint;
    public float fireRate = 0.1f;
}
```

![Header의 역할](assets/img/Unity/TopDownShooter/Header.png)
*Inspector에서 Header 속성이 적용된 모습*

### Awake()와 Start()의 차이점 이해

Unity의 생명주기 함수들을 올바르게 사용하는 것이 중요하다.

**Awake() 함수의 특징:**
- 게임오브젝트 생성 즉시 실행
- 비활성화 상태에서도 실행됨
- 모든 Start() 함수보다 먼저 실행

**Start() 함수의 특징:**
- 첫 번째 프레임 업데이트 직전 실행
- 활성화 상태일 때만 실행
- 모든 Awake() 완료 후 실행

**권장 사용법:**

```csharp
void Awake()
{
    // 자기 자신의 컴포넌트 참조
    rb = GetComponent<Rigidbody2D>();
    animator = GetComponent<Animator>();
    
    // 내부 변수 초기화
    maxHealth = 100f;
    currentHealth = maxHealth;
}

void Start()
{
    // 다른 오브젝트 참조
    mainCamera = Camera.main;
    gameManager = GameManager.instance;
    
    // 초기 설정 작업
    SetInitialPosition();
    StartCoroutine(SpawnEnemies());
}
```

> **주의사항:** Awake()에서 다른 오브젝트를 참조하면 NullReference 에러가 발생할 수 있다. 다른 오브젝트의 Awake()가 아직 실행되지 않았을 가능성이 있기 때문이다.
{: .prompt-warning }

### Instantiate() 함수 활용

프리팹을 런타임에 생성하기 위해 사용하는 핵심 함수다.

**주요 오버로드:**

```csharp
// 기본 사용법
GameObject obj1 = Instantiate(prefab);

// 위치만 지정
GameObject obj2 = Instantiate(prefab, position);

// 위치 + 회전 지정 (가장 일반적)
GameObject obj3 = Instantiate(prefab, position, rotation);

// 부모까지 지정
GameObject obj4 = Instantiate(prefab, position, rotation, parent);
```

> **성능 최적화 팁:** 매 프레임마다 Instantiate를 호출하는 것은 성능 저하를 일으킨다. 오브젝트 풀링 패턴을 사용하여 미리 생성된 오브젝트를 재사용하는 것이 좋다.
{: .prompt-tip }

### OnBecameInvisible() 함수

화면 밖으로 나간 오브젝트를 자동으로 처리하는 편리한 함수다.

**특징:**
- 모든 활성 카메라 시야에서 벗어날 때 호출
- Renderer 컴포넌트가 필요함
- 자동 메모리 관리에 유용

**사용 예시:**

```csharp
void OnBecameInvisible()a
{
    // 화면 밖으로 나간 총알 제거
    Destroy(gameObject);
    
    // 또는 오브젝트 풀로 반환
    // ObjectPool.ReturnBullet(gameObject);
}
```

---

## 다음 단계 계획

1. **입력 시스템 구현** - 플레이어 이동 및 사격 입력 처리
2. **적 오브젝트 생성** - 기본 AI와 스폰 시스템
3. **충돌 시스템** - 총알과 적의 상호작용
4. **점수 시스템** - 게임 진행도 추적

이번 포스트에서는 Unity 2D 슈팅 게임의 기본 틀을 구성하는 방법을 알아보았다. 다음 편에서는 실제 게임플레이 구현에 대해 다룰 예정이다.
